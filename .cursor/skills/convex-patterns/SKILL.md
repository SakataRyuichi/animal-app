---
name: convex-patterns
description: Convexでの開発パターンとベストプラクティス
---

# Convexパターンスキル

Convexでの開発パターンとベストプラクティスを提供します。

## パッケージ構成

Convexは`packages/backend/`に独立したパッケージとして配置されています。

```
packages/backend/
├── convex/
│   ├── schema.ts          # スキーマ定義
│   ├── users.ts           # ユーザー関連関数
│   ├── pets.ts            # ペット関連関数
│   └── _generated/        # 自動生成された型定義
└── package.json
```

**重要**: `apps/expo`と`apps/admin`の両方から、同じConvex関数を型安全に呼び出せます。

```typescript
// apps/expo/app/home.tsx または apps/admin/app/page.tsx
import { useQuery } from "convex/react";
import { api } from "@repo/backend/convex/_generated/api";

const pets = useQuery(api.pets.getPetsByOwner);
```

## 関数の種類

### Query（読み取り専用）

```typescript
// packages/backend/convex/users.ts
import { query } from "./_generated/server";

export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    
    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();
  },
});
```

### Mutation（書き込み）

```typescript
// packages/backend/convex/pets.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createPet = mutation({
  args: {
    name: v.string(),
    species: v.string(),
    // ...
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    
    const userId = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();
    
    if (!userId) throw new Error("User not found");
    
    return await ctx.db.insert("pets", {
      ownerId: userId._id,
      name: args.name,
      species: args.species,
      // ...
    });
  },
});
```

### Action（外部API呼び出し）

```typescript
// packages/backend/convex/ai.ts
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const chat = action({
  args: {
    petId: v.id("pets"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. ペット情報を取得（Queryを使用）
    const pet = await ctx.runQuery(api.pets.getPetById, { id: args.petId });
    
    // 2. 外部API呼び出し（OpenAIなど）
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: args.message },
        ],
      }),
    });
    
    const data = await response.json();
    
    // 3. 結果を保存（Mutationを使用）
    await ctx.runMutation(api.chat.saveMessage, {
      petId: args.petId,
      message: data.choices[0].message.content,
    });
    
    return data.choices[0].message.content;
  },
});
```

## 認証パターン

すべてのMutationとActionで認証を確認：

```typescript
const identity = await ctx.auth.getUserIdentity();
if (!identity) throw new Error("Not authenticated");
```

## エラーハンドリング ⚠️ **RFC 9457準拠必須**

すべてのエラーは **RFC 9457 (Problem Details for HTTP APIs)** に準拠する必要があります。

詳細は [.cursor/rules/ERROR_HANDLING.md](../../rules/ERROR_HANDLING.md) を参照してください。

### 基本原則

- **ConvexErrorを使用**: `throw new Error()`ではなく、`ConvexError`を使用
- **統一された構造**: RFC 9457準拠のエラーレスポンス構造を渡す
- **エラータイプ**: URI形式で定義（例: `https://api.pet-app.com/errors/premium-required`）
- **拡張フィールド**: `extensions`に`requestId`や`traceId`を含める

### 実装例

```typescript
import { ConvexError } from "convex/values";

// ✅ 良い例: RFC 9457準拠
throw new ConvexError({
  type: "https://api.pet-app.com/errors/authentication-required",
  title: "Authentication Required",
  status: 401,
  detail: "認証が必要です。ログインしてください。",
  instance: "/pets",
  extensions: {
    requestId: ctx.requestId,
  },
});

// ❌ 悪い例: 単純な文字列エラー
throw new Error("Not authenticated");
```

### エラーヘルパー関数の使用

共通のエラーヘルパー関数を使用することで、一貫性を保ちます：

```typescript
import { createError } from "./lib/errors";

// 認証エラー
throw createError(
  "authentication-required",
  "認証が必要です。ログインしてください。",
  "/pets",
  { requestId: ctx.requestId }
);

// プレミアム会員エラー
throw createError(
  "premium-required",
  "この機能はプレミアム会員限定です。",
  "/pets",
  { requestId: ctx.requestId, userId: user._id }
);
```

## インデックスの活用

スキーマ定義（`CONVEX_SCHEMA.md`）を参照して、適切なインデックスを使用：

```typescript
// インデックスを使用したクエリ
await ctx.db
  .query("pets")
  .withIndex("by_owner", (q) => q.eq("ownerId", userId))
  .collect();
```

## ベクトル検索（RAG用）

```typescript
// convex/knowledge.ts
import { action } from "./_generated/server";
import { v } from "convex/values";

export const searchKnowledge = action({
  args: {
    queryEmbedding: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    const results = await ctx.vectorSearch("knowledge_base", "by_embedding", {
      vector: args.queryEmbedding,
      limit: 5,
    });
    
    return results;
  },
});
```

## 使用例

新しいConvex関数を作成する場合：

```
packages/backend/convex/pets.tsに新しいQuery関数を追加してください。
関数名は getPetsByOwner で、ownerIdでペットを検索します。
apps/expoとapps/adminの両方から型安全に呼び出せるようにしてください。
```

Mutation関数を作成する場合：

```
packages/backend/convex/activities.tsに新しいMutation関数を追加してください。
関数名は createActivity で、活動ログを作成します。
認証チェックも含めてください。
```

**重要**: Convex関数は`packages/backend/`に配置し、`apps/expo`と`apps/admin`の両方から同じ関数を型安全に呼び出します。

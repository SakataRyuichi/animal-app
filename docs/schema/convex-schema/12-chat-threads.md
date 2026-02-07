# 12. chat_threads（AIチャットスレッド）

**📚 インデックス**: [CONVEX_SCHEMA_INDEX.md](../CONVEX_SCHEMA_INDEX.md)

### 12. chat_threads（AIチャットスレッド）

**目的**: AI相談の会話スレッドを管理

**主要フィールド**:
- `userId`: ユーザーID
- `petId`: 相談対象のペットID
- `title`: スレッドタイトル（自動生成）
- `createdAt`: 作成日時

**インデックス**:
- `by_user_pet`: ユーザー・ペットでの検索（スレッド一覧）

**使用例**:
```typescript
// チャットスレッド作成（権限チェック付き）
import { getCurrentUser } from "./lib/permissions";
import { api } from "./_generated/api";

export const createThread = mutation({
  args: {
    petId: v.id("pets"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    // ペットアクセス権限チェック
    const hasAccess = await ctx.runQuery(api.pets.checkAccess, {
      petId: args.petId,
      userId: currentUser._id,
    });
    if (!hasAccess) {
      throw new Error("このペットへのアクセス権限がありません");
    }

    // スレッド作成
    const threadId = await ctx.db.insert("chat_threads", {
      userId: currentUser._id, // ✅ 現在のユーザーIDを使用
      petId: args.petId,
  createdAt: Date.now(),
    });

    return threadId;
  },
});
```

---

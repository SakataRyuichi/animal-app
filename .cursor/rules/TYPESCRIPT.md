# TypeScript型安全性ルール（詳細）

このファイルは、`.cursor/rules/PROJECT.md`の「TypeScript - 型安全性の徹底」セクションの詳細版です。

## 基本原則

### 1. `any`の使用は絶対禁止

```typescript
// ❌ 悪い例
const processData = (data: any) => {
  return data.value;
};

// ✅ 良い例
type Data = {
  value: string;
};

const processData = (data: Data): string => {
  return data.value;
};

// ✅ やむを得ない場合: unknownを使用し、型ガードで安全に処理
const processUnknownData = (data: unknown): string => {
  if (typeof data === "object" && data !== null && "value" in data) {
    const value = (data as { value: unknown }).value;
    if (typeof value === "string") {
      return value;
    }
  }
  throw new Error("Invalid data format");
};
```

### 2. `type`の使用を優先

```typescript
// ✅ 良い例: typeを使用
type User = {
  id: string;
  name: string;
  email: string;
};

// 型の合成
type UserWithRole = User & {
  role: "admin" | "user";
};

// 合併型
type PetSpecies = "dog" | "cat" | "reptile" | "other";

// ❌ 悪い例: interfaceを過度に使用（拡張が必要な場合のみ使用）
interface User {
  id: string;
  name: string;
}
```

### 3. 明示的な型定義

```typescript
// ✅ 良い例: 関数の引数と戻り値を明示
const createPet = async (petData: Pet): Promise<Pet> => {
  // ...
  return pet;
};

// ❌ 悪い例: 型推論に頼りすぎる（公開APIは明示的に型を定義）
const createPet = async (petData) => {
  // ...
  return pet;
};
```

### 4. Zodバリデーションの必須化

#### 外部APIのリクエスト/レスポンス

```typescript
import { z } from "zod";

// Zodスキーマで型とバリデーションを同時に定義
const ExternalApiResponseSchema = z.object({
  data: z.array(z.object({
    id: z.string(),
    name: z.string(),
    createdAt: z.number(),
  })),
  meta: z.object({
    total: z.number(),
    page: z.number(),
  }),
});

type ExternalApiResponse = z.infer<typeof ExternalApiResponseSchema>;

// Convex Actionから外部APIを呼び出す場合
export const fetchExternalData = action({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const response = await fetch(args.url);
    const json = await response.json();
    
    // Zodでバリデーション（必須）
    const validatedData = ExternalApiResponseSchema.parse(json);
    
    return validatedData;
  },
});
```

#### フォーム入力

```typescript
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Zodスキーマでフォームの型とバリデーションを定義
const PetFormSchema = z.object({
  name: z.string().min(1, "名前は必須です").max(50, "名前は50文字以内で入力してください"),
  species: z.enum(["dog", "cat", "reptile", "other"]),
  birthDate: z.number().min(0, "無効な日付です"),
});

type PetFormData = z.infer<typeof PetFormSchema>;

// React Hook FormとZodを組み合わせる
const PetForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PetFormData>({
    resolver: zodResolver(PetFormSchema),
  });

  const onSubmit = async (data: PetFormData) => {
    // dataは自動的にバリデーション済み
    await createPet(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* ... */}
    </form>
  );
};
```

#### 環境変数

```typescript
import { z } from "zod";

// 環境変数のスキーマを定義
const EnvSchema = z.object({
  CONVEX_DEPLOYMENT: z.string(),
  CLOUDFLARE_R2_ACCOUNT_ID: z.string(),
  CLOUDFLARE_R2_ACCESS_KEY_ID: z.string(),
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string(),
  DISCORD_WEBHOOK_URL: z.string().url().optional(),
});

type Env = z.infer<typeof EnvSchema>;

// 環境変数をバリデーション
const env = EnvSchema.parse(process.env);
```

### 5. Convex関数での型安全性

Convex関数では`v`スキーマを使用します（Zodは不要ですが、型安全性は同等に確保します）。

```typescript
import { v } from "convex/values";

// Query関数
export const getPetById = query({
  args: {
    petId: v.id("pets"),
  },
  handler: async (ctx, args) => {
    // argsは自動的に型付けされる: { petId: Id<"pets"> }
    const pet = await ctx.db.get(args.petId);
    return pet;
  },
});

// Mutation関数
export const createPet = mutation({
  args: {
    name: v.string(),
    species: v.union(
      v.literal("dog"),
      v.literal("cat"),
      v.literal("reptile"),
      v.literal("other")
    ),
    birthDate: v.number(),
  },
  handler: async (ctx, args) => {
    // argsは自動的に型付けされる
    const petId = await ctx.db.insert("pets", args);
    return petId;
  },
});

// Action関数（外部API呼び出し時はZodでバリデーション）
import { z } from "zod";

const ExternalApiResponseSchema = z.object({
  data: z.array(z.object({
    id: z.string(),
    name: z.string(),
  })),
});

export const fetchExternalData = action({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const response = await fetch(args.url);
    const json = await response.json();
    
    // Zodでバリデーション（必須）
    const validatedData = ExternalApiResponseSchema.parse(json);
    
    return validatedData;
  },
});
```

## 型エラーの対処方法

### 1. 型ガードを使用

```typescript
// 型ガード関数を定義
const isPet = (value: unknown): value is Pet => {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value &&
    "species" in value
  );
};

// 使用例
const processPet = (data: unknown): Pet => {
  if (isPet(data)) {
    return data; // dataはPet型として扱われる
  }
  throw new Error("Invalid pet data");
};
```

### 2. 型アサーション（緊急時のみ）

```typescript
// ❌ 悪い例: 理由なく型アサーションを使用
const pet = data as Pet;

// ✅ 良い例: 理由をコメントで明記
// このデータは既にバリデーション済みであることが保証されている
const pet = data as Pet;
```

### 3. 型定義ファイル（`.d.ts`）の作成

```typescript
// types/pet.d.ts
export type Pet = {
  id: string;
  name: string;
  species: "dog" | "cat" | "reptile" | "other";
  birthDate: number;
};

// 使用例
import type { Pet } from "@/types/pet";
```

## チェックリスト

コードを書く際は、以下のチェックリストを確認してください：

- [ ] `any`を使用していないか？
- [ ] `type`を使用しているか？（拡張が必要な場合のみ`interface`）
- [ ] 関数の引数と戻り値に型が明示されているか？
- [ ] 外部APIのレスポンスをZodでバリデーションしているか？
- [ ] フォーム入力をZodでバリデーションしているか？
- [ ] 環境変数をZodでバリデーションしているか？
- [ ] Convex関数で`v`スキーマを使用しているか？
- [ ] 型エラーを`as any`で無視していないか？

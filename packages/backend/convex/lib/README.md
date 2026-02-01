# Convex共通ライブラリ

このディレクトリには、Convex関数で再利用可能な共通スキーマ定義やヘルパー関数が含まれています。

## ファイル一覧

### `deletionSchema.ts`

Convexのドキュメント指向な特性を最大限に活かした削除機能の共通スキーマ定義です。

**特徴**:
- `isDeleted`フラグではなく、削除に関するコンテキストをまとめた`deletion`オブジェクトを使用
- 型安全性とクエリのシンプル化を実現
- デフォルトで30日間復元可能

**使用方法**:

```typescript
// 1. スキーマ定義でインポート
import { deletionSchema } from "./lib/deletionSchema";

// 2. テーブル定義に追加
pets: defineTable({
  name: v.string(),
  // ... その他のフィールド
  deletion: deletionSchema,
})
  .index("by_owner_active", ["ownerId", "deletion"]), // アクティブなデータのみ取得用

// 3. 削除処理
import { createDeletion } from "./lib/deletionSchema";

await ctx.db.patch(petId, {
  deletion: createDeletion(userId, "誤操作", 30), // 30日間復元可能
});

// 4. 復元処理
await ctx.db.patch(petId, {
  deletion: undefined, // 削除オブジェクトを削除することで復元
});

// 5. アクティブなデータのみ取得
const activePets = await ctx.db
  .query("pets")
  .withIndex("by_owner_active", (q) => 
    q.eq("ownerId", userId).eq("deletion", undefined)
  )
  .collect();

// 6. 復元可能かチェック
import { isRestorable, getRemainingRestorableDays } from "./lib/deletionSchema";

const pet = await ctx.db.get(petId);
if (pet && isRestorable(pet.deletion)) {
  const remainingDays = getRemainingRestorableDays(pet.deletion);
  console.log(`残り${remainingDays}日で復元可能`);
}
```

**詳細**: `CONVEX_SCHEMA.md`の「設計のポイント > 6. 安全な削除機能（論理削除）」を参照してください。

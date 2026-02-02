# 14. albums（アルバム）

**📚 インデックス**: [CONVEX_SCHEMA_INDEX.md](../CONVEX_SCHEMA_INDEX.md)

### 14. albums（アルバム）

**目的**: 日記や写真をテーマ別に整理し、思い出をまとめる

**主要フィールド**:
- `userId`: 作成者
- `petId`: 対象のペット
- `title`: アルバムタイトル（例：「初めてのドッグラン」「5歳の誕生日」）
- `description`: アルバムの説明（オプション）
- `coverImageId`: 表紙画像のID（オプション）
- `isPremium`: プレミアム限定アルバムかどうかのフラグ（作成時のユーザーステータス）
- `createdAt`: 作成日時
- `updatedAt`: 最終更新日時

**インデックス**:
- `by_user_pet`: ユーザー・ペットでの検索
- `by_user`: ユーザーでの検索

**機能制限**:
- **無料ユーザー**: 最大2つまで作成可能、1アルバム20枚まで
- **プレミアムユーザー**: 無制限、共同編集可能

**使用例**:
```typescript
// アルバム作成
const albumId = await ctx.db.insert("albums", {
  userId: userId,
  petId: petId,
  title: "初めてのドッグラン",
  description: "2024年春、初めてドッグランに連れて行った時の思い出",
  coverImageId: imageId,
  isPremium: user.subscription.tier === "premium",
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

// アルバムに活動ログ（日記）を追加
await ctx.db.insert("album_items", {
  albumId: albumId,
  activityId: activityId,
  order: 1,
  addedAt: Date.now(),
});

// アルバムに画像を追加
await ctx.db.insert("album_items", {
  albumId: albumId,
  imageId: imageId,
  order: 2,
  addedAt: Date.now(),
});
```

---

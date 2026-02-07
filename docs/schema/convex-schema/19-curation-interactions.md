# 19. curation_interactions（キュレーションインタラクション）

**📚 インデックス**: [CONVEX_SCHEMA_INDEX.md](../CONVEX_SCHEMA_INDEX.md)

### 19. curation_interactions（キュレーションインタラクション）

**目的**: ユーザーとキュレーションのインタラクション（「あとで読む」「アルバム保存」など）を管理

**主要フィールド**:
- `userId`: ユーザーID
- `curationId`: キュレーションID
- `interactionType`: インタラクションの種類（read_later/saved_to_album/shared/viewed）
- `albumId`: アルバムに保存した場合のアルバムID（オプション）
- `createdAt`: 作成日時

**インデックス**:
- `by_user`: ユーザーでの検索（ユーザーの「あとで読む」一覧など）
- `by_curation`: キュレーションでの検索（この記事を保存したユーザー数など）
- `by_user_curation`: ユーザー・キュレーションでの検索（重複防止）

**使用例**:
```typescript
// ユーザーの「あとで読む」一覧を取得
const readLaterList = await ctx.db
  .query("curation_interactions")
  .withIndex("by_user", (q) => q.eq("userId", userId))
  .filter((q) => q.eq(q.field("interactionType"), "read_later"))
  .order("desc")
  .collect();

// アルバムに保存
await ctx.db.insert("curation_interactions", {
  userId: userId,
  curationId: curationId,
  interactionType: "saved_to_album",
  albumId: albumId,
  createdAt: Date.now(),
});
```

---

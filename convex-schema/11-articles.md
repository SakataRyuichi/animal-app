# 11. articles（コラム・記事）

**📚 インデックス**: [CONVEX_SCHEMA_INDEX.md](../CONVEX_SCHEMA_INDEX.md)

### 11. articles（コラム・記事）

**目的**: 管理者・専門家による信頼できるコラム・記事を管理

**主要フィールド**:
- `authorId`: 投稿者（管理者 or 認定獣医師）
- `title`: 記事タイトル
- `content`: 本文（Markdown形式推奨）
- `thumbnailUrl`: アイキャッチ画像
- `targetSpecies`: 対象種別（配列）
- `tags`: タグ（配列）
- `sources`: 一次ソースのリンク（信頼性の担保）
- `status`: 公開状態（draft/published）
- `isExpertContent`: 専門家による執筆フラグ
- `createdAt`: 作成日時

**インデックス**:
- `by_status_date`: 公開状態・日時での検索（公開記事を新しい順に）
- `by_species`: 種別でのフィルタリング
- `search_content`: 全文検索

**使用例**:
```typescript
// コラム作成（管理者）
await ctx.db.insert("articles", {
  authorId: adminUserId,
  title: "初めて猫を飼う人向けガイド",
  content: "# はじめに\n...",
  thumbnailUrl: "https://example.com/image.jpg",
  targetSpecies: ["Cat"],
  tags: ["初心者", "住環境", "食事"],
  sources: [
    { title: "厚生労働省ガイドライン", url: "https://..." },
  ],
  status: "published",
  isExpertContent: true,
  createdAt: Date.now(),
});
```

---

# 29. news（ニュース・更新情報）

**📚 インデックス**: [CONVEX_SCHEMA_INDEX.md](../CONVEX_SCHEMA_INDEX.md)

### 29. news（ニュース・更新情報）✅ **2026年追加 - 公式サイト**

**目的**: 公式サイトで公開するニュースや更新情報を管理。アプリの成長と開発の活発さを示す。

**主要フィールド**:
- `title`: ニュースのタイトル
- `content`: ニュースの本文（Markdown形式）
- `category`: カテゴリ（feature: 機能追加, bugfix: バグ修正, announcement: お知らせ, update: アップデート）
- `publishedAt`: 公開日時（公開されていない場合はundefined）
- `isPublished`: 公開フラグ
- `imageUrl`: アイキャッチ画像のURL（オプション）
- `createdAt`: 作成日時
- `updatedAt`: 更新日時
- `createdBy`: 作成者（管理者）

**インデックス**:
- `by_published`: 公開状態・公開日時での検索（公開済みニュースの一覧取得用）
- `by_category`: カテゴリ・公開日時での検索（カテゴリ別フィルタリング用）

**使用例**:
```typescript
// ニュースの作成（下書き）
await ctx.db.insert("news", {
  title: "新機能追加：リマインダー機能",
  content: "掃除のタイマーやリマインダー機能を追加しました...",
  category: "feature",
  isPublished: false,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  createdBy: adminUserId,
});

// ニュースの公開
await ctx.db.patch(newsId, {
  isPublished: true,
  publishedAt: Date.now(),
  updatedAt: Date.now(),
});

// 公開済みニュースの取得
const publishedNews = await ctx.db
  .query("news")
  .withIndex("by_published", (q) =>
    q.eq("isPublished", true).neq("publishedAt", undefined)
  )
  .order("desc")
  .collect();
```

---

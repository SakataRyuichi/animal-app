# 33. reaction_types（リアクションタイプマスターデータ）

**📚 インデックス**: [CONVEX_SCHEMA_INDEX.md](../CONVEX_SCHEMA_INDEX.md)

### 33. reaction_types（リアクションタイプマスターデータ）✅ **2026年追加 - 多機能リアクション**

**目的**: 投稿へのリアクションタイプのマスターデータを管理。単なる「いいね」だけでなく、複数のリアクションから選択できる。

**主要フィールド**:
- `reactionId`: リアクションID（例: "heart", "sunflower", "muscle", "star", "rainbow"）
- `name`: リアクション名（例: "大好き", "癒やされた", "応援してる", "キラキラ", "虹の橋"）
- `icon`: アイコン（絵文字: ❤️, 🌻, 💪, 🌟, 🌈）
- `displayOrder`: 表示順序
- `isActive`: 有効/無効

**インデックス**:
- `by_active_order`: 有効なリアクションタイプを表示順序で取得

**使用例**:
```typescript
// リアクションタイプマスターデータの作成
await ctx.db.insert("reaction_types", {
  reactionId: "heart",
  name: "大好き",
  icon: "❤️",
  displayOrder: 1,
  isActive: true,
});

await ctx.db.insert("reaction_types", {
  reactionId: "rainbow",
  name: "虹の橋",
  icon: "🌈",
  displayOrder: 5,
  isActive: true,
});

// 有効なリアクションタイプ一覧を取得
const activeReactions = await ctx.db
  .query("reaction_types")
  .withIndex("by_active_order", (q) => q.eq("isActive", true))
  .order("asc")
  .collect();
```

---

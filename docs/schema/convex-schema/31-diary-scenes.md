# 31. diary_scenes（日記シーンマスターデータ）

**📚 インデックス**: [CONVEX_SCHEMA_INDEX.md](../CONVEX_SCHEMA_INDEX.md)

### 31. diary_scenes（日記シーンマスターデータ）✅ **2026年追加 - 日記の簡単記録**

**目的**: 日記記録時に選択できるシーン（カテゴリ）のマスターデータを管理。テキスト入力なしでシーンを選択するだけで日記を記録できる。

**主要フィールド**:
- `sceneId`: シーンID（例: "walk", "nap", "play", "meal"）
- `name`: シーン名（例: "お散歩", "お昼寝", "遊び", "食事"）
- `icon`: アイコン（絵文字またはアイコン名）
- `displayOrder`: 表示順序
- `isActive`: 有効/無効

**インデックス**:
- `by_active_order`: 有効なシーンを表示順序で取得

**使用例**:
```typescript
// シーンマスターデータの作成
await ctx.db.insert("diary_scenes", {
  sceneId: "walk",
  name: "お散歩",
  icon: "🚶",
  displayOrder: 1,
  isActive: true,
});

await ctx.db.insert("diary_scenes", {
  sceneId: "play",
  name: "遊び",
  icon: "🎾",
  displayOrder: 2,
  isActive: true,
});

// 有効なシーン一覧を取得
const activeScenes = await ctx.db
  .query("diary_scenes")
  .withIndex("by_active_order", (q) => q.eq("isActive", true))
  .order("asc")
  .collect();
```

---

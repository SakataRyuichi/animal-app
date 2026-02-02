# 34. context_stamps（コンテキストスタンプマスターデータ）

**📚 インデックス**: [CONVEX_SCHEMA_INDEX.md](../CONVEX_SCHEMA_INDEX.md)

### 34. context_stamps（コンテキストスタンプマスターデータ）✅ **2026年追加 - シーン+感情のセット**

**目的**: シーンと感情をセットで選択できるコンテキストスタンプのマスターデータを管理。1タップで「遊び + 興奮」などの組み合わせを記録できる。

**主要フィールド**:
- `stampId`: スタンプID（例: "play_excited", "alone_sad"）
- `name`: スタンプ名（例: "遊び + 興奮", "お留守番 + 寂しい"）
- `sceneIds`: シーンIDの配列（diary_scenesのsceneIdを参照）
- `emotionId`: 感情ID（diary_emotionsのemotionIdを参照）
- `icon`: アイコン（絵文字）
- `displayOrder`: 表示順序
- `isActive`: 有効/無効

**インデックス**:
- `by_active_order`: 有効なコンテキストスタンプを表示順序で取得

**使用例**:
```typescript
// コンテキストスタンプマスターデータの作成
await ctx.db.insert("context_stamps", {
  stampId: "play_excited",
  name: "遊び + 興奮",
  sceneIds: ["play"],
  emotionId: "happy",
  icon: "😆",
  displayOrder: 1,
  isActive: true,
});

await ctx.db.insert("context_stamps", {
  stampId: "alone_sad",
  name: "お留守番 + 寂しい",
  sceneIds: ["alone"],
  emotionId: "sad",
  icon: "🥺",
  displayOrder: 2,
  isActive: true,
});

// 有効なコンテキストスタンプ一覧を取得
const activeStamps = await ctx.db
  .query("context_stamps")
  .withIndex("by_active_order", (q) => q.eq("isActive", true))
  .order("asc")
  .collect();
```

---

# 32. diary_emotions（日記感情マスターデータ）

**📚 インデックス**: [CONVEX_SCHEMA_INDEX.md](../CONVEX_SCHEMA_INDEX.md)

### 32. diary_emotions（日記感情マスターデータ）✅ **2026年追加 - 日記の簡単記録**

**目的**: 日記記録時に選択できる感情のマスターデータを管理。顔文字アイコンで感情を選択できる。

**主要フィールド**:
- `emotionId`: 感情ID（例: "happy", "loving", "confused", "sad"）
- `name`: 感情名（例: "楽しい", "愛しい", "混乱", "悲しい"）
- `icon`: アイコン（絵文字: 😊, 🥰, 😵, 😢）
- `displayOrder`: 表示順序
- `isActive`: 有効/無効

**インデックス**:
- `by_active_order`: 有効な感情を表示順序で取得

**使用例**:
```typescript
// 感情マスターデータの作成
await ctx.db.insert("diary_emotions", {
  emotionId: "happy",
  name: "楽しい",
  icon: "😊",
  displayOrder: 1,
  isActive: true,
});

await ctx.db.insert("diary_emotions", {
  emotionId: "loving",
  name: "愛しい",
  icon: "🥰",
  displayOrder: 2,
  isActive: true,
});

// 有効な感情一覧を取得
const activeEmotions = await ctx.db
  .query("diary_emotions")
  .withIndex("by_active_order", (q) => q.eq("isActive", true))
  .order("asc")
  .collect();
```

---

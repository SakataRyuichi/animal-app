# 27. badge_definitions（バッジ定義）

**📚 インデックス**: [CONVEX_SCHEMA_INDEX.md](../CONVEX_SCHEMA_INDEX.md)

### 27. badge_definitions（バッジ定義）✅ **ゲーミフィケーション要素（2026年追加）**

**目的**: バッジの定義を管理。管理者のみが登録可能。バッジは「金で買えない名誉」として設計。

**主要フィールド**:
- `id`: バッジID（例: "health_guardian_30days"）
- `name`: バッジ名（例: "健康の守護者"）
- `description`: バッジの説明（例: "トイレと餌の記録を連続30日達成"）
- `iconUrl`: バッジアイコンのURL（Convex StorageのID）
- `category`: バッジカテゴリ（health/care/social/achievement）
- `condition`: 獲得条件
  - `type`: 条件タイプ（例: "consecutive_days", "total_count"）
  - `value`: 条件値（例: 30日、100件）
  - `activityTypes`: 対象となる活動タイプ（例: ["toilet", "feeding"]）
- `isGlobal`: グローバル表示（他のユーザーにも見える）かどうか

**インデックス**:
- `by_category`: カテゴリでの検索

**使用例**:
```typescript
// バッジ定義の作成（管理者のみ）
await ctx.db.insert("badge_definitions", {
  id: "health_guardian_30days",
  name: "健康の守護者",
  description: "トイレと餌の記録を連続30日達成",
  iconUrl: "storageId_xxx",
  category: "health",
  condition: {
    type: "consecutive_days",
    value: 30,
    activityTypes: ["toilet", "feeding"],
  },
  isGlobal: true, // 他のユーザーにも見える
  createdAt: Date.now(),
});
```

---

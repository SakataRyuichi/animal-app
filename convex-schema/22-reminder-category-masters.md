# 22. reminder_category_masters（リマインダーカテゴリマスターデータ）

**📚 インデックス**: [CONVEX_SCHEMA_INDEX.md](../CONVEX_SCHEMA_INDEX.md)

### 22. reminder_category_masters（リマインダーカテゴリマスターデータ）✅ **2026年追加 - 種別ごとのプリセット**

**目的**: ペットの種類ごとに最適化されたリマインダーカテゴリを管理するマスターデータ。管理者のみが登録可能。

**主要フィールド**:
- `targetSpecies`: 対象種別（空配列の場合は全種共通）
- `categoryId`: カテゴリID（一意の識別子）
- `displayName`: 表示名（日本語）
- `icon`: アイコン（UI表示用）
- `defaultFrequency`: 推奨頻度の初期値
- `defaultTime`: 推奨時間の初期値（HH:MM形式）
- `defaultPoints`: デフォルトのポイント

**インデックス**:
- `by_species`: 種別での検索
- `by_active`: 有効なカテゴリのみ取得

**使用例**:
```typescript
// 犬用のリマインダーカテゴリ（管理者のみ登録）
await ctx.db.insert("reminder_category_masters", {
  targetSpecies: ["Dog"],
  categoryId: "tooth_brushing",
  displayName: "歯磨き",
  icon: "🦷",
  description: "歯の健康を保つために定期的に歯磨きを行います",
  defaultFrequency: "daily",
  defaultTime: "20:00",
  defaultPoints: 5,
  displayOrder: 1,
  isActive: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  createdBy: adminUserId,
});

// 爬虫類用のリマインダーカテゴリ
await ctx.db.insert("reminder_category_masters", {
  targetSpecies: ["Reptile"],
  categoryId: "misting",
  displayName: "霧吹き（加湿）",
  icon: "💧",
  description: "湿度を保つために定期的に霧吹きを行います",
  defaultFrequency: "daily",
  defaultTime: "09:00",
  defaultPoints: 3,
  displayOrder: 2,
  isActive: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  createdBy: adminUserId,
});
```

---

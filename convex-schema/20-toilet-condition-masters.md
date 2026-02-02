# 20. toilet_condition_masters（トイレ記録用マスターデータ）

**📚 インデックス**: [CONVEX_SCHEMA_INDEX.md](../CONVEX_SCHEMA_INDEX.md)

### 20. toilet_condition_masters（トイレ記録用マスターデータ）✅ **2026年追加 - 種別ごとの選択肢**

**目的**: ペットの種類ごとに最適化された選択肢を管理するマスターデータ。管理者のみが登録可能。

**主要フィールド**:
- `targetSpecies`: 対象種別（空配列の場合は全種共通）
- `category`: カテゴリ（general_condition, stool_condition, urine_condition, excretion_color, uric_acid, cecotrope）
- `optionId`: 選択肢のID（一意の識別子）
- `displayName`: 表示名（日本語）
- `icon`: アイコンまたは絵文字（UI表示用）
- `severity`: 異常度（0-5、0が正常、5が最も異常）
- `displayOrder`: 表示順序

**インデックス**:
- `by_species_category`: 種別・カテゴリでの検索
- `by_category`: カテゴリでの検索
- `by_active`: 有効な選択肢のみ取得

**使用例**:
```typescript
// 犬・猫用の便の状態マスターデータ（管理者のみ登録）
await ctx.db.insert("toilet_condition_masters", {
  targetSpecies: ["Dog", "Cat"],
  category: "stool_condition",
  optionId: "stool_hard",
  displayName: "カチカチ（コロコロして硬い）",
  icon: "💩",
  description: "コロコロして硬い便。水分不足の可能性があります。",
  severity: 1, // 注意レベル
  displayOrder: 1,
  isActive: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  createdBy: adminUserId,
});

// うさぎ用の盲腸便マスターデータ
await ctx.db.insert("toilet_condition_masters", {
  targetSpecies: ["Rabbit"],
  category: "cecotrope",
  optionId: "cecotrope_leftover",
  displayName: "食べ残しあり",
  icon: "⚠️",
  description: "栄養過多や肥満、加齢のサインの可能性があります。",
  severity: 2, // 要観察レベル
  displayOrder: 2,
  isActive: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  createdBy: adminUserId,
});
```

---

# 21. cleaning_action_masters（清掃アクションマスターデータ）

**📚 インデックス**: [CONVEX_SCHEMA_INDEX.md](../CONVEX_SCHEMA_INDEX.md)

### 21. cleaning_action_masters（清掃アクションマスターデータ）✅ **2026年追加 - 全種共通**

**目的**: 清掃アクションのマスターデータ。全種共通または種別ごとに定義。管理者のみが登録可能。

**主要フィールド**:
- `actionId`: アクションID（一意の識別子）
- `displayName`: 表示名（日本語）
- `icon`: アイコン（UI表示用）
- `targetSpecies`: 対象種別（空配列の場合は全種共通）
- `points`: 獲得ポイント（清掃アクション実行時に付与）

**インデックス**:
- `by_species`: 種別での検索
- `by_active`: 有効なアクションのみ取得

**使用例**:
```typescript
// 全種共通の清掃アクション
await ctx.db.insert("cleaning_action_masters", {
  actionId: "toilet_partial",
  displayName: "トイレ掃除（部分）",
  icon: "🧹",
  targetSpecies: [], // 全種共通
  points: 5,
  displayOrder: 1,
  isActive: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  createdBy: adminUserId,
});
```

---

# 28. point_history（ポイント獲得履歴）

**📚 インデックス**: [CONVEX_SCHEMA_INDEX.md](../CONVEX_SCHEMA_INDEX.md)

### 28. point_history（ポイント獲得履歴）✅ **ゲーミフィケーション要素（2026年追加）**

**目的**: ポイントの獲得・消費履歴を記録（監査用）。不正防止と透明性の確保。

**主要フィールド**:
- `userId`: ユーザーID
- `points`: 獲得/消費ポイント数（正の値: 獲得、負の値: 消費）
- `reason`: 理由（例: "feeding_logged", "toilet_logged", "journal_created", "asset_purchased"）
- `activityId`: 関連する活動ID（ポイント獲得の場合）
- `assetId`: 関連するアイテムID（ポイント消費の場合）
- `badgeId`: 関連するバッジID（バッジ獲得時のボーナスポイントなど）
- `createdAt`: 獲得/消費日時

**インデックス**:
- `by_user`: ユーザー・日時での検索
- `by_user_reason`: ユーザー・理由での検索

**使用例**:
```typescript
// ポイント獲得履歴の記録
await ctx.db.insert("point_history", {
  userId: userId,
  points: 5, // 5ポイント獲得
  reason: "feeding_logged",
  activityId: activityId,
  createdAt: Date.now(),
});

// ポイント消費履歴の記録
await ctx.db.insert("point_history", {
  userId: userId,
  points: -2000, // 2000ポイント消費
  reason: "asset_purchased",
  assetId: assetId,
  createdAt: Date.now(),
});
```

---

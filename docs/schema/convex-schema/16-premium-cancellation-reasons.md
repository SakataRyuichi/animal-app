# 16. premium_cancellation_reasons（プレミアム解除理由）

**📚 インデックス**: [CONVEX_SCHEMA_INDEX.md](../CONVEX_SCHEMA_INDEX.md)

### 16. premium_cancellation_reasons（プレミアム解除理由）

**目的**: プレミアム解除時の理由を収集し、サービス改善に活用

**主要フィールド**:
- `userId`: ユーザーID
- `reason`: 解除理由（features_sufficient/budget_review/free_satisfied/too_complex）
- `comment`: 自由記述（オプション）
- `createdAt`: 作成日時

**インデックス**:
- `by_user`: ユーザーでの検索
- `by_reason`: 理由別の集計用

**使用例**:
```typescript
// プレミアム解除理由を記録
await ctx.db.insert("premium_cancellation_reasons", {
  userId: userId,
  reason: "free_satisfied",
  comment: "無料版で十分満足しています",
  createdAt: Date.now(),
});
```

---

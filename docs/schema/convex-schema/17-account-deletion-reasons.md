# 17. account_deletion_reasons（退会理由）

**📚 インデックス**: [CONVEX_SCHEMA_INDEX.md](../CONVEX_SCHEMA_INDEX.md)

### 17. account_deletion_reasons（退会理由）

**目的**: アカウント削除時の理由を収集し、サービス改善に活用

**主要フィールド**:
- `userId`: ユーザーID
- `reason`: 退会理由（lifestyle_change/other_method/notifications_issue/usage_confusion）
- `comment`: 自由記述（オプション）
- `createdAt`: 作成日時

**インデックス**:
- `by_user`: ユーザーでの検索
- `by_reason`: 理由別の集計用

**設計思想**: 
- **「お別れ」という項目は含めない**（常に前向きに成長や日々の記録を祝うアプリのスタンス）
- 離脱時も温かく対応し、サービス改善に貢献できるようにする

**使用例**:
```typescript
// 退会理由を記録
await ctx.db.insert("account_deletion_reasons", {
  userId: userId,
  reason: "need_break", // 今は少しアプリ（記録）から離れたい
  comment: "心が落ち着いたらまた戻ってきます",
  createdAt: Date.now(),
});

// 「今は少しアプリ（記録）から離れたい」を選択した際のAIメッセージ
// 「これまで〇〇ちゃんと一緒に歩んできた記録は、私たちが大切に保管しておきます。
// 心が落ち着いたとき、いつでもまた会いに来てくださいね」
```

---

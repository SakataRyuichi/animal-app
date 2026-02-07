# 13. chat_messages（AIチャットメッセージ）

**📚 インデックス**: [CONVEX_SCHEMA_INDEX.md](../CONVEX_SCHEMA_INDEX.md)

### 13. chat_messages（AIチャットメッセージ）

**目的**: AI相談のメッセージ履歴を管理

**主要フィールド**:
- `threadId`: スレッドID
- `role`: メッセージの役割（user/assistant）
- `content`: メッセージ内容
- `citedSources`: 引用した知識ベースのID配列
- `disclaimerShown`: 免責事項を表示したかどうかのフラグ ✅ **免責事項管理**
- `disclaimerType`: 免責事項の種類（general/medical/food/emergency） ✅ **免責事項管理**

**インデックス**:
- `by_thread`: スレッドでの検索（メッセージ一覧）

**免責事項の種類**:
- `general`: 一般的な免責事項（初回利用時など）
- `medical`: 医療・健康に関する免責事項（症状、病気、治療など）
- `food`: 食事・栄養に関する免責事項（フード、サプリメントなど）
- `emergency`: 緊急時の免責事項（誤飲、事故など）

**使用例**:
```typescript
// ユーザーメッセージ作成
await ctx.db.insert("chat_messages", {
  threadId: threadId,
  role: "user",
  content: "最近食欲がないみたい",
});

// AI応答作成（免責事項フラグ付き）
await ctx.db.insert("chat_messages", {
  threadId: threadId,
  role: "assistant",
  content: "ポチくんの記録を見ると...",
  citedSources: [knowledgeId1, knowledgeId2],
  disclaimerShown: true, // ✅ 免責事項を表示
  disclaimerType: "medical", // ✅ 医療に関する免責事項
});
```

---

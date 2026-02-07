# 24. reminder_logs（リマインダー完了履歴）

**📚 インデックス**: [CONVEX_SCHEMA_INDEX.md](../CONVEX_SCHEMA_INDEX.md)

### 24. reminder_logs（リマインダー完了履歴）✅ **2026年追加 - 完了記録とポイント付与**

**目的**: リマインダーの完了履歴を記録。ポイント付与の根拠にもなる。

**主要フィールド**:
- `reminderId`: リマインダーID
- `petId`: ペットID
- `userId`: ユーザーID
- `completedAt`: 完了日時
- `completionMethod`: 完了方法（reminder_notification, manual, auto_from_activity）
- `relatedActivityId`: 関連する活動ログID（トイレ記録などから自動完了した場合）
- `photoId`: 写真ID（photo_requiredの場合）
- `memo`: メモ
- `pointsAwarded`: 付与されたポイント

**インデックス**:
- `by_reminder`: リマインダーでの検索
- `by_pet`: ペットでの検索
- `by_user`: ユーザーでの検索
- `by_completed_at`: 完了日時での検索

**使用例**:
```typescript
// リマインダーを完了
await ctx.db.insert("reminder_logs", {
  reminderId: reminderId,
  petId: petId,
  userId: userId,
  completedAt: Date.now(),
  completionMethod: "reminder_notification",
  pointsAwarded: 10,
});

// トイレ記録から自動完了
await ctx.db.insert("reminder_logs", {
  reminderId: reminderId,
  petId: petId,
  userId: userId,
  completedAt: Date.now(),
  completionMethod: "auto_from_activity",
  relatedActivityId: activityId, // トイレ記録のID
  pointsAwarded: 10,
});

// タイムライン統合用のリマインダー完了記録取得（実装例）
// 活動ログとリマインダー完了記録を時系列で統合
const activities = await ctx.db
  .query("activities")
  .withIndex("by_pet_active", (q) =>
    q.eq("petId", petId).eq("deletion", undefined)
  )
  .filter((q) =>
    q.and(
      q.gte(q.field("loggedAt"), startDate),
      q.lte(q.field("loggedAt"), endDate),
      types.length > 0 ? q.or(...types.map((t) => q.eq(q.field("type"), t))) : q.neq(q.field("type"), "none")
    )
  )
  .order("desc")
  .collect();

const reminderLogs = await ctx.db
  .query("reminder_logs")
  .withIndex("by_pet", (q) => q.eq("petId", petId))
  .filter((q) =>
    q.and(
      q.gte(q.field("completedAt"), startDate),
      q.lte(q.field("completedAt"), endDate)
    )
  )
  .order("desc")
  .collect();

// 活動ログとリマインダー完了記録を統合して時系列でソート
const timelineItems = [
  ...activities.map((a) => ({ ...a, itemType: "activity" })),
  ...reminderLogs.map((r) => {
    const reminder = await ctx.db.get(r.reminderId);
    return {
      id: r._id,
      itemType: "reminder",
      loggedAt: r.completedAt,
      reminderId: r.reminderId,
      reminderTitle: reminder?.categoryId === "custom" ? reminder.customTitle : reminder?.categoryId,
      completedAt: r.completedAt,
      isCompleted: true,
      pointsAwarded: r.pointsAwarded,
    };
  }),
].sort((a, b) => b.loggedAt - a.loggedAt);
```

---

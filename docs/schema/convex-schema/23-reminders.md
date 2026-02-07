# 23. reminders（リマインダー設定）

**📚 インデックス**: [CONVEX_SCHEMA_INDEX.md](../CONVEX_SCHEMA_INDEX.md)

### 23. reminders（リマインダー設定）✅ **2026年追加 - 掃除のタイマー・リマインダー**

**目的**: ユーザーが設定したリマインダーを管理。ペットの種類ごとのプリセットとカスタム設定の両方に対応。

**主要フィールド**:
- `userId`: ユーザーID
- `petId`: ペットID
- `categoryId`: カテゴリID（reminder_category_mastersのcategoryId、または "custom"）
- `customTitle`: カスタム設定時のテキスト
- `customIcon`: カスタム設定時のアイコン
- `schedule`: スケジュール設定
  - `frequency`: 頻度（daily, weekly, biweekly, monthly, interval）
  - `intervalDays`: 間隔日数（frequency: "interval"の時のみ）
  - `daysOfWeek`: 曜日指定（0-6、日曜日=0）
  - `dayOfMonth`: 毎月の日付指定（1-31、frequency: "monthly"の時のみ）
  - `time`: 時間（"20:30"形式）
- `completionRequirement`: 完了条件（check_only, photo_required）
- `rewardPoints`: 完了時に付与するポイント
- `isEnabled`: 有効/無効フラグ
- `lastCompletedAt`: 最後に完了した日時
- `nextNotificationAt`: 次回の通知予定日時（計算済み）

**インデックス**:
- `by_pet_enabled`: ペット・有効状態での検索
- `by_user`: ユーザーでの検索
- `by_next_notification`: 次回通知日時での検索（Cronジョブ用）

**使用例**:
```typescript
// プリセットからリマインダーを作成
await ctx.db.insert("reminders", {
  userId: userId,
  petId: petId,
  categoryId: "cage_wash",
  schedule: {
    frequency: "weekly",
    daysOfWeek: [0, 6], // 日曜日と土曜日
    time: "09:00",
  },
  completionRequirement: "check_only",
  rewardPoints: 10,
  isEnabled: true,
  nextNotificationAt: calculateNextNotificationAt({
    frequency: "weekly",
    daysOfWeek: [0, 6],
    time: "09:00",
  }),
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

// カスタムリマインダーを作成
await ctx.db.insert("reminders", {
  userId: userId,
  petId: petId,
  categoryId: "custom",
  customTitle: "サプリメントの添加",
  customIcon: "💊",
  schedule: {
    frequency: "interval",
    intervalDays: 3, // 3日おき
    time: "20:00",
  },
  completionRequirement: "check_only",
  rewardPoints: 5,
  isEnabled: true,
  nextNotificationAt: calculateNextNotificationAt({
    frequency: "interval",
    intervalDays: 3,
    time: "20:00",
  }),
  createdAt: Date.now(),
  updatedAt: Date.now(),
});
```

---

# 6. activities（活動ログ）

**📚 インデックス**: [CONVEX_SCHEMA_INDEX.md](../CONVEX_SCHEMA_INDEX.md)

### 6. activities（活動ログ）

**目的**: ペットの日常活動を一元管理

**ログタイプ**:
- `food`: 食事
- `toilet`: トイレ
- `walk`: 散歩
- `health`: 健康管理
- `diary`: 日記
- `care`: ケア

**payloadの構造**:
ログタイプによって使用するフィールドが異なる

**トイレ記録（type: "toilet"）のpayload構造** ✅ **2026年更新 - 種別ごとの詳細な状態情報**:
- `toiletType`: "pee"（おしっこ）または"poo"（うんち）
- `generalCondition`: 全種共通の基本的な状態（"excellent" / "unusual" / "abnormal"）
- `stoolCondition`: 便の状態（犬・猫・うさぎ・ハムスター用）
  - `hardness`: 硬さ（"hard", "normal", "soft", "muddy", "watery"）
  - `hasBlood`: 血便あり（boolean）
  - `hasForeignObject`: 異物混入（boolean）
  - `foreignObjectType`: 異物の種類（"toy", "hairball"など）
- `stoolSizeAndCount`: 便の数・大きさ（うさぎ・ハムスター用）
  - `size`: "large"（大きいフンがたっぷり）または"small"（小さいフン）
  - `count`: "plenty"（たっぷり）または"few"（数が少ない）
- `cecotrope`: 盲腸便（うさぎ限定）
  - `status`: "normal"（正常、自分で食べた）または"leftover"（食べ残しあり）
  - `isLinked`: 毛で繋がったフン（boolean、換毛期の毛球症予防）
- `urineCondition`: 尿の状態（犬・猫用）
  - `amount`: "low"（少ない）/ "normal"（普通）/ "high"（多い）
  - `color`: "light"（薄い）/ "normal"（普通）/ "dark"（濃い）/ "bloody"（血尿）
- `excretionColor`: 排泄物の色（鳥類・爬虫類用、"green", "brown", "black"）
- `uricAcid`: 尿酸の状態（鳥類・爬虫類用）
  - `color`: "white"（正常）/ "yellow"（黄色）/ "green"（緑色）
  - `texture`: "normal"（正常）/ "solid"（固形）/ "gritty"（ザラザラ）
- `moistureLevel`: 水分量（鳥類・爬虫類用、"normal" / "polyuria"（多尿））
- `cleaningActions`: 清掃アクションの配列（全種共通、cleaning_action_mastersのactionIdを参照）
- `condition`: 後方互換性のため残す（既存データとの互換性）

**日記記録（type: "diary"）のpayload構造** ✅ **2026年追加 - シーン・感情・タグによる簡単記録**:
- `text`: 日記本文（オプション、テキストなしでも記録可能）
- `scenes`: シーンIDの配列（diary_scenesのsceneIdを参照）
  - 例: `["walk", "play"]`（お散歩と遊び）
  - シーン例: "walk"（お散歩）、"nap"（お昼寝）、"play"（遊び）、"meal"（食事）、"clinic"（通院）、"grooming"（お手入れ）、"alone"（お留守番）
- `emotion`: 感情ID（diary_emotionsのemotionIdを参照）
  - 例: "happy"（楽しい😊）、"loving"（愛しい🥰）、"confused"（混乱😵）、"sad"（悲しい😢）
- `timeOfDay`: 時間帯（オプション）
  - "morning"（朝）、"noon"（昼）、"evening"（夕方）、"night"（夜）、"midnight"（深夜）
- `location`: 場所（オプション）
  - "home"（おうち）、"park"（公園）、"dog_run"（ドッグラン）、"clinic"（病院）、"travel"（旅先）
- `contextStamp`: コンテキストスタンプID（オプション、シーン+感情のセット）
  - 例: "play_excited"（遊び + 興奮😆）、"alone_sad"（お留守番 + 寂しい🥺）
  - コンテキストスタンプを使用すると、`scenes`と`emotion`が自動で設定される

**使用例**:
```typescript
// 日記記録（シーンと感情のみ、テキストなし）
await ctx.db.insert("activities", {
  petId: petId,
  createdBy: userId,
  loggedAt: Date.now(),
  type: "diary",
  payload: {
    scenes: ["walk", "play"],
    emotion: "happy",
    timeOfDay: "evening",
    location: "park",
  },
  isPublic: false,
  likeCount: 0,
});

// 日記記録（コンテキストスタンプ使用）
await ctx.db.insert("activities", {
  petId: petId,
  createdBy: userId,
  loggedAt: Date.now(),
  type: "diary",
  payload: {
    contextStamp: "play_excited", // シーンと感情が自動で設定される
    text: "今日は公園でめちゃくちゃ遊んだ！",
  },
  isPublic: false,
  likeCount: 0,
});

// 日記記録（テキストのみ、従来の形式もサポート）
await ctx.db.insert("activities", {
  petId: petId,
  createdBy: userId,
  loggedAt: Date.now(),
  type: "diary",
  payload: {
    text: "今日はお散歩に行きました。",
  },
  isPublic: false,
  likeCount: 0,
});

// 日記のフィルタリング（シーンと感情で検索）
const diaryActivities = await ctx.db
  .query("activities")
  .withIndex("by_pet_active", (q) => 
    q.eq("petId", petId).eq("deletion", undefined)
  )
  .filter((q) => 
    q.and(
      q.eq(q.field("type"), "diary"),
      q.or(
        // シーンでフィルター
        q.field("payload.scenes").includes("walk"),
        // 感情でフィルター
        q.eq(q.field("payload.emotion"), "happy")
      )
    )
  )
  .order("desc")
  .collect();
```

**インデックス**:
- `by_pet_date`: ペット・日時での検索（タイムライン表示）
- `by_pet_active`: ペット・削除状態での検索（アクティブなログのみ取得）
- `by_public_feed`: 公開フィード用（Phase 3）

**日記フィルタリング** ✅ **2026年追加 - シーン・感情・時間帯・場所での検索**:
- 日記のフィルタリングは`by_pet_active`インデックスを使用し、`filter`でシーン、感情、時間帯、場所を絞り込む
- 例: シーン「お散歩」と感情「楽しい」の日記を検索
  ```typescript
  const diaryActivities = await ctx.db
    .query("activities")
    .withIndex("by_pet_active", (q) => 
      q.eq("petId", petId).eq("deletion", undefined)
    )
    .filter((q) => 
      q.and(
        q.eq(q.field("type"), "diary"),
        q.field("payload.scenes").includes("walk"),
        q.eq(q.field("payload.emotion"), "happy")
      )
    )
    .order("desc")
    .collect();
  ```

**削除機能**:
- `deletion`オブジェクトが存在する場合、データは削除された状態
- デフォルトで30日間復元可能
- 削除日時、削除者、削除理由が記録される

**使用例**:
```typescript
import { createDeletion } from "./lib/deletionSchema";

// 食事記録
await ctx.db.insert("activities", {
  petId: petId,
  createdBy: userId,
  loggedAt: Date.now(),
  type: "food",
  payload: {
    foodId: productId,
    amount: 100,
    text: "朝ごはん",
  },
  isPublic: false,
  likeCount: 0,
});

// 活動ログ削除（論理削除）
await ctx.db.patch(activityId, {
  deletion: createDeletion(userId, "データ整理", 30),
});

// 活動ログ復元
await ctx.db.patch(activityId, {
  deletion: undefined,
});

// アクティブな活動ログのみ取得
const activeActivities = await ctx.db
  .query("activities")
  .withIndex("by_pet_active", (q) => 
    q.eq("petId", petId).eq("deletion", undefined)
  )
  .order("desc")
  .collect();

  // 前回の食事記録を取得（食事記録画面のデフォルト値用）✅ **2026年追加**
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7日前
  const lastFeedingActivity = await ctx.db
    .query("activities")
    .withIndex("by_pet_active", (q) => 
      q.eq("petId", petId).eq("deletion", undefined)
    )
    .filter((q) => 
      q.and(
        q.eq(q.field("type"), "food"),
        q.gte(q.field("loggedAt"), sevenDaysAgo) // 7日以内の記録のみ
      )
    )
    .order("desc")
    .first();

  if (lastFeedingActivity && lastFeedingActivity.payload.foodId) {
    // 商品情報も取得
    const product = await ctx.db.get(lastFeedingActivity.payload.foodId);
    const defaultValues = {
      foodId: lastFeedingActivity.payload.foodId,
      foodName: product?.name,
      amount: lastFeedingActivity.payload.amount,
    };
    // デフォルト値として使用
  }

// リマインダーの作成と完了 ✅ **2026年追加**
// プリセットからリマインダーを作成
const reminderId = await ctx.db.insert("reminders", {
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

// リマインダーを完了
await ctx.db.insert("reminder_logs", {
  reminderId: reminderId,
  petId: petId,
  userId: userId,
  completedAt: Date.now(),
  completionMethod: "reminder_notification",
  pointsAwarded: 10,
});

// 次回の通知日時を更新
await ctx.db.patch(reminderId, {
  lastCompletedAt: Date.now(),
  nextNotificationAt: calculateNextNotificationAt({
    frequency: "weekly",
    daysOfWeek: [0, 6],
    time: "09:00",
    lastCompletedAt: Date.now(),
  }),
  updatedAt: Date.now(),
});

// トイレ記録からリマインダーを自動完了 ✅ **2026年追加**
// ユーザーが「トイレ記録」で「ケージ掃除」を記録した場合
const toiletActivityId = await ctx.db.insert("activities", {
  petId: petId,
  createdBy: userId,
  loggedAt: Date.now(),
  type: "toilet",
  payload: {
    toiletType: "poo",
    cleaningActions: ["cage_full"], // ケージ丸洗いを記録
  },
  isPublic: false,
  likeCount: 0,
});

// 関連するリマインダーを検索して自動完了
const todayReminders = await ctx.db
  .query("reminders")
  .withIndex("by_pet_enabled", (q) => 
    q.eq("petId", petId).eq("isEnabled", true)
  )
  .filter((q) => 
    q.and(
      q.eq(q.field("categoryId"), "cage_wash"), // ケージ掃除のリマインダー
      q.lte(q.field("nextNotificationAt"), Date.now()) // 今日のリマインダー
    )
  )
  .collect();

for (const reminder of todayReminders) {
  // リマインダーを自動完了
  await ctx.db.insert("reminder_logs", {
    reminderId: reminder._id,
    petId: petId,
    userId: userId,
    completedAt: Date.now(),
    completionMethod: "auto_from_activity",
    relatedActivityId: toiletActivityId,
    pointsAwarded: reminder.rewardPoints,
  });

  // 次回の通知日時を更新
  await ctx.db.patch(reminder._id, {
    lastCompletedAt: Date.now(),
    nextNotificationAt: calculateNextNotificationAt({
      frequency: reminder.schedule.frequency,
      daysOfWeek: reminder.schedule.daysOfWeek,
      time: reminder.schedule.time,
      lastCompletedAt: Date.now(),
    }),
    updatedAt: Date.now(),
  });
}
```

---

# Convexスキーマレビュー結果

**📚 ドキュメントインデックス**: [DOCUMENTATION_INDEX.md](../../DOCUMENTATION_INDEX.md)

**レビュー日**: 2026年2月1日  
**対象**: `CONVEX_SCHEMA.md`  
**比較対象**: `USER_STORIES.md`

**関連ドキュメント**:
- [CONVEX_SCHEMA.md](../schema/CONVEX_SCHEMA.md): レビュー対象のスキーマ
- [USER_STORIES.md](../stories/USER_STORIES.md): ユーザーストーリーとの整合性確認

## 総合評価

✅ **良好**: スキーマはユーザーストーリーの大部分を満たしており、将来の拡張性も考慮されています。  
⚠️ **改善推奨**: いくつかの重要な機能要件が不足しており、追加のフィールドやテーブルが必要です。

---

## 1. ✅ 満たされている要件

### 1.1 基本機能（Phase 1）

#### 認証・ユーザー管理
- ✅ **US-001, US-002**: `users`テーブルで認証情報を管理
- ✅ **US-003**: プロフィール編集に対応（`name`, `email`, `location`）
- ✅ **US-019**: プレミアム機能（`isPremium`）

#### ペット管理
- ✅ **US-004**: ペット登録に必要な全フィールドが揃っている
  - `name`, `species`, `breed`, `gender`, `birthDate`, `photoUrl`
- ✅ **US-005**: ペット一覧表示（`by_owner`インデックス）
- ✅ **US-006**: プロフィール編集に対応
- ✅ **US-007**: ペット削除に対応（論理削除の検討が必要）

#### 活動ログ記録
- ✅ **US-008**: 食事記録（`payload.foodId`, `payload.amount`）
- ✅ **US-009**: トイレ記録（`payload.toiletType`, `payload.condition`）
- ✅ **US-010**: 散歩記録（`payload.durationMin`, `payload.distanceKm`）
- ✅ **US-011**: 日記投稿（`type: "diary"`, `payload.text`, `payload.images`）
- ✅ **US-012**: ケア記録（`payload.careType`, `payload.clinicName`）
- ✅ **US-013**: タイムライン表示（`by_pet_date`インデックス）

### 1.2 コラム・記事機能（Phase 1後半）

- ✅ **US-026**: コラム一覧表示（`articles`テーブル、`by_status_date`インデックス）
- ✅ **US-027**: コラム詳細表示（`articles`テーブル）
- ✅ **US-028**: レコメンドコラム表示（`targetSpecies`, `tags`でフィルタリング可能）
- ✅ **US-029**: コラム検索（`search_content`検索インデックス）
- ✅ **US-030**: コラム投稿（`status: "draft"`で下書き保存可能）

### 1.3 AI相談機能（Phase 1後半）

- ✅ **US-020**: AI相談の開始（`chat_threads`テーブル）
- ✅ **US-021**: ペットのカルテ情報を活用（`pets`, `activities`テーブルを参照）
- ✅ **US-022**: 信頼できる知識ベースからの回答（`knowledge_base`テーブル、`citedSources`）
- ✅ **US-024**: チャット履歴の表示（`chat_messages`テーブル、`by_thread`インデックス）

### 1.4 共同管理（Phase 2）

- ✅ **US-033**: 共同管理者の追加（`pet_members`テーブル）
- ✅ **US-034**: 共同管理者一覧表示（`by_pet`インデックス）
- ✅ **US-035**: 権限の変更（`role`フィールド）
- ✅ **US-036**: 共同管理者の削除
- ✅ **US-037**: 共有ペット一覧表示（`by_user`インデックス）
- ✅ **US-038**: 共有ペットへの記録（`createdBy`フィールドで記録者を識別）

### 1.5 SNS機能（Phase 3）

- ✅ **US-039**: フォロー中・おすすめタブ切り替え（`follows`テーブル、`by_follower`インデックス）
- ✅ **US-040**: フォロー機能（`follows`テーブル）
- ✅ **US-041**: グローバルフィード表示（`by_public_feed`インデックス）
- ✅ **US-042**: いいね機能（`likes`テーブル）
- ✅ **US-043**: 種別フィルター（`activities`の`petId`から`pets.species`を参照）

### 1.6 商品データベース（Phase 3）

- ✅ **US-044**: 商品検索（`search_name`検索インデックス）
- ✅ **US-045**: 商品詳細表示（`products`テーブル）
- ✅ **US-046**: 商品登録（`isVerified: false`でユーザー投稿）
- ✅ **US-047**: 商品承認（`isVerified: true`に更新）
- ✅ **US-048**: レビュー投稿（`reviews`テーブル）
- ✅ **US-049**: レビュー一覧表示（`by_product`インデックス）
- ✅ **US-050**: 種別ごとの人気商品ランキング（`by_species_product`インデックス）

---

## 2. ⚠️ 不足している要件・改善推奨

### 2.1 重要度: 最高

#### ❌ **US-023: 緊急度の判定と病院案内**

**問題**: 緊急度判定と病院案内機能に必要なデータ構造が不足しています。

**不足している要素**:
- 病院情報を保存するテーブルがない
- 緊急度判定の履歴を保存するテーブルがない
- ユーザーの現在地情報が`users.location`に大まかな地域しかない（詳細な位置情報が必要）

**推奨追加**:
```typescript
// 病院情報テーブル
clinics: defineTable({
  name: v.string(),
  address: v.string(),
  latitude: v.number(), // 緯度
  longitude: v.number(), // 経度
  phoneNumber: v.string(),
  isEmergency: v.boolean(), // 24時間対応可能か
  specialties: v.array(v.string()), // 診療科目
  rating: v.optional(v.number()),
  reviewCount: v.number(),
  createdAt: v.number(),
})
  .index("by_location", ["latitude", "longitude"]) // 位置情報での検索
  .index("by_emergency", ["isEmergency"]),

// 緊急度判定履歴
emergency_assessments: defineTable({
  userId: v.id("users"),
  petId: v.id("pets"),
  threadId: v.id("chat_threads"), // 関連するチャットスレッド
  riskLevel: v.union(
    v.literal("low"),
    v.literal("medium"),
    v.literal("high"),
    v.literal("critical")
  ),
  reason: v.string(), // 判定理由
  recommendedAction: v.string(), // 推奨アクション
  clinicId: v.optional(v.id("clinics")), // 推奨病院
  assessedAt: v.number(),
})
  .index("by_user_pet", ["userId", "petId"])
  .index("by_thread", ["threadId"]),
```

#### ❌ **US-027: コラム詳細表示の「AI相談ボタン」連動**

**問題**: コラムとAI相談の連動を実現するためのデータ構造が不足しています。

**不足している要素**:
- コラムからAI相談を開始した際のコンテキスト情報を保存するテーブルがない
- コラムのトピックとAI相談の関連性を追跡する仕組みがない

**推奨追加**:
```typescript
// chat_threadsテーブルに追加
chat_threads: defineTable({
  // ... 既存フィールド
  relatedArticleId: v.optional(v.id("articles")), // 関連するコラムID
  contextFromArticle: v.optional(v.string()), // コラムからのコンテキスト情報
}),
```

#### ❌ **US-016: 今日のサマリー表示**

**問題**: ダッシュボードの統計情報を効率的に取得するためのデータ構造が不足しています。

**不足している要素**:
- 日次統計情報をキャッシュするテーブルがない（毎回集計すると重い）
- 目標値や設定値を保存するテーブルがない

**推奨追加**:
```typescript
// 日次統計情報（非正規化して高速表示）
daily_stats: defineTable({
  petId: v.id("pets"),
  date: v.number(), // 日付（タイムスタンプ、日付のみ）
  foodCount: v.number(), // 食事回数
  toiletCount: v.number(), // トイレ回数
  walkCount: v.number(), // 散歩回数
  walkDurationMin: v.number(), // 散歩時間（分）
  lastUpdatedAt: v.number(),
})
  .index("by_pet_date", ["petId", "date"]),

// ペットの目標設定
pet_goals: defineTable({
  petId: v.id("pets"),
  dailyFoodCount: v.optional(v.number()), // 1日の目標食事回数
  dailyWalkDurationMin: v.optional(v.number()), // 1日の目標散歩時間（分）
  targetWeight: v.optional(v.number()), // 目標体重
  createdAt: v.number(),
})
  .index("by_pet", ["petId"]),
```

### 2.2 重要度: 高

#### ⚠️ **US-017: 体重推移グラフ**

**問題**: 体重記録が`pets.weight`に最新値しか保存されていません。履歴を追跡するテーブルが必要です。

**推奨追加**:
```typescript
// 体重記録履歴
weight_records: defineTable({
  petId: v.id("pets"),
  weight: v.number(), // 体重(g)
  recordedAt: v.number(),
  recordedBy: v.id("users"), // 記録者
  notes: v.optional(v.string()), // メモ
})
  .index("by_pet_date", ["petId", "recordedAt"]),
```

**注意**: `activities`テーブルの`type: "health"`で体重を記録することも可能ですが、専用テーブルの方が統計処理が効率的です。

#### ⚠️ **US-042: いいね機能の「専門家のいいね」**

**問題**: 専門家（獣医師など）が「いいね」した投稿を識別する仕組みが不足しています。

**現状**: `likes`テーブルには`userId`しかなく、専門家かどうかは`users.isExpert`を参照する必要があります。

**推奨改善**:
```typescript
// likesテーブルに追加（非正規化）
likes: defineTable({
  // ... 既存フィールド
  isExpertLike: v.boolean(), // 専門家のいいねかどうか（非正規化）
})
  .index("by_expert_likes", ["isExpertLike", "activityId"]), // 専門家のいいねでフィルタリング
```

**または、既存の`likes`テーブルで`users.isExpert`をJOINして判定することも可能ですが、パフォーマンスを考慮すると非正規化が推奨されます。**

#### ⚠️ **US-025: 推奨アクションの表示**

**問題**: AIから推奨されるアクションを保存・管理するテーブルが不足しています。

**推奨追加**:
```typescript
// 推奨アクション
recommended_actions: defineTable({
  threadId: v.id("chat_threads"),
  actionType: v.union(
    v.literal("monitor"), // 様子を見る
    v.literal("clinic"), // 病院を受診する
    v.literal("record"), // 記録を続ける
    v.literal("change_food"), // フードを変更する
    v.literal("other")
  ),
  title: v.string(),
  description: v.string(),
  priority: v.union(
    v.literal("low"),
    v.literal("medium"),
    v.literal("high")
  ),
  isCompleted: v.boolean(),
  completedAt: v.optional(v.number()),
  createdAt: v.number(),
})
  .index("by_thread", ["threadId"])
  .index("by_user_pending", ["userId", "isCompleted"]), // ユーザーの未完了アクション
```

### 2.3 重要度: 中

#### ⚠️ **US-028: レコメンドコラム表示の「既読」機能**

**問題**: ユーザーがコラムを読んだかどうかを追跡するテーブルが不足しています。

**推奨追加**:
```typescript
// コラムの既読状態
article_reads: defineTable({
  userId: v.id("users"),
  articleId: v.id("articles"),
  readAt: v.number(),
})
  .index("by_user_article", ["userId", "articleId"])
  .index("by_user", ["userId"]), // ユーザーが読んだコラム一覧
```

#### ⚠️ **US-031: AI執筆サポート（管理者）**

**問題**: AIが生成した下書きを保存・管理するテーブルが不足しています。

**推奨改善**:
`articles`テーブルの`status: "draft"`で対応可能ですが、AI生成の下書きと手動の下書きを区別するフィールドがあると良いです。

**推奨追加**:
```typescript
// articlesテーブルに追加
articles: defineTable({
  // ... 既存フィールド
  isAIGenerated: v.optional(v.boolean()), // AI生成の下書きかどうか
  aiGenerationPrompt: v.optional(v.string()), // AI生成時のプロンプト（参考用）
}),
```

#### ⚠️ **US-032: 記事の信頼性チェック（管理者）**

**問題**: 記事の信頼性チェック結果を保存するテーブルが不足しています。

**推奨追加**:
```typescript
// 記事の信頼性チェック結果
article_verifications: defineTable({
  articleId: v.id("articles"),
  checkedBy: v.id("users"), // チェックした管理者
  issues: v.array(
    v.object({
      severity: v.union(
        v.literal("error"),
        v.literal("warning"),
        v.literal("info")
      ),
      description: v.string(),
      suggestion: v.optional(v.string()),
    })
  ),
  isApproved: v.boolean(),
  checkedAt: v.number(),
})
  .index("by_article", ["articleId"])
  .index("by_pending", ["isApproved"]), // 未承認の記事
```

### 2.4 重要度: 低（将来の拡張性）

#### 💡 **通知機能**

**問題**: プッシュ通知やアプリ内通知を管理するテーブルが不足しています。

**推奨追加**:
```typescript
// 通知
notifications: defineTable({
  userId: v.id("users"),
  type: v.union(
    v.literal("new_article"), // 新しいコラム
    v.literal("new_follower"), // フォローされた
    v.literal("new_like"), // いいねされた
    v.literal("reminder"), // リマインダー
    v.literal("emergency"), // 緊急通知
  ),
  title: v.string(),
  body: v.string(),
  relatedId: v.optional(v.id("articles") | v.id("activities") | v.id("users")), // 関連ID（型安全にするにはunion型が必要）
  isRead: v.boolean(),
  createdAt: v.number(),
})
  .index("by_user_unread", ["userId", "isRead"])
  .index("by_user_date", ["userId", "createdAt"]),
```

#### 💡 **リマインダー機能**

**問題**: 食事時間のリマインダーなど、リマインダー機能に必要なテーブルが不足しています。

**推奨追加**:
```typescript
// リマインダー設定
reminders: defineTable({
  petId: v.id("pets"),
  userId: v.id("users"), // 設定者
  type: v.union(
    v.literal("food"),
    v.literal("toilet"),
    v.literal("walk"),
    v.literal("care"),
  ),
  time: v.string(), // "09:00"形式
  daysOfWeek: v.array(v.number()), // [0,1,2,3,4,5,6] (日曜日=0)
  isEnabled: v.boolean(),
  createdAt: v.number(),
})
  .index("by_pet", ["petId"])
  .index("by_user", ["userId"]),
```

#### 💡 **「信頼できる飼い主の証」機能（US-042）**

**問題**: 一定期間以上記録を続けているユーザーや、専門家から「いいね」を受けたユーザーに特別なバッジを表示する機能に必要なデータ構造が不足しています。

**推奨追加**:
```typescript
// ユーザーバッジ
user_badges: defineTable({
  userId: v.id("users"),
  badgeType: v.union(
    v.literal("trusted_owner"), // 信頼できる飼い主
    v.literal("expert_liked"), // 専門家からいいねを受けた
    v.literal("long_term_user"), // 長期ユーザー
    v.literal("premium"), // プレミアム会員
  ),
  earnedAt: v.number(),
  expiresAt: v.optional(v.number()), // 有効期限（オプション）
})
  .index("by_user", ["userId"])
  .index("by_type", ["badgeType"]),
```

---

## 3. 🔍 設計上の改善点

### 3.1 パフォーマンス最適化

#### ⚠️ **activitiesテーブルの`likeCount`**

**現状**: `activities.likeCount`は非正規化されていますが、`likes`テーブルから集計することも可能です。

**推奨**: 
- 非正規化を維持（パフォーマンス重視）
- `likes`テーブルへの追加・削除時に`likeCount`を更新するmutationを実装
- 定期的に整合性チェックを行う関数を実装

#### ⚠️ **productsテーブルの`averageRating`と`reviewCount`**

**現状**: 非正規化されていますが、`reviews`テーブルから集計することも可能です。

**推奨**: 
- 非正規化を維持
- `reviews`テーブルへの追加・更新・削除時に`averageRating`と`reviewCount`を更新するmutationを実装

### 3.2 データ整合性

#### ⚠️ **外部キー制約**

**現状**: Convexでは外部キー制約が自動的にチェックされません。

**推奨**: 
- アプリケーション側で整合性チェックを実装
- mutation関数で`petId`や`userId`が存在することを確認
- 必要に応じて、整合性チェック用のquery関数を実装

#### ⚠️ **論理削除**

**現状**: ペットや活動ログの削除が物理削除になっています。

**推奨**: 
- 重要なデータ（`pets`, `activities`）は論理削除を検討
- `deletedAt`フィールドを追加
- 削除されたデータをフィルタリングするインデックスを追加

### 3.3 セキュリティ

#### ⚠️ **公開設定の粒度**

**現状**: `pets.visibility`と`activities.isPublic`で公開設定を管理していますが、より細かい制御が必要な場合があります。

**推奨**: 
- 現状の設計で十分ですが、将来的に「特定のユーザーにのみ公開」などの機能が必要な場合は、`shared_with`テーブルを追加

### 3.4 拡張性

#### ✅ **柔軟なpayload構造**

**現状**: `activities.payload`は柔軟な構造になっており、新しいログタイプに対応しやすいです。

**評価**: 良好。この設計を維持してください。

#### ✅ **string型のspeciesとbreed**

**現状**: `pets.species`と`pets.breed`はstring型で、あらゆるペットに対応できます。

**評価**: 良好。この設計を維持してください。

---

## 4. 📊 優先度別の実装推奨

### 最高優先度（Phase 1で必須）

1. **緊急度判定と病院案内**（US-023）
   - `clinics`テーブルの追加
   - `emergency_assessments`テーブルの追加
   - `users.location`の拡張（緯度・経度の追加）

2. **コラムとAI相談の連動**（US-027）
   - `chat_threads.relatedArticleId`の追加
   - `chat_threads.contextFromArticle`の追加

3. **今日のサマリー表示**（US-016）
   - `daily_stats`テーブルの追加
   - `pet_goals`テーブルの追加

### 高優先度（Phase 1後半 / Phase 2）

4. **体重推移グラフ**（US-017）
   - `weight_records`テーブルの追加

5. **専門家のいいね機能**（US-042）
   - `likes.isExpertLike`の追加（非正規化）

6. **推奨アクションの表示**（US-025）
   - `recommended_actions`テーブルの追加

### 中優先度（Phase 2 / Phase 3）

7. **コラムの既読機能**（US-028）
   - `article_reads`テーブルの追加

8. **AI執筆サポート**（US-031）
   - `articles.isAIGenerated`の追加
   - `articles.aiGenerationPrompt`の追加

9. **記事の信頼性チェック**（US-032）
   - `article_verifications`テーブルの追加

### 低優先度（将来の拡張）

10. **通知機能**
    - `notifications`テーブルの追加

11. **リマインダー機能**
    - `reminders`テーブルの追加

12. **信頼できる飼い主の証**
    - `user_badges`テーブルの追加

---

## 5. ✅ 総合評価と推奨事項

### 総合評価

**スコア**: 85/100

**評価理由**:
- ✅ ユーザーストーリーの大部分（約90%）を満たしている
- ✅ 将来の拡張性を考慮した設計になっている
- ✅ 柔軟性とパフォーマンスのバランスが取れている
- ⚠️ いくつかの重要な機能要件が不足している（緊急度判定、ダッシュボード統計など）

### 推奨事項

1. **Phase 1の実装前に追加すべきテーブル**:
   - `clinics`（病院情報）
   - `emergency_assessments`（緊急度判定履歴）
   - `daily_stats`（日次統計）
   - `pet_goals`（目標設定）
   - `weight_records`（体重記録履歴）

2. **Phase 1後半で追加すべきテーブル**:
   - `recommended_actions`（推奨アクション）
   - `article_reads`（コラム既読状態）

3. **Phase 2で追加すべきテーブル**:
   - `notifications`（通知）
   - `reminders`（リマインダー）

4. **Phase 3で追加すべきテーブル**:
   - `user_badges`（ユーザーバッジ）

5. **既存テーブルの拡張**:
   - `chat_threads`に`relatedArticleId`と`contextFromArticle`を追加
   - `likes`に`isExpertLike`を追加（非正規化）
   - `articles`に`isAIGenerated`と`aiGenerationPrompt`を追加

### 次のステップ

1. このレビュー結果を基に、`CONVEX_SCHEMA.md`を更新
2. 追加すべきテーブルの詳細設計を作成
3. 既存テーブルの拡張を実装
4. データ整合性チェック関数の実装
5. パフォーマンステストの実施

---

## 6. 📝 補足: 設計の良い点

### 6.1 柔軟性

- ✅ `activities.payload`の柔軟な構造により、新しいログタイプに対応しやすい
- ✅ `pets.species`と`pets.breed`をstring型にすることで、あらゆるペットに対応できる

### 6.2 パフォーマンス

- ✅ 頻繁に検索されるフィールドに適切なインデックスが設定されている
- ✅ 統計データ（`averageRating`, `reviewCount`, `likeCount`）を非正規化している

### 6.3 拡張性

- ✅ Phase 2（共同管理）を見据えた`pet_members`テーブル
- ✅ Phase 3（SNS・商品DB）を見据えた`isPublic`、`products`、`reviews`テーブル
- ✅ AI相談機能を見据えた`chat_threads`、`chat_messages`、`knowledge_base`テーブル

### 6.4 セキュリティ

- ✅ `visibility`による公開設定
- ✅ `pet_members`による権限管理
- ✅ 認証IDベースのアクセス制御

---

**レビュー完了日**: 2026年2月1日  
**レビュー担当**: AI Assistant  
**次回レビュー推奨日**: Phase 1実装完了後

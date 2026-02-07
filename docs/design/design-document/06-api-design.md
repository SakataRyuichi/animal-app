# 6. API設計（Convex Functions）

**📚 インデックス**: [DESIGN_DOCUMENT_INDEX.md](../DESIGN_DOCUMENT_INDEX.md)

API設計（Convex Functions）

### 6.1 Users関連
- `storeUser`: ユーザー作成・更新
- `getCurrentUser`: 現在のユーザー取得
- `updateUser`: ユーザー情報更新

### 6.2 Pets関連
- `createPet`: ペット作成
- `getPetsByOwner`: 所有者のペット一覧取得
- `getPetById`: ペット詳細取得
- `updatePet`: ペット情報更新
- `deletePet`: ペット削除
- `searchPets`: ペット検索（種別・品種）

### 6.3 Activities関連
- `createActivity`: 活動ログ作成
- `getActivitiesByPet`: ペットの活動ログ取得
- `getTimeline`: タイムライン取得
  - **拡張機能** ✅ **2026年追加 - フィルター・リマインダー完了状況**
    - `petId`パラメータ: 特定のペットで絞り込み（`undefined`の場合はすべてのペット）
    - `types`パラメータ: 記録タイプの配列でフィルター（例: `["food", "toilet", "diary"]`）
    - `includeReminders`パラメータ: リマインダー完了記録を含めるかどうか（デフォルト: `true`）
    - 返り値: 活動ログとリマインダー完了記録を時系列で統合した配列
- `getTimelineWithFilters`: フィルター付きタイムライン取得 ✅ **2026年追加**
  - ペットID、記録タイプ、日付範囲でフィルター可能
  - リマインダー完了記録を含めるかどうかを指定可能
  - ページネーション対応（`limit`、`cursor`パラメータ）
- **日記フィルタリング** ✅ **2026年追加 - 日記の検索性向上**
  - `getDiaryActivitiesWithFilters`: 日記をシーン、感情、時間帯、場所でフィルタリング
    - `scenes`パラメータ: シーンIDの配列（複数選択可能）
    - `emotion`パラメータ: 感情ID
    - `timeOfDay`パラメータ: 時間帯（"morning", "noon", "evening", "night", "midnight"）
    - `location`パラメータ: 場所（"home", "park", "dog_run", "clinic", "travel"）
    - 複数のフィルターを組み合わせて検索可能
    - ページネーション対応
- `updateActivity`: 活動ログ更新
- `deleteActivity`: 活動ログ削除
- `getLastFeedingActivity`: 前回の食事記録を取得（食事記録画面のデフォルト値用）✅ **2026年追加**
  - 指定されたペットの最新の食事記録（type: "food"）を取得
  - 一定期間（例: 7日）以内の記録のみを返す
  - 商品ID、量、商品名などの情報を含む
- `getLastToiletActivity`: 前回のトイレ記録を取得（トイレ記録画面のデフォルト値用）✅ **2026年追加**
  - 指定されたペットの最新のトイレ記録（type: "toilet"）を取得
  - 一定期間（例: 7日）以内の記録のみを返す
  - 種別ごとの詳細な状態情報を含む

### 6.3.1 マスターデータ関連 ✅ **2026年追加 - 種別ごとの選択肢**
- `getToiletConditionMasters`: トイレ記録用の選択肢マスターデータを取得
  - ペットの種別を指定して、該当する選択肢のみを取得
  - カテゴリ（general_condition, stool_condition, urine_conditionなど）でフィルタリング可能
  - 表示順序でソート済み
- `getCleaningActionMasters`: 清掃アクションのマスターデータを取得
  - ペットの種別を指定して、該当するアクションのみを取得
  - 表示順序でソート済み
- **日記関連マスターデータ** ✅ **2026年追加 - 日記の簡単記録**
  - `getDiaryScenes`: 日記シーンマスターデータを取得
    - 有効なシーンのみを取得
    - 表示順序でソート済み
    - アイコンとシーン名を含む
  - `getDiaryEmotions`: 日記感情マスターデータを取得
    - 有効な感情のみを取得
    - 表示順序でソート済み
    - 顔文字アイコンと感情名を含む
  - `getContextStamps`: コンテキストスタンプマスターデータを取得
    - 有効なスタンプのみを取得
    - 表示順序でソート済み
    - シーンIDの配列と感情IDを含む
  - `getReactionTypes`: リアクションタイプマスターデータを取得
    - 有効なリアクションタイプのみを取得
    - 表示順序でソート済み
    - 絵文字アイコンとリアクション名を含む

### 6.3.2 リマインダー関連 ✅ **2026年追加 - 掃除のタイマー・リマインダー**
- `getReminderCategoryMasters`: リマインダーカテゴリのマスターデータを取得
  - ペットの種別を指定して、該当するカテゴリのみを取得
  - おすすめのリマインダーを表示するために使用
  - 表示順序でソート済み
- `createReminder`: リマインダーを作成
  - カテゴリIDまたはカスタムタイトルを指定
  - スケジュール（頻度、時間）を設定
  - 完了条件とポイントを設定
  - 次回の通知日時を自動計算
- `updateReminder`: リマインダーを更新
  - スケジュール、完了条件、ポイントなどを更新
  - 次回の通知日時を再計算
- `deleteReminder`: リマインダーを削除（論理削除）
- `getRemindersByPet`: ペットのリマインダー一覧を取得
  - 有効/無効でフィルタリング可能
- `getTodayReminders`: 今日のリマインダー一覧を取得（「今日のやること」リスト用）
  - 次回の通知日時が今日のリマインダーのみを取得
- `completeReminder`: リマインダーを完了
  - 完了履歴（reminder_logs）を作成
  - ポイントを付与
  - 次回の通知日時を再計算
  - トイレ記録などから自動完了した場合、relatedActivityIdを設定
- `getReminderLogsForTimeline`: タイムライン統合用のリマインダー完了記録取得 ✅ **2026年追加**
  - 指定されたペットのリマインダー完了記録を取得
  - 日付範囲でフィルタリング可能（`startDate`、`endDate`パラメータ）
  - 活動ログと統合しやすい形式で返す（`loggedAt`、`type: "reminder"`など）
  - 未完了のリマインダーも含めるかどうかを指定可能（`includeIncomplete`パラメータ）
  - 返り値: `{ id, type: "reminder", loggedAt, reminderId, reminderTitle, completedAt, isCompleted }`形式の配列
- `calculateNextNotificationAt`: 次回の通知日時を計算（内部関数）
  - 頻度（daily, weekly, biweekly, monthly, interval）に基づいて計算
  - RRULE準拠のスケジュール計算

### 6.4 Pet Members関連（Phase 2）
- `addPetMember`: 共同管理者追加
- `getPetMembers`: 共同管理者一覧取得
- `updatePetMemberRole`: 権限更新
- `removePetMember`: 共同管理者削除
- `getPetsByMember`: 自分が管理できるペット一覧取得

### 6.5 Products関連（Phase 3）
- `createProduct`: 商品作成
- `searchProducts`: 商品検索
- `getProductById`: 商品詳細取得
- `getProductDetail`: 商品詳細取得（オンデマンド更新付き）✅ **2026年追加**
- `verifyProduct`: 商品承認（運営）
- `seedProductsByCategory`: カテゴリごとの商品一括登録（初回シード用）✅ **2026年追加**
- `updateProductFromApi`: 商品をAPIから更新（オンデマンド更新用）✅ **2026年追加**
- `updatePopularProductsBatch`: 閲覧数の多い商品をバッチ更新（Cron用）✅ **2026年追加**
- **管理画面用** ✅ **2026年追加**:
  - `getProductsForAdmin`: 管理画面用の商品一覧取得（検索・フィルタリング・ページネーション対応）
  - `getProductDetailForAdmin`: 管理画面用の商品詳細取得（全情報を含む）

### 6.6 Reviews関連（Phase 3）
- `createReview`: レビュー作成
- `getReviewsByProduct`: 商品のレビュー一覧取得
- `getPopularProductsBySpecies`: 種別ごとの人気商品取得

### 6.7 AI相談関連（Phase 1後半 / Phase 2）
- `createChatThread`: チャットスレッド作成
- `getChatThreads`: チャットスレッド一覧取得
- `getChatMessages`: メッセージ一覧取得
- `chat`: AI相談アクション（Action）
  - ペットのカルテ情報を取得
  - 質問をベクトル化して知識ベースを検索
  - OpenAI APIで回答生成
  - メッセージを保存
- `searchKnowledgeBase`: 知識ベース検索（内部用）
- `embedText`: テキストのベクトル化（内部用Action）

### 6.8 知識ベース管理（運営用）
- `createKnowledge`: 知識ベース作成
- `updateKnowledge`: 知識ベース更新
- `deleteKnowledge`: 知識ベース削除
- `ingestDocument`: ドキュメントの取り込み（PDF等からテキスト抽出→ベクトル化→保存）

### 6.9 コラム・記事関連（Phase 1後半 / Phase 2）
- `getArticles`: コラム一覧取得（公開済み）
- `getArticleById`: コラム詳細取得
- `getRecommendedArticles`: レコメンドコラム取得（種別ベース）
- `searchArticles`: コラム検索（全文検索）
- `createArticle`: コラム作成（管理者・専門家のみ）
- `updateArticle`: コラム更新（管理者・専門家のみ）
- `deleteArticle`: コラム削除（管理者・専門家のみ）
- `publishArticle`: コラム公開（管理者・専門家のみ）

### 6.10 AI執筆サポート（運営用）
- `generateArticleDraft`: AIでコラムの下書きを生成（Action）
  - 医学論文のURLを入力
  - 対象読者を指定（例：「初めて猫を飼う人向け」）
  - Markdown形式の下書きを生成
- `validateArticle`: 記事の信頼性チェック（Action）
  - 厚生労働省や獣医師会のガイドラインとの矛盾チェック

### 6.11 SNS機能関連（Phase 3）
- `getFollowingFeed`: フォロー中フィード取得
  - フォローしているユーザーの公開投稿を時系列で取得
  - リアルタイム更新対応
- `getRecommendedFeed`: おすすめフィード取得
  - 人気投稿、関連性、波及効果をミックスして取得
  - オプション: AIパーソナライズ（ベクトル検索）
- `followUser`: ユーザーをフォロー
- `unfollowUser`: ユーザーのフォロー解除
- `getFollowingList`: フォローしているユーザー一覧取得
- `getFollowersList`: フォロワー一覧取得
- `likeActivity`: 投稿にいいね
- `unlikeActivity`: いいね解除
- `getLikesByActivity`: 投稿のいいね一覧取得
- `checkLikeStatus`: ユーザーがいいねしたかどうか確認

### 6.12 データライフサイクル管理（Cronジョブ）✅ **2026年最終設計検証で追加**
- `deleteExpiredData`: 期限切れデータの物理削除（Cronジョブ）
  - `restorableUntil`を過ぎたデータを自動で物理削除
  - 関連する画像ストレージも同時に削除
  - 毎日午前3時に実行
- `permanentDeleteAccount`: 退会後のデータ完全削除
  - 退会後30日経過で画像ストレージからも完全に削除（GDPR等の法的要件対応）
  - ユーザーのすべてのデータ（ペット、活動ログ、画像）を削除

### 6.13 リマインダー通知管理（Cronジョブ）✅ **2026年追加 - Push通知の送信**
- `sendReminderNotifications`: リマインダー通知の送信（Cronジョブ）
  - `nextNotificationAt`が現在時刻に達したリマインダーを検索
  - Push通知を送信（Expo Notifications経由）
  - 通知送信後、次回の通知日時を再計算して`nextNotificationAt`を更新
  - 毎時間実行（または15分ごと）
- `calculateNextNotificationAt`: 次回の通知日時を計算（内部関数）
  - 頻度（daily, weekly, biweekly, monthly, interval）に基づいて計算
  - RRULE準拠のスケジュール計算
  - 完了後に自動的に次回の通知日時を更新

### 6.13 オフライン画像アップロード ✅ **2026年最終設計検証で追加**
- `createPending`: 中間状態の画像レコード作成（StorageIdは空）
- `upload`: 画像をConvex Storageにアップロードし、StorageIdを設定
- `getPendingUploads`: アップロード待ちの画像一覧取得（再試行用）

### 6.14 広告表示管理 ✅ **2026年追加 - 無料ユーザーへの広告表示**
- **広告表示の制御**:
  - フロントエンドで`user.subscription.tier`を確認し、`"free"`の場合のみ広告を表示
  - 広告の表示頻度を制御（`users.adLastSeenAt`を参照）
  - 同じ広告を短時間で繰り返し表示しない
- **広告配置の実装**:
  - **日記タイムライン**: `getTimeline`の結果に、3〜5件ごとに広告カードを挿入（フロントエンド側で実装）
  - **キュレーション記事一覧**: `getArticles`の結果に、広告カードを1つ混ぜる（フロントエンド側で実装）
  - **リマインダー完了後のサンクス画面**: 完了画面のコンポーネント内で、無料ユーザーの場合のみ広告を表示
- **プレミアム移行の導線**:
  - 広告カードの下に「プレミアムなら広告なしで、もっとサクサク記録できます」というメッセージとプラン比較画面へのリンクを表示
  - 設定画面にも「広告なしで快適に利用する」というオプションからプレミアムプラン比較画面へ導線を設置
- **広告クリックの記録**:
  - 広告をクリックした際に、`updateUser`で`adLastClickedAt`を更新
  - 広告表示時に`adLastSeenAt`を更新

### 6.15 競合解決（楽観的ロック）✅ **2026年最終設計検証で追加**
- `updateActivityWithVersion`: バージョン番号をチェックして活動ログを更新
  - 競合が発生した場合はエラーを返し、UI側で優しいメッセージを表示

### 6.16 ゲーミフィケーション要素関連 ✅ **2026年追加 - ポイント・バッジ・ショップ**
- **ポイント関連**:
  - `getCurrentPoints`: 現在の所持ポイント取得（US-083）
  - `getPointHistory`: ポイント取得履歴取得（US-088）
    - 時系列順に履歴を取得
    - フィルター機能（獲得のみ、消費のみ、期間でフィルター）
    - ソート機能（新しい順、古い順、ポイント数順）
    - ページネーション対応
    - 合計獲得ポイントと合計消費ポイントを返す
  - `getPointEarningMethods`: ポイント取得方法一覧取得（US-084）
- **バッジ関連**:
  - `getUserBadges`: ユーザーが獲得したバッジ一覧取得
  - `getBadgeDefinitions`: バッジ定義一覧取得（管理者用）
  - `checkAndAwardBadges`: バッジ獲得条件をチェックして付与（内部用）
- **ショップ関連**:
  - `getShopItems`: ショップアイテム一覧取得（US-085）
    - フィルター機能（ポイント購入可能、現金購入可能、期間限定）
    - ソート機能（ポイント価格順、現金価格順、新着順）
    - カテゴリ別フィルタリング（静止画フレーム、動くフレーム、アルバム表紙など）
  - `getAssetById`: アイテム詳細取得（US-087）
  - `getUserAssets`: ユーザーが所有しているアイテム一覧取得（US-086）
  - `purchaseAssetWithPoints`: ポイントでアイテム交換（US-070）
  - `purchaseAssetWithMoney`: 現金でアイテム購入（US-070、RevenueCat連携）

### 6.17 公式サイト関連（Next.js + Vercel）✅ **2026年追加 - SEO・LLMフレンドリーな公式サイト**
- **ニュース関連**:
  - `getNews`: 公開済みニュース一覧取得（時系列順、カテゴリフィルタリング対応）
  - `getNewsById`: ニュース詳細取得
  - `getLatestNews`: 最新ニュース取得（トップページ用、最新5件など）
  - `createNews`: ニュース作成（管理者のみ）
  - `updateNews`: ニュース更新（管理者のみ）
  - `deleteNews`: ニュース削除（管理者のみ）
  - `publishNews`: ニュース公開（管理者のみ）
  - **自動更新** ✅ **2026年追加 - モノレポ運用**:
    - Convexの`news`テーブルを更新すると、VercelのOn-demand ISR（Incremental Static Regeneration）により、公式サイトのニュース一覧が瞬時に（かつ静的ファイルとして高速に）更新される
    - Next.js側で`revalidatePath`または`revalidateTag`を使用して実装
- **法務ドキュメント関連**:
  - `getLegalDocument`: 最新版の法務ドキュメント取得（タイプ指定）
  - `getLegalDocumentByVersion`: 特定バージョンの法務ドキュメント取得
  - `getLegalDocumentHistory`: 法務ドキュメントの改定履歴取得
  - `createLegalDocument`: 法務ドキュメント作成（管理者のみ）
  - `updateLegalDocument`: 法務ドキュメント更新（管理者のみ）
  - **一元管理** ✅ **2026年追加 - モノレポ運用**:
    - `packages/policy/`にMarkdownファイルを置き、アプリの「設定 > 規約」と、公式サイトの「フッター > 規約」が常に同じファイルを読み込むようにビルド設定
    - 法務ドキュメントの更新が、アプリと公式サイトの両方に即座に反映される
    - Convexの`legal_documents`テーブルと`packages/policy/`のMarkdownファイルを同期する仕組みを構築
- **FAQ関連** ✅ **2026年追加 - SEO・LLM最適化**:
  - FAQは`packages/policy/faq.md`または`apps/www/content/faq.md`にMarkdown形式で管理
  - Next.js側でFAQを読み込み、FAQPageの構造化データ（JSON-LD）を生成
  - SEO最適化：各FAQに適切なメタタグを設定
  - LLMフレンドリー：FAQの内容を構造化された形式で記述
  - 検索キーワード対策：具体的な悩みをキーワードとして含める
- **統計情報（公式サイト用）**:
  - `getPublicStats`: 公開可能な統計情報取得（例: 総ユーザー数、総記録数など）
  - プライバシー保護：個人や特定のペットが特定されないよう集計処理
- **グローバル公開データ（将来機能）**:
  - `getPublicPets`: 公開設定されているペット一覧取得
  - `getPublicPetById`: 公開設定されているペットの詳細取得
  - `getPublicBadges`: 公開設定されているバッジ一覧取得
  - `getPublicAlbums`: 公開設定されているアルバム一覧取得
- **SEO・LLM最適化**:
  - sitemap.xmlの自動生成（Next.jsのsitemap.ts）
  - robots.txtの設定
  - 構造化データ（JSON-LD）の生成
  - API Route（/api/ai-info）でアプリの機能一覧や最新ニュースをJSON形式で提供
  - FAQPageの構造化データ（JSON-LD）をNext.js側で生成 ✅ **2026年追加**

---

# Convex Schema インデックス

**📚 ドキュメントインデックス**: [DOCUMENTATION_INDEX.md](../../DOCUMENTATION_INDEX.md)

## 概要
このドキュメントは、Convexスキーマの定義と説明のインデックスです。
Phase 1からPhase 3までを見据えた設計になっています。

**関連ドキュメント**:
- [USER_STORIES.md](../stories/USER_STORIES.md): モバイルアプリのユーザーストーリー
- [ADMIN_USER_STORIES.md](../stories/ADMIN_USER_STORIES.md): 管理画面のユーザーストーリー
- [WEB_USER_STORIES.md](../stories/WEB_USER_STORIES.md): 公式サイトのユーザーストーリー ✅ **2026年追加**
- [DESIGN_DOCUMENT.md](../design/DESIGN_DOCUMENT.md): アプリ設計の詳細
- [IMAGE_STORAGE_STRATEGY.md](../design/IMAGE_STORAGE_STRATEGY.md): 画像保存戦略
- [AI_CHAT_REVIEW.md](../design/AI_CHAT_REVIEW.md): AIチャット機能のレビュー
- [SCHEMA_REVIEW.md](../requirements/SCHEMA_REVIEW.md): スキーマ設計のレビュー

**重要**: このスキーマでは、Convexのドキュメント指向な特性を最大限に活かした`deletion`オブジェクトを使用した論理削除機能を実装しています。詳細は「設計のポイント > 6. 安全な削除機能（論理削除）」を参照してください。

---

## スキーマ定義

全テーブルの定義を含むスキーマ定義は以下のファイルを参照してください：
- [00-schema-definition.md](./convex-schema/00-schema-definition.md): 全テーブルのTypeScript定義

---

## テーブル詳細説明

### ユーザー・認証関連
- [01-users.md](./convex-schema/01-users.md): 1. users（ユーザー）

### ペット管理
- [02-pets.md](./convex-schema/02-pets.md): 2. pets（ペット）
- [03-pet-members.md](./convex-schema/03-pet-members.md): 3. pet_members（共同管理者）

### 活動ログ・記録
- [06-activities.md](./convex-schema/06-activities.md): 6. activities（活動ログ）

### メディア管理
- [05-images.md](./convex-schema/05-images.md): 5. images（画像・動画管理）✅ **Convexのプライシングを考慮した設計・Cloudflare R2移行**

### 商品データベース
- [07-products.md](./convex-schema/07-products.md): 7. products（商品データベース）✅ **2026年更新 - アソシエイトAPI情報の追加**
- [08-reviews.md](./convex-schema/08-reviews.md): 8. reviews（商品レビュー）✅ **2026年更新 - 餌のレビュー専用フィールドの追加**

### SNS機能
- [09-follows.md](./convex-schema/09-follows.md): 9. follows（フォロー関係）
- [10-likes.md](./convex-schema/10-likes.md): 10. likes（いいね・リアクション）✅ **2026年更新 - 多機能リアクション**

### コンテンツ管理
- [11-articles.md](./convex-schema/11-articles.md): 11. articles（コラム・記事）
- [18-curations.md](./convex-schema/18-curations.md): 18. curations（管理者厳選のキュレーション）✅ **外部記事の紹介**
- [19-curation-interactions.md](./convex-schema/19-curation-interactions.md): 19. curation_interactions（キュレーションインタラクション）

### AI機能
- [12-chat-threads.md](./convex-schema/12-chat-threads.md): 12. chat_threads（AIチャットスレッド）
- [13-chat-messages.md](./convex-schema/13-chat-messages.md): 13. chat_messages（AIチャットメッセージ）
- [25-knowledge-base.md](./convex-schema/25-knowledge-base.md): 25. knowledge_base（知識ベース）

### アルバム管理
- [14-albums.md](./convex-schema/14-albums.md): 14. albums（アルバム）
- [15-album-items.md](./convex-schema/15-album-items.md): 15. album_items（アルバムアイテム）

### プレミアム・フィードバック
- [16-premium-cancellation-reasons.md](./convex-schema/16-premium-cancellation-reasons.md): 16. premium_cancellation_reasons（プレミアム解除理由）
- [17-account-deletion-reasons.md](./convex-schema/17-account-deletion-reasons.md): 17. account_deletion_reasons（退会理由）

### マスターデータ
- [20-toilet-condition-masters.md](./convex-schema/20-toilet-condition-masters.md): 20. toilet_condition_masters（トイレ記録用マスターデータ）✅ **2026年追加 - 種別ごとの選択肢**
- [21-cleaning-action-masters.md](./convex-schema/21-cleaning-action-masters.md): 21. cleaning_action_masters（清掃アクションマスターデータ）✅ **2026年追加 - 全種共通**
- [22-reminder-category-masters.md](./convex-schema/22-reminder-category-masters.md): 22. reminder_category_masters（リマインダーカテゴリマスターデータ）✅ **2026年追加 - 種別ごとのプリセット**
- [31-diary-scenes.md](./convex-schema/31-diary-scenes.md): 31. diary_scenes（日記シーンマスターデータ）✅ **2026年追加 - 日記の簡単記録**
- [32-diary-emotions.md](./convex-schema/32-diary-emotions.md): 32. diary_emotions（日記感情マスターデータ）✅ **2026年追加 - 日記の簡単記録**
- [33-reaction-types.md](./convex-schema/33-reaction-types.md): 33. reaction_types（リアクションタイプマスターデータ）✅ **2026年追加 - 多機能リアクション**
- [34-context-stamps.md](./convex-schema/34-context-stamps.md): 34. context_stamps（コンテキストスタンプマスターデータ）✅ **2026年追加 - シーン+感情のセット**

### リマインダー機能
- [23-reminders.md](./convex-schema/23-reminders.md): 23. reminders（リマインダー設定）✅ **2026年追加 - 掃除のタイマー・リマインダー**
- [24-reminder-logs.md](./convex-schema/24-reminder-logs.md): 24. reminder_logs（リマインダー完了履歴）✅ **2026年追加 - 完了記録とポイント付与**

### ゲーミフィケーション
- [26-assets.md](./convex-schema/26-assets.md): 26. assets（ショップアイテム）✅ **ゲーミフィケーション要素（2026年追加）**
- [27-badge-definitions.md](./convex-schema/27-badge-definitions.md): 27. badge_definitions（バッジ定義）✅ **ゲーミフィケーション要素（2026年追加）**
- [28-point-history.md](./convex-schema/28-point-history.md): 28. point_history（ポイント獲得履歴）✅ **ゲーミフィケーション要素（2026年追加）**

### 公式サイト・法務
- [29-news.md](./convex-schema/29-news.md): 29. news（ニュース・更新情報）✅ **2026年追加 - 公式サイト**
- [35-legal-documents.md](./convex-schema/35-legal-documents.md): 35. legal_documents（法務ドキュメント）✅ **2026年追加 - 公式サイト**

---

## 設計のポイント

詳細は各テーブルファイルを参照してください。主要な設計ポイント：

1. **柔軟性の確保**: `payload`オブジェクトにより、ログタイプごとに異なるデータ構造を柔軟に扱える
2. **パフォーマンス最適化**: インデックスと検索インデックスを適切に設定
3. **拡張性の確保**: Phase 1からPhase 3までを見据えた設計
4. **セキュリティ**: 認証・認可の実装
5. **安全な削除機能（論理削除）**: Convexのドキュメント指向な特性を最大限に活用
6. **画像保存戦略**: Convexのプライシングを考慮した設計
7. **データライフサイクルと物理削除のタイミング**: Convex Cronジョブによる自動物理削除
8. **オフラインエクスペリエンス**: 画像アップロードキュー管理

---

## 実装例

各テーブルの実装例は、各テーブルファイルを参照してください。

# ドキュメントインデックス

## 概要
このドキュメントは、プロジェクト内のすべてのドキュメントを整理し、相互参照できるようにするためのマスタードキュメントです。

各ドキュメントの目的、内容、関連ドキュメントへのリンクを提供します。

**アプリケーション関連ドキュメント**（要件・設計・ストーリー・スキーマなど）は **[docs/](./docs/README.md)** ディレクトリに文脈別に整理しています。設定用ファイル（AGENTS.md、CLAUDE.md、.cursor/ など）はリポジトリルートにあります。

---

## 📚 ドキュメント一覧（カテゴリ別）

### 🎯 開発の憲法（必須読了）

これらのドキュメントは、開発の基礎となる「憲法」として機能します。実装前に必ず確認してください。

| ドキュメント | 目的 | 対象 |
|------------|------|------|
| **[USER_STORIES_INDEX.md](./docs/stories/USER_STORIES_INDEX.md)** | モバイルアプリのユーザーストーリー（インデックス）✅ **2026年追加 - 分割版** | 開発者・AI |
| **[USER_STORIES.md](./docs/stories/USER_STORIES.md)** | モバイルアプリのユーザーストーリー（統合版） | 開発者・AI |
| **[ADMIN_USER_STORIES_INDEX.md](./docs/stories/ADMIN_USER_STORIES_INDEX.md)** | 管理画面のユーザーストーリー（インデックス）✅ **2026年追加 - 分割版** | 開発者・AI |
| **[ADMIN_USER_STORIES.md](./docs/stories/ADMIN_USER_STORIES.md)** | 管理画面のユーザーストーリー（統合版） | 開発者・AI |
| **[WEB_USER_STORIES_INDEX.md](./docs/stories/WEB_USER_STORIES_INDEX.md)** | 公式サイトのユーザーストーリー（インデックス）✅ **2026年追加 - 分割版** | 開発者・AI |
| **[WEB_USER_STORIES.md](./docs/stories/WEB_USER_STORIES.md)** | 公式サイトのユーザーストーリー（統合版） | 開発者・AI |
| **[CONVEX_SCHEMA_INDEX.md](./docs/schema/CONVEX_SCHEMA_INDEX.md)** | Convexスキーマ定義と実装例（インデックス）✅ **2026年追加 - 分割版** | 開発者・AI |
| **[CONVEX_SCHEMA.md](./docs/schema/CONVEX_SCHEMA.md)** | Convexスキーマ定義と実装例（統合版） | 開発者・AI |
| **[APP_DIRECTORY_STRUCTURE.md](./docs/app-structure/APP_DIRECTORY_STRUCTURE.md)** | アプリディレクトリ構成と画面マッピング ✅ **2026年追加** | 開発者・AI |

**関連ドキュメント**:
- [docs/design/DESIGN_DOCUMENT.md](./docs/design/DESIGN_DOCUMENT.md): アプリ設計の詳細
- [docs/design/PREMIUM_FEATURES.md](./docs/design/PREMIUM_FEATURES.md): プレミアム機能の定義

---

### 🏗️ 設計・アーキテクチャ

| ドキュメント | 目的 | 対象 |
|------------|------|------|
| **[DESIGN_DOCUMENT_INDEX.md](./docs/design/DESIGN_DOCUMENT_INDEX.md)** | アプリ設計の詳細（インデックス）✅ **2026年追加 - 分割版** | 開発者・AI |
| **[DESIGN_DOCUMENT.md](./docs/design/DESIGN_DOCUMENT.md)** | アプリ設計の詳細（統合版） | 開発者・AI |
| **[TECH_STACK_PLANNING.md](./docs/design/TECH_STACK_PLANNING.md)** | 技術選定の詳細と理由 | 開発者 |
| **[IMAGE_STORAGE_STRATEGY.md](./docs/design/IMAGE_STORAGE_STRATEGY.md)** | 画像・動画保存戦略とCloudflare R2移行 ✅ **2026年更新** | 開発者・AI |

**関連ドキュメント**:
- [docs/schema/CONVEX_SCHEMA.md](./docs/schema/CONVEX_SCHEMA.md): スキーマ定義
- [docs/design/PREMIUM_FEATURES.md](./docs/design/PREMIUM_FEATURES.md): プレミアム機能の定義

---

### 💎 機能別設計書

| ドキュメント | 目的 | 対象 |
|------------|------|------|
| **[PREMIUM_FEATURES.md](./docs/design/PREMIUM_FEATURES.md)** | プレミアム機能の定義と制限 | 開発者・AI |
| **[AI_CHAT_DISCLAIMER.md](./docs/design/AI_CHAT_DISCLAIMER.md)** | AIチャット免責事項の設計 | 開発者・AI |
| **[AI_CHAT_REVIEW.md](./docs/design/AI_CHAT_REVIEW.md)** | AIチャット機能の設計レビュー | 開発者・AI |

**関連ドキュメント**:
- [docs/schema/CONVEX_SCHEMA.md](./docs/schema/CONVEX_SCHEMA.md): AIチャット機能のスキーマ定義
- [docs/stories/USER_STORIES.md](./docs/stories/USER_STORIES.md): US-020〜US-025（AI相談機能）

---

### 🔍 レビュー・検証（要件・議事録）

| ドキュメント | 目的 | 対象 |
|------------|------|------|
| **[SCHEMA_REVIEW.md](./docs/requirements/SCHEMA_REVIEW.md)** | スキーマ設計のレビュー結果 | 開発者 |
| **[REQUIREMENTS_REVIEW.md](./docs/requirements/REQUIREMENTS_REVIEW.md)** | 要件定義のレビュー結果 | 開発者 |
| **[DOCUMENT_REVIEW.md](./docs/requirements/DOCUMENT_REVIEW.md)** | ドキュメント全体のレビュー結果 | 開発者 |
| **[DOCUMENT_REVIEW_2026.md](./docs/requirements/DOCUMENT_REVIEW_2026.md)** | ドキュメントレビュー（2026年） | 開発者 |

**関連ドキュメント**:
- [docs/schema/CONVEX_SCHEMA.md](./docs/schema/CONVEX_SCHEMA.md): レビュー対象のスキーマ
- [docs/stories/USER_STORIES.md](./docs/stories/USER_STORIES.md): レビュー対象のユーザーストーリー

---

### 🛠️ 開発ガイド

| ドキュメント | 目的 | 対象 |
|------------|------|------|
| **[.cursor/rules/PROJECT.md](./.cursor/rules/PROJECT.md)** | プロジェクトルール（コードスタイル、ワークフロー、コマンド） | 開発者・AI |
| **[AGENTS.md](./AGENTS.md)** | Cursorエージェントの使い方とガイドライン | 開発者・AI |
| **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)** | セットアップ前のチェックリスト | 開発者 |
| **[MISE_SETUP.md](./MISE_SETUP.md)** | miseセットアップガイド（Node.js/pnpmバージョン管理） ⭐ **2026年追加 - 必須** | 開発者 |
| **[DESIGN_REVIEW_MISE_CONVEX_TURBOREPO.md](./docs/design/DESIGN_REVIEW_MISE_CONVEX_TURBOREPO.md)** | mise + Convex + Turborepo設計レビュー ⭐ **2026年追加** | 開発者 |
| **[CLAUDE.md](./CLAUDE.md)** | Claude AI固有の設定と補足 | 開発者・AI |
| **[OBSIDIAN_SETUP.md](./OBSIDIAN_SETUP.md)** | Obsidian設定ガイド ✅ **2026年追加** | 開発者 |
| **[ISSUE_GUIDELINES.md](./ISSUE_GUIDELINES.md)** | GitHub Issue作成ガイドライン ✅ **2026年追加** | 開発者 |
| **[EPIC_OVERVIEW.md](./docs/implementation/EPIC_OVERVIEW.md)** | 各エピックの概要とストーリー一覧 ✅ **2026年追加** | 開発者 |
| **[IMPLEMENTATION_PHASES.md](./docs/implementation/IMPLEMENTATION_PHASES.md)** | 実装フェーズ計画（Phase 0〜Phase 3） ✅ **2026年追加** | 開発者 |
| **[EPIC_IMPLEMENTATION_PLAN.md](./docs/implementation/EPIC_IMPLEMENTATION_PLAN.md)** | エピックと実装タスクの詳細定義（Phase 0〜Phase 1） ✅ **2026年追加** | 開発者 |
| **[.cursor/rules/ISSUE_REFERENCE.md](./.cursor/rules/ISSUE_REFERENCE.md)** | GitHub Issue参照方法のガイドライン ✅ **2026年追加** | 開発者・AI |
| **[PENCIL_DESIGN_BRIEF.md](./docs/design/PENCIL_DESIGN_BRIEF.md)** | Pencilデザインブリーフ（画面単位のストーリーとデザイン要件） ✅ **2026年追加** | デザイナー・開発者 |
| **[DIARY_DRAFT_VERIFICATION.md](./docs/design/DIARY_DRAFT_VERIFICATION.md)** | 日記の更新・削除・下書き機能の検証と設計 ✅ **2026年追加** | 開発者 |
| **[CLOUDFLARE_R2_MIGRATION.md](./docs/design/CLOUDFLARE_R2_MIGRATION.md)** | Cloudflare R2移行設計（画像・動画保存） ✅ **2026年追加** | 開発者 |

**関連ドキュメント**:
- `TECH_STACK_PLANNING.md`: 技術スタックの詳細
- `.cursor/README.md`: Cursor設定ファイルの説明
- `.cursor/skills/documentation-access/SKILL.md`: ドキュメントへの効率的なアクセス方法
- `.obsidian/README.md`: Obsidian設定の詳細 ✅ **2026年追加**

---

## 📖 ドキュメント詳細

### USER_STORIES.md / USER_STORIES_INDEX.md
**パス**: [docs/stories/USER_STORIES.md](./docs/stories/USER_STORIES.md)（統合版）、[docs/stories/USER_STORIES_INDEX.md](./docs/stories/USER_STORIES_INDEX.md)（インデックス）✅ **2026年追加 - 分割版**  
**目的**: モバイルアプリ（React Native Expo）の機能をユーザー視点で整理したユーザーストーリー  
**対象**: 開発者・AI（Cursor）  
**重要度**: ⭐⭐⭐ **開発の憲法**

**内容**:
- Phase 1〜3のユーザーストーリー
- キラー機能（AI相談）とフック機能（コラム・記事）の定義
- 各ストーリーの受け入れ基準、体験価値、使用シーン

**分割ファイル**（[docs/stories/user-stories/](./docs/stories/user-stories/)）:
- `01-authentication.md`: Epic 1（認証・ユーザー管理）
- `02-pet-management.md`: Epic 2（ペット管理）
- `03-activity-logs.md`: Epic 3（活動ログ記録・リマインダー・広告表示）
- `04-dashboard-statistics.md`: Epic 4（ダッシュボード・統計）
- `05-premium.md`: Epic 5（プレミアム機能）
- `06-articles.md`: Epic 6（コラム・記事機能）
- `07-ai-chat.md`: Epic 7（AI相談機能）
- `08-collaboration.md`: Epic 8（共同管理）
- `09-sns.md`: Epic 9（SNS機能）
- `10-products.md`: Epic 10（商品データベース）
- `11-reviews.md`: Epic 11（レビュー機能）
- `12-media.md`: Epic 12（画像・動画管理機能）
- `13-feedback.md`: Epic 13（ユーザーフィードバック機能）
- `14-memorial.md`: Epic 14（メモリアル機能）
- `15-albums.md`: Epic 15（アルバム管理機能）
- `16-curation.md`: Epic 16（管理者厳選のキュレーション機能）
- `17-gamification.md`: Epic 17（ゲーミフィケーション要素）

**関連ドキュメント**:
- [docs/stories/ADMIN_USER_STORIES.md](./docs/stories/ADMIN_USER_STORIES.md): 管理画面側のストーリー
- [docs/schema/CONVEX_SCHEMA.md](./docs/schema/CONVEX_SCHEMA.md): スキーマ定義
- [docs/design/DESIGN_DOCUMENT.md](./docs/design/DESIGN_DOCUMENT.md): アプリ設計の詳細
- [docs/design/PREMIUM_FEATURES.md](./docs/design/PREMIUM_FEATURES.md): プレミアム機能の定義

**参照される場所**:
- [docs/schema/CONVEX_SCHEMA.md](./docs/schema/CONVEX_SCHEMA.md): 各テーブルの説明で参照
- [docs/design/DESIGN_DOCUMENT.md](./docs/design/DESIGN_DOCUMENT.md): 機能詳細の説明で参照
- [docs/design/PREMIUM_FEATURES.md](./docs/design/PREMIUM_FEATURES.md): プレミアム機能の説明で参照

---

### ADMIN_USER_STORIES.md / ADMIN_USER_STORIES_INDEX.md
**パス**: [docs/stories/ADMIN_USER_STORIES.md](./docs/stories/ADMIN_USER_STORIES.md)（統合版）、[docs/stories/ADMIN_USER_STORIES_INDEX.md](./docs/stories/ADMIN_USER_STORIES_INDEX.md)（インデックス）✅ **2026年追加 - 分割版**  
**目的**: 管理画面（Next.js）の機能を管理者視点で整理したユーザーストーリー  
**対象**: 開発者・AI（Cursor）  
**重要度**: ⭐⭐⭐ **開発の憲法**

**内容**:
- コラム・記事管理機能（ADM-001〜ADM-003）
- キュレーション記事管理機能（ADM-004〜ADM-005）
- 商品データベース管理機能（ADM-006〜ADM-008）
- ユーザー管理機能（ADM-009〜ADM-010）
- 統計・分析機能（ADM-011）
- 監視・アラート機能（ADM-012〜ADM-015）✅ **2026年追加 - サービス停止防止**

**分割ファイル**（[docs/stories/admin-user-stories/](./docs/stories/admin-user-stories/)）:
- `01-articles.md`: Epic ADM-1（コラム・記事管理機能）
- `02-curations.md`: Epic ADM-2（キュレーション記事管理機能）
- `03-products.md`: Epic ADM-3（商品データベース管理機能）
- `04-users.md`: Epic ADM-4（ユーザー管理機能）
- `05-statistics.md`: Epic ADM-5（統計・分析機能）
- `06-monitoring.md`: Epic ADM-6（監視・アラート機能）

**関連ドキュメント**:
- [docs/stories/USER_STORIES.md](./docs/stories/USER_STORIES.md): モバイルアプリ側のストーリー
- [docs/schema/CONVEX_SCHEMA.md](./docs/schema/CONVEX_SCHEMA.md): スキーマ定義（curations, articlesテーブルなど）
- [docs/design/DESIGN_DOCUMENT.md](./docs/design/DESIGN_DOCUMENT.md): 監視システムの設計（10.8）✅ **2026年追加**

**参照される場所**:
- [docs/stories/USER_STORIES.md](./docs/stories/USER_STORIES.md): Epic 6, Epic 10で参照
- [docs/schema/CONVEX_SCHEMA.md](./docs/schema/CONVEX_SCHEMA.md): キュレーション機能の説明で参照
- [docs/design/DESIGN_DOCUMENT.md](./docs/design/DESIGN_DOCUMENT.md): 監視システムの設計で参照 ✅ **2026年追加**

---

### WEB_USER_STORIES.md / WEB_USER_STORIES_INDEX.md
**パス**: [docs/stories/WEB_USER_STORIES.md](./docs/stories/WEB_USER_STORIES.md)（統合版）、[docs/stories/WEB_USER_STORIES_INDEX.md](./docs/stories/WEB_USER_STORIES_INDEX.md)（インデックス）✅ **2026年追加 - 分割版**  
**目的**: 公式サイト（Next.js + Vercel）の機能をユーザー視点で整理したユーザーストーリー  
**対象**: 開発者・AI（Cursor）  
**重要度**: ⭐⭐⭐ **開発の憲法**

**内容**:
- トップページ・機能紹介（WEB-001〜WEB-002）
- ニュース・更新情報（WEB-003〜WEB-005）
- アプリダウンロード（WEB-006）
- 法務ドキュメント（WEB-007〜WEB-010）
- グローバル公開データの閲覧（将来機能）（WEB-011〜WEB-012）
- SEO・LLM最適化（WEB-013〜WEB-014）
- **ブランド戦略・UI/UXガイドライン** ✅ **2026年追加**:
  - WEB-015: ビジュアル・アイデンティティ（幸福の想起）
  - WEB-016: UIコンポーネントの共通化と拡張
  - WEB-017: ストーリーテリング型のコンテンツ構成
  - WEB-018: FAQセクションの構造化
  - WEB-019: ニュース・更新情報の自動更新
  - WEB-020: 法務ドキュメントの一元管理

**分割ファイル**（[docs/stories/web-user-stories/](./docs/stories/web-user-stories/)）:
- `01-top-page.md`: Epic 1（トップページ・機能紹介）
- `02-news.md`: Epic 2（ニュース・更新情報）
- `03-legal.md`: Epic 3（法務ドキュメント）
- `04-seo.md`: Epic 4（SEO・LLM最適化）
- `05-brand.md`: Epic 5（ブランド戦略・UI/UXガイドライン）
- `06-monorepo.md`: Epic 6（モノレポ運用・自動更新）
- `07-global-data.md`: Epic 7（グローバル公開データの閲覧）

**関連ドキュメント**:
- [docs/stories/USER_STORIES.md](./docs/stories/USER_STORIES.md): モバイルアプリ側のストーリー
- [docs/stories/ADMIN_USER_STORIES.md](./docs/stories/ADMIN_USER_STORIES.md): 管理画面側のストーリー
- [docs/schema/CONVEX_SCHEMA.md](./docs/schema/CONVEX_SCHEMA.md): スキーマ定義（news, legal_documentsテーブルなど）
- [docs/design/DESIGN_DOCUMENT.md](./docs/design/DESIGN_DOCUMENT.md): アプリ設計の詳細（ブランド戦略・UI/UXガイドライン含む）

**参照される場所**:
- [docs/schema/CONVEX_SCHEMA.md](./docs/schema/CONVEX_SCHEMA.md): news, legal_documentsテーブルの説明で参照
- [docs/design/DESIGN_DOCUMENT.md](./docs/design/DESIGN_DOCUMENT.md): 公式サイトの設計で参照

---

### APP_DIRECTORY_STRUCTURE.md
**パス**: [docs/app-structure/APP_DIRECTORY_STRUCTURE.md](./docs/app-structure/APP_DIRECTORY_STRUCTURE.md)  
**目的**: モバイルアプリ（`apps/expo/`）のExpo Routerベースのディレクトリ構成と、各画面に紐づくユーザーストーリーを定義  
**対象**: 開発者・AI（Cursor）  
**重要度**: ⭐⭐⭐ **開発の憲法**

**内容**:
- Expo Routerのディレクトリ構成（`app/(auth)/`, `app/(tabs)/`, `app/pets/`, `app/shop/`, `app/points/`など）
- 各画面パスとユーザーストーリーの対応表
- 主要な画面遷移フロー
- 画面ごとのユーザーストーリーID（US-001〜US-088）

**関連ドキュメント**:
- [docs/stories/USER_STORIES.md](./docs/stories/USER_STORIES.md): 各画面に対応するユーザーストーリーの詳細
- [docs/design/DESIGN_DOCUMENT.md](./docs/design/DESIGN_DOCUMENT.md): アプリ設計の詳細
- [.cursor/rules/PROJECT.md](./.cursor/rules/PROJECT.md): プロジェクトルール

**参照される場所**:
- [docs/stories/USER_STORIES.md](./docs/stories/USER_STORIES.md): 各ストーリーに画面パス（`**画面パス**`）が記載
- [.cursor/rules/PROJECT.md](./.cursor/rules/PROJECT.md): モバイルアプリのディレクトリ構成で参照
- [AGENTS.md](./AGENTS.md): エージェントガイドラインで参照

---

### CONVEX_SCHEMA.md / CONVEX_SCHEMA_INDEX.md
**パス**: [docs/schema/CONVEX_SCHEMA.md](./docs/schema/CONVEX_SCHEMA.md)（統合版）、[docs/schema/CONVEX_SCHEMA_INDEX.md](./docs/schema/CONVEX_SCHEMA_INDEX.md)（インデックス）✅ **2026年追加 - 分割版**  
**目的**: Convexスキーマの定義と実装例  
**対象**: 開発者・AI（Cursor）  
**重要度**: ⭐⭐⭐ **開発の憲法**

**内容**:
- 全テーブルのスキーマ定義
- 各テーブルの目的、主要フィールド、インデックス
- 実装例（Query/Mutation/Action）
- 設計のポイント（論理削除、プレミアム権限管理など）

**分割ファイル**（[docs/schema/convex-schema/](./docs/schema/convex-schema/)）:
- `00-schema-definition.md`: 全テーブルのTypeScript定義
- `01-users.md`: 1. users（ユーザー）
- `02-pets.md`: 2. pets（ペット）
- `03-pet-members.md`: 3. pet_members（共同管理者）
- `05-images.md`: 5. images（画像・動画管理）
- `06-activities.md`: 6. activities（活動ログ）
- `07-products.md`: 7. products（商品データベース）
- `08-reviews.md`: 8. reviews（商品レビュー）
- `09-follows.md`: 9. follows（フォロー関係）
- `10-likes.md`: 10. likes（いいね・リアクション）
- `11-articles.md`: 11. articles（コラム・記事）
- `12-chat-threads.md`: 12. chat_threads（AIチャットスレッド）
- `13-chat-messages.md`: 13. chat_messages（AIチャットメッセージ）
- `14-albums.md`: 14. albums（アルバム）
- `15-album-items.md`: 15. album_items（アルバムアイテム）
- `16-premium-cancellation-reasons.md`: 16. premium_cancellation_reasons（プレミアム解除理由）
- `17-account-deletion-reasons.md`: 17. account_deletion_reasons（退会理由）
- `18-curations.md`: 18. curations（管理者厳選のキュレーション）
- `19-curation-interactions.md`: 19. curation_interactions（キュレーションインタラクション）
- `20-toilet-condition-masters.md`: 20. toilet_condition_masters（トイレ記録用マスターデータ）
- `21-cleaning-action-masters.md`: 21. cleaning_action_masters（清掃アクションマスターデータ）
- `22-reminder-category-masters.md`: 22. reminder_category_masters（リマインダーカテゴリマスターデータ）
- `23-reminders.md`: 23. reminders（リマインダー設定）
- `24-reminder-logs.md`: 24. reminder_logs（リマインダー完了履歴）
- `25-knowledge-base.md`: 25. knowledge_base（知識ベース）
- `26-assets.md`: 26. assets（ショップアイテム）
- `27-badge-definitions.md`: 27. badge_definitions（バッジ定義）
- `28-point-history.md`: 28. point_history（ポイント獲得履歴）
- `29-news.md`: 29. news（ニュース・更新情報）
- `31-diary-scenes.md`: 31. diary_scenes（日記シーンマスターデータ）
- `32-diary-emotions.md`: 32. diary_emotions（日記感情マスターデータ）
- `33-reaction-types.md`: 33. reaction_types（リアクションタイプマスターデータ）
- `34-context-stamps.md`: 34. context_stamps（コンテキストスタンプマスターデータ）
- `35-legal-documents.md`: 35. legal_documents（法務ドキュメント）

**関連ドキュメント**:
- [docs/stories/USER_STORIES.md](./docs/stories/USER_STORIES.md): ユーザーストーリー（各テーブルの使用例）
- [docs/design/DESIGN_DOCUMENT.md](./docs/design/DESIGN_DOCUMENT.md): アプリ設計の詳細
- [docs/design/IMAGE_STORAGE_STRATEGY.md](./docs/design/IMAGE_STORAGE_STRATEGY.md): 画像保存戦略
- [docs/design/AI_CHAT_REVIEW.md](./docs/design/AI_CHAT_REVIEW.md): AIチャット機能のレビュー
- [docs/requirements/SCHEMA_REVIEW.md](./docs/requirements/SCHEMA_REVIEW.md): スキーマ設計のレビュー

**参照される場所**:
- [docs/design/DESIGN_DOCUMENT.md](./docs/design/DESIGN_DOCUMENT.md): データフローの説明で参照
- [docs/stories/USER_STORIES.md](./docs/stories/USER_STORIES.md): 各ストーリーの実装時に参照
- [docs/design/PREMIUM_FEATURES.md](./docs/design/PREMIUM_FEATURES.md): プレミアム機能の実装時に参照

---

### DESIGN_DOCUMENT.md / DESIGN_DOCUMENT_INDEX.md
**パス**: [docs/design/DESIGN_DOCUMENT.md](./docs/design/DESIGN_DOCUMENT.md)（統合版）、[docs/design/DESIGN_DOCUMENT_INDEX.md](./docs/design/DESIGN_DOCUMENT_INDEX.md)（インデックス）✅ **2026年追加 - 分割版**  
**目的**: アプリ設計の詳細（フロー、機能詳細、技術実装）  
**対象**: 開発者・AI（Cursor）  
**重要度**: ⭐⭐

**内容**:
- プロジェクト概要
- データフロー（認証、ペット登録、活動ログ記録、AI相談など）
- 機能詳細（AI相談機能、コラム機能、SNS機能など）
- 技術実装の詳細

**分割ファイル**（[docs/design/design-document/](./docs/design/design-document/)）:
- `01-project-overview.md`: 1. プロジェクト概要
- `02-data-model.md`: 2. データモデル設計
- `03-data-flow.md`: 3. データフロー設計
- `04-features.md`: 4. 機能設計
- `05-screens.md`: 5. 画面設計（Phase 1）
- `06-api-design.md`: 6. API設計（Convex Functions）
- `07-security.md`: 7. セキュリティ設計
- `08-performance.md`: 8. パフォーマンス最適化
- `09-extensibility.md`: 9. 将来の拡張性
- `10-constraints.md`: 10. 技術的制約と考慮事項
- `11-glossary.md`: 11. 用語集

**関連ドキュメント**:
- [docs/schema/CONVEX_SCHEMA.md](./docs/schema/CONVEX_SCHEMA.md): スキーマ定義
- [docs/stories/USER_STORIES.md](./docs/stories/USER_STORIES.md): ユーザーストーリー
- [docs/design/TECH_STACK_PLANNING.md](./docs/design/TECH_STACK_PLANNING.md): 技術選定の詳細

**参照される場所**:
- [docs/stories/USER_STORIES.md](./docs/stories/USER_STORIES.md): 機能詳細の説明で参照
- [docs/schema/CONVEX_SCHEMA.md](./docs/schema/CONVEX_SCHEMA.md): 実装例の説明で参照

---

### PREMIUM_FEATURES.md
**パス**: [docs/design/PREMIUM_FEATURES.md](./docs/design/PREMIUM_FEATURES.md)  
**目的**: プレミアム機能の定義と制限  
**対象**: 開発者・AI（Cursor）  
**重要度**: ⭐⭐

**内容**:
- Phase 1〜3のプレミアム限定機能
- 無料プランで利用可能な機能
- 機能制限の詳細

**関連ドキュメント**:
- [docs/stories/USER_STORIES.md](./docs/stories/USER_STORIES.md): 各ストーリーのプレミアム制限
- [docs/schema/CONVEX_SCHEMA.md](./docs/schema/CONVEX_SCHEMA.md): プレミアム権限管理の実装例
- [docs/design/IMAGE_STORAGE_STRATEGY.md](./docs/design/IMAGE_STORAGE_STRATEGY.md): 画像管理のプレミアム制限

**参照される場所**:
- [docs/schema/CONVEX_SCHEMA.md](./docs/schema/CONVEX_SCHEMA.md): プレミアム権限管理の説明で参照
- [docs/stories/USER_STORIES.md](./docs/stories/USER_STORIES.md): 各ストーリーの機能制限で参照

---

### IMAGE_STORAGE_STRATEGY.md ✅ **2026年更新**
**パス**: [docs/design/IMAGE_STORAGE_STRATEGY.md](./docs/design/IMAGE_STORAGE_STRATEGY.md)  
**目的**: 画像・動画保存戦略とCloudflare R2移行 ✅ **2026年更新**  
**対象**: 開発者・AI（Cursor）  
**重要度**: ⭐⭐⭐

**内容**:
- Cloudflare R2への移行設計（コスト削減、パフォーマンス向上、スケーラビリティ） ✅ **2026年追加**
- Cloudflare R2の無料枠と制限 ✅ **2026年追加**
- 画像データサイズの試算
- 動画データサイズの試算 ✅ **2026年追加**
- 無料ユーザーとプレミアムユーザーの機能差別化（画像・動画） ✅ **2026年更新**
- ダブルストレージ構造（Preview/Original）
- WebP形式の採用理由（画像）
- HEVC形式の採用理由（動画） ✅ **2026年追加**
- 動画の自動圧縮 ✅ **2026年追加**
- スキーマ設計（R2関連フィールド、動画関連フィールド） ✅ **2026年更新**
- 画像・動画アップロード・処理フロー（R2経由） ✅ **2026年更新**
- 画像・動画表示ロジック（R2 URL使用） ✅ **2026年更新**
- コスト試算（Cloudflare R2 vs Convex File Storage） ✅ **2026年更新**

**関連ドキュメント**:
- [docs/schema/CONVEX_SCHEMA.md](./docs/schema/CONVEX_SCHEMA.md): imagesテーブルの定義（R2関連フィールド、動画関連フィールド）
- [docs/design/PREMIUM_FEATURES.md](./docs/design/PREMIUM_FEATURES.md): 画像・動画管理のプレミアム機能
- [docs/stories/USER_STORIES.md](./docs/stories/USER_STORIES.md): US-051〜US-054（画像管理機能）、US-092〜US-095（動画管理機能） ✅ **2026年追加**
- [docs/design/CLOUDFLARE_R2_MIGRATION.md](./docs/design/CLOUDFLARE_R2_MIGRATION.md): Cloudflare R2移行設計 ✅ **2026年追加**

**参照される場所**:
- [docs/schema/CONVEX_SCHEMA.md](./docs/schema/CONVEX_SCHEMA.md): imagesテーブルの説明で参照
- [docs/design/PREMIUM_FEATURES.md](./docs/design/PREMIUM_FEATURES.md): 画像・動画管理機能の説明で参照
- [docs/design/DESIGN_DOCUMENT.md](./docs/design/DESIGN_DOCUMENT.md): 画像・動画保存戦略の説明で参照

---

### AI_CHAT_DISCLAIMER.md
**パス**: [docs/design/AI_CHAT_DISCLAIMER.md](./docs/design/AI_CHAT_DISCLAIMER.md)  
**目的**: AIチャット免責事項（ディスクレイマー）の設計  
**対象**: 開発者・AI（Cursor）  
**重要度**: ⭐⭐

**内容**:
- UI/UX設計（3つの表示タイミング）
- テーブル設計（disclaimerShown, disclaimerType）
- システムプロンプトでの制御
- 動的な警告表示の実装例
- デザインの方向性
- 免責事項の文言テンプレート

**関連ドキュメント**:
- [docs/schema/CONVEX_SCHEMA.md](./docs/schema/CONVEX_SCHEMA.md): chat_messagesテーブルの定義
- [docs/design/AI_CHAT_REVIEW.md](./docs/design/AI_CHAT_REVIEW.md): AIチャット機能のレビュー
- [docs/stories/USER_STORIES.md](./docs/stories/USER_STORIES.md): US-020〜US-025（AI相談機能）

**参照される場所**:
- [docs/schema/CONVEX_SCHEMA.md](./docs/schema/CONVEX_SCHEMA.md): chat_messagesテーブルの説明で参照
- [docs/stories/USER_STORIES.md](./docs/stories/USER_STORIES.md): US-020の受け入れ基準で参照

---

### AI_CHAT_REVIEW.md
**パス**: [docs/design/AI_CHAT_REVIEW.md](./docs/design/AI_CHAT_REVIEW.md)  
**目的**: AIチャット機能の設計レビュー（ユーザー・ペット情報へのアクセス、RAG統合）  
**対象**: 開発者  
**重要度**: ⭐

**内容**:
- 良い点（RAGアーキテクチャ、スキーマ設計）
- 問題点と改善案（認証チェック、権限チェック、ユーザー情報の欠如など）
- 実装チェックリスト

**関連ドキュメント**:
- [docs/schema/CONVEX_SCHEMA.md](./docs/schema/CONVEX_SCHEMA.md): AIチャット機能の実装例
- [docs/design/AI_CHAT_DISCLAIMER.md](./docs/design/AI_CHAT_DISCLAIMER.md): 免責事項の設計
- [docs/stories/USER_STORIES.md](./docs/stories/USER_STORIES.md): US-020〜US-025（AI相談機能）

**参照される場所**:
- [docs/schema/CONVEX_SCHEMA.md](./docs/schema/CONVEX_SCHEMA.md): AI機能の信頼性確保の説明で参照

---

### SCHEMA_REVIEW.md
**パス**: [docs/requirements/SCHEMA_REVIEW.md](./docs/requirements/SCHEMA_REVIEW.md)  
**目的**: スキーマ設計のレビュー結果  
**対象**: 開発者  
**重要度**: ⭐

**内容**:
- スキーマ設計のレビュー結果
- 改善提案
- 将来の拡張性の検証

**関連ドキュメント**:
- [docs/schema/CONVEX_SCHEMA.md](./docs/schema/CONVEX_SCHEMA.md): レビュー対象のスキーマ
- [docs/stories/USER_STORIES.md](./docs/stories/USER_STORIES.md): ユーザーストーリーとの整合性確認

**参照される場所**:
- [docs/schema/CONVEX_SCHEMA.md](./docs/schema/CONVEX_SCHEMA.md): 設計のポイントで参照

---

### REQUIREMENTS_REVIEW.md
**パス**: [docs/requirements/REQUIREMENTS_REVIEW.md](./docs/requirements/REQUIREMENTS_REVIEW.md)  
**目的**: 要件定義のレビュー結果  
**対象**: 開発者  
**重要度**: ⭐

**内容**:
- 要件定義のレビュー結果
- 不足している要件の指摘
- 改善提案

**関連ドキュメント**:
- [docs/stories/USER_STORIES.md](./docs/stories/USER_STORIES.md): 要件定義の基盤
- [docs/design/DESIGN_DOCUMENT.md](./docs/design/DESIGN_DOCUMENT.md): 設計ドキュメントとの整合性確認

**参照される場所**:
- [docs/stories/USER_STORIES.md](./docs/stories/USER_STORIES.md): 要件の確認時に参照

---

### DOCUMENT_REVIEW.md
**パス**: [docs/requirements/DOCUMENT_REVIEW.md](./docs/requirements/DOCUMENT_REVIEW.md)  
**目的**: ドキュメント全体のレビュー結果  
**対象**: 開発者  
**重要度**: ⭐

**内容**:
- ドキュメント全体のレビュー結果
- 整合性の確認
- 改善提案

**関連ドキュメント**:
- すべてのドキュメント

**参照される場所**:
- このドキュメント（DOCUMENTATION_INDEX.md）で参照

---

### TECH_STACK_PLANNING.md
**パス**: [docs/design/TECH_STACK_PLANNING.md](./docs/design/TECH_STACK_PLANNING.md)  
**目的**: 技術選定の詳細と理由  
**対象**: 開発者  
**重要度**: ⭐

**内容**:
- 技術スタックの選定理由
- 各技術の採用理由
- 将来の拡張性の考慮

**関連ドキュメント**:
- [docs/design/DESIGN_DOCUMENT.md](./docs/design/DESIGN_DOCUMENT.md): アプリ設計の詳細
- [AGENTS.md](./AGENTS.md): 開発ガイドライン

**参照される場所**:
- [AGENTS.md](./AGENTS.md): 技術スタックの説明で参照
- [docs/design/DESIGN_DOCUMENT.md](./docs/design/DESIGN_DOCUMENT.md): 技術実装の説明で参照

---

### .cursor/rules/PROJECT.md
**パス**: `./.cursor/rules/PROJECT.md`  
**目的**: プロジェクトルール（コードスタイル、ワークフロー、コマンド）  
**対象**: 開発者・AI（Cursor）  
**重要度**: ⭐⭐⭐ **基本ルール**

**内容**:
- プロジェクト構成
- コマンドリファレンス
- コードスタイル（TypeScript、React Native、Convex、Next.js）
- ワークフロー（開発フロー、ファイル構造、Gitワークフロー）
- MCP設定
- 重要な注意事項

**関連ドキュメント**:
- `AGENTS.md`: Cursorエージェントの使い方
- `CLAUDE.md`: Claude AI固有の設定
- `.cursor/skills/`: 各種Skills

**参照される場所**:
- `AGENTS.md`: プロジェクト基本情報の参照先として
- `CLAUDE.md`: プロジェクト基本情報の参照先として
- すべてのドキュメント（基本ルールとして）

---

### AGENTS.md
**パス**: `./AGENTS.md`  
**目的**: Cursorエージェントの使い方とガイドライン  
**対象**: 開発者・AI（Cursor）  
**重要度**: ⭐⭐

**内容**:
- Plan Modeの活用
- コンテキスト管理
- 開発フロー
- モノレポでの作業（参照先へのリンク）
- 技術スタック固有の注意事項（参照先へのリンク）

**関連ドキュメント**:
- `.cursor/rules/PROJECT.md`: プロジェクト基本情報の参照先
- `DOCUMENTATION_INDEX.md`: ドキュメント全体へのアクセス
- `.cursor/skills/documentation-access/SKILL.md`: ドキュメントへの効率的なアクセス方法

**参照される場所**:
- すべてのドキュメント（開発ガイドラインとして）

---

### SETUP_CHECKLIST.md
**パス**: `./SETUP_CHECKLIST.md`  
**目的**: セットアップ前のチェックリスト  
**対象**: 開発者  
**重要度**: ⭐⭐

**内容**:
- セットアップ前に確認すべき項目
- 環境変数の設定
- 依存関係のインストール
- 各種サービスの設定（Convex、Clerkなど）

**関連ドキュメント**:
- [docs/design/TECH_STACK_PLANNING.md](./docs/design/TECH_STACK_PLANNING.md): 技術スタックの詳細
- [AGENTS.md](./AGENTS.md): 開発ガイドライン

**参照される場所**:
- [AGENTS.md](./AGENTS.md): セットアップの説明で参照

---

### CLAUDE.md
**パス**: `./CLAUDE.md`  
**目的**: Claude AI固有の設定と補足  
**対象**: 開発者・AI（Claude）  
**重要度**: ⭐⭐

**内容**:
- Cursorルールとの併用方法
- 関数型プログラミングの原則
- 変数名の規則
- 型安全性の確保
- 開発フロー
- MCP設定の推奨事項

**関連ドキュメント**:
- [AGENTS.md](./AGENTS.md): Cursorエージェントガイドライン
- [.cursor/rules/PROJECT.md](./.cursor/rules/PROJECT.md): プロジェクトルール
- [docs/stories/USER_STORIES.md](./docs/stories/USER_STORIES.md): ユーザーストーリー

**参照される場所**:
- [AGENTS.md](./AGENTS.md): Claude固有の設定として参照

---

### OBSIDIAN_SETUP.md ✅ **2026年追加**
**パス**: `./OBSIDIAN_SETUP.md`  
**目的**: Obsidian設定ガイド  
**対象**: 開発者  
**重要度**: ⭐

**内容**:
- Obsidianのセットアップ手順
- 推奨プラグインのインストール方法
- 既存のMarkdownドキュメントとの統合方法
- ワークフロー例

**関連ドキュメント**:
- `.obsidian/README.md`: Obsidian設定の詳細
- `DOCUMENTATION_INDEX.md`: ドキュメント構造の理解

**参照される場所**:
- `.obsidian/README.md`: 設定ファイルの説明で参照

---

## 🔗 ドキュメント間の関係図

```
┌─────────────────────────────────────────────────────────────┐
│                   開発の憲法（必須読了）                      │
├─────────────────────────────────────────────────────────────┤
│  docs/stories/ (USER_STORIES  ←→  ADMIN_USER_STORIES)      │
│         ↓                    ↓                              │
│  docs/schema/  ←→  docs/design/DESIGN_DOCUMENT             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   機能別設計書                                │
├─────────────────────────────────────────────────────────────┤
│  docs/design/ (PREMIUM_FEATURES, IMAGE_STORAGE_STRATEGY,   │
│    CLOUDFLARE_R2_MIGRATION, AI_CHAT_*)                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   レビュー・検証                              │
├─────────────────────────────────────────────────────────────┤
│  docs/requirements/ (SCHEMA, REQUIREMENTS, DOCUMENT_REVIEW) │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   開発ガイド                                  │
├─────────────────────────────────────────────────────────────┤
│  .cursor/rules/PROJECT.md (基本ルール)                      │
│         ↓                                                    │
│  AGENTS.md  ←→  SETUP_CHECKLIST.md                        │
│  CLAUDE.md  ←→  docs/design/TECH_STACK_PLANNING            │
│  ISSUE_GUIDELINES  ←→  docs/implementation/EPIC_OVERVIEW   │
│  docs/design/ (PENCIL_DESIGN_BRIEF, DIARY_DRAFT_VERIFICATION,│
│    CLOUDFLARE_R2_MIGRATION)                                │
│  DOCUMENTATION_INDEX.md (このドキュメント)                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 ドキュメント更新履歴

### 2026-02-07
- **アプリケーション関連ドキュメントの整理**: 要件・設計・ストーリー・スキーマ等を [docs/](docs/README.md) に文脈別に移動
  - **docs/stories/**: ユーザーストーリー（モバイル・管理画面・公式サイト）と分割ファイル
  - **docs/requirements/**: 要件・レビュー・議事録（REQUIREMENTS_REVIEW, DOCUMENT_REVIEW, DOCUMENT_REVIEW_2026, SCHEMA_REVIEW）
  - **docs/design/**: 詳細設計・アーキテクチャ・機能別設計書（DESIGN_DOCUMENT, TECH_STACK_PLANNING, IMAGE_STORAGE_STRATEGY, CLOUDFLARE_R2_MIGRATION, PENCIL_DESIGN_BRIEF, PREMIUM_FEATURES, AI_CHAT_*, DIARY_DRAFT_VERIFICATION 等）
  - **docs/schema/**: Convexスキーマ定義と分割ファイル
  - **docs/app-structure/**: APP_DIRECTORY_STRUCTURE
  - **docs/implementation/**: EPIC_OVERVIEW, EPIC_IMPLEMENTATION_PLAN, IMPLEMENTATION_PHASES
- 設定用ファイル（AGENTS.md, CLAUDE.md, .cursor/, MISE_SETUP.md 等）はルートに維持
- DOCUMENTATION_INDEX および各 INDEX のリンクを docs/ パスに更新
- AGENTS.md, CLAUDE.md, .cursor/rules/PROJECT.md の参照パスを更新

### 2026-02-01
- `DOCUMENTATION_INDEX.md`を作成
- アプリ側と管理画面側のストーリーを分離（`USER_STORIES.md`と`ADMIN_USER_STORIES.md`）
- AIチャット免責事項の設計を追加（`AI_CHAT_DISCLAIMER.md`）
- 管理者厳選のキュレーション機能を追加
- アルバム管理機能を追加
- **最終設計検証の反映**:
  - データライフサイクルと物理削除のタイミング（Cronジョブ、GDPR対応）を追加
  - オフラインエクスペリエンス（画像アップロードキュー管理）を追加
  - 追悼（メモリアル）プランの導入を追加
  - 家族共有の競合解決（楽観的ロック）を追加
- **ゲーミフィケーション要素の追加**:
  - ポイント獲得システム（US-068）を追加
  - バッジ獲得システム（US-069）を追加
  - ショップ機能（US-070）を追加
  - プロフィール画面でのバッジ・アイテム表示（US-071）を追加
  - `CONVEX_SCHEMA.md`に`assets`、`badge_definitions`、`point_history`テーブルを追加
  - `users`テーブルに`points`、`badges`、`unlockedAssets`フィールドを追加
- **商品データベース機能の強化**:
  - 商品検索機能の体験向上（US-044）を更新
  - 商品詳細表示にアソシエイトAPI情報の表示を追加（US-045）を更新
  - 商品登録にアソシエイトAPI連携を追加（US-046）を更新（スクレイピングからAmazon/楽天APIへ変更）
  - レビュー投稿に餌のレビュー専用フィールドを追加（US-048）を更新
  - `CONVEX_SCHEMA.md`の`products`テーブルに`manufacturer`、`description`、`foodInfo`、`affiliateApiInfo`フィールドを追加
  - `CONVEX_SCHEMA.md`の`reviews`テーブルに`foodReviewDetails`、`isPublic`フィールドを追加
  - アソシエイトAPI（Amazon/楽天）の実装例を追加
  - **商品データ取得戦略の追加**:
    - 初回シード（一括データ蓄積）とオンデマンド更新（1日1回制限）の分離設計を追加
    - `CONVEX_SCHEMA.md`の`products`テーブルに`lastUpdatedAt`、`createdAt`、`price`、`originalPrice`、`discountRate`、`currency`、`availability`、`amazonRating`、`amazonReviewCount`、`viewCount`、`lastViewedAt`フィールドを追加
    - `CONVEX_SCHEMA.md`に`by_asin`、`by_last_updated`、`by_view_count`インデックスを追加
    - 初回シード用の`seedProductsByCategory` Action、オンデマンド更新用の`updateProductFromApi` Action、定期Cron更新用の`updatePopularProductsBatch` Actionの実装例を追加
    - `DESIGN_DOCUMENT.md`に「4.3.2.1 商品データ取得戦略」セクションを追加
    - `DESIGN_DOCUMENT.md`のAPI設計セクション（6.5）にデータ取得関連の関数を追加
  - **管理画面の商品閲覧機能の追加**:
    - `ADMIN_USER_STORIES.md`に「ADM-006: 商品一覧・詳細閲覧」ストーリーを追加
    - `DESIGN_DOCUMENT.md`の「5.7 管理者用画面（運営）」に商品一覧・詳細閲覧画面の設計を追加
    - `DESIGN_DOCUMENT.md`のAPI設計セクション（6.5）に管理画面用のQuery関数（`getProductsForAdmin`、`getProductDetailForAdmin`）を追加
  - **商品カテゴリの優先順位の明確化**:
    - Phase 1（最優先）: ペットの餌（food）
    - Phase 2（次優先）: ペットのトイレ用品（litter）
    - Phase 3（その他）: その他の用品（toy, cage, accessory, insuranceなど）
    - `CONVEX_SCHEMA.md`の`products`テーブル説明に優先順位を追加
    - `DESIGN_DOCUMENT.md`の「5.7 管理者用画面（運営）」に優先順位を追加
    - `ADMIN_USER_STORIES.md`の「ADM-006: 商品一覧・詳細閲覧」に優先順位を追加
  - **食事記録の前回入力内容保持機能の追加**:
    - `USER_STORIES.md`の「US-008: 食事記録」に前回の入力内容を保持し、デフォルトで入力できる機能を追加
    - `DESIGN_DOCUMENT.md`の「5.4 記録画面」に食事記録の詳細設計（前回入力内容の自動表示）を追加
    - `DESIGN_DOCUMENT.md`のAPI設計セクション（6.3）に`getLastFeedingActivity` Query関数を追加
    - `CONVEX_SCHEMA.md`の`activities`テーブルの使用例に前回の食事記録を取得する実装例を追加
  - **トイレ記録の種別ごとの最適化**:
    - `CONVEX_SCHEMA.md`にマスターデータテーブル（`toilet_condition_masters`, `cleaning_action_masters`）を追加
    - `CONVEX_SCHEMA.md`の`activities`テーブルの`payload`を拡張（種別ごとの詳細な状態情報を保存）
      - 全種共通の基本的な状態（絶好調/いつもと違う/異常あり）
      - 犬・猫: 便の状態、尿の状態の詳細フィールド
      - 鳥類・爬虫類: 排泄物の色、尿酸の状態、水分量のフィールド
      - うさぎ・ハムスター: フンの数・大きさ、盲腸便のフィールド
      - 清掃アクション（全種共通）
    - `USER_STORIES.md`の「US-009: トイレ記録」を更新（種別ごとの最適化された選択肢、動的UI表示、前回の記録表示）
    - `DESIGN_DOCUMENT.md`の「5.4 記録画面」にトイレ記録の詳細設計（種別ごとのUI、動的セグメントコントロール）を追加
    - `DESIGN_DOCUMENT.md`のAPI設計セクション（6.3.1）にマスターデータ取得用のQuery関数（`getToiletConditionMasters`, `getCleaningActionMasters`, `getLastToiletActivity`）を追加
    - `CONVEX_SCHEMA.md`にマスターデータテーブルの説明セクション（20, 21）を追加
  - **リマインダー機能の追加（掃除のタイマー・リマインダー）**:
    - `CONVEX_SCHEMA.md`にリマインダー関連テーブル（`reminder_category_masters`, `reminders`, `reminder_logs`）を追加
      - `reminder_category_masters`: 種別ごとのプリセットリマインダーカテゴリを管理
      - `reminders`: ユーザーが設定したリマインダーを管理（プリセットとカスタムの両方に対応）
      - `reminder_logs`: リマインダーの完了履歴を記録（ポイント付与の根拠）
    - `USER_STORIES.md`に「US-014: リマインダー設定」「US-015: リマインダー通知と完了」を追加
      - ペットの種類に応じたおすすめリマインダーの表示
      - カスタムリマインダーの設定（テキスト自由入力）
      - 柔軟な頻度設定（毎日、毎週、隔週、毎月、間隔指定）
      - Push通知と完了記録
      - トイレ記録などから自動完了
    - `DESIGN_DOCUMENT.md`の「5.4 記録画面」にリマインダー設定画面と通知・完了画面の設計を追加
    - `DESIGN_DOCUMENT.md`のAPI設計セクション（6.3.2）にリマインダー関連のQuery/Mutation関数を追加
      - `getReminderCategoryMasters`, `createReminder`, `updateReminder`, `deleteReminder`, `getRemindersByPet`, `getTodayReminders`, `completeReminder`, `calculateNextNotificationAt`
    - `CONVEX_SCHEMA.md`にリマインダーテーブルの説明セクション（22, 23, 24）を追加
  - **無料ユーザーへの広告表示機能の追加**:
    - `USER_STORIES.md`に「US-018: 広告表示（無料ユーザー）」を追加
      - 主要機能の操作を邪魔しない配置（記録入力中、アルバム全画面表示には表示しない）
      - 自然なカードとして表示（日記タイムラインの合間、キュレーション記事一覧、リマインダー完了後のサンクス画面）
      - プレミアム移行への導線（広告枠が思い出枠に差し替わる、さりげない比較メッセージ）
      - 過剰な露出の防止（広告の表示頻度を制御）
    - `PREMIUM_FEATURES.md`に「10. 広告なしの快適な体験」セクションを追加
      - 無料ユーザーには一部Googleなどの広告が表示される
      - プレミアムユーザーは広告が一切表示されない
      - 広告枠の差し替え（プレミアムに切り替えた瞬間、広告が表示されていた場所が「過去の同じ日の思い出」などのパーソナライズされたコンテンツに差し替わる）
    - `CONVEX_SCHEMA.md`の`users`テーブルに`adLastSeenAt`、`adLastClickedAt`フィールドを追加（広告の表示頻度制御用）
    - `DESIGN_DOCUMENT.md`の「5.3 ペット詳細画面」にタイムラインの広告表示設計を追加
    - `DESIGN_DOCUMENT.md`の「5.6 コラム画面」にキュレーション記事一覧の広告表示設計を追加
    - `DESIGN_DOCUMENT.md`の「5.4 記録画面」にリマインダー完了後のサンクス画面の広告表示設計を追加
    - `DESIGN_DOCUMENT.md`の「5.10 設定画面」にプレミアム移行への導線設計を追加
    - `DESIGN_DOCUMENT.md`のAPI設計セクション（6.14）に広告表示管理の実装設計を追加
      - 広告表示の制御、広告配置の実装、プレミアム移行の導線、広告クリックの記録
  - **タイムラインビューの拡張機能の追加**:
    - `USER_STORIES.md`に「US-013-1: タイムラインビューの拡張機能（フィルター・リマインダー完了状況）」を追加
      - ペットでの絞り込み機能（複数ペット対応）
      - 記録タイプでのフィルター機能（日記、トイレ、餌など、複数選択可能）
      - リマインダー完了状況の表示（完了/未完了の可視化）
      - 詳細画面への遷移と戻る機能（スクロール位置とフィルター設定の保持）
    - `DESIGN_DOCUMENT.md`の「5.3 ペット詳細画面」にタイムラインビューの拡張機能の設計を追加
      - ペット選択UI、記録タイプフィルターUI、リマインダー完了状況の表示、詳細画面への遷移と戻る機能
    - `DESIGN_DOCUMENT.md`のAPI設計セクション（6.3）に`getTimelineWithFilters`関数を追加
      - ペットID、記録タイプ、日付範囲でフィルター可能
      - リマインダー完了記録を含めるかどうかを指定可能
      - ページネーション対応
    - `DESIGN_DOCUMENT.md`のAPI設計セクション（6.3.2）に`getReminderLogsForTimeline`関数を追加
      - タイムライン統合用のリマインダー完了記録取得
      - 活動ログと統合しやすい形式で返す
  - **公式サイト（Next.js + Vercel）の追加**:
    - `WEB_USER_STORIES.md`を新規作成
      - トップページ・機能紹介（WEB-001〜WEB-002）
      - ニュース・更新情報（WEB-003〜WEB-005）
      - アプリダウンロード（WEB-006）
      - 法務ドキュメント（WEB-007〜WEB-010）
      - グローバル公開データの閲覧（将来機能）（WEB-011〜WEB-012）
      - SEO・LLM最適化（WEB-013〜WEB-014）
    - `CONVEX_SCHEMA.md`に`news`テーブルを追加（29番目のテーブル）
      - ニュースのタイトル、本文、カテゴリ、公開日時などを管理
      - 公開済みニュースの一覧取得、カテゴリ別フィルタリングに対応
    - `CONVEX_SCHEMA.md`に`legal_documents`テーブルを追加（35番目のテーブル）
      - プライバシーポリシー、利用規約、特定商取引法表記、Amazonアソシエイト規約、Google AdMob規約、外部送信規約などを管理
      - バージョン管理と改定履歴に対応
    - `DESIGN_DOCUMENT.md`の「5.11 公式サイト（Next.js + Vercel）」セクションを追加
      - トップページ、機能詳細ページ、ニュース・更新情報ページ、法務ドキュメントページ、アプリダウンロードページ、グローバル公開データのギャラリー（将来機能）の設計
      - SEO最適化とLLMフレンドリーな構成の設計
    - `DESIGN_DOCUMENT.md`のAPI設計セクション（6.16）に公式サイト関連のAPIを追加
      - ニュース関連（`getNews`, `getNewsById`, `getLatestNews`, `createNews`, `updateNews`, `deleteNews`, `publishNews`）
      - 法務ドキュメント関連（`getLegalDocument`, `getLegalDocumentByVersion`, `getLegalDocumentHistory`, `createLegalDocument`, `updateLegalDocument`）
      - 統計情報（`getPublicStats`）
      - グローバル公開データ（将来機能）（`getPublicPets`, `getPublicPetById`, `getPublicBadges`, `getPublicAlbums`）
      - SEO・LLM最適化（sitemap.xml、robots.txt、構造化データ、API Route）
  - **公式サイトのブランド戦略・UI/UXガイドラインの追加**:
    - `WEB_USER_STORIES.md`にブランド戦略・UI/UXガイドラインのストーリーを追加
      - WEB-015: ビジュアル・アイデンティティ（幸福の想起）
      - WEB-016: UIコンポーネントの共通化と拡張
      - WEB-017: ストーリーテリング型のコンテンツ構成
      - WEB-018: FAQセクションの構造化
      - WEB-019: ニュース・更新情報の自動更新
      - WEB-020: 法務ドキュメントの一元管理
    - `WEB_USER_STORIES.md`のWEB-001（トップページ表示）にストーリーテリング型のコンテンツ構成を追加
      - Empathy（共感）、Solution（解決）、Future（未来）、Social Proof（信頼）のセクション
    - `WEB_USER_STORIES.md`のWEB-002（機能詳細ページ表示）にインタラクティブ・デモと機能ごとの専用サブページを追加
    - `WEB_USER_STORIES.md`のWEB-014（LLMフレンドリーな構成）にFAQセクションの構造化を追加
    - `WEB_USER_STORIES.md`に新しいエピックを追加
      - Epic 5: ブランド戦略・UI/UXガイドライン
      - Epic 6: モノレポ運用・自動更新
    - `DESIGN_DOCUMENT.md`の「5.11 公式サイト（Next.js + Vercel）」セクションを大幅に拡張
      - 5.11.1: ブランド戦略：公式サイトの役割
      - 5.11.2: ビジュアル・アイデンティティ：幸福の想起（メインビジュアル、カラーパレット、タイポグラフィ）
      - 5.11.3: UIコンポーネントの共通化と拡張（インタラクティブ・デモ、カードデザインの共通化）
      - 5.11.4: ストーリーテリング型のコンテンツ構成（Empathy、Solution、Future、Social Proof）
      - 5.11.5: トップページ（メインビジュアル、ストーリーテリング型のコンテンツ構成）
      - 5.11.6: 機能詳細ページ（機能ごとの専用サブページ、インタラクティブ・デモ）
      - 5.11.7: ニュース・更新情報ページ（自動更新）
      - 5.11.8: 法務ドキュメントページ（一元管理）
      - 5.11.10: FAQセクション（SEO・LLM最適化）
    - `DESIGN_DOCUMENT.md`のAPI設計セクション（6.16）に追加情報を追加
      - ニュース関連の自動更新（On-demand ISR）
      - 法務ドキュメント関連の一元管理（`packages/policy/`との同期）
      - FAQ関連（Markdown管理、FAQPageの構造化データ）
  - **アプリディレクトリ構成の追加**:
    - `APP_DIRECTORY_STRUCTURE.md`を作成
    - Expo Routerベースのディレクトリ構成を定義（`app/(auth)/`, `app/(tabs)/`, `app/pets/`, `app/shop/`, `app/points/`など）
    - 各ユーザーストーリーに画面パス（`app/...`）を追加
    - 画面とストーリーの対応表を作成
    - 主要な画面遷移フローを定義
  - **監視・アラートシステムの追加** ✅ **2026年追加 - サービス停止防止**:
    - `ADMIN_USER_STORIES.md`に監視システム関連のストーリーを追加（ADM-012〜ADM-015）
      - ADM-012: Convexリソース監視ダッシュボード表示
      - ADM-013: Discord日報送信設定と履歴確認
      - ADM-014: Better Stack連携設定
      - ADM-015: アラート設定
    - `DESIGN_DOCUMENT.md`に監視システムの設計セクションを追加（10.8）
      - Convexリソース監視の仕組み
      - Discord日報送信の仕組み
      - Better Stack連携の仕組み
      - アラート機能の仕組み
      - ダッシュボードでの可視化
  - **GitHub Issue化の準備** ✅ **2026年追加**:
    - `ISSUE_GUIDELINES.md`を作成
      - ユーザーストーリーからIssueへの変換方法
      - 依存関係の記載方法
      - 画面パスの記載方法
      - エピックの記載方法
      - 受け入れ基準のチェックリスト化
    - `EPIC_OVERVIEW.md`を作成
      - 各エピックの概要とストーリー一覧
      - エピック間の依存関係
      - エピック単位での進捗管理方法
    - `.github/ISSUE_TEMPLATE/ai-task.yml`を拡張
      - 依存関係フィールドの追加
      - 画面パスフィールドの追加
      - エピックフィールドの追加
  - **Pencilデザインブリーフの作成** ✅ **2026年追加**:
    - `PENCIL_DESIGN_BRIEF.md`を作成
      - 画面単位のユーザーストーリーとデザイン要件を整理
      - 32画面のデザインブリーフを記載
      - デザインシステム（カラーパレット、タイポグラフィ、スペーシング、コンポーネントライブラリ）を定義
      - Pencilでのデザイン作成手順とデザインからコードへの変換方法を記載
  - **日記の更新・削除・下書き機能の検証** ✅ **2026年追加**:
    - `DIARY_DRAFT_VERIFICATION.md`を作成
      - 現在のユーザーストーリー（US-077、US-078）の確認と不足点を整理
      - Convexでの実現可能性検証（日記の更新・削除、下書き機能、リアルタイム保存）
      - 追加が必要なユーザーストーリー（US-089、US-090、US-091、US-077-1、US-078-1）を提案
      - スキーマ変更の提案（`isDraft`フラグの追加）と実装時の注意事項を記載
  - **動画機能の追加とCloudflare R2への移行** ✅ **2026年追加**:
    - `CLOUDFLARE_R2_MIGRATION.md`を作成
      - Cloudflare R2への移行設計（コスト削減、パフォーマンス向上、スケーラビリティ）
      - R2の設定（バケット作成、CORS設定、カスタムドメイン、APIキー発行）
      - アーキテクチャ設計（データフロー、メタデータ管理）
      - スキーマ変更（`images`テーブルのR2関連フィールド追加）
      - 実装詳細（Presigned URL発行、クライアント側アップロード、動画圧縮）
      - コスト試算（Cloudflare R2の料金、動画の容量試算、無料枠での制限設計）
      - Terraform設定（R2バケット、DNSレコード、CORS設定）
      - 移行計画（段階的移行、移行スクリプト）
    - `USER_STORIES.md`に動画管理機能のストーリーを追加
      - US-092: 動画のアップロード
      - US-093: 動画の再生
      - US-094: 動画の制限と案内
      - US-095: 動画のダウンロード
    - `CONVEX_SCHEMA.md`の`images`テーブルを更新
      - `mediaType`フィールドを追加（画像 or 動画）
      - R2関連フィールド（`r2Key`, `r2Url`, `thumbnailR2Key`, `thumbnailR2Url`）を追加
      - 動画関連フィールド（`videoDuration`, `videoCodec`, `videoResolution`）を追加
      - 後方互換性のため、既存のConvex Storage IDも保持（移行期間中）
    - `IMAGE_STORAGE_STRATEGY.md`を更新
      - Cloudflare R2への移行設計を追加
      - 動画データ量の試算を追加
      - 動画の自動圧縮（HEVC形式）の設計を追加
      - スキーマ設計を更新（R2関連フィールド、動画関連フィールド）
      - アップロード処理フローをR2対応に更新
      - 動画アップロード・処理フローを追加
    - `DESIGN_DOCUMENT.md`を更新
      - 画像・動画保存戦略セクションを更新（Cloudflare R2移行、動画対応）
    - `EPIC_OVERVIEW.md`を更新（Epic 12に動画機能を追加）
  - **日記機能の拡張（シーン・感情・タグによる簡単記録）**:
    - `CONVEX_SCHEMA.md`に日記関連マスターデータテーブルを追加
      - `diary_scenes`（31番目）: 日記シーンマスターデータ（お散歩、お昼寝、遊び、食事など）
      - `diary_emotions`（32番目）: 日記感情マスターデータ（楽しい、愛しい、混乱、悲しいなど）
      - `reaction_types`（33番目）: リアクションタイプマスターデータ（❤️, 🌻, 💪, 🌟, 🌈）
      - `context_stamps`（34番目）: コンテキストスタンプマスターデータ（シーン+感情のセット）
    - `CONVEX_SCHEMA.md`の`activities`テーブルの`payload`を拡張（日記用フィールドを追加）
      - `scenes`: シーンIDの配列
      - `emotion`: 感情ID
      - `timeOfDay`: 時間帯（朝、昼、夕方、夜、深夜）
      - `location`: 場所（おうち、公園、ドッグラン、病院、旅先）
      - `contextStamp`: コンテキストスタンプID（シーン+感情のセット）
    - `CONVEX_SCHEMA.md`の`likes`テーブルを拡張（多機能リアクション）
      - `reactionType`フィールドを追加（reaction_typesのreactionIdを参照）
      - `by_activity_reaction`インデックスを追加（リアクションタイプ別の集計用）
    - `USER_STORIES.md`の「US-011: 日記投稿」を更新（シーン・感情・タグによる簡単記録）
    - `USER_STORIES.md`に新しいストーリーを追加
      - US-073: 日記のシーン・感情マスターデータ表示
      - US-074: 日記のフィルタリング（シーン・感情・時間帯・場所）
      - US-075: 多機能リアクション
      - US-076: 日記の自動タグ付け（シーン連携）
    - `USER_STORIES.md`の「US-042: いいね機能」を更新（多機能リアクション）
    - `DESIGN_DOCUMENT.md`の「5.4 記録画面」に日記記録の詳細設計を追加
      - シーン選択、感情選択、コンテキストスタンプ、時間帯・場所タグのUI設計
    - `DESIGN_DOCUMENT.md`のAPI設計セクション（6.3.1）に日記関連マスターデータ取得用のQuery関数を追加
      - `getDiaryScenes`, `getDiaryEmotions`, `getContextStamps`, `getReactionTypes`
    - `DESIGN_DOCUMENT.md`のAPI設計セクション（6.3）に日記フィルタリング用のQuery関数を追加
      - `getDiaryActivitiesWithFilters`: シーン、感情、時間帯、場所でフィルタリング
    - `DESIGN_DOCUMENT.md`のデータフロー設計（3.9）にリアクションフローを追加
      - 多機能リアクションのフロー（通常タップ/長押し、リアクションタイプ選択、集計表示）

---

## 🎯 ドキュメントの使い方

### 新規開発者向け
1. **まず読む**: `SETUP_CHECKLIST.md` → `AGENTS.md`
2. **次に読む**: [docs/stories/USER_STORIES.md](docs/stories/USER_STORIES.md) → [docs/schema/CONVEX_SCHEMA.md](docs/schema/CONVEX_SCHEMA.md)
3. **必要に応じて**: [docs/design/DESIGN_DOCUMENT.md](docs/design/DESIGN_DOCUMENT.md) → [docs/design/PREMIUM_FEATURES.md](docs/design/PREMIUM_FEATURES.md)

### AI（Cursor）への指示
1. **機能実装**: [docs/stories/](docs/stories/)（USER_STORIES / ADMIN_USER_STORIES / WEB_USER_STORIES）を参照
2. **スキーマ実装**: [docs/schema/CONVEX_SCHEMA.md](docs/schema/CONVEX_SCHEMA.md)を参照
3. **設計確認**: [docs/design/DESIGN_DOCUMENT.md](docs/design/DESIGN_DOCUMENT.md)を参照
4. **Issue作成**: `ISSUE_GUIDELINES.md`を参照 ✅ **2026年追加**
5. **エピック確認**: [docs/implementation/EPIC_OVERVIEW.md](docs/implementation/EPIC_OVERVIEW.md)を参照 ✅ **2026年追加**

### レビュー時
1. **スキーマレビュー**: [docs/requirements/SCHEMA_REVIEW.md](docs/requirements/SCHEMA_REVIEW.md)を参照
2. **要件レビュー**: [docs/requirements/REQUIREMENTS_REVIEW.md](docs/requirements/REQUIREMENTS_REVIEW.md)を参照
3. **ドキュメントレビュー**: [docs/requirements/DOCUMENT_REVIEW.md](docs/requirements/DOCUMENT_REVIEW.md)を参照

---

## 🔍 クイックリファレンス

### よく参照される組み合わせ

| タスク | 参照するドキュメント |
|--------|---------------------|
| 新機能の実装 | [docs/stories/](docs/stories/)（USER/ADMIN/WEB_STORIES）→ [docs/app-structure/](docs/app-structure/) → [docs/schema/](docs/schema/) → [docs/design/](docs/design/) |
| モバイルアプリ画面の実装 | [docs/app-structure/APP_DIRECTORY_STRUCTURE.md](docs/app-structure/APP_DIRECTORY_STRUCTURE.md) → [docs/stories/USER_STORIES.md](docs/stories/USER_STORIES.md) → [docs/schema/CONVEX_SCHEMA.md](docs/schema/CONVEX_SCHEMA.md) ✅ **2026年追加** |
| GitHub Issueの作成 | [docs/implementation/IMPLEMENTATION_PHASES.md](docs/implementation/IMPLEMENTATION_PHASES.md) → [docs/implementation/EPIC_IMPLEMENTATION_PLAN.md](docs/implementation/EPIC_IMPLEMENTATION_PLAN.md) → `ISSUE_GUIDELINES.md` → [docs/implementation/EPIC_OVERVIEW.md](docs/implementation/EPIC_OVERVIEW.md) → [docs/stories/](docs/stories/) ✅ **2026年追加** |
| エピックの確認 | [docs/implementation/EPIC_OVERVIEW.md](docs/implementation/EPIC_OVERVIEW.md) → [docs/stories/](docs/stories/) ✅ **2026年追加** |
| Pencilでのデザイン作成 | [docs/design/PENCIL_DESIGN_BRIEF.md](docs/design/PENCIL_DESIGN_BRIEF.md) → [docs/stories/USER_STORIES.md](docs/stories/USER_STORIES.md) → [docs/design/DESIGN_DOCUMENT.md](docs/design/DESIGN_DOCUMENT.md) ✅ **2026年追加** |
| 日記機能の実装 | [docs/design/DIARY_DRAFT_VERIFICATION.md](docs/design/DIARY_DRAFT_VERIFICATION.md) → [docs/stories/USER_STORIES.md](docs/stories/USER_STORIES.md) → [docs/schema/CONVEX_SCHEMA.md](docs/schema/CONVEX_SCHEMA.md) ✅ **2026年追加** |
| 画像・動画機能の実装 | [docs/design/CLOUDFLARE_R2_MIGRATION.md](docs/design/CLOUDFLARE_R2_MIGRATION.md) → [docs/design/IMAGE_STORAGE_STRATEGY.md](docs/design/IMAGE_STORAGE_STRATEGY.md) → [docs/stories/USER_STORIES.md](docs/stories/USER_STORIES.md) → [docs/schema/CONVEX_SCHEMA.md](docs/schema/CONVEX_SCHEMA.md) ✅ **2026年追加** |
| プレミアム機能の実装 | [docs/design/PREMIUM_FEATURES.md](docs/design/PREMIUM_FEATURES.md) → [docs/schema/CONVEX_SCHEMA.md](docs/schema/CONVEX_SCHEMA.md)（プレミアム権限管理） |
| 画像機能の実装 | [docs/design/IMAGE_STORAGE_STRATEGY.md](docs/design/IMAGE_STORAGE_STRATEGY.md) → [docs/schema/CONVEX_SCHEMA.md](docs/schema/CONVEX_SCHEMA.md)（imagesテーブル） |
| 動画機能の実装 | [docs/design/CLOUDFLARE_R2_MIGRATION.md](docs/design/CLOUDFLARE_R2_MIGRATION.md) → [docs/design/IMAGE_STORAGE_STRATEGY.md](docs/design/IMAGE_STORAGE_STRATEGY.md) → [docs/stories/USER_STORIES.md](docs/stories/USER_STORIES.md) → [docs/schema/CONVEX_SCHEMA.md](docs/schema/CONVEX_SCHEMA.md) ✅ **2026年追加** |
| AIチャット機能の実装 | [docs/design/AI_CHAT_REVIEW.md](docs/design/AI_CHAT_REVIEW.md) → [docs/design/AI_CHAT_DISCLAIMER.md](docs/design/AI_CHAT_DISCLAIMER.md) → [docs/schema/CONVEX_SCHEMA.md](docs/schema/CONVEX_SCHEMA.md) |
| 管理画面機能の実装 | [docs/stories/ADMIN_USER_STORIES.md](docs/stories/ADMIN_USER_STORIES.md) → [docs/schema/CONVEX_SCHEMA.md](docs/schema/CONVEX_SCHEMA.md) |
| 公式サイト機能の実装 | [docs/stories/WEB_USER_STORIES.md](docs/stories/WEB_USER_STORIES.md) → [docs/schema/CONVEX_SCHEMA.md](docs/schema/CONVEX_SCHEMA.md)（news, legal_documentsテーブル） |
| スキーマ設計のレビュー | [docs/requirements/SCHEMA_REVIEW.md](docs/requirements/SCHEMA_REVIEW.md) → [docs/schema/CONVEX_SCHEMA.md](docs/schema/CONVEX_SCHEMA.md) |
| コードスタイル・ワークフロー確認 | `.cursor/rules/PROJECT.md` |
| ドキュメントへのアクセス | `.cursor/skills/documentation-access/SKILL.md` → `DOCUMENTATION_INDEX.md` |

---

## 📝 ドキュメントの更新ルール

1. **新機能追加時**: 
   - [docs/stories/](docs/stories/)（USER_STORIES / ADMIN_USER_STORIES / WEB_USER_STORIES）にストーリーを追加
   - [docs/schema/CONVEX_SCHEMA.md](docs/schema/CONVEX_SCHEMA.md)にスキーマ定義を追加
   - [docs/design/DESIGN_DOCUMENT.md](docs/design/DESIGN_DOCUMENT.md)に設計詳細を追加
   - [docs/app-structure/APP_DIRECTORY_STRUCTURE.md](docs/app-structure/APP_DIRECTORY_STRUCTURE.md)に画面パスを追加（モバイルアプリの場合）
   - [docs/implementation/EPIC_OVERVIEW.md](docs/implementation/EPIC_OVERVIEW.md)を更新（エピックにストーリーを追加）
   - [docs/design/PENCIL_DESIGN_BRIEF.md](docs/design/PENCIL_DESIGN_BRIEF.md)にデザインブリーフを追加（モバイルアプリ画面の場合） ✅ **2026年追加**
   - `DOCUMENTATION_INDEX.md`を更新

2. **GitHub Issue作成時**:
   - [docs/implementation/IMPLEMENTATION_PHASES.md](docs/implementation/IMPLEMENTATION_PHASES.md)で実装フェーズを確認
   - [docs/implementation/EPIC_IMPLEMENTATION_PLAN.md](docs/implementation/EPIC_IMPLEMENTATION_PLAN.md)でエピックと実装タスクを確認
   - `ISSUE_GUIDELINES.md`を参照してIssueを作成
   - [docs/implementation/EPIC_OVERVIEW.md](docs/implementation/EPIC_OVERVIEW.md)からエピックを確認
   - 依存関係を確認して実装順序を決定

2. **レビュー時**:
   - レビュー結果を[docs/requirements/](docs/requirements/)（SCHEMA_REVIEW, REQUIREMENTS_REVIEW, DOCUMENT_REVIEW）に記録
   - 必要に応じて各ドキュメントを更新

3. **設計変更時**:
   - 関連するすべてのドキュメントを更新
   - `DOCUMENTATION_INDEX.md`の更新履歴を更新

---

## 🔗 バックリンク

このドキュメントは以下のドキュメントから参照されています：

- `.cursor/rules/PROJECT.md`: 重要な注意事項セクション
- `AGENTS.md`: 参考ドキュメントセクション
- `CLAUDE.md`: 参考ドキュメントセクション
- [docs/stories/USER_STORIES.md](docs/stories/USER_STORIES.md): ドキュメント構造の説明
- [docs/stories/ADMIN_USER_STORIES.md](docs/stories/ADMIN_USER_STORIES.md): ドキュメント構造の説明
- [docs/stories/WEB_USER_STORIES.md](docs/stories/WEB_USER_STORIES.md): ドキュメント構造の説明
- [docs/schema/CONVEX_SCHEMA.md](docs/schema/CONVEX_SCHEMA.md): ドキュメント構造の説明
- [docs/design/DESIGN_DOCUMENT.md](docs/design/DESIGN_DOCUMENT.md): ドキュメント構造の説明
- [docs/design/PREMIUM_FEATURES.md](docs/design/PREMIUM_FEATURES.md): ドキュメント構造の説明
- [docs/design/IMAGE_STORAGE_STRATEGY.md](docs/design/IMAGE_STORAGE_STRATEGY.md): ドキュメント構造の説明
- [docs/design/AI_CHAT_DISCLAIMER.md](docs/design/AI_CHAT_DISCLAIMER.md): ドキュメント構造の説明
- [docs/design/AI_CHAT_REVIEW.md](docs/design/AI_CHAT_REVIEW.md): ドキュメント構造の説明
- [docs/requirements/SCHEMA_REVIEW.md](docs/requirements/SCHEMA_REVIEW.md): ドキュメント構造の説明
- [docs/requirements/REQUIREMENTS_REVIEW.md](docs/requirements/REQUIREMENTS_REVIEW.md): ドキュメント構造の説明
- [docs/requirements/DOCUMENT_REVIEW.md](docs/requirements/DOCUMENT_REVIEW.md): ドキュメント構造の説明
- [docs/design/TECH_STACK_PLANNING.md](docs/design/TECH_STACK_PLANNING.md): ドキュメント構造の説明
- `SETUP_CHECKLIST.md`: ドキュメント構造の説明

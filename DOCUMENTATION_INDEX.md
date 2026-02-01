# ドキュメントインデックス

## 概要
このドキュメントは、プロジェクト内のすべてのドキュメントを整理し、相互参照できるようにするためのマスタードキュメントです。

各ドキュメントの目的、内容、関連ドキュメントへのリンクを提供します。

---

## 📚 ドキュメント一覧（カテゴリ別）

### 🎯 開発の憲法（必須読了）

これらのドキュメントは、開発の基礎となる「憲法」として機能します。実装前に必ず確認してください。

| ドキュメント | 目的 | 対象 |
|------------|------|------|
| **[USER_STORIES.md](./USER_STORIES.md)** | モバイルアプリのユーザーストーリー | 開発者・AI |
| **[ADMIN_USER_STORIES.md](./ADMIN_USER_STORIES.md)** | 管理画面のユーザーストーリー | 開発者・AI |
| **[CONVEX_SCHEMA.md](./CONVEX_SCHEMA.md)** | Convexスキーマ定義と実装例 | 開発者・AI |

**関連ドキュメント**:
- `DESIGN_DOCUMENT.md`: アプリ設計の詳細
- `PREMIUM_FEATURES.md`: プレミアム機能の定義

---

### 🏗️ 設計・アーキテクチャ

| ドキュメント | 目的 | 対象 |
|------------|------|------|
| **[DESIGN_DOCUMENT.md](./DESIGN_DOCUMENT.md)** | アプリ設計の詳細（フロー、機能詳細） | 開発者・AI |
| **[TECH_STACK_PLANNING.md](./TECH_STACK_PLANNING.md)** | 技術選定の詳細と理由 | 開発者 |
| **[IMAGE_STORAGE_STRATEGY.md](./IMAGE_STORAGE_STRATEGY.md)** | 画像保存戦略とConvexプライシング | 開発者・AI |

**関連ドキュメント**:
- `CONVEX_SCHEMA.md`: スキーマ定義
- `PREMIUM_FEATURES.md`: プレミアム機能の定義

---

### 💎 機能別設計書

| ドキュメント | 目的 | 対象 |
|------------|------|------|
| **[PREMIUM_FEATURES.md](./PREMIUM_FEATURES.md)** | プレミアム機能の定義と制限 | 開発者・AI |
| **[AI_CHAT_DISCLAIMER.md](./AI_CHAT_DISCLAIMER.md)** | AIチャット免責事項の設計 | 開発者・AI |
| **[AI_CHAT_REVIEW.md](./AI_CHAT_REVIEW.md)** | AIチャット機能の設計レビュー | 開発者・AI |

**関連ドキュメント**:
- `CONVEX_SCHEMA.md`: AIチャット機能のスキーマ定義
- `USER_STORIES.md`: US-020〜US-025（AI相談機能）

---

### 🔍 レビュー・検証

| ドキュメント | 目的 | 対象 |
|------------|------|------|
| **[SCHEMA_REVIEW.md](./SCHEMA_REVIEW.md)** | スキーマ設計のレビュー結果 | 開発者 |
| **[REQUIREMENTS_REVIEW.md](./REQUIREMENTS_REVIEW.md)** | 要件定義のレビュー結果 | 開発者 |
| **[DOCUMENT_REVIEW.md](./DOCUMENT_REVIEW.md)** | ドキュメント全体のレビュー結果 | 開発者 |

**関連ドキュメント**:
- `CONVEX_SCHEMA.md`: レビュー対象のスキーマ
- `USER_STORIES.md`: レビュー対象のユーザーストーリー

---

### 🛠️ 開発ガイド

| ドキュメント | 目的 | 対象 |
|------------|------|------|
| **[.cursor/rules/PROJECT.md](./.cursor/rules/PROJECT.md)** | プロジェクトルール（コードスタイル、ワークフロー、コマンド） | 開発者・AI |
| **[AGENTS.md](./AGENTS.md)** | Cursorエージェントの使い方とガイドライン | 開発者・AI |
| **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)** | セットアップ前のチェックリスト | 開発者 |
| **[CLAUDE.md](./CLAUDE.md)** | Claude AI固有の設定と補足 | 開発者・AI |

**関連ドキュメント**:
- `TECH_STACK_PLANNING.md`: 技術スタックの詳細
- `.cursor/README.md`: Cursor設定ファイルの説明
- `.cursor/skills/documentation-access/SKILL.md`: ドキュメントへの効率的なアクセス方法

---

## 📖 ドキュメント詳細

### USER_STORIES.md
**パス**: `./USER_STORIES.md`  
**目的**: モバイルアプリ（React Native Expo）の機能をユーザー視点で整理したユーザーストーリー  
**対象**: 開発者・AI（Cursor）  
**重要度**: ⭐⭐⭐ **開発の憲法**

**内容**:
- Phase 1〜3のユーザーストーリー
- キラー機能（AI相談）とフック機能（コラム・記事）の定義
- 各ストーリーの受け入れ基準、体験価値、使用シーン

**関連ドキュメント**:
- `ADMIN_USER_STORIES.md`: 管理画面側のストーリー
- `CONVEX_SCHEMA.md`: スキーマ定義
- `DESIGN_DOCUMENT.md`: アプリ設計の詳細
- `PREMIUM_FEATURES.md`: プレミアム機能の定義

**参照される場所**:
- `CONVEX_SCHEMA.md`: 各テーブルの説明で参照
- `DESIGN_DOCUMENT.md`: 機能詳細の説明で参照
- `PREMIUM_FEATURES.md`: プレミアム機能の説明で参照

---

### ADMIN_USER_STORIES.md
**パス**: `./ADMIN_USER_STORIES.md`  
**目的**: 管理画面（Next.js）の機能を管理者視点で整理したユーザーストーリー  
**対象**: 開発者・AI（Cursor）  
**重要度**: ⭐⭐⭐ **開発の憲法**

**内容**:
- コラム・記事管理機能（ADM-001〜ADM-003）
- キュレーション記事管理機能（ADM-004〜ADM-005）
- 商品データベース管理機能（ADM-006〜ADM-007）
- ユーザー管理機能（ADM-008〜ADM-009）
- 統計・分析機能（ADM-010）

**関連ドキュメント**:
- `USER_STORIES.md`: モバイルアプリ側のストーリー
- `CONVEX_SCHEMA.md`: スキーマ定義（curations, articlesテーブルなど）

**参照される場所**:
- `USER_STORIES.md`: Epic 6, Epic 10で参照
- `CONVEX_SCHEMA.md`: キュレーション機能の説明で参照

---

### CONVEX_SCHEMA.md
**パス**: `./CONVEX_SCHEMA.md`  
**目的**: Convexスキーマの定義と実装例  
**対象**: 開発者・AI（Cursor）  
**重要度**: ⭐⭐⭐ **開発の憲法**

**内容**:
- 全テーブルのスキーマ定義
- 各テーブルの目的、主要フィールド、インデックス
- 実装例（Query/Mutation/Action）
- 設計のポイント（論理削除、プレミアム権限管理など）

**関連ドキュメント**:
- `USER_STORIES.md`: ユーザーストーリー（各テーブルの使用例）
- `DESIGN_DOCUMENT.md`: アプリ設計の詳細
- `IMAGE_STORAGE_STRATEGY.md`: 画像保存戦略
- `AI_CHAT_REVIEW.md`: AIチャット機能のレビュー
- `SCHEMA_REVIEW.md`: スキーマ設計のレビュー

**参照される場所**:
- `DESIGN_DOCUMENT.md`: データフローの説明で参照
- `USER_STORIES.md`: 各ストーリーの実装時に参照
- `PREMIUM_FEATURES.md`: プレミアム機能の実装時に参照

---

### DESIGN_DOCUMENT.md
**パス**: `./DESIGN_DOCUMENT.md`  
**目的**: アプリ設計の詳細（フロー、機能詳細、技術実装）  
**対象**: 開発者・AI（Cursor）  
**重要度**: ⭐⭐

**内容**:
- プロジェクト概要
- データフロー（認証、ペット登録、活動ログ記録、AI相談など）
- 機能詳細（AI相談機能、コラム機能、SNS機能など）
- 技術実装の詳細

**関連ドキュメント**:
- `CONVEX_SCHEMA.md`: スキーマ定義
- `USER_STORIES.md`: ユーザーストーリー
- `TECH_STACK_PLANNING.md`: 技術選定の詳細

**参照される場所**:
- `USER_STORIES.md`: 機能詳細の説明で参照
- `CONVEX_SCHEMA.md`: 実装例の説明で参照

---

### PREMIUM_FEATURES.md
**パス**: `./PREMIUM_FEATURES.md`  
**目的**: プレミアム機能の定義と制限  
**対象**: 開発者・AI（Cursor）  
**重要度**: ⭐⭐

**内容**:
- Phase 1〜3のプレミアム限定機能
- 無料プランで利用可能な機能
- 機能制限の詳細

**関連ドキュメント**:
- `USER_STORIES.md`: 各ストーリーのプレミアム制限
- `CONVEX_SCHEMA.md`: プレミアム権限管理の実装例
- `IMAGE_STORAGE_STRATEGY.md`: 画像管理のプレミアム制限

**参照される場所**:
- `CONVEX_SCHEMA.md`: プレミアム権限管理の説明で参照
- `USER_STORIES.md`: 各ストーリーの機能制限で参照

---

### IMAGE_STORAGE_STRATEGY.md
**パス**: `./IMAGE_STORAGE_STRATEGY.md`  
**目的**: 画像保存戦略とConvexプライシングの考慮  
**対象**: 開発者・AI（Cursor）  
**重要度**: ⭐⭐

**内容**:
- Convexの無料枠の制限
- 画像データサイズの試算
- 無料ユーザーとプレミアムユーザーの機能差別化
- ダブルストレージ構造（Preview/Original）
- WebP形式の採用理由

**関連ドキュメント**:
- `CONVEX_SCHEMA.md`: imagesテーブルの定義
- `PREMIUM_FEATURES.md`: 画像管理のプレミアム機能
- `USER_STORIES.md`: US-051〜US-054（画像管理機能）

**参照される場所**:
- `CONVEX_SCHEMA.md`: imagesテーブルの説明で参照
- `PREMIUM_FEATURES.md`: 画像管理機能の説明で参照

---

### AI_CHAT_DISCLAIMER.md
**パス**: `./AI_CHAT_DISCLAIMER.md`  
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
- `CONVEX_SCHEMA.md`: chat_messagesテーブルの定義
- `AI_CHAT_REVIEW.md`: AIチャット機能のレビュー
- `USER_STORIES.md`: US-020〜US-025（AI相談機能）

**参照される場所**:
- `CONVEX_SCHEMA.md`: chat_messagesテーブルの説明で参照
- `USER_STORIES.md`: US-020の受け入れ基準で参照

---

### AI_CHAT_REVIEW.md
**パス**: `./AI_CHAT_REVIEW.md`  
**目的**: AIチャット機能の設計レビュー（ユーザー・ペット情報へのアクセス、RAG統合）  
**対象**: 開発者  
**重要度**: ⭐

**内容**:
- 良い点（RAGアーキテクチャ、スキーマ設計）
- 問題点と改善案（認証チェック、権限チェック、ユーザー情報の欠如など）
- 実装チェックリスト

**関連ドキュメント**:
- `CONVEX_SCHEMA.md`: AIチャット機能の実装例
- `AI_CHAT_DISCLAIMER.md`: 免責事項の設計
- `USER_STORIES.md`: US-020〜US-025（AI相談機能）

**参照される場所**:
- `CONVEX_SCHEMA.md`: AI機能の信頼性確保の説明で参照

---

### SCHEMA_REVIEW.md
**パス**: `./SCHEMA_REVIEW.md`  
**目的**: スキーマ設計のレビュー結果  
**対象**: 開発者  
**重要度**: ⭐

**内容**:
- スキーマ設計のレビュー結果
- 改善提案
- 将来の拡張性の検証

**関連ドキュメント**:
- `CONVEX_SCHEMA.md`: レビュー対象のスキーマ
- `USER_STORIES.md`: ユーザーストーリーとの整合性確認

**参照される場所**:
- `CONVEX_SCHEMA.md`: 設計のポイントで参照

---

### REQUIREMENTS_REVIEW.md
**パス**: `./REQUIREMENTS_REVIEW.md`  
**目的**: 要件定義のレビュー結果  
**対象**: 開発者  
**重要度**: ⭐

**内容**:
- 要件定義のレビュー結果
- 不足している要件の指摘
- 改善提案

**関連ドキュメント**:
- `USER_STORIES.md`: 要件定義の基盤
- `DESIGN_DOCUMENT.md`: 設計ドキュメントとの整合性確認

**参照される場所**:
- `USER_STORIES.md`: 要件の確認時に参照

---

### DOCUMENT_REVIEW.md
**パス**: `./DOCUMENT_REVIEW.md`  
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
**パス**: `./TECH_STACK_PLANNING.md`  
**目的**: 技術選定の詳細と理由  
**対象**: 開発者  
**重要度**: ⭐

**内容**:
- 技術スタックの選定理由
- 各技術の採用理由
- 将来の拡張性の考慮

**関連ドキュメント**:
- `DESIGN_DOCUMENT.md`: アプリ設計の詳細
- `AGENTS.md`: 開発ガイドライン

**参照される場所**:
- `AGENTS.md`: 技術スタックの説明で参照
- `DESIGN_DOCUMENT.md`: 技術実装の説明で参照

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
- `TECH_STACK_PLANNING.md`: 技術スタックの詳細
- `AGENTS.md`: 開発ガイドライン

**参照される場所**:
- `AGENTS.md`: セットアップの説明で参照

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
- `AGENTS.md`: Cursorエージェントガイドライン
- `.cursor/rules/PROJECT.md`: プロジェクトルール
- `USER_STORIES.md`: ユーザーストーリー

**参照される場所**:
- `AGENTS.md`: Claude固有の設定として参照

---

## 🔗 ドキュメント間の関係図

```
┌─────────────────────────────────────────────────────────────┐
│                   開発の憲法（必須読了）                      │
├─────────────────────────────────────────────────────────────┤
│  USER_STORIES.md  ←→  ADMIN_USER_STORIES.md                │
│         ↓                    ↓                              │
│  CONVEX_SCHEMA.md  ←→  DESIGN_DOCUMENT.md                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   機能別設計書                                │
├─────────────────────────────────────────────────────────────┤
│  PREMIUM_FEATURES.md                                        │
│  IMAGE_STORAGE_STRATEGY.md                                  │
│  AI_CHAT_DISCLAIMER.md  ←→  AI_CHAT_REVIEW.md              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   レビュー・検証                              │
├─────────────────────────────────────────────────────────────┤
│  SCHEMA_REVIEW.md                                           │
│  REQUIREMENTS_REVIEW.md                                     │
│  DOCUMENT_REVIEW.md                                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   開発ガイド                                  │
├─────────────────────────────────────────────────────────────┤
│  .cursor/rules/PROJECT.md (基本ルール)                      │
│         ↓                                                    │
│  AGENTS.md  ←→  SETUP_CHECKLIST.md                        │
│  CLAUDE.md  ←→  TECH_STACK_PLANNING.md                    │
│  DOCUMENTATION_INDEX.md (このドキュメント)                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 ドキュメント更新履歴

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

---

## 🎯 ドキュメントの使い方

### 新規開発者向け
1. **まず読む**: `SETUP_CHECKLIST.md` → `AGENTS.md`
2. **次に読む**: `USER_STORIES.md` → `CONVEX_SCHEMA.md`
3. **必要に応じて**: `DESIGN_DOCUMENT.md` → `PREMIUM_FEATURES.md`

### AI（Cursor）への指示
1. **機能実装**: `USER_STORIES.md`または`ADMIN_USER_STORIES.md`を参照
2. **スキーマ実装**: `CONVEX_SCHEMA.md`を参照
3. **設計確認**: `DESIGN_DOCUMENT.md`を参照

### レビュー時
1. **スキーマレビュー**: `SCHEMA_REVIEW.md`を参照
2. **要件レビュー**: `REQUIREMENTS_REVIEW.md`を参照
3. **ドキュメントレビュー**: `DOCUMENT_REVIEW.md`を参照

---

## 🔍 クイックリファレンス

### よく参照される組み合わせ

| タスク | 参照するドキュメント |
|--------|---------------------|
| 新機能の実装 | `USER_STORIES.md` または `ADMIN_USER_STORIES.md` → `CONVEX_SCHEMA.md` → `DESIGN_DOCUMENT.md` |
| プレミアム機能の実装 | `PREMIUM_FEATURES.md` → `CONVEX_SCHEMA.md`（プレミアム権限管理） |
| 画像機能の実装 | `IMAGE_STORAGE_STRATEGY.md` → `CONVEX_SCHEMA.md`（imagesテーブル） |
| AIチャット機能の実装 | `AI_CHAT_REVIEW.md` → `AI_CHAT_DISCLAIMER.md` → `CONVEX_SCHEMA.md` |
| 管理画面機能の実装 | `ADMIN_USER_STORIES.md` → `CONVEX_SCHEMA.md` |
| スキーマ設計のレビュー | `SCHEMA_REVIEW.md` → `CONVEX_SCHEMA.md` |
| コードスタイル・ワークフロー確認 | `.cursor/rules/PROJECT.md` |
| ドキュメントへのアクセス | `.cursor/skills/documentation-access/SKILL.md` → `DOCUMENTATION_INDEX.md` |

---

## 📝 ドキュメントの更新ルール

1. **新機能追加時**: 
   - `USER_STORIES.md`または`ADMIN_USER_STORIES.md`にストーリーを追加
   - `CONVEX_SCHEMA.md`にスキーマ定義を追加
   - `DESIGN_DOCUMENT.md`に設計詳細を追加
   - `DOCUMENTATION_INDEX.md`を更新

2. **レビュー時**:
   - レビュー結果を`SCHEMA_REVIEW.md`、`REQUIREMENTS_REVIEW.md`、`DOCUMENT_REVIEW.md`に記録
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
- `USER_STORIES.md`: ドキュメント構造の説明
- `ADMIN_USER_STORIES.md`: ドキュメント構造の説明
- `CONVEX_SCHEMA.md`: ドキュメント構造の説明
- `DESIGN_DOCUMENT.md`: ドキュメント構造の説明
- `PREMIUM_FEATURES.md`: ドキュメント構造の説明
- `IMAGE_STORAGE_STRATEGY.md`: ドキュメント構造の説明
- `AI_CHAT_DISCLAIMER.md`: ドキュメント構造の説明
- `AI_CHAT_REVIEW.md`: ドキュメント構造の説明
- `SCHEMA_REVIEW.md`: ドキュメント構造の説明
- `REQUIREMENTS_REVIEW.md`: ドキュメント構造の説明
- `DOCUMENT_REVIEW.md`: ドキュメント構造の説明
- `TECH_STACK_PLANNING.md`: ドキュメント構造の説明
- `SETUP_CHECKLIST.md`: ドキュメント構造の説明

# アプリ設計ドキュメント インデックス

**📚 ドキュメントインデックス**: [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)

## 概要
このドキュメントは、アプリ設計の詳細をまとめたドキュメントのインデックスです。

**関連ドキュメント**:
- [USER_STORIES.md](./USER_STORIES.md): モバイルアプリのユーザーストーリー
- [ADMIN_USER_STORIES.md](./ADMIN_USER_STORIES.md): 管理画面のユーザーストーリー
- [WEB_USER_STORIES.md](./WEB_USER_STORIES.md): 公式サイトのユーザーストーリー ✅ **2026年追加**
- [CONVEX_SCHEMA.md](./CONVEX_SCHEMA.md): スキーマ定義
- [TECH_STACK_PLANNING.md](./TECH_STACK_PLANNING.md): 技術選定の詳細
- [APP_DIRECTORY_STRUCTURE.md](./APP_DIRECTORY_STRUCTURE.md): アプリディレクトリ構成と画面マッピング ✅ **2026年追加**

---

## セクション一覧

### 1. プロジェクト概要
- [01-project-overview.md](./design-document/01-project-overview.md)
  - 1.1 アプリの目的
  - 1.2 ターゲットユーザー
  - 1.3 フェーズ別ロードマップ

### 2. データモデル設計
- [02-data-model.md](./design-document/02-data-model.md)
  - 2.1 エンティティ一覧
  - 2.2 削除機能の設計思想 ✅ **Convexのドキュメント指向な特性を最大限に活用**
  - 2.3 プレミアム権限管理 ✅ **機能制限とUXをシームレスに繋ぐ設計**
  - 2.4 画像・動画保存戦略 ✅ **2026年更新 - Cloudflare R2移行・動画対応**

### 3. データフロー設計
- [03-data-flow.md](./design-document/03-data-flow.md)
  - 3.1 認証フロー
  - 3.2 ペット登録フロー
  - 3.3 活動ログ記録フロー
  - 3.4 商品登録フロー（Phase 3）
  - 3.5 AI相談フロー（Phase 1後半 / Phase 2）
  - 3.6 コラム投稿フロー（Phase 1後半 / Phase 2）
  - 3.6-1 キュレーション記事の登録フロー（Phase 1後半 / Phase 2）✅ **外部記事の紹介**
  - 3.6-2 キュレーション記事の閲覧フロー（Phase 1後半 / Phase 2）✅ **外部記事の紹介**
  - 3.7 コラムレコメンデーションフロー
  - 3.7-1 キュレーションレコメンデーションフロー（Phase 1後半 / Phase 2）✅ **外部記事の紹介**
  - 3.8 SNSフィード表示フロー（Phase 3）
  - 3.9 フォロー・いいねフロー（Phase 3）

### 4. 機能設計
- [04-features.md](./design-document/04-features.md)
  - 4.1 Phase 1: 個人管理機能
  - 4.2 Phase 2: 家族・チーム管理機能
  - 4.3 Phase 3: SNS・商品データベース機能
  - 4.4 AI相談機能（Phase 1後半 / Phase 2）✅ **キラー機能**
  - 4.5 コラム・記事機能（Phase 1後半 / Phase 2）✅ **信頼性向上・フック機能**

### 5. 画面設計（Phase 1）
- [05-screens.md](./design-document/05-screens.md)
  - 5.1 認証画面
  - 5.2 ホーム画面
  - 5.3 ペット詳細画面
  - 5.4 記録画面
  - 5.5 AI相談画面
  - 5.6 コラム画面
  - 5.7 管理者用画面（運営）
  - 5.9 SNSフィード画面（Phase 3）✅ **2026年版モダンSNS**
  - 5.10 設定画面
  - 5.11 公式サイト（Next.js + Vercel）✅ **2026年追加 - SEO・LLMフレンドリーな公式サイト**

### 6. API設計（Convex Functions）
- [06-api-design.md](./design-document/06-api-design.md)
  - 6.1 Users関連
  - 6.2 Pets関連
  - 6.3 Activities関連
  - 6.3.1 マスターデータ関連 ✅ **2026年追加 - 種別ごとの選択肢**
  - 6.3.2 リマインダー関連 ✅ **2026年追加 - 掃除のタイマー・リマインダー**
  - 6.4 Pet Members関連（Phase 2）
  - 6.5 Products関連（Phase 3）
  - 6.6 Reviews関連（Phase 3）
  - 6.7 AI相談関連（Phase 1後半 / Phase 2）
  - 6.8 知識ベース管理（運営用）
  - 6.9 コラム・記事関連（Phase 1後半 / Phase 2）
  - 6.10 AI執筆サポート（運営用）
  - 6.11 SNS機能関連（Phase 3）
  - 6.12 データライフサイクル管理（Cronジョブ）✅ **2026年最終設計検証で追加**
  - 6.13 リマインダー通知管理（Cronジョブ）✅ **2026年追加 - Push通知の送信**
  - 6.14 オフライン画像アップロード ✅ **2026年最終設計検証で追加**
  - 6.15 広告表示管理 ✅ **2026年追加 - 無料ユーザーへの広告表示**
  - 6.16 競合解決（楽観的ロック）✅ **2026年最終設計検証で追加**
  - 6.17 ゲーミフィケーション要素関連 ✅ **2026年追加 - ポイント・バッジ・ショップ**
  - 6.18 公式サイト関連（Next.js + Vercel）✅ **2026年追加 - SEO・LLMフレンドリーな公式サイト**

### 7. セキュリティ設計
- [07-security.md](./design-document/07-security.md)
  - 7.1 認証・認可
  - 7.2 データアクセス制御
  - 7.3 入力検証

### 8. パフォーマンス最適化
- [08-performance.md](./design-document/08-performance.md)
  - 8.1 インデックス戦略
  - 8.2 キャッシュ戦略
  - 8.3 データ取得最適化

### 9. 将来の拡張性
- [09-extensibility.md](./design-document/09-extensibility.md)
  - 9.1 スケーラビリティ
  - 9.2 機能拡張

### 10. 技術的制約と考慮事項
- [10-constraints.md](./design-document/10-constraints.md)
  - 10.1 Convexの制約
  - 10.2 モバイルアプリの制約
  - 10.3 データライフサイクルと物理削除 ✅ **2026年最終設計検証で追加**
  - 10.4 オフラインエクスペリエンス ✅ **2026年最終設計検証で追加**
  - 10.5 追悼（メモリアル）プラン ✅ **2026年最終設計検証で追加**
  - 10.6 家族共有の競合解決 ✅ **2026年最終設計検証で追加**
  - 10.7 ゲーミフィケーション要素 ✅ **2026年追加 - 習慣化と収益性の両立**
  - 10.8 監視・アラートシステム ✅ **2026年追加 - サービス停止防止**

### 11. 用語集
- [11-glossary.md](./design-document/11-glossary.md)

---

## 関連ドキュメント

詳細な実装例やスキーマ定義は、以下のドキュメントを参照してください：
- [CONVEX_SCHEMA.md](./CONVEX_SCHEMA.md): スキーマ定義と実装例
- [USER_STORIES.md](./USER_STORIES.md): ユーザーストーリー（機能要件）
- [IMAGE_STORAGE_STRATEGY.md](./IMAGE_STORAGE_STRATEGY.md): 画像・動画保存戦略の詳細
- [CLOUDFLARE_R2_MIGRATION.md](./CLOUDFLARE_R2_MIGRATION.md): Cloudflare R2移行の詳細

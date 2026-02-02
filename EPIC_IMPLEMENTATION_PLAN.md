# エピックと実装タスクの詳細定義

このドキュメントは、Phase 0（環境構築とコア機能）とPhase 1（個人管理・基礎構築）のエピックと実装タスクを詳細に定義します。

**重要**: 
- 各タスクは、GitHub Issueとして作成し、適切なテンプレートを使用してください
- Issueを作成した後は、`.cursor/rules/ISSUE_REFERENCE.md`に従って、SkillsやRulesファイルにIssue番号を記載してください

---

## Phase 0: 環境構築とコア機能（認証・ユーザー管理）

### Epic 0-1: 環境構築とサービス疎通確認

#### TASK-0-1-1: miseのセットアップと動作確認

**Issueタイトル**: `[TASK]: miseのセットアップと動作確認`

**概要**:
miseを使用してNode.jsとpnpmのバージョンを管理する環境を構築します。

**実装内容**:
- [ ] miseのインストール（macOS: `brew install mise`）
- [ ] シェル統合の有効化（zsh/bash）
- [ ] `.mise.toml`の確認（Node.js 20.18.0, pnpm 9.12.3）
- [ ] `mise install`の実行
- [ ] `node --version`と`pnpm --version`の確認

**検証項目**:
- [ ] `mise --version`が表示される
- [ ] `node --version`が`v20.18.0`である
- [ ] `pnpm --version`が`9.12.3`である

**必須参照ドキュメント**:
- **セットアップガイド**: `MISE_SETUP.md`: miseセットアップガイド
- **プロジェクトルール**: `.cursor/rules/PROJECT.md`: 開発環境の管理セクション
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 0-1の実装計画

**テンプレート**: `ai-task.yml`

---

#### TASK-0-1-2: Turborepo + pnpmワークスペースの構築

**Issueタイトル**: `[TASK]: Turborepo + pnpmワークスペースの構築`

**概要**:
Turborepoとpnpmワークスペースを構築し、モノレポ環境を整備します。

**実装内容**:
- [ ] `turbo.json`の確認（作成済み）
- [ ] `pnpm-workspace.yaml`の確認（作成済み）
- [ ] ルート`package.json`の作成
- [ ] `pnpm install`の実行
- [ ] `pnpm turbo dev`の動作確認

**検証項目**:
- [ ] `pnpm install`が正常に完了する
- [ ] `pnpm turbo dev`で開発環境が起動する
- [ ] エラーなく動作する

**必須参照ドキュメント**:
- **設計レビュー**: `DESIGN_REVIEW_MISE_CONVEX_TURBOREPO.md`: 設計レビュー結果
- **統合ガイド**: `.cursor/rules/TURBOREPO_CONVEX.md`: Turborepo + Convex統合ガイド
- **プロジェクトルール**: `.cursor/rules/PROJECT.md`: モノレポ構成とワークフロー
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 0-1の実装計画

**テンプレート**: `ai-task.yml`

---

#### TASK-0-1-3: Convexプロジェクトの作成と接続確認

**Issueタイトル**: `[TASK]: Convexプロジェクトの作成と接続確認`

**概要**:
Convexプロジェクトを作成し、ローカル開発環境から接続できることを確認します。

**実装内容**:
- [ ] Convex Dashboardでプロジェクトを作成
- [ ] `packages/backend/convex.json`の確認（作成済み）
- [ ] `packages/backend/package.json`の作成（`package.json.example`を参考）
- [ ] 環境変数の設定（`.env.local`）
- [ ] `mise exec -- npx convex dev`の実行
- [ ] Convex Dashboardで接続を確認

**検証項目**:
- [ ] Convex Dashboardでプロジェクトが作成されている
- [ ] `convex dev`が正常に起動する
- [ ] Convex Dashboardで接続が確認できる
- [ ] エラーなく動作する

**必須参照ドキュメント**:
- **セットアップガイド**: `SETUP_CHECKLIST.md`: セットアップチェックリスト
- **統合ガイド**: `.cursor/rules/TURBOREPO_CONVEX.md`: Turborepo + Convex統合ガイド
- **スキーマ定義**: `CONVEX_SCHEMA.md`: Convexスキーマ定義（プロジェクト作成後に参照）
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 0-1の実装計画

**テンプレート**: `ai-task.yml`

---

#### TASK-0-1-4: Expoプロジェクトの初期化と動作確認

**Issueタイトル**: `[TASK]: Expoプロジェクトの初期化と動作確認`

**概要**:
Expoプロジェクトを初期化し、開発サーバーが起動することを確認します。

**実装内容**:
- [ ] `apps/expo/package.json`の作成
- [ ] Expo Routerの設定
- [ ] 基本的な`app/_layout.tsx`の作成
- [ ] `pnpm --filter expo dev`の実行
- [ ] Expo Goアプリで接続確認

**検証項目**:
- [ ] `pnpm --filter expo dev`で開発サーバーが起動する
- [ ] Expo GoアプリでQRコードをスキャンして接続できる
- [ ] 基本的な画面が表示される
- [ ] エラーなく動作する

**必須参照ドキュメント**:
- **技術選定**: `TECH_STACK_PLANNING.md`: 技術選定の詳細
- **プロジェクトルール**: `.cursor/rules/PROJECT.md`: プロジェクトルール
- **画面設計**: `APP_DIRECTORY_STRUCTURE.md`: Expo Routerのディレクトリ構成
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 0-1の実装計画

**テンプレート**: `ai-task.yml`

---

#### TASK-0-1-5: TypeScript設定の統一と型チェック確認

**Issueタイトル**: `[TASK]: TypeScript設定の統一と型チェック確認`

**概要**:
TypeScript設定を統一し、型チェックが正常に動作することを確認します。

**実装内容**:
- [ ] `packages/tsconfig/`の設定確認
- [ ] 各パッケージの`tsconfig.json`の設定
- [ ] `pnpm typecheck`の実行
- [ ] 型エラーがないことを確認

**検証項目**:
- [ ] `pnpm typecheck`が正常に実行される
- [ ] 型エラーがない
- [ ] 型定義が正しく読み込まれる

**必須参照ドキュメント**:
- **型安全性**: `.cursor/rules/TYPESCRIPT.md`: TypeScript型安全性の徹底（存在する場合）
- **プロジェクトルール**: `.cursor/rules/PROJECT.md`: TypeScript設定とコードスタイル
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 0-1の実装計画

**テンプレート**: `ai-task.yml`

---

### Epic 0-2: 各種サービスへの疎通確認

#### TASK-0-2-1: Clerkプロジェクトの作成と設定

**Issueタイトル**: `[TASK]: Clerkプロジェクトの作成と設定`

**概要**:
Clerkプロジェクトを作成し、認証機能の基盤を構築します。

**実装内容**:
- [ ] Clerk Dashboardでプロジェクトを作成
- [ ] 認証方法の設定（Email、Google、Apple）
- [ ] API Keysの取得
- [ ] 環境変数の設定（`.env.local`）
- [ ] Clerk SDKのインストール

**検証項目**:
- [ ] Clerk Dashboardでプロジェクトが作成されている
- [ ] API Keysが取得できている
- [ ] 環境変数が正しく設定されている

**必須参照ドキュメント**:
- **セットアップガイド**: `SETUP_CHECKLIST.md`: セットアップチェックリスト
- **プロジェクトルール**: `.cursor/rules/PROJECT.md`: 認証設定セクション
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 0-2の実装計画

**テンプレート**: `ai-task.yml`

---

#### TASK-0-2-2: ConvexとClerkの統合確認

**Issueタイトル**: `[TASK]: ConvexとClerkの統合確認`

**概要**:
ConvexとClerkを統合し、認証情報を取得できることを確認します。

**実装内容**:
- [ ] Convex関数でClerkの認証情報を取得するテスト関数を作成
- [ ] `ctx.auth.getUserIdentity()`の動作確認
- [ ] 認証情報が正しく取得できることを確認

**検証項目**:
- [ ] Convex関数からClerkの認証情報を取得できる
- [ ] `getUserIdentity()`が正常に動作する
- [ ] エラーなく動作する

**必須参照ドキュメント**:
- **開発パターン**: `.cursor/skills/convex-patterns/SKILL.md`: Convex開発パターン
- **スキーマ定義**: `CONVEX_SCHEMA.md`: Convexスキーマ定義（認証関連）
- **プロジェクトルール**: `.cursor/rules/PROJECT.md`: Convex関数の実装ルール
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 0-2の実装計画

**テンプレート**: `ai-task.yml`

---

#### TASK-0-2-3: 環境変数の設定と動作確認

**Issueタイトル**: `[TASK]: 環境変数の設定と動作確認`

**概要**:
環境変数を設定し、各サービスが正しく動作することを確認します。

**実装内容**:
- [ ] `.env.example`ファイルの確認
- [ ] `.env.local`ファイルの作成
- [ ] 各サービスの環境変数を設定
- [ ] 環境変数が正しく読み込まれることを確認

**検証項目**:
- [ ] すべての環境変数が設定されている
- [ ] 環境変数が正しく読み込まれる
- [ ] 各サービスが正常に動作する

**必須参照ドキュメント**:
- **セットアップガイド**: `SETUP_CHECKLIST.md`: セットアップチェックリスト
- **プロジェクトルール**: `.cursor/rules/PROJECT.md`: 環境変数の設定セクション
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 0-2の実装計画

**テンプレート**: `ai-task.yml`

---

### Epic 0-3: 認証機能の実装（デザインなし）

#### TASK-0-3-1: Convexスキーマの定義（usersテーブル）

**Issueタイトル**: `[TASK]: Convexスキーマの定義（usersテーブル）`

**概要**:
ユーザー情報を管理するConvexスキーマを定義します。

**実装内容**:
- [ ] `packages/backend/convex/schema.ts`に`users`テーブルを定義
- [ ] スキーマの型定義（`v`スキーマを使用）
- [ ] インデックスの定義
- [ ] スキーマの動作確認

**検証項目**:
- [ ] `users`テーブルが定義されている
- [ ] スキーマの型定義が正しい
- [ ] `npx convex dev`でエラーなく動作する

**必須参照ドキュメント**:
- **スキーマ定義**: `CONVEX_SCHEMA.md`: usersテーブル定義（1. users）
- **セキュリティ規約**: `.cursor/rules/SECURITY_IPA.md`: IPAセキュリティ実装規約
- **ユーザーストーリー**: `USER_STORIES.md`: US-001（ユーザー登録）
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 0-3の実装計画

**テンプレート**: `ai-task.yml`

---

#### TASK-0-3-2: Clerkのユーザー登録フロー実装

**Issueタイトル**: `[TASK]: Clerkのユーザー登録フロー実装`

**概要**:
Clerkを使用したユーザー登録フローを実装します（デザインなし）。

**実装内容**:
- [ ] `apps/expo/app/(auth)/register.tsx`の作成
- [ ] Clerkの`SignUp`コンポーネントの統合
- [ ] メールアドレス登録の実装
- [ ] Google/Appleアカウント登録の実装
- [ ] 登録後のリダイレクト処理

**検証項目**:
- [ ] メールアドレスでユーザー登録できる
- [ ] Google/Appleアカウントでユーザー登録できる
- [ ] 登録後、適切な画面にリダイレクトされる
- [ ] エラーハンドリングが正しく動作する

**必須参照ドキュメント**:
- **ユーザーストーリー**: `USER_STORIES.md`: US-001（ユーザー登録）
  - または `user-stories/01-authentication.md`: Epic 1（認証・ユーザー管理）
- **画面設計**: `APP_DIRECTORY_STRUCTURE.md`: `app/(auth)/register.tsx`
- **セキュリティ規約**: `.cursor/rules/SECURITY_IPA.md`: IPAセキュリティ実装規約
- **設計ドキュメント**: `DESIGN_DOCUMENT.md`: 認証フローの設計
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 0-3の実装計画

**テンプレート**: `ai-task.yml`

---

#### TASK-0-3-3: Convex関数の作成（ユーザー情報の同期）

**Issueタイトル**: `[TASK]: Convex関数の作成（ユーザー情報の同期）`

**概要**:
Clerkで登録されたユーザー情報をConvexの`users`テーブルに同期する関数を作成します。

**実装内容**:
- [ ] `packages/backend/convex/users.ts`の作成
- [ ] `syncUser`関数の実装（mutation）
- [ ] Clerkの認証情報からユーザー情報を取得
- [ ] Convexの`users`テーブルに保存
- [ ] 既存ユーザーの更新処理

**検証項目**:
- [ ] ユーザー登録時に`users`テーブルにデータが保存される
- [ ] 既存ユーザーの情報が更新される
- [ ] エラーハンドリングが正しく動作する

**必須参照ドキュメント**:
- **スキーマ定義**: `CONVEX_SCHEMA.md`: usersテーブル定義（1. users）
- **ユーザーストーリー**: `USER_STORIES.md`: US-001（ユーザー登録）
- **画面設計**: `APP_DIRECTORY_STRUCTURE.md`: `app/(auth)/register.tsx`
- **設計ドキュメント**: `DESIGN_DOCUMENT.md`: 認証フローの設計
- **開発パターン**: `.cursor/skills/convex-patterns/SKILL.md`: Convex開発パターン
- **セキュリティ規約**: `.cursor/rules/SECURITY_IPA.md`: IPAセキュリティ実装規約

**テンプレート**: `ai-task.yml`

---

#### TASK-0-3-4: ログイン機能の実装

**Issueタイトル**: `[TASK]: ログイン機能の実装`

**概要**:
Clerkを使用したログイン機能を実装します（デザインなし）。

**実装内容**:
- [ ] `apps/expo/app/(auth)/login.tsx`の作成
- [ ] Clerkの`SignIn`コンポーネントの統合
- [ ] メールアドレス/パスワードログインの実装
- [ ] Google/Appleアカウントログインの実装
- [ ] 生体認証（Face ID/Touch ID）の実装
- [ ] ログイン後のリダイレクト処理

**検証項目**:
- [ ] メールアドレス/パスワードでログインできる
- [ ] Google/Appleアカウントでログインできる
- [ ] 生体認証でログインできる（iOS/Android）
- [ ] ログイン後、適切な画面にリダイレクトされる
- [ ] セッションが維持される

**必須参照ドキュメント**:
- **ユーザーストーリー**: `USER_STORIES.md`: US-002（ログイン）
  - または `user-stories/01-authentication.md`: Epic 1（認証・ユーザー管理）
- **画面設計**: `APP_DIRECTORY_STRUCTURE.md`: `app/(auth)/login.tsx`
- **セキュリティ規約**: `.cursor/rules/SECURITY_IPA.md`: IPAセキュリティ実装規約
- **設計ドキュメント**: `DESIGN_DOCUMENT.md`: 認証フローの設計
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 0-3の実装計画

**テンプレート**: `ai-task.yml`

---

#### TASK-0-3-5: ログアウト機能の実装

**Issueタイトル**: `[TASK]: ログアウト機能の実装`

**概要**:
Clerkを使用したログアウト機能を実装します。

**実装内容**:
- [ ] `apps/expo/app/settings/index.tsx`にログアウトアクションを追加（既存画面に統合）
- [ ] Clerkの`useAuth`フックを使用したログアウト処理
- [ ] セッションクリア処理
- [ ] ログアウト後のリダイレクト処理

**検証項目**:
- [ ] ログアウトボタンを押すとログアウトできる
- [ ] ログアウト後、セッションがクリアされる
- [ ] ログアウト後、ログイン画面にリダイレクトされる
- [ ] ログアウト後、認証が必要な画面にアクセスできない

**必須参照ドキュメント**:
- **ユーザーストーリー**: `USER_STORIES.md`: US-002（ログイン）の関連機能（ログアウトは付随機能として扱う）
  - または `user-stories/01-authentication.md`: Epic 1（認証・ユーザー管理）
- **画面設計**: `APP_DIRECTORY_STRUCTURE.md`: `app/settings/index.tsx`
- **セキュリティ規約**: `.cursor/rules/SECURITY_IPA.md`: IPAセキュリティ実装規約
- **設計ドキュメント**: `DESIGN_DOCUMENT.md`: 認証フローの設計
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 0-3の実装計画

**テンプレート**: `ai-task.yml`

---

#### TASK-0-3-6: ユーザー退会機能の実装

**Issueタイトル**: `[TASK]: ユーザー退会機能の実装`

**概要**:
ユーザー退会機能を実装します。論理削除を使用し、退会理由を記録します。

**実装内容**:
- [ ] `packages/backend/convex/schema.ts`に`account_deletion_reasons`テーブルを定義
- [ ] `packages/backend/convex/users.ts`に`deleteAccount`関数を実装（mutation）
- [ ] 退会理由の選択機能
- [ ] 論理削除の実装（`deletionSchema`を使用）
- [ ] Clerkアカウントの削除処理
- [ ] `apps/expo/app/settings/account-deletion.tsx`の作成

**検証項目**:
- [ ] 退会理由を選択できる
- [ ] 退会処理が実行される
- [ ] Convexの`users`テーブルで論理削除される（`deletion`オブジェクトが設定される）
- [ ] Clerkアカウントが削除される
- [ ] 退会後、ログイン画面にリダイレクトされる

**必須参照ドキュメント**:
- **スキーマ定義**: `CONVEX_SCHEMA.md`: usersテーブル定義（1. users）、account_deletion_reasonsテーブル定義（17. account_deletion_reasons）
- **ユーザーストーリー**: `USER_STORIES.md`: US-056（退会理由の収集）
- **画面設計**: `APP_DIRECTORY_STRUCTURE.md`: `app/settings/account-deletion.tsx`
- **セキュリティ規約**: `.cursor/rules/SECURITY_IPA.md`: IPAセキュリティ実装規約
- **設計ドキュメント**: `DESIGN_DOCUMENT.md`: 認証フローの設計
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 0-3の実装計画

**テンプレート**: `ai-task.yml`

---

#### TASK-0-3-7: プロフィール編集機能の実装

**Issueタイトル**: `[TASK]: プロフィール編集機能の実装`

**概要**:
ユーザーのプロフィール情報を編集する機能を実装します。

**実装内容**:
- [ ] `packages/backend/convex/users.ts`に`updateProfile`関数を実装（mutation）
- [ ] 名前の編集機能
- [ ] メールアドレスの編集機能
- [ ] 地域情報の設定機能
- [ ] プロフィール画像のアップロード機能（Cloudflare R2をPhase 0から採用）
- [ ] `apps/expo/app/settings/profile.tsx`の作成

**検証項目**:
- [ ] 名前を編集できる
- [ ] メールアドレスを編集できる
- [ ] 地域情報を設定できる
- [ ] プロフィール画像をアップロードできる
- [ ] 変更がConvexの`users`テーブルに反映される
- [ ] 変更が即座に画面に反映される

**必須参照ドキュメント**:
- **ユーザーストーリー**: `USER_STORIES.md`: US-003（プロフィール編集）
  - または `user-stories/01-authentication.md`: Epic 1（認証・ユーザー管理）
- **画面設計**: `APP_DIRECTORY_STRUCTURE.md`: `app/settings/profile.tsx`
- **スキーマ定義**: `CONVEX_SCHEMA.md`: usersテーブル定義（1. users）
- **画像戦略**: `IMAGE_STORAGE_STRATEGY.md`: 画像保存戦略（R2を基盤として採用）
- **ストレージ設計**: `CLOUDFLARE_R2_MIGRATION.md`: Cloudflare R2移行設計（プロフィール画像アップロード）
- **設計ドキュメント**: `DESIGN_DOCUMENT.md`: 認証フローの設計
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 0-3の実装計画

**テンプレート**: `ai-task.yml`

---

### Epic 0-4: 動作検証フェーズ

#### TASK-0-4-1: 認証フローの動作検証

**Issueタイトル**: `[VERIFY]: 認証フローの動作検証`

**概要**:
Phase 0で実装した認証機能を実際の画面を通じて動作検証します。

**検証内容**:
- [ ] ユーザー登録フローの動作確認
- [ ] ログインフローの動作確認
- [ ] ログアウトフローの動作確認
- [ ] 退会フローの動作確認
- [ ] プロフィール編集フローの動作確認

**検証方法**:
1. 実際のデバイス（iOS/Android）でアプリを起動
2. 各認証フローを実際に操作
3. Convex Dashboardでデータを確認
4. エラーケースも含めて動作確認

**検証項目**:
- [ ] すべての認証フローが正常に動作する
- [ ] エラーハンドリングが適切に動作する
- [ ] データが正しく保存されている
- [ ] セッション管理が正しく動作する

**テンプレート**: `ai-task.yml`

---

#### TASK-0-4-2: セキュリティチェック

**Issueタイトル**: `[VERIFY]: セキュリティチェック（IPAガイドライン準拠）`

**概要**:
実装した認証機能がIPAガイドラインに準拠していることを確認します。

**検証内容**:
- [ ] `pnpm security:audit`の実行
- [ ] 入力検証の確認
- [ ] CSRF対策の確認
- [ ] エラーメッセージの情報漏洩対策の確認

**検証項目**:
- [ ] セキュリティ監査が通る
- [ ] 入力検証が適切に実装されている
- [ ] CSRF対策が適切に実装されている
- [ ] エラーメッセージに内部情報が含まれていない

**必須参照ドキュメント**:
- **セキュリティ規約**: `.cursor/rules/SECURITY_IPA.md`: IPAセキュリティ実装規約
- **ユーザーストーリー**: `USER_STORIES.md`: Epic 1（認証・ユーザー管理）の全ストーリー
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 0-4の動作検証フェーズ

**テンプレート**: `ai-task.yml`

---

## GitHub Issueテンプレートの使用方法

各タスクは、以下のテンプレートを使用してGitHub Issueとして作成してください：

1. **AI Task Template** (`.github/ISSUE_TEMPLATE/ai-task.yml`): 実装タスク用
2. **Feature Request Template** (`.github/ISSUE_TEMPLATE/feature-request.yml`): 新機能提案用
3. **Bug Report Template** (`.github/ISSUE_TEMPLATE/bug-report.yml`): バグ報告用

詳細は **[ISSUE_GUIDELINES.md](./ISSUE_GUIDELINES.md)** を参照してください。

---

---

## Phase 1: 個人管理・基礎構築（認証完了後）

**目標**: ペット管理と活動ログ記録の基本機能を実装する

**前提条件**: Phase 0が完了し、認証機能が動作していること

### Epic 1-1: ペット管理機能

**共通参照（ナビゲーション用）**:
- `CONVEX_SCHEMA_INDEX.md`: スキーマの分割ファイル一覧
- `DESIGN_DOCUMENT_INDEX.md`: 設計ドキュメントの分割ファイル一覧

#### TASK-1-1-1: Convexスキーマの定義（petsテーブル）

**Issueタイトル**: `[TASK]: Convexスキーマの定義（petsテーブル）`

**概要**:
ペット情報を管理するConvexスキーマを定義します。

**実装内容**:
- [ ] `packages/backend/convex/schema.ts`に`pets`テーブルを定義
- [ ] スキーマの型定義（`v`スキーマを使用）
- [ ] インデックスの定義（`by_owner`, `by_species`など）
- [ ] スキーマの動作確認

**検証項目**:
- [ ] `pets`テーブルが定義されている
- [ ] スキーマの型定義が正しい
- [ ] `npx convex dev`でエラーなく動作する

**必須参照ドキュメント**:
- **スキーマ定義**: `CONVEX_SCHEMA.md`: petsテーブル定義（2. pets）
- **ユーザーストーリー**: `USER_STORIES.md`: US-004（ペット登録）
- **設計ドキュメント**: `DESIGN_DOCUMENT.md`: ペット管理の設計
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 1-1の実装計画

**テンプレート**: `ai-task.yml`

---

#### TASK-1-1-2: ペット登録機能の実装

**Issueタイトル**: `[TASK]: ペット登録機能の実装`

**概要**:
ペットの基本情報を登録する機能を実装します（デザインなし）。

**実装内容**:
- [ ] `packages/backend/convex/pets.ts`に`createPet`関数を実装（mutation）
- [ ] ペット名、種別、品種、性別、誕生日の入力機能
- [ ] 年齢と人間換算年齢の自動計算機能
- [ ] プロフィール画像のアップロード機能（Cloudflare R2）
- [ ] `apps/expo/app/pets/register.tsx`の作成
- [ ] 登録後のリダイレクト処理

**検証項目**:
- [ ] ペット情報を入力できる
- [ ] 誕生日を入力すると、自動で年齢と人間換算年齢が計算される
- [ ] プロフィール画像をアップロードできる
- [ ] 登録後、Convexの`pets`テーブルにデータが保存される
- [ ] 登録後、適切な画面にリダイレクトされる

**必須参照ドキュメント**:
- **ユーザーストーリー**: `USER_STORIES.md`: US-004（ペット登録）
  - または `user-stories/02-pet-management.md`: Epic 2（ペット管理）
- **画面設計**: `APP_DIRECTORY_STRUCTURE.md`: `app/pets/register.tsx`
- **スキーマ定義**: `CONVEX_SCHEMA.md`: petsテーブル定義（2. pets）
- **ストレージ設計**: `CLOUDFLARE_R2_MIGRATION.md`: Cloudflare R2移行設計（プロフィール画像アップロード）
- **設計ドキュメント**: `DESIGN_DOCUMENT.md`: ペット管理の設計
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 1-1の実装計画

**テンプレート**: `ai-task.yml`

---

#### TASK-1-1-3: ペット一覧表示機能の実装

**Issueタイトル**: `[TASK]: ペット一覧表示機能の実装`

**概要**:
登録済みのペットを一覧で表示する機能を実装します（デザインなし）。

**実装内容**:
- [ ] `packages/backend/convex/pets.ts`に`getPetsByOwner`関数を実装（query）
- [ ] ペット一覧画面の基本実装
- [ ] プロフィール画像、名前、種別の表示
- [ ] 年齢表示機能（US-005-1と連動）
- [ ] `apps/expo/app/(tabs)/pets.tsx`の作成
- [ ] ペット詳細画面への遷移処理

**検証項目**:
- [ ] 登録済みのペットが一覧で表示される
- [ ] プロフィール画像、名前、種別が表示される
- [ ] 年齢が表示される（US-005-1と連動）
- [ ] タップでペット詳細画面に遷移する

**必須参照ドキュメント**:
- **ユーザーストーリー**: `USER_STORIES.md`: US-005（ペット一覧表示）
  - または `user-stories/02-pet-management.md`: Epic 2（ペット管理）
- **画面設計**: `APP_DIRECTORY_STRUCTURE.md`: `app/(tabs)/pets.tsx`
- **スキーマ定義**: `CONVEX_SCHEMA.md`: petsテーブル定義（2. pets）
- **設計ドキュメント**: `DESIGN_DOCUMENT.md`: ペット管理の設計
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 1-1の実装計画

**テンプレート**: `ai-task.yml`

---

#### TASK-1-1-4: ペットの年齢表示機能の実装

**Issueタイトル**: `[TASK]: ペットの年齢表示機能の実装`

**概要**:
ペットの実年齢と人間換算年齢を表示する機能を実装します。

**実装内容**:
- [ ] 年齢計算ロジックの実装（`packages/utils/ageCalculator.ts`）
- [ ] 種別ごとの人間換算年齢の計算ロジック
- [ ] ペット詳細画面に年齢表示を追加
- [ ] ペット一覧画面に年齢表示を追加（US-005と連動）

**検証項目**:
- [ ] ペット詳細画面に実年齢が表示される（例: "2歳3ヶ月"）
- [ ] 人間換算年齢も同時に表示される（例: "人間換算: 約24歳"）
- [ ] 種別（犬・猫・爬虫類など）に応じた適切な換算が適用される
- [ ] 誕生日が未設定の場合は「年齢不明」と表示される
- [ ] 年齢は自動で算出され、手動で更新する必要がない

**必須参照ドキュメント**:
- **ユーザーストーリー**: `USER_STORIES.md`: US-005-1（ペットの年齢表示）
  - または `user-stories/02-pet-management.md`: Epic 2（ペット管理）
- **画面設計**: `APP_DIRECTORY_STRUCTURE.md`: `app/pets/[id]/index.tsx`
- **スキーマ定義**: `CONVEX_SCHEMA.md`: petsテーブル定義（2. pets）
- **設計ドキュメント**: `DESIGN_DOCUMENT.md`: ペット管理の設計
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 1-1の実装計画

**テンプレート**: `ai-task.yml`

---

#### TASK-1-1-5: ペットプロフィール編集機能の実装

**Issueタイトル**: `[TASK]: ペットプロフィール編集機能の実装`

**概要**:
ペットのプロフィール情報を編集する機能を実装します（デザインなし）。

**実装内容**:
- [ ] `packages/backend/convex/pets.ts`に`updatePet`関数を実装（mutation）
- [ ] 名前、種別、品種、性別、誕生日の編集機能
- [ ] 体重、去勢/避妊情報の更新機能
- [ ] 自己紹介、性格タグの追加・編集機能
- [ ] プロフィール画像の変更機能（Cloudflare R2）
- [ ] `apps/expo/app/pets/[id]/edit.tsx`の作成

**検証項目**:
- [ ] 名前、種別、品種、性別、誕生日を変更できる
- [ ] 誕生日を変更すると、自動で年齢と人間換算年齢が再計算される
- [ ] 体重、去勢/避妊情報を更新できる
- [ ] 自己紹介、性格タグを追加・編集できる
- [ ] プロフィール画像を変更できる
- [ ] 変更がConvexの`pets`テーブルに反映される

**必須参照ドキュメント**:
- **ユーザーストーリー**: `USER_STORIES.md`: US-006（ペットプロフィール編集）
  - または `user-stories/02-pet-management.md`: Epic 2（ペット管理）
- **画面設計**: `APP_DIRECTORY_STRUCTURE.md`: `app/pets/[id]/edit.tsx`
- **スキーマ定義**: `CONVEX_SCHEMA.md`: petsテーブル定義（2. pets）
- **ストレージ設計**: `CLOUDFLARE_R2_MIGRATION.md`: Cloudflare R2移行設計（プロフィール画像アップロード）
- **設計ドキュメント**: `DESIGN_DOCUMENT.md`: ペット管理の設計
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 1-1の実装計画

**テンプレート**: `ai-task.yml`

---

#### TASK-1-1-6: ペット削除機能の実装

**Issueタイトル**: `[TASK]: ペット削除機能の実装`

**概要**:
ペットを論理削除する機能を実装します。

**実装内容**:
- [ ] `packages/backend/convex/pets.ts`に`deletePet`関数を実装（mutation）
- [ ] 論理削除の実装（`deletionSchema`を使用）
- [ ] 削除確認ダイアログの実装
- [ ] 削除理由の選択機能
- [ ] 関連する活動ログの論理削除処理
- [ ] ペット詳細画面に削除アクションを追加

**検証項目**:
- [ ] 削除確認ダイアログが表示される
- [ ] 削除時に「後から元に戻せます（30日間）」というメッセージが表示される
- [ ] 削除後、ペット一覧から消える（論理削除）
- [ ] 関連する活動ログも論理削除される
- [ ] 削除理由を選択できる

**必須参照ドキュメント**:
- **ユーザーストーリー**: `USER_STORIES.md`: US-007（ペット削除）
  - または `user-stories/02-pet-management.md`: Epic 2（ペット管理）
- **画面設計**: `APP_DIRECTORY_STRUCTURE.md`: `app/pets/[id]/index.tsx`
- **スキーマ定義**: `CONVEX_SCHEMA.md`: petsテーブル定義（2. pets）、activitiesテーブル定義（6. activities）
- **セキュリティ規約**: `.cursor/rules/SECURITY_IPA.md`: IPAセキュリティ実装規約
- **設計ドキュメント**: `DESIGN_DOCUMENT.md`: ペット管理の設計
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 1-1の実装計画

**テンプレート**: `ai-task.yml`

---

#### TASK-1-1-7: ペット復元機能の実装

**Issueタイトル**: `[TASK]: ペット復元機能の実装`

**概要**:
削除したペットを復元する機能を実装します。

**実装内容**:
- [ ] `packages/backend/convex/pets.ts`に`restorePet`関数を実装（mutation）
- [ ] 削除したペット一覧の取得機能（query）
- [ ] 復元ボタンの実装
- [ ] 関連する活動ログの復元処理
- [ ] `apps/expo/app/settings/deleted-pets.tsx`の作成

**検証項目**:
- [ ] 設定画面に「削除したペット」セクションが表示される
- [ ] 削除したペットが一覧で表示され、削除日時と残り復元可能日数が表示される
- [ ] 「残りあと◯日で完全に消去されます」というメッセージが表示される
- [ ] 復元ボタンをタップすると、ペットと関連する活動ログが復元される
- [ ] 復元後、ペット一覧に表示される

**必須参照ドキュメント**:
- **ユーザーストーリー**: `USER_STORIES.md`: US-007-1（ペット復元）
  - または `user-stories/02-pet-management.md`: Epic 2（ペット管理）
- **画面設計**: `APP_DIRECTORY_STRUCTURE.md`: `app/settings/deleted-pets.tsx`
- **スキーマ定義**: `CONVEX_SCHEMA.md`: petsテーブル定義（2. pets）、activitiesテーブル定義（6. activities）
- **設計ドキュメント**: `DESIGN_DOCUMENT.md`: ペット管理の設計
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 1-1の実装計画

**テンプレート**: `ai-task.yml`

---

### Epic 1-2: 活動ログ記録機能

**共通参照（ナビゲーション用）**:
- `CONVEX_SCHEMA_INDEX.md`: スキーマの分割ファイル一覧
- `DESIGN_DOCUMENT_INDEX.md`: 設計ドキュメントの分割ファイル一覧

#### TASK-1-2-1: Convexスキーマの定義（activitiesテーブル）

**Issueタイトル**: `[TASK]: Convexスキーマの定義（activitiesテーブル）`

**概要**:
活動ログを管理するConvexスキーマを定義します。

**実装内容**:
- [ ] `packages/backend/convex/schema.ts`に`activities`テーブルを定義
- [ ] スキーマの型定義（`v`スキーマを使用）
- [ ] `payload`オブジェクトの柔軟な構造定義
- [ ] インデックスの定義（`by_pet`, `by_type`, `by_date`など）
- [ ] スキーマの動作確認

**検証項目**:
- [ ] `activities`テーブルが定義されている
- [ ] スキーマの型定義が正しい
- [ ] `npx convex dev`でエラーなく動作する

**必須参照ドキュメント**:
- **スキーマ定義**: `CONVEX_SCHEMA.md`: activitiesテーブル定義（6. activities）
- **ユーザーストーリー**: `USER_STORIES.md`: US-008〜US-013（活動ログ記録）
- **設計ドキュメント**: `DESIGN_DOCUMENT.md`: 活動ログ記録の設計
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 1-2の実装計画

**テンプレート**: `ai-task.yml`

---

#### TASK-1-2-2: 食事記録機能の実装

**Issueタイトル**: `[TASK]: 食事記録機能の実装`

**概要**:
ペットの食事内容を記録する機能を実装します（デザインなし）。

**実装内容**:
- [ ] `packages/backend/convex/activities.ts`に`createActivity`関数を実装（mutation）
- [ ] 前回の入力内容を取得する機能（query）
- [ ] 商品名、量（g）、商品IDの入力機能
- [ ] 前回の入力内容をデフォルトで表示する機能
- [ ] 写真添付機能（US-008-1と連動）
- [ ] メモ入力機能
- [ ] `apps/expo/app/pets/[id]/activities/feeding.tsx`の作成

**検証項目**:
- [ ] 3タップ以内で記録完了できる
- [ ] 前回の入力内容がデフォルトで表示される
- [ ] 前回の内容をそのまま使用して記録できる
- [ ] 前回の内容を変更して記録できる
- [ ] 写真を添付できる
- [ ] メモを追加できる
- [ ] 記録後、タイムラインに表示される

**必須参照ドキュメント**:
- **ユーザーストーリー**: `USER_STORIES.md`: US-008（食事記録）
  - または `user-stories/03-activity-logs.md`: Epic 3（活動ログ記録）
- **画面設計**: `APP_DIRECTORY_STRUCTURE.md`: `app/pets/[id]/activities/feeding.tsx`
- **スキーマ定義**: `CONVEX_SCHEMA.md`: activitiesテーブル定義（6. activities）
- **設計ドキュメント**: `DESIGN_DOCUMENT.md`: 活動ログ記録の設計（4.1.3 活動ログ）
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 1-2の実装計画

**テンプレート**: `ai-task.yml`

---

#### TASK-1-2-3: 画像アップロード機能の実装（活動ログ）

**Issueタイトル**: `[TASK]: 画像アップロード機能の実装（活動ログ）`

**概要**:
活動ログに写真を添付する機能を実装します。

**実装内容**:
- [ ] `packages/backend/convex/images.ts`に画像アップロード関数を実装（action）
- [ ] Cloudflare R2への画像アップロード処理
- [ ] WebP形式への自動変換処理
- [ ] 表示用（500KB程度）と最高画質（数MB）の2種類の保存
- [ ] 無料ユーザーの累計50枚制限の実装
- [ ] 50枚を超えた場合の案内表示
- [ ] 活動ログ記録画面に画像アップロード機能を統合

**検証項目**:
- [ ] 活動ログ記録時に写真を複数枚添付できる
- [ ] 写真は自動的にWebP形式に変換される
- [ ] 表示用と最高画質の2種類が保存される
- [ ] 無料ユーザーは累計50枚までアップロード可能
- [ ] 50枚を超えると案内が表示される
- [ ] プレミアムユーザーは無制限にアップロード可能

**必須参照ドキュメント**:
- **ユーザーストーリー**: `USER_STORIES.md`: US-008-1（画像アップロード）
  - または `user-stories/03-activity-logs.md`: Epic 3（活動ログ記録）
- **スキーマ定義**: `CONVEX_SCHEMA.md`: imagesテーブル定義（5. images）
- **ストレージ設計**: `CLOUDFLARE_R2_MIGRATION.md`: Cloudflare R2移行設計
- **画像戦略**: `IMAGE_STORAGE_STRATEGY.md`: 画像保存戦略
- **プレミアム機能**: `PREMIUM_FEATURES.md`: プレミアム機能の定義
- **設計ドキュメント**: `DESIGN_DOCUMENT.md`: 画像管理の設計
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 1-2の実装計画

**テンプレート**: `ai-task.yml`

---

#### TASK-1-2-4: トイレ記録機能の実装

**Issueタイトル**: `[TASK]: トイレ記録機能の実装`

**概要**:
ペットのトイレの状態を記録する機能を実装します。種別ごとに最適化された選択肢を表示します。

**実装内容**:
- [ ] Convexスキーマの定義（toilet_condition_mastersテーブル、cleaning_action_mastersテーブル）
- [ ] マスターデータ取得関数の実装（query）
- [ ] 種別ごとの選択肢を動的に表示するUI
- [ ] 前回の記録を表示する機能
- [ ] トイレタイプ（おしっこ/うんち）の選択機能
- [ ] 状態の視覚的なアイコン選択機能
- [ ] 清掃アクションの記録機能
- [ ] `apps/expo/app/pets/[id]/activities/toilet.tsx`の作成

**検証項目**:
- [ ] ペットの種類に応じて、最適化された選択肢が自動的に表示される
- [ ] 全種共通の基本的な状態を選択できる
- [ ] 犬・猫の場合、消化器・泌尿器フォーカスの選択肢が表示される
- [ ] 鳥類・爬虫類の場合、尿酸と排泄物の色の選択肢が表示される
- [ ] うさぎ・ハムスターの場合、数と大きさ、盲腸便の選択肢が表示される
- [ ] 清掃アクションを記録できる
- [ ] 前回の記録が表示される
- [ ] 異常な状態を記録した場合、AI相談への導線が表示される

**必須参照ドキュメント**:
- **ユーザーストーリー**: `USER_STORIES.md`: US-009（トイレ記録）
  - または `user-stories/03-activity-logs.md`: Epic 3（活動ログ記録）
- **画面設計**: `APP_DIRECTORY_STRUCTURE.md`: `app/pets/[id]/activities/toilet.tsx`
- **スキーマ定義**: `CONVEX_SCHEMA.md`: activitiesテーブル定義（6. activities）、toilet_condition_mastersテーブル定義（20. toilet_condition_masters）、cleaning_action_mastersテーブル定義（21. cleaning_action_masters）
- **設計ドキュメント**: `DESIGN_DOCUMENT.md`: 活動ログ記録の設計（5.4 記録画面）
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 1-2の実装計画

**テンプレート**: `ai-task.yml`

---

#### TASK-1-2-5: 散歩記録機能の実装

**Issueタイトル**: `[TASK]: 散歩記録機能の実装`

**概要**:
ペットの散歩を記録する機能を実装します（デザインなし）。

**実装内容**:
- [ ] 散歩時間の入力機能
- [ ] 距離の入力機能
- [ ] ルート画像の添付機能
- [ ] メモ入力機能
- [ ] `apps/expo/app/pets/[id]/activities/walk.tsx`の作成

**検証項目**:
- [ ] 散歩時間を入力できる
- [ ] 距離を入力できる
- [ ] ルート画像を添付できる
- [ ] メモを追加できる
- [ ] 記録後、タイムラインに表示される

**必須参照ドキュメント**:
- **ユーザーストーリー**: `USER_STORIES.md`: US-010（散歩記録）
  - または `user-stories/03-activity-logs.md`: Epic 3（活動ログ記録）
- **画面設計**: `APP_DIRECTORY_STRUCTURE.md`: `app/pets/[id]/activities/walk.tsx`
- **スキーマ定義**: `CONVEX_SCHEMA.md`: activitiesテーブル定義（6. activities）
- **設計ドキュメント**: `DESIGN_DOCUMENT.md`: 活動ログ記録の設計
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 1-2の実装計画

**テンプレート**: `ai-task.yml`

---

#### TASK-1-2-6: 日記投稿機能の実装

**Issueタイトル**: `[TASK]: 日記投稿機能の実装`

**概要**:
ペットの日記を投稿する機能を実装します。シーン・感情・タグによる簡単記録を実装します。

**実装内容**:
- [ ] Convexスキーマの定義（diary_scenesテーブル、diary_emotionsテーブル、context_stampsテーブル）
- [ ] マスターデータ取得関数の実装（query）
- [ ] テキスト入力機能（オプション）
- [ ] シーン選択機能（複数選択可能）
- [ ] 感情選択機能
- [ ] コンテキストスタンプ選択機能
- [ ] 時間帯・場所タグの選択機能
- [ ] 写真添付機能
- [ ] 公開設定の選択機能
- [ ] `apps/expo/app/pets/[id]/activities/journal.tsx`の作成

**検証項目**:
- [ ] テキストを入力できる（オプション）
- [ ] シーンを選択できる（複数選択可能）
- [ ] 感情を選択できる
- [ ] コンテキストスタンプを選択できる
- [ ] 時間帯・場所タグを選択できる
- [ ] 写真を複数枚添付できる
- [ ] 公開設定を選択できる
- [ ] 記録後、タイムラインに表示される

**必須参照ドキュメント**:
- **ユーザーストーリー**: `USER_STORIES.md`: US-011（日記投稿）
  - または `user-stories/03-activity-logs.md`: Epic 3（活動ログ記録）
- **画面設計**: `APP_DIRECTORY_STRUCTURE.md`: `app/pets/[id]/activities/journal.tsx`
- **スキーマ定義**: `CONVEX_SCHEMA.md`: activitiesテーブル定義（6. activities）、diary_scenesテーブル定義（31. diary_scenes）、diary_emotionsテーブル定義（32. diary_emotions）、context_stampsテーブル定義（34. context_stamps）
- **設計ドキュメント**: `DESIGN_DOCUMENT.md`: 活動ログ記録の設計（5.4 記録画面）
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 1-2の実装計画

**テンプレート**: `ai-task.yml`

---

#### TASK-1-2-7: ケア記録機能の実装

**Issueタイトル**: `[TASK]: ケア記録機能の実装`

**概要**:
ペットのケアを記録する機能を実装します（デザインなし）。

**実装内容**:
- [ ] ケアタイプ（爪切り、シャンプー、ワクチンなど）の選択機能
- [ ] 日付の入力機能
- [ ] 動物病院名の入力機能
- [ ] メモ入力機能
- [ ] `apps/expo/app/pets/[id]/activities/care.tsx`の作成

**検証項目**:
- [ ] ケアタイプを選択できる
- [ ] 日付を入力できる
- [ ] 動物病院名を入力できる
- [ ] メモを追加できる
- [ ] 記録後、タイムラインに表示される

**必須参照ドキュメント**:
- **ユーザーストーリー**: `USER_STORIES.md`: US-012（ケア記録）
  - または `user-stories/03-activity-logs.md`: Epic 3（活動ログ記録）
- **画面設計**: `APP_DIRECTORY_STRUCTURE.md`: `app/pets/[id]/activities/care.tsx`
- **スキーマ定義**: `CONVEX_SCHEMA.md`: activitiesテーブル定義（6. activities）
- **設計ドキュメント**: `DESIGN_DOCUMENT.md`: 活動ログ記録の設計
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 1-2の実装計画

**テンプレート**: `ai-task.yml`

---

#### TASK-1-2-8: タイムライン表示機能の実装

**Issueタイトル**: `[TASK]: タイムライン表示機能の実装`

**概要**:
ペットの活動ログを時系列で表示する機能を実装します（デザインなし）。

**実装内容**:
- [ ] `packages/backend/convex/activities.ts`に`getActivitiesByPet`関数を実装（query）
- [ ] タイムライン画面の基本実装
- [ ] 活動ログの時系列表示
- [ ] ログタイプごとの色分けアイコン表示
- [ ] 日付ごとのグループ化
- [ ] 無限スクロール機能
- [ ] 詳細表示への遷移処理
- [ ] カレンダーからの日付ジャンプ機能
- [ ] `apps/expo/app/(tabs)/timeline.tsx`の作成

**検証項目**:
- [ ] 活動ログが時系列で美しく表示される
- [ ] ログタイプごとに色分けされたアイコンで区別される
- [ ] 日付ごとにグループ化される
- [ ] 無限スクロールで過去の記録を読み込める
- [ ] 各ログをタップで詳細表示できる
- [ ] カレンダーから特定の日付にジャンプできる
- [ ] 記録のない日が一目で分かる

**必須参照ドキュメント**:
- **ユーザーストーリー**: `USER_STORIES.md`: US-013（タイムライン表示）
  - または `user-stories/03-activity-logs.md`: Epic 3（活動ログ記録）
- **画面設計**: `APP_DIRECTORY_STRUCTURE.md`: `app/(tabs)/timeline.tsx`
- **スキーマ定義**: `CONVEX_SCHEMA.md`: activitiesテーブル定義（6. activities）
- **設計ドキュメント**: `DESIGN_DOCUMENT.md`: 活動ログ記録の設計（5.3 ペット詳細画面）
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 1-2の実装計画

**テンプレート**: `ai-task.yml`

---

#### TASK-1-2-9: タイムラインビューの拡張機能の実装

**Issueタイトル**: `[TASK]: タイムラインビューの拡張機能の実装`

**概要**:
タイムラインでペットごとに絞り込んだり、記録タイプでフィルターしたり、リマインダーの完了状況を確認できる機能を実装します。

**実装内容**:
- [ ] `packages/backend/convex/activities.ts`に`getTimelineWithFilters`関数を実装（query）
- [ ] ペット選択UIの実装
- [ ] 記録タイプフィルターUIの実装
- [ ] リマインダー完了状況の表示機能
- [ ] 詳細画面への遷移と戻る機能（スクロール位置とフィルター設定の保持）
- [ ] `apps/expo/app/timeline/filters.tsx`の作成

**検証項目**:
- [ ] ペット選択UIが表示される
- [ ] 複数ペットを飼っている場合、特定のペットの記録のみを表示できる
- [ ] 記録タイプでフィルターできる（複数選択可能）
- [ ] リマインダーの完了記録がタイムラインに統合して表示される
- [ ] 完了したリマインダーは「✅ 完了」、未完了のリマインダーは「⏰ 未完了」として表示される
- [ ] 詳細画面から戻った際、元のスクロール位置とフィルター設定が保持される

**必須参照ドキュメント**:
- **ユーザーストーリー**: `USER_STORIES.md`: US-013-1（タイムラインビューの拡張機能）
  - または `user-stories/03-activity-logs.md`: Epic 3（活動ログ記録）
- **画面設計**: `APP_DIRECTORY_STRUCTURE.md`: `app/(tabs)/timeline.tsx`, `app/timeline/filters.tsx`（モーダル）
- **スキーマ定義**: `CONVEX_SCHEMA.md`: activitiesテーブル定義（6. activities）、reminder_logsテーブル定義（24. reminder_logs）
- **設計ドキュメント**: `DESIGN_DOCUMENT.md`: 活動ログ記録の設計（5.3 ペット詳細画面）
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 1-2の実装計画

**テンプレート**: `ai-task.yml`

---

#### TASK-1-2-10: リマインダー設定機能の実装

**Issueタイトル**: `[TASK]: リマインダー設定機能の実装`

**概要**:
掃除やケアのリマインダーを設定する機能を実装します。

**実装内容**:
- [ ] Convexスキーマの定義（reminder_category_mastersテーブル、remindersテーブル、reminder_logsテーブル）
- [ ] マスターデータ取得関数の実装（query）
- [ ] ペットの種類に応じたおすすめリマインダーの表示機能
- [ ] カスタムリマインダーの設定機能
- [ ] 頻度設定機能（毎日、毎週、隔週、毎月、間隔指定）
- [ ] 時間設定機能
- [ ] 完了条件の選択機能
- [ ] `packages/backend/convex/reminders.ts`に`createReminder`、`updateReminder`、`deleteReminder`関数を実装（mutation）
- [ ] `apps/expo/app/reminders/create.tsx`の作成
- [ ] `apps/expo/app/reminders/[id].tsx`の作成

**検証項目**:
- [ ] ペットの種類に応じて、おすすめのリマインダーが自動的に表示される
- [ ] カスタムリマインダーを自由に設定できる
- [ ] 頻度を柔軟に設定できる
- [ ] 時間を自由に設定できる
- [ ] 完了条件を選択できる
- [ ] リマインダーの作成・編集・削除が簡単にできる
- [ ] リマインダーの有効/無効を切り替えられる

**必須参照ドキュメント**:
- **ユーザーストーリー**: `USER_STORIES.md`: US-014（リマインダー設定）
  - または `user-stories/03-activity-logs.md`: Epic 3（活動ログ記録）
- **画面設計**: `APP_DIRECTORY_STRUCTURE.md`: `app/reminders/create.tsx`, `app/reminders/[id].tsx`
- **スキーマ定義**: `CONVEX_SCHEMA.md`: reminder_category_mastersテーブル定義（22. reminder_category_masters）、remindersテーブル定義（23. reminders）、reminder_logsテーブル定義（24. reminder_logs）
- **設計ドキュメント**: `DESIGN_DOCUMENT.md`: 活動ログ記録の設計（5.4 記録画面）
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 1-2の実装計画

**テンプレート**: `ai-task.yml`

---

#### TASK-1-2-11: リマインダー通知と完了機能の実装

**Issueタイトル**: `[TASK]: リマインダー通知と完了機能の実装`

**概要**:
リマインダーのPush通知と完了記録機能を実装します。

**実装内容**:
- [ ] Push通知の設定と送信機能
- [ ] 通知から直接完了できる機能（クイックアクション）
- [ ] 「今日のやること」リストの実装
- [ ] 完了時にポイントが付与される機能
- [ ] 完了記録がタイムラインに表示される機能
- [ ] トイレ記録などから自動完了できる機能
- [ ] `packages/backend/convex/reminders.ts`に`completeReminder`関数を実装（mutation）
- [ ] `packages/backend/convex/reminders.ts`に`getTodayReminders`関数を実装（query）
- [ ] `apps/expo/app/reminders/index.tsx`の作成

**検証項目**:
- [ ] Push通知が送信される
- [ ] 通知から直接完了できる
- [ ] アプリ内の「今日のやること」リストから完了できる
- [ ] 完了時にポイントが付与される
- [ ] 完了記録がタイムラインに表示される
- [ ] トイレ記録などから自動完了できる

**必須参照ドキュメント**:
- **ユーザーストーリー**: `USER_STORIES.md`: US-015（リマインダー通知と完了）
  - または `user-stories/03-activity-logs.md`: Epic 3（活動ログ記録）
- **画面設計**: `APP_DIRECTORY_STRUCTURE.md`: `app/reminders/index.tsx`
- **スキーマ定義**: `CONVEX_SCHEMA.md`: remindersテーブル定義（23. reminders）、reminder_logsテーブル定義（24. reminder_logs）、point_historyテーブル定義（28. point_history）
- **設計ドキュメント**: `DESIGN_DOCUMENT.md`: 活動ログ記録の設計（5.4 記録画面）
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 1-2の実装計画

**テンプレート**: `ai-task.yml`

---

#### TASK-1-2-12: 広告表示機能の実装（無料ユーザー）

**Issueタイトル**: `[TASK]: 広告表示機能の実装（無料ユーザー）`

**概要**:
無料ユーザー向けの広告表示機能を実装します。主要機能の操作を邪魔しない配置で実装します。

**実装内容**:
- [ ] 広告表示の制御ロジックの実装
- [ ] 日記タイムラインの合間に広告カードを表示する機能
- [ ] キュレーション記事一覧に広告を混ぜる機能
- [ ] リマインダー完了後のサンクス画面に広告を表示する機能
- [ ] プレミアム移行への導線機能
- [ ] 広告の表示頻度制御機能
- [ ] `packages/backend/convex/users.ts`に`adLastSeenAt`、`adLastClickedAt`フィールドの更新機能を実装

**検証項目**:
- [ ] 記録入力中には一切広告を表示しない
- [ ] アルバムの全画面表示には広告を表示しない
- [ ] 日記タイムラインの合間に自然なカードとして広告が表示される
- [ ] キュレーション記事一覧に広告が混ざる
- [ ] リマインダー完了後のサンクス画面に控えめな広告が表示される
- [ ] プレミアムに切り替えた瞬間、広告が「思い出枠」に差し替わる
- [ ] 広告の表示頻度が制御される

**必須参照ドキュメント**:
- **ユーザーストーリー**: `USER_STORIES.md`: US-018（広告表示）
  - または `user-stories/03-activity-logs.md`: Epic 3（活動ログ記録）
- **画面設計**: `APP_DIRECTORY_STRUCTURE.md`: `app/(tabs)/timeline.tsx`, `app/(tabs)/articles.tsx`
- **スキーマ定義**: `CONVEX_SCHEMA.md`: usersテーブル定義（1. users）
- **プレミアム機能**: `PREMIUM_FEATURES.md`: プレミアム機能の定義
- **設計ドキュメント**: `DESIGN_DOCUMENT.md`: 広告表示の設計
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 1-2の実装計画

**テンプレート**: `ai-task.yml`

---

### Epic 1-3: Phase 1動作検証フェーズ

#### TASK-1-3-1: ペット管理機能の動作検証

**Issueタイトル**: `[VERIFY]: ペット管理機能の動作検証`

**概要**:
Phase 1-1で実装したペット管理機能を実際の画面を通じて動作検証します。

**検証内容**:
- [ ] ペット登録フローの動作確認
- [ ] ペット一覧表示の動作確認
- [ ] 年齢表示の動作確認
- [ ] ペットプロフィール編集の動作確認
- [ ] ペット削除の動作確認
- [ ] ペット復元の動作確認

**検証方法**:
1. 実際のデバイス（iOS/Android）でアプリを起動
2. 各ペット管理フローを実際に操作
3. Convex Dashboardでデータを確認
4. エラーケースも含めて動作確認

**検証項目**:
- [ ] すべてのペット管理フローが正常に動作する
- [ ] エラーハンドリングが適切に動作する
- [ ] データが正しく保存されている
- [ ] 年齢計算が正しく動作する

**必須参照ドキュメント**:
- **ユーザーストーリー**: `USER_STORIES.md`: Epic 2（ペット管理）の全ストーリー
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 1-3の動作検証フェーズ

**テンプレート**: `verification.yml`

---

#### TASK-1-3-2: 活動ログ記録機能の動作検証

**Issueタイトル**: `[VERIFY]: 活動ログ記録機能の動作検証`

**概要**:
Phase 1-2で実装した活動ログ記録機能を実際の画面を通じて動作検証します。

**検証内容**:
- [ ] 食事記録フローの動作確認
- [ ] 画像アップロードの動作確認
- [ ] トイレ記録フローの動作確認
- [ ] 散歩記録フローの動作確認
- [ ] 日記投稿フローの動作確認
- [ ] ケア記録フローの動作確認
- [ ] タイムライン表示の動作確認
- [ ] タイムラインフィルターの動作確認
- [ ] リマインダー設定・通知・完了の動作確認
- [ ] 広告表示の動作確認

**検証方法**:
1. 実際のデバイス（iOS/Android）でアプリを起動
2. 各活動ログ記録フローを実際に操作
3. Convex Dashboardでデータを確認
4. エラーケースも含めて動作確認

**検証項目**:
- [ ] すべての活動ログ記録フローが正常に動作する
- [ ] エラーハンドリングが適切に動作する
- [ ] データが正しく保存されている
- [ ] タイムラインに正しく表示される
- [ ] リマインダーが正しく動作する

**必須参照ドキュメント**:
- **ユーザーストーリー**: `USER_STORIES.md`: Epic 3（活動ログ記録）の全ストーリー
- **実装計画**: `IMPLEMENTATION_PHASES.md`: Phase 1-3の動作検証フェーズ

**テンプレート**: `verification.yml`

---

## GitHub Issueテンプレートの使用方法

各タスクは、以下のテンプレートを使用してGitHub Issueとして作成してください：

1. **AI Task Template** (`.github/ISSUE_TEMPLATE/ai-task.yml`): 実装タスク用
2. **Epic Template** (`.github/ISSUE_TEMPLATE/epic.yml`): エピック定義用
3. **Verification Template** (`.github/ISSUE_TEMPLATE/verification.yml`): 動作検証用
4. **Feature Request Template** (`.github/ISSUE_TEMPLATE/feature-request.yml`): 新機能提案用
5. **Bug Report Template** (`.github/ISSUE_TEMPLATE/bug-report.yml`): バグ報告用

詳細は **[ISSUE_GUIDELINES.md](./ISSUE_GUIDELINES.md)** を参照してください。

**重要**: Issueを作成した後は、`.cursor/rules/ISSUE_REFERENCE.md`に従って、SkillsやRulesファイルにIssue番号を記載してください。

---

## 次のフェーズ

Phase 1が完了したら、Phase 2（家族・チーム管理）に進みます。

詳細は **[IMPLEMENTATION_PHASES.md](./IMPLEMENTATION_PHASES.md)** を参照してください。

---

## 参考資料

- [USER_STORIES.md](./USER_STORIES.md): モバイルアプリのユーザーストーリー
- [EPIC_OVERVIEW.md](./EPIC_OVERVIEW.md): 各エピックの概要とストーリー一覧
- [ISSUE_GUIDELINES.md](./ISSUE_GUIDELINES.md): GitHub Issue作成ガイドライン
- [IMPLEMENTATION_PHASES.md](./IMPLEMENTATION_PHASES.md): 実装フェーズ計画
- [.cursor/rules/ISSUE_REFERENCE.md](./.cursor/rules/ISSUE_REFERENCE.md): GitHub Issue参照方法のガイドライン

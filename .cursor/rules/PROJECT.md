# プロジェクトルール

このファイルは、Cursorエージェントがコードをどのように扱うかを定義する永続的な指示です。

## プロジェクト構成

- **モノレポ**: Turborepo + pnpm
- **アプリ**: 
  - `apps/expo/` (React Native Expo モバイルアプリ)
  - `apps/admin/` (Next.js 管理画面、ローカルのみ)
  - `apps/www/` (Next.js 公式サイト、Vercelにデプロイ) ✅ **2026年追加**
- **共有パッケージ**: 
  - `packages/backend/` (Convexバックエンド - 独立パッケージ)
  - `packages/ui/` (共通UIコンポーネント - Tamagui)
  - `packages/utils/` (共通ロジック - ビジネスロジック)
  - `packages/tsconfig/` (TypeScript共通設定)
  - `packages/policy/` (法務ドキュメント - Markdown形式) ✅ **2026年追加**
- **デザイン**: 
  - `designs/` (Pencil.devデザインファイル - `.pen`形式)

## コマンド

### 開発環境
- `pnpm dev`: すべてのアプリを起動（Turborepo経由）
- `pnpm --filter expo dev`: モバイルアプリのみ起動
- `pnpm --filter admin dev`: 管理画面のみ起動
- `pnpm --filter www dev`: 公式サイトのみ起動 ✅ **2026年追加**
- `pnpm --filter backend dev`: Convexバックエンドのみ起動
- `pnpm turbo build`: すべてのパッケージをビルド

### コード品質
- `pnpm lint`: ESLintを実行（全パッケージ）
- `pnpm format`: Prettierでフォーマット（全パッケージ）
- `pnpm typecheck`: TypeScriptの型チェック（全パッケージ）

### テスト
- `pnpm test`: テストを実行（全パッケージ）
- `pnpm --filter expo test`: モバイルアプリのテストのみ
- `pnpm maestro test`: Maestro E2Eテストを実行

## コードスタイル

### TypeScript
- 関数型プログラミングを必須とする
- 変数名は短縮せずに人が読みやすい形式にする
- ES modules (import/export) を使用、CommonJS (require) は使用しない
- 可能な場合はインポートを分割代入する: `import { foo } from 'bar'`
- 型定義は明示的に記述する

### React Native / Expo (`apps/expo/`)
- Expo Routerを使用したファイルベースルーティング（`app/`ディレクトリ）
- Tamaguiコンポーネントを使用（`@repo/ui`から共有）
- Zustandでクライアント状態を管理
- Convexの`useQuery`でサーバー状態を取得（`@repo/backend`から型安全に）
- アプリ専用UIコンポーネントは`components/`に配置

### Next.js (管理画面) (`apps/admin/`)
- App Routerを使用（`app/`ディレクトリ）
- Server Componentsを優先
- Client Componentsは`"use client"`ディレクティブを明示
- ローカル環境でのみ動作（デプロイしない）
- Convex関数は`@repo/backend`から型安全に呼び出す

### Next.js (公式サイト) (`apps/www/`) ✅ **2026年追加**
- App Routerを使用（`app/`ディレクトリ）
- Server Componentsを優先
- Vercelにデプロイ（Edge Runtimeで高速配信）
- SEO最適化：sitemap.xml、robots.txt、構造化データ（JSON-LD）を自動生成
- LLMフレンドリー：Semantic HTML、構造化データ、API Route（/api/ai-info）を提供
- Convex関数は`@repo/backend`から型安全に呼び出す（ニュース、法務ドキュメントなど）
- 法務ドキュメントは`@repo/policy`からMarkdown形式で読み込む

### Convex (`packages/backend/`)
- **重要**: Convexは独立したパッケージ（`packages/backend/`）に配置
- スキーマ、関数、AIアクションは`convex/`ディレクトリに配置
- Query関数: `query`を使用
- Mutation関数: `mutation`を使用
- Action関数: `action`を使用（外部API呼び出し時）
- 型安全性を確保（`v`スキーマを使用）
- `apps/expo`と`apps/admin`の両方から、同じバックエンド関数を型安全に呼び出す

## ワークフロー

### 開発フロー
1. コード変更後、必ず`pnpm typecheck`を実行
2. 変更が完了したら`pnpm lint`を実行
3. コミット前に`pnpm format`を実行
4. テストがある場合は`pnpm test`を実行

### ファイル構造

**モバイルアプリ (`apps/expo/`)**:
- 画面: `app/`ディレクトリ（Expo Router）
- アプリ専用コンポーネント: `components/`ディレクトリ
- 共通UIコンポーネント: `@repo/ui`からインポート
- **ディレクトリ構成**: `APP_DIRECTORY_STRUCTURE.md`を参照 ✅ **2026年追加**

**管理画面 (`apps/admin/`)**:
- 画面: `app/`ディレクトリ（Next.js App Router）
- 管理画面専用コンポーネント: `components/`ディレクトリ
- 共通UIコンポーネント: `@repo/ui`からインポート

**公式サイト (`apps/www/`)** ✅ **2026年追加**:
- 画面: `app/`ディレクトリ（Next.js App Router）
- 公式サイト専用コンポーネント: `components/`ディレクトリ
- SEO関連: `app/sitemap.ts`, `app/robots.ts`, `app/api/ai-info/route.ts`
- 構造化データ: 各ページでJSON-LDを生成
- 法務ドキュメント: `@repo/policy`からMarkdown形式で読み込む

**バックエンド (`packages/backend/`)**:
- Convex関数: `convex/`ディレクトリ
- スキーマ: `convex/schema.ts`
- 型定義: Convexが自動生成（`_generated/`）

**共有パッケージ**:
- UIコンポーネント: `packages/ui/src/`
- ユーティリティ: `packages/utils/src/`（ビジネスロジックを集約）
- TypeScript設定: `packages/tsconfig/`
- 法務ドキュメント: `packages/policy/` ✅ **2026年追加**
  - プライバシーポリシー、利用規約、特定商取引法表記などをMarkdown形式で管理
  - 公式サイト（`apps/www`）とアプリ（`apps/expo`）の両方から参照可能
  - バージョン管理と改定履歴を保持

### Gitワークフロー
- ブランチ名: `feature/`, `fix/`, `refactor/`プレフィックスを使用
- コミットメッセージ: 明確で説明的なメッセージを書く
- PR作成前に: 型チェック、リント、テストを実行

## 避けるべきこと

- スタイルガイド全文のコピー（代わりにlinterを使う）
- 考えうるすべてのコマンドを網羅してドキュメント化すること（エージェントは一般的なツールは把握している）
- ほとんど当てはまらない稀なケース向けの指示を追加すること

## MCP (Model Context Protocol) 設定

2026年現在、MCPを活用することでAIの精度と開発効率が大幅に向上します。Convex開発において特に重要なMCP設定を以下に示します。

**重要**: このプロジェクトでは以下のMCPを使用してください：
- **Sequential Thinking MCP**: 複雑なロジックやモノレポ構造の変更時は、必ず思考ステップを刻んでから実行
- **File System MCP**: モノレポの依存関係を理解し、`apps/expo`と`packages/backend`の関係を常に意識
- **Convex Schema参照**: `packages/backend/convex/schema.ts`と`packages/backend/convex/_generated/api.d.ts`を常に参照し、型整合性をチェック

### 推奨されるMCPサーバー

#### 1. SQLite / PostgreSQL MCP (DB設計補助)
- **用途**: Convexスキーマ設計のベストプラクティスを参照
- **活用例**: 「ペットアプリの最適なインデックス設計を提案して」と依頼した際、過去の設計パターンやリレーションの最適解を参照

#### 2. Google Search / Documentation MCP
- **用途**: ConvexやExpo SDKの最新ドキュメントをリアルタイムで検索
- **活用例**: 「Expo SDK 5x系の最新のカメラAPIの書き方を教えて」といった、学習データが古いAIが間違えやすい部分を補完

#### 3. File System / Memory MCP
- **用途**: プロジェクト全体のディレクトリ構造（特にモノレポの依存関係）をAIに常に意識させる
- **活用例**: `apps/expo`でコードを書いているときに、`packages/backend`のスキーマ定義を自動で読み取る

#### 4. Sequential Thinking MCP
- **用途**: 複雑なロジック（例：ペットの健康状態の自動判定アルゴリズム）を作る際、AIに「一歩ずつ論理的に考えさせる」
- **メリット**: バグが激減し、コードの品質が向上

#### 5. GitHub MCP
- **用途**: 管理画面の要件定義などをGitHubのIssueやWikiで管理している場合、それを直接AIに読み取らせてコードに変換
- **活用例**: GitHub Issueの要件を基に、Convex関数とUIコンポーネントを自動生成

### Convex Schema の共有設定

**重要**: Convex開発において最も効率が上がるのは、**「自分のConvexのスキーマとAPI定義をAIに完全に把握させる」**ことです。

**推奨設定: auto-contextの活用**

新しいチャットを始める際は、必ず`packages/backend/convex/schema.ts`をコンテキストに含めて読み直すこと。これにより、MCPの思考がより正確になります。

#### 設定手順

1. **Convex Schema の共有**:
   - Cursorの「Context」設定で、`packages/backend/convex/schema.ts` を常にインデックスに含める
   - `CONVEX_SCHEMA.md` も参照可能にする
   - 新しいチャット開始時は、`@schema.ts` または `@CONVEX_SCHEMA.md` を明示的に参照

2. **生成された型定義の参照**:
   - `npx convex dev` 実行時に生成される `packages/backend/convex/_generated/api.d.ts` をAIにMCP的に参照させる
   - これにより、AIは「今使えるAPI関数」を100%正確に提案できる

3. **モノレポ依存関係の把握**:
   - `apps/expo`で作業する際、`packages/backend`のスキーマと関数を自動で参照
   - `apps/admin`で作業する際も同様に、`packages/backend`を参照

### MCPを活用した開発フロー例

1. **ユーザー指示**: 「新しいログの種類に『投薬記録』を追加して、アプリのトップに通知が出るようにして」

2. **AI (MCP活用)**:
   - **File System MCP** で `packages/backend/convex/schema.ts` を読み取り、新しいテーブルを追加
   - **Sequential Thinking** で「まずDB更新、次にAPI作成、最後にUI変更」と計画
   - **Google Search MCP** で最新の `expo-notifications` の実装方法を確認

3. **結果**: 生成された差分を確認して「Save」を押すだけ

### MCP設定のベストプラクティス

- **常に最新の型定義を参照**: `packages/backend/convex/_generated/api.d.ts` を常に最新の状態で参照
- **スキーマ変更時の自動反映**: Convexスキーマを変更した際、AIが自動で関連するコードを更新できるようにする
- **モノレポ構造の理解**: AIが`apps/expo`と`packages/backend`の関係を理解し、適切なインポートパスを提案する

## ユーザーストーリーの活用

機能実装時は、以下のドキュメントを必ず参照してください：
- **[USER_STORIES.md](../../USER_STORIES.md)**: モバイルアプリの機能
- **[ADMIN_USER_STORIES.md](../../ADMIN_USER_STORIES.md)**: 管理画面の機能
- **[WEB_USER_STORIES.md](../../WEB_USER_STORIES.md)**: 公式サイトの機能 ✅ **2026年追加**

詳細は **[DOCUMENTATION_INDEX.md](../../DOCUMENTATION_INDEX.md)** の「クイックリファレンス」セクションを参照してください。

## 重要な注意事項

- **関数型プログラミング**: 必須。副作用を最小限にし、純粋関数を優先
- **変数名**: 短縮せず、読みやすい形式（例: `userName`）
- **モノレポ**: 共有パッケージを活用し、重複コードを避ける
- **型安全性**: TypeScriptの型を最大限活用し、`any`は避ける
- **MCP活用**: Convexのようなモダンなツールは進化が早いため、AIが「最新のドキュメント」と「あなたのローカルコード」を同時に見られる状態（MCP環境）を作ることが最強の開発効率を実現する鍵
- **ユーザーストーリー重視**: 機能実装時は、必ず **[USER_STORIES.md](../../USER_STORIES.md)**、**[ADMIN_USER_STORIES.md](../../ADMIN_USER_STORIES.md)**、または **[WEB_USER_STORIES.md](../../WEB_USER_STORIES.md)** を参照し、ユーザーの体験価値を重視した実装を行う
- **公式サイト開発**: 公式サイト（`apps/www/`）を開発する際は、ブランド戦略・UI/UXガイドライン（WEB-015〜WEB-017）を重視し、SEO・LLM最適化を実現 ✅ **2026年追加**
- **ドキュメント参照**: 詳細な情報が必要な場合は、**[DOCUMENTATION_INDEX.md](../../DOCUMENTATION_INDEX.md)** から適切なドキュメントを参照してください

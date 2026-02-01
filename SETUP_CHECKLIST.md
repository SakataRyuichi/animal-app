# セットアップチェックリスト

**📚 ドキュメントインデックス**: [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)

**関連ドキュメント**:
- [TECH_STACK_PLANNING.md](./TECH_STACK_PLANNING.md): 技術スタックの詳細
- [AGENTS.md](./AGENTS.md): 開発ガイドライン

このドキュメントは、プロジェクトを開始する前に設定すべき項目をまとめた実践的なチェックリストです。

## 📋 目次

1. [Pencil.dev セットアップ](#1-pencildev-セットアップ) ✅ **新規追加**
2. [MCP (Model Context Protocol) 設定](#2-mcp-model-context-protocol-設定)
3. [Cursor Context設定](#3-cursor-context設定)
4. [環境変数の設定](#4-環境変数の設定)
5. [各サービスのプロジェクト作成とAPIキー取得](#5-各サービスのプロジェクト作成とapiキー取得)
6. [GitHub Secrets設定（CI/CD用）](#6-github-secrets設定cicd用)
7. [環境変数管理のベストプラクティス](#7-環境変数管理のベストプラクティス)

---

## 1. Pencil.dev セットアップ ✅ **新規追加**

Pencil.devは、IDE内でデザインとコーディングを統合するMCPベースのデザインキャンバスツールです。

### 1.1 インストール手順

**Cursor拡張機能のインストール**:
1. Cursorを開く
2. `Cmd+Shift+X`（macOS）で拡張機能パネルを開く
3. 「Pencil」で検索
4. 「Install」をクリック
5. Cursorを再起動

**確認方法**:
- `.pen`ファイルを作成すると、Pencilアイコンがエディタに表示される

### 1.2 Claude Code CLIの認証（オプション）

AIマルチプレイヤー機能を使用する場合：

```bash
claude auth login
```

### 1.3 プロジェクト構造の作成

```bash
mkdir -p designs/{screens,components,design-system,flows}
```

### 1.4 最初のデザインファイルの作成

```bash
touch designs/screens/home.pen
```

Cursorで`.pen`ファイルを開くと、Pencilキャンバスが自動的にアクティブになります。

### 1.5 詳細なセットアップガイド

詳細な手順は [`.cursor/PENCIL_SETUP.md`](./.cursor/PENCIL_SETUP.md) を参照してください。

**チェックリスト**:
- [ ] Cursor拡張機能をインストール
- [ ] Claude Code CLIを認証（オプション）
- [ ] `designs/`ディレクトリを作成
- [ ] 最初の`.pen`ファイルを作成
- [ ] Pencilキャンバスが正常に動作することを確認

---

## 2. MCP (Model Context Protocol) 設定

### 1.1 Cursor設定ファイルの場所

CursorのMCP設定ファイルは以下のいずれかの場所に配置します：

- **macOS**: `~/Library/Application Support/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
- **または**: Cursor設定画面から直接設定

### 1.2 設定が必要なMCPサーバー

#### ✅ 必須（設定不要）
- **File System MCP**: Cursor標準機能（自動で有効）
- **Sequential Thinking MCP**: 設定不要（Cursor標準機能）

#### ⚠️ 推奨（設定が必要）

**1. Google Search / Documentation MCP**

**必要な準備**:
1. Google Cloud Consoleでプロジェクトを作成
2. Custom Search APIを有効化
3. APIキーを取得
4. Custom Search Engineを作成してSearch Engine IDを取得

**設定方法**:
```json
{
  "mcpServers": {
    "google-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-google-search"],
      "env": {
        "GOOGLE_API_KEY": "YOUR_GOOGLE_API_KEY",
        "GOOGLE_SEARCH_ENGINE_ID": "YOUR_SEARCH_ENGINE_ID"
      }
    }
  }
}
```

**取得方法**:
- [Google Cloud Console](https://console.cloud.google.com/)
- [Custom Search API](https://programmablesearchengine.google.com/controlpanel/create)

**2. GitHub MCP**

**必要な準備**:
1. GitHubでPersonal Access Tokenを作成
2. 必要なスコープ: `repo`, `read:org`（IssueやWikiを読み取る場合）

**設定方法**:
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_TOKEN"
      }
    }
  }
}
```

**取得方法**:
- [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
- 「Generate new token (classic)」を選択
- スコープ: `repo`, `read:org` を選択

**3. SQLite / PostgreSQL MCP（オプション）**

**設定方法**:
```json
{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sqlite"]
    }
  }
}
```

**注意**: このMCPは設定不要（環境変数不要）ですが、DB設計の補助として有効です。

### 1.3 設定手順

**方法1: リポジトリのテンプレートを使用（推奨）**

1. `.cursor/mcp.json.example`を`.cursor/mcp.json`にコピー：
   ```bash
   cp .cursor/mcp.json.example .cursor/mcp.json
   ```

2. `.cursor/mcp.json`を編集して、実際の値に置き換える：
   - `${PROJECT_ROOT}` → プロジェクトの絶対パス（例: `/Users/sakataryuichi/Documents/GitHub/animal-app`）
   - **環境変数の設定**:
     - **推奨**: `.cursor/mcp.json`に直接値を記載
       ```json
       "env": {
         "GOOGLE_API_KEY": "your-actual-api-key",
         "GOOGLE_SEARCH_ENGINE_ID": "your-actual-search-engine-id"
       }
       ```
     - **注意**: Cursorの`mcp.json`には、自動で`.env.local`から値を読み取る機能は現在ありません
     - 各開発者が手動で実際の値を書き込む必要があります

**方法2: Cursor設定画面から直接設定**

1. Cursorを開く
2. 設定画面を開く（`Cmd + ,` または `Ctrl + ,`）
3. 「MCP」または「Model Context Protocol」を検索
4. `.cursor/mcp.json.example`の内容を参考に設定を追加
5. Cursorを再起動

**注意**: `.cursor/mcp.json`は`.gitignore`に含まれているため、Gitにコミットされません。各開発者が個別に設定する必要があります。

**追加設定**: `.cursor/rules/PROJECT.md`にMCPの使用が既に定義されています。これにより、AIが自動的にSequential Thinking MCPなどを使用するようになります。

---

## 3. Cursor Context設定

### 2.1 設定が必要なファイル/ディレクトリ

Cursorの「Context」設定で、以下のファイル/ディレクトリを常にインデックスに含めます：

**必須**:
- `packages/backend/convex/schema.ts` - Convexスキーマ定義
- `packages/backend/convex/_generated/` - 生成された型定義（自動更新）
- `CONVEX_SCHEMA.md` - スキーマの詳細ドキュメント

**推奨**:
- `packages/backend/convex/` - Convex関数全体
- `TECH_STACK_PLANNING.md` - 技術選定の詳細
- `DESIGN_DOCUMENT.md` - アプリ設計の詳細

### 2.2 設定手順

1. Cursorを開く
2. 設定画面を開く（`Cmd + ,` または `Ctrl + ,`）
3. 「Context」または「Indexed Files」を検索
4. 「Add Folder」または「Add File」をクリック
5. 上記のファイル/ディレクトリを追加

---

## 4. 環境変数の設定

### 3.1 環境変数ファイルの構造

プロジェクトルートと各パッケージに`.env`ファイルを作成します：

```
animal-app/
├── .env.example              # テンプレート（Gitにコミット）
├── .env.local                # ローカル開発用（Gitにコミットしない）
├── apps/
│   ├── expo/
│   │   ├── .env.example
│   │   └── .env.local
│   └── admin/
│       ├── .env.example
│       └── .env.local
└── packages/
    └── backend/
        ├── .env.example
        └── .env.local
```

### 3.2 ルートレベルの環境変数

**`.env.local`** (ルート):
```bash
# Turborepo（オプション）
TURBO_TOKEN=your-turbo-token
TURBO_TEAM=your-team-name
```

### 3.3 バックエンド（Convex）の環境変数

**`packages/backend/.env.local`**:
```bash
# Convex
CONVEX_DEPLOYMENT=dev:your-deployment-name
CONVEX_URL=https://your-deployment.convex.cloud

# OpenAI（AI相談機能用）
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Resend（メール送信用）
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Sentry（エラートラッキング用、オプション）
SENTRY_DSN=https://xxxxxxxxxxxxx@xxxxxxxxxxxxx.ingest.sentry.io/xxxxxxxxxxxxx
```

**取得方法**:
- **Convex**: [Convex Dashboard](https://dashboard.convex.dev/) でプロジェクト作成後、Settings > Environment Variables
- **OpenAI**: [OpenAI Platform](https://platform.openai.com/api-keys) でAPIキーを作成
- **Resend**: [Resend Dashboard](https://resend.com/api-keys) でAPIキーを作成
- **Sentry**: [Sentry Dashboard](https://sentry.io/settings/) でプロジェクト作成後、DSNを取得

### 3.4 モバイルアプリ（Expo）の環境変数

**`apps/expo/.env.local`**:
```bash
# Clerk（認証）
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx

# Convex
EXPO_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Sentry（エラートラッキング）
EXPO_PUBLIC_SENTRY_DSN=https://xxxxxxxxxxxxx@xxxxxxxxxxxxx.ingest.sentry.io/xxxxxxxxxxxxx

# RevenueCat（サブスクリプション管理）
EXPO_PUBLIC_REVENUECAT_API_KEY=your-revenuecat-api-key
```

**注意**: Expoでは、クライアント側で使用する環境変数は`EXPO_PUBLIC_`プレフィックスが必要です。

**取得方法**:
- **Clerk**: [Clerk Dashboard](https://dashboard.clerk.com/) でプロジェクト作成後、API Keysから取得
- **Convex**: バックエンドと同じ（`EXPO_PUBLIC_`プレフィックス付き）
- **Sentry**: バックエンドと同じ（`EXPO_PUBLIC_`プレフィックス付き）
- **RevenueCat**: [RevenueCat Dashboard](https://app.revenuecat.com/) でプロジェクト作成後、API Keysから取得

### 3.5 管理画面（Next.js）の環境変数

**`apps/admin/.env.local`**:
```bash
# Clerk（認証）
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx

# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

**注意**: Next.jsでは、クライアント側で使用する環境変数は`NEXT_PUBLIC_`プレフィックスが必要です。

**取得方法**:
- **Clerk**: モバイルアプリと同じ（管理画面用に別プロジェクトを作成することも可能）
- **Convex**: バックエンドと同じ（`NEXT_PUBLIC_`プレフィックス付き）

### 3.6 `.env.example`ファイルの作成

各`.env.local`に対応する`.env.example`ファイルを作成し、実際の値の代わりに説明を記載します：

**`packages/backend/.env.example`**:
```bash
# Convex
CONVEX_DEPLOYMENT=dev:your-deployment-name
CONVEX_URL=https://your-deployment.convex.cloud

# OpenAI（AI相談機能用）
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Resend（メール送信用）
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Sentry（エラートラッキング用、オプション）
SENTRY_DSN=https://xxxxxxxxxxxxx@xxxxxxxxxxxxx.ingest.sentry.io/xxxxxxxxxxxxx
```

---

## 5. 各サービスのプロジェクト作成とAPIキー取得

### 4.1 Convex

**手順**:
1. [Convex Dashboard](https://dashboard.convex.dev/) にアクセス
2. 「Create Project」をクリック
3. プロジェクト名を入力（例: `animal-app`）
4. リージョンを選択（例: `ap-northeast-1`）
5. プロジェクト作成後、Settings > Environment Variablesで環境変数を確認

**必要な情報**:
- `CONVEX_DEPLOYMENT`: `dev:your-deployment-name`形式
- `CONVEX_URL`: `https://your-deployment.convex.cloud`形式

**コマンド**:
```bash
cd packages/backend
npx convex dev
```

初回実行時に、Convex CLIが自動で設定を完了します。

### 4.2 Clerk

**手順**:
1. [Clerk Dashboard](https://dashboard.clerk.com/) にアクセス
2. 「Create Application」をクリック
3. アプリケーション名を入力
4. 認証方法を選択（Email、OAuth等）
5. プロジェクト作成後、API Keysから以下を取得：
   - `Publishable Key`（`pk_test_...`）
   - `Secret Key`（`sk_test_...`）

**必要な情報**:
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`: モバイルアプリ用
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: 管理画面用
- `CLERK_SECRET_KEY`: 管理画面用（サーバー側のみ）

**注意**: モバイルアプリと管理画面で同じClerkプロジェクトを使用することも、別々に作成することも可能です。

### 4.3 OpenAI

**手順**:
1. [OpenAI Platform](https://platform.openai.com/) にアクセス
2. 「API Keys」をクリック
3. 「Create new secret key」をクリック
4. キー名を入力（例: `animal-app-dev`）
5. APIキーをコピー（**一度しか表示されないので注意**）

**必要な情報**:
- `OPENAI_API_KEY`: `sk-...`形式

**使用するモデル**:
- **GPT-4o**: 回答生成用（`$2.50/1M input tokens`, `$10/1M output tokens`）
- **text-embedding-3-small**: ベクトル化用（`$0.02/1M tokens`）

### 4.4 Resend

**手順**:
1. [Resend Dashboard](https://resend.com/) にアクセス
2. 「Sign Up」または「Log In」
3. 「API Keys」をクリック
4. 「Create API Key」をクリック
5. キー名を入力（例: `animal-app-dev`）
6. 権限を選択（`Sending access`）
7. APIキーをコピー

**必要な情報**:
- `RESEND_API_KEY`: `re_...`形式

**注意**: 無料プランでは3,000 emails/月まで送信可能。

### 4.5 Sentry

**手順**:
1. [Sentry Dashboard](https://sentry.io/) にアクセス
2. 「Create Project」をクリック
3. プラットフォームを選択（`React Native`）
4. プロジェクト名を入力（例: `animal-app`）
5. プロジェクト作成後、Settings > Client Keys (DSN)からDSNを取得

**必要な情報**:
- `SENTRY_DSN`: `https://...@...ingest.sentry.io/...`形式
- モバイルアプリ: `EXPO_PUBLIC_SENTRY_DSN`
- バックエンド: `SENTRY_DSN`（オプション）

**注意**: 無料プランでは5,000 errors/月まで追跡可能。

### 4.6 RevenueCat

**手順**:
1. [RevenueCat Dashboard](https://app.revenuecat.com/) にアクセス
2. 「Create Project」をクリック
3. プロジェクト名を入力（例: `animal-app`）
4. プラットフォームを選択（`iOS`, `Android`）
5. App Store Connect / Google Play Consoleと連携
6. プロジェクト作成後、API KeysからPublic API Keyを取得

**必要な情報**:
- `EXPO_PUBLIC_REVENUECAT_API_KEY`: Public API Key

**注意**: 無料プランでは月$10,000までの収益まで対応。

### 4.7 BetterStack（オプション）

**手順**:
1. [BetterStack Dashboard](https://betterstack.com/) にアクセス
2. 「Create Monitor」をクリック
3. 監視対象を選択（Sentry、Convex等）
4. Discord Webhookを設定
5. Webhook URLを取得

**必要な情報**:
- Discord Webhook URL（監視アラート用）

**設定場所**: BetterStack Dashboard内で設定（環境変数不要）

---

## 6. GitHub Secrets設定（CI/CD用）

### 5.1 設定が必要なSecrets

GitHubリポジトリのSettings > Secrets and variables > Actionsで以下を設定：

**必須**:
- `EXPO_TOKEN`: Expoのアクセストークン（EAS Build用）
- `CONVEX_DEPLOY_KEY`: Convexのデプロイキー（本番環境デプロイ用）

**オプション**:
- `TURBO_TOKEN`: Turborepoのリモートキャッシュ用（有料プランの場合）
- `TURBO_TEAM`: Turborepoのチーム名
- `APPLE_ID`: Apple Developerアカウント（iOSビルド用）
- `APPLE_APP_SPECIFIC_PASSWORD`: Apple App Specific Password（iOSビルド用）

### 5.2 取得方法

**EXPO_TOKEN**:
1. [Expo Dashboard](https://expo.dev/) にアクセス
2. 「Account Settings」> 「Access Tokens」をクリック
3. 「Create Token」をクリック
4. トークン名を入力（例: `github-actions`）
5. トークンをコピー

**CONVEX_DEPLOY_KEY**:
1. [Convex Dashboard](https://dashboard.convex.dev/) にアクセス
2. プロジェクトを選択
3. Settings > Deploy Keysをクリック
4. 「Create Deploy Key」をクリック
5. キー名を入力（例: `github-actions`）
6. キーをコピー

**TURBO_TOKEN**（オプション）:
1. [Turborepo Dashboard](https://turbo.build/) にアクセス
2. チームを作成（有料プランの場合）
3. Settings > Access Tokensをクリック
4. 「Create Token」をクリック
5. トークンをコピー

### 5.3 設定手順

1. GitHubリポジトリにアクセス
2. Settings > Secrets and variables > Actionsをクリック
3. 「New repository secret」をクリック
4. NameとValueを入力
5. 「Add secret」をクリック

---

## 7. 環境変数管理のベストプラクティス

### 6.1 `.gitignore`の設定

**`.gitignore`**に以下を追加：

```gitignore
# 環境変数ファイル
.env
.env.local
.env.*.local
*.env

# ただし、.env.exampleはコミットする
!.env.example
```

### 6.2 環境変数の命名規則

**Expo（モバイルアプリ）**:
- クライアント側で使用: `EXPO_PUBLIC_*`
- 例: `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`

**Next.js（管理画面）**:
- クライアント側で使用: `NEXT_PUBLIC_*`
- サーバー側で使用: `*`（プレフィックス不要）
- 例: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`

**Convex（バックエンド）**:
- 環境変数は`process.env.*`でアクセス
- 例: `process.env.OPENAI_API_KEY`

### 6.3 セキュリティのベストプラクティス

1. **`.env.local`は絶対にGitにコミットしない**
   - `.gitignore`で確実に除外
   - 定期的に`.gitignore`を確認

2. **`.env.example`を必ず作成**
   - 必要な環境変数のリストを明記
   - 実際の値は記載せず、説明のみ

3. **環境変数の値は定期的にローテーション**
   - 特に本番環境のAPIキー
   - 漏洩が疑われる場合は即座に再生成

4. **本番環境の環境変数は別途管理**
   - Convex DashboardのEnvironment Variables
   - Vercel/Netlify等のホスティングサービスの環境変数設定
   - GitHub Secrets（CI/CD用）

5. **機密情報の扱い**
   - APIキーやトークンは環境変数のみで管理
   - コードに直接記載しない
   - ログに出力しない

### 6.4 環境ごとの設定

**開発環境（ローカル）**:
- `.env.local`を使用
- 開発用のAPIキーを使用

**ステージング環境**:
- Convex Dashboardで別デプロイメントを作成
- 環境変数をConvex Dashboardで設定

**本番環境**:
- Convex Dashboardで本番デプロイメントを作成
- 環境変数をConvex Dashboardで設定
- GitHub SecretsでCI/CD用のキーを管理

### 6.5 環境変数の検証

**型安全性の確保**:
```typescript
// packages/backend/convex/env.ts
export const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};

export const OPENAI_API_KEY = getEnvVar("OPENAI_API_KEY");
export const RESEND_API_KEY = getEnvVar("RESEND_API_KEY");
```

**Expoでの検証**:
```typescript
// apps/expo/utils/env.ts
const requiredEnvVars = [
  "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "EXPO_PUBLIC_CONVEX_URL",
] as const;

export const validateEnv = () => {
  for (const key of requiredEnvVars) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
};
```

---

## 7. チェックリスト

### セットアップ前

- [ ] このドキュメントを読む
- [ ] 必要なサービスのアカウントを作成
- [ ] 必要なAPIキーを取得する準備

### MCP設定

- [ ] Google Search MCPの設定（オプション）
- [ ] GitHub MCPの設定（オプション）
- [ ] Cursorを再起動してMCPが有効か確認

### Cursor Context設定

- [ ] `packages/backend/convex/schema.ts`をContextに追加
- [ ] `packages/backend/convex/_generated/`をContextに追加
- [ ] `CONVEX_SCHEMA.md`をContextに追加

### 環境変数設定

- [ ] `.gitignore`に`.env.local`を追加
- [ ] `.env.example`ファイルを作成
- [ ] `packages/backend/.env.local`を作成
- [ ] `apps/expo/.env.local`を作成
- [ ] `apps/admin/.env.local`を作成

### サービス設定

- [ ] Convexプロジェクトを作成
- [ ] Clerkプロジェクトを作成
- [ ] OpenAI APIキーを取得
- [ ] Resend APIキーを取得
- [ ] Sentryプロジェクトを作成（オプション）
- [ ] RevenueCatプロジェクトを作成（オプション）
- [ ] BetterStackを設定（オプション）

### GitHub Secrets設定

- [ ] `EXPO_TOKEN`を設定
- [ ] `CONVEX_DEPLOY_KEY`を設定
- [ ] `TURBO_TOKEN`を設定（オプション）

### 動作確認

- [ ] `pnpm dev`で開発環境が起動するか確認
- [ ] Convexに接続できるか確認
- [ ] Clerk認証が動作するか確認
- [ ] 環境変数が正しく読み込まれているか確認

---

## 8. トラブルシューティング

### 環境変数が読み込まれない

**原因**:
- `.env.local`ファイルが正しい場所にない
- 環境変数名が間違っている
- アプリを再起動していない

**解決方法**:
1. `.env.local`ファイルの場所を確認
2. 環境変数名を確認（`EXPO_PUBLIC_*`, `NEXT_PUBLIC_*`等）
3. 開発サーバーを再起動

### MCPが動作しない

**原因**:
- Cursor設定ファイルのJSONが不正
- 環境変数が設定されていない（Google Search、GitHub MCP）
- Cursorを再起動していない

**解決方法**:
1. JSON設定の構文を確認
2. 必要な環境変数を設定
3. Cursorを再起動

### Convexに接続できない

**原因**:
- `CONVEX_URL`が間違っている
- Convexプロジェクトが作成されていない
- `npx convex dev`を実行していない

**解決方法**:
1. Convex Dashboardでプロジェクトを確認
2. `CONVEX_URL`を確認
3. `packages/backend`で`npx convex dev`を実行

---

## 9. 参考リンク

- [Convex Documentation](https://docs.convex.dev/)
- [Clerk Documentation](https://clerk.com/docs)
- [OpenAI Platform](https://platform.openai.com/)
- [Resend Documentation](https://resend.com/docs)
- [Sentry Documentation](https://docs.sentry.io/)
- [RevenueCat Documentation](https://www.revenuecat.com/docs)
- [Model Context Protocol](https://modelcontextprotocol.io/)

---

## 10. 次のステップ

セットアップが完了したら、以下を実行：

1. **プロジェクトの初期化**:
   ```bash
   pnpm install
   pnpm dev
   ```

2. **Convexスキーマの作成**:
   ```bash
   cd packages/backend
   npx convex dev
   ```

3. **開発開始**:
   - `TECH_STACK_PLANNING.md`を参照
   - `DESIGN_DOCUMENT.md`を参照
   - `USER_STORIES.md`を参照

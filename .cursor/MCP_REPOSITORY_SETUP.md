# MCP設定をリポジトリに含める方法

このドキュメントは、MCP設定をリポジトリに含めてチーム開発で共有する方法を説明します。

## 概要

MCP設定をリポジトリに含めることで、以下のメリットがあります：

- ✅ チーム全体で同じMCP設定を使用できる
- ✅ 新しいメンバーが簡単にセットアップできる
- ✅ プロジェクト固有の設定を一元管理できる

**ただし、機密情報（APIキーなど）は含めない**必要があります。

## 設定方法

### 1. `.cursor/rules/PROJECT.md`にMCPの使用を定義

リポジトリの`.cursor/rules/PROJECT.md`（またはルート直下の`.cursorrules`）に、このプロジェクトで使用するMCPを明記します。これにより、CursorのAIが「自分はこのMCPを使って思考すべきだ」と自覚します。

**Cursorのルールファイルの形式**:
- `.cursor/rules/*.md` - 複数のルールを整理する場合（推奨）
- `.cursorrules` - ルート直下に単一ファイルで管理する場合

**既に設定済み**: `.cursor/rules/PROJECT.md`にMCPの使用が定義されています。

**推奨設定: `auto-context`の活用**

`.cursor/rules/PROJECT.md`内で、「新しいチャットを始める際は、必ず`packages/backend/convex/schema.ts`をコンテキストに含めて読み直すこと」と指示しておくと、MCPの思考がより正確になります。

### 2. テンプレートファイルの作成

`.cursor/mcp.json.example`をリポジトリにコミットします。このファイルには：

- ✅ MCPサーバーの設定構造
- ✅ 環境変数のプレースホルダー（`${VARIABLE_NAME}`形式）
- ❌ 実際のAPIキーやトークンは含めない

### 3. 実際の設定ファイルの除外

`.cursor/mcp.json`は`.gitignore`に追加して、Gitにコミットしないようにします。

**理由**:
- 各開発者の環境に応じた設定（パス、APIキーなど）が異なる
- 機密情報（APIキー、トークン）が含まれる可能性がある

### 4. 環境変数の使用

**重要**: Cursorの`mcp.json`自体には、**自動で`.env.local`から値を読み取って展開する機能は現在ありません。**そのため、各開発者が`.cursor/mcp.json`を作成した際に、**手動で実際の値を書き込む**必要があります。

**方法1: 直接値を記載（推奨）**

`.cursor/mcp.json`に直接値を記載します（**注意**: Gitにコミットしない）：

```json
{
  "mcpServers": {
    "google-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-google-search"],
      "env": {
        "GOOGLE_API_KEY": "your-actual-api-key",
        "GOOGLE_SEARCH_ENGINE_ID": "your-actual-search-engine-id"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-actual-token"
      }
    }
  }
}
```

**方法2: システム環境変数を使用**

システム環境変数として設定し、`.cursor/mcp.json`で参照します：

**システム環境変数の設定**（macOS）:
```bash
# ~/.zshrc または ~/.bash_profile に追加
export GOOGLE_API_KEY="your-api-key"
export GOOGLE_SEARCH_ENGINE_ID="your-search-engine-id"
export GITHUB_PERSONAL_ACCESS_TOKEN="your-token"
```

**`.cursor/mcp.json`**:
```json
{
  "mcpServers": {
    "google-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-google-search"],
      "env": {
        "GOOGLE_API_KEY": "${GOOGLE_API_KEY}",
        "GOOGLE_SEARCH_ENGINE_ID": "${GOOGLE_SEARCH_ENGINE_ID}"
      }
    }
  }
}
```

**注意**: 方法2の場合、Cursorが環境変数を展開できるかはCursorのバージョンによります。動作しない場合は、方法1（直接値を記載）を使用してください。

## セットアップ手順

### 新規メンバーの場合

1. **リポジトリをクローン**
   ```bash
   git clone <repository-url>
   cd animal-app
   ```

2. **`.cursor/mcp.json.example`を`.cursor/mcp.json`にコピー**：
   ```bash
   cp .cursor/mcp.json.example .cursor/mcp.json
   ```

3. **`.cursor/mcp.json`を編集**：
   - `${PROJECT_ROOT}`をプロジェクトの絶対パスに置き換え
     - 例: `"/Users/yourname/Documents/GitHub/animal-app"`
   - 環境変数を設定（`.env.local`に追加、または直接記載）

4. **Cursorを再起動**

5. **MCPが動作するか確認**：
   - Cursorのチャットで「Sequential Thinkingを使って、このプロジェクトの構造を分析して」と指示
   - AIが思考ステップを刻みながら回答することを確認

### プロジェクト初期化時（初回セットアップ）

リポジトリを初期化する際は、以下の手順を推奨します：

1. **モノレポ構造の作成**：
   ```bash
   pnpm init
   # apps/ と packages/ のディレクトリ作成
   ```

2. **MCP設定の追加**：
   - `.cursor/mcp.json.example`を`.cursor/mcp.json`にコピー
   - パスを設定

3. **AIに「思考」させる**：
   Cursorのチャットで以下のように指示：
   ```
   Sequential Thinkingを使って、このペットアプリのモノレポ構造をどう構築すべきか、
   turbo.json や pnpm-workspace.yaml の内容を含めて思考（Thought）をステップごとに書き出して。
   その計画に合意できたら、一気にファイルを生成してほしい。
   ```

### 既存メンバーの場合

`.cursor/mcp.json`が既に存在する場合は、`.cursor/mcp.json.example`の変更を手動でマージしてください。

## ファイル構成

```
.cursor/
├── mcp.json.example    # テンプレート（Gitにコミット）
├── mcp.json            # 実際の設定（.gitignoreで除外）
├── rules/
├── skills/
├── commands/
└── hooks.json
```

## 環境変数の管理

### 必須の環境変数

**File System MCP**:
- `${PROJECT_ROOT}`: プロジェクトの絶対パス
  - 例: `/Users/sakataryuichi/Documents/GitHub/animal-app`
  - **注意**: この値は各開発者の環境で異なるため、環境変数ではなく直接設定することも可能

### オプションの環境変数

**Google Search MCP**:
- `GOOGLE_API_KEY`: Google Custom Search APIキー
- `GOOGLE_SEARCH_ENGINE_ID`: Custom Search Engine ID

**GitHub MCP**:
- `GITHUB_PERSONAL_ACCESS_TOKEN`: GitHub Personal Access Token

### 環境変数の設定場所

1. **`.env.local`**（推奨）:
   - プロジェクトルートに配置
   - `.gitignore`で除外されている
   - 各開発者が個別に設定

2. **システム環境変数**:
   - macOS: `~/.zshrc`または`~/.bash_profile`
   - Windows: システムの環境変数設定
   - Linux: `~/.bashrc`または`~/.zshrc`

## セキュリティのベストプラクティス

1. **`.cursor/mcp.json`は絶対にGitにコミットしない**
   - `.gitignore`で確実に除外
   - 定期的に`.gitignore`を確認

2. **APIキーやトークンは環境変数のみで管理**
   - `.cursor/mcp.json`に直接記載しない
   - `.env.local`に追加（`.gitignore`で除外）

3. **`.cursor/mcp.json.example`には機密情報を含めない**
   - プレースホルダーのみ（`${VARIABLE_NAME}`形式）
   - 実際の値は記載しない

4. **環境変数の値は定期的にローテーション**
   - 特に本番環境のAPIキー
   - 漏洩が疑われる場合は即座に再生成

## トラブルシューティング

### 環境変数が読み込まれない

**原因**:
- Cursorが環境変数を読み込めない
- `.env.local`が正しい場所にない

**解決方法**:
1. **推奨**: `.cursor/mcp.json`に直接値を記載（**注意**: Gitにコミットしない）
2. または、環境変数をシステム環境変数として設定（Cursorが環境変数展開をサポートしている場合）

**重要**: Cursorの`mcp.json`には、自動で`.env.local`から値を読み取る機能は現在ありません。各開発者が手動で実際の値を書き込む必要があります。

### パスが正しくない

**原因**:
- `${PROJECT_ROOT}`が正しく置き換えられていない
- 絶対パスが間違っている

**解決方法**:
1. `.cursor/mcp.json`で`${PROJECT_ROOT}`を実際のパスに置き換え
2. 例: `"/Users/sakataryuichi/Documents/GitHub/animal-app"`

### MCPが動作しない

**原因**:
- `.cursor/mcp.json`が存在しない
- JSON構文エラー
- Cursorを再起動していない

**解決方法**:
1. `.cursor/mcp.json`が存在するか確認
2. JSON構文を確認（JSON Lint等で検証）
3. Cursorを再起動

## package.jsonへの追加（オプション）

MCPサーバーを`package.json`の`devDependencies`に追加し、スクリプト化することも可能です。ただし、MCPは`npx`で実行するため、必須ではありません。

**オプション設定**:
```json
{
  "devDependencies": {
    "@modelcontextprotocol/server-sequential-thinking": "latest",
    "@modelcontextprotocol/server-sqlite": "latest",
    "@modelcontextprotocol/server-filesystem": "latest"
  },
  "scripts": {
    "mcp:thinking": "npx @modelcontextprotocol/server-sequential-thinking",
    "mcp:sqlite": "npx @modelcontextprotocol/server-sqlite",
    "mcp:filesystem": "npx @modelcontextprotocol/server-filesystem"
  }
}
```

**注意**: これらのスクリプトは主に開発者の参考用です。実際のMCPはCursorが自動的に`npx`で実行するため、手動で実行する必要はありません。

## Sequential Thinking MCPの活用例

このプロジェクトでは、Sequential Thinking MCPを積極的に活用します。

### 使用シーン

1. **モノレポ構造の変更時**:
   ```
   Sequential Thinkingを使って、新しいパッケージを追加する際の影響範囲を分析して。
   ステップごとに思考を書き出してから実装して。
   ```

2. **複雑なビジネスロジックの実装時**:
   ```
   Sequential Thinkingを使って、ペットの健康状態を自動判定するアルゴリズムを設計して。
   思考ステップを刻んでから実装して。
   ```

3. **型整合性の確認時**:
   ```
   Sequential Thinkingを使って、Convexスキーマの変更が
   apps/expo と apps/admin に与える影響を分析して。
   ```

### AIへの指示例

Cursorのチャットで以下のように指示すると、Sequential Thinking MCPが自動的に使用されます：

```
Sequential Thinkingを使って、このペットアプリのモノレポ構造をどう構築すべきか、
turbo.json や pnpm-workspace.yaml の内容を含めて思考（Thought）をステップごとに書き出して。
その計画に合意できたら、一気にファイルを生成してほしい。
```

## リポジトリとMCPの関係

- **MCPの実体**: あなたのPC（Cursor）にインストールされる「外部ツール」
- **リポジトリ**: AIに対して「そのツールを使ってね」と指示を出す「指示書（`.cursor/rules/PROJECT.md`）」を持つ場所

この組み合わせにより、AIはあなたのリポジトリの構造を深く理解し、**「まるで熟練のシニアエンジニアが隣で並走してくれているような」**開発体験を提供してくれます。

## 参考

- [SETUP_CHECKLIST.md](../SETUP_CHECKLIST.md) - セットアップチェックリスト
- [.cursor/MCP_SETUP.md](./MCP_SETUP.md) - MCP設定の詳細ガイド
- [.cursor/rules/PROJECT.md](./rules/PROJECT.md) - プロジェクトルール（MCPの使用が定義されている）
- [Model Context Protocol 公式サイト](https://modelcontextprotocol.io/)
- [Sequential Thinking MCP](https://cursor.directory/mcp/sequential-thinking)

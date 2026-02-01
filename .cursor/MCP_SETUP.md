# MCP (Model Context Protocol) 設定ガイド

このドキュメントは、CursorでMCPを活用して開発効率を最大化するための設定ガイドです。

## MCPとは

MCP（Model Context Protocol）は、AIが最新のドキュメントやプロジェクトのコードを正確に理解し、提案できるようにするためのプロトコルです。2026年現在、Convex開発においてMCPを活用することは「必須」と言えるほど開発効率を左右します。

## 推奨されるMCPサーバー

### 1. SQLite / PostgreSQL MCP (DB設計補助)

**用途**: Convexスキーマ設計のベストプラクティスを参照

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

**活用例**:
- 「ペットアプリの最適なインデックス設計を提案して」と依頼
- 過去の設計パターンやリレーションの最適解を参照

### 2. Google Search / Documentation MCP

**用途**: ConvexやExpo SDKの最新ドキュメントをリアルタイムで検索

**設定方法**:
```json
{
  "mcpServers": {
    "google-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-google-search"],
      "env": {
        "GOOGLE_API_KEY": "your-api-key",
        "GOOGLE_SEARCH_ENGINE_ID": "your-search-engine-id"
      }
    }
  }
}
```

**活用例**:
- 「Expo SDK 5x系の最新のカメラAPIの書き方を教えて」
- 「Convexの最新のベクトル検索の使い方は？」
- 学習データが古いAIが間違えやすい部分を補完

### 3. File System / Memory MCP

**用途**: プロジェクト全体のディレクトリ構造（特にモノレポの依存関係）をAIに常に意識させる

**設定方法**:
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem"],
      "env": {
        "ALLOWED_DIRECTORIES": "/Users/sakataryuichi/Documents/GitHub/animal-app"
      }
    }
  }
}
```

**活用例**:
- `apps/expo`でコードを書いているときに、`packages/backend`のスキーマ定義を自動で読み取る
- モノレポの依存関係を理解し、適切なインポートパスを提案

### 4. Sequential Thinking MCP

**用途**: 複雑なロジックを作る際、AIに「一歩ずつ論理的に考えさせる」

**設定方法**:
```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

**活用例**:
- ペットの健康状態の自動判定アルゴリズム
- 複雑なビジネスロジックの実装
- **メリット**: バグが激減し、コードの品質が向上

### 5. GitHub MCP

**用途**: GitHubのIssueやWikiで管理している要件定義を直接AIに読み取らせてコードに変換

**設定方法**:
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token"
      }
    }
  }
}
```

**活用例**:
- GitHub Issueの要件を基に、Convex関数とUIコンポーネントを自動生成
- 管理画面の要件定義をWikiから読み取り、Next.jsコンポーネントを生成

## Convex Schema の共有設定

**最重要**: Convex開発において最も効率が上がるのは、**「自分のConvexのスキーマとAPI定義をAIに完全に把握させる」**ことです。

### 設定手順

#### 1. Convex Schema の共有

Cursorの「Context」設定で、以下のファイルを常にインデックスに含めます：

- `packages/backend/convex/schema.ts` - Convexスキーマ定義
- `CONVEX_SCHEMA.md` - スキーマの詳細ドキュメント
- `packages/backend/convex/_generated/api.d.ts` - 生成された型定義（自動更新）

#### 2. 生成された型定義の参照

`npx convex dev` 実行時に生成される `packages/backend/convex/_generated/api.d.ts` をAIにMCP的に参照させることで、AIは「今使えるAPI関数」を100%正確に提案できるようになります。

#### 3. モノレポ依存関係の把握

- `apps/expo`で作業する際、`packages/backend`のスキーマと関数を自動で参照
- `apps/admin`で作業する際も同様に、`packages/backend`を参照
- File System MCPが自動で依存関係を理解し、適切なインポートパスを提案

## MCPを活用した開発フロー例

### 例: 投薬記録機能の追加

**ユーザー指示**: 「新しいログの種類に『投薬記録』を追加して、アプリのトップに通知が出るようにして」

**AI (MCP活用)**:
1. **File System MCP** で `packages/backend/convex/schema.ts` を読み取り、新しいテーブルを追加
2. **Sequential Thinking** で「まずDB更新、次にAPI作成、最後にUI変更」と計画
3. **Google Search MCP** で最新の `expo-notifications` の実装方法を確認
4. **生成された型定義**を参照して、型安全なAPI呼び出しを提案

**結果**: 生成された差分を確認して「Save」を押すだけ

## MCP設定のベストプラクティス

### 1. 常に最新の型定義を参照

- `packages/backend/convex/_generated/api.d.ts` を常に最新の状態で参照
- Convexスキーマを変更した際、自動で型定義が更新されることを確認

### 2. スキーマ変更時の自動反映

- Convexスキーマを変更した際、AIが自動で関連するコードを更新できるようにする
- File System MCPが変更を検知し、影響範囲を提案

### 3. モノレポ構造の理解

- AIが`apps/expo`と`packages/backend`の関係を理解し、適切なインポートパスを提案
- `@repo/backend` のようなパッケージ名を正しく認識

### 4. 最新ドキュメントの参照

- ConvexやExpo SDKの最新ドキュメントをMCP経由で検索可能にする
- 学習データが古いAIが間違えやすい部分を補完

## Cursor設定への反映

### Context設定

Cursorの設定画面で、以下のディレクトリを「Context」に追加：

```
packages/backend/convex/
packages/backend/convex/_generated/
CONVEX_SCHEMA.md
```

### MCP設定ファイル

**方法1: リポジトリのテンプレートを使用（推奨）**

1. `.cursor/mcp.json.example`を`.cursor/mcp.json`にコピー：
   ```bash
   cp .cursor/mcp.json.example .cursor/mcp.json
   ```

2. `.cursor/mcp.json`を編集して、環境変数を実際の値に置き換える

3. 詳細は [.cursor/MCP_REPOSITORY_SETUP.md](./MCP_REPOSITORY_SETUP.md) を参照

**方法2: Cursor設定画面から直接設定**

Cursorの設定ファイル（通常は `~/.cursor/mcp.json` または Cursor設定画面）に、上記のMCPサーバー設定を追加してください。

**注意**: `.cursor/mcp.json`は`.gitignore`に含まれているため、Gitにコミットされません。各開発者が個別に設定する必要があります。

## まとめ

MCPは「AIの視力を上げるメガネ」です。Convexのようなモダンなツールは進化が早いため、AIが「最新のドキュメント」と「あなたのローカルコード」を同時に見られる状態（MCP環境）を作ることが、最強の開発効率を実現する鍵となります。

この設定により、AIは以下のことができるようになります：

- ✅ Convexスキーマを正確に理解し、適切なテーブル設計を提案
- ✅ 最新のConvex/Expo SDKドキュメントを参照して、正確なコードを生成
- ✅ モノレポ構造を理解し、適切なインポートパスを提案
- ✅ 複雑なロジックを段階的に考え、バグの少ないコードを生成
- ✅ GitHub Issueの要件を基に、自動でコードを生成

## 参考リンク

- [Model Context Protocol 公式サイト](https://modelcontextprotocol.io/)
- [MCP Servers リポジトリ](https://github.com/modelcontextprotocol/servers)
- [Convex 公式ドキュメント](https://docs.convex.dev/)

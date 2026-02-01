# Cursor設定ファイル

このディレクトリには、Cursorエージェントの動作をカスタマイズする設定ファイルが含まれています。

## ディレクトリ構成

```
.cursor/
├── rules/              # プロジェクト向けの静的コンテキスト（Rules）
│   └── PROJECT.md     # プロジェクトルール
├── skills/            # 動的な機能とワークフロー（Skills）
│   ├── auto-verify/   # 自動検証フロー
│   ├── convex-patterns/  # Convex開発パターン
│   ├── development-workflow/  # 開発ワークフロー
│   ├── monorepo-patterns/  # モノレポパターン
│   ├── package-structure/  # 2026年版モノレポ構成パターン
│   └── react-native-patterns/  # React Nativeパターン
├── commands/          # 再利用可能なワークフロー（Commands）
│   ├── test          # テスト実行
│   ├── review        # コードレビュー
│   ├── lint          # リント実行
│   ├── typecheck     # 型チェック
│   ├── verify        # 包括的な検証
│   ├── debug         # デバッグ
│   ├── pr            # プルリクエスト作成
│   └── fix-issue     # Issue修正
├── hooks.json        # フック設定（自動実行スクリプト）
├── mcp.json.example # MCP設定のテンプレート（Gitにコミット）
├── MCP_SETUP.md      # MCP (Model Context Protocol) 設定ガイド
├── MCP_REPOSITORY_SETUP.md  # MCP設定をリポジトリに含める方法
├── PROJECT_INITIALIZATION.md  # プロジェクト初期化ガイド（Sequential Thinking活用）
├── PROJECT_START_PROMPT.md  # プロジェクト開始用の具体的なプロンプト集
├── PENCIL_SETUP.md  # Pencil.devセットアップガイド ✅ **デザインツール統合**
└── README.md         # このファイル
```

## Rules（静的コンテキスト）

`.cursor/rules/PROJECT.md`には、すべての会話でエージェントが参照する永続的な指示が含まれています。

- プロジェクト構成
- コマンド一覧
- コードスタイル
- ワークフロー
- **MCP (Model Context Protocol) 設定**: Convex開発効率を最大化するためのMCP設定
- **ユーザーストーリーの活用**: `USER_STORIES.md`を参照し、ユーザーの体験価値を重視した実装を行う

**重要**: 機能の実装を依頼する際は、必ず`USER_STORIES.md`を参照してください。これにより、単なる「データ入力フォーム」ではなく、ユーザーの体験価値が込められた「価値ある機能」を作り出すことができます。

## Skills（動的機能）

Skillsは、エージェントが必要に応じて動的に読み込む機能です。

- **auto-verify**: 開発後の自動検証フロー
- **convex-patterns**: Convex開発パターン
- **development-workflow**: 開発ワークフロー
- **monorepo-patterns**: Turborepoモノレポパターン
- **package-structure**: 2026年版モノレポ構成パターン（`packages/backend`独立パッケージ等）
- **react-native-patterns**: React Native Expoパターン

## Commands（再利用可能なワークフロー）

Commandsは、`/`コマンドで直接呼び出せるワークフローです。

- `/test`: テストを実行し、失敗があれば修正
- `/review`: コードレビューを実行
- `/lint`: ESLintを実行し、エラーがあれば修正
- `/typecheck`: TypeScriptの型チェックを実行
- `/verify`: 包括的な検証フロー（型チェック、リント、テスト）
- `/debug`: 問題をデバッグ
- `/pr`: プルリクエストを作成
- `/fix-issue <number>`: GitHub Issueを修正

## Hooks（自動実行）

`.cursor/hooks.json`で定義されたフックは、特定のタイミングで自動的に実行されます。

- **after_edit**: ファイル編集後に型チェックを実行（オプション）
- **before_commit**: コミット前にフォーマットとリントを実行

## 使用方法

### 基本的な使用

コード変更後、自動検証を実行：

```
/verify
```

### 特定の検証のみ実行

```
/test
/lint
/typecheck
```

### Issue修正

```
/fix-issue 123
```

### プルリクエスト作成

```
/pr
```

## 開発フロー

1. **コード変更**: エージェントにコード変更を依頼
2. **自動検証**: `/verify`コマンドで検証を実行
3. **デバッグ**: 問題があれば`/debug`でデバッグ
4. **PR作成**: `/pr`でプルリクエストを作成

## MCP (Model Context Protocol) 設定

**重要**: 2026年現在、MCPを活用することでAIの精度と開発効率が大幅に向上します。

詳細な設定方法は `.cursor/MCP_SETUP.md` を参照してください。

### 主なMCPサーバー

- **SQLite / PostgreSQL MCP**: Convexスキーマ設計のベストプラクティス参照
- **Google Search / Documentation MCP**: Convex/Expo SDKの最新ドキュメント検索
- **File System / Memory MCP**: モノレポ構造の理解と依存関係の把握
- **Sequential Thinking MCP**: 複雑なロジックの段階的思考
- **GitHub MCP**: GitHub Issue/Wikiからの要件定義読み取り

### Convex Schema の共有

- `packages/backend/convex/schema.ts` を常にインデックスに含める
- `packages/backend/convex/_generated/api.d.ts` を自動参照させる
- これにより、AIは「今使えるAPI関数」を100%正確に提案できる

## 参考ドキュメント

- `.cursor/MCP_SETUP.md`: MCP設定の詳細ガイド
- `.cursor/MCP_REPOSITORY_SETUP.md`: MCP設定をリポジトリに含める方法
- `.cursor/PROJECT_INITIALIZATION.md`: プロジェクト初期化ガイド（Sequential Thinking活用）
- `.cursor/PROJECT_START_PROMPT.md`: ⭐ **プロジェクト開始用の具体的なプロンプト集** - すぐに使えるプロンプト
- `.cursor/PENCIL_SETUP.md`: ✅ **Pencil.devセットアップガイド** - IDE内でデザインとコーディングを統合
- `AGENTS.md`: エージェントガイドライン
- `TECH_STACK_PLANNING.md`: 技術選定の詳細
- `DESIGN_DOCUMENT.md`: アプリ設計の詳細

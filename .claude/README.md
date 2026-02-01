# Claude AI 設定ファイル

このディレクトリには、Claude AIがこのプロジェクトで作業する際の設定ファイルが含まれています。

## ディレクトリ構成

```
.claude/
├── settings.json          # プロジェクト設定（共有）
├── commands/              # プロジェクト固有のスラッシュコマンド
│   ├── verify.md         # 包括的な検証フロー
│   ├── typecheck.md      # 型チェック
│   ├── lint.md           # リント
│   ├── test.md           # テスト
│   ├── format.md         # フォーマット
│   ├── user-story.md     # ユーザーストーリー参照
│   └── monorepo.md       # モノレポ構造理解
└── README.md             # このファイル
```

## Cursorルールとの併用

このプロジェクトでは、CursorのルールとClaudeの設定を併用します：

- **`.cursor/rules/PROJECT.md`**: プロジェクトルール（コードスタイル、ワークフロー）
- **`AGENTS.md`**: Cursorエージェントガイドライン（開発フロー、MCP設定）
- **`CLAUDE.md`**: Claude固有の設定と補足（プロジェクトルート）
- **`.claude/settings.json`**: Claude設定（このディレクトリ）

**重要**: Cursorのルールと矛盾する場合は、Cursorのルールを優先してください。

## 設定ファイル

### `settings.json`

プロジェクト固有の設定を定義します：

- プロジェクト情報（名前、説明、モノレポ設定）
- コードスタイル（関数型プログラミング、型安全性など）
- 技術スタック（React Native、Convex、Tamaguiなど）
- パス設定（各パッケージのパス）
- 参照ファイル（ルール、スキーマ、ユーザーストーリー）
- MCP設定（推奨サーバー、Convexスキーマ参照）
- ワークフロー（コード変更前後の手順）
- コマンド定義（検証、型チェック、リントなど）

### `commands/`

プロジェクト固有のスラッシュコマンドを定義します：

- **`verify.md`**: 包括的な検証フロー（型チェック、リント、テスト）
- **`typecheck.md`**: TypeScriptの型チェック
- **`lint.md`**: ESLintによるコード品質チェック
- **`test.md`**: テストの実行
- **`format.md`**: Prettierによるフォーマット
- **`user-story.md`**: ユーザーストーリーを参照した機能実装
- **`monorepo.md`**: モノレポ構造を理解したコード配置

**注意**: これらのコマンドはCursorの`.cursor/commands/`と併用可能です。Cursorのコマンドと併用する場合は、Cursorのコマンドを優先してください。

## 使用方法

### 基本的な使用

Claude AIでこのプロジェクトを開くと、自動的に`CLAUDE.md`と`.claude/settings.json`が読み込まれます。

### コマンドの使用

プロジェクト固有のコマンドは、スラッシュコマンドとして使用できます：

```
/verify
/typecheck
/lint
/test
/format
/user-story US-009
/monorepo
```

### Cursorコマンドとの併用

Cursorのコマンドと併用する場合：

```
/verify        # ClaudeまたはCursorのコマンド
/typecheck     # ClaudeまたはCursorのコマンド
/lint          # ClaudeまたはCursorのコマンド
```

**重要**: Cursorのコマンドと併用する場合は、Cursorのコマンドを優先してください。

## 設定の優先順位

設定は以下の順序でマージされます（後の設定が前の設定を上書き）：

1. Claudeのデフォルト設定
2. ユーザー設定（`~/.claude/settings.json`）
3. 共有プロジェクト設定（`.claude/settings.json`）
4. ローカルプロジェクト設定（`.claude/settings.local.json` - 存在する場合）
5. CLIフラグ

## 参考ドキュメント

- **`CLAUDE.md`**: ⭐ Claude AIプロジェクト設定（プロジェクトルート）
- **`AGENTS.md`**: ⭐ Cursorエージェントガイドライン
- **`.cursor/rules/PROJECT.md`**: ⭐ プロジェクトルール
- **`USER_STORIES.md`**: ⭐ ユーザーストーリー（開発の憲法）
- **`CONVEX_SCHEMA.md`**: Convexスキーマ定義
- **`.cursor/README.md`**: Cursor設定ファイルの説明

## 注意事項

- `.claude/settings.local.json`は個人設定用で、Gitにコミットしないでください
- Cursorのルールと併用する場合は、Cursorのルールを優先してください
- 設定ファイルを変更した場合は、Claude AIを再起動してください

# Claude AI プロジェクト設定

**📚 ドキュメントインデックス**: [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)

このファイルは、Claude AIがこのプロジェクトで作業する際のガイドラインです。
**Cursorのルール（`.cursor/rules/PROJECT.md`、`AGENTS.md`）と併用してください。**

**関連ドキュメント**:
- [AGENTS.md](./AGENTS.md): Cursorエージェントガイドライン
- [.cursor/rules/PROJECT.md](./.cursor/rules/PROJECT.md): プロジェクトルール
- [docs/stories/USER_STORIES.md](./docs/stories/USER_STORIES.md): ユーザーストーリー

## プロジェクト概要

プロジェクトの基本情報（ディレクトリ構成、技術スタック、コマンドなど）は [.cursor/rules/PROJECT.md](./.cursor/rules/PROJECT.md) を参照してください。

## 重要な原則

### 1. Cursorルールとの併用

このプロジェクトでは、CursorのルールとClaudeの設定を併用します：

- **`.cursor/rules/PROJECT.md`**: プロジェクトルール（コードスタイル、ワークフロー）
- **`AGENTS.md`**: Cursorエージェントガイドライン（開発フロー、MCP設定）
- **`CLAUDE.md`**: このファイル（Claude固有の設定と補足）

**重要**: Cursorのルールと矛盾する場合は、Cursorのルールを優先してください。

### 2. 関数型プログラミング

- **必須**: 関数型プログラミングを必須とする
- **純粋関数**: 副作用を最小限にし、純粋関数を優先
- **不変性**: データの不変性を重視

### 3. 変数名の規則

- **短縮禁止**: 変数名は短縮せずに人が読みやすい形式にする
- **例**: `userName`（良い）、`usrNm`（悪い）、`user_name`（悪い）

### 4. 型安全性

- **TypeScript**: 型定義を明示的に記述
- **`any`禁止**: `any`は避ける
- **型推論**: 可能な場合は型推論を活用

## 開発フロー

### コード変更前

1. **関連ファイルの確認**: 変更対象のファイルとその依存関係を確認
2. **既存パターンの確認**: 同じパターンが既に存在するか確認
3. **ユーザーストーリーの確認**: [docs/stories/USER_STORIES.md](./docs/stories/USER_STORIES.md) を参照し、ユーザーの体験価値を重視

### コード変更後

1. **型チェック**: `pnpm typecheck`を実行
2. **リント**: `pnpm lint`を実行
3. **フォーマット**: `pnpm format`を実行
4. **テスト**: 該当するテストを実行

### モノレポでの作業

モノレポの構造と共有パッケージの活用については、[.cursor/rules/PROJECT.md](./.cursor/rules/PROJECT.md) の「モノレポでの作業」セクションを参照してください。

**Skills**: `.cursor/skills/monorepo-patterns/SKILL.md` も参照してください。

## 技術スタック固有の注意事項

技術スタック固有の注意事項については、[.cursor/rules/PROJECT.md](./.cursor/rules/PROJECT.md) の「コードスタイル」セクションを参照してください。

**Skills**:
- `.cursor/skills/react-native-patterns/SKILL.md`: React Native/Expo開発パターン
- `.cursor/skills/convex-patterns/SKILL.md`: Convex開発パターン

## ユーザーストーリーの活用

機能実装時は、[docs/stories/USER_STORIES.md](./docs/stories/USER_STORIES.md) または [docs/stories/ADMIN_USER_STORIES.md](./docs/stories/ADMIN_USER_STORIES.md) を必ず参照してください。

詳細は [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) の「クイックリファレンス」セクションを参照してください。

## MCP (Model Context Protocol) 設定

MCP設定の詳細については、[.cursor/rules/PROJECT.md](./.cursor/rules/PROJECT.md) の「MCP (Model Context Protocol) 設定」セクションを参照してください。

詳細な設定手順は `.cursor/MCP_SETUP.md` を参照してください。

## エラーハンドリング・コマンドリファレンス

エラーハンドリングとコマンドリファレンスについては、[.cursor/rules/PROJECT.md](./.cursor/rules/PROJECT.md) を参照してください。

## 参考ドキュメント

**📚 すべてのドキュメントへのアクセス**: **[DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)** ⭐ **必ずここから始める**

### クイックアクセス

- **プロジェクトルール**: [.cursor/rules/PROJECT.md](./.cursor/rules/PROJECT.md) - コードスタイル、ワークフロー、コマンド
- **開発の憲法**: [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md#-開発の憲法必須読了) セクションを参照
- **Skills**: `.cursor/skills/` ディレクトリ内の各SKILL.mdを参照
  - `.cursor/skills/documentation-access/SKILL.md`: ドキュメントへの効率的なアクセス方法

## 避けるべきこと

- スタイルガイド全文のコピー（代わりにlinterを使う）
- 考えうるすべてのコマンドを網羅してドキュメント化すること（エージェントは一般的なツールは把握している）
- ほとんど当てはまらない稀なケース向けの指示を追加すること
- Cursorのルールと重複する内容（Cursorのルールを参照するように指示）

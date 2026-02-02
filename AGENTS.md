# Cursor エージェントガイドライン

**📚 ドキュメントインデックス**: [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) ⭐ **まずここから**

このドキュメントは、Cursorエージェントがこのプロジェクトで作業する際のガイドラインです。

**重要**: プロジェクトの基本情報（ディレクトリ構成、技術スタック、コマンドなど）は [.cursor/rules/PROJECT.md](./.cursor/rules/PROJECT.md) を参照してください。

## エージェントの使い方

### Plan Modeの活用

大きな機能追加や複数ファイルにわたる変更の場合は、**Plan Mode** (`Shift+Tab`)を使用してください。

1. **探索**: コードベースを調査し、関連ファイルを見つける
2. **計画**: 詳細な実装プランを作成（ファイルパス、コード参照を含む）
3. **承認待ち**: 実装前にユーザーの承認を待つ
4. **実装**: 承認後に実装を開始

小さな変更（タイポ修正、ログ追加、変数名変更など）は、Plan Modeをスキップして直接実装してください。

### コンテキスト管理

- **ファイル参照**: `@filename`を使用してファイルを参照
- **エージェントに探索を任せる**: プロンプト内ですべてのファイルに手動でタグ付けする必要はありません。エージェントが必要に応じてコンテキストを取得します
- **MCP (Model Context Protocol) の活用**: 
  - `packages/backend/convex/schema.ts` と `packages/backend/convex/_generated/api.d.ts` を常に参照可能にする
  - モノレポ構造を理解し、`apps/expo`で作業する際は`packages/backend`のスキーマを自動で参照
  - 最新のConvex/Expo SDKドキュメントをMCP経由で検索可能にする
- **新しい会話を始めるタイミング**:
  - 別のタスクや機能に移るとき
  - エージェントが混乱している、または同じ間違いを繰り返すとき
  - ひとつの論理的な作業単位が完了したとき

### 検証可能な目標を提供

エージェントが自分の作業を検証できるように、以下を提供してください：

- **テスト**: テストケースを書かせる、または既存のテストを実行させる
- **型チェック**: `pnpm typecheck`を実行して型エラーを確認
- **リント**: `pnpm lint`を実行してコード品質を確認
- **スクリーンショット**: UI変更の場合は、スクリーンショットで視覚的に確認

## 開発フロー

### 1. コード変更

エージェントにコード変更を依頼する際は、以下を明確に指定してください：

- **対象ファイル**: どのファイルを変更するか
- **変更内容**: 何を実装するか
- **制約**: 既存のパターンに従う、特定のライブラリを使用するなど

### 2. 自動検証（開発後）

コード変更後は、以下のコマンドを自動で実行してください：

- `/test`: テストを実行し、失敗があれば修正
- `/review`: コードレビューを実行
- `/lint`: ESLintを実行し、エラーがあれば修正
- `/typecheck`: TypeScriptの型チェックを実行

### 3. デバッグ

問題が発生した場合：

- **Debug Mode**: 再現可能なバグの場合は、Debug Modeを使用
- **ログ追加**: 問題の原因を特定するためにログを追加
- **テスト追加**: バグを再現するテストを追加してから修正

## モノレポでの作業

モノレポの構造と共有パッケージの活用については、[.cursor/rules/PROJECT.md](./.cursor/rules/PROJECT.md) の「モノレポでの作業」セクションを参照してください。

**重要**: `.cursor/skills/monorepo-patterns/SKILL.md` も参照してください。

## 技術スタック固有の注意事項

技術スタック固有の注意事項については、[.cursor/rules/PROJECT.md](./.cursor/rules/PROJECT.md) の「コードスタイル」セクションを参照してください。

**Skills**:
- `.cursor/skills/react-native-patterns/SKILL.md`: React Native/Expo開発パターン
- `.cursor/skills/convex-patterns/SKILL.md`: Convex開発パターン

## エラーハンドリング・パフォーマンス・自動検証

これらの詳細については、[.cursor/rules/PROJECT.md](./.cursor/rules/PROJECT.md) および `.cursor/skills/development-workflow/SKILL.md` を参照してください。

**自動検証コマンド**: `.cursor/commands/` を参照してください。

## 参考ドキュメント

**📚 すべてのドキュメントへのアクセス**: **[DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)** ⭐ **必ずここから始める**

### クイックアクセス

- **プロジェクトルール**: [.cursor/rules/PROJECT.md](./.cursor/rules/PROJECT.md) - コードスタイル、ワークフロー、コマンド
- **開発の憲法**: [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md#-開発の憲法必須読了) セクションを参照
  - [USER_STORIES.md](./USER_STORIES.md): モバイルアプリのユーザーストーリー
  - [APP_DIRECTORY_STRUCTURE.md](./APP_DIRECTORY_STRUCTURE.md): アプリのディレクトリ構成と画面マッピング ✅ **2026年追加 - Expo Routerの画面構成とユーザーストーリーの紐づけ**
  - [ADMIN_USER_STORIES.md](./ADMIN_USER_STORIES.md): 管理画面のユーザーストーリー
  - [WEB_USER_STORIES.md](./WEB_USER_STORIES.md): 公式サイトのユーザーストーリー ✅ **2026年追加 - SEO・LLMフレンドリーな公式サイト、ブランド戦略**
  - [CONVEX_SCHEMA.md](./CONVEX_SCHEMA.md): Convexスキーマ定義
- **Skills**: `.cursor/skills/` ディレクトリ内の各SKILL.mdを参照
  - `.cursor/skills/documentation-access/SKILL.md`: ドキュメントへの効率的なアクセス方法
  - `.cursor/skills/monorepo-patterns/SKILL.md`: モノレポでの作業パターン
  - `.cursor/skills/package-structure/SKILL.md`: パッケージ構造と依存関係
  - `.cursor/skills/development-workflow/SKILL.md`: 開発後の自動検証とデバッグフロー

### ユーザーストーリーの活用

機能実装時は、以下のドキュメントを必ず参照してください：
- [USER_STORIES.md](./USER_STORIES.md): モバイルアプリの機能
- [APP_DIRECTORY_STRUCTURE.md](./APP_DIRECTORY_STRUCTURE.md): アプリの画面構成とユーザーストーリーのマッピング ✅ **2026年追加 - 画面パスとユーザーストーリーの対応関係**
- [ADMIN_USER_STORIES.md](./ADMIN_USER_STORIES.md): 管理画面の機能
- [WEB_USER_STORIES.md](./WEB_USER_STORIES.md): 公式サイトの機能 ✅ **2026年追加**
  - ブランド戦略・UI/UXガイドライン（WEB-015〜WEB-017）
  - SEO・LLM最適化（WEB-013、WEB-014、WEB-018）
  - モノレポ運用・自動更新（WEB-019、WEB-020）

詳細は [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) の「クイックリファレンス」セクションを参照してください。

### 公式サイト開発時の注意事項 ✅ **2026年追加**

公式サイト（`apps/www/`）を開発する際は、以下の点に注意してください：

- **ブランド戦略**: [WEB_USER_STORIES.md](./WEB_USER_STORIES.md)のWEB-015〜WEB-017を参照し、「清潔感（信頼）」と「体温（幸福）」の共存を実現
- **ストーリーテリング**: Empathy（共感）→ Solution（解決）→ Future（未来）→ Social Proof（信頼）の流れを意識
- **UIコンポーネントの共通化**: `packages/ui`のコンポーネントを活用し、アプリと公式サイトで一貫したデザインを実現
- **SEO・LLM最適化**: sitemap.xml、robots.txt、構造化データ（JSON-LD）を適切に設定
- **法務ドキュメントの一元管理**: `packages/policy/`のMarkdownファイルを参照し、アプリと公式サイトで同じ内容を表示
- **ニュースの自動更新**: Convexの`news`テーブルを更新すると、VercelのOn-demand ISRにより自動的に反映される

詳細は [DESIGN_DOCUMENT.md](./DESIGN_DOCUMENT.md) の「5.11 公式サイト（Next.js + Vercel）」セクションを参照してください。

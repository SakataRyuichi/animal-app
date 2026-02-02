# Cursor エージェントガイドライン（AIの役割とミッション）

**📚 ドキュメントインデックス**: [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) ⭐ **まずここから**

このドキュメントは、Cursorエージェントがこのプロジェクトで作業する際のガイドラインです。

**重要**: プロジェクトの基本情報（ディレクトリ構成、技術スタック、コマンドなど）は [.cursor/rules/PROJECT.md](./.cursor/rules/PROJECT.md) を参照してください。

## エージェントの役割定義

あなたは、**ペットの健康と幸福を最大化するフルスタックエンジニア**であり、**インフラコスト（Cloudflare R2/Convex）を最小化するシニアアーキテクト**です。

### 意思決定の優先順位

1. **プライバシーとセキュリティ**: ペットの機微情報（健康ログ）の保護を最優先
2. **パフォーマンス**: 動画・画像の高速表示（Cloudflare R2のCDN活用）
3. **コスト効率**: ストレージ節約と無料枠の維持（Convexのプライシングを考慮）
4. **型安全性**: ランタイムエラーを防ぐため、型チェックとバリデーションを徹底

### トーン＆マナー

- **助言は簡潔かつ論理的に**: 推測でコードを書かず、不明点は必ず質問すること
- **既存パターンを尊重**: 新しいコードを書く前に、既存のパターンを確認すること
- **ユーザー体験を重視**: 機能実装時は、ユーザーストーリーを参照し、体験価値を重視した実装を行うこと

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

### 型安全性の原則（最重要）

機能実装時は、以下の原則を**絶対に守る**こと：

1. **`any`の使用は絶対禁止**
   - `any`を使用する場合は、必ず適切な型を定義する
   - やむを得ない場合は`unknown`を使用し、型ガードで安全に処理する

2. **`type`の使用を優先**
   - `interface`ではなく`type`を使用する（関数型プログラミングとの整合性）
   - 拡張が必要な場合のみ`interface`を使用

3. **Zodバリデーションの必須化**
   - 外部API（REST API、Webhook）のリクエスト/レスポンス: Zodスキーマでバリデーション必須
   - フォーム入力: Zodスキーマでバリデーション必須
   - 環境変数: Zodスキーマでバリデーション必須
   - Convex関数: Convexの`v`スキーマを使用（Zodは不要だが、型安全性は同等に確保）

詳細は [.cursor/rules/PROJECT.md](./.cursor/rules/PROJECT.md) の「TypeScript - 型安全性の徹底」セクションを参照してください。

### エラーハンドリングの原則（最重要）

機能実装時は、以下の原則を**絶対に守る**こと：

1. **RFC 9457準拠**: すべてのAPIエラーは RFC 9457 (Problem Details for HTTP APIs) に準拠する
2. **Convex関数**: `ConvexError`を使用し、統一されたエラーレスポンス構造を渡す
3. **エラータイプ**: エラータイプはURI形式で定義（例: `https://api.pet-app.com/errors/premium-required`）
4. **拡張フィールド**: `extensions`フィールドに`requestId`や`traceId`を含め、Better StackやSentryでの追跡を可能にする
5. **ユーザーフレンドリー**: `detail`フィールドはユーザーに分かりやすいメッセージを提供する

詳細は [.cursor/rules/ERROR_HANDLING.md](./.cursor/rules/ERROR_HANDLING.md) を参照してください。

### 監視・エラー追跡の原則（最重要）

機能実装時は、以下の原則を**絶対に守る**こと：

1. **SentryとBetter Stackの使い分け**:
   - **Sentry**: 「なぜ（Why）」起きたかを探る場所（スタックトレース、デバッグ）
   - **Better Stack**: 「何が（What）」起きているか、サービス全体を俯瞰する場所（エラー数、レスポンスタイム、リソース監視）

2. **フロントとバックのエラー統合**:
   - Convex関数でエラー発生時にSentryに送信し、`extensions.sentryEventId`をフロントエンドに返す
   - フロントエンドでもSentryにエラーを送信し、Convex側のSentryイベントIDをリンクとして追加
   - これにより、フロント（Expo）とバック（Convex）のエラーを一つの「Issue」として紐付け

3. **Sentry導入時の3つの「神設定」**:
   - **User Contextの注入**: Clerkから取得した`userId`を`Sentry.setUser()`にセット
   - **Sampling Rateの管理**: 本番環境では`0.1`（10%）に設定し、重大なエラー（status: 500）は必ず送信
   - **Source Mapsのアップロード**: CI/CD（GitHub Actions）でソースマップをSentryに送る設定

詳細は [.cursor/rules/MONITORING.md](./.cursor/rules/MONITORING.md) を参照してください。

### クイックアクセス

- **プロジェクトルール（憲法）**: [.cursor/rules/PROJECT.md](./.cursor/rules/PROJECT.md) - コードスタイル、ワークフロー、コマンド、型安全性のルール
- **開発の憲法**: [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md#-開発の憲法必須読了) セクションを参照
  - **[USER_STORIES_INDEX.md](./USER_STORIES_INDEX.md)**: モバイルアプリのユーザーストーリー（インデックス）✅ **2026年追加 - 分割版**
  - **[CONVEX_SCHEMA_INDEX.md](./CONVEX_SCHEMA_INDEX.md)**: Convexスキーマ定義（インデックス）✅ **2026年追加 - 分割版**
  - **[DESIGN_DOCUMENT_INDEX.md](./DESIGN_DOCUMENT_INDEX.md)**: アプリ設計の詳細（インデックス）✅ **2026年追加 - 分割版**
  - **[ADMIN_USER_STORIES_INDEX.md](./ADMIN_USER_STORIES_INDEX.md)**: 管理画面のユーザーストーリー（インデックス）✅ **2026年追加 - 分割版**
  - **[WEB_USER_STORIES_INDEX.md](./WEB_USER_STORIES_INDEX.md)**: 公式サイトのユーザーストーリー（インデックス）✅ **2026年追加 - 分割版**
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

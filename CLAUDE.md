# Claude AI プロジェクト設定

このファイルは、Claude AIがこのプロジェクトで作業する際のガイドラインです。
**Cursorのルール（`.cursor/rules/PROJECT.md`、`AGENTS.md`）と併用してください。**

## プロジェクト概要

ペット管理アプリ（iOS/Android）のモノレポプロジェクトです。

### ディレクトリ構成

```
my-pet-platform/
├── apps/
│   ├── expo/                # モバイルアプリ (React Native Expo)
│   │   ├── app/            # Expo Router (画面定義)
│   │   └── components/    # アプリ専用UI
│   └── admin/              # ローカル専用管理画面 (Next.js)
│       ├── app/            # App Router
│       └── components/      # 管理画面専用UI
├── packages/
│   ├── backend/            # バックエンド (Convex) - 独立パッケージ
│   │   ├── convex/         # スキーマ、関数、AIアクション
│   │   └── package.json
│   ├── ui/                 # 共通UIコンポーネント (Tamagui)
│   ├── utils/              # 共通ロジック (ビジネスロジック)
│   └── tsconfig/           # TypeScript共通設定
├── package.json            # ルートの依存関係・ワークスペース定義
├── turbo.json              # Turborepoのタスクパイプライン設定
└── pnpm-workspace.yaml     # pnpmのモノレポ定義
```

### 技術スタック

- **フロントエンド**: React Native Expo (モバイル), Next.js (管理画面)
- **バックエンド**: Convex (`packages/backend/` - 独立パッケージ)
- **認証**: Clerk
- **モノレポ**: Turborepo + pnpm
- **UI**: Tamagui (`packages/ui/`で共通化)

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
3. **ユーザーストーリーの確認**: `USER_STORIES.md`を参照し、ユーザーの体験価値を重視

### コード変更後

1. **型チェック**: `pnpm typecheck`を実行
2. **リント**: `pnpm lint`を実行
3. **フォーマット**: `pnpm format`を実行
4. **テスト**: 該当するテストを実行

### モノレポでの作業

**重要原則**:
1. **バックエンドは独立パッケージ**: `packages/backend/`に配置し、`apps/expo`と`apps/admin`の両方から型安全に呼び出す
2. **UIコンポーネントは共通化**: `packages/ui/`にTamaguiコンポーネントを配置し、モバイルとWebの両方で使用
3. **ビジネスロジックは集約**: `packages/utils/`にビジネスロジックを集約し、計算結果のズレを防ぐ
4. **重複コードを避ける**: 既存の共有パッケージを確認してから、新しいコードを書く

**使用例**:
- モバイルアプリから: `import { api } from "@repo/backend/convex/_generated/api"`
- 管理画面から: `import { api } from "@repo/backend/convex/_generated/api"`
- UIコンポーネント: `import { Button } from "@repo/ui"`
- ユーティリティ: `import { calculateAge } from "@repo/utils"`

## 技術スタック固有の注意事項

### React Native / Expo

- Expo Routerのファイルベースルーティングに従う
- Tamaguiコンポーネントを使用（`packages/ui`から）
- ネイティブモジュールは使用前に確認（Expo Goで動作するか）

### Convex

- Query/Mutation/Actionの使い分けを理解する
- スキーマ定義（`CONVEX_SCHEMA.md`）を参照
- 型安全性を確保（`v`スキーマを使用）
- **重要**: `packages/backend/convex/schema.ts`と`packages/backend/convex/_generated/api.d.ts`を常に参照

### Next.js (管理画面)

- App Routerを使用（`app/`ディレクトリ）
- Server Componentsを優先
- Client Componentsは`"use client"`ディレクティブを明示
- ローカル環境でのみ動作（デプロイしない）

### TypeScript

- ES modules (import/export) を使用、CommonJS (require) は使用しない
- 可能な場合はインポートを分割代入する: `import { foo } from 'bar'`
- 型定義は明示的に記述する

## ユーザーストーリーの活用

`USER_STORIES.md`は「開発の憲法」として機能します。機能の実装を依頼する際は、以下のように指示してください：

```
ユーザーストーリードキュメントの US-009（トイレ記録）を実装して。
特に『受け入れ基準』にある視覚的なアイコン選択と、異常時のAI相談への導線を忘れずに。
『体験価値』にある『専門知識がなくても記録できる』UIを重視して作成して。
```

詳細は`USER_STORIES.md`の「AI（Cursor）への指示への活用」セクションを参照してください。

## MCP (Model Context Protocol) 設定

**重要**: 2026年現在、MCPを活用することでAIの精度と開発効率が大幅に向上します。

### 推奨されるMCPサーバー

1. **Sequential Thinking MCP**: 複雑なロジックやモノレポ構造の変更時は、必ず思考ステップを刻んでから実行
2. **File System MCP**: モノレポの依存関係を理解し、`apps/expo`と`packages/backend`の関係を常に意識
3. **Convex Schema参照**: `packages/backend/convex/schema.ts`と`packages/backend/convex/_generated/api.d.ts`を常に参照し、型整合性をチェック
4. **Google Search / Documentation MCP**: ConvexやExpo SDKの最新ドキュメントをリアルタイムで検索
5. **GitHub MCP**: GitHub Issue/Wikiからの要件定義読み取り

### Convex Schema の共有設定

**重要**: Convex開発において最も効率が上がるのは、**「自分のConvexのスキーマとAPI定義をAIに完全に把握させる」**ことです。

新しいチャットを始める際は、必ず`packages/backend/convex/schema.ts`をコンテキストに含めて読み直すこと。これにより、MCPの思考がより正確になります。

詳細は`.cursor/MCP_SETUP.md`を参照してください。

## エラーハンドリング

エラーが発生した場合：

1. **エラーメッセージを確認**: エラーの全文を読み、原因を特定
2. **関連ファイルを確認**: エラーが発生しているファイルとその依存関係を確認
3. **段階的に修正**: 一度にすべてを変更せず、段階的に修正
4. **検証**: 修正後、必ずテストまたは型チェックを実行

## 参考ドキュメント

- **`AGENTS.md`**: ⭐ Cursorエージェントガイドライン（開発フロー、MCP設定）
- **`.cursor/rules/PROJECT.md`**: ⭐ プロジェクトルール（コードスタイル、ワークフロー）
- **`SETUP_CHECKLIST.md`**: ⭐ **セットアップ前に必読** - 設定が必要な項目のチェックリスト
- **`USER_STORIES.md`**: ⭐ **開発の憲法** - ユーザーストーリー（AIへの指示に活用）
- **`CONVEX_SCHEMA.md`**: Convexスキーマ定義
- **`DESIGN_DOCUMENT.md`**: アプリ設計の詳細
- **`TECH_STACK_PLANNING.md`**: 技術選定の詳細
- **`.cursor/README.md`**: Cursor設定ファイルの説明
- **`.cursor/MCP_SETUP.md`**: MCP設定の詳細ガイド

## コマンドリファレンス

### 開発環境
- `pnpm dev`: すべてのアプリを起動（Turborepo経由）
- `pnpm --filter expo dev`: モバイルアプリのみ起動
- `pnpm --filter admin dev`: 管理画面のみ起動
- `pnpm --filter backend dev`: Convexバックエンドのみ起動

### コード品質
- `pnpm lint`: ESLintを実行（全パッケージ）
- `pnpm format`: Prettierでフォーマット（全パッケージ）
- `pnpm typecheck`: TypeScriptの型チェック（全パッケージ）

### テスト
- `pnpm test`: テストを実行（全パッケージ）
- `pnpm --filter expo test`: モバイルアプリのテストのみ
- `pnpm maestro test`: Maestro E2Eテストを実行

## 避けるべきこと

- スタイルガイド全文のコピー（代わりにlinterを使う）
- 考えうるすべてのコマンドを網羅してドキュメント化すること（エージェントは一般的なツールは把握している）
- ほとんど当てはまらない稀なケース向けの指示を追加すること
- Cursorのルールと重複する内容（Cursorのルールを参照するように指示）

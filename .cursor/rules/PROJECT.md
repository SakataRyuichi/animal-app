# プロジェクトルール（憲法）

このファイルは、Cursorエージェントがコードをどのように扱うかを定義する**永続的な指示（憲法）**です。

**重要**: このファイルは「開発の憲法」として機能します。すべてのコード変更は、このルールに従う必要があります。

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

## コードスタイル（絶対に守るべきルール）

### TypeScript - 型安全性の徹底 ⚠️ **最優先事項**

#### 基本原則
- **関数型プログラミング**: 必須。副作用を最小限にし、純粋関数を優先
- **変数名**: 短縮せずに人が読みやすい形式にする（例: `userName`、`petId`）
- **ES modules**: `import/export`を使用、CommonJS (`require`) は使用しない
- **分割代入**: 可能な場合はインポートを分割代入する: `import { foo } from 'bar'`

#### 型定義のルール ⚠️ **厳格に遵守**
1. **`any`の使用は絶対禁止**
   - `any`を使用する場合は、必ず適切な型を定義する
   - やむを得ない場合は`unknown`を使用し、型ガードで安全に処理する
   - `as any`による型アサーションは禁止（緊急時のみ許可、理由をコメントで明記）

2. **`type`の使用を優先**
   - `interface`ではなく`type`を使用する（関数型プログラミングとの整合性）
   - 拡張が必要な場合のみ`interface`を使用
   - 型の合成には`&`（交差型）や`|`（合併型）を使用

3. **明示的な型定義**
   - 関数の引数と戻り値は必ず型を明示する
   - 型推論が可能でも、公開APIは明示的に型を定義する
   - 複雑な型は`type`エイリアスで定義し、再利用可能にする

4. **Zodバリデーションの必須化**
   - **外部API（REST API、Webhook）のリクエスト/レスポンス**: Zodスキーマでバリデーション必須
   - **フォーム入力**: Zodスキーマでバリデーション必須
   - **環境変数**: Zodスキーマでバリデーション必須
   - **Convex関数**: Convexの`v`スキーマを使用（Zodは不要だが、型安全性は同等に確保）

#### 型安全性の実装例

詳細な実装例とチェックリストは **[TYPESCRIPT.md](./TYPESCRIPT.md)** を参照してください。

```typescript
// ✅ 良い例: typeを使用、明示的な型定義、Zodバリデーション
import { z } from "zod";

// Zodスキーマで型とバリデーションを同時に定義
const PetSchema = z.object({
  name: z.string().min(1).max(50),
  species: z.enum(["dog", "cat", "reptile", "other"]),
  birthDate: z.number(),
});

type Pet = z.infer<typeof PetSchema>;

// 関数の型を明示
const createPet = async (petData: Pet): Promise<Pet> => {
  // Zodでバリデーション
  const validatedData = PetSchema.parse(petData);
  // ...
  return validatedData;
};

// ❌ 悪い例: anyの使用、型定義なし
const createPet = async (petData: any) => {
  // anyは禁止
  return petData;
};
```

#### Convex関数での型安全性

```typescript
// Convex関数では`v`スキーマを使用（Zodは不要）
import { v } from "convex/values";

export const createPet = mutation({
  args: {
    name: v.string(),
    species: v.union(v.literal("dog"), v.literal("cat"), v.literal("reptile"), v.literal("other")),
    birthDate: v.number(),
  },
  handler: async (ctx, args) => {
    // argsは自動的に型付けされる
    const pet = await ctx.db.insert("pets", args);
    return pet;
  },
});
```

#### 外部API呼び出し時のZodバリデーション

```typescript
// Convex Actionから外部APIを呼び出す場合
import { z } from "zod";

const ExternalApiResponseSchema = z.object({
  data: z.array(z.object({
    id: z.string(),
    name: z.string(),
  })),
});

export const fetchExternalData = action({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args) => {
    // 外部API呼び出し
    const response = await fetch(args.url);
    const json = await response.json();
    
    // Zodでバリデーション（必須）
    const validatedData = ExternalApiResponseSchema.parse(json);
    
    return validatedData;
  },
});
```

### React Native / Expo (`apps/expo/`) ⚠️ **技術的制約**
- **ルーティング**: Expo Routerを使用したファイルベースルーティング（`app/`ディレクトリ）
- **UIライブラリ**: Tamaguiコンポーネントを使用（`@repo/ui`から共有）
  - NativeWindは使用しない（Tamaguiを統一UIライブラリとして使用）
- **状態管理**: Zustandでクライアント状態を管理
- **サーバー状態**: Convexの`useQuery`でサーバー状態を取得（`@repo/backend`から型安全に）
- **コンポーネント**: アプリ専用UIコンポーネントは`components/`に配置
- **型安全性**: Convex関数の呼び出しは型安全に（`api`オブジェクトから型推論される）

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

### Convex (`packages/backend/`) ⚠️ **重要な制約**
- **重要**: Convexは独立したパッケージ（`packages/backend/`）に配置
- スキーマ、関数、AIアクションは`convex/`ディレクトリに配置
- Query関数: `query`を使用
- Mutation関数: `mutation`を使用
- Action関数: `action`を使用（外部API呼び出し時）
- **型安全性**: `v`スキーマを使用し、型安全性を確保（`any`は禁止）
- **外部API呼び出し**: Convex Actionからのみ外部API（Cloudflare R2、Discord、OpenAI等）を呼び出す
  - Query/Mutationから外部APIを呼び出すことは禁止
  - 外部APIのレスポンスはZodスキーマでバリデーション必須
- **共有**: `apps/expo`と`apps/admin`の両方から、同じバックエンド関数を型安全に呼び出す

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

## エラーハンドリング規格

すべてのAPIエラーは **RFC 9457 (Problem Details for HTTP APIs)** に準拠する必要があります。

詳細は **[ERROR_HANDLING.md](./ERROR_HANDLING.md)** を参照してください。

### 監視・エラー追跡（Sentry + Better Stack）

SentryとBetter Stackを活用した監視・エラー追跡の設計は **[MONITORING.md](./MONITORING.md)** を参照してください。

**重要**: 
- **Sentry**: 「なぜ（Why）」起きたかを探る場所（スタックトレース、デバッグ）
- **Better Stack**: 「何が（What）」起きているか、サービス全体を俯瞰する場所（エラー数、レスポンスタイム、リソース監視）
- **統合**: Convex関数でエラー発生時にSentryに送信し、`extensions.sentryEventId`をフロントエンドに返すことで、フロントとバックのエラーを一つの「Issue」として紐付け

### 基本原則

- **Convex関数**: `ConvexError`を使用し、RFC 9457準拠の構造を渡す
- **Next.js API Route**: 同じエラーレスポンス構造を使用
- **Expo（モバイルアプリ）**: Convex関数のエラーをキャッチし、ユーザーに分かりやすいメッセージを表示
- **監視・分析**: Better Stack LogsとSentryに構造化されたエラーログを送信

### エラーレスポンス構造

```typescript
type ErrorResponse = {
  type: string;        // エラーの種類を特定するURI（例: https://api.pet-app.com/errors/premium-required）
  title: string;       // 人間が読める短いエラー概要（例: Premium Required）
  status: number;      // HTTPステータスコード（例: 403）
  detail?: string;     // この発生事例に関する具体的な説明（例: この機能はプレミアム会員限定です）
  instance?: string;   // エラーが発生した具体的なリソースのURI（デバッグ用）
  extensions?: {       // 拡張フィールド（Better Stack、Sentry用）
    requestId?: string;
    traceId?: string;
    userId?: string;
    sentryEventId?: string; // SentryのイベントID（フロントとバックのエラーを紐付ける）
    [key: string]: unknown;
  };
};
```

### 実装例

```typescript
// ✅ 良い例: RFC 9457準拠のエラー
import { ConvexError } from "convex/values";

throw new ConvexError({
  type: "https://api.pet-app.com/errors/premium-required",
  title: "Premium Required",
  status: 403,
  detail: "この機能はプレミアム会員限定です。",
  instance: "/pets",
  extensions: {
    requestId: ctx.requestId,
    userId: user._id,
    sentryEventId: "<sentry-event-id>", // SentryのイベントIDを含める
  },
});

// ❌ 悪い例: 単純な文字列エラー
throw new Error("プレミアムが必要です");
```

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

## ドキュメント参照（開発の憲法）

機能実装時は、以下のドキュメントを**必ず参照**してください：

### インデックスファイル（推奨） ✅ **2026年追加 - 分割版**
- **[USER_STORIES_INDEX.md](../../USER_STORIES_INDEX.md)**: モバイルアプリのユーザーストーリー（インデックス）
- **[CONVEX_SCHEMA_INDEX.md](../../CONVEX_SCHEMA_INDEX.md)**: Convexスキーマ定義（インデックス）
- **[DESIGN_DOCUMENT_INDEX.md](../../DESIGN_DOCUMENT_INDEX.md)**: アプリ設計の詳細（インデックス）
- **[ADMIN_USER_STORIES_INDEX.md](../../ADMIN_USER_STORIES_INDEX.md)**: 管理画面のユーザーストーリー（インデックス）
- **[WEB_USER_STORIES_INDEX.md](../../WEB_USER_STORIES_INDEX.md)**: 公式サイトのユーザーストーリー（インデックス）

### 統合版ファイル（全体像の把握用）
- **[USER_STORIES.md](../../USER_STORIES.md)**: モバイルアプリの機能（統合版）
- **[CONVEX_SCHEMA.md](../../CONVEX_SCHEMA.md)**: Convexスキーマ定義（統合版）
- **[DESIGN_DOCUMENT.md](../../DESIGN_DOCUMENT.md)**: アプリ設計の詳細（統合版）
- **[ADMIN_USER_STORIES.md](../../ADMIN_USER_STORIES.md)**: 管理画面の機能（統合版）
- **[WEB_USER_STORIES.md](../../WEB_USER_STORIES.md)**: 公式サイトの機能（統合版）

### マスタードキュメント
- **[DOCUMENTATION_INDEX.md](../../DOCUMENTATION_INDEX.md)**: すべてのドキュメントへのアクセス ⭐ **まずここから**

**重要**: 機能実装時は、必ず対応するユーザーストーリーを参照し、ユーザーの体験価値を重視した実装を行ってください。

## 重要な注意事項（憲法の原則）

### 技術的制約（絶対に守るべきルール）
- **関数型プログラミング**: 必須。副作用を最小限にし、純粋関数を優先
- **変数名**: 短縮せず、読みやすい形式（例: `userName`、`petId`）
- **モノレポ**: 共有パッケージを活用し、重複コードを避ける
- **型安全性**: TypeScriptの型を最大限活用し、`any`は絶対禁止
- **Zodバリデーション**: 外部API、フォーム入力、環境変数で必須
- **Convex制約**: Actionからのみ外部APIを呼び出す（Query/Mutationからは禁止）

### 開発の優先順位（意思決定の指針）
1. **プライバシーとセキュリティ**: ペットの機微情報（健康ログ）の保護を最優先
2. **パフォーマンス**: 動画・画像の高速表示（Cloudflare R2のCDN活用）
3. **コスト効率**: ストレージ節約と無料枠の維持（Convexのプライシングを考慮）
4. **型安全性**: ランタイムエラーを防ぐため、型チェックとバリデーションを徹底

### 開発フローの原則
- **MCP活用**: Convexのようなモダンなツールは進化が早いため、AIが「最新のドキュメント」と「あなたのローカルコード」を同時に見られる状態（MCP環境）を作ることが最強の開発効率を実現する鍵
- **ユーザーストーリー重視**: 機能実装時は、必ず対応するユーザーストーリーを参照し、ユーザーの体験価値を重視した実装を行う
- **ドキュメント参照**: 詳細な情報が必要な場合は、**[DOCUMENTATION_INDEX.md](../../DOCUMENTATION_INDEX.md)** から適切なドキュメントを参照してください
- **推測でコードを書かない**: 不明点は必ず質問し、既存のパターンを確認してから実装する

### 公式サイト開発の特別ルール ✅ **2026年追加**
- 公式サイト（`apps/www/`）を開発する際は、ブランド戦略・UI/UXガイドライン（WEB-015〜WEB-017）を重視し、SEO・LLM最適化を実現
- 法務ドキュメントは`@repo/policy`からMarkdown形式で読み込む

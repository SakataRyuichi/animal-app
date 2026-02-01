# 技術選定プランニング

## プロジェクト概要
- **プラットフォーム**: iOS / Android
- **フロントエンド**: React Native Expo
- **開発規模**: 個人開発
- **要件**: コスト最小限、ハンドリングしやすい環境
- **プロジェクト構成**: モノレポ ✅ **必須**

---

## 0. モノレポ構成 ✅ **必須**

### モノレポツール選定

#### Option A: Turborepo ✅ **推奨**
- **特徴**:
  - Vercelが開発・メンテナンス
  - 高速なビルドキャッシュ
  - タスクの並列実行
  - インクリメンタルビルド
  - TypeScript/JavaScriptプロジェクトに最適
  - React Native/Expoとの統合が良好
- **コスト**: 無料（オープンソース）
- **メリット**:
  - ✅ ビルド速度が非常に速い（キャッシュ機能）
  - ✅ 設定がシンプル
  - ✅ 2026年現在のデファクトスタンダード
  - ✅ Expoプロジェクトとの統合が簡単
  - ✅ タスクの依存関係を自動解決
- **デメリット**:
  - ❌ 学習コスト（中程度）

#### Option B: Nx
- **特徴**:
  - 大規模プロジェクト向け
  - 豊富なプラグイン
  - コード生成機能
  - 依存関係グラフの可視化
- **コスト**: 無料（オープンソース）
- **メリット**:
  - ✅ 非常に強力な機能
  - ✅ 大規模プロジェクトに適している
- **デメリット**:
  - ❌ 設定が複雑
  - ❌ 個人開発には過剰な場合がある

#### Option C: pnpm Workspaces
- **特徴**:
  - パッケージマネージャー内蔵機能
  - シンプルな設定
  - 高速なインストール
- **コスト**: 無料
- **メリット**:
  - ✅ 追加ツール不要
  - ✅ シンプル
- **デメリット**:
  - ❌ ビルドキャッシュ機能が弱い
  - ❌ タスク管理機能がない

**推奨**: ✅ **Turborepo**
- 個人開発からスケールまで対応可能
- Expoプロジェクトとの統合が良好
- ビルド速度が速く、開発体験が良い

### モノレポ構成例（2026年版ベストプラクティス）

```
my-pet-platform/
├── apps/
│   ├── expo/                # React Native Expo アプリ
│   │   ├── app/             # Expo Router (画面定義)
│   │   ├── components/      # アプリ専用UI
│   │   └── package.json
│   └── admin/               # 管理画面（Next.js、ローカルのみ）✅ **選定済み**
│       ├── app/             # App Router
│       ├── components/      # 管理画面専用UI
│       └── package.json
├── packages/
│   ├── backend/             # バックエンド (Convex) - 独立パッケージ ✅ **最重要**
│   │   ├── convex/          # スキーマ、関数、AIアクション
│   │   └── package.json
│   ├── ui/                  # 共通UIコンポーネント (Tamagui)
│   │   ├── src/
│   │   └── package.json
│   ├── utils/               # 共通ロジック (ビジネスロジック)
│   │   ├── src/
│   │   └── package.json
│   ├── tsconfig/            # TypeScript共通設定
│   │   └── package.json
│   └── config/              # 共有設定（ESLint, Prettier等）
│       ├── eslint-config/
│       └── package.json
├── turbo.json               # Turborepo設定
├── package.json             # ルートpackage.json
├── pnpm-workspace.yaml      # pnpm workspace設定
└── README.md
```

**重要な4つのポイント**:

1. **`packages/backend` を独立させる** ✅ **最重要**
   - `apps/expo`と`apps/admin`の両方から、全く同じバックエンド関数（`api.pets.get`など）を**型安全に**呼び出すため
   - Convexは通常アプリ内に同居させますが、モノレポでは独立したパッケージにします

2. **`packages/ui` でスタイルを共通化**
   - Tamaguiを使えば、1つのコンポーネントを`apps/expo`（ネイティブ）と`apps/admin`（Web）の両方で最適にレンダリングできます

3. **`packages/utils` にビジネスロジックを集約**
   - 「ペットの生年月日から現在の年齢を算出する」「体重の増減からアラートを出す」といったロジックをここに書きます
   - モバイルアプリと管理画面で計算結果がズレるという、アプリ開発でよくある事故を防げます

4. **`turbo.json` による爆速開発**
   - バックエンドの型が変わったら、それに依存しているアプリも自動で再ビルドする依存関係をTurborepoが管理します

### モノレポのメリット

1. **コードの共有**
   - UIコンポーネント（Tamagui）を`packages/ui`で共有
   - ユーティリティ関数を`packages/utils`で共有（ビジネスロジックの集約）
   - Convexバックエンドを`packages/backend`で共有（型安全なAPI呼び出し）
   - TypeScript型定義を共有

2. **一貫性の維持**
   - ESLint/Prettier設定を共有
   - TypeScript設定を統一（`packages/tsconfig`）
   - 開発ルールを一元管理

3. **開発効率の向上**
   - 変更が関連パッケージに自動反映（Turborepoの依存関係管理）
   - 型安全性の向上（Convexの型定義が自動生成）
   - テストの一元管理

4. **将来の拡張性**
   - Webアプリの追加が容易
   - 管理画面の追加が容易
   - マイクロサービスへの移行が容易

5. **バックエンドの独立性** ✅ **新規追加**
   - `packages/backend`を独立パッケージにすることで、`apps/expo`と`apps/admin`の両方から同じConvex関数を型安全に呼び出せる
   - バックエンドの変更が両方のアプリに自動反映される

### Turborepo設定例

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"]
    }
  }
}
```

### 開発環境の立ち上げ ✅ **Turborepoに任せる**

開発環境の立ち上げはTurborepoが一元管理します。モノレポ内のすべてのパッケージを同時に起動できます。

#### 基本的な使い方

**すべてのパッケージを起動**:
```bash
# ルートディレクトリで実行
pnpm turbo dev

# または
pnpm dev
```

**特定のパッケージのみ起動**:
```bash
# mobileアプリのみ起動
pnpm turbo dev --filter=mobile

# 複数のパッケージを指定
pnpm turbo dev --filter=mobile --filter=ui
```

**依存関係を考慮して起動**:
```bash
# mobileアプリとその依存パッケージ（ui, utils等）を自動的に起動
pnpm turbo dev --filter=expo...
```

#### 各パッケージのdevスクリプト設定例

**apps/expo/package.json**:
```json
{
  "name": "@repo/expo",
  "scripts": {
    "dev": "expo start",
    "build": "expo prebuild",
    "lint": "eslint ."
  }
}
```

**packages/ui/package.json**:
```json
{
  "name": "@repo/ui",
  "scripts": {
    "dev": "tsc --watch",
    "build": "tsc",
    "lint": "eslint ."
  }
}
```

**packages/backend/package.json**:
```json
{
  "name": "@repo/backend",
  "scripts": {
    "dev": "convex dev",
    "build": "convex deploy",
    "lint": "eslint ."
  }
}
```

**重要**: `packages/backend`は独立パッケージとして、`apps/expo`と`apps/admin`の両方から型安全にConvex関数を呼び出せます。

#### 開発環境の起動フロー

1. **ルートで`pnpm turbo dev`を実行**
   ```bash
   pnpm turbo dev
   ```

2. **Turborepoが以下を実行**:
   - 依存関係を解析
   - 依存パッケージから順に起動
   - すべてのパッケージを並列で起動
   - ログを統合して表示

3. **起動されるサービス**:
   - `apps/expo`: Expo開発サーバー
   - `packages/backend`: Convex開発サーバー
   - `packages/ui`: TypeScriptのwatchモード（型チェック）

#### メリット

- ✅ **一元管理**: 1つのコマンドで全体を起動
- ✅ **依存関係の自動解決**: 必要なパッケージを自動的に起動
- ✅ **並列実行**: 複数のパッケージを同時に起動
- ✅ **統合ログ**: すべてのログを1つのターミナルで確認
- ✅ **高速**: キャッシュと並列処理で高速

#### 開発ワークフロー例

```bash
# 1. プロジェクトのクローン後、依存関係をインストール
pnpm install

# 2. 開発環境を起動（すべてのパッケージが自動的に起動）
pnpm turbo dev

# 3. ブラウザ/エミュレータでアプリを確認
# - Expo開発サーバーが自動的に起動
# - Convex開発サーバーが自動的に起動
# - 共有パッケージの変更が自動的に反映
```

#### トラブルシューティング

**特定のパッケージだけ再起動したい場合**:
```bash
# プロセスを停止して再起動
pnpm turbo dev --filter=mobile
```

**キャッシュをクリアして起動**:
```bash
pnpm turbo dev --force
```

**起動順序を制御したい場合**:
```json
// turbo.json
{
  "pipeline": {
    "dev": {
      "dependsOn": ["^dev"],  // 依存パッケージのdevが完了してから起動
      "cache": false,
      "persistent": true
    }
  }
}
```

### パッケージマネージャー ✅ **選定済み**

#### pnpm

- **特徴**:
  - 高速なインストール（並列処理）
  - ディスク容量の節約（ハードリンク）
  - 厳密な依存関係管理
  - Workspace機能（モノレポ対応）
  - node_modulesの効率的な管理
  - npm互換性
- **メリット**:
  - ✅ モノレポとの相性が抜群
  - ✅ ディスク容量を大幅に節約（ハードリンク）
  - ✅ インストール速度が速い
  - ✅ 依存関係の重複を防ぐ
  - ✅ Workspace機能が強力
  - ✅ npm/yarnと互換性がある
- **デメリット**:
  - ❌ 一部のツールでpnpm非対応の場合がある（稀）

**モノレポでの使用例**:
```bash
# ワークスペースの設定
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'

# 依存関係のインストール
pnpm install

# ワークスペース内のパッケージを追加
pnpm add @repo/ui --filter expo

# すべてのパッケージでコマンド実行
pnpm --filter "*" build
```

**推奨**: ✅ **pnpm**
- モノレポプロジェクトに最適
- Turborepoとの統合が良好
- ディスク容量とインストール時間を大幅に削減

---

## 1. フロントエンド技術スタック

### 1.1 React Native Expo
✅ **選定済み**
- **理由**: 
  - iOS/Androidの両方に対応可能
  - ネイティブビルドが簡単
  - 豊富なExpo SDKライブラリ
  - 開発環境のセットアップが容易

### 1.2 UIライブラリ候補

#### Option A: NativeBase (推奨)
- **特徴**: 
  - Expoとの統合が良好
  - コンポーネントが豊富
  - カスタマイズ性が高い
  - TypeScript対応
- **コスト**: 無料（オープンソース）
- **学習コスト**: 中

#### Option B: React Native Paper
- **特徴**:
  - Material Design準拠
  - Expoとの相性が良い
  - 軽量
  - TypeScript対応
- **コスト**: 無料（オープンソース）
- **学習コスト**: 低

#### Option C: Tamagui ✅ **選定済み**
- **特徴**:
  - 高性能（最適化されたレンダリング）
  - Expoとの統合が良好
  - モダンなAPI
  - コンパイル時最適化（CSS-in-JSの最適化）
  - クロスプラットフォーム対応（Web/iOS/Android）
- **コスト**: 無料（オープンソース）
- **学習コスト**: 中〜高
- **メリット**:
  - パフォーマンスが非常に高い
  - 型安全性が高い（TypeScript）
  - 豊富なコンポーネント
  - テーマシステムが強力

### 1.3 状態管理（2026年版：役割分担）

#### 状態管理の役割分担

これまでは「ユーザー情報」「投稿一覧」などをすべてグローバルなState（Redux等）に入れていましたが、Convexを使う場合は以下のように役割を切り分けます。

##### ① サーバー状態（データの同期）→ Convexにお任せ

**管理するもの**:
- ユーザーのプロフィール
- ペットの記録
- SNSのフィード投稿
- その他、サーバーと同期が必要なデータ

**やり方**: `useQuery` を使うだけ

**理由**: 
- Convex自体が「巨大な共有ステート」のように振る舞います
- ある画面でデータを更新すれば、他の画面も自動で再レンダリングされる
- 自分でグローバルなStateに保存し直す必要がありません
- リアルタイム同期が自動で行われる

**実装例**:
```typescript
// Convexのクエリを使用
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

function FeedScreen() {
  // サーバー状態はConvexが管理
  const posts = useQuery(api.posts.list);
  const userProfile = useQuery(api.users.getCurrent);
  
  // データが更新されると自動で再レンダリング
  return <PostList posts={posts} />;
}
```

##### ② クライアント状態（UIの制御）→ Zustand ✅

**管理するもの**:
- 現在のタブ選択状態
- 一時的な検索フィルタ
- ダークモードの設定
- ログイン中のユーザーID（認証トークン等）
- モーダルの開閉状態
- フォームの一時的な入力状態

**やり方**: Zustand を使用

**理由**: 
- Reduxよりも圧倒的に軽量
- Convexとの相性が良い
- 2026年現在のReact Native開発ではデファクトスタンダード
- TypeScriptとの相性が抜群
- 学習コストが低い

**実装例**:
```typescript
// Zustandストアの定義
import create from 'zustand';

interface UIStore {
  currentTab: 'home' | 'profile' | 'settings';
  searchFilter: string;
  isDarkMode: boolean;
  setCurrentTab: (tab: 'home' | 'profile' | 'settings') => void;
  setSearchFilter: (filter: string) => void;
  toggleDarkMode: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  currentTab: 'home',
  searchFilter: '',
  isDarkMode: false,
  setCurrentTab: (tab) => set({ currentTab: tab }),
  setSearchFilter: (filter) => set({ searchFilter: filter }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));

// 使用例
function TabNavigation() {
  const { currentTab, setCurrentTab } = useUIStore();
  // UI状態はZustandで管理
  return <Tabs value={currentTab} onValueChange={setCurrentTab} />;
}
```

##### 状態管理の使い分けまとめ

| 状態の種類 | 管理方法 | 使用例 |
|-----------|---------|--------|
| **サーバー状態** | Convex (`useQuery`) | ユーザープロフィール、投稿一覧、ペット記録 |
| **クライアント状態** | Zustand | タブ選択、検索フィルタ、ダークモード設定 |

**推奨**: ✅ **Zustand（クライアント状態用）**
- Convexと組み合わせることで、状態管理が大幅に簡素化される
- サーバー状態はConvexが自動管理、クライアント状態のみZustandで管理

### 1.4 ナビゲーション
- **推奨**: React Navigation (Expo Router)
- **理由**: 
  - Expo公式推奨
  - ファイルベースルーティング（Expo Router）
  - 豊富なドキュメント

### 1.5 コード品質・フォーマット ✅ **フロント・バックエンド共通**

#### ESLint + Prettier

**概要**: フロントエンドとバックエンドの両方でESLintとPrettierを活用し、コード品質とフォーマットを統一

##### ESLint
- **特徴**:
  - コードの品質チェック
  - バグの早期発見
  - コーディング規約の強制
  - TypeScript対応
  - React Native/Expo対応
  - Convex関数対応
- **推奨設定**:
  - `@typescript-eslint/eslint-plugin`: TypeScript用ルール
  - `eslint-plugin-react`: React用ルール
  - `eslint-plugin-react-native`: React Native用ルール
  - `eslint-plugin-react-hooks`: React Hooks用ルール
  - `eslint-config-expo`: Expo用設定

##### Prettier
- **特徴**:
  - コードフォーマットの自動化
  - 一貫したコードスタイル
  - ESLintとの統合（`eslint-config-prettier`）
  - 自動フォーマット（保存時）
- **推奨設定**:
  - シングルクォート
  - セミコロンなし
  - 2スペースインデント
  - トレーリングカンマ

##### モノレポでの共有設定

**構成**:
```
packages/
└── config/
    ├── eslint-config/
    │   ├── base.js          # 基本設定
    │   ├── react-native.js  # React Native用設定
    │   ├── convex.js        # Convex関数用設定
    │   └── package.json
    └── prettier-config/
        ├── index.js         # Prettier設定
        └── package.json
```

**packages/config/eslint-config/base.js**:
```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier', // Prettierと競合するルールを無効化
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};
```

**packages/config/eslint-config/react-native.js**:
```javascript
module.exports = {
  extends: ['./base.js', 'expo', 'prettier'],
  plugins: ['react', 'react-native', 'react-hooks'],
  rules: {
    'react/react-in-jsx-scope': 'off', // React 17以降は不要
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
```

**packages/config/eslint-config/convex.js**:
```javascript
module.exports = {
  extends: ['./base.js', 'prettier'],
  rules: {
    // Convex関数用のルール
    'no-console': 'off', // Convexではconsole.logが使える
  },
};
```

**packages/config/prettier-config/index.js**:
```javascript
module.exports = {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 80,
  arrowParens: 'avoid',
};
```

##### 各パッケージでの使用例

**apps/expo/.eslintrc.js**:
```javascript
module.exports = {
  extends: ['@repo/eslint-config/react-native'],
};
```

**packages/backend/.eslintrc.js**:
```javascript
module.exports = {
  extends: ['@repo/eslint-config/convex'],
};
```

**各パッケージのpackage.json**:
```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,json,md}\""
  },
  "devDependencies": {
    "@repo/eslint-config": "workspace:*",
    "@repo/prettier-config": "workspace:*",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

##### Turborepoでの統合

**turbo.json**:
```json
{
  "pipeline": {
    "lint": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "format": {
      "cache": false,
      "outputs": []
    }
  }
}
```

**ルートpackage.json**:
```json
{
  "scripts": {
    "lint": "turbo run lint",
    "lint:fix": "turbo run lint:fix",
    "format": "turbo run format",
    "format:check": "turbo run format:check"
  }
}
```

##### エディタ設定（VSCode）

**.vscode/settings.json**:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "eslint.workingDirectories": [
    "apps/expo",
    "apps/admin",
    "packages/backend",
    "packages/ui",
    "packages/utils"
  ]
}
```

##### CI/CDでの活用

**GitHub Actions例**:
```yaml
name: Lint and Format Check
on: [pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm format:check
```

##### メリット

- ✅ **コード品質の統一**: フロント・バックエンドで同じルール
- ✅ **自動フォーマット**: 保存時に自動でフォーマット
- ✅ **共有設定**: モノレポで設定を一元管理
- ✅ **CI/CD統合**: プルリクエスト時に自動チェック
- ✅ **開発効率向上**: フォーマットの議論が不要

**推奨**: ✅ **ESLint + Prettier**
- フロントエンドとバックエンドの両方で活用
- モノレポで共有設定を一元管理
- コード品質とフォーマットを統一

### 1.6 その他フロントエンドライブラリ
- **HTTP クライアント**: Axios または Fetch API
- **フォーム管理**: React Hook Form
- **日付処理**: date-fns
- **アニメーション**: React Native Reanimated (Expo SDK)

---

## 2. バックエンド技術選定

### Option A: Supabase (推奨)
- **特徴**:
  - PostgreSQLデータベース（無料枠: 500MB）
  - リアルタイム機能
  - 認証機能（Email, OAuth等）
  - ストレージ（無料枠: 1GB）
  - REST API自動生成
  - GraphQL対応
- **コスト**: 
  - 無料枠: 十分な機能
  - 有料: $25/月〜
- **メリット**:
  - バックエンド開発が最小限で済む
  - 認証・データベース・ストレージが統合
  - 個人開発に最適
- **デメリット**:
  - ベンダーロックインの可能性

### Option B: Firebase
- **特徴**:
  - NoSQLデータベース（Firestore）
  - 認証機能
  - ストレージ
  - リアルタイム機能
  - 無料枠が充実
- **コスト**:
  - 無料枠: Sparkプラン（制限あり）
  - 有料: 従量課金
- **メリット**:
  - 非常に充実した無料枠
  - 豊富なドキュメント
  - スケーラビリティが高い
- **デメリット**:
  - NoSQLのため複雑なクエリが難しい場合がある

### Option C: AWS Amplify
- **特徴**:
  - フルマネージドサービス
  - GraphQL API自動生成
  - 認証機能
  - ストレージ
- **コスト**:
  - 無料枠: 12ヶ月間
  - その後: 従量課金
- **メリット**:
  - AWSエコシステムとの統合
  - スケーラビリティが高い
- **デメリット**:
  - 学習コストが高い
  - 設定が複雑

### Option D: Convex ✅ **推奨（状態管理との統合が優秀）**

- **特徴**:
  - リアルタイムデータベース（自動同期）
  - サーバーレス関数（TypeScript）
  - 自動API生成
  - リアルタイム更新が自動
  - 状態管理と統合された設計
- **コスト**: 
  - 無料枠: 1M関数呼び出し/月、5GBストレージ
  - 有料: $25/月〜
- **メリット**:
  - ✅ サーバー状態の管理が不要（Convexが自動管理）
  - ✅ `useQuery`でリアルタイム同期が自動
  - ✅ 状態管理の役割分担が明確（サーバー状態→Convex、クライアント状態→Zustand）
  - ✅ TypeScriptフルサポート
  - ✅ バックエンドコードが不要（関数のみ）
  - ✅ リアルタイム更新が自動で動作
- **デメリット**:
  - ❌ ベンダーロックインの可能性
  - ❌ 学習コスト（新しいパラダイム）

### Option E: 自前バックエンド（Node.js + Express）
- **特徴**:
  - 完全なコントロール
  - 柔軟性が高い
- **コスト**:
  - サーバー費用（VPS等）
- **メリット**:
  - カスタマイズ性が高い
- **デメリット**:
  - 開発・運用コストが高い
  - 個人開発には負担が大きい

**推奨**: **Convex** または **Supabase**

**Convexが適している場合**:
- ✅ リアルタイム同期が重要なアプリ
- ✅ 状態管理を簡素化したい
- ✅ サーバー状態の管理をConvexに任せたい
- ✅ モダンな開発体験を重視

**Supabaseが適している場合**:
- ✅ PostgreSQLの柔軟性が必要
- ✅ SQLを直接使いたい
- ✅ より伝統的なREST APIが欲しい
- ✅ 認証・ストレージが統合された環境が欲しい

---

## 3. インフラ・デプロイメント

### 3.1 モバイルアプリビルド・配信

#### EAS Build (Expo Application Services) とは？

**EAS Build**は、Expoが提供するクラウドベースのビルドサービスです。React Native ExpoアプリをiOS/Androidのネイティブアプリ（.ipa/.aab）にビルドするためのサービスです。

##### 主な機能
1. **クラウドビルド**
   - MacやWindowsからでもiOSアプリをビルド可能（通常はMacが必要）
   - クラウド上でビルドが実行されるため、ローカル環境の負荷が少ない
   - ビルドキューで管理され、複数のビルドを並行処理可能

2. **OTA（Over-The-Air）アップデート**
   - アプリストアの審査なしでJavaScriptバンドルを更新可能
   - バグ修正や機能追加を迅速に配信
   - Expo Updates SDKを使用

3. **配信管理**
   - App Store Connect / Google Play Consoleへの直接アップロード
   - 内部テストトラックへの配信
   - ビルド履歴の管理

4. **ビルド設定の柔軟性**
   - `eas.json`でビルド設定を管理
   - 開発/ステージング/本番環境ごとの設定
   - カスタムネイティブコードの対応

##### コスト
- **無料プラン（Hobby）**:
  - 月30ビルドまで
  - ビルド時間: 最大45分/ビルド
  - ストレージ: 10GB
  - OTA更新: 無制限
- **有料プラン（Production）**: $29/月
  - 無制限ビルド
  - 優先ビルドキュー
  - より長いビルド時間

##### メリット
- ✅ MacがなくてもiOSアプリをビルド可能
- ✅ 設定が簡単（`eas build`コマンド1つ）
- ✅ Expoとの統合が完璧
- ✅ OTA更新で迅速な修正配信
- ✅ 個人開発では無料枠で十分

##### デメリット
- ❌ 無料枠は月30ビルドまで（個人開発には十分）
- ❌ ビルド時間が長い場合がある（キュー待ち）
- ❌ カスタムネイティブコードが多い場合、設定が複雑になる可能性

---

#### EAS Buildの代替案

##### Option A: ローカルビルド（推奨代替案）

**概要**: 自分のマシンで直接ビルドする方法

**iOSビルド**:
```bash
# Expo Go経由での開発
npx expo start

# ローカルでiOSビルド（Mac必須）
eas build --local --platform ios
# または
npx expo run:ios
```

**Androidビルド**:
```bash
# ローカルでAndroidビルド（Mac/Windows/Linux可）
eas build --local --platform android
# または
npx expo run:android
```

**メリット**:
- ✅ 完全無料
- ✅ ビルド数の制限なし
- ✅ ビルド速度が速い（ネットワーク不要）
- ✅ 完全なコントロール

**デメリット**:
- ❌ iOSビルドにはMacが必要
- ❌ ローカル環境のセットアップが必要（Xcode, Android Studio等）
- ❌ マシンのリソースを消費
- ❌ 設定が複雑（証明書、プロビジョニングプロファイル等）

**コスト**: $0/月（ただしMacが必要な場合はMacのコスト）

---

##### Option B: GitHub Actions

**概要**: CI/CDパイプラインで自動ビルド

**設定例**:
```yaml
# .github/workflows/build.yml
name: Build App
on:
  push:
    branches: [main]
  workflow_dispatch:  # 手動実行も可能

jobs:
  build-ios:
    runs-on: macos-latest  # macOSランナーが必要
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - name: Install dependencies
        run: npm install
      - name: Build iOS
        run: eas build --platform ios --non-interactive
        env:
          APPLE_ID: ${{ secrets.APPLE_ID }}
          APPLE_APP_SPECIFIC_PASSWORD: ${{ secrets.APPLE_APP_SPECIFIC_PASSWORD }}
```

**メリット**:
- ✅ 完全自動化可能（Git pushで自動ビルド）
- ✅ GitHub Actionsの無料枠（公開リポジトリ）
- ✅ ビルド履歴がGitHubで管理される
- ✅ プルリクエストごとの自動ビルドが可能
- ✅ 他のCI/CDツールと統合しやすい
- ✅ カスタマイズ性が高い

**デメリット**:
- ❌ iOSビルドにはmacOSランナーが必要
  - 公開リポジトリ: 無料（2,000分/月）
  - プライベートリポジトリ: macOSランナーは$0.08/分（約$115/月の無料枠あり）
- ❌ 設定が複雑（証明書、キー管理、環境変数等）
- ❌ セキュリティキー（Secrets）の管理が必要
- ❌ EAS Buildを使用する場合でも、EASの認証トークンが必要
- ❌ ビルド時間が長い（macOSランナーの起動時間含む）

**コスト**: 
- **公開リポジトリ**: 無料（2,000分/月）
- **プライベートリポジトリ**: 
  - 無料枠: 2,000分/月（macOSランナーは$0.08/分）
  - 実質: 約25分/月まで無料（macOSランナーの場合）
  - 超過分: $0.08/分

**実際のビルド時間目安**:
- iOSビルド: 約15-30分/回
- Androidビルド: 約10-20分/回
- 無料枠で可能なビルド数: 約1-2回/月（iOS、プライベートリポジトリの場合）

---

#### EAS Build vs GitHub Actions 詳細比較

##### 1. ビルド実行方法

**EAS Build**:
```bash
# コマンド1つでビルド開始
eas build --platform ios
eas build --platform android

# または設定ファイルで自動化
eas build --platform all --auto-submit
```

**GitHub Actions**:
```yaml
# .github/workflows/build.yml を作成
# Git pushで自動実行
# または手動実行（workflow_dispatch）
```

**比較**:
- **EAS Build**: コマンド実行が簡単、即座にビルド開始
- **GitHub Actions**: Git pushで自動実行、設定が必要

---

##### 2. 設定の複雑さ

**EAS Build**:
```json
// eas.json（シンプル）
{
  "build": {
    "production": {
      "ios": {
        "buildConfiguration": "Release"
      }
    }
  }
}
```

**GitHub Actions**:
```yaml
# .github/workflows/build.yml（複雑）
name: Build
on: [push]
jobs:
  build:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - uses: expo/expo-github-action@v8
      - run: npm install
      - run: eas build --platform ios
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
          APPLE_ID: ${{ secrets.APPLE_ID }}
          # ... その他の環境変数
```

**比較**:
- **EAS Build**: 設定がシンプル、`eas.json`のみ
- **GitHub Actions**: ワークフローファイル、Secrets管理、環境変数の設定が必要

---

##### 3. コスト比較（個人開発・プライベートリポジトリ）

| 項目 | EAS Build | GitHub Actions |
|------|-----------|----------------|
| **無料枠** | 30ビルド/月 | 2,000分/月（macOSは$0.08/分） |
| **iOSビルド時間** | 約20-30分/回 | 約15-30分/回 + ランナー起動時間 |
| **実質無料枠** | 30回/月 | 約1-2回/月（macOSランナー使用時） |
| **Androidビルド** | 30回/月 | 約100-200回/月（Linuxランナー） |
| **有料プラン** | $29/月（無制限） | $0.08/分（macOS） |

**コスト計算例（月10回ビルド）**:
- **EAS Build**: $0（無料枠内）
- **GitHub Actions**: 
  - iOS: 10回 × 25分 × $0.08 = $20
  - Android: 10回 × 15分 × $0 = $0
  - **合計**: $20/月

---

##### 4. 機能比較

| 機能 | EAS Build | GitHub Actions |
|------|-----------|----------------|
| **クラウドビルド** | ✅ 専用サービス | ✅ CI/CDプラットフォーム |
| **OTA更新** | ✅ 統合機能 | ❌ 別途設定が必要 |
| **App Store配信** | ✅ 統合機能 | ⚠️ 別途設定が必要 |
| **ビルド履歴** | ✅ EAS Dashboard | ✅ GitHub Actions |
| **自動化** | ⚠️ コマンド実行 | ✅ Git pushで自動実行 |
| **プルリクエストビルド** | ⚠️ 別途設定 | ✅ 簡単に設定可能 |
| **テスト実行** | ⚠️ 別途設定 | ✅ 統合可能 |
| **通知** | ✅ Email/Slack | ✅ GitHub通知/Email/Slack |

---

##### 5. セキュリティ・認証情報管理

**EAS Build**:
- Expoアカウントで認証
- 証明書・キーはEASが自動管理
- Apple Developer認証情報を一度設定すれば自動管理

**GitHub Actions**:
- GitHub Secretsで管理
- 証明書・キーを手動でSecretsに登録
- Apple Developer認証情報を手動設定
- より細かい制御が可能だが管理が複雑

**比較**:
- **EAS Build**: 認証情報の管理が自動化されている
- **GitHub Actions**: より細かい制御が可能だが、手動管理が必要

---

##### 6. ビルド速度

**EAS Build**:
- ビルドキュー待ち: 0-5分（無料プラン）
- ビルド実行: 20-30分
- **合計**: 約20-35分

**GitHub Actions**:
- ランナー起動: 1-3分
- 依存関係インストール: 2-5分
- ビルド実行: 15-30分
- **合計**: 約18-38分

**比較**: ほぼ同等（GitHub Actionsはランナー起動時間が追加）

---

##### 7. デバッグ・トラブルシューティング

**EAS Build**:
- EAS Dashboardでビルドログを確認
- ビルドエラーの詳細な情報
- Expoサポートに問い合わせ可能

**GitHub Actions**:
- GitHub Actionsのログで確認
- より詳細なログが取得可能
- カスタムスクリプトでデバッグ可能

**比較**:
- **EAS Build**: Expo特化のサポート
- **GitHub Actions**: より柔軟なデバッグが可能

---

##### 8. 統合・拡張性

**EAS Build**:
- Expoエコシステムに最適化
- OTA更新と統合
- 他のサービスとの統合は限定的

**GitHub Actions**:
- GitHubエコシステムと統合
- 他のCI/CDツールと連携可能
- カスタムワークフローが作成可能
- テスト、デプロイ、通知など幅広い統合

**比較**:
- **EAS Build**: Expo特化、シンプル
- **GitHub Actions**: より柔軟で拡張性が高い

---

#### 使い分けの推奨

##### EAS Buildが適している場合
- ✅ 個人開発でシンプルにビルドしたい
- ✅ Macを持っていない（iOSビルドが必要）
- ✅ OTA更新を活用したい
- ✅ 設定を最小限にしたい
- ✅ 月30回以下のビルドで十分

##### GitHub Actionsが適している場合
- ✅ プルリクエストごとに自動ビルドしたい
- ✅ テストとビルドを統合したい
- ✅ 他のCI/CDツールと連携したい
- ✅ より細かい制御が必要
- ✅ 公開リポジトリで開発している
- ✅ Androidのみのビルド（Linuxランナーで無料）

##### ハイブリッドアプローチ（推奨）
- **開発・テスト**: GitHub Actions（プルリクエストごとのビルド）
- **本番ビルド**: EAS Build（App Store配信、OTA更新）

**設定例**:
```yaml
# GitHub Actions: プルリクエスト時のテストビルド
on:
  pull_request:
    branches: [main]
jobs:
  test-build:
    runs-on: ubuntu-latest  # Androidのみ（無料）
    steps:
      - run: eas build --platform android --profile preview
```

```bash
# EAS Build: 本番リリース時
eas build --platform all --profile production --auto-submit
```

---

##### Option C: Codemagic

**概要**: モバイルアプリ専用のCI/CDサービス

**特徴**:
- iOS/Androidのビルドに特化
- 無料枠あり（500分/月）
- ビルド設定が簡単
- App Store/Play Storeへの自動配信

**メリット**:
- ✅ モバイルアプリに特化
- ✅ 無料枠が充実
- ✅ UIが分かりやすい
- ✅ 自動配信機能

**デメリット**:
- ❌ EAS BuildほどExpoとの統合が深くない
- ❌ 無料枠は500分/月まで

**コスト**: 
- 無料: 500分/月
- 有料: $75/月〜

---

##### Option D: Bitrise

**概要**: モバイルアプリ専用のCI/CDサービス

**特徴**:
- 無料枠あり（200分/月）
- 豊富なワークフロー
- 自動テスト実行

**メリット**:
- ✅ 無料枠あり
- ✅ 豊富な機能

**デメリット**:
- ❌ 設定が複雑
- ❌ 無料枠は200分/月と少なめ

**コスト**: 
- 無料: 200分/月
- 有料: $36/月〜

---

##### Option E: Appcircle

**概要**: モバイルアプリ専用のCI/CDサービス

**特徴**:
- 無料枠あり（500分/月）
- シンプルなUI
- 自動配信機能

**メリット**:
- ✅ 無料枠が充実
- ✅ シンプル

**デメリット**:
- ❌ 知名度が低い
- ❌ コミュニティが小さい

**コスト**: 
- 無料: 500分/月
- 有料: $39/月〜

---

#### ビルド方法の比較表

| 方法 | コスト | iOSビルド | Androidビルド | 設定の簡単さ | 自動化 | 推奨度 |
|------|--------|-----------|---------------|--------------|--------|--------|
| **EAS Build** | 無料（30ビルド/月） | ✅ Mac不要 | ✅ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **ローカルビルド** | 無料 | ❌ Mac必須 | ✅ | ⭐⭐⭐ | ❌ | ⭐⭐⭐⭐ |
| **GitHub Actions** | 無料（公開）/ 有料（プライベート） | ⚠️ macOS有料 | ✅ Linux無料 | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Codemagic** | 無料（500分/月） | ✅ | ✅ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Bitrise** | 無料（200分/月） | ✅ | ✅ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Appcircle** | 無料（500分/月） | ✅ | ✅ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

**補足**:
- **GitHub Actions**: 公開リポジトリは無料、プライベートリポジトリはmacOSランナーが$0.08/分
- **自動化**: EAS Buildはコマンド実行、GitHub ActionsはGit pushで自動実行

---

#### 推奨選択肢

**個人開発の場合**:
1. **EAS Build（無料枠）** - 最も簡単でExpoとの統合が完璧、Mac不要
2. **GitHub Actions（公開リポジトリ）** - 完全自動化、無料、プルリクエストごとのビルド
3. **ローカルビルド** - Macを持っている場合、完全無料で制限なし
4. **Codemagic** - EAS Buildの代替として、無料枠が充実

**Macを持っていない場合**: 
- **EAS Build**が最適（iOS/Android両方、無料枠で十分）

**Macを持っている場合**: 
- **EAS Build**: 最も簡単
- **ローカルビルド**: 完全無料、制限なし（ただし初期設定は複雑）
- **GitHub Actions**: 自動化したい場合（公開リポジトリ推奨）

**ハイブリッドアプローチ（推奨）**:
- **開発中**: GitHub Actions（プルリクエストごとのテストビルド、Androidのみ無料）
- **本番リリース**: EAS Build（App Store配信、OTA更新）

### 3.2 バックエンドホスティング（自前バックエンドの場合）

#### Option A: Railway
- **特徴**: 
  - シンプルなデプロイ
  - 無料枠あり（$5クレジット/月）
- **コスト**: 無料枠あり、その後従量課金

#### Option B: Render
- **特徴**:
  - 無料枠あり
  - シンプルな設定
- **コスト**: 無料枠あり（制限あり）

#### Option C: Fly.io
- **特徴**:
  - 無料枠あり
  - グローバル展開が容易
- **コスト**: 無料枠あり

**推奨**: Supabase/Firebaseを使用する場合は不要

---

## 4. その他のツール・サービス

### 4.1 認証 ✅ **選定済み**

#### Clerk

- **特徴**:
  - モダンな認証サービス
  - Email/Password認証
  - OAuth認証（Google, Apple, GitHub等）
  - マジックリンク認証
  - 多要素認証（MFA）
  - セッション管理
  - ユーザー管理ダッシュボード
  - React Native/Expoとの統合が良好
  - Convexとの統合が簡単
  - TypeScript対応
- **コスト**:
  - **無料プラン（Free）**:
    - 10,000 MAU（Monthly Active Users）/月
    - 無制限のセッション
    - 基本的な認証機能
    - コミュニティサポート
  - **有料プラン（Pro）**: $25/月〜
    - 無制限のMAU
    - 優先サポート
    - 高度なセキュリティ機能
- **メリット**:
  - ✅ 個人開発では無料枠で十分（10,000 MAU/月）
  - ✅ React Native/Expoとの統合が簡単
  - ✅ Convexとの統合が良好
  - ✅ 豊富な認証方法（Email, OAuth, マジックリンク）
  - ✅ セッション管理が自動
  - ✅ ユーザー管理UIが充実
  - ✅ 多要素認証（MFA）対応
- **デメリット**:
  - ❌ 無料枠は10,000 MAU/月まで
  - ❌ ベンダーロックインの可能性

**統合方法**:

1. **Clerkプロジェクトの作成**
   - Clerkダッシュボードでプロジェクト作成
   - API Keysを取得

2. **Expoプロジェクトへの統合**
   ```bash
   npm install @clerk/clerk-expo
   ```
   - Expo Config Pluginで設定

3. **Convexとの統合**
   ```typescript
   // Clerkの認証トークンをConvexに渡す
   import { useAuth } from '@clerk/clerk-expo';
   import { useConvexAuth } from 'convex/react';
   
   function App() {
     const { getToken } = useAuth();
     const { isLoading, isAuthenticated } = useConvexAuth();
     
     // Convexに認証トークンを設定
     useEffect(() => {
       if (isAuthenticated) {
         getToken({ template: 'convex' }).then((token) => {
           // Convexにトークンを設定
         });
       }
     }, [isAuthenticated]);
   }
   ```

4. **認証フローの実装例**
   ```typescript
   import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
   import { SignInScreen } from './screens/SignInScreen';
   import { HomeScreen } from './screens/HomeScreen';
   
   function App() {
     return (
       <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
         <SignedIn>
           <HomeScreen />
         </SignedIn>
         <SignedOut>
           <SignInScreen />
         </SignedOut>
       </ClerkProvider>
     );
   }
   ```

**Convex統合のメリット**:
- ✅ Clerkの認証状態をConvexで利用可能
- ✅ ユーザーIDをConvex関数で取得可能
- ✅ セキュアなAPI呼び出しが可能
- ✅ 認証状態の自動同期

**推奨**: ✅ **Clerk**
- 個人開発では無料枠で十分（10,000 MAU/月）
- Convexとの統合が完璧
- React Native/Expoとの統合が簡単
- 豊富な認証方法とセキュリティ機能

### 4.2 ストレージ（画像・ファイル）
- **Supabase Storage**: Supabase使用時
- **Firebase Storage**: Firebase使用時
- **Cloudinary**: 画像最適化が必要な場合（無料枠あり）

### 4.3 プッシュ通知 ✅ **選定済み**

#### Expo Notifications

- **特徴**:
  - Expo SDK内蔵のプッシュ通知機能
  - iOS/Androidの両方に対応
  - ローカル通知とリモート通知の両方をサポート
  - 通知権限の管理
  - 通知チャンネルの設定（Android）
  - バッジ管理（iOS）
  - 通知のスケジューリング
- **コスト**: 無料（Expo SDK内蔵）
- **メリット**:
  - ✅ Expoプロジェクトに統合済み
  - ✅ 追加の設定が不要
  - ✅ iOS/Androidの両方に対応
  - ✅ ローカル通知とリモート通知の両方をサポート
  - ✅ 豊富なカスタマイズオプション
- **デメリット**:
  - ❌ 高度な機能（セグメント、A/Bテスト等）は別サービスが必要

**統合方法**:
```typescript
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// 通知の動作を設定
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// 通知権限のリクエスト
async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('通知権限が必要です');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('物理デバイスで実行してください');
  }

  return token;
}

// 通知の受信リスナー
useEffect(() => {
  registerForPushNotificationsAsync();

  // フォアグラウンド通知のリスナー
  const foregroundSubscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log('通知を受信:', notification);
    }
  );

  // 通知タップのリスナー
  const responseSubscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      console.log('通知をタップ:', response);
    }
  );

  return () => {
    foregroundSubscription.remove();
    responseSubscription.remove();
  };
}, []);
```

**バックエンドからの通知送信**:
```typescript
// Convex関数での通知送信例
import { Expo } from 'expo-server-sdk';

const expo = new Expo();

export const sendPushNotification = async (pushToken: string, title: string, body: string) => {
  const messages = [
    {
      to: pushToken,
      sound: 'default',
      title: title,
      body: body,
      data: { someData: 'goes here' },
    },
  ];

  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];

  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error('通知送信エラー:', error);
    }
  }
};
```

**推奨**: ✅ **Expo Notifications**
- Expoプロジェクトに統合済みで簡単
- iOS/Androidの両方に対応
- 無料で使用可能

### 4.4 メール送信 ✅ **選定済み**

#### Resend

- **特徴**:
  - モダンなメール送信API
  - React Email対応
  - TypeScript対応
  - 高配信率
  - メールテンプレート管理
  - メール送信履歴の追跡
  - Webhookサポート
  - ドメイン認証（DKIM、SPF）
- **コスト**:
  - **無料プラン（Free）**:
    - 3,000 emails/月
    - 100 emails/日まで
    - 基本的な機能
  - **有料プラン（Pro）**: $20/月〜
    - 50,000 emails/月
    - 無制限のAPI呼び出し
    - 優先サポート
- **メリット**:
  - ✅ 個人開発では無料枠で十分（3,000 emails/月）
  - ✅ React Emailとの統合が簡単
  - ✅ TypeScript対応
  - ✅ 高配信率
  - ✅ シンプルなAPI
  - ✅ メールテンプレートの管理が容易
- **デメリット**:
  - ❌ 無料枠は3,000 emails/月まで

**統合方法**:

1. **Resendプロジェクトの作成**
   - Resendダッシュボードでプロジェクト作成
   - API Keyを取得
   - ドメイン認証（オプション）

2. **Convex関数での使用例**
   ```typescript
   // packages/backend/convex/sendEmail.ts
   import { Resend } from 'resend';
   
   const resend = new Resend(process.env.RESEND_API_KEY);
   
   export const sendWelcomeEmail = async (email: string, name: string) => {
     try {
       const { data, error } = await resend.emails.send({
         from: 'onboarding@yourdomain.com',
         to: email,
         subject: 'ようこそ！',
         html: `
           <h1>ようこそ、${name}さん！</h1>
           <p>アプリへの登録ありがとうございます。</p>
         `,
       });
       
       if (error) {
         console.error('メール送信エラー:', error);
         return { success: false, error };
       }
       
       return { success: true, data };
     } catch (error) {
       console.error('メール送信エラー:', error);
       return { success: false, error };
     }
   };
   ```

3. **React Emailとの統合**
   ```typescript
   // packages/backend/convex/emails/welcome.tsx
   import {
     Html,
     Head,
     Body,
     Container,
     Section,
     Text,
   } from '@react-email/components';
   
   export const WelcomeEmail = ({ name }: { name: string }) => (
     <Html>
       <Head />
       <Body>
         <Container>
           <Section>
             <Text>ようこそ、{name}さん！</Text>
             <Text>アプリへの登録ありがとうございます。</Text>
           </Section>
         </Container>
       </Body>
     </Html>
   );
   
   // メール送信
   import { render } from '@react-email/render';
   import { WelcomeEmail } from './emails/welcome';
   
   const html = render(<WelcomeEmail name="太郎" />);
   
   await resend.emails.send({
     from: 'onboarding@yourdomain.com',
     to: email,
     subject: 'ようこそ！',
     html,
   });
   ```

4. **環境変数の設定**
   ```bash
   # .env.local
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```

**使用例**:
- ユーザー登録時のウェルカムメール
- パスワードリセットメール
- サブスクリプション更新通知
- 重要なアプリ通知のメール配信

**推奨**: ✅ **Resend**
- 個人開発では無料枠で十分（3,000 emails/月）
- React Emailとの統合が簡単
- TypeScript対応で型安全
- 高配信率

### 4.5 エラートラッキング ✅ **選定済み**

#### Sentry
- **特徴**:
  - リアルタイムエラー監視
  - スタックトレースの詳細な情報
  - パフォーマンス監視
  - リリース追跡
  - ソースマップ対応
  - React Native/Expoとの統合が良好
  - ユーザーコンテキスト情報
  - ブラッドフィルター（エラーの重要度判定）
- **コスト**:
  - **無料プラン（Developer）**:
    - 5,000 errors/月
    - 10,000 transactions/月（パフォーマンス監視）
    - 1プロジェクト
    - 7日間のデータ保持
  - **有料プラン（Team）**: $26/月〜
    - 50,000 errors/月
    - 100,000 transactions/月
    - 無制限のプロジェクト
    - 90日間のデータ保持
- **メリット**:
  - ✅ 個人開発では無料枠で十分（5,000 errors/月）
  - ✅ React Native/Expoとの統合が簡単
  - ✅ ソースマップでミニファイされたコードもデバッグ可能
  - ✅ パフォーマンス監視も含まれる
  - ✅ リリースごとのエラー追跡
  - ✅ 豊富なドキュメント
- **デメリット**:
  - ❌ 無料枠は5,000 errors/月まで
  - ❌ データ保持期間が7日間（無料プラン）

**統合方法**:
1. **Expoプロジェクトへの統合**
   ```bash
   npx expo install sentry-expo
   ```
   - Expo Config Pluginで自動設定
   - ソースマップの自動アップロード

2. **初期化**
   ```typescript
   import * as Sentry from 'sentry-expo';
   
   Sentry.init({
     dsn: 'your-dsn',
     enableInExpoDevelopment: false,
     debug: __DEV__,
   });
   ```

3. **エラーのキャッチ**
   ```typescript
   try {
     // コード
   } catch (error) {
     Sentry.captureException(error);
   }
   ```

4. **ユーザーコンテキストの設定**
   ```typescript
   Sentry.setUser({
     id: user.id,
     email: user.email,
   });
   ```

**推奨**: ✅ **Sentry**
- 個人開発では無料枠で十分
- React Native/Expoとの統合が完璧
- エラー監視とパフォーマンス監視が統合されている

### 4.6 監視・アラート通知統合 ✅ **選定済み**

#### BetterStack + Discord

**概要**: すべての監視・アラート通知をBetterStack経由でDiscordに集約

##### BetterStack
- **特徴**:
  - ログ監視・アラートサービス
  - 複数のサービスからの通知を一元管理
  - Discord、Slack、Email、PagerDuty等への通知統合
  - インシデント管理
  - ステータスページ
  - ログ検索・分析
  - アラートルールの柔軟な設定
- **コスト**:
  - **無料プラン**:
    - 1ステータスページ
    - 基本的なアラート機能
    - 制限あり
  - **有料プラン（Better Uptime）**: $24/月〜
    - 無制限のステータスページ
    - 高度なアラート機能
    - ログ監視機能
- **メリット**:
  - ✅ 複数の監視ツールからの通知を一元管理
  - ✅ Discordへの通知統合が簡単
  - ✅ アラートの重複を防ぐ
  - ✅ インシデント管理機能
- **デメリット**:
  - ❌ 無料プランは制限あり

##### Discord通知統合

**統合するサービス**:
1. **Sentry** → BetterStack → Discord
   - エラー発生時の通知
   - パフォーマンス問題の通知
   - リリース通知

2. **Convex/Supabase** → BetterStack → Discord
   - データベースエラーの通知
   - パフォーマンス低下の通知

3. **EAS Build** → BetterStack → Discord
   - ビルド成功/失敗の通知
   - デプロイ通知

4. **GitHub Actions** → BetterStack → Discord
   - CI/CDパイプラインの通知
   - テスト失敗の通知

5. **RevenueCat** → BetterStack → Discord
   - サブスクリプションエラーの通知
   - 重要な購入イベントの通知

**設定例**:

1. **BetterStackでのDiscord Webhook設定**
   ```typescript
   // BetterStackの設定
   // Discord Webhook URLを設定
   // アラートルールを作成
   ```

2. **SentryからBetterStackへの統合**
   ```typescript
   // SentryのWebhook設定
   // BetterStackのWebhook URLを設定
   // エラー発生時にBetterStackに通知
   ```

3. **Discord Webhookの作成**
   ```
   Discordサーバー設定 → 連携サービス → Webhook
   → 新しいWebhookを作成
   → Webhook URLを取得
   ```

**通知の種類**:
- 🔴 **Critical**: アプリクラッシュ、データベースダウン
- 🟠 **Warning**: パフォーマンス低下、エラー率の増加
- 🟢 **Info**: ビルド成功、デプロイ完了
- 🔵 **Debug**: 開発環境の通知

**メリット**:
- ✅ すべての通知をDiscordに集約
- ✅ チーム全体でリアルタイムに共有
- ✅ 通知の重複を防ぐ
- ✅ インシデント管理が容易
- ✅ モバイルアプリでも通知を受け取れる（Discordアプリ）

**推奨**: ✅ **BetterStack + Discord**
- 個人開発でも無料プランで十分な機能
- すべての監視ツールからの通知を一元管理
- Discordでリアルタイムに通知を受け取れる

### 4.7 アナリティクス
- **Firebase Analytics**: 無料
- **Mixpanel**: 無料枠あり（20M events/月）

### 4.8 サブスクリプション管理 ✅ **選定済み**

#### RevenueCat
- **特徴**:
  - App Store/Play Storeのサブスクリプションを一元管理
  - クロスプラットフォーム対応（iOS/Android/Web）
  - サブスクリプション状態の管理
  - レシート検証の自動化
  - アナリティクス・レポート機能
  - A/Bテスト機能
  - プロモーションコード管理
- **コスト**:
  - **無料プラン（Starter）**:
    - 月$10,000までの収益まで無料
    - 基本的な機能が利用可能
    - サポート: コミュニティフォーラム
  - **有料プラン（Pro）**: $99/月〜
    - 無制限の収益
    - 優先サポート
    - 高度なアナリティクス
- **メリット**:
  - ✅ 個人開発では無料枠で十分（月$10,000まで）
  - ✅ iOS/Androidのサブスクリプションを1つのAPIで管理
  - ✅ レシート検証が自動化される
  - ✅ サブスクリプション状態の同期が簡単
  - ✅ React Native/Expoとの統合が良好
  - ✅ 豊富なドキュメントとSDK
- **デメリット**:
  - ❌ 月$10,000を超えると有料プランが必要
  - ❌ ベンダーロックインの可能性
- **統合方法**:
  - React Native SDKを使用
  - Expo Config Pluginで設定
  - Supabaseと連携してユーザーのサブスクリプション状態を管理

**統合の流れ**:
1. **RevenueCatプロジェクトの作成**
   - RevenueCatダッシュボードでプロジェクト作成
   - App Store Connect / Play Consoleと連携
   - サブスクリプション商品の設定

2. **Expoプロジェクトへの統合**
   ```bash
   npm install react-native-purchases
   ```
   - Expo Config Pluginで設定
   - RevenueCat SDKの初期化

3. **Supabaseとの連携**
   - RevenueCat Webhookでサブスクリプション状態をSupabaseに保存
   - ユーザー認証（Supabase Auth）とサブスクリプション状態を紐付け
   - アプリ内でSupabaseからサブスクリプション状態を取得

4. **実装例**:
   ```typescript
   // RevenueCat SDKの初期化
   import Purchases from 'react-native-purchases';
   
   await Purchases.configure({
     apiKey: 'your-api-key',
     appUserID: supabaseUser.id,
   });
   
   // サブスクリプション商品の取得
   const offerings = await Purchases.getOfferings();
   
   // 購入処理
   const purchaseResult = await Purchases.purchasePackage(package);
   
   // サブスクリプション状態の確認
   const customerInfo = await Purchases.getCustomerInfo();
   const isPremium = customerInfo.entitlements.active['premium'] !== undefined;
   ```

**Supabase連携のメリット**:
- ✅ ユーザーのサブスクリプション状態をデータベースで管理
- ✅ バックエンドAPIでサブスクリプション状態を確認可能
- ✅ RevenueCat Webhookで自動同期
- ✅ オフライン時もサブスクリプション状態を確認可能

**推奨**: ✅ **RevenueCat**
- 個人開発では無料枠で十分（月$10,000まで）
- サブスクリプション管理が大幅に簡素化される
- App Store/Play Storeの両方を1つのAPIで管理可能
- Supabaseとの連携で柔軟なバックエンド実装が可能

### 4.9 CI/CD ✅ **Turborepoで構築**

#### Turborepo + GitHub Actions

**概要**: Turborepoを使ったCI/CDパイプラインをGitHub Actionsで構築

##### TurborepoのCI/CD機能

- **キャッシュ機能**: ビルド結果をキャッシュして高速化
- **並列実行**: 依存関係を考慮して並列実行
- **インクリメンタルビルド**: 変更されたパッケージのみビルド
- **タスクの依存関係管理**: 自動的に依存関係を解決

##### GitHub Actionsワークフロー設定

**.github/workflows/ci.yml**:
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-test:
    name: Lint and Test
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 2 # Turborepoのキャッシュに必要

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Setup Turborepo
        uses: turborepo/setup-action@v1

      - name: Lint
        run: pnpm turbo lint

      - name: Type check
        run: pnpm turbo type-check

      - name: Test
        run: pnpm turbo test

      - name: Format check
        run: pnpm turbo format:check
```

**.github/workflows/build.yml**:
```yaml
name: Build

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    name: Build All Packages
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'

      - name: Setup Turborepo
        uses: turborepo/setup-action@v1

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm turbo build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-artifacts
          path: |
            apps/expo/dist
            packages/*/dist
```

**.github/workflows/mobile-build.yml**:
```yaml
name: Mobile Build

on:
  push:
    branches: [main]
    paths:
      - 'apps/expo/**'
      - 'apps/admin/**'
      - 'packages/**'
  pull_request:
    branches: [main]
    paths:
      - 'apps/expo/**'
      - 'apps/admin/**'
      - 'packages/**'
  workflow_dispatch:

jobs:
  build-android:
    name: Build Android
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'

      - name: Setup Turborepo
        uses: turborepo/setup-action@v1

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Build Android
        run: pnpm turbo build --filter=mobile
        env:
          EAS_BUILD_PROFILE: preview

      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: android-build
          path: apps/expo/build/**/*.apk
```

##### Turborepo設定の最適化

**turbo.json**:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**", "*.apk", "*.ipa"],
      "env": ["NODE_ENV"]
    },
    "lint": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "type-check": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"],
      "env": ["NODE_ENV"]
    },
    "format": {
      "cache": false,
      "outputs": []
    },
    "format:check": {
      "cache": false,
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

##### CI/CDパイプラインの流れ

1. **プルリクエスト作成時**:
   ```
   PR作成 → CI実行
   ├── Lintチェック
   ├── Type check
   ├── Test実行
   └── Format check
   ```

2. **mainブランチへのマージ時**:
   ```
   マージ → CI/CD実行
   ├── Lint & Test（再実行）
   ├── Build（全パッケージ）
   └── Deploy（必要に応じて）
   ```

3. **モバイルアプリのビルド**:
   ```
   変更検知 → モバイルビルド
   ├── Androidビルド（GitHub Actions）
   └── iOSビルド（EAS Build）
   ```

##### Turborepoキャッシュの活用

**GitHub Actionsでのキャッシュ設定**:
```yaml
- name: Setup Turborepo
  uses: turborepo/setup-action@v1

# Turborepoが自動的にキャッシュを管理
# - ビルド結果をキャッシュ
# - 変更のないパッケージはスキップ
# - 大幅な高速化
```

**キャッシュの効果**:
- ✅ 変更のないパッケージはスキップ
- ✅ ビルド時間の大幅短縮
- ✅ CI/CDコストの削減

##### 環境変数の管理

**.github/workflows/ci.yml**:
```yaml
env:
  NODE_ENV: production
  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
  TURBO_TEAM: ${{ secrets.TURBO_TEAM }}

jobs:
  build:
    steps:
      - name: Build
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
          CONVEX_DEPLOY_KEY: ${{ secrets.CONVEX_DEPLOY_KEY }}
        run: pnpm turbo build
```

##### 並列実行の最適化

**turbo.jsonでの並列実行設定**:
```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"], // 同じパッケージのbuild完了後に実行
      "outputs": []
    }
  }
}
```

**実行順序**:
```
packages/utils/build → packages/ui/build → packages/backend/build → apps/expo/build
         ↓                    ↓                    ↓                    ↓
packages/utils/test  → packages/ui/test  → packages/backend/test  → apps/expo/test
```

##### メリット

- ✅ **高速なCI/CD**: Turborepoのキャッシュで大幅に高速化
- ✅ **並列実行**: 依存関係を考慮して自動的に並列実行
- ✅ **インクリメンタルビルド**: 変更されたパッケージのみビルド
- ✅ **一元管理**: すべてのCI/CDタスクをTurborepoで管理
- ✅ **ローカルとCI/CDの一貫性**: 同じコマンドで実行可能

##### コスト

- **GitHub Actions**: 無料（公開リポジトリ）
  - 2,000分/月（macOSランナーは$0.08/分）
- **Turborepo**: 無料（オープンソース）
  - リモートキャッシュは有料プランあり（オプション）

**推奨**: ✅ **Turborepo + GitHub Actions**
- モノレポプロジェクトに最適
- キャッシュ機能で高速なCI/CD
- ローカル開発とCI/CDの一貫性

### 4.10 E2Eテスト・検証 ✅ **選定済み**

#### Maestro

- **特徴**:
  - モバイルアプリ専用のE2Eテストフレームワーク
  - YAMLベースのシンプルなテスト記述
  - iOS/Androidの両方に対応
  - クロスプラットフォーム対応
  - ビジュアルリグレッションテスト
  - スクリーンショット比較
  - 高速なテスト実行
  - クラウド実行対応（Maestro Cloud）
  - React Native/Expoとの統合が良好
- **コスト**:
  - **無料プラン**:
    - ローカル実行: 無制限
    - クラウド実行: 制限あり
  - **有料プラン（Maestro Cloud）**: $99/月〜
    - 無制限のクラウド実行
    - 並列実行
    - 優先サポート
- **メリット**:
  - ✅ YAMLベースでシンプルなテスト記述
  - ✅ iOS/Androidの両方に対応
  - ✅ React Native/Expoとの統合が良好
  - ✅ 高速なテスト実行
  - ✅ ローカル実行は無料
  - ✅ ビジュアルリグレッションテスト対応
- **デメリット**:
  - ❌ クラウド実行は有料プランが必要

**統合方法**:

1. **Maestroのインストール**
   ```bash
   # macOS
   curl -Ls "https://get.maestro.mobile.dev" | bash
   
   # Linux
   curl -Ls "https://get.maestro.mobile.dev" | bash
   
   # Windows (WSL推奨)
   curl -Ls "https://get.maestro.mobile.dev" | bash
   ```

2. **テストファイルの作成**
   ```yaml
   # tests/login.yaml
   appId: com.animalapp.mobile
   ---
   - launchApp
   - tapOn: "ログイン"
   - inputText: "test@example.com"
   - tapOn: "次へ"
   - inputText: "password123"
   - tapOn: "ログイン"
   - assertVisible: "ホーム"
   ```

3. **テストの実行**
   ```bash
   # iOSシミュレータで実行
   maestro test tests/login.yaml --device "iPhone 14"

   # Androidエミュレータで実行
   maestro test tests/login.yaml --device "Pixel_5_API_33"
   ```

4. **CI/CDでの統合**
   ```yaml
   # .github/workflows/e2e.yml
   name: E2E Tests
   
   on:
     pull_request:
       branches: [main]
     workflow_dispatch:
   
   jobs:
     e2e-ios:
       name: E2E Tests (iOS)
       runs-on: macos-latest
       steps:
         - uses: actions/checkout@v4
         
         - name: Setup Node.js
           uses: actions/setup-node@v4
           with:
             node-version: '18'
         
         - name: Install Maestro
           run: |
             curl -Ls "https://get.maestro.mobile.dev" | bash
             export PATH="$PATH:$HOME/.maestro/bin"
         
         - name: Build iOS app
           run: |
             cd apps/expo
             eas build --platform ios --profile preview --local
         
         - name: Run E2E tests
           run: |
             export PATH="$PATH:$HOME/.maestro/bin"
             maestro test tests/ --device "iPhone 14"
     
     e2e-android:
       name: E2E Tests (Android)
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         
         - name: Setup Node.js
           uses: actions/setup-node@v4
           with:
             node-version: '18'
         
         - name: Install Maestro
           run: |
             curl -Ls "https://get.maestro.mobile.dev" | bash
             export PATH="$PATH:$HOME/.maestro/bin"
         
         - name: Setup Android Emulator
           uses: reactivecircus/android-emulator-runner@v2
           with:
             api-level: 33
             arch: x86_64
             profile: Nexus 5
         
         - name: Build Android app
           run: |
             cd apps/expo
             eas build --platform android --profile preview --local
         
         - name: Run E2E tests
           run: |
             export PATH="$PATH:$HOME/.maestro/bin"
             maestro test tests/
   ```

5. **テストファイルの構成例**
   ```
   tests/
   ├── login.yaml          # ログインフロー
   ├── signup.yaml         # サインアップフロー
   ├── feed.yaml           # フィード表示
   ├── profile.yaml        # プロフィール表示
   └── subscription.yaml   # サブスクリプション購入
   ```

6. **高度なテスト例**
   ```yaml
   # tests/subscription.yaml
   appId: com.animalapp.mobile
   ---
   - launchApp
   - tapOn: "プレミアム"
   - assertVisible: "サブスクリプション"
   - tapOn: "月額プラン"
   - tapOn: "購入"
   # 実際の購入はスキップ（テスト環境）
   - tapOn: "キャンセル"
   - assertVisible: "ホーム"
   ```

7. **ビジュアルリグレッションテスト**
   ```yaml
   # tests/visual-regression.yaml
   appId: com.animalapp.mobile
   ---
   - launchApp
   - takeScreenshot: "home-screen"
   - tapOn: "プロフィール"
   - takeScreenshot: "profile-screen"
   ```

**Turborepoとの統合**:

**turbo.json**:
```json
{
  "pipeline": {
    "test:e2e": {
      "dependsOn": ["build"],
      "outputs": ["test-results/**"],
      "cache": false
    }
  }
}
```

**apps/expo/package.json**:
```json
{
  "scripts": {
    "test:e2e": "maestro test tests/",
    "test:e2e:ios": "maestro test tests/ --device \"iPhone 14\"",
    "test:e2e:android": "maestro test tests/ --device \"Pixel_5_API_33\""
  }
}
```

**ルートpackage.json**:
```json
{
  "scripts": {
    "test:e2e": "turbo run test:e2e --filter=mobile"
  }
}
```

**メリット**:
- ✅ **シンプルな記述**: YAMLベースで読みやすい
- ✅ **高速実行**: ネイティブアプリの高速実行
- ✅ **クロスプラットフォーム**: iOS/Androidの両方に対応
- ✅ **CI/CD統合**: GitHub Actionsで簡単に統合
- ✅ **ビジュアルテスト**: スクリーンショット比較が可能
- ✅ **ローカル実行**: 無料でローカル実行可能

**推奨**: ✅ **Maestro**
- React Native/ExpoアプリのE2Eテストに最適
- YAMLベースでシンプルなテスト記述
- iOS/Androidの両方に対応
- ローカル実行は無料

---

### 4.11 管理画面 ✅ **選定済み**

#### 技術選定: Next.js（ローカルのみ）

**選定理由**:
- **Next.js**: Reactベースのフレームワークで、管理画面の開発に最適
- **ローカル開発**: 管理画面はローカル環境でのみ動作し、デプロイ不要
- **モノレポ対応**: Turborepoでモバイルアプリと管理画面を同じリポジトリで管理
- **コスト**: デプロイ不要のため、追加コストなし

#### Next.jsの特徴

**メリット**:
- ✅ **Reactベース**: モバイルアプリと同じReactエコシステムを活用
- ✅ **SSR/SSG**: サーバーサイドレンダリングでSEO対応（必要に応じて）
- ✅ **API Routes**: バックエンドAPIをNext.js内で構築可能（Convexと併用）
- ✅ **App Router**: 最新のApp Routerでモダンな開発体験
- ✅ **TypeScript**: 型安全性を確保

**デメリット**:
- ❌ モバイルアプリとは別のコードベース（ただし、共有パッケージで共通化可能）
- ❌ ローカル環境でのみ動作（デプロイしない）

#### 管理画面の機能

**Phase 1**:
- コラム・記事の投稿・編集・削除（US-030）
- AI執筆サポート（US-031）
- 記事の信頼性チェック（US-032）
- 知識ベースの管理（AI相談用）

**Phase 2以降**:
- 商品の承認・管理（US-045）
- ユーザー管理
- 統計情報の表示
- システム設定

#### モノレポ構成での統合

```
animal-app/
├── apps/
│   ├── mobile/              # React Native Expo
│   └── admin/               # Next.js管理画面
│       ├── app/             # Next.js App Router
│       ├── components/      # 管理画面専用コンポーネント
│       ├── convex/          # Convex関数（共有）
│       └── package.json
├── packages/
│   ├── ui/                  # 共有UIコンポーネント（必要に応じて）
│   ├── convex/              # Convex関数（共有）
│   └── utils/               # 共有ユーティリティ
```

**共有できるもの**:
- Convex関数（`packages/backend` - 独立パッケージ）✅ **最重要**
- TypeScript型定義
- ユーティリティ関数（`packages/utils` - ビジネスロジック）
- UIコンポーネント（`packages/ui` - Tamagui）
- ESLint/Prettier設定

**管理画面専用**:
- Next.jsのApp Router
- 管理画面用のUIコンポーネント
- 認証（Clerkの管理画面用設定）

#### 認証統合

**Clerkの管理画面用設定**:
- 管理画面用のClerkアプリケーションを作成（または既存のものを使用）
- 管理者ロールを設定
- 管理画面へのアクセス制御

**実装例**:
```typescript
// apps/admin/middleware.ts
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/sign-in", "/sign-up"],
  // 管理者のみアクセス可能
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

#### 開発環境

**ローカル開発**:
```bash
# 管理画面のみ起動
pnpm --filter admin dev

# モバイルアプリと管理画面を同時起動
pnpm dev
```

**Turborepo設定**:
```json
// turbo.json
{
  "pipeline": {
    "dev": {
      "dependsOn": ["^dev"],
      "cache": false
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**"]
    }
  }
}
```

#### コスト見積もり

**追加コスト**: なし（ローカル開発のみのため、デプロイコストなし）

#### 次のステップ

1. **Next.jsプロジェクトの作成**
   ```bash
   cd apps
   npx create-next-app@latest admin --typescript --tailwind --app
   ```

2. **Clerk統合**
   - Clerkの管理画面用設定
   - 認証ミドルウェアの実装

3. **Convex統合**
   - Convexクライアントの設定
   - 管理画面用のConvex関数の作成

4. **ローカル開発環境の確認**
   - 管理画面がローカルで正常に起動することを確認
   - 環境変数の設定（`.env.local`）

---

## 5. 推奨技術スタック（最終案）

### プロジェクト構成
```
- Turborepo (モノレポ管理) ✅
- pnpm (パッケージマネージャー) ✅
```

### フロントエンド
```
- React Native Expo (モバイルアプリ)
- Tamagui (UIライブラリ) ✅
- Zustand (クライアント状態管理) ✅
- Convex (サーバー状態管理) ✅
- Expo Router (ナビゲーション)
- React Hook Form (フォーム)
```

### 管理画面 ✅ **選定済み（ローカルのみ）**
```
- Next.js (App Router)
- Clerk (認証) ✅
- Convex (バックエンド) ✅
- Tailwind CSS (スタイリング)
- TypeScript
```

### バックエンド（2つの選択肢）

#### Option A: Convex ✅ **推奨（状態管理統合）**
```
- Convex
  - リアルタイムデータベース（自動同期）
  - サーバーレス関数（TypeScript）
  - 自動API生成
  - ファイルストレージ
  - ベクトル検索（RAG用）
- Clerk (認証) ✅
  - Email/Password認証
  - OAuth認証（Google, Apple等）
  - マジックリンク認証
  - 多要素認証（MFA）
- OpenAI (AI機能) ✅
  - GPT-4o (回答生成)
  - text-embedding-3-small (ベクトル化)
  - RAGによる信頼できるAI相談
```

**状態管理の役割分担**:
- **サーバー状態**: Convex (`useQuery`) - ユーザープロフィール、投稿一覧等
- **クライアント状態**: Zustand - タブ選択、検索フィルタ、UI設定等
- **認証**: Clerk - ユーザー認証・セッション管理
- **AI機能**: OpenAI + Convex Vector Search - RAGベースのAI相談

#### Option B: Supabase
```
- Supabase
  - PostgreSQL (データベース)
  - Supabase Auth (認証)
  - Supabase Storage (ファイルストレージ)
  - Supabase Realtime (リアルタイム機能)
```

**状態管理**:
- **サーバー状態**: Supabase Realtime + カスタム状態管理
- **クライアント状態**: Zustand

### インフラ・デプロイ
```
- Turborepo + GitHub Actions (CI/CD) ✅
- EAS Build (アプリビルド・配信)
```

### 開発ツール
```
- ESLint (コード品質チェック) ✅ フロント・バックエンド共通
- Prettier (コードフォーマット) ✅ フロント・バックエンド共通
- TypeScript (型安全性)
- Maestro (E2Eテスト・検証) ✅
```

### その他ツール
```
- Clerk (認証) ✅
- OpenAI (AI相談機能) ✅
- RevenueCat (サブスクリプション管理) ✅
- Sentry (エラートラッキング) ✅
- BetterStack + Discord (監視・アラート通知統合) ✅
- Expo Notifications (プッシュ通知) ✅
- Resend (メール送信) ✅
- Firebase Analytics (アナリティクス)
```

### 状態管理アーキテクチャ（Convex使用時）

```
┌─────────────────────────────────────────┐
│          React Native Expo App          │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐    ┌──────────────┐  │
│  │   Convex     │    │   Zustand    │  │
│  │              │    │              │  │
│  │ サーバー状態  │    │ クライアント  │  │
│  │              │    │   状態       │  │
│  │ - ユーザー    │    │ - タブ選択   │  │
│  │ - 投稿一覧    │    │ - 検索フィルタ│  │
│  │ - ペット記録  │    │ - ダークモード│  │
│  │              │    │              │  │
│  │ useQuery()   │    │ create()     │  │
│  │ 自動同期      │    │ 手動管理      │  │
│  └──────────────┘    └──────────────┘  │
│         │                    │         │
│         └────────┬───────────┘         │
│                  │                     │
│         ┌────────▼──────────┐         │
│         │   UI Components   │         │
│         └───────────────────┘         │
└─────────────────────────────────────────┘
```

---

## 6. コスト見積もり（月額）

### 無料枠で運用可能な場合

#### Convex使用時
- **Convex**: 無料（1M関数呼び出し/月、5GBストレージ）
- **Clerk**: 無料（10,000 MAU/月）
- **OpenAI**: 従量課金（使用量に応じて）
  - GPT-4o: $2.50/1M input tokens, $10/1M output tokens
  - text-embedding-3-small: $0.02/1M tokens
  - 目安: 月100回の相談で約$5-10
- **EAS Build**: 無料（30ビルド/月）
- **RevenueCat**: 無料（月$10,000までの収益まで）
- **Sentry**: 無料（5,000 errors/月）
- **BetterStack**: 無料（基本的なアラート機能）
- **Resend**: 無料（3,000 emails/月）
- **Firebase Analytics**: 無料
- **GitHub Actions**: 無料（公開リポジトリ）
- **合計**: **$0-10/月**（OpenAI使用量による）

#### Supabase使用時
- **Supabase**: 無料（500MB DB, 1GB Storage、認証機能含む）
- **EAS Build**: 無料（30ビルド/月）
- **RevenueCat**: 無料（月$10,000までの収益まで）
- **Sentry**: 無料（5,000 errors/月）
- **BetterStack**: 無料（基本的なアラート機能）
- **Resend**: 無料（3,000 emails/月）
- **Firebase Analytics**: 無料
- **GitHub Actions**: 無料（公開リポジトリ）
- **合計**: **$0/月**

### スケール時（目安）

#### Convex使用時
- **Convex Pro**: $25/月
- **Clerk Pro**: $25/月（10,000 MAU超える場合）
- **OpenAI**: 従量課金（使用量に応じて）
  - 目安: 月1,000回の相談で約$50-100
- **EAS Build**: $29/月（必要に応じて）
- **RevenueCat Pro**: $99/月（月$10,000超える場合）
- **BetterStack Pro**: $24/月（高度な機能が必要な場合）
- **Resend Pro**: $20/月（3,000 emails超える場合）
- **合計**: **$25-247/月**（OpenAI使用量による）

#### Supabase使用時
- **Supabase Pro**: $25/月（認証機能含む）
- **EAS Build**: $29/月（必要に応じて）
- **RevenueCat Pro**: $99/月（月$10,000超える場合）
- **BetterStack Pro**: $24/月（高度な機能が必要な場合）
- **Resend Pro**: $20/月（3,000 emails超える場合）
- **合計**: **$25-172/月**

---

## 7. 次のステップ

### 7.1 管理画面のセットアップ（Next.js、ローカルのみ）

1. **Next.jsプロジェクトの作成**
   ```bash
   cd apps
   npx create-next-app@latest admin --typescript --tailwind --app --no-src-dir
   ```

2. **Clerk統合**
   - Clerkダッシュボードで管理画面用のアプリケーションを作成（または既存のものを使用）
   - `@clerk/nextjs`をインストール
   - 認証ミドルウェアの実装
   - 環境変数の設定（`.env.local`に`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`）

3. **Convex統合**
   - Convexクライアントの設定
   - 管理画面用のConvex関数の作成（コラム投稿、商品承認など）
   - 環境変数の設定（`.env.local`に`NEXT_PUBLIC_CONVEX_URL`）

4. **ローカル開発環境の確認**
   - `pnpm --filter admin dev`で管理画面が起動することを確認
   - 認証フローが正常に動作することを確認
   - Convexとの接続が正常に動作することを確認

5. **Turborepo設定の更新**
   - `turbo.json`に管理画面の開発設定を追加
   - `package.json`の`dev`スクリプトに管理画面を追加

### 7.2 モバイルアプリのセットアップ

1. ✅ 技術選定の確定
2. ⬜ モノレポのセットアップ
   - Turborepoの初期化
   - pnpm workspaceの設定
   - ディレクトリ構造の作成（apps/, packages/）
3. ⬜ Expoプロジェクトの初期化（apps/expo/）

---

## デザインツール: Pencil.dev ✅ **選定済み**

### Pencil.devとは

**Pencil.dev**は、IDE内でデザインとコーディングを統合するMCP（Model Context Protocol）ベースのデザインキャンバスツールです。

**公式サイト**: https://www.pencil.dev/

### 選定理由

- ✅ **IDE統合**: Cursor、VS Code、Claude Codeで使用可能
- ✅ **デザインからコード生成**: HTML/CSS/Reactコードを自動生成
- ✅ **Figma連携**: Figmaからコピー&ペーストでデザインをインポート可能
- ✅ **Git管理**: `.pen`ファイル形式でデザインファイルをGitで管理
- ✅ **AIマルチプレイヤー**: AIと並行してデザインを生成・改善
- ✅ **オープンフォーマット**: デザインファイルは完全にオープンで拡張可能
- ✅ **コスト**: 無料（オープンソース）

### プロジェクトでの活用方法

- **UIデザイン**: 画面レイアウトのデザインとプロトタイプ
- **コンポーネント設計**: Tamaguiコンポーネントのデザイン
- **デザインシステム**: ブランドキットとデザインシステムの管理
- **プロトタイピング**: 実装前のUI/UX検証

### ディレクトリ構造

```
animal-app/
├── designs/                    # Pencilデザインファイル
│   ├── screens/                # 画面デザイン
│   ├── components/             # コンポーネントデザイン
│   ├── design-system/         # デザインシステム
│   └── flows/                  # ユーザーフロー
```

### セットアップ手順

詳細なセットアップ手順は [`.cursor/PENCIL_SETUP.md`](../.cursor/PENCIL_SETUP.md) を参照してください。

**クイックスタート**:
1. Cursor拡張機能をインストール（`Cmd+Shift+X` → 「Pencil」で検索）
2. `designs/`ディレクトリを作成
3. `.pen`ファイルを作成してデザインを開始

### Tamaguiとの連携

- Pencilでデザインしたコンポーネントを、Tamaguiコンポーネントとして`packages/ui/`に生成
- デザインシステム（カラー、タイポグラフィ）を`packages/ui/src/theme/`に反映
- デザインとコードを同期して管理

### 参考リンク

- **公式サイト**: https://www.pencil.dev/
- **ドキュメント**: https://docs.pencil.dev/
- **インストールガイド**: https://docs.pencil.dev/installation
- **Discord**: https://discord.gg/Azsk8cnnVp
4. ⬜ 管理画面プロジェクトの初期化（apps/admin/）✅ **Next.js（ローカルのみ）**
   - Next.jsプロジェクトの作成
   - Clerk統合
   - Convex統合
   - ローカル開発環境の確認
5. ⬜ 共有パッケージの作成
   - packages/ui（Tamaguiコンポーネント）
   - packages/utils（ユーティリティ関数）
   - packages/config（ESLint, Prettier, TypeScript設定） ✅
     - ESLint設定（base, react-native, convex）
     - Prettier設定
     - TypeScript設定
6. ⬜ Convexプロジェクトの作成・設定（またはSupabase）
7. ⬜ Clerkプロジェクトの作成・設定 ✅
   - API Keysの取得
   - OAuthプロバイダーの設定（Google, Apple等）
   - Convexとの統合設定
7. ⬜ RevenueCatプロジェクトの作成・設定
8. ⬜ Sentryプロジェクトの作成・設定 ✅
9. ⬜ BetterStackプロジェクトの作成・設定 ✅
   - Discord Webhookの設定
   - Sentry統合
   - その他監視ツールの統合
10. ⬜ 開発環境のセットアップ ✅ **Turborepoで一元管理**
   - `turbo.json`の設定
   - 各パッケージの`dev`スクリプト設定
   - `pnpm turbo dev`で全体を起動（モバイルアプリ + 管理画面）
12. ⬜ CI/CDパイプラインの構築 ✅ **Turborepo + GitHub Actions**
   - GitHub Actionsワークフローの作成
   - `.github/workflows/ci.yml`の設定
   - `.github/workflows/build.yml`の設定
   - `.github/workflows/mobile-build.yml`の設定
   - Turborepoキャッシュの設定
   - 環境変数の設定（GitHub Secrets）
13. ⬜ Maestro E2Eテストの設定 ✅
   - Maestroのインストール
   - テストファイルの作成（YAML）
   - テストスクリプトの設定
   - CI/CDへの統合（GitHub Actions）
   - iOS/Androidテストの設定
13. ⬜ 状態管理の実装
   - Convexのセットアップ（サーバー状態）
   - Zustandストアの作成（クライアント状態）
14. ⬜ 認証機能の実装（Clerk統合）
   - Clerk SDKの統合
   - 認証フローの実装
   - Convexとの認証連携
15. ⬜ 基本的なUIコンポーネントの実装（Tamagui）
16. ⬜ データベーススキーマの設計（Convexスキーマ定義）
17. ⬜ RevenueCat統合（サブスクリプション管理）
18. ⬜ Sentry統合（エラートラッキング・パフォーマンス監視）
19. ⬜ Expo Notifications統合（プッシュ通知） ✅
   - 通知権限の設定
   - プッシュトークンの取得
   - 通知の受信処理
   - バックエンドからの通知送信
20. ⬜ Resend統合（メール送信） ✅
   - Resendプロジェクトの作成
   - API Keyの設定
   - メール送信関数の実装
   - React Emailテンプレートの作成（オプション）
21. ⬜ BetterStack + Discord通知統合の設定

---

## 8. 検討事項・質問

### アプリの機能要件
- [x] プレミアム機能（サブスクリプション） ✅ RevenueCat使用
- [x] 認証が必要か？（ユーザー登録・ログイン） ✅ Clerk使用
- [ ] データの永続化が必要か？（データベース）
- [ ] ファイルアップロードが必要か？（画像・動画等）
- [ ] リアルタイム機能が必要か？（チャット、通知等）
- [ ] プッシュ通知が必要か？

### パフォーマンス要件
- [ ] オフライン対応が必要か？
- [ ] 大量のデータ処理が必要か？

### セキュリティ要件
- [ ] 機密情報の取り扱い
- [x] 認証の複雑さ（Emailのみ or OAuth等） ✅ ClerkでEmail/OAuth/MFA対応

---

## 参考リンク

### モノレポ
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Turborepo Expo Guide](https://turbo.build/repo/docs/getting-started/existing-repo#expo)
- [Turborepo CI/CD Guide](https://turbo.build/repo/docs/core-concepts/ci)
- [Turborepo GitHub Actions](https://turbo.build/repo/docs/ci/github-actions)
- [Turborepo Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [pnpm Documentation](https://pnpm.io/)
- [pnpm Workspaces](https://pnpm.io/workspaces)

### フロントエンド
- [Expo Documentation](https://docs.expo.dev/)
- [Tamagui Documentation](https://tamagui.dev/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)

### バックエンド
- [Convex Documentation](https://docs.convex.dev/)
- [Convex React Native](https://docs.convex.dev/client/react-native)
- [Convex Vector Search](https://docs.convex.dev/vector-search)
- [Supabase Documentation](https://supabase.com/docs)

### AI機能
- [OpenAI Documentation](https://platform.openai.com/docs)
- [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)
- [OpenAI Chat Completions](https://platform.openai.com/docs/guides/text-generation)
- [RAG (Retrieval-Augmented Generation)](https://platform.openai.com/docs/guides/embeddings/use-cases)

### 認証
- [Clerk Documentation](https://clerk.com/docs)
- [Clerk React Native](https://clerk.com/docs/quickstarts/expo)
- [Clerk Convex Integration](https://clerk.com/docs/integrations/databases/convex)

### 開発ツール
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [ESLint TypeScript](https://typescript-eslint.io/)
- [ESLint React Native](https://github.com/Intellicode/eslint-plugin-react-native)
- [Prettier Documentation](https://prettier.io/docs/en/)
- [ESLint Prettier Integration](https://github.com/prettier/eslint-config-prettier)
- [Maestro Documentation](https://maestro.mobile.dev/)
- [Maestro Getting Started](https://maestro.mobile.dev/getting-started)
- [Maestro CI/CD Integration](https://maestro.mobile.dev/advanced/ci-cd)
- [Maestro React Native](https://maestro.mobile.dev/frameworks/react-native)

### その他
- [RevenueCat Documentation](https://www.revenuecat.com/docs)
- [RevenueCat React Native SDK](https://www.revenuecat.com/docs/react-native)
- [Sentry Documentation](https://docs.sentry.io/)
- [Sentry for React Native](https://docs.sentry.io/platforms/react-native/)
- [Sentry Expo](https://docs.sentry.io/platforms/react-native/guides/expo/)
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Resend Documentation](https://resend.com/docs)
- [Resend React Email](https://resend.com/docs/send-with-react-email)
- [React Email](https://react.email/)
- [BetterStack Documentation](https://betterstack.com/docs)
- [BetterStack Discord Integration](https://betterstack.com/docs/uptime/integrations/discord)
- [Discord Webhooks Guide](https://discord.com/developers/docs/resources/webhook)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Codemagic](https://codemagic.io/)

---

## 関連ドキュメント

### 設計ドキュメント
- [設計ドキュメント（一次設計）](./DESIGN_DOCUMENT.md) - データモデル、機能設計、API設計
- [ユーザーストーリー](./USER_STORIES.md) - フェーズ別のユーザーストーリー一覧（41個）
- [Convexスキーマ定義](./CONVEX_SCHEMA.md) - データベーススキーマの詳細説明
- [セットアップチェックリスト](./SETUP_CHECKLIST.md) ⭐ **セットアップ前に必読** - 設定が必要な項目のチェックリスト

### キラー機能
- **AI相談機能（RAGベース）**: ペットのカルテ情報を活用した信頼できるAI相談
  - ペットの記録情報を自動的に考慮
  - 信頼できる知識ベースからの回答生成
  - 緊急度判定と病院案内
  - 引用元の明示による透明性の確保

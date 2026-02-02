# Turborepo + Convex 統合ガイド

このドキュメントは、TurborepoとConvexを統合する際の設計とベストプラクティスを定義します。

## 重要な設計原則

### 1. ConvexとReact NativeのNode環境を分離する ✅ **正解**

**理由**: それぞれのコードが実行される場所が異なるため。

- **React Native (Expo)**: ローカルマシンでビルドされ、iOS/Android端末上で動作
- **Convex**: Convexのクラウドサーバー（V8ベース、およびNode.js Action用ランタイム）で動作

**実装**:
- `packages/backend/`にConvexを独立パッケージとして配置
- Convexは`convex.json`でクラウド上のバージョンを指定（ローカルのNode.jsバージョンに縛られない）
- ローカル開発環境はmiseで統一管理（Node.js 20.18.0）

### 2. Turborepoのワークスペース機能で依存関係を分離する ✅ **必須**

**問題**: Convexはバックエンドなので`node-fetch`や`lucide-react`（Web用）などを使いたい一方、React Nativeはモバイル用ライブラリを必要とする。

**対策**: `pnpm-workspace.yaml`で`packages/backend/`を独立したワークスペースとして定義。

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

**`packages/backend/package.json`**:
```json
{
  "name": "@repo/backend",
  "dependencies": {
    "convex": "^1.15.0"
    // Convex専用の依存関係のみ
  }
}
```

**`apps/expo/package.json`**:
```json
{
  "name": "@repo/expo",
  "dependencies": {
    "@repo/backend": "workspace:*",
    "expo": "~52.0.0"
    // React Native専用の依存関係
  }
}
```

### 3. `convex dev`とTurborepoのキャッシュ対策 ✅ **必須**

**問題**: Turborepoは「入力が変わらなければキャッシュから出す」のが基本だが、`convex dev`は常に動的にバックエンドを同期し続ける。

**対策**: `turbo.json`で`dev`タスクに`cache: false`を指定。

```json
{
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

**特に重要な設定**:
- `packages/backend`の`dev`タスク（`convex dev`）は`cache: false`を指定
- `persistent: true`で常時実行されることを明示

### 4. 型定義の共有 ✅ **必須**

**問題**: React Native側で`useQuery(api.myFunction)`と書く際、Convex側の型定義を参照する必要がある。

**解決策**: `packages/backend/package.json`の`exports`フィールドで型定義をエクスポート。

**`packages/backend/package.json`**:
```json
{
  "name": "@repo/backend",
  "exports": {
    "./convex/_generated/api": "./convex/_generated/api.d.ts",
    "./convex/_generated/api.d.ts": "./convex/_generated/api.d.ts"
  }
}
```

**使用例**:
```typescript
// apps/expo/app/home.tsx
import { api } from "@repo/backend/convex/_generated/api";
import { useQuery } from "convex/react";

const pets = useQuery(api.pets.getPetsByOwner); // 型安全！
```

## ディレクトリ構成

```
animal-app/
├── apps/
│   ├── expo/          # React Native Expo アプリ
│   ├── admin/         # Next.js 管理画面
│   └── www/           # Next.js 公式サイト
├── packages/
│   ├── backend/       # Convexバックエンド（独立パッケージ）✅
│   │   ├── convex/    # スキーマ、関数、AIアクション
│   │   │   ├── schema.ts
│   │   │   ├── pets.ts
│   │   │   └── _generated/
│   │   │       └── api.d.ts  # 自動生成された型定義
│   │   ├── convex.json
│   │   └── package.json
│   ├── ui/            # 共通UIコンポーネント
│   ├── utils/         # 共通ロジック
│   └── tsconfig/      # TypeScript共通設定
├── turbo.json         # Turborepo設定 ✅
├── pnpm-workspace.yaml # pnpmワークスペース設定 ✅
└── .mise.toml         # mise設定
```

## 設定ファイル

### `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**", ".expo/**"]
    }
  }
}
```

**重要な設定**:
- `dev`タスクに`cache: false`を指定（`convex dev`のキャッシュ対策）
- `persistent: true`で常時実行を明示

### `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

**重要な設定**:
- `packages/backend/`を独立したワークスペースとして定義
- 依存関係の競合を防ぐ

### `packages/backend/convex.json`

```json
{
  "functions": "convex/",
  "generateCommonJSApi": false,
  "node": {
    "externalPackages": []
  }
}
```

**重要な設定**:
- `functions`: Convex関数のディレクトリ
- `generateCommonJSApi`: false（ES modulesを使用）

### `packages/backend/package.json`

```json
{
  "name": "@repo/backend",
  "version": "1.0.0",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "convex dev",
    "deploy": "convex deploy",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "convex": "^1.15.0"
  },
  "devDependencies": {
    "@types/node": "^20.18.0",
    "typescript": "^5.6.0"
  },
  "exports": {
    "./convex/_generated/api": "./convex/_generated/api.d.ts",
    "./convex/_generated/api.d.ts": "./convex/_generated/api.d.ts"
  }
}
```

**重要な設定**:
- `exports`フィールドで型定義をエクスポート
- Convex専用の依存関係のみを管理

## 開発ワークフロー

### 開発環境の起動

```bash
# すべてのパッケージを起動
pnpm turbo dev

# または
pnpm dev
```

**実行されるサービス**:
- `apps/expo`: Expo開発サーバー
- `packages/backend`: Convex開発サーバー（`convex dev`）
- `packages/ui`: TypeScriptのwatchモード（型チェック）

### Convex関数の開発

```bash
# packages/backendでConvex関数を開発
cd packages/backend
mise exec -- convex dev
```

**注意**: `convex dev`は常時実行されるため、Turborepoのキャッシュは無効化されています。

### 型定義の生成

Convex関数を変更すると、`packages/backend/convex/_generated/api.d.ts`が自動生成されます。

```bash
# Convex関数を変更
# → 自動的に型定義が生成される

# apps/expoから型安全に使用
import { api } from "@repo/backend/convex/_generated/api";
```

## トラブルシューティング

### Convexの型定義が認識されない

**原因**: `packages/backend/package.json`の`exports`フィールドが設定されていない

**解決方法**:
1. `packages/backend/package.json`に`exports`フィールドを追加
2. `pnpm install`を実行
3. TypeScriptサーバーを再起動

### `convex dev`がキャッシュされる

**原因**: `turbo.json`で`dev`タスクに`cache: false`が設定されていない

**解決方法**:
1. `turbo.json`の`dev`タスクに`cache: false`を追加
2. Turborepoのキャッシュをクリア: `pnpm turbo clean`

### 依存関係の競合

**原因**: `packages/backend/`と`apps/expo/`で同じパッケージの異なるバージョンを使用している

**解決方法**:
1. `pnpm-workspace.yaml`でワークスペース設定を確認
2. `packages/backend/package.json`でConvex専用の依存関係のみを管理
3. `apps/expo/package.json`でReact Native専用の依存関係を管理

## 参考資料

- [DESIGN_REVIEW_MISE_CONVEX_TURBOREPO.md](../../DESIGN_REVIEW_MISE_CONVEX_TURBOREPO.md): 設計レビュー結果
- [.cursor/rules/PROJECT.md](./PROJECT.md): プロジェクトルール
- [.cursor/skills/package-structure/SKILL.md](../skills/package-structure/SKILL.md): パッケージ構造スキル
- [.cursor/skills/convex-patterns/SKILL.md](../skills/convex-patterns/SKILL.md): Convex開発パターン

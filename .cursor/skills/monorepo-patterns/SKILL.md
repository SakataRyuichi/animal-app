---
name: monorepo-patterns
description: Turborepoモノレポでの作業パターン
---

# モノレポパターンスキル

Turborepo + pnpmモノレポでの作業パターンを提供します。

## パッケージの特定

作業対象のパッケージを特定する方法：

- `apps/expo/`: React Native Expoアプリ
- `apps/admin/`: Next.js管理画面（ローカルのみ）
- `packages/backend/`: Convexバックエンド（独立パッケージ）✅ **重要**
- `packages/ui/`: 共通UIコンポーネント（Tamagui）
- `packages/utils/`: 共通ロジック（ビジネスロジック）
- `packages/tsconfig/`: TypeScript共通設定

## コマンド実行パターン

### 特定パッケージのみ実行

```bash
pnpm --filter expo dev
pnpm --filter admin build
pnpm --filter backend dev  # Convexバックエンド
pnpm --filter ui test
```

### 依存関係のあるパッケージも含めて実行

```bash
pnpm --filter expo... dev  # expoとその依存パッケージ（backend, ui, utils等）
pnpm --filter admin... dev  # adminとその依存パッケージ
```

### 全パッケージ実行

```bash
pnpm dev  # Turborepo経由で全パッケージを起動
pnpm build  # 全パッケージをビルド
```

## 共有パッケージの活用

### 新しい共有ユーティリティの追加

1. `packages/utils/src/`に新しい関数を追加
2. `packages/utils/src/index.ts`からエクスポート
3. 使用するパッケージで`import { functionName } from '@repo/utils'`

**重要**: ビジネスロジック（ペットの年齢計算、体重増減のアラートなど）は`packages/utils/`に集約し、モバイルアプリと管理画面で計算結果がズレないようにする

### 新しい共有コンポーネントの追加

1. `packages/ui/src/`に新しいコンポーネントを追加
2. Tamaguiのパターンに従う
3. `packages/ui/src/index.ts`からエクスポート
4. 使用するパッケージで`import { ComponentName } from '@repo/ui'`

## Turborepoキャッシュ

Turborepoは自動的にビルド結果をキャッシュします：

- `turbo.json`でキャッシュ設定を確認
- 変更がないパッケージは再ビルドされない
- CI/CDでもキャッシュが活用される

## 使用例

新しい共有ユーティリティ関数を追加する場合：

```
packages/utils/src/に新しいユーティリティ関数を追加してください。
関数名は calculatePetAge で、ペットの生年月日から現在の年齢を計算する関数です。
モバイルアプリと管理画面の両方で使用するため、packages/utilsに配置してください。
```

Convex関数を追加する場合：

```
packages/backend/convex/に新しいQuery関数を追加してください。
関数名は getPetsByOwner で、ownerIdでペットを検索します。
apps/expoとapps/adminの両方から型安全に呼び出せるようにしてください。
```

特定のパッケージのテストを実行する場合：

```
apps/expoのテストを実行してください。
```

---
name: package-structure
description: 2026年版モノレポ構成のパッケージ構造と依存関係
---

# パッケージ構造スキル

2026年版のベストプラクティスに基づいた、Turborepo + pnpmモノレポの理想的な構成を提供します。

## ディレクトリ構成

```
my-pet-platform/
├── apps/
│   ├── expo/                # モバイルアプリ (React Native Expo)
│   │   ├── app/             # Expo Router (画面定義)
│   │   └── components/      # アプリ専用UI
│   ├── admin/               # ローカル専用管理画面 (Next.js)
│   │   ├── app/             # App Router
│   │   └── components/      # 管理画面専用UI
│   └── www/                 # 公式サイト (Next.js + Vercel) ✅ **2026年追加**
│       ├── app/             # App Router
│       └── components/      # 公式サイト専用UI
├── packages/
│   ├── backend/             # バックエンド (Convex) - 独立パッケージ ✅
│   │   ├── convex/          # スキーマ、関数、AIアクション
│   │   └── package.json
│   ├── ui/                  # 共通UIコンポーネント (Tamagui)
│   ├── utils/               # 共通ロジック (ビジネスロジック)
│   ├── tsconfig/            # TypeScript共通設定
│   └── policy/              # 法務ドキュメント (Markdown形式) ✅ **2026年追加**
├── package.json             # ルートの依存関係・ワークスペース定義
├── turbo.json               # Turborepoのタスクパイプライン設定
└── pnpm-workspace.yaml      # pnpmのモノレポ定義
```

## 重要な4つのポイント

### 1. `packages/backend` を独立させる ✅ **最重要**

**理由**: `apps/expo`と`apps/admin`の両方から、全く同じバックエンド関数（`api.pets.get`など）を**型安全に**呼び出すため。

**実装**:
```typescript
// apps/expo/app/home.tsx
import { api } from "@repo/backend/convex/_generated/api";

// apps/admin/app/page.tsx
import { api } from "@repo/backend/convex/_generated/api";
```

**メリット**:
- 型安全性が保証される
- バックエンドの変更が両方のアプリに自動反映される
- コードの重複を防げる

### 2. `packages/ui` でスタイルを共通化

Tamaguiを使えば、1つのコンポーネントを`apps/expo`（ネイティブ）と`apps/admin`（Web）の両方で最適にレンダリングできます。

**実装**:
```typescript
// packages/ui/src/PetCard.tsx
import { Card, Text } from "tamagui";

export function PetCard({ pet }) {
  return (
    <Card>
      <Text>{pet.name}</Text>
    </Card>
  );
}
```

**使用**:
```typescript
// apps/expo/app/home.tsx または apps/admin/app/page.tsx
import { PetCard } from "@repo/ui";
```

### 3. `packages/utils` にビジネスロジックを集約

「ペットの生年月日から現在の年齢を算出する」「体重の増減からアラートを出す」といったロジックをここに書きます。

**理由**: モバイルアプリと管理画面で計算結果がズレるという、アプリ開発でよくある事故を防ぐため。

**実装**:
```typescript
// packages/utils/src/pet.ts
export function calculatePetAge(birthDate: Date): number {
  // ビジネスロジック
  return Math.floor((Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
}
```

**使用**:
```typescript
// apps/expo/app/pet/[id].tsx または apps/admin/app/pet/[id]/page.tsx
import { calculatePetAge } from "@repo/utils";
```

### 4. `turbo.json` による爆速開発

バックエンドの型が変わったら、それに依存しているアプリも自動で再ビルドする依存関係をTurborepoが管理します。

## パッケージ間の依存関係

```
apps/expo
  ├── @repo/backend (Convex関数)
  ├── @repo/ui (UIコンポーネント)
  └── @repo/utils (ビジネスロジック)

apps/admin
  ├── @repo/backend (Convex関数)
  ├── @repo/ui (UIコンポーネント)
  └── @repo/utils (ビジネスロジック)

apps/www ✅ **2026年追加**
  ├── @repo/backend (Convex関数: news, legal_documents)
  ├── @repo/ui (UIコンポーネント)
  ├── @repo/utils (ビジネスロジック)
  └── @repo/policy (法務ドキュメント: Markdown形式)

packages/backend
  └── (外部依存のみ: Convex, OpenAI等)

packages/ui
  └── (外部依存のみ: Tamagui等)

packages/utils
  └── (外部依存なし、純粋なロジック)

packages/policy ✅ **2026年追加**
  └── (外部依存なし、Markdownファイルのみ)
```

## 使用例

新しいConvex関数を追加する場合：

```
packages/backend/convex/pets.tsに新しいQuery関数を追加してください。
関数名は getPetsByOwner で、ownerIdでペットを検索します。
apps/expoとapps/adminの両方から型安全に呼び出せるようにしてください。
```

共通UIコンポーネントを追加する場合：

```
packages/ui/src/に新しいコンポーネントを追加してください。
コンポーネント名は PetCard で、ペット情報をカード形式で表示します。
Tamaguiを使用し、apps/expoとapps/adminの両方で使用できるようにしてください。
```

ビジネスロジックを追加する場合：

```
packages/utils/src/に新しい関数を追加してください。
関数名は calculatePetAge で、ペットの生年月日から現在の年齢を計算します。
モバイルアプリと管理画面の両方で使用するため、packages/utilsに配置してください。
```

## 注意事項

- **バックエンドは独立パッケージ**: `packages/backend/`に配置し、アプリから依存する
- **UIは共通化**: `packages/ui/`にTamaguiコンポーネントを配置し、アプリと公式サイトで一貫したデザインを実現
- **ロジックは集約**: `packages/utils/`にビジネスロジックを集約
- **法務ドキュメントは一元管理**: `packages/policy/`にMarkdown形式で配置し、アプリと公式サイトの両方から参照 ✅ **2026年追加**
- **型安全性**: Convexの型定義は`@repo/backend/convex/_generated/api`から自動生成される
- **公式サイトの特徴**: `apps/www/`はSEO・LLM最適化を重視し、Convexの`news`と`legal_documents`テーブルを活用 ✅ **2026年追加**

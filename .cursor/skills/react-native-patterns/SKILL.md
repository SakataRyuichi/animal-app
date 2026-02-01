---
name: react-native-patterns
description: React Native Expoでの開発パターン
---

# React Native Expoパターンスキル

React Native Expoアプリでの開発パターンを提供します。

## コンポーネント構造

### Tamaguiコンポーネントの使用

```typescript
// apps/expo/components/Button.tsx
import { Button, Text } from "@repo/ui"; // 共有UIパッケージから
import { styled } from "tamagui";

export const CustomButton = styled(Button, {
  backgroundColor: "$blue10",
  borderRadius: 8,
  padding: 12,
});
```

### Expo Routerでの画面作成

```typescript
// apps/expo/app/(tabs)/home.tsx
import { View, Text } from "tamagui";
import { useQuery } from "convex/react";
import { api } from "@repo/backend/convex/_generated/api"; // バックエンドパッケージから

export default function HomeScreen() {
  const pets = useQuery(api.pets.getPetsByOwner);
  
  return (
    <View>
      <Text>ペット一覧</Text>
      {/* ... */}
    </View>
  );
}
```

## 状態管理

### Convex（サーバー状態）

```typescript
import { useQuery } from "convex/react";
import { api } from "@repo/backend/convex/_generated/api"; // バックエンドパッケージから

const pets = useQuery(api.pets.getPetsByOwner);
```

### Zustand（クライアント状態）

```typescript
import { create } from "zustand";

interface UIStore {
  selectedTab: "home" | "profile";
  setSelectedTab: (tab: "home" | "profile") => void;
}

export const useUIStore = create<UIStore>((set) => ({
  selectedTab: "home",
  setSelectedTab: (tab) => set({ selectedTab: tab }),
}));
```

## フォーム処理

React Hook Formを使用：

```typescript
import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { api } from "@repo/backend/convex/_generated/api"; // バックエンドパッケージから

export function PetForm() {
  const createPet = useMutation(api.pets.createPet);
  const { register, handleSubmit } = useForm();
  
  const onSubmit = async (data) => {
    await createPet(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* ... */}
    </form>
  );
}
```

## 関数型プログラミング

副作用を最小限にし、純粋関数を優先：

```typescript
// ✅ Good: 純粋関数
const formatDate = (date: Date): string => {
  return date.toLocaleDateString("ja-JP");
};

// ❌ Bad: 副作用がある
const updateGlobalState = () => {
  globalState.value = "updated"; // 副作用
};
```

## 使用例

新しい画面を作成する場合：

```
apps/expo/app/(tabs)/に新しい画面を作成してください。
画面名は profile で、ユーザープロフィールを表示します。
Convexの useQuery を使用してユーザー情報を取得してください。
@repo/backend から型安全にAPIをインポートしてください。
```

新しいコンポーネントを作成する場合：

```
apps/expo/components/に新しいコンポーネントを作成してください。
コンポーネント名は PetCard で、ペット情報をカード形式で表示します。
Tamaguiコンポーネントは @repo/ui からインポートしてください。
```

**重要**: 
- Convex関数は`@repo/backend/convex/_generated/api`からインポート
- UIコンポーネントは`@repo/ui`からインポート
- ビジネスロジックは`@repo/utils`からインポート

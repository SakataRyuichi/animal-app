# @repo/utils

共通のビジネスロジックを集約するパッケージです。

## 目的

モバイルアプリ（`apps/expo`）と管理画面（`apps/admin`）で計算結果がズレることを防ぐため、ビジネスロジックをこのパッケージに集約します。

## 提供機能

### ペットの年齢計算 (`petAge.ts`)

ペットの実年齢と人間換算年齢を計算します。

ペットの実年齢と人間換算年齢を計算します。

#### 基本的な使い方

```typescript
import { calculatePetAgeInfo, formatPetAgeDisplay } from "@repo/utils/petAge";

// ペットの年齢情報を計算
const pet = {
  birthDate: Date.now() - 2 * 365.25 * 24 * 60 * 60 * 1000, // 2年前の誕生日
  species: "Dog",
};

const ageInfo = calculatePetAgeInfo(pet.birthDate, pet.species);

if (ageInfo) {
  console.log(formatPetAgeDisplay(ageInfo));
  // 出力: "2歳（人間換算: 約24歳）"
  
  console.log(ageInfo.ageInYears); // 2
  console.log(ageInfo.ageInMonths); // 24
  console.log(ageInfo.humanAgeInYears); // 24
  console.log(ageInfo.humanAgeDescription); // "約24歳"
}
```

#### 種別ごとの人間換算年齢

- **犬・猫**: 1年目=15歳、2年目=+9歳、3年目以降=+4歳/年
- **爬虫類**: 1年目=10歳、2年目以降=+3歳/年
- **鳥類**: 1年目=12歳、2年目以降=+5歳/年
- **うさぎ・ハムスター**: 1年目=18歳、2年目以降=+8歳/年
- **その他**: 犬・猫と同じ換算を使用

#### 関数一覧

- `calculatePetAgeInfo(birthDate, species, currentDate?)`: 年齢情報を計算
- `formatPetAgeDisplay(ageInfo)`: 表示用文字列を生成
- `calculateDogCatHumanAge(ageInYears)`: 犬・猫の人間換算年齢を計算
- `calculateReptileHumanAge(ageInYears)`: 爬虫類の人間換算年齢を計算
- `calculateBirdHumanAge(ageInYears)`: 鳥類の人間換算年齢を計算
- `calculateSmallMammalHumanAge(ageInYears)`: 小型哺乳類の人間換算年齢を計算
- `getDaysSinceBirth(birthDate, currentDate?)`: 誕生日から経過日数を計算

## 使用例

### React Native (Expo)

```typescript
// apps/expo/app/pet/[id].tsx
import { useQuery } from "convex/react";
import { api } from "@repo/backend/convex/_generated/api";
import { calculatePetAgeInfo, formatPetAgeDisplay } from "@repo/utils/petAge";

export default function PetDetailScreen({ petId }: { petId: Id<"pets"> }) {
  const pet = useQuery(api.pets.getById, { petId });
  
  if (!pet) return null;
  
  const ageInfo = pet.birthDate 
    ? calculatePetAgeInfo(pet.birthDate, pet.species)
    : null;
  
  return (
    <View>
      <Text>{pet.name}</Text>
      {ageInfo ? (
        <Text>{formatPetAgeDisplay(ageInfo)}</Text>
      ) : (
        <Text>年齢不明</Text>
      )}
    </View>
  );
}
```

### Next.js (管理画面)

```typescript
// apps/admin/app/pet/[id]/page.tsx
import { calculatePetAgeInfo, formatPetAgeDisplay } from "@repo/utils/petAge";

export default async function PetDetailPage({ params }: { params: { id: string } }) {
  const pet = await getPetById(params.id);
  
  const ageInfo = pet.birthDate 
    ? calculatePetAgeInfo(pet.birthDate, pet.species)
    : null;
  
  return (
    <div>
      <h1>{pet.name}</h1>
      {ageInfo ? (
        <p>{formatPetAgeDisplay(ageInfo)}</p>
      ) : (
        <p>年齢不明</p>
      )}
    </div>
  );
}
```

### Convex Query

```typescript
// packages/backend/convex/pets.ts
import { query } from "./_generated/server";
import { calculatePetAgeInfo, formatPetAgeDisplay } from "@repo/utils/petAge";

export const getById = query({
  args: { petId: v.id("pets") },
  handler: async (ctx, args) => {
    const pet = await ctx.db.get(args.petId);
    if (!pet) return null;
    
    const ageInfo = pet.birthDate 
      ? calculatePetAgeInfo(pet.birthDate, pet.species)
      : null;
    
    return {
      ...pet,
      ageInfo, // 年齢情報を含める
      ageDisplay: ageInfo ? formatPetAgeDisplay(ageInfo) : "年齢不明",
    };
  },
});
```

### ペットの記念日・お祝い機能 (`petCelebrations.ts`)

ペットのバースデー演出や成長の節目通知を実現します。

#### 基本的な使い方

```typescript
import { isBirthdayToday, calculateMilestone, formatMilestoneMessage } from "@repo/utils/petCelebrations";

// 今日が誕生日かどうかを判定
const pet = {
  birthDate: Date.now() - 2 * 365.25 * 24 * 60 * 60 * 1000, // 2年前の誕生日
  name: "ポチ",
};

if (isBirthdayToday(pet.birthDate)) {
  // バースデー演出を表示
  showBirthdayAnimation();
}

// 記念日を計算
const milestone = calculateMilestone(pet.birthDate);
if (milestone) {
  const message = formatMilestoneMessage(milestone, pet.name);
  console.log(message);
  // 出力例: "ポチくん、お誕生日おめでとうございます！🎉"
  // または: "ポチくんがうちに来てから1年が経ちました！お疲れ様です✨"
}
```

#### 記念日の種類

- `birthday`: 誕生日
- `anniversary_1month`: 1ヶ月記念日
- `anniversary_3months`: 3ヶ月記念日
- `anniversary_6months`: 6ヶ月記念日
- `anniversary_1year`: 1年記念日
- `anniversary_multiple_years`: 複数年記念日（2年、3年、5年、10年など）

#### 関数一覧

- `isBirthdayToday(birthDate, currentDate?)`: 今日が誕生日かどうかを判定
- `calculateMilestone(birthDate, currentDate?)`: 記念日を計算
- `formatMilestoneMessage(milestone, petName)`: 記念日の通知メッセージを生成

## 参考ドキュメント

- `USER_STORIES.md`: 
  - US-005-1（ペットの年齢表示）
  - US-005-2（バースデー演出）
  - US-005-3（成長の節目通知）
  - US-055（プレミアム解除理由の収集）
  - US-056（退会理由の収集）
  - US-057（虹の橋を渡る - メモリアルモードへの移行）✅ **非常にセンシティブな項目**
  - US-058（思い出のアルバム作成・エクスポート）✅ **非常にセンシティブな項目**
  - US-059（メモリアルモードでの振り返り）✅ **非常にセンシティブな項目**
- `CONVEX_SCHEMA.md`: スキーマ定義（`pets.birthDate`, `pets.memorialStatus`, `premium_cancellation_reasons`, `account_deletion_reasons`）
- `DESIGN_DOCUMENT.md`: 設計ドキュメント

## 注意事項

### メモリアル機能について

メモリアル機能（US-057, US-058, US-059）は**非常にセンシティブな項目**です。実装時は以下の点に注意してください：

1. **温かみのある表現**: 「削除」ではなく「虹の橋を渡る」という優しい表現を使用
2. **思い出の保護**: 「記録の封印」ではなく「思い出の保護」という観点で設計
3. **ユーザーの感情に配慮**: ユーザーが最も辛い時に事務的なチェックボックスを見たくないという配慮
4. **いつでも会える場所**: ペットが亡くなった後は、「記録する場所」から「いつでも会える場所」へと役割を変える

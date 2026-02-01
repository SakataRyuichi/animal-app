/**
 * ペットの年齢計算ユーティリティ
 * 
 * 種別ごとの人間換算年齢を計算します。
 * このロジックは`packages/utils`に集約することで、
 * モバイルアプリと管理画面で計算結果がズレることを防ぎます。
 */

/**
 * ペットの種別
 */
export type PetSpecies = "Dog" | "Cat" | "Reptile" | "Bird" | "Rabbit" | "Hamster" | "Other";

/**
 * 年齢情報
 */
export interface PetAgeInfo {
  /** 実年齢（年） */
  ageInYears: number;
  /** 実年齢（月） */
  ageInMonths: number;
  /** 実年齢（日） */
  ageInDays: number;
  /** 人間換算年齢（年） */
  humanAgeInYears: number;
  /** 人間換算年齢の説明（例: "約15歳"） */
  humanAgeDescription: string;
}

/**
 * 誕生日から経過日数を計算
 * 
 * @param birthDate 誕生日（Unixタイムスタンプ）
 * @param currentDate 現在日時（Unixタイムスタンプ、デフォルトは現在時刻）
 * @returns 経過日数
 */
export function getDaysSinceBirth(
  birthDate: number,
  currentDate: number = Date.now()
): number {
  const diffMs = currentDate - birthDate;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * 誕生日から実年齢を計算
 * 
 * @param birthDate 誕生日（Unixタイムスタンプ）
 * @param currentDate 現在日時（Unixタイムスタンプ、デフォルトは現在時刻）
 * @param deceasedDate 命日（Unixタイムスタンプ、オプション）。設定されている場合、この日で年齢計算を停止
 * @returns 年齢情報
 */
export function calculatePetAge(
  birthDate: number | undefined,
  currentDate: number = Date.now(),
  deceasedDate?: number
): PetAgeInfo | null {
  if (!birthDate) {
    return null;
  }

  // 命日が設定されている場合、その日で年齢計算を停止
  const calculationDate = deceasedDate && deceasedDate < currentDate 
    ? deceasedDate 
    : currentDate;

  const daysSinceBirth = getDaysSinceBirth(birthDate, calculationDate);
  
  if (daysSinceBirth < 0) {
    // 未来の日付の場合はnullを返す
    return null;
  }

  const ageInYears = Math.floor(daysSinceBirth / 365.25);
  const ageInMonths = Math.floor(daysSinceBirth / 30.44); // 平均的な月の日数
  const ageInDays = daysSinceBirth;

  return {
    ageInYears,
    ageInMonths,
    ageInDays,
    humanAgeInYears: 0, // 種別が分からない場合は0
    humanAgeDescription: "不明",
  };
}

/**
 * 犬・猫の人間換算年齢を計算
 * 
 * 換算式:
 * - 1年目: 15歳
 * - 2年目: +9歳（合計24歳）
 * - 3年目以降: 1年につき+4歳
 * 
 * @param ageInYears 実年齢（年）
 * @returns 人間換算年齢（年）
 */
export function calculateDogCatHumanAge(ageInYears: number): number {
  if (ageInYears <= 0) {
    return 0;
  }
  
  if (ageInYears === 1) {
    return 15;
  }
  
  if (ageInYears === 2) {
    return 24;
  }
  
  // 3年目以降: 24 + (ageInYears - 2) * 4
  return 24 + (ageInYears - 2) * 4;
}

/**
 * 爬虫類の人間換算年齢を計算
 * 
 * 爬虫類は成長が遅く、寿命も長いため、より緩やかな換算を使用します。
 * 換算式:
 * - 1年目: 10歳
 * - 2年目以降: 1年につき+3歳
 * 
 * @param ageInYears 実年齢（年）
 * @returns 人間換算年齢（年）
 */
export function calculateReptileHumanAge(ageInYears: number): number {
  if (ageInYears <= 0) {
    return 0;
  }
  
  if (ageInYears === 1) {
    return 10;
  }
  
  // 2年目以降: 10 + (ageInYears - 1) * 3
  return 10 + (ageInYears - 1) * 3;
}

/**
 * 鳥類の人間換算年齢を計算
 * 
 * 換算式:
 * - 1年目: 12歳
 * - 2年目以降: 1年につき+5歳
 * 
 * @param ageInYears 実年齢（年）
 * @returns 人間換算年齢（年）
 */
export function calculateBirdHumanAge(ageInYears: number): number {
  if (ageInYears <= 0) {
    return 0;
  }
  
  if (ageInYears === 1) {
    return 12;
  }
  
  // 2年目以降: 12 + (ageInYears - 1) * 5
  return 12 + (ageInYears - 1) * 5;
}

/**
 * うさぎ・ハムスターなどの小型哺乳類の人間換算年齢を計算
 * 
 * 換算式:
 * - 1年目: 18歳
 * - 2年目以降: 1年につき+8歳
 * 
 * @param ageInYears 実年齢（年）
 * @returns 人間換算年齢（年）
 */
export function calculateSmallMammalHumanAge(ageInYears: number): number {
  if (ageInYears <= 0) {
    return 0;
  }
  
  if (ageInYears === 1) {
    return 18;
  }
  
  // 2年目以降: 18 + (ageInYears - 1) * 8
  return 18 + (ageInYears - 1) * 8;
}

/**
 * 種別に応じた人間換算年齢を計算
 * 
 * @param species ペットの種別
 * @param ageInYears 実年齢（年）
 * @returns 人間換算年齢（年）
 */
export function calculateHumanAgeBySpecies(
  species: PetSpecies | string,
  ageInYears: number
): number {
  switch (species) {
    case "Dog":
    case "Cat":
      return calculateDogCatHumanAge(ageInYears);
    
    case "Reptile":
      return calculateReptileHumanAge(ageInYears);
    
    case "Bird":
      return calculateBirdHumanAge(ageInYears);
    
    case "Rabbit":
    case "Hamster":
      return calculateSmallMammalHumanAge(ageInYears);
    
    default:
      // その他の種別は、犬・猫と同じ換算を使用
      return calculateDogCatHumanAge(ageInYears);
  }
}

/**
 * 人間換算年齢の説明文を生成
 * 
 * @param humanAgeInYears 人間換算年齢（年）
 * @returns 説明文（例: "約15歳"）
 */
export function formatHumanAgeDescription(humanAgeInYears: number): string {
  if (humanAgeInYears === 0) {
    return "0歳";
  }
  
  // 1歳未満の場合は月齢で表示
  if (humanAgeInYears < 1) {
    const months = Math.floor(humanAgeInYears * 12);
    return `${months}ヶ月`;
  }
  
  return `約${Math.floor(humanAgeInYears)}歳`;
}

/**
 * ペットの年齢情報を計算（実年齢と人間換算年齢を含む）
 * 
 * @param birthDate 誕生日（Unixタイムスタンプ）
 * @param species ペットの種別
 * @param currentDate 現在日時（Unixタイムスタンプ、デフォルトは現在時刻）
 * @param deceasedDate 命日（Unixタイムスタンプ、オプション）。設定されている場合、この日で年齢計算を停止
 * @returns 年齢情報、またはnull（誕生日が未設定の場合）
 */
export function calculatePetAgeInfo(
  birthDate: number | undefined,
  species: PetSpecies | string,
  currentDate: number = Date.now(),
  deceasedDate?: number
): PetAgeInfo | null {
  const ageInfo = calculatePetAge(birthDate, currentDate, deceasedDate);
  
  if (!ageInfo) {
    return null;
  }

  const humanAgeInYears = calculateHumanAgeBySpecies(species, ageInfo.ageInYears);
  const humanAgeDescription = formatHumanAgeDescription(humanAgeInYears);

  return {
    ...ageInfo,
    humanAgeInYears,
    humanAgeDescription,
  };
}

/**
 * 年齢の表示用文字列を生成
 * 
 * @param ageInfo 年齢情報
 * @param isMemorial メモリアルモード（虹の橋を渡った）かどうか
 * @returns 表示用文字列（例: "2歳3ヶ月（人間換算: 約24歳）" または "14歳5ヶ月でお空へ"）
 */
export function formatPetAgeDisplay(ageInfo: PetAgeInfo, isMemorial: boolean = false): string {
  const { ageInYears, ageInMonths, humanAgeDescription } = ageInfo;
  
  let ageString: string;
  
  if (ageInYears === 0) {
    if (ageInMonths === 0) {
      ageString = `${ageInfo.ageInDays}日`;
    } else {
      ageString = `${ageInMonths}ヶ月`;
    }
  } else {
    const remainingMonths = ageInMonths % 12;
    if (remainingMonths === 0) {
      ageString = `${ageInYears}歳`;
    } else {
      ageString = `${ageInYears}歳${remainingMonths}ヶ月`;
    }
  }
  
  if (isMemorial) {
    return `${ageString}でお空へ`;
  }
  
  return `${ageString}（人間換算: ${humanAgeDescription}）`;
}

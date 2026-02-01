/**
 * ペットの記念日・お祝い機能のユーティリティ
 * 
 * バースデー演出や成長の節目通知を実現するためのヘルパー関数です。
 */

import { getDaysSinceBirth } from "./petAge";

/**
 * 今日がペットの誕生日かどうかを判定
 * 
 * @param birthDate 誕生日（Unixタイムスタンプ）
 * @param currentDate 現在日時（Unixタイムスタンプ、デフォルトは現在時刻）
 * @returns 今日が誕生日の場合true
 */
export function isBirthdayToday(
  birthDate: number,
  currentDate: number = Date.now()
): boolean {
  const birth = new Date(birthDate);
  const today = new Date(currentDate);
  
  return birth.getMonth() === today.getMonth() && 
         birth.getDate() === today.getDate();
}

/**
 * ペットが迎えた記念日を計算
 * 
 * @param birthDate 誕生日（Unixタイムスタンプ）
 * @param currentDate 現在日時（Unixタイムスタンプ、デフォルトは現在時刻）
 * @returns 記念日の情報、またはnull（記念日でない場合）
 */
export interface MilestoneInfo {
  /** 記念日の種類 */
  type: "birthday" | "anniversary_1month" | "anniversary_3months" | "anniversary_6months" | "anniversary_1year" | "anniversary_multiple_years";
  /** 記念日のメッセージ */
  message: string;
  /** 記念日の数値（例: 1年目なら1） */
  value: number;
}

export function calculateMilestone(
  birthDate: number,
  currentDate: number = Date.now()
): MilestoneInfo | null {
  const daysSinceBirth = getDaysSinceBirth(birthDate, currentDate);
  
  if (daysSinceBirth < 0) {
    return null;
  }

  // 誕生日かどうか
  if (isBirthdayToday(birthDate, currentDate)) {
    const years = Math.floor(daysSinceBirth / 365.25);
    if (years === 0) {
      return {
        type: "birthday",
        message: "お誕生日おめでとうございます！",
        value: 0,
      };
    } else {
      return {
        type: "anniversary_multiple_years",
        message: `${years}歳のお誕生日おめでとうございます！`,
        value: years,
      };
    }
  }

  // 1ヶ月記念日
  if (daysSinceBirth === 30) {
    return {
      type: "anniversary_1month",
      message: "うちに来てから1ヶ月が経ちました！",
      value: 1,
    };
  }

  // 3ヶ月記念日
  if (daysSinceBirth === 90) {
    return {
      type: "anniversary_3months",
      message: "うちに来てから3ヶ月が経ちました！",
      value: 3,
    };
  }

  // 6ヶ月記念日
  if (daysSinceBirth === 180) {
    return {
      type: "anniversary_6months",
      message: "うちに来てから6ヶ月が経ちました！",
      value: 6,
    };
  }

  // 1年記念日
  if (daysSinceBirth === 365) {
    return {
      type: "anniversary_1year",
      message: "うちに来てからちょうど1年が経ちました！",
      value: 1,
    };
  }

  // 複数年記念日（2年、3年、5年、10年など）
  const years = Math.floor(daysSinceBirth / 365.25);
  const daysInCurrentYear = daysSinceBirth % 365.25;
  
  // 誕生日の前後1週間以内
  if (years > 0 && Math.abs(daysInCurrentYear) <= 7) {
    return {
      type: "anniversary_multiple_years",
      message: `うちに来てから${years}年が経ちました！`,
      value: years,
    };
  }

  return null;
}

/**
 * 記念日の通知メッセージを生成
 * 
 * @param milestone 記念日の情報
 * @param petName ペットの名前
 * @returns 通知メッセージ
 */
export function formatMilestoneMessage(
  milestone: MilestoneInfo,
  petName: string
): string {
  switch (milestone.type) {
    case "birthday":
      return `${petName}くん、お誕生日おめでとうございます！🎉`;
    case "anniversary_1month":
      return `${petName}くんがうちに来てから1ヶ月が経ちました！お疲れ様です✨`;
    case "anniversary_3months":
      return `${petName}くんがうちに来てから3ヶ月が経ちました！お疲れ様です✨`;
    case "anniversary_6months":
      return `${petName}くんがうちに来てから6ヶ月が経ちました！お疲れ様です✨`;
    case "anniversary_1year":
      return `${petName}くんがうちに来てからちょうど1年が経ちました！お疲れ様です✨`;
    case "anniversary_multiple_years":
      return `${petName}くんがうちに来てから${milestone.value}年が経ちました！お疲れ様です✨`;
    default:
      return "";
  }
}

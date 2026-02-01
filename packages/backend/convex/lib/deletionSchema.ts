/**
 * 共通削除スキーマ定義
 * 
 * Convexのドキュメント指向な特性を最大限に活かした設計。
 * `isDeleted`フラグではなく、削除に関するコンテキストをまとめた`deletion`オブジェクトを使用することで、
 * 型安全性とクエリのシンプル化を実現します。
 * 
 * @example
 * ```typescript
 * import { deletionSchema } from "./lib/deletionSchema";
 * 
 * pets: defineTable({
 *   name: v.string(),
 *   // ... その他のフィールド
 *   deletion: deletionSchema,
 * })
 * ```
 */

import { v } from "convex/values";

/**
 * 削除オブジェクトのスキーマ定義
 * 
 * このオブジェクトが存在する場合、データは削除された状態です。
 * 存在しない場合（`undefined`）、データはアクティブな状態です。
 * 
 * **メリット**:
 * 1. 型安全な条件分岐: `if (pet.deletion)` で型が絞り込まれる
 * 2. クエリのシンプル化: `q.eq("deletion", undefined)` でアクティブなデータのみ取得
 * 3. セキュリティと監査: 誰がいつ削除したかがデータに内包される
 */
export const deletionSchema = v.optional(
  v.object({
    /**
     * 削除日時（Unixタイムスタンプ）
     */
    deletedAt: v.number(),

    /**
     * 削除したユーザーID
     * 文字列型（`v.id("users")`ではなく）にすることで、
     * ユーザーが削除された後でも履歴を保持できる
     */
    deletedBy: v.string(),

    /**
     * 削除理由（オプション）
     * 例: "誤操作", "お別れ", "データ整理"
     */
    reason: v.optional(v.string()),

    /**
     * 完全に消去される期限（Unixタイムスタンプ、オプション）
     * この日時を過ぎると、データは完全に削除される
     * デフォルト: 削除から30日後
     */
    restorableUntil: v.optional(v.number()),
  })
);

/**
 * 削除オブジェクトの型定義（TypeScript用）
 */
export type Deletion = {
  deletedAt: number;
  deletedBy: string;
  reason?: string;
  restorableUntil?: number;
};

/**
 * デフォルトの復元可能期間（30日、ミリ秒）
 */
export const DEFAULT_RESTORABLE_DAYS = 30;
export const DEFAULT_RESTORABLE_MS = DEFAULT_RESTORABLE_DAYS * 24 * 60 * 60 * 1000;

/**
 * 削除オブジェクトを作成するヘルパー関数
 * 
 * @param deletedBy 削除したユーザーID
 * @param reason 削除理由（オプション）
 * @param restorableDays 復元可能期間（日数、デフォルト: 30日）
 * @returns 削除オブジェクト
 */
export function createDeletion(
  deletedBy: string,
  reason?: string,
  restorableDays: number = DEFAULT_RESTORABLE_DAYS
): Deletion {
  const now = Date.now();
  return {
    deletedAt: now,
    deletedBy,
    reason,
    restorableUntil: now + restorableDays * 24 * 60 * 60 * 1000,
  };
}

/**
 * データが削除されているかどうかを判定
 * 
 * @param deletion 削除オブジェクト（`undefined`の可能性あり）
 * @returns 削除されている場合`true`
 */
export function isDeleted(deletion: Deletion | undefined): deletion is Deletion {
  return deletion !== undefined;
}

/**
 * データが復元可能かどうかを判定
 * 
 * @param deletion 削除オブジェクト（`undefined`の可能性あり）
 * @returns 復元可能な場合`true`
 */
export function isRestorable(deletion: Deletion | undefined): boolean {
  if (!isDeleted(deletion)) {
    return false;
  }
  
  const now = Date.now();
  const restorableUntil = deletion.restorableUntil ?? deletion.deletedAt + DEFAULT_RESTORABLE_MS;
  
  return now < restorableUntil;
}

/**
 * 残り復元可能日数を計算
 * 
 * @param deletion 削除オブジェクト（`undefined`の可能性あり）
 * @returns 残り日数（復元不可能な場合は0）
 */
export function getRemainingRestorableDays(deletion: Deletion | undefined): number {
  if (!isDeleted(deletion)) {
    return 0;
  }
  
  if (!isRestorable(deletion)) {
    return 0;
  }
  
  const now = Date.now();
  const restorableUntil = deletion.restorableUntil ?? deletion.deletedAt + DEFAULT_RESTORABLE_MS;
  const remainingMs = restorableUntil - now;
  
  return Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
}

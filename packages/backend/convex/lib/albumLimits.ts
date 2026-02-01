/**
 * アルバム制限管理ヘルパー関数
 * 
 * アルバム作成・アイテム追加時の制限を管理します。
 */

/**
 * 無料ユーザーのアルバム作成上限（個数）
 */
export const FREE_ALBUM_LIMIT = 2;

/**
 * 無料ユーザーの1アルバムあたりのアイテム上限（枚数）
 */
export const FREE_ALBUM_ITEM_LIMIT = 20;

/**
 * 無料ユーザーがアルバムを作成できるかどうかを判定
 * 
 * @param currentAlbumCount 現在のアルバム数
 * @returns 作成可能な場合true
 */
export function canCreateAlbum(currentAlbumCount: number): boolean {
  return currentAlbumCount < FREE_ALBUM_LIMIT;
}

/**
 * 無料ユーザーのアルバム作成制限に達しているかどうかを判定
 * 
 * @param currentAlbumCount 現在のアルバム数
 * @returns 制限に達している場合true
 */
export function isAlbumLimitReached(currentAlbumCount: number): boolean {
  return currentAlbumCount >= FREE_ALBUM_LIMIT;
}

/**
 * 残りのアルバム作成可能数を計算
 * 
 * @param currentAlbumCount 現在のアルバム数
 * @returns 残りの数
 */
export function getRemainingAlbumCount(currentAlbumCount: number): number {
  return Math.max(0, FREE_ALBUM_LIMIT - currentAlbumCount);
}

/**
 * 無料ユーザーがアルバムにアイテムを追加できるかどうかを判定
 * 
 * @param currentItemCount 現在のアルバム内のアイテム数
 * @param newItemCount 新規追加するアイテム数
 * @returns 追加可能な場合true
 */
export function canAddAlbumItems(
  currentItemCount: number,
  newItemCount: number
): boolean {
  return currentItemCount + newItemCount <= FREE_ALBUM_ITEM_LIMIT;
}

/**
 * 無料ユーザーのアルバムアイテム制限に達しているかどうかを判定
 * 
 * @param currentItemCount 現在のアルバム内のアイテム数
 * @returns 制限に達している場合true
 */
export function isAlbumItemLimitReached(currentItemCount: number): boolean {
  return currentItemCount >= FREE_ALBUM_ITEM_LIMIT;
}

/**
 * 残りのアルバムアイテム追加可能数を計算
 * 
 * @param currentItemCount 現在のアルバム内のアイテム数
 * @returns 残りの数
 */
export function getRemainingAlbumItemCount(currentItemCount: number): number {
  return Math.max(0, FREE_ALBUM_ITEM_LIMIT - currentItemCount);
}

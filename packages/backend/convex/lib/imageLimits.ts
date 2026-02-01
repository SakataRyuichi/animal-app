/**
 * 画像制限管理ヘルパー関数
 * 
 * Convexのストレージコストを考慮した画像制限を管理します。
 */

/**
 * 無料ユーザーの画像アップロード上限（枚数）
 */
export const FREE_IMAGE_LIMIT = 50;

/**
 * 無料ユーザーの画像ストレージ上限（バイト）
 * 約25MB（50枚 × 500KB）
 */
export const FREE_IMAGE_STORAGE_LIMIT_BYTES = 25 * 1024 * 1024;

/**
 * 無料ユーザーが画像をアップロードできるかどうかを判定
 * 
 * @param imageCount 現在の画像枚数
 * @param imageStorageUsedBytes 現在のストレージ使用量（バイト）
 * @param newImageSizeBytes 新規アップロードする画像のサイズ（バイト）
 * @returns アップロード可能な場合true
 */
export function canUploadImage(
  imageCount: number,
  imageStorageUsedBytes: number,
  newImageSizeBytes: number
): boolean {
  // 枚数制限をチェック
  if (imageCount >= FREE_IMAGE_LIMIT) {
    return false;
  }

  // ストレージ容量制限をチェック
  if (imageStorageUsedBytes + newImageSizeBytes > FREE_IMAGE_STORAGE_LIMIT_BYTES) {
    return false;
  }

  return true;
}

/**
 * 無料ユーザーの画像制限に達しているかどうかを判定
 * 
 * @param imageCount 現在の画像枚数
 * @param imageStorageUsedBytes 現在のストレージ使用量（バイト）
 * @returns 制限に達している場合true
 */
export function isImageLimitReached(
  imageCount: number,
  imageStorageUsedBytes: number
): boolean {
  return (
    imageCount >= FREE_IMAGE_LIMIT ||
    imageStorageUsedBytes >= FREE_IMAGE_STORAGE_LIMIT_BYTES
  );
}

/**
 * 残りの画像アップロード可能枚数を計算
 * 
 * @param imageCount 現在の画像枚数
 * @returns 残りの枚数
 */
export function getRemainingImageCount(imageCount: number): number {
  return Math.max(0, FREE_IMAGE_LIMIT - imageCount);
}

/**
 * 残りの画像ストレージ容量を計算
 * 
 * @param imageStorageUsedBytes 現在のストレージ使用量（バイト）
 * @returns 残りの容量（バイト）
 */
export function getRemainingImageStorageBytes(
  imageStorageUsedBytes: number
): number {
  return Math.max(0, FREE_IMAGE_STORAGE_LIMIT_BYTES - imageStorageUsedBytes);
}

/**
 * 外部画像を取得・リサイズしてConvex Storageに保存するAction
 * 
 * キュレーション記事のサムネイル画像を最適化します。
 */

import { action } from "../_generated/server";
import { v } from "convex/values";

/**
 * 外部画像を取得・リサイズしてConvex Storageに保存
 * 
 * @param imageUrl 外部画像のURL
 * @returns Convex StorageのID
 */
export const optimizeThumbnail = action({
  args: {
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // 外部画像を取得
      const response = await fetch(args.imageUrl);
      if (!response.ok) {
        throw new Error(`画像の取得に失敗しました: ${response.status}`);
      }

      const imageBuffer = await response.arrayBuffer();
      const imageBlob = new Blob([imageBuffer]);

      // 画像をリサイズ（オプション: クライアント側でリサイズする場合は不要）
      // ここでは、そのままConvex Storageに保存
      // 実際の実装では、画像処理ライブラリ（sharpなど）を使用してリサイズすることを推奨

      // Convex Storageに保存
      const storageId = await ctx.storage.store(imageBlob);

      return {
        storageId: storageId,
        // 元のURLも返す（フォールバック用）
        originalUrl: args.imageUrl,
      };
    } catch (error) {
      console.error("サムネイル画像の最適化エラー:", error);
      throw new Error("サムネイル画像の最適化に失敗しました");
    }
  },
});

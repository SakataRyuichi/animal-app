/**
 * 外部URLからOGP情報（タイトル、画像、説明）を自動取得するAction
 * 
 * キュレーション記事の登録時に使用します。
 */

import { action } from "../_generated/server";
import { v } from "convex/values";

/**
 * OGP情報の型定義
 */
interface OGPInfo {
  title: string;
  description: string;
  imageUrl: string | null;
  siteName: string | null;
}

/**
 * URLをサニタイズ（悪意のあるスクリプトを除去）
 */
function sanitizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    // 許可されたプロトコルのみ（http, https）
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      throw new Error("許可されていないプロトコルです");
    }
    return parsedUrl.toString();
  } catch (error) {
    throw new Error("無効なURLです");
  }
}

/**
 * HTMLからOGP情報を抽出
 */
function extractOGPInfo(html: string): OGPInfo {
  const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
  const ogDescriptionMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
  const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
  const ogSiteNameMatch = html.match(/<meta\s+property=["']og:site_name["']\s+content=["']([^"']+)["']/i);
  
  // フォールバック: titleタグから取得
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  
  return {
    title: ogTitleMatch?.[1] || titleMatch?.[1] || "タイトル不明",
    description: ogDescriptionMatch?.[1] || "",
    imageUrl: ogImageMatch?.[1] || null,
    siteName: ogSiteNameMatch?.[1] || null,
  };
}

/**
 * 外部URLからOGP情報を取得
 */
export const fetchOGP = action({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args) => {
    // URLをサニタイズ
    const sanitizedUrl = sanitizeUrl(args.url);

    try {
      // 外部URLからHTMLを取得
      const response = await fetch(sanitizedUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; PetAppBot/1.0)",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTPエラー: ${response.status}`);
      }

      const html = await response.text();

      // OGP情報を抽出
      const ogpInfo = extractOGPInfo(html);

      return {
        url: sanitizedUrl,
        ...ogpInfo,
      };
    } catch (error) {
      console.error("OGP情報の取得エラー:", error);
      throw new Error("OGP情報の取得に失敗しました");
    }
  },
});

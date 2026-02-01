/**
 * 権限管理ヘルパー関数
 * 
 * プレミアム機能へのアクセス制御を実装します。
 * セキュリティのため、API（Mutation/Query）レベルでプレミアムかどうかを判定します。
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

/**
 * ユーザーがプレミアム会員かどうかを判定
 * 
 * 猶予期間（gracePeriodEndsAt）も考慮します。
 * 支払い失敗後も猶予期間中はプレミアム機能を利用できます。
 * 
 * @param subscription ユーザーのサブスクリプション情報
 * @returns プレミアム会員の場合true
 */
export function isPremiumSubscription(subscription: {
  tier: "free" | "premium";
  status: "active" | "canceled" | "past_due" | "trialing";
  gracePeriodEndsAt?: number;
}): boolean {
  // 無料プランの場合はfalse
  if (subscription.tier !== "premium") {
    return false;
  }

  // アクティブまたは試用期間中はtrue
  if (subscription.status === "active" || subscription.status === "trialing") {
    return true;
  }

  // 猶予期間中（past_dueかつgracePeriodEndsAtが未来）はtrue
  if (
    subscription.status === "past_due" &&
    subscription.gracePeriodEndsAt &&
    Date.now() < subscription.gracePeriodEndsAt
  ) {
    return true;
  }

  return false;
}

/**
 * プレミアム会員であることを要求（エラーを投げる）
 * 
 * プレミアム限定のQuery/Mutationで使用します。
 * プレミアムでない場合はエラーを投げます。
 * 
 * @param ctx QueryCtxまたはMutationCtx
 * @returns ユーザー情報（プレミアム会員の場合）
 * @throws プレミアムでない場合、エラーを投げる
 */
export async function assertPremium(
  ctx: QueryCtx | MutationCtx
): Promise<{
  _id: Id<"users">;
  tokenIdentifier: string;
  name: string;
  email: string;
  subscription: {
    tier: "free" | "premium";
    status: "active" | "canceled" | "past_due" | "trialing";
    endsAt?: number;
    gracePeriodEndsAt?: number;
    revenueCatUserId?: string;
  };
}> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("認証が必要です");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .unique();

  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }

  if (!isPremiumSubscription(user.subscription)) {
    // フロントエンドで捕まえるためのエラーコード
    throw new Error("PREMIUM_REQUIRED");
  }

  return user;
}

/**
 * ユーザーがプレミアム会員かどうかを判定（エラーを投げない）
 * 
 * フロントエンドでの判定に使用します。
 * 
 * @param ctx QueryCtxまたはMutationCtx
 * @returns プレミアム会員の場合true
 */
export async function isPremiumUser(
  ctx: QueryCtx | MutationCtx
): Promise<boolean> {
  try {
    await assertPremium(ctx);
    return true;
  } catch {
    return false;
  }
}

/**
 * 現在のユーザーを取得（認証チェック付き）
 * 
 * @param ctx QueryCtxまたはMutationCtx
 * @returns ユーザー情報（認証済みの場合）
 * @throws 認証されていない場合、エラーを投げる
 */
export async function getCurrentUser(
  ctx: QueryCtx | MutationCtx
): Promise<{
  _id: Id<"users">;
  tokenIdentifier: string;
  name: string;
  email: string;
  subscription: {
    tier: "free" | "premium";
    status: "active" | "canceled" | "past_due" | "trialing";
    endsAt?: number;
    gracePeriodEndsAt?: number;
    revenueCatUserId?: string;
  };
}> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("認証が必要です");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .unique();

  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }

  return user;
}

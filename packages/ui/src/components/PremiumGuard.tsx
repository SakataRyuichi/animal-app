/**
 * PremiumGuard コンポーネント
 * 
 * プレミアム限定機能・画面へのアクセスを制御します。
 * プレミアムでない場合、アップグレード案内を表示します。
 * 
 * @example
 * ```tsx
 * <PremiumGuard>
 *   <DetailedStatsScreen />
 * </PremiumGuard>
 * ```
 */

import { useQuery } from "convex/react";
import { api } from "@repo/backend/convex/_generated/api";
import { UpgradePrompt } from "./UpgradePrompt";

interface PremiumGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * ユーザーがプレミアム会員かどうかを判定
 * 
 * 猶予期間（gracePeriodEndsAt）も考慮します。
 */
function isPremiumSubscription(subscription: {
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
 * PremiumGuard コンポーネント
 * 
 * プレミアム限定機能・画面へのアクセスを制御します。
 * プレミアムでない場合、`fallback`または`UpgradePrompt`を表示します。
 */
export function PremiumGuard({ children, fallback }: PremiumGuardProps) {
  const user = useQuery(api.users.getCurrentUser);

  // ローディング中は表示（UX向上のため）
  if (!user) {
    return <>{children}</>;
  }

  const isPremium = isPremiumSubscription(user.subscription);

  if (!isPremium) {
    // プレミアムでない場合、アップグレード案内を表示
    return <>{fallback || <UpgradePrompt />}</>;
  }

  // プレミアム会員の場合、子コンポーネントを表示
  return <>{children}</>;
}

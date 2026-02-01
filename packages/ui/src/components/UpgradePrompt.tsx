/**
 * UpgradePrompt コンポーネント
 * 
 * プレミアム機能へのアップグレードを促すコンポーネントです。
 * 温かみのあるデザインで、プレミアム機能の価値を伝えます。
 * 
 * @example
 * ```tsx
 * <UpgradePrompt />
 * ```
 */

import { YStack, XStack, Text, Button } from "@repo/ui";

interface UpgradePromptProps {
  /**
   * 表示するメッセージ（カスタマイズ可能）
   */
  message?: string;

  /**
   * プレミアム機能のリスト（カスタマイズ可能）
   */
  features?: string[];

  /**
   * アップグレードボタンのラベル（カスタマイズ可能）
   */
  buttonLabel?: string;

  /**
   * アップグレードボタンのクリックハンドラ
   */
  onUpgrade?: () => void;
}

/**
 * UpgradePrompt コンポーネント
 * 
 * プレミアム機能へのアップグレードを促すコンポーネントです。
 */
export function UpgradePrompt({
  message = "家族みんなで記録を共有するにはプレミアムへ",
  features = [
    "家族・チーム管理",
    "詳細な統計情報",
    "高度なAI相談機能",
    "データエクスポート",
  ],
  buttonLabel = "プレミアムにアップグレード",
  onUpgrade,
}: UpgradePromptProps) {
  return (
    <YStack
      padding="$4"
      gap="$4"
      backgroundColor="$background"
      borderRadius={20}
      alignItems="center"
    >
      {/* アイコンまたはイラスト */}
      <Text fontSize={48}>🔒</Text>

      {/* メッセージ */}
      <YStack gap="$2" alignItems="center">
        <Text fontSize="$6" fontWeight="bold" textAlign="center">
          {message}
        </Text>
        <Text fontSize="$4" color="$gray10" textAlign="center">
          プレミアム機能を利用すると、より充実したペット管理ができます
        </Text>
      </YStack>

      {/* プレミアム機能のリスト */}
      <YStack gap="$2" width="100%">
        {features.map((feature, index) => (
          <XStack key={index} gap="$2" alignItems="center">
            <Text fontSize={20}>✨</Text>
            <Text fontSize="$4">{feature}</Text>
          </XStack>
        ))}
      </YStack>

      {/* アップグレードボタン */}
      <Button
        onPress={onUpgrade}
        backgroundColor="$blue10"
        color="white"
        borderRadius={20}
        paddingHorizontal="$4"
        paddingVertical="$3"
      >
        <Text fontSize="$4" fontWeight="bold" color="white">
          {buttonLabel}
        </Text>
      </Button>
    </YStack>
  );
}

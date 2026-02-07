# スキーマ定義（全テーブル）

**📚 インデックス**: [CONVEX_SCHEMA_INDEX.md](../CONVEX_SCHEMA_INDEX.md)

このファイルには、全テーブルのTypeScript定義が含まれています。

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { deletionSchema } from "./lib/deletionSchema";

// 共通で使う「公開範囲」の定義
// private: 自分のみ, shared: 家族/共同管理者のみ, public: 全世界
const privacyLevel = v.union(
  v.literal("private"),
  v.literal("shared"),
  v.literal("public")
);

export default defineSchema({
  // ---------------------------------------------------------
  // 1. ユーザー (飼い主 / 事業者)
  // ---------------------------------------------------------
  users: defineTable({
    tokenIdentifier: v.string(), // Clerkなどの認証ID
    name: v.string(),
    email: v.string(),

    // ユーザー属性
    type: v.union(
      v.literal("individual"),
      v.literal("business")
    ), // 個人 or 事業者

    // サブスクリプション管理（プレミアム機能の制御）
    subscription: v.object({
      tier: v.union(
        v.literal("free"),
        v.literal("premium"),
        v.literal("memorial") // ✅ **2026年最終設計検証で追加**: 追悼（メモリアル）プラン
      ), // プラン（将来的に"family"なども追加可能）
      status: v.union(
        v.literal("active"),
        v.literal("canceled"),
        v.literal("past_due"),
        v.literal("trialing") // 試用期間中
      ), // サブスクリプションの状態
      endsAt: v.optional(v.number()), // サブスクリプションの期限（Unixタイムスタンプ）
      gracePeriodEndsAt: v.optional(v.number()), // 猶予期間の期限（支払い失敗後も機能を維持する期間）
      revenueCatUserId: v.optional(v.string()), // RevenueCatのユーザーID
      // ✅ **2026年最終設計検証で追加**: メモリアルプランの場合、プレミアム会員だった期間のデータをエクスポート可能にする
      premiumPeriodEndsAt: v.optional(v.number()), // プレミアム会員だった最後の日時
    }),

    // 画像制限管理（Convexのストレージコストを考慮）
    imageCount: v.number(), // 画像アップロードの累計枚数（無料ユーザーの制限チェック用）
    imageStorageUsedBytes: v.number(), // 使用中のストレージ容量（バイト）
    isExpert: v.optional(v.boolean()), // 認定専門家（獣医師など）かどうか
    expertInfo: v.optional(
      v.object({
        licenseNumber: v.string(), // 免許証番号
        verifiedAt: v.number(), // 認定日時
      })
    ), // 専門家情報（認定専門家の場合）

    // プロフィール情報
    location: v.optional(
      v.object({
        // 大まかな地域 (検索用)
        country: v.string(), // "JP", "US" など
        region: v.optional(v.string()), // "Tokyo", "California"
      })
    ),

    // 事業者向けフィールド
    businessInfo: v.optional(
      v.object({
        category: v.string(), // "Vet" (獣医), "Cafe", "Breeder"
        address: v.string(), // 詳細住所
        description: v.string(),
      })
    ),

    // ✅ **ゲーミフィケーション要素（2026年追加）**: ポイント、バッジ、アイテム管理
    points: v.number(), // 現在のポイント数（累計ではなく現在の残高）
    badges: v.array(v.string()), // 獲得したバッジのID（badge_definitionsテーブルのIDを参照）
    unlockedAssets: v.array(v.string()), // 購入/交換済みのフレーム・表紙・エフェクトのID（assetsテーブルのIDを参照）

    // ✅ **広告表示管理（2026年追加）**: 無料ユーザーへの広告表示制御
    adLastSeenAt: v.optional(v.number()), // 最後に広告を表示した日時（過剰な露出を防ぐため）
    adLastClickedAt: v.optional(v.number()), // 最後に広告をクリックした日時（広告の表示頻度制御用）
  }).index("by_token", ["tokenIdentifier"]),

  // ... 他のテーブル定義は各テーブルファイルを参照してください

});
```

**注意**: 完全なスキーマ定義は元の`CONVEX_SCHEMA.md`ファイルを参照してください。このファイルは概要のみです。

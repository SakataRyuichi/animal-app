# 1. users（ユーザー）

**📚 インデックス**: [CONVEX_SCHEMA_INDEX.md](../CONVEX_SCHEMA_INDEX.md)

### 1. users（ユーザー）

**目的**: アプリを利用するユーザーの情報を管理

**主要フィールド**:
- `tokenIdentifier`: Clerkの認証ID。一意性を保証
- `name`: ユーザー名
- `email`: メールアドレス
- `type`: ユーザータイプ（個人/事業者）
- `subscription`: サブスクリプション情報（プレミアム機能の制御）
  - `tier`: プラン（free/premium）
  - `status`: サブスクリプションの状態（active/canceled/past_due/trialing）
  - `endsAt`: サブスクリプションの期限
  - `gracePeriodEndsAt`: 猶予期間の期限（支払い失敗後も機能を維持する期間）
  - `revenueCatUserId`: RevenueCatのユーザーID
- `imageCount`: 画像アップロードの累計枚数（無料ユーザーの制限チェック用）
- `imageStorageUsedBytes`: 使用中のストレージ容量（バイト）
- `isExpert`: 認定専門家（獣医師など）フラグ（オプション）
- `expertInfo`: 専門家情報（免許証番号、認定日時など）（オプション）
- `location`: 地域情報（将来的な検索・マッチング機能用）
- `businessInfo`: 事業者アカウントの場合の詳細情報
- `points`: 現在のポイント数（累計ではなく現在の残高）✅ **ゲーミフィケーション要素**
- `badges`: 獲得したバッジのID配列（badge_definitionsテーブルのIDを参照）✅ **ゲーミフィケーション要素**
- `unlockedAssets`: 購入/交換済みのフレーム・表紙・エフェクトのID配列（assetsテーブルのIDを参照）✅ **ゲーミフィケーション要素**

**インデックス**:
- `by_token`: 認証IDでの高速検索

**使用例**:
```typescript
// ユーザー作成（無料プラン）
await ctx.db.insert("users", {
  tokenIdentifier: "user_xxx",
  name: "太郎",
  email: "taro@example.com",
  type: "individual",
  subscription: {
    tier: "free",
    status: "active",
  },
  imageCount: 0, // 画像アップロードの累計枚数
  imageStorageUsedBytes: 0, // 使用中のストレージ容量（バイト）
});

// プレミアム会員へのアップグレード
await ctx.db.patch(userId, {
  subscription: {
    tier: "premium",
    status: "active",
    endsAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30日後
    revenueCatUserId: "rc_user_xxx",
  },
});

// 猶予期間の設定（支払い失敗時）
await ctx.db.patch(userId, {
  subscription: {
    ...user.subscription,
    status: "past_due",
    gracePeriodEndsAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7日間の猶予期間
  },
});
```

---

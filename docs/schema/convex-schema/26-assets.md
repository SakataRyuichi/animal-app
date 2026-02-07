# 26. assets（ショップアイテム）

**📚 インデックス**: [CONVEX_SCHEMA_INDEX.md](../CONVEX_SCHEMA_INDEX.md)

### 26. assets（ショップアイテム）✅ **ゲーミフィケーション要素（2026年追加）**

**目的**: ショップで販売・交換するアイテム（フレーム、表紙、エフェクト）を管理。管理者のみが登録可能。

**主要フィールド**:
- `type`: アイテムタイプ（frame/animated_frame/cover/effect）
- `name`: アイテム名（例: "桜のフレーム"）
- `description`: アイテムの説明（オプション）
- `pointCost`: ポイントでの価格（0の場合はポイント交換不可）
- `priceJpy`: 日本円での価格（nullならポイント限定）
- `imageUrl`: プレビュー画像のURL（Convex StorageのID）
- `isAnimated`: アニメーション有無
- `isPremium`: プレミアム限定アイテムかどうか
- `isLimited`: 期間限定アイテムかどうか
- `availableFrom`: 利用可能開始日時（Unixタイムスタンプ）
- `availableUntil`: 利用可能終了日時（Unixタイムスタンプ）
- `createdBy`: 作成者（管理者）

**インデックス**:
- `by_type`: アイテムタイプでの検索
- `by_available`: 利用可能期間での検索

**使用例**:
```typescript
// ショップアイテムの作成（管理者のみ）
await ctx.db.insert("assets", {
  type: "animated_frame",
  name: "桜のフレーム",
  description: "春の季節限定フレーム",
  pointCost: 2000, // 2000ポイントで交換可能
  priceJpy: 800, // または800円で購入可能
  imageUrl: "storageId_xxx",
  isAnimated: true,
  isPremium: false, // 無料ユーザーも利用可能
  isLimited: true,
  availableFrom: Date.now(),
  availableUntil: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30日間限定
  createdAt: Date.now(),
  createdBy: adminUserId,
});
```

---

# 8. reviews（商品レビュー）

**📚 インデックス**: [CONVEX_SCHEMA_INDEX.md](../CONVEX_SCHEMA_INDEX.md)

### 8. reviews（商品レビュー）✅ **2026年更新 - 餌のレビュー専用フィールドの追加**

**目的**: Phase 3で実装。商品に対するレビュー・評価。特に餌のレビューでは、成分表や栄養成分に関する情報も共有できる。

**主要フィールド**:
- `userId`: レビュアー
- `petId`: 使用したペット。どのペットが使ったかが重要
- `productId`: 商品ID
- `rating`: 評価（1-5）
- `comment`: コメント
- `foodReviewDetails`: 餌のレビュー専用フィールド（オプション）✅ **2026年追加**
  - `ingredientsChecked`: 成分表を確認したかどうか
  - `nutritionRating`: 栄養成分の評価（appropriate/slightly_low/low）
  - `usagePeriod`: 使用期間（例: "1ヶ月", "3ヶ月", "1年以上"）
  - `dailyAmount`: 1日の使用量（g）
  - `petReaction`: ペットの反応（loves_it/normal/reluctant）
  - `healthImpact`: 健康への影響（improved/no_change/worsened）
- `isPublic`: レビューの公開設定（デフォルト: true）✅ **2026年追加**
- `petSpecies`: ペット種別。集計用に非正規化
- `petBreed`: ペット品種。集計用に非正規化

**インデックス**:
- `by_product`: 商品での検索（レビュー一覧）
- `by_species_product`: 種別・商品での検索（「猫に人気のフード」など）
- `by_product_public`: 商品・公開設定での検索（公開レビューのみ取得）✅ **2026年追加**

**使用例**:
```typescript
// 基本的なレビュー
await ctx.db.insert("reviews", {
  userId: userId,
  petId: petId,
  productId: productId,
  rating: 5,
  comment: "とても良かったです",
  isPublic: true,
  petSpecies: "Reptile",
  petBreed: "Bearded Dragon",
});

// 餌の詳細レビュー ✅ **2026年追加**
await ctx.db.insert("reviews", {
  userId: userId,
  petId: petId,
  productId: productId,
  rating: 5,
  comment: "成分表を確認して購入しました。栄養バランスが良く、ペットも喜んで食べています。",
  foodReviewDetails: {
    ingredientsChecked: true,
    nutritionRating: "appropriate",
    usagePeriod: "3ヶ月",
    dailyAmount: 200,
    petReaction: "loves_it",
    healthImpact: "improved",
  },
  isPublic: true,
  petSpecies: "Dog",
  petBreed: "Husky",
});
```

---

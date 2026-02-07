# 7. products（商品データベース）

**📚 インデックス**: [CONVEX_SCHEMA_INDEX.md](../CONVEX_SCHEMA_INDEX.md)

### 7. products（商品データベース）✅ **2026年更新 - アソシエイトAPI情報の追加**

**目的**: Phase 3で実装。ペット用品のマスタデータ。特に餌については、Amazon Product Advertising API（PA-API）と楽天商品検索APIを使用して公式情報を取得し、成分表や栄養成分などの詳細情報を管理。

**商品カテゴリの優先順位** ✅ **2026年追加 - 段階的展開**:
- **Phase 1（最優先）**: ペットの餌（`category: "food"`）
- **Phase 2（次優先）**: ペットのトイレ用品（`category: "litter"`）
- **Phase 3（その他）**: その他の用品（`category: "toy"`, `"cage"`, `"accessory"`, `"insurance"`など）

**主要フィールド**:
- `name`: 商品名
- `category`: カテゴリ（"food", "litter", "toy", "cage", "insurance", "accessory"など）✅ **2026年更新 - 優先順位を明確化**
- `brand`: ブランド名
- `manufacturer`: 製造会社（アソシエイトAPIで取得、またはユーザー入力）✅ **2026年追加**
- `description`: 商品説明（アソシエイトAPIで取得、またはユーザー入力）✅ **2026年追加**
- `foodInfo`: ペットフード専用情報（オプション）✅ **2026年追加**
  - `ingredients`: 成分表（原材料）
  - `nutrition`: 栄養成分（タンパク質、脂質、繊維、水分、灰分、カルシウム、リンなど）
  - `targetSpecies`: 対象種別（例: ["Dog", "Cat"]）
  - `targetLifeStage`: 対象ライフステージ（例: ["Puppy", "Adult", "Senior"]）
  - `packageSize`: パッケージサイズ（例: "2kg", "5kg"）
  - `caloriePer100g`: 100gあたりのカロリー
- `affiliateApiInfo`: アソシエイトAPI情報の管理 ✅ **2026年追加**
  - `apiSource`: APIソース（amazon/rakuten）
  - `productId`: APIから取得した商品ID（ASIN、楽天商品IDなど）
  - `fetchedAt`: API実行日時
  - `apiStatus`: API実行の状態（pending/success/failed/not_found）
  - `apiError`: エラーメッセージ（失敗時）
  - `dataAvailability`: データの有無（製造会社、説明、成分表、栄養成分の各フィールドの有無）
- `isVerified`: 運営確認済みフラグ。ユーザー投稿直後はfalse
- `submittedBy`: 登録者。ユーザーが投稿した場合に設定
- `affiliateLink`: アフィリエイトURL。運営が承認後に付与
- `averageRating`: 平均評価。非正規化して高速表示
- `reviewCount`: レビュー数。非正規化して高速表示

**インデックス**:
- `search_name`: 商品名での全文検索
- `by_category`: カテゴリでの検索 ✅ **2026年追加**
- `by_brand`: ブランドでの検索 ✅ **2026年追加**
- `by_manufacturer`: 製造会社での検索 ✅ **2026年追加**

**使用例**:
```typescript
// 商品作成（ユーザー投稿、アソシエイトAPI連携）
await ctx.db.insert("products", {
  name: "フトアゴ用フード",
  category: "food",
  brand: "レプティライフ",
  manufacturer: "レプティライフ株式会社",
  description: "フトアゴヒゲトカゲ専用の栄養バランスの取れたフード",
  foodInfo: {
    ingredients: "乾燥コオロギ、乾燥ミルワーム、野菜パウダー、ビタミン・ミネラル",
    nutrition: {
      protein: 35.0,
      fat: 8.0,
      fiber: 5.0,
      moisture: 8.0,
      ash: 8.0,
      calcium: 2.0,
      phosphorus: 1.5,
    },
    targetSpecies: ["Reptile"],
    targetLifeStage: ["Adult"],
    packageSize: "500g",
    caloriePer100g: 350,
  },
  affiliateApiInfo: {
    apiSource: "amazon",
    productId: "B08XYZ1234", // ASIN
    fetchedAt: Date.now(),
    apiStatus: "success",
    dataAvailability: {
      hasManufacturer: true,
      hasDescription: true,
      hasIngredients: true,
      hasNutrition: true,
    },
  },
  affiliateLink: "https://amazon.co.jp/dp/B08XYZ1234?tag=your-associate-id", // APIから自動取得
  imageUrl: "https://example.com/product-image.jpg", // APIから自動取得
  isVerified: false,
  submittedBy: userId,
  reviewCount: 0,
});

// APIでデータが見つからなかった場合
await ctx.db.insert("products", {
  name: "新商品フード",
  category: "food",
  brand: "新ブランド",
  affiliateApiInfo: {
    apiSource: "amazon",
    productId: "",
    fetchedAt: Date.now(),
    apiStatus: "not_found",
    dataAvailability: {
      hasManufacturer: false,
      hasDescription: false,
      hasIngredients: false,
      hasNutrition: false,
    },
  },
  isVerified: false,
  submittedBy: userId,
  reviewCount: 0,
});
```

---

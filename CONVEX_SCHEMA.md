# Convex Schema Definition

## 概要
このドキュメントは、Convexスキーマの定義と説明です。
Phase 1からPhase 3までを見据えた設計になっています。

---

## スキーマ定義

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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
    isPremium: v.boolean(), // プレミアム会員かどうか
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
  }).index("by_token", ["tokenIdentifier"]),

  // ---------------------------------------------------------
  // 2. ペット (主役)
  // ---------------------------------------------------------
  pets: defineTable({
    ownerId: v.id("users"), // 作成者（主管理者）

    // 基本プロフィール
    name: v.string(),
    species: v.string(), // 種別: "Dog", "Cat", "Reptile", "Insect"...
    breed: v.optional(v.string()), // 品種: "Husky", "Leopard Gecko"...
    gender: v.union(
      v.literal("male"),
      v.literal("female"),
      v.literal("unknown")
    ),
    birthDate: v.optional(v.number()), // 推定誕生日
    photoUrl: v.optional(v.string()), // アイコン画像

    // 詳細ステータス
    weight: v.optional(v.number()), // 最新の体重(g)
    isNeutered: v.boolean(), // 去勢/避妊済みか
    neuteredDate: v.optional(v.number()), // 手術日

    // 出自・保険
    origin: v.optional(
      v.string()
    ), // "Shop", "Breeder", "Shelter"(里親), "Stray"(野良)
    insurance: v.optional(
      v.object({
        joined: v.boolean(),
        name: v.optional(v.string()), // 保険会社名
        isPublic: v.boolean(), // 保険情報の公開設定
      })
    ),

    // テキスト情報
    bio: v.optional(v.string()), // 自己紹介
    personality: v.optional(v.array(v.string())), // 性格タグ ["甘えん坊", "臆病"]

    // 公開設定
    visibility: privacyLevel,
  })
    .index("by_owner", ["ownerId"])
    .index("by_species_breed", ["species", "breed"]) // 検索用: 「ハスキー」で検索
    .searchIndex("search_bio", {
      searchField: "bio",
      filterFields: ["species"],
    }), // 全文検索

  // ---------------------------------------------------------
  // 3. 共同管理 (Phase 2)
  // ---------------------------------------------------------
  // 1匹のペットを複数人で管理するためのリンクテーブル
  pet_members: defineTable({
    petId: v.id("pets"),
    userId: v.id("users"),
    role: v.union(
      v.literal("admin"),
      v.literal("editor"),
      v.literal("viewer")
    ),
  })
    .index("by_pet", ["petId"])
    .index("by_user", ["userId"]),

  // ---------------------------------------------------------
  // 4. 活動ログ (食事, トイレ, 散歩, 日記...)
  // ---------------------------------------------------------
  activities: defineTable({
    petId: v.id("pets"),
    createdBy: v.id("users"), // 誰が記録したか (パパ? ママ?)
    loggedAt: v.number(), // 記録日時 (過去の日付登録も可能にするため作成日時とは別)

    // ログの種類によって中身を変える
    type: v.string(), // "food", "toilet", "walk", "health", "diary", "care"

    // 実際のデータ (柔軟性を持たせるため、必須項目以外はオプショナル)
    payload: v.object({
      // 共通
      images: v.optional(v.array(v.string())), // うんちの写真や日記の写真
      text: v.optional(v.string()), // メモや日記本文

      // 食事用
      foodId: v.optional(v.id("products")), // 商品DBとのリンク
      amount: v.optional(v.number()), // 量(g)

      // トイレ用
      toiletType: v.optional(v.string()), // "pee", "poo"
      condition: v.optional(v.string()), // "hard", "soft", "diarrhea"

      // 散歩用
      durationMin: v.optional(v.number()), // 分
      distanceKm: v.optional(v.number()), // 距離 (スマホGPS算出)
      routeImage: v.optional(v.string()), // 地図のスクショなど

      // ケア・医療用
      careType: v.optional(v.string()), // "nail", "shampoo", "vaccine"
      clinicName: v.optional(v.string()),
    }),

    // ソーシャル機能 (Phase 3)
    isPublic: v.boolean(), // 日記を公開するか
    likeCount: v.number(),
  })
    .index("by_pet_date", ["petId", "loggedAt"]) // タイムライン表示用
    .index("by_public_feed", ["isPublic", "loggedAt"]), // グローバルフィード用

  // ---------------------------------------------------------
  // 5. 商品データベース (Phase 3: 商品マスタ)
  // ---------------------------------------------------------
  products: defineTable({
    name: v.string(),
    category: v.string(), // "food", "toy", "cage"...
    brand: v.optional(v.string()),

    // 商品情報の管理
    isVerified: v.boolean(), // 運営が確認済みか（ユーザー投稿直後はfalse）
    submittedBy: v.optional(v.id("users")), // 誰が登録したか

    affiliateLink: v.optional(v.string()), // アフィリエイトURL
    imageUrl: v.optional(v.string()),

    // 統計データ (非正規化して持っておくことで高速表示)
    averageRating: v.optional(v.number()),
    reviewCount: v.number(),
  }).searchIndex("search_name", {
    searchField: "name",
    filterFields: ["category"],
  }),

  // ---------------------------------------------------------
  // 6. 商品レビュー (Phase 3)
  // ---------------------------------------------------------
  reviews: defineTable({
    userId: v.id("users"),
    petId: v.id("pets"), // 「どのペット」が食べた/使ったかが重要
    productId: v.id("products"),

    rating: v.number(), // 1~5
    comment: v.optional(v.string()),

    // ペットの属性をここにもコピーしておくと「トカゲにおすすめ」等の集計が楽になる
    petSpecies: v.string(),
    petBreed: v.optional(v.string()),
  })
    .index("by_product", ["productId"])
    .index("by_species_product", ["petSpecies", "productId"]), // 「猫」に人気のフード順

  // ---------------------------------------------------------
  // 7. コラム・記事 (管理者/専門家のみ公開可能)
  // ---------------------------------------------------------
  articles: defineTable({
    authorId: v.id("users"), // 投稿者（管理者 or 認定獣医師）
    title: v.string(),
    content: v.string(), // 本文（Markdown形式を推奨）
    thumbnailUrl: v.optional(v.string()), // アイキャッチ画像

    // フィルタリング用
    targetSpecies: v.array(v.string()), // ["Dog", "Cat"] などの対象種別
    tags: v.array(v.string()), // ["住環境", "初心者", "食事"]

    // 信頼性の担保
    sources: v.array(
      v.object({
        // 一次ソースのリンク
        title: v.string(),
        url: v.string(),
      })
    ),

    status: v.union(v.literal("draft"), v.literal("published")), // 下書き or 公開
    isExpertContent: v.boolean(), // 獣医師などの専門家による執筆か
    createdAt: v.number(),
  })
    .index("by_status_date", ["status", "createdAt"]) // 公開記事を新しい順に
    .index("by_species", ["targetSpecies"]) // 種類でフィルタリング
    .searchIndex("search_content", {
      // 全文検索
      searchField: "content",
      filterFields: ["status"],
    }),

  // ---------------------------------------------------------
  // 8. ソーシャル機能 (フォロー・いいね) (Phase 3)
  // ---------------------------------------------------------
  // フォロー関係
  follows: defineTable({
    followerId: v.id("users"), // フォローする人
    followingId: v.id("users"), // フォローされる人
    createdAt: v.number(),
  })
    .index("by_follower", ["followerId"]) // フォローしている人の一覧取得
    .index("by_following", ["followingId"]) // フォロワー一覧取得
    .index("by_follower_following", ["followerId", "followingId"]), // フォロー関係の確認

  // いいね
  likes: defineTable({
    userId: v.id("users"),
    activityId: v.id("activities"),
    createdAt: v.number(),
  })
    .index("by_activity", ["activityId"]) // 投稿ごとのいいね一覧
    .index("by_user_activity", ["userId", "activityId"]) // ユーザーがいいねしたかどうかの確認
    .index("by_user", ["userId"]), // ユーザーがいいねした投稿一覧

  // ---------------------------------------------------------
  // 9. AIチャット履歴 (Phase 1後半 / Phase 2)
  // ---------------------------------------------------------
  chat_threads: defineTable({
    userId: v.id("users"),
    petId: v.id("pets"), // どのペットについての相談か
    title: v.optional(v.string()), // 自動生成される要約タイトル
    createdAt: v.number(),
  }).index("by_user_pet", ["userId", "petId"]),

  chat_messages: defineTable({
    threadId: v.id("chat_threads"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),

    // 根拠としたソースがあればリンク
    citedSources: v.optional(v.array(v.id("knowledge_base"))),
  }).index("by_thread", ["threadId"]),

  // ---------------------------------------------------------
  // 10. 信頼できる知識ベース (RAG用)
  // ---------------------------------------------------------
  knowledge_base: defineTable({
    title: v.string(), // 例: "犬の誤飲時の対応ガイド"
    content: v.string(), // テキスト本文
    sourceUrl: v.string(), // 情報元のURL (信頼性の担保)
    category: v.string(), // "Emergency", "Food", "Illness"

    // ベクトル埋め込み (AIが検索するために必要)
    embedding: v.array(v.float64()),
  }).vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 1536, // OpenAIのモデルに合わせる
  }),
});
```

---

## テーブル詳細説明

### 1. users（ユーザー）

**目的**: アプリを利用するユーザーの情報を管理

**主要フィールド**:
- `tokenIdentifier`: Clerkの認証ID。一意性を保証
- `name`: ユーザー名
- `email`: メールアドレス
- `type`: ユーザータイプ（個人/事業者）
- `isPremium`: RevenueCatで管理されるプレミアム会員フラグ
- `isExpert`: 認定専門家（獣医師など）フラグ（オプション）
- `expertInfo`: 専門家情報（免許証番号、認定日時など）（オプション）
- `location`: 地域情報（将来的な検索・マッチング機能用）
- `businessInfo`: 事業者アカウントの場合の詳細情報

**インデックス**:
- `by_token`: 認証IDでの高速検索

**使用例**:
```typescript
// ユーザー作成
await ctx.db.insert("users", {
  tokenIdentifier: "user_xxx",
  name: "太郎",
  email: "taro@example.com",
  type: "individual",
  isPremium: false,
});
```

---

### 2. pets（ペット）

**目的**: ペットの基本情報とプロフィールを管理

**主要フィールド**:
- `ownerId`: 所有者（主管理者）。Phase 2では共同管理者も追加可能
- `species`: 種別。enumではなくstringで柔軟性を持たせる
- `breed`: 品種。オプショナルで「その他」にも対応
- `visibility`: 公開設定。Phase 3のSNS機能で使用

**インデックス**:
- `by_owner`: 所有者での検索（ペット一覧表示）
- `by_species_breed`: 種別・品種での検索（検索機能）
- `search_bio`: 全文検索（自己紹介での検索）

**使用例**:
```typescript
// ペット作成
await ctx.db.insert("pets", {
  ownerId: userId,
  name: "ポチ",
  species: "Dog",
  breed: "Husky",
  gender: "male",
  birthDate: Date.now(),
  isNeutered: false,
  visibility: "private",
});
```

---

### 3. pet_members（共同管理者）

**目的**: Phase 2で実装。1匹のペットを複数人で管理

**主要フィールド**:
- `petId`: ペットID
- `userId`: ユーザーID
- `role`: 権限（admin/editor/viewer）

**権限の説明**:
- `admin`: すべての操作が可能（共同管理者の追加・削除、権限変更）
- `editor`: 活動ログの記録・編集が可能
- `viewer`: 閲覧のみ可能

**インデックス**:
- `by_pet`: ペットでの検索（共同管理者一覧）
- `by_user`: ユーザーでの検索（自分が管理できるペット一覧）

**使用例**:
```typescript
// 共同管理者追加
await ctx.db.insert("pet_members", {
  petId: petId,
  userId: familyMemberId,
  role: "editor",
});
```

---

### 4. activities（活動ログ）

**目的**: ペットの日常活動を一元管理

**ログタイプ**:
- `food`: 食事
- `toilet`: トイレ
- `walk`: 散歩
- `health`: 健康管理
- `diary`: 日記
- `care`: ケア

**payloadの構造**:
ログタイプによって使用するフィールドが異なる

**インデックス**:
- `by_pet_date`: ペット・日時での検索（タイムライン表示）
- `by_public_feed`: 公開フィード用（Phase 3）

**使用例**:
```typescript
// 食事記録
await ctx.db.insert("activities", {
  petId: petId,
  createdBy: userId,
  loggedAt: Date.now(),
  type: "food",
  payload: {
    foodId: productId,
    amount: 100,
    text: "朝ごはん",
  },
  isPublic: false,
  likeCount: 0,
});
```

---

### 5. products（商品データベース）

**目的**: Phase 3で実装。ペット用品のマスタデータ

**主要フィールド**:
- `isVerified`: 運営確認済みフラグ。ユーザー投稿直後はfalse
- `submittedBy`: 登録者。ユーザーが投稿した場合に設定
- `affiliateLink`: アフィリエイトURL。運営が承認後に付与
- `averageRating`: 平均評価。非正規化して高速表示
- `reviewCount`: レビュー数。非正規化して高速表示

**インデックス**:
- `search_name`: 商品名での全文検索

**使用例**:
```typescript
// 商品作成（ユーザー投稿）
await ctx.db.insert("products", {
  name: "フトアゴ用フード",
  category: "food",
  brand: "レプティライフ",
  isVerified: false,
  submittedBy: userId,
  reviewCount: 0,
});
```

---

### 6. reviews（商品レビュー）

**目的**: Phase 3で実装。商品に対するレビュー・評価

**主要フィールド**:
- `petId`: 使用したペット。どのペットが使ったかが重要
- `petSpecies`: ペット種別。集計用に非正規化
- `petBreed`: ペット品種。集計用に非正規化

**インデックス**:
- `by_product`: 商品での検索（レビュー一覧）
- `by_species_product`: 種別・商品での検索（「猫に人気のフード」など）

**使用例**:
```typescript
// レビュー作成
await ctx.db.insert("reviews", {
  userId: userId,
  petId: petId,
  productId: productId,
  rating: 5,
  comment: "とても良かったです",
  petSpecies: "Reptile",
  petBreed: "Bearded Dragon",
});
```

---

### 7. follows（フォロー関係）

**目的**: Phase 3で実装。ユーザー間のフォロー関係を管理

**主要フィールド**:
- `followerId`: フォローする人（フォロワー）
- `followingId`: フォローされる人（フォロイー）
- `createdAt`: フォロー開始日時

**インデックス**:
- `by_follower`: フォローしている人の一覧取得
- `by_following`: フォロワー一覧取得
- `by_follower_following`: フォロー関係の確認（重複防止）

**使用例**:
```typescript
// フォロー
await ctx.db.insert("follows", {
  followerId: currentUserId,
  followingId: targetUserId,
  createdAt: Date.now(),
});

// フォロー解除
await ctx.db.delete(followId);
```

---

### 8. likes（いいね）

**目的**: Phase 3で実装。投稿へのいいねを管理

**主要フィールド**:
- `userId`: いいねしたユーザー
- `activityId`: いいねされた投稿（activities）
- `createdAt`: いいね日時

**専門家のいいね機能**:
- `users`テーブルの`isExpert`フラグが`true`のユーザーが「いいね」した場合、投稿に「獣医師が推奨」などの特別なバッジが表示される
- 専門家の「いいね」は通常の「いいね」とは区別され、おすすめフィードで優先的に表示される

**インデックス**:
- `by_activity`: 投稿ごとのいいね一覧（いいね数カウント）
- `by_user_activity`: ユーザーがいいねしたかどうかの確認（重複防止）
- `by_user`: ユーザーがいいねした投稿一覧

**使用例**:
```typescript
// いいね
await ctx.db.insert("likes", {
  userId: currentUserId,
  activityId: activityId,
  createdAt: Date.now(),
});

// いいね解除
await ctx.db.delete(likeId);
```

---

### 9. articles（コラム・記事）

**目的**: 管理者・専門家による信頼できるコラム・記事を管理

**主要フィールド**:
- `authorId`: 投稿者（管理者 or 認定獣医師）
- `title`: 記事タイトル
- `content`: 本文（Markdown形式推奨）
- `thumbnailUrl`: アイキャッチ画像
- `targetSpecies`: 対象種別（配列）
- `tags`: タグ（配列）
- `sources`: 一次ソースのリンク（信頼性の担保）
- `status`: 公開状態（draft/published）
- `isExpertContent`: 専門家による執筆フラグ
- `createdAt`: 作成日時

**インデックス**:
- `by_status_date`: 公開状態・日時での検索（公開記事を新しい順に）
- `by_species`: 種別でのフィルタリング
- `search_content`: 全文検索

**使用例**:
```typescript
// コラム作成（管理者）
await ctx.db.insert("articles", {
  authorId: adminUserId,
  title: "初めて猫を飼う人向けガイド",
  content: "# はじめに\n...",
  thumbnailUrl: "https://example.com/image.jpg",
  targetSpecies: ["Cat"],
  tags: ["初心者", "住環境", "食事"],
  sources: [
    { title: "厚生労働省ガイドライン", url: "https://..." },
  ],
  status: "published",
  isExpertContent: true,
  createdAt: Date.now(),
});
```

---

### 10. chat_threads（AIチャットスレッド）

**目的**: AI相談の会話スレッドを管理

**主要フィールド**:
- `userId`: ユーザーID
- `petId`: 相談対象のペットID
- `title`: スレッドタイトル（自動生成）
- `createdAt`: 作成日時

**インデックス**:
- `by_user_pet`: ユーザー・ペットでの検索（スレッド一覧）

**使用例**:
```typescript
// チャットスレッド作成
await ctx.db.insert("chat_threads", {
  userId: userId,
  petId: petId,
  createdAt: Date.now(),
});
```

---

### 10. chat_messages（AIチャットメッセージ）

**目的**: AI相談のメッセージ履歴を管理

**主要フィールド**:
- `threadId`: スレッドID
- `role`: メッセージの役割（user/assistant）
- `content`: メッセージ内容
- `citedSources`: 引用した知識ベースのID配列

**インデックス**:
- `by_thread`: スレッドでの検索（メッセージ一覧）

**使用例**:
```typescript
// ユーザーメッセージ作成
await ctx.db.insert("chat_messages", {
  threadId: threadId,
  role: "user",
  content: "最近食欲がないみたい",
});

// AI応答作成
await ctx.db.insert("chat_messages", {
  threadId: threadId,
  role: "assistant",
  content: "ポチくんの記録を見ると...",
  citedSources: [knowledgeId1, knowledgeId2],
});
```

---

### 11. knowledge_base（知識ベース）

**目的**: RAG（Retrieval-Augmented Generation）用の信頼できる知識データ

**主要フィールド**:
- `title`: 記事タイトル
- `content`: 記事本文
- `sourceUrl`: 情報元のURL（信頼性の担保）
- `category`: カテゴリ（Emergency/Food/Illnessなど）
- `embedding`: ベクトル埋め込み（1536次元）

**インデックス**:
- `by_embedding`: ベクトル検索インデックス（類似度検索用）

**使用例**:
```typescript
// 知識ベース作成（ベクトル埋め込みは別途生成）
await ctx.db.insert("knowledge_base", {
  title: "犬の誤飲時の対応ガイド",
  content: "チョコレートを誤飲した場合...",
  sourceUrl: "https://example.com/guide",
  category: "Emergency",
  embedding: [0.123, 0.456, ...], // 1536次元のベクトル
});
```

---

## 設計のポイント

### 1. 柔軟性の確保
- `species`と`breed`をstringにすることで、あらゆるペットに対応
- `activities`の`payload`を柔軟な構造にすることで、様々なログタイプに対応

### 2. パフォーマンス最適化
- 頻繁に検索されるフィールドにインデックス
- 統計データを非正規化（`averageRating`, `reviewCount`）
- 全文検索インデックスの活用

### 3. 拡張性の確保
- Phase 2（共同管理）を見据えた`pet_members`テーブル
- Phase 3（SNS・商品DB）を見据えた`isPublic`、`products`、`reviews`テーブル
- AI相談機能を見据えた`chat_threads`、`chat_messages`、`knowledge_base`テーブル

### 5. AI機能の信頼性確保
- RAG（Retrieval-Augmented Generation）による信頼できる回答生成
- ペットのカルテ情報（`pets`、`activities`）を活用した文脈理解
- ベクトル検索による関連知識の取得
- 引用元の明示（`citedSources`）による透明性の確保

### 4. セキュリティ
- `visibility`による公開設定
- `pet_members`による権限管理
- 認証IDベースのアクセス制御

---

## 実装時の注意点

### 1. データ整合性
- `petId`が存在することを確認
- `userId`が存在することを確認
- 外部キー制約はConvexでは自動的にチェックされないため、アプリケーション側で確認

### 2. パフォーマンス
- インデックスを適切に使用
- ページネーションの実装
- 不要なデータの取得を避ける

### 3. セキュリティ
- 認証チェックをすべてのmutationで実施
- 権限チェックを適切に実装
- 入力検証を実施

---

## AI相談機能の実装例

### 1. 知識ベースへのデータ投入（Ingestion）

```typescript
// convex/actions/ingestKnowledge.ts
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const ingestKnowledge = action({
  args: {
    title: v.string(),
    content: v.string(),
    sourceUrl: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    // テキストをベクトル化
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: `${args.title}\n${args.content}`,
    });

    const embedding = embeddingResponse.data[0].embedding;

    // knowledge_baseテーブルに保存
    const knowledgeId = await ctx.runMutation(api.knowledge.create, {
      title: args.title,
      content: args.content,
      sourceUrl: args.sourceUrl,
      category: args.category,
      embedding: embedding,
    });

    return knowledgeId;
  },
});
```

### 2. AI相談アクション（Generation）

```typescript
// convex/actions/chat.ts
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const chat = action({
  args: {
    petId: v.id("pets"),
    threadId: v.id("chat_threads"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. ペットのカルテ情報を取得
    const pet = await ctx.runQuery(api.pets.getById, { petId: args.petId });
    const recentActivities = await ctx.runQuery(api.activities.getRecent, {
      petId: args.petId,
      days: 3,
    });

    // 2. 質問をベクトル化
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: args.message,
    });
    const queryEmbedding = embeddingResponse.data[0].embedding;

    // 3. 知識ベースを検索
    const knowledgeResults = await ctx.vectorSearch(
      "knowledge_base",
      "by_embedding",
      {
        vector: queryEmbedding,
        limit: 5,
      }
    );

    // 4. システムプロンプトを作成
    const systemPrompt = `あなたはペットの健康管理をサポートするAIアシスタントです。
重要な注意事項:
- あなたは獣医師ではありません。診断を下さず、あくまで一般的なアドバイスと受診の目安を提示してください。
- 緊急度が高い場合は、必ず動物病院への受診を推奨してください。
- 回答には引用元を明示してください。

ペット情報:
- 名前: ${pet.name}
- 種別: ${pet.species}
- 品種: ${pet.breed || "不明"}
- 年齢: ${pet.birthDate ? Math.floor((Date.now() - pet.birthDate) / (365.25 * 24 * 60 * 60 * 1000)) : "不明"}歳
- 体重: ${pet.weight || "不明"}g

直近の記録:
${recentActivities.map((a) => `- ${a.type}: ${JSON.stringify(a.payload)}`).join("\n")}

参考知識:
${knowledgeResults.map((k) => `- ${k.title}: ${k.content}`).join("\n")}`;

    // 5. OpenAI ChatCompletion APIを呼び出し
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: args.message },
      ],
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content || "";

    // 6. メッセージを保存
    await ctx.runMutation(api.chat.saveUserMessage, {
      threadId: args.threadId,
      content: args.message,
    });

    const assistantMessageId = await ctx.runMutation(api.chat.saveAssistantMessage, {
      threadId: args.threadId,
      content: response,
      citedSources: knowledgeResults.map((k) => k._id),
    });

    return {
      messageId: assistantMessageId,
      content: response,
      citedSources: knowledgeResults.map((k) => ({
        id: k._id,
        title: k.title,
        url: k.sourceUrl,
      })),
    };
  },
});
```

### 3. 緊急度判定

```typescript
// convex/actions/checkEmergency.ts
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

export const checkEmergency = action({
  args: {
    petId: v.id("pets"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    // 中毒物質リスト（知識ベースから取得）
    const toxicSubstances = await ctx.runQuery(
      api.knowledge.getByCategory,
      { category: "Emergency" }
    );

    // ペット情報を取得
    const pet = await ctx.runQuery(api.pets.getById, { petId: args.petId });

    // 緊急度判定ロジック
    const emergencyKeywords = ["チョコレート", "玉ねぎ", "ぶどう", "誤飲"];
    const isEmergency = emergencyKeywords.some((keyword) =>
      args.message.includes(keyword)
    );

    if (isEmergency && pet.weight) {
      // 体重が小さいほど危険度が高い
      const riskLevel = pet.weight < 5000 ? "high" : "medium";
      return {
        isEmergency: true,
        riskLevel,
        recommendation: "すぐに動物病院を受診してください",
      };
    }

    return { isEmergency: false };
  },
});
```

---

## 次のステップ

1. このスキーマを`convex/schema.ts`に実装
2. Convex Functionsの実装（mutation/query/action）
3. AI相談機能の実装（RAG）
4. フロントエンドでのデータ取得・表示
5. テストの実装

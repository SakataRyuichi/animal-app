# Convex Schema Definition

**📚 ドキュメントインデックス**: [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)

## 概要
このドキュメントは、Convexスキーマの定義と説明です。
Phase 1からPhase 3までを見据えた設計になっています。

**関連ドキュメント**:
- [USER_STORIES.md](./USER_STORIES.md): モバイルアプリのユーザーストーリー
- [ADMIN_USER_STORIES.md](./ADMIN_USER_STORIES.md): 管理画面のユーザーストーリー
- [WEB_USER_STORIES.md](./WEB_USER_STORIES.md): 公式サイトのユーザーストーリー ✅ **2026年追加**
- [DESIGN_DOCUMENT.md](./DESIGN_DOCUMENT.md): アプリ設計の詳細
- [IMAGE_STORAGE_STRATEGY.md](./IMAGE_STORAGE_STRATEGY.md): 画像保存戦略
- [AI_CHAT_REVIEW.md](./AI_CHAT_REVIEW.md): AIチャット機能のレビュー
- [SCHEMA_REVIEW.md](./SCHEMA_REVIEW.md): スキーマ設計のレビュー

**重要**: このスキーマでは、Convexのドキュメント指向な特性を最大限に活かした`deletion`オブジェクトを使用した論理削除機能を実装しています。詳細は「設計のポイント > 6. 安全な削除機能（論理削除）」を参照してください。

---

## スキーマ定義

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

    // メモリアルステータス（虹の橋を渡った場合）✅ **非常にセンシティブな項目**
    // このオブジェクトが存在する場合、ペットは「虹の橋を渡った」状態
    // 「記録の封印」ではなく「思い出の保護」という観点で設計
    memorialStatus: v.optional(
      v.object({
        deceasedDate: v.number(), // 命日（Unixタイムスタンプ）。この日で年齢計算を停止
        message: v.optional(v.string()), // 飼い主からの最後の一言（オプション）
        createdAt: v.number(), // メモリアルモードに移行した日時
      })
    ),

    // 削除状態（Convexのドキュメント指向な特性を活かした設計）
    // このオブジェクトが存在する場合、データは削除された状態
    // 存在しない場合（undefined）、データはアクティブな状態
    deletion: deletionSchema,
  })
    .index("by_owner", ["ownerId"])
    .index("by_owner_active", ["ownerId", "deletion"]) // アクティブなペットのみ取得用
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
    // ✅ **2026年最終設計検証で追加**: 楽観的ロック用のバージョン番号
    // 同時編集の競合解決に使用（UI側で「他の人が更新しました」と優しく伝える）
    lastUpdatedAt: v.number(), // 最終更新日時（楽観的ロック用）
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
    // ✅ **2026年最終設計検証で追加**: 楽観的ロック用のバージョン番号
    // 同時編集の競合解決に使用（UI側で「他の人が更新しました」と優しく伝える）
    version: v.number(), // 楽観的ロック用のバージョン番号（更新時にインクリメント）

    // ログの種類によって中身を変える
    type: v.string(), // "food", "toilet", "walk", "health", "diary", "care"

    // 実際のデータ (柔軟性を持たせるため、必須項目以外はオプショナル)
    payload: v.object({
      // 共通
      imageIds: v.optional(v.array(v.id("images"))), // 画像IDの配列（imagesテーブルへの参照）
      text: v.optional(v.string()), // メモや日記本文

      // 食事用
      foodId: v.optional(v.id("products")), // 商品DBとのリンク
      amount: v.optional(v.number()), // 量(g)

      // トイレ用 ✅ **2026年更新 - 種別ごとの詳細な状態情報**
      toiletType: v.optional(v.string()), // "pee", "poo"（後方互換性のため残す）
      
      // 全種共通の基本的な状態
      generalCondition: v.optional(
        v.union(
          v.literal("excellent"), // ⭕️ 絶好調
          v.literal("unusual"), // ⚠️ いつもと違う
          v.literal("abnormal") // ❌ 異常あり
        )
      ),
      
      // 便の状態（犬・猫・うさぎ・ハムスター）
      stoolCondition: v.optional(
        v.object({
          hardness: v.optional(v.string()), // "hard", "normal", "soft", "muddy", "watery"（toilet_condition_mastersのoptionIdを参照）
          hasBlood: v.optional(v.boolean()), // 血便あり
          hasForeignObject: v.optional(v.boolean()), // 異物混入（おもちゃ、毛玉など）
          foreignObjectType: v.optional(v.string()), // 異物の種類（"toy", "hairball"など）
        })
      ),
      
      // 便の数・大きさ（うさぎ・ハムスター）
      stoolSizeAndCount: v.optional(
        v.object({
          size: v.optional(v.string()), // "large", "small"
          count: v.optional(v.string()), // "plenty", "few"
        })
      ),
      
      // 盲腸便（うさぎ限定）
      cecotrope: v.optional(
        v.object({
          status: v.optional(v.string()), // "normal", "leftover"（食べ残しあり）
          isLinked: v.optional(v.boolean()), // 毛で繋がったフン（換毛期の毛球症予防）
        })
      ),
      
      // 尿の状態（犬・猫）
      urineCondition: v.optional(
        v.object({
          amount: v.optional(v.string()), // "low", "normal", "high"
          color: v.optional(v.string()), // "light", "normal", "dark", "bloody"
        })
      ),
      
      // 排泄物の色（鳥類・爬虫類）
      excretionColor: v.optional(v.string()), // "green", "brown", "black"
      
      // 尿酸の状態（鳥類・爬虫類）
      uricAcid: v.optional(
        v.object({
          color: v.optional(v.string()), // "white", "yellow", "green"
          texture: v.optional(v.string()), // "normal", "solid", "gritty"
        })
      ),
      
      // 水分量（鳥類・爬虫類）
      moistureLevel: v.optional(v.string()), // "normal", "polyuria"（多尿）
      
      // 清掃アクション（全種共通）
      cleaningActions: v.optional(v.array(v.string())), // cleaning_action_mastersのactionIdの配列
      
      // 後方互換性のため残す（既存のconditionフィールド）
      condition: v.optional(v.string()), // "hard", "soft", "diarrhea"（既存データとの互換性）

      // 散歩用
      durationMin: v.optional(v.number()), // 分
      distanceKm: v.optional(v.number()), // 距離 (スマホGPS算出)
      routeImage: v.optional(v.string()), // 地図のスクショなど

      // ケア・医療用
      careType: v.optional(v.string()), // "nail", "shampoo", "vaccine"
      clinicName: v.optional(v.string()),

      // 日記用 ✅ **2026年追加 - シーン・感情・タグによる簡単記録**
      scenes: v.optional(v.array(v.string())), // シーンIDの配列（diary_scenesのsceneIdを参照）
      emotion: v.optional(v.string()), // 感情ID（diary_emotionsのemotionIdを参照）
      timeOfDay: v.optional(v.string()), // 時間帯（"morning", "noon", "evening", "night", "midnight"）
      location: v.optional(v.string()), // 場所（"home", "park", "dog_run", "clinic", "travel"）
      // コンテキスト・スタンプ（シーン+感情のセット）✅ **2026年追加 - クイック入力**
      contextStamp: v.optional(v.string()), // コンテキストスタンプID（例: "play_excited", "alone_sad"）
    }),

    // ソーシャル機能 (Phase 3)
    isPublic: v.boolean(), // 日記を公開するか
    likeCount: v.number(),

    // 削除状態
    deletion: deletionSchema,
  })
    .index("by_pet_date", ["petId", "loggedAt"]) // タイムライン表示用
    .index("by_pet_active", ["petId", "deletion"]) // アクティブなログのみ取得用
    .index("by_public_feed", ["isPublic", "loggedAt"]), // グローバルフィード用

  // ---------------------------------------------------------
  // 5. 画像管理 (Phase 1) ✅ **Convexのプライシングを考慮した設計**
  // ---------------------------------------------------------
  images: defineTable({
    userId: v.id("users"),
    petId: v.optional(v.id("pets")), // ペット関連の画像の場合
    activityId: v.optional(v.id("activities")), // 活動ログ関連の画像の場合

    // 1. 表示用（無料ユーザーも参照可能 / 500KB程度）
    previewStorageId: v.string(), // WebP形式、幅1080px、Quality 0.6-0.7
    
    // 2. 最高画質（プレミアムユーザーのみ参照可能 / 数MB以上）
    originalStorageId: v.string(), // WebP形式、リサイズなし、Quality 0.9-1.0
    
    // 3. 編集データ（プレミアムのみ：スタンプの位置など）
    editMetadata: v.optional(
      v.object({
        // 編集前のオリジナル（編集を元に戻すため）
        originalBeforeEditStorageId: v.optional(v.string()),
        // スタンプの位置・種類
        stamps: v.optional(
          v.array(
            v.object({
              type: v.string(), // スタンプの種類
              x: v.number(), // X座標
              y: v.number(), // Y座標
              scale: v.number(), // スケール
              rotation: v.number(), // 回転角度
            })
          )
        ),
        // 文字の位置・内容
        texts: v.optional(
          v.array(
            v.object({
              content: v.string(), // 文字内容
              x: v.number(), // X座標
              y: v.number(), // Y座標
              fontSize: v.number(), // フォントサイズ
              color: v.string(), // 色（HEX）
              fontFamily: v.string(), // フォントファミリー
            })
          )
        ),
      })
    ),
    
    // メタデータ
    width: v.number(), // オリジナルの幅
    height: v.number(), // オリジナルの高さ
    fileSizeOriginal: v.number(), // オリジナルのファイルサイズ（バイト）
    fileSizePreview: v.number(), // プレビューのファイルサイズ（バイト）
    format: v.string(), // "webp"
    
    // 編集状態
    hasEdits: v.boolean(), // 編集されているかどうか
    isPremiumAtUpload: v.boolean(), // アップロード時のユーザー状態（プレミアムかどうか）
    
    // 削除状態
    deletion: deletionSchema,
    
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_pet", ["petId"])
    .index("by_activity", ["activityId"])
    .index("by_user_active", ["userId", "deletion"]), // アクティブな画像のみ取得用

  // ---------------------------------------------------------
  // 6. 商品データベース (Phase 3: 商品マスタ)
  // ---------------------------------------------------------
  products: defineTable({
    name: v.string(),
    category: v.string(), // "food", "toy", "cage", "insurance", "accessory"...
    brand: v.optional(v.string()),
    manufacturer: v.optional(v.string()), // 製造会社（アソシエイトAPIで取得）
    description: v.optional(v.string()), // 商品説明（アソシエイトAPIで取得、またはユーザー入力）

    // ✅ **2026年追加**: ペットフード専用フィールド（アソシエイトAPIで取得）
    foodInfo: v.optional(
      v.object({
        ingredients: v.optional(v.string()), // 成分表（原材料）
        nutrition: v.optional(
          v.object({
            protein: v.optional(v.number()), // タンパク質（%）
            fat: v.optional(v.number()), // 脂質（%）
            fiber: v.optional(v.number()), // 繊維（%）
            moisture: v.optional(v.number()), // 水分（%）
            ash: v.optional(v.number()), // 灰分（%）
            calcium: v.optional(v.number()), // カルシウム（%）
            phosphorus: v.optional(v.number()), // リン（%）
            // その他の栄養成分は必要に応じて追加
          })
        ),
        targetSpecies: v.optional(v.array(v.string())), // 対象種別（例: ["Dog", "Cat"]）
        targetLifeStage: v.optional(v.array(v.string())), // 対象ライフステージ（例: ["Puppy", "Adult", "Senior"]）
        packageSize: v.optional(v.string()), // パッケージサイズ（例: "2kg", "5kg"）
        caloriePer100g: v.optional(v.number()), // 100gあたりのカロリー
      })
    ),

    // ✅ **2026年追加**: アソシエイトAPI情報の管理（Amazon/楽天）
    affiliateApiInfo: v.optional(
      v.object({
        apiSource: v.union(
          v.literal("amazon"), // Amazon Product Advertising API
          v.literal("rakuten") // 楽天商品検索API
        ),
        productId: v.string(), // APIから取得した商品ID（ASIN、楽天商品IDなど）
        fetchedAt: v.number(), // API実行日時
        apiStatus: v.union(
          v.literal("pending"), // API実行待ち
          v.literal("success"), // 成功
          v.literal("failed"), // 失敗
          v.literal("not_found") // 商品が見つからなかった
        ),
        apiError: v.optional(v.string()), // エラーメッセージ（失敗時）
        dataAvailability: v.object({
          hasManufacturer: v.boolean(), // 製造会社情報があるか
          hasDescription: v.boolean(), // 説明があるか
          hasIngredients: v.boolean(), // 成分表があるか
          hasNutrition: v.boolean(), // 栄養成分があるか
        }),
        // アソシエイトリンクは`affiliateLink`フィールドに保存（APIから取得）
      })
    ),

    // ✅ **2026年追加**: データ更新制御（1日1回制限）
    lastUpdatedAt: v.number(), // 最終更新日時（Unixタイムスタンプ）。24時間以内の更新を防ぐ
    createdAt: v.number(), // 作成日時

    // 商品情報の管理
    isVerified: v.boolean(), // 運営が確認済みか（ユーザー投稿直後はfalse）
    submittedBy: v.optional(v.id("users")), // 誰が登録したか

    affiliateLink: v.optional(v.string()), // アフィリエイトURL（APIから自動取得）
    imageUrl: v.optional(v.string()), // 商品画像URL（APIから自動取得、またはConvex Storageに保存）

    // 価格情報（APIから取得、定期的に更新）
    price: v.optional(v.number()), // 現在価格（円）
    originalPrice: v.optional(v.number()), // 定価（円）
    discountRate: v.optional(v.number()), // 割引率（%）
    currency: v.optional(v.string()), // 通貨（例: "JPY"）

    // 在庫・販売状況
    availability: v.optional(
      v.union(
        v.literal("in_stock"), // 在庫あり
        v.literal("out_of_stock"), // 在庫なし
        v.literal("preorder") // 予約注文
      )
    ),

    // 評価情報（APIから取得）
    amazonRating: v.optional(v.number()), // Amazonの評価（1-5）
    amazonReviewCount: v.optional(v.number()), // Amazonのレビュー数

    // 統計データ (非正規化して持っておくことで高速表示)
    averageRating: v.optional(v.number()), // アプリ内の平均評価
    reviewCount: v.number(), // アプリ内のレビュー数

    // 閲覧・アクセス統計（更新優先度の判定に使用）
    viewCount: v.number(), // 閲覧回数
    lastViewedAt: v.optional(v.number()), // 最終閲覧日時
  })
    .searchIndex("search_name", {
    searchField: "name",
    filterFields: ["category"],
    })
    .index("by_category", ["category"])
    .index("by_brand", ["brand"])
    .index("by_manufacturer", ["manufacturer"])
    .index("by_asin", ["affiliateApiInfo.productId"]) // ✅ **2026年追加**: ASINでの重複チェック用
    .index("by_last_updated", ["lastUpdatedAt"]) // ✅ **2026年追加**: 更新優先度の判定用
    .index("by_view_count", ["viewCount", "lastViewedAt"]), // ✅ **2026年追加**: 閲覧数順の更新用

  // ---------------------------------------------------------
  // 7. 商品レビュー (Phase 3)
  // ---------------------------------------------------------
  reviews: defineTable({
    userId: v.id("users"),
    petId: v.id("pets"), // 「どのペット」が食べた/使ったかが重要
    productId: v.id("products"),

    rating: v.number(), // 1~5
    comment: v.optional(v.string()),

    // ✅ **2026年追加**: 餌のレビュー専用フィールド（オプション）
    foodReviewDetails: v.optional(
      v.object({
        ingredientsChecked: v.optional(v.boolean()), // 成分表を確認したかどうか
        nutritionRating: v.optional(
          v.union(
            v.literal("appropriate"), // 適切
            v.literal("slightly_low"), // やや不足
            v.literal("low") // 不足
          )
        ),
        usagePeriod: v.optional(v.string()), // 使用期間（例: "1ヶ月", "3ヶ月", "1年以上"）
        dailyAmount: v.optional(v.number()), // 1日の使用量（g）
        petReaction: v.optional(
          v.union(
            v.literal("loves_it"), // 喜んで食べる
            v.literal("normal"), // 普通
            v.literal("reluctant") // あまり食べない
          )
        ),
        healthImpact: v.optional(
          v.union(
            v.literal("improved"), // 体調が良くなった
            v.literal("no_change"), // 変化なし
            v.literal("worsened") // 体調が悪くなった
          )
        ),
      })
    ),

    // レビューの公開設定
    isPublic: v.boolean(), // レビューを公開するかどうか（デフォルト: true）

    // ペットの属性をここにもコピーしておくと「トカゲにおすすめ」等の集計が楽になる
    petSpecies: v.string(),
    petBreed: v.optional(v.string()),
  })
    .index("by_product", ["productId"])
    .index("by_species_product", ["petSpecies", "productId"]) // 「猫」に人気のフード順
    .index("by_product_public", ["productId", "isPublic"]), // 公開レビューのみ取得

  // ---------------------------------------------------------
  // 8. コラム・記事 (管理者/専門家のみ公開可能)
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
  // 9. ソーシャル機能 (フォロー・いいね) (Phase 3)
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

  // いいね・リアクション ✅ **2026年更新 - 多機能リアクション**
  likes: defineTable({
    userId: v.id("users"),
    activityId: v.id("activities"),
    reactionType: v.string(), // リアクションタイプ（reaction_typesのreactionIdを参照）✅ **2026年追加**
    createdAt: v.number(),
  })
    .index("by_activity", ["activityId"]) // 投稿ごとのリアクション一覧
    .index("by_user_activity", ["userId", "activityId"]) // ユーザーがリアクションしたかどうかの確認
    .index("by_user", ["userId"]) // ユーザーがリアクションした投稿一覧
    .index("by_activity_reaction", ["activityId", "reactionType"]), // 投稿・リアクションタイプでの検索 ✅ **2026年追加**

  // ---------------------------------------------------------
  // 10. AIチャット履歴 (Phase 1後半 / Phase 2)
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

    // ✅ 免責事項表示の管理
    disclaimerShown: v.boolean(), // 免責事項を表示したかどうかのフラグ
    disclaimerType: v.optional(
      v.union(
        v.literal("general"), // 一般的な免責事項
        v.literal("medical"), // 医療・健康に関する免責事項
        v.literal("food"), // 食事・栄養に関する免責事項
        v.literal("emergency") // 緊急時の免責事項
      )
    ),
  }).index("by_thread", ["threadId"]),

  // ---------------------------------------------------------
  // 11. アルバム管理 (Phase 2) ✅ **思い出をテーマ別に整理**
  // ---------------------------------------------------------
  albums: defineTable({
    userId: v.id("users"),
    petId: v.id("pets"),
    title: v.string(), // 「初めてのドッグラン」「5歳の誕生日」など
    description: v.optional(v.string()), // アルバムの説明
    coverImageId: v.optional(v.id("images")), // 表紙画像のID
    isPremium: v.boolean(), // プレミアム限定アルバムかどうかのフラグ（作成時のユーザーステータス）
    createdAt: v.number(),
    updatedAt: v.number(), // 最終更新日時
  })
    .index("by_user_pet", ["userId", "petId"]) // ユーザー・ペットでの検索
    .index("by_user", ["userId"]), // ユーザーでの検索

  // アルバムとコンテンツ（活動ログ・画像）を紐付ける中間テーブル
  album_items: defineTable({
    albumId: v.id("albums"),
    activityId: v.optional(v.id("activities")), // 活動ログ（日記など）への参照
    imageId: v.optional(v.id("images")), // 画像への参照
    order: v.number(), // アルバム内での表示順
    addedAt: v.number(), // 追加日時
  })
    .index("by_album", ["albumId"]) // アルバムでの検索
    .index("by_activity", ["activityId"]) // 活動ログでの検索
    .index("by_image", ["imageId"]), // 画像での検索

  // ---------------------------------------------------------
  // 12. ユーザーフィードバック・アンケート (Phase 2)
  // ---------------------------------------------------------
  // プレミアム解除の理由
  premium_cancellation_reasons: defineTable({
    userId: v.id("users"),
    reason: v.union(
      v.literal("features_sufficient"), // 今は必要な機能を使い切った
      v.literal("budget_review"), // 家計を見直したい
      v.literal("free_satisfied"), // 無料版の機能で満足している
      v.literal("too_complex") // 操作が難しく感じた
    ),
    comment: v.optional(v.string()), // 自由記述
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_reason", ["reason"]), // 理由別の集計用

  // 退会（アカウント削除）の理由
  account_deletion_reasons: defineTable({
    userId: v.id("users"),
    reason: v.union(
      v.literal("need_break"), // 今は少しアプリ（記録）から離れたい ✅ **コンテキストを汲み取った「お休み」の提案**
      v.literal("lifestyle_change"), // 生活スタイルが変わって記録が難しくなった
      v.literal("other_method"), // 他の管理方法（ノートやSNSなど）に変える
      v.literal("notifications_issue"), // アプリの通知や操作が自分に合わなかった
      v.literal("usage_confusion") // 使い方がわからなかった
    ),
    comment: v.optional(v.string()), // 自由記述
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_reason", ["reason"]), // 理由別の集計用

  // ---------------------------------------------------------
  // 13. 管理者厳選のキュレーション (Phase 1後半 / Phase 2) ✅ **外部記事の紹介**
  // ---------------------------------------------------------
  curations: defineTable({
    // 管理者による紹介文（アプリの独自価値）
    title: v.string(), // 記事のタイトル
    summary: v.string(), // 管理者による紹介文（「この記事のここがレオくんに役立つかも！」など）
    sourceName: v.string(), // 掲載元（例: 「ペット健康ドットコム」）
    url: v.string(), // 外部URL（サニタイズ済み）
    thumbnailUrl: v.optional(v.string()), // サムネイル画像URL（Convex Storageに保存された最適化済み画像）
    thumbnailStorageId: v.optional(v.string()), // Convex StorageのID（推奨：パフォーマンス向上）
    
    // カテゴリ分類
    category: v.union(
      v.literal("health"), // 健康・医療
      v.literal("food"), // 食事・栄養
      v.literal("lifestyle"), // ライフスタイル・しつけ
      v.literal("care"), // ケア・美容
      v.literal("emergency") // 緊急時対応
    ),
    
    // 対象ペット種別（複数選択可能）
    targetSpecies: v.optional(v.array(v.string())), // ["Dog", "Cat"]など
    
    // プレミアム制限
    isPremium: v.boolean(), // プレミアム会員限定の厳選記事にする場合
    
    // メタデータ
    publishedAt: v.number(), // 公開日時
    createdAt: v.number(), // 作成日時
    createdBy: v.id("users"), // 作成者（管理者）
    
    // 削除状態
    deletion: deletionSchema,
  })
    .index("by_published", ["publishedAt"]) // 公開日時での検索（新しい順）
    .index("by_category", ["category"]) // カテゴリでの検索
    .index("by_premium", ["isPremium"]) // プレミアム制限での検索
    .index("by_active", ["deletion"]), // アクティブなキュレーションのみ取得

  // キュレーションとユーザーのインタラクション（「あとで読む」「アルバム保存」など）
  curation_interactions: defineTable({
    userId: v.id("users"),
    curationId: v.id("curations"),
    interactionType: v.union(
      v.literal("read_later"), // あとで読む
      v.literal("saved_to_album"), // アルバムに保存
      v.literal("shared"), // 共有
      v.literal("viewed") // 閲覧
    ),
    albumId: v.optional(v.id("albums")), // アルバムに保存した場合のアルバムID
    createdAt: v.number(),
  })
    .index("by_user", ["userId"]) // ユーザーでの検索
    .index("by_curation", ["curationId"]) // キュレーションでの検索
    .index("by_user_curation", ["userId", "curationId"]), // ユーザー・キュレーションでの検索（重複防止）

  // ---------------------------------------------------------
  // 14. 信頼できる知識ベース (RAG用)
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

  // ---------------------------------------------------------
  // 15. トイレ記録用マスターデータ ✅ **2026年追加 - 種別ごとの選択肢**
  // ---------------------------------------------------------
  // ペットの種類ごとに最適化された選択肢を管理するマスターデータ
  toilet_condition_masters: defineTable({
    // 対象種別（複数選択可能、空の場合は全種共通）
    targetSpecies: v.array(v.string()), // ["Dog", "Cat", "Rabbit", "Hamster", "Bird", "Reptile"]など、空配列の場合は全種共通
    
    // カテゴリ（どの種類の選択肢か）
    category: v.union(
      v.literal("general_condition"), // 全種共通の基本的な状態
      v.literal("stool_condition"), // 便の状態（犬・猫・うさぎ・ハムスター）
      v.literal("urine_condition"), // 尿の状態（犬・猫）
      v.literal("excretion_color"), // 排泄物の色（鳥類・爬虫類）
      v.literal("uric_acid"), // 尿酸の状態（鳥類・爬虫類）
      v.literal("cecotrope") // 盲腸便（うさぎ限定）
    ),
    
    // 選択肢のID（一意の識別子）
    optionId: v.string(), // 例: "stool_hard", "stool_normal", "stool_soft", "urine_amount_low"
    
    // 表示名（日本語）
    displayName: v.string(), // 例: "カチカチ（コロコロして硬い）", "少ない"
    
    // 表示名（英語、将来的な多言語対応用）
    displayNameEn: v.optional(v.string()),
    
    // アイコンまたは絵文字（UI表示用）
    icon: v.optional(v.string()), // 例: "💩", "💧", "⭕️", "⚠️", "❌"
    
    // 説明文（ツールチップなどで表示）
    description: v.optional(v.string()), // 例: "コロコロして硬い便。水分不足の可能性があります。"
    
    // 異常度（0-5、0が正常、5が最も異常）
    severity: v.number(), // 0: 正常, 1-2: 注意, 3-4: 要観察, 5: 異常
    
    // 表示順序（小さい順に表示）
    displayOrder: v.number(),
    
    // 有効/無効フラグ
    isActive: v.boolean(),
    
    // 作成・更新情報
    createdAt: v.number(),
    updatedAt: v.number(),
    createdBy: v.id("users"), // 管理者
  })
    .index("by_species_category", ["targetSpecies", "category"]) // 種別・カテゴリでの検索
    .index("by_category", ["category"]) // カテゴリでの検索
    .index("by_active", ["isActive"]), // 有効な選択肢のみ取得

  // 清掃アクションマスターデータ（全種共通）
  cleaning_action_masters: defineTable({
    // アクションID
    actionId: v.string(), // 例: "toilet_partial", "toilet_full", "cage_full", "water_change"
    
    // 表示名（日本語）
    displayName: v.string(), // 例: "トイレ掃除（部分）", "シート/砂の全交換"
    
    // 表示名（英語）
    displayNameEn: v.optional(v.string()),
    
    // アイコン
    icon: v.optional(v.string()), // 例: "🧹", "🔄", "💧"
    
    // 対象種別（空配列の場合は全種共通）
    targetSpecies: v.array(v.string()), // 例: []（全種共通）、["Dog", "Cat"]（犬猫のみ）
    
    // 獲得ポイント（清掃アクション実行時に付与）
    points: v.number(), // 例: 5pt
    
    // 表示順序
    displayOrder: v.number(),
    
    // 有効/無効フラグ
    isActive: v.boolean(),
    
    // 作成・更新情報
    createdAt: v.number(),
    updatedAt: v.number(),
    createdBy: v.id("users"), // 管理者
  })
    .index("by_species", ["targetSpecies"]) // 種別での検索
    .index("by_active", ["isActive"]), // 有効なアクションのみ取得

  // ---------------------------------------------------------
  // 16. リマインダー機能 ✅ **2026年追加 - 掃除のタイマー・リマインダー**
  // ---------------------------------------------------------
  // リマインダーカテゴリマスターデータ（種別ごとのプリセット）
  reminder_category_masters: defineTable({
    // 対象種別（複数選択可能、空の場合は全種共通）
    targetSpecies: v.array(v.string()), // ["Dog", "Cat", "Rabbit", "Hamster", "Bird", "Reptile"]など、空配列の場合は全種共通
    
    // カテゴリID（一意の識別子）
    categoryId: v.string(), // 例: "cage_wash", "water_change", "filter_clean"
    
    // 表示名（日本語）
    displayName: v.string(), // 例: "ケージ丸洗い", "水換え", "フィルター清掃"
    
    // 表示名（英語）
    displayNameEn: v.optional(v.string()),
    
    // アイコン
    icon: v.optional(v.string()), // 例: "🧽", "💧", "🌞"
    
    // 説明文
    description: v.optional(v.string()), // 例: "ケージ全体を洗浄して清潔に保ちます"
    
    // 推奨頻度の初期値
    defaultFrequency: v.optional(
      v.union(
        v.literal("daily"),
        v.literal("weekly"),
        v.literal("biweekly"),
        v.literal("monthly")
      )
    ),
    
    // 推奨時間の初期値（HH:MM形式）
    defaultTime: v.optional(v.string()), // 例: "09:00", "20:00"
    
    // デフォルトのポイント（完了時に付与）
    defaultPoints: v.number(), // 例: 5
    
    // 表示順序
    displayOrder: v.number(),
    
    // 有効/無効フラグ
    isActive: v.boolean(),
    
    // 作成・更新情報
    createdAt: v.number(),
    updatedAt: v.number(),
    createdBy: v.id("users"), // 管理者
  })
    .index("by_species", ["targetSpecies"]) // 種別での検索
    .index("by_active", ["isActive"]), // 有効なカテゴリのみ取得

  // リマインダー設定
  reminders: defineTable({
    userId: v.id("users"),
    petId: v.id("pets"),
    
    // カテゴリとタイトルの柔軟性
    categoryId: v.string(), // reminder_category_mastersのcategoryId、または "custom"
    customTitle: v.optional(v.string()), // カスタム設定時のテキスト（例: "サプリメントの添加"）
    customIcon: v.optional(v.string()), // カスタム設定時のアイコン
    
    // スケジュール（複雑な頻度に対応）
    schedule: v.object({
      frequency: v.union(
        v.literal("daily"), // 毎日
        v.literal("weekly"), // 毎週（曜日指定）
        v.literal("biweekly"), // 隔週
        v.literal("monthly"), // 毎月（日付指定）
        v.literal("interval") // 間隔指定（例: 3日おき）
      ),
      intervalDays: v.optional(v.number()), // 「3日おき」などの場合（frequency: "interval"の時のみ）
      daysOfWeek: v.optional(v.array(v.number())), // 0-6 (日曜日=0, 月曜日=1, ...)
      dayOfMonth: v.optional(v.number()), // 毎月の日付指定（1-31、frequency: "monthly"の時のみ）
      time: v.string(), // "20:30"形式（HH:MM）
    }),
    
    // 完了条件
    completionRequirement: v.optional(
      v.union(
        v.literal("check_only"), // チェックのみ
        v.literal("photo_required") // 写真撮影を必須にする
      )
    ),
    
    // ポイント設定（カスタム設定も可能）
    rewardPoints: v.number(), // 完了時に付与するポイント
    
    // 有効/無効フラグ
    isEnabled: v.boolean(),
    
    // 最後に完了した日時
    lastCompletedAt: v.optional(v.number()),
    
    // 次回の通知予定日時（計算済み）
    nextNotificationAt: v.optional(v.number()),
    
    // 作成・更新情報
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_pet_enabled", ["petId", "isEnabled"]) // ペット・有効状態での検索
    .index("by_user", ["userId"]) // ユーザーでの検索
    .index("by_next_notification", ["nextNotificationAt"]), // 次回通知日時での検索（Cronジョブ用）

  // リマインダーの完了履歴（ポイント付与の根拠にもなる）
  reminder_logs: defineTable({
    reminderId: v.id("reminders"),
    petId: v.id("pets"),
    userId: v.id("users"),
    
    // 完了日時
    completedAt: v.number(),
    
    // 完了方法
    completionMethod: v.union(
      v.literal("reminder_notification"), // リマインダー通知から完了
      v.literal("manual"), // 手動で完了
      v.literal("auto_from_activity") // トイレ記録などから自動完了
    ),
    
    // 関連する活動ログID（トイレ記録などから自動完了した場合）
    relatedActivityId: v.optional(v.id("activities")),
    
    // 写真ID（photo_requiredの場合）
    photoId: v.optional(v.id("images")),
    
    // メモ
    memo: v.optional(v.string()),
    
    // 付与されたポイント
    pointsAwarded: v.number(),
  })
    .index("by_reminder", ["reminderId"]) // リマインダーでの検索
    .index("by_pet", ["petId"]) // ペットでの検索
    .index("by_user", ["userId"]) // ユーザーでの検索
    .index("by_completed_at", ["completedAt"]), // 完了日時での検索

  // ✅ **ゲーミフィケーション要素（2026年追加）**: ショップアイテム（管理者のみ登録）
  assets: defineTable({
    type: v.union(
      v.literal("frame"),      // 静止画フレーム
      v.literal("animated_frame"), // 動くフレーム
      v.literal("cover"),      // アルバム表紙
      v.literal("effect")      // エフェクト（将来的な拡張）
    ),
    name: v.string(), // アイテム名（例: "桜のフレーム"）
    description: v.optional(v.string()), // アイテムの説明
    pointCost: v.number(), // ポイントでの価格（0の場合はポイント交換不可）
    priceJpy: v.optional(v.number()), // 日本円での価格（nullならポイント限定）
    imageUrl: v.string(), // プレビュー画像のURL（Convex StorageのID）
    isAnimated: v.boolean(), // アニメーション有無
    isPremium: v.boolean(), // プレミアム限定アイテムかどうか
    isLimited: v.optional(v.boolean()), // 期間限定アイテムかどうか
    availableFrom: v.optional(v.number()), // 利用可能開始日時（Unixタイムスタンプ）
    availableUntil: v.optional(v.number()), // 利用可能終了日時（Unixタイムスタンプ）
    createdAt: v.number(), // 作成日時
    createdBy: v.id("users"), // 作成者（管理者）
  }).index("by_type", ["type"])
    .index("by_available", ["availableFrom", "availableUntil"]),

  // ✅ **ゲーミフィケーション要素（2026年追加）**: バッジ定義（管理者のみ登録）
  badge_definitions: defineTable({
    id: v.string(), // バッジID（例: "health_guardian_30days"）
    name: v.string(), // バッジ名（例: "健康の守護者"）
    description: v.string(), // バッジの説明（例: "トイレと餌の記録を連続30日達成")
    iconUrl: v.string(), // バッジアイコンのURL（Convex StorageのID）
    category: v.union(
      v.literal("health"),    // 健康管理
      v.literal("care"),      // ケア
      v.literal("social"),     // ソーシャル（将来的な拡張）
      v.literal("achievement") // 達成
    ),
    condition: v.object({
      type: v.string(), // 条件タイプ（例: "consecutive_days", "total_count"）
      value: v.number(), // 条件値（例: 30日、100件）
      activityTypes: v.optional(v.array(v.string())), // 対象となる活動タイプ（例: ["toilet", "feeding"]）
    }),
    isGlobal: v.boolean(), // グローバル表示（他のユーザーにも見える）かどうか
    createdAt: v.number(), // 作成日時
  }).index("by_category", ["category"]),

  // ✅ **ゲーミフィケーション要素（2026年追加）**: ポイント獲得履歴（監査用）
  point_history: defineTable({
    userId: v.id("users"),
    points: v.number(), // 獲得/消費ポイント数（正の値: 獲得、負の値: 消費）
    reason: v.string(), // 理由（例: "feeding_logged", "toilet_logged", "journal_created", "asset_purchased"）
    activityId: v.optional(v.id("activities")), // 関連する活動ID（ポイント獲得の場合）
    assetId: v.optional(v.id("assets")), // 関連するアイテムID（ポイント消費の場合）
    badgeId: v.optional(v.string()), // 関連するバッジID（バッジ獲得時のボーナスポイントなど）
    createdAt: v.number(), // 獲得/消費日時
  }).index("by_user", ["userId", "createdAt"])
    .index("by_user_reason", ["userId", "reason"]),

  // ---------------------------------------------------------
  // 29. ニュース・更新情報（公式サイト用）✅ **2026年追加 - 公式サイト**
  // ---------------------------------------------------------
  news: defineTable({
    title: v.string(), // ニュースのタイトル
    content: v.string(), // ニュースの本文（Markdown形式）
    category: v.union(
      v.literal("feature"), // 機能追加
      v.literal("bugfix"), // バグ修正
      v.literal("announcement"), // お知らせ
      v.literal("update") // アップデート
    ), // カテゴリ
    publishedAt: v.optional(v.number()), // 公開日時（公開されていない場合はundefined）
    isPublished: v.boolean(), // 公開フラグ
    imageUrl: v.optional(v.string()), // アイキャッチ画像のURL
    createdAt: v.number(), // 作成日時
    updatedAt: v.number(), // 更新日時
    createdBy: v.id("users"), // 作成者（管理者）
  })
    .index("by_published", ["isPublished", "publishedAt"])
    .index("by_category", ["category", "publishedAt"]),

  // ---------------------------------------------------------
  // 31. diary_scenes（日記シーンマスターデータ）✅ **2026年追加 - 日記の簡単記録**
  // ---------------------------------------------------------
  diary_scenes: defineTable({
    sceneId: v.string(), // シーンID（例: "walk", "nap", "play", "meal"）
    name: v.string(), // シーン名（例: "お散歩", "お昼寝", "遊び", "食事"）
    icon: v.string(), // アイコン（絵文字またはアイコン名）
    displayOrder: v.number(), // 表示順序
    isActive: v.boolean(), // 有効/無効
  })
    .index("by_active_order", ["isActive", "displayOrder"]),

  // ---------------------------------------------------------
  // 32. diary_emotions（日記感情マスターデータ）✅ **2026年追加 - 日記の簡単記録**
  // ---------------------------------------------------------
  diary_emotions: defineTable({
    emotionId: v.string(), // 感情ID（例: "happy", "loving", "confused", "sad"）
    name: v.string(), // 感情名（例: "楽しい", "愛しい", "混乱", "悲しい"）
    icon: v.string(), // アイコン（絵文字）
    displayOrder: v.number(), // 表示順序
    isActive: v.boolean(), // 有効/無効
  })
    .index("by_active_order", ["isActive", "displayOrder"]),

  // ---------------------------------------------------------
  // 33. reaction_types（リアクションタイプマスターデータ）✅ **2026年追加 - 多機能リアクション**
  // ---------------------------------------------------------
  reaction_types: defineTable({
    reactionId: v.string(), // リアクションID（例: "heart", "sunflower", "muscle", "star", "rainbow"）
    name: v.string(), // リアクション名（例: "大好き", "癒やされた", "応援してる", "キラキラ", "虹の橋"）
    icon: v.string(), // アイコン（絵文字: ❤️, 🌻, 💪, 🌟, 🌈）
    displayOrder: v.number(), // 表示順序
    isActive: v.boolean(), // 有効/無効
  })
    .index("by_active_order", ["isActive", "displayOrder"]),

  // ---------------------------------------------------------
  // 34. context_stamps（コンテキストスタンプマスターデータ）✅ **2026年追加 - シーン+感情のセット**
  // ---------------------------------------------------------
  context_stamps: defineTable({
    stampId: v.string(), // スタンプID（例: "play_excited", "alone_sad"）
    name: v.string(), // スタンプ名（例: "遊び + 興奮", "お留守番 + 寂しい"）
    sceneIds: v.array(v.string()), // シーンIDの配列（diary_scenesのsceneIdを参照）
    emotionId: v.string(), // 感情ID（diary_emotionsのemotionIdを参照）
    icon: v.string(), // アイコン（絵文字）
    displayOrder: v.number(), // 表示順序
    isActive: v.boolean(), // 有効/無効
  })
    .index("by_active_order", ["isActive", "displayOrder"]),

  // ---------------------------------------------------------
  // 35. 法務ドキュメント（公式サイト用）✅ **2026年追加 - 公式サイト**
  // ---------------------------------------------------------
  legal_documents: defineTable({
    type: v.union(
      v.literal("privacy_policy"), // プライバシーポリシー
      v.literal("terms_of_service"), // 利用規約
      v.literal("specific_commercial_transactions"), // 特定商取引法に基づく表記
      v.literal("amazon_associate"), // Amazonアソシエイト規約
      v.literal("google_admob"), // Google AdMob規約
      v.literal("external_transmission") // 外部送信規約（電気通信事業法）
    ), // ドキュメントタイプ
    version: v.string(), // バージョン（例: "1.0", "2.0"）
    content: v.string(), // ドキュメントの本文（Markdown形式）
    effectiveDate: v.number(), // 効力発生日時
    createdAt: v.number(), // 作成日時
    updatedAt: v.number(), // 更新日時
    createdBy: v.id("users"), // 作成者（管理者）
  })
    .index("by_type", ["type", "effectiveDate"])
    .index("by_type_version", ["type", "version"]),
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

### 2. pets（ペット）

**目的**: ペットの基本情報とプロフィールを管理

**主要フィールド**:
- `ownerId`: 所有者（主管理者）。Phase 2では共同管理者も追加可能
- `species`: 種別。enumではなくstringで柔軟性を持たせる
- `breed`: 品種。オプショナルで「その他」にも対応
- `birthDate`: 誕生日（Unixタイムスタンプ）。年齢計算に使用 ✅ **自動算出機能**
- `visibility`: 公開設定。Phase 3のSNS機能で使用
- `deletion`: 削除状態（論理削除）。Convexのドキュメント指向な特性を活かした設計

**年齢計算**:
- `birthDate`から実年齢と人間換算年齢を自動算出
- `memorialStatus.deceasedDate`が設定されている場合、その日で年齢計算を停止（例：「14歳5ヶ月でお空へ」）
- 種別（`species`）に応じた適切な換算式を適用
  - 犬・猫: 1年目=15歳、2年目=+9歳、3年目以降=+4歳/年
  - 爬虫類: 1年目=10歳、2年目以降=+3歳/年
  - 鳥類: 1年目=12歳、2年目以降=+5歳/年
  - うさぎ・ハムスター: 1年目=18歳、2年目以降=+8歳/年
- 年齢計算ロジックは`packages/utils/src/petAge.ts`に集約（モバイルとWebで計算結果がズレることを防ぐ）

**メモリアルステータス（虹の橋を渡った場合）**:
- `memorialStatus`オブジェクトが存在する場合、ペットは「虹の橋を渡った」状態
- **設計思想**: 「記録の封印」ではなく「思い出の保護」という観点で設計
- **設計の哲学**: 「卒業」ではなく「永住」。ペットが亡くなった後は、「記録する場所」から**「いつでも会える場所」**へと役割を変える
- 記録を「入力」するボタンが消え、代わりにこれまでの思い出を「振り返る」ボタンに変わる
- ペットのアイコンに、優しく光る輪や淡い背景色を添える
- 年齢表示は命日で固定される（例：「14歳5ヶ月でお空へ」）
- `deceasedDate`: 命日（Unixタイムスタンプ）。この日で年齢計算を停止

**追悼（メモリアル）プラン** ✅ **2026年最終設計検証で追加**:
- ペットが亡くなり、新しい記録がなくなった後も、思い出（高画質画像）を見るために課金を続けなければならない問題を解決
- **提案**: 「追悼（メモリアル）プラン」の導入
  - 月額は無料または極安価にし、データの保持と閲覧だけを許可する「読み取り専用」の状態
  - あるいは、プレミアム会員だった期間のデータは、退会後も一定期間「最高画質」でエクスポート可能にするなどの配慮
- `users.subscription.tier`に`"memorial"`を追加
- `users.subscription.premiumPeriodEndsAt`でプレミアム会員だった最後の日時を記録し、その期間のデータは最高画質でエクスポート可能
- `message`: 飼い主からの最後の一言（オプション）
- `createdAt`: メモリアルモードに移行した日時

**インデックス**:
- `by_owner`: 所有者での検索（ペット一覧表示）
- `by_owner_active`: 所有者・削除状態での検索（アクティブなペットのみ取得）
- `by_species_breed`: 種別・品種での検索（検索機能）
- `search_bio`: 全文検索（自己紹介での検索）

**削除機能**:
- `deletion`オブジェクトが存在する場合、データは削除された状態
- デフォルトで30日間復元可能（`restorableUntil`フィールドで制御）
- 削除日時、削除者、削除理由が記録される

**使用例**:
```typescript
import { createDeletion } from "./lib/deletionSchema";

// ペット作成
await ctx.db.insert("pets", {
  ownerId: userId,
  name: "ポチ",
  species: "Dog",
  breed: "Husky",
  gender: "male",
  birthDate: Date.now() - 2 * 365.25 * 24 * 60 * 60 * 1000, // 2年前の誕生日
  isNeutered: false,
  visibility: "private",
});

// 年齢計算（フロントエンドまたはQueryで使用）
import { calculatePetAgeInfo, formatPetAgeDisplay } from "@repo/utils/petAge";

const pet = await ctx.db.get(petId);
if (pet && pet.birthDate) {
  const ageInfo = calculatePetAgeInfo(
    pet.birthDate, 
    pet.species,
    Date.now(),
    pet.memorialStatus?.deceasedDate // 命日が設定されている場合、その日で年齢計算を停止
  );
  if (ageInfo) {
    const isMemorial = !!pet.memorialStatus;
    console.log(formatPetAgeDisplay(ageInfo, isMemorial)); 
    // 通常: "2歳（人間換算: 約24歳）"
    // メモリアル: "14歳5ヶ月でお空へ"
  }
}

// メモリアルモードへの移行（虹の橋を渡る）
await ctx.db.patch(petId, {
  memorialStatus: {
    deceasedDate: Date.now(), // 命日
    message: "ありがとう、ポチ。いつも一緒にいてくれて。", // 飼い主からの最後の一言（オプション）
    createdAt: Date.now(),
  },
});

// ペット削除（論理削除）
await ctx.db.patch(petId, {
  deletion: createDeletion(userId, "誤操作", 30), // 30日間復元可能
});

// ペット復元
await ctx.db.patch(petId, {
  deletion: undefined, // 削除オブジェクトを削除することで復元
});

// アクティブなペットのみ取得
const activePets = await ctx.db
  .query("pets")
  .withIndex("by_owner_active", (q) => 
    q.eq("ownerId", userId).eq("deletion", undefined)
  )
  .collect();
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

// ペットアクセス権限チェック（AIチャットなどで使用）
export const checkAccess = query({
  args: {
    petId: v.id("pets"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const pet = await ctx.db.get(args.petId);
    if (!pet) return false;

    // 所有者かチェック
    if (pet.ownerId === args.userId) {
      return true;
    }

    // 共同管理者かチェック
    const member = await ctx.db
      .query("pet_members")
      .withIndex("by_pet", (q) => q.eq("petId", args.petId))
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    return !!member; // admin/editor/viewerのいずれでもアクセス可能
  },
});
```

---

### 5. images（画像・動画管理）✅ **Convexのプライシングを考慮した設計・Cloudflare R2移行**

**目的**: 画像・動画を一元管理し、プレミアム機能としての最高画質保存と画像編集機能を実現

**主要フィールド**:
- **メディアタイプ** ✅ **2026年追加**:
  - `mediaType`: 画像 or 動画（`v.union(v.literal("image"), v.literal("video"))`）
- **Cloudflare R2関連フィールド** ✅ **2026年追加**:
  - `r2Key`: R2上のパス（例: `pets/123/image_abc.webp`）
  - `r2Url`: カスタムドメイン経由のURL（例: `https://assets.your-pet-app.com/pets/123/image_abc.webp`）
  - `thumbnailR2Key`: サムネイルのR2キー（動画用、オプション）
  - `thumbnailR2Url`: サムネイルのURL（動画用、オプション）
- **動画関連フィールド** ✅ **2026年追加**:
  - `videoDuration`: 動画の長さ（秒、オプション）
  - `videoCodec`: コーデック（HEVC, AV1など、オプション）
  - `videoResolution`: 解像度（720p, 1080pなど、オプション）
- **後方互換性のため、既存のConvex Storage IDも保持**（移行期間中）:
  - `previewStorageId`: 表示用WebP（移行完了後に削除予定、オプション）
  - `originalStorageId`: 最高画質WebP（移行完了後に削除予定、オプション）
- **編集関連**:
  - `editMetadata`: 編集データ（プレミアムのみ：スタンプの位置や文字の内容）
  - `hasEdits`: 編集されているかどうか
  - `isPremiumAtUpload`: アップロード時のユーザー状態（プレミアムかどうか）

**インデックス**:
- `by_user`: ユーザーでの検索
- `by_pet`: ペットでの検索
- `by_activity`: 活動ログでの検索
- `by_user_active`: ユーザー・削除状態での検索（アクティブな画像のみ取得）

**画像・動画保存戦略** ✅ **2026年更新 - Cloudflare R2移行**:
- **画像**:
  - **無料ユーザー**: 累計50枚まで（約25MB）、表示用WebPのみ
  - **プレミアムユーザー**: 無制限、最高画質WebPも保存・表示可能
- **動画** ✅ **2026年追加**:
  - **無料ユーザー**: 1本あたり最大15秒、1ペットにつき月間3本まで、720p/HEVC（約15-20MB/分）
  - **プレミアムユーザー**: 1本あたり最大60秒、無制限、1080p/HEVC（約30-40MB/分）
- **編集機能**: 無料ユーザーは編集後の画像のみ保存、プレミアムユーザーは編集前・編集後の両方を保存（非破壊編集）
- **ストレージ**: Cloudflare R2を使用（下り通信料無料、CDN統合） ✅ **2026年追加**

**詳細**: `IMAGE_STORAGE_STRATEGY.md`、`CLOUDFLARE_R2_MIGRATION.md`を参照してください。

**使用例**:
```typescript
import { canUploadImage } from "./lib/imageLimits";

// 画像アップロード（Convex Action経由）
// フロントエンドでexpo-image-manipulatorを使用してWebP変換後、Actionを呼び出す
await ctx.runAction(api.images.upload, {
  petId: petId,
  activityId: activityId,
  previewFile: previewBase64, // 表示用WebP（500KB程度）
  originalFile: originalBase64, // 最高画質WebP（数MB）
  width: 1920,
  height: 1080,
  fileSizeOriginal: 2500000, // 2.5MB
  fileSizePreview: 500000, // 500KB
});

// 画像表示（プレミアム判定に応じて適切なstorageIdを使用）
const image = await ctx.db.get(imageId);
const user = await ctx.runQuery(api.users.getCurrentUser);
const isPremium = user.subscription.tier === "premium" && 
  (user.subscription.status === "active" || 
   user.subscription.status === "trialing");

const storageId = isPremium 
  ? image.originalStorageId 
  : image.previewStorageId;
const imageUrl = await ctx.storage.getUrl(storageId);

// 画像編集（プレミアムのみ：非破壊編集）
if (isPremium) {
  await ctx.db.patch(imageId, {
    editMetadata: {
      originalBeforeEditStorageId: image.originalStorageId,
      stamps: [{ type: "crown", x: 100, y: 200, scale: 1.0, rotation: 0 }],
      texts: [{ content: "ポチくん", x: 150, y: 250, fontSize: 24, color: "#FFFFFF", fontFamily: "Arial" }],
    },
    hasEdits: true,
  });
}
```

---

### 6. activities（活動ログ）

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

**トイレ記録（type: "toilet"）のpayload構造** ✅ **2026年更新 - 種別ごとの詳細な状態情報**:
- `toiletType`: "pee"（おしっこ）または"poo"（うんち）
- `generalCondition`: 全種共通の基本的な状態（"excellent" / "unusual" / "abnormal"）
- `stoolCondition`: 便の状態（犬・猫・うさぎ・ハムスター用）
  - `hardness`: 硬さ（"hard", "normal", "soft", "muddy", "watery"）
  - `hasBlood`: 血便あり（boolean）
  - `hasForeignObject`: 異物混入（boolean）
  - `foreignObjectType`: 異物の種類（"toy", "hairball"など）
- `stoolSizeAndCount`: 便の数・大きさ（うさぎ・ハムスター用）
  - `size`: "large"（大きいフンがたっぷり）または"small"（小さいフン）
  - `count`: "plenty"（たっぷり）または"few"（数が少ない）
- `cecotrope`: 盲腸便（うさぎ限定）
  - `status`: "normal"（正常、自分で食べた）または"leftover"（食べ残しあり）
  - `isLinked`: 毛で繋がったフン（boolean、換毛期の毛球症予防）
- `urineCondition`: 尿の状態（犬・猫用）
  - `amount`: "low"（少ない）/ "normal"（普通）/ "high"（多い）
  - `color`: "light"（薄い）/ "normal"（普通）/ "dark"（濃い）/ "bloody"（血尿）
- `excretionColor`: 排泄物の色（鳥類・爬虫類用、"green", "brown", "black"）
- `uricAcid`: 尿酸の状態（鳥類・爬虫類用）
  - `color`: "white"（正常）/ "yellow"（黄色）/ "green"（緑色）
  - `texture`: "normal"（正常）/ "solid"（固形）/ "gritty"（ザラザラ）
- `moistureLevel`: 水分量（鳥類・爬虫類用、"normal" / "polyuria"（多尿））
- `cleaningActions`: 清掃アクションの配列（全種共通、cleaning_action_mastersのactionIdを参照）
- `condition`: 後方互換性のため残す（既存データとの互換性）

**日記記録（type: "diary"）のpayload構造** ✅ **2026年追加 - シーン・感情・タグによる簡単記録**:
- `text`: 日記本文（オプション、テキストなしでも記録可能）
- `scenes`: シーンIDの配列（diary_scenesのsceneIdを参照）
  - 例: `["walk", "play"]`（お散歩と遊び）
  - シーン例: "walk"（お散歩）、"nap"（お昼寝）、"play"（遊び）、"meal"（食事）、"clinic"（通院）、"grooming"（お手入れ）、"alone"（お留守番）
- `emotion`: 感情ID（diary_emotionsのemotionIdを参照）
  - 例: "happy"（楽しい😊）、"loving"（愛しい🥰）、"confused"（混乱😵）、"sad"（悲しい😢）
- `timeOfDay`: 時間帯（オプション）
  - "morning"（朝）、"noon"（昼）、"evening"（夕方）、"night"（夜）、"midnight"（深夜）
- `location`: 場所（オプション）
  - "home"（おうち）、"park"（公園）、"dog_run"（ドッグラン）、"clinic"（病院）、"travel"（旅先）
- `contextStamp`: コンテキストスタンプID（オプション、シーン+感情のセット）
  - 例: "play_excited"（遊び + 興奮😆）、"alone_sad"（お留守番 + 寂しい🥺）
  - コンテキストスタンプを使用すると、`scenes`と`emotion`が自動で設定される

**使用例**:
```typescript
// 日記記録（シーンと感情のみ、テキストなし）
await ctx.db.insert("activities", {
  petId: petId,
  createdBy: userId,
  loggedAt: Date.now(),
  type: "diary",
  payload: {
    scenes: ["walk", "play"],
    emotion: "happy",
    timeOfDay: "evening",
    location: "park",
  },
  isPublic: false,
  likeCount: 0,
});

// 日記記録（コンテキストスタンプ使用）
await ctx.db.insert("activities", {
  petId: petId,
  createdBy: userId,
  loggedAt: Date.now(),
  type: "diary",
  payload: {
    contextStamp: "play_excited", // シーンと感情が自動で設定される
    text: "今日は公園でめちゃくちゃ遊んだ！",
  },
  isPublic: false,
  likeCount: 0,
});

// 日記記録（テキストのみ、従来の形式もサポート）
await ctx.db.insert("activities", {
  petId: petId,
  createdBy: userId,
  loggedAt: Date.now(),
  type: "diary",
  payload: {
    text: "今日はお散歩に行きました。",
  },
  isPublic: false,
  likeCount: 0,
});

// 日記のフィルタリング（シーンと感情で検索）
const diaryActivities = await ctx.db
  .query("activities")
  .withIndex("by_pet_active", (q) => 
    q.eq("petId", petId).eq("deletion", undefined)
  )
  .filter((q) => 
    q.and(
      q.eq(q.field("type"), "diary"),
      q.or(
        // シーンでフィルター
        q.field("payload.scenes").includes("walk"),
        // 感情でフィルター
        q.eq(q.field("payload.emotion"), "happy")
      )
    )
  )
  .order("desc")
  .collect();
```

**インデックス**:
- `by_pet_date`: ペット・日時での検索（タイムライン表示）
- `by_pet_active`: ペット・削除状態での検索（アクティブなログのみ取得）
- `by_public_feed`: 公開フィード用（Phase 3）

**日記フィルタリング** ✅ **2026年追加 - シーン・感情・時間帯・場所での検索**:
- 日記のフィルタリングは`by_pet_active`インデックスを使用し、`filter`でシーン、感情、時間帯、場所を絞り込む
- 例: シーン「お散歩」と感情「楽しい」の日記を検索
  ```typescript
  const diaryActivities = await ctx.db
    .query("activities")
    .withIndex("by_pet_active", (q) => 
      q.eq("petId", petId).eq("deletion", undefined)
    )
    .filter((q) => 
      q.and(
        q.eq(q.field("type"), "diary"),
        q.field("payload.scenes").includes("walk"),
        q.eq(q.field("payload.emotion"), "happy")
      )
    )
    .order("desc")
    .collect();
  ```

**削除機能**:
- `deletion`オブジェクトが存在する場合、データは削除された状態
- デフォルトで30日間復元可能
- 削除日時、削除者、削除理由が記録される

**使用例**:
```typescript
import { createDeletion } from "./lib/deletionSchema";

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

// 活動ログ削除（論理削除）
await ctx.db.patch(activityId, {
  deletion: createDeletion(userId, "データ整理", 30),
});

// 活動ログ復元
await ctx.db.patch(activityId, {
  deletion: undefined,
});

// アクティブな活動ログのみ取得
const activeActivities = await ctx.db
  .query("activities")
  .withIndex("by_pet_active", (q) => 
    q.eq("petId", petId).eq("deletion", undefined)
  )
  .order("desc")
  .collect();

  // 前回の食事記録を取得（食事記録画面のデフォルト値用）✅ **2026年追加**
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7日前
  const lastFeedingActivity = await ctx.db
    .query("activities")
    .withIndex("by_pet_active", (q) => 
      q.eq("petId", petId).eq("deletion", undefined)
    )
    .filter((q) => 
      q.and(
        q.eq(q.field("type"), "food"),
        q.gte(q.field("loggedAt"), sevenDaysAgo) // 7日以内の記録のみ
      )
    )
    .order("desc")
    .first();

  if (lastFeedingActivity && lastFeedingActivity.payload.foodId) {
    // 商品情報も取得
    const product = await ctx.db.get(lastFeedingActivity.payload.foodId);
    const defaultValues = {
      foodId: lastFeedingActivity.payload.foodId,
      foodName: product?.name,
      amount: lastFeedingActivity.payload.amount,
    };
    // デフォルト値として使用
  }

// リマインダーの作成と完了 ✅ **2026年追加**
// プリセットからリマインダーを作成
const reminderId = await ctx.db.insert("reminders", {
  userId: userId,
  petId: petId,
  categoryId: "cage_wash",
  schedule: {
    frequency: "weekly",
    daysOfWeek: [0, 6], // 日曜日と土曜日
    time: "09:00",
  },
  completionRequirement: "check_only",
  rewardPoints: 10,
  isEnabled: true,
  nextNotificationAt: calculateNextNotificationAt({
    frequency: "weekly",
    daysOfWeek: [0, 6],
    time: "09:00",
  }),
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

// リマインダーを完了
await ctx.db.insert("reminder_logs", {
  reminderId: reminderId,
  petId: petId,
  userId: userId,
  completedAt: Date.now(),
  completionMethod: "reminder_notification",
  pointsAwarded: 10,
});

// 次回の通知日時を更新
await ctx.db.patch(reminderId, {
  lastCompletedAt: Date.now(),
  nextNotificationAt: calculateNextNotificationAt({
    frequency: "weekly",
    daysOfWeek: [0, 6],
    time: "09:00",
    lastCompletedAt: Date.now(),
  }),
  updatedAt: Date.now(),
});

// トイレ記録からリマインダーを自動完了 ✅ **2026年追加**
// ユーザーが「トイレ記録」で「ケージ掃除」を記録した場合
const toiletActivityId = await ctx.db.insert("activities", {
  petId: petId,
  createdBy: userId,
  loggedAt: Date.now(),
  type: "toilet",
  payload: {
    toiletType: "poo",
    cleaningActions: ["cage_full"], // ケージ丸洗いを記録
  },
  isPublic: false,
  likeCount: 0,
});

// 関連するリマインダーを検索して自動完了
const todayReminders = await ctx.db
  .query("reminders")
  .withIndex("by_pet_enabled", (q) => 
    q.eq("petId", petId).eq("isEnabled", true)
  )
  .filter((q) => 
    q.and(
      q.eq(q.field("categoryId"), "cage_wash"), // ケージ掃除のリマインダー
      q.lte(q.field("nextNotificationAt"), Date.now()) // 今日のリマインダー
    )
  )
  .collect();

for (const reminder of todayReminders) {
  // リマインダーを自動完了
  await ctx.db.insert("reminder_logs", {
    reminderId: reminder._id,
    petId: petId,
    userId: userId,
    completedAt: Date.now(),
    completionMethod: "auto_from_activity",
    relatedActivityId: toiletActivityId,
    pointsAwarded: reminder.rewardPoints,
  });

  // 次回の通知日時を更新
  await ctx.db.patch(reminder._id, {
    lastCompletedAt: Date.now(),
    nextNotificationAt: calculateNextNotificationAt({
      frequency: reminder.schedule.frequency,
      daysOfWeek: reminder.schedule.daysOfWeek,
      time: reminder.schedule.time,
      lastCompletedAt: Date.now(),
    }),
    updatedAt: Date.now(),
  });
}
```

---

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

### 9. follows（フォロー関係）

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

### 10. likes（いいね・リアクション）✅ **2026年更新 - 多機能リアクション**

**目的**: Phase 3で実装。投稿へのいいね・リアクションを管理

**主要フィールド**:
- `userId`: リアクションしたユーザー
- `activityId`: リアクションされた投稿（activities）
- `reactionType`: リアクションタイプ（reaction_typesのreactionIdを参照）✅ **2026年追加**
  - `"heart"`: ❤️ 大好き/共感
  - `"sunflower"`: 🌻 癒やされた
  - `"muscle"`: 💪 応援してる/頑張れ
  - `"star"`: 🌟 キラキラした瞬間
  - `"rainbow"`: 🌈 虹の橋のあちら側への祈り/想い
- `createdAt`: リアクション日時

**専門家のリアクション機能**:
- `users`テーブルの`isExpert`フラグが`true`のユーザーがリアクションした場合、投稿に「獣医師が推奨」などの特別なバッジが表示される
- 専門家のリアクションは通常のリアクションとは区別され、おすすめフィードで優先的に表示される

**インデックス**:
- `by_activity`: 投稿ごとのリアクション一覧（リアクション数カウント）
- `by_user_activity`: ユーザーがリアクションしたかどうかの確認（重複防止）
- `by_user`: ユーザーがリアクションした投稿一覧
- `by_activity_reaction`: 投稿・リアクションタイプでの検索 ✅ **2026年追加**（リアクションタイプ別の集計用）

**使用例**:
```typescript
// リアクション（ハート）
await ctx.db.insert("likes", {
  userId: currentUserId,
  activityId: activityId,
  reactionType: "heart", // ✅ **2026年追加**
  createdAt: Date.now(),
});

// リアクション（虹の橋）
await ctx.db.insert("likes", {
  userId: currentUserId,
  activityId: activityId,
  reactionType: "rainbow", // ✅ **2026年追加**
  createdAt: Date.now(),
});

// リアクション解除
await ctx.db.delete(likeId);

// 投稿ごとのリアクション集計
const reactions = await ctx.db
  .query("likes")
  .withIndex("by_activity_reaction", (q) => 
    q.eq("activityId", activityId)
  )
  .collect();

const reactionCounts = reactions.reduce((acc, reaction) => {
  acc[reaction.reactionType] = (acc[reaction.reactionType] || 0) + 1;
  return acc;
}, {} as Record<string, number>);
```

---

### 11. articles（コラム・記事）

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

### 12. chat_threads（AIチャットスレッド）

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
// チャットスレッド作成（権限チェック付き）
import { getCurrentUser } from "./lib/permissions";
import { api } from "./_generated/api";

export const createThread = mutation({
  args: {
    petId: v.id("pets"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    // ペットアクセス権限チェック
    const hasAccess = await ctx.runQuery(api.pets.checkAccess, {
      petId: args.petId,
      userId: currentUser._id,
    });
    if (!hasAccess) {
      throw new Error("このペットへのアクセス権限がありません");
    }

    // スレッド作成
    const threadId = await ctx.db.insert("chat_threads", {
      userId: currentUser._id, // ✅ 現在のユーザーIDを使用
      petId: args.petId,
  createdAt: Date.now(),
    });

    return threadId;
  },
});
```

---

### 13. chat_messages（AIチャットメッセージ）

**目的**: AI相談のメッセージ履歴を管理

**主要フィールド**:
- `threadId`: スレッドID
- `role`: メッセージの役割（user/assistant）
- `content`: メッセージ内容
- `citedSources`: 引用した知識ベースのID配列
- `disclaimerShown`: 免責事項を表示したかどうかのフラグ ✅ **免責事項管理**
- `disclaimerType`: 免責事項の種類（general/medical/food/emergency） ✅ **免責事項管理**

**インデックス**:
- `by_thread`: スレッドでの検索（メッセージ一覧）

**免責事項の種類**:
- `general`: 一般的な免責事項（初回利用時など）
- `medical`: 医療・健康に関する免責事項（症状、病気、治療など）
- `food`: 食事・栄養に関する免責事項（フード、サプリメントなど）
- `emergency`: 緊急時の免責事項（誤飲、事故など）

**使用例**:
```typescript
// ユーザーメッセージ作成
await ctx.db.insert("chat_messages", {
  threadId: threadId,
  role: "user",
  content: "最近食欲がないみたい",
});

// AI応答作成（免責事項フラグ付き）
await ctx.db.insert("chat_messages", {
  threadId: threadId,
  role: "assistant",
  content: "ポチくんの記録を見ると...",
  citedSources: [knowledgeId1, knowledgeId2],
  disclaimerShown: true, // ✅ 免責事項を表示
  disclaimerType: "medical", // ✅ 医療に関する免責事項
});
```

---

### 14. albums（アルバム）

**目的**: 日記や写真をテーマ別に整理し、思い出をまとめる

**主要フィールド**:
- `userId`: 作成者
- `petId`: 対象のペット
- `title`: アルバムタイトル（例：「初めてのドッグラン」「5歳の誕生日」）
- `description`: アルバムの説明（オプション）
- `coverImageId`: 表紙画像のID（オプション）
- `isPremium`: プレミアム限定アルバムかどうかのフラグ（作成時のユーザーステータス）
- `createdAt`: 作成日時
- `updatedAt`: 最終更新日時

**インデックス**:
- `by_user_pet`: ユーザー・ペットでの検索
- `by_user`: ユーザーでの検索

**機能制限**:
- **無料ユーザー**: 最大2つまで作成可能、1アルバム20枚まで
- **プレミアムユーザー**: 無制限、共同編集可能

**使用例**:
```typescript
// アルバム作成
const albumId = await ctx.db.insert("albums", {
  userId: userId,
  petId: petId,
  title: "初めてのドッグラン",
  description: "2024年春、初めてドッグランに連れて行った時の思い出",
  coverImageId: imageId,
  isPremium: user.subscription.tier === "premium",
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

// アルバムに活動ログ（日記）を追加
await ctx.db.insert("album_items", {
  albumId: albumId,
  activityId: activityId,
  order: 1,
  addedAt: Date.now(),
});

// アルバムに画像を追加
await ctx.db.insert("album_items", {
  albumId: albumId,
  imageId: imageId,
  order: 2,
  addedAt: Date.now(),
});
```

---

### 15. album_items（アルバムアイテム）

**目的**: アルバムとコンテンツ（活動ログ・画像）を紐付ける中間テーブル

**主要フィールド**:
- `albumId`: アルバムID
- `activityId`: 活動ログ（日記など）への参照（オプション）
- `imageId`: 画像への参照（オプション）
- `order`: アルバム内での表示順
- `addedAt`: 追加日時

**インデックス**:
- `by_album`: アルバムでの検索（アルバム内のアイテム一覧）
- `by_activity`: 活動ログでの検索（この活動ログがどのアルバムに含まれているか）
- `by_image`: 画像での検索（この画像がどのアルバムに含まれているか）

**使用例**:
```typescript
// アルバム内のアイテム一覧を取得
const items = await ctx.db
  .query("album_items")
  .withIndex("by_album", (q) => q.eq("albumId", albumId))
  .order("asc")
  .collect();

// 各アイテムの詳細を取得
for (const item of items) {
  if (item.activityId) {
    const activity = await ctx.db.get(item.activityId);
    // 活動ログの内容を表示
  }
  if (item.imageId) {
    const image = await ctx.db.get(item.imageId);
    // 画像を表示
  }
}
```

---

### 16. premium_cancellation_reasons（プレミアム解除理由）

**目的**: プレミアム解除時の理由を収集し、サービス改善に活用

**主要フィールド**:
- `userId`: ユーザーID
- `reason`: 解除理由（features_sufficient/budget_review/free_satisfied/too_complex）
- `comment`: 自由記述（オプション）
- `createdAt`: 作成日時

**インデックス**:
- `by_user`: ユーザーでの検索
- `by_reason`: 理由別の集計用

**使用例**:
```typescript
// プレミアム解除理由を記録
await ctx.db.insert("premium_cancellation_reasons", {
  userId: userId,
  reason: "free_satisfied",
  comment: "無料版で十分満足しています",
  createdAt: Date.now(),
});
```

---

### 17. account_deletion_reasons（退会理由）

**目的**: アカウント削除時の理由を収集し、サービス改善に活用

**主要フィールド**:
- `userId`: ユーザーID
- `reason`: 退会理由（lifestyle_change/other_method/notifications_issue/usage_confusion）
- `comment`: 自由記述（オプション）
- `createdAt`: 作成日時

**インデックス**:
- `by_user`: ユーザーでの検索
- `by_reason`: 理由別の集計用

**設計思想**: 
- **「お別れ」という項目は含めない**（常に前向きに成長や日々の記録を祝うアプリのスタンス）
- 離脱時も温かく対応し、サービス改善に貢献できるようにする

**使用例**:
```typescript
// 退会理由を記録
await ctx.db.insert("account_deletion_reasons", {
  userId: userId,
  reason: "need_break", // 今は少しアプリ（記録）から離れたい
  comment: "心が落ち着いたらまた戻ってきます",
  createdAt: Date.now(),
});

// 「今は少しアプリ（記録）から離れたい」を選択した際のAIメッセージ
// 「これまで〇〇ちゃんと一緒に歩んできた記録は、私たちが大切に保管しておきます。
// 心が落ち着いたとき、いつでもまた会いに来てくださいね」
```

---

### 18. curations（管理者厳選のキュレーション）✅ **外部記事の紹介**

**目的**: 管理者が厳選した外部記事を紹介し、ユーザーに価値ある情報を提供する

**主要フィールド**:
- `title`: 記事のタイトル
- `summary`: 管理者による紹介文（「この記事のここがレオくんに役立つかも！」など、アプリの独自価値）
- `sourceName`: 掲載元（例: 「ペット健康ドットコム」）
- `url`: 外部URL（サニタイズ済み）
- `thumbnailUrl`: サムネイル画像URL（オプション）
- `thumbnailStorageId`: Convex StorageのID（推奨：パフォーマンス向上）
- `category`: カテゴリ（health/food/lifestyle/care/emergency）
- `targetSpecies`: 対象ペット種別（複数選択可能）
- `isPremium`: プレミアム会員限定の厳選記事かどうか
- `publishedAt`: 公開日時
- `createdBy`: 作成者（管理者）

**インデックス**:
- `by_published`: 公開日時での検索（新しい順）
- `by_category`: カテゴリでの検索
- `by_premium`: プレミアム制限での検索
- `by_active`: アクティブなキュレーションのみ取得

**機能制限**:
- **無料ユーザー**: 記事のタイトルと要約（summary）まで閲覧可能
- **プレミアムユーザー**: 外部記事へのアクセスと、その記事に基づいた「AIアドバイス」の受領が可能

**使用例**:
```typescript
// キュレーション作成（管理者）
const curationId = await ctx.db.insert("curations", {
  title: "高齢犬の食事管理ガイド",
  summary: "この記事では、14歳以上の高齢犬に必要な栄養素と食事のタイミングについて詳しく解説しています。レオくんのような高齢犬の飼い主さんに特におすすめです。",
  sourceName: "ペット健康ドットコム",
  url: "https://example.com/senior-dog-food-guide",
  thumbnailStorageId: thumbnailStorageId, // Convex Storageに保存済み
  category: "food",
  targetSpecies: ["Dog"],
  isPremium: false, // 無料ユーザーも閲覧可能
  publishedAt: Date.now(),
  createdAt: Date.now(),
  createdBy: adminUserId,
});

// キュレーション一覧取得（カテゴリ別、新しい順）
const curations = await ctx.db
  .query("curations")
  .withIndex("by_category", (q) => q.eq("category", "food"))
  .filter((q) => q.eq(q.field("deletion"), undefined)) // アクティブなもののみ
  .order("desc")
  .collect();

// ユーザーが「あとで読む」に追加
await ctx.db.insert("curation_interactions", {
  userId: userId,
  curationId: curationId,
  interactionType: "read_later",
  createdAt: Date.now(),
});
```

---

### 19. curation_interactions（キュレーションインタラクション）

**目的**: ユーザーとキュレーションのインタラクション（「あとで読む」「アルバム保存」など）を管理

**主要フィールド**:
- `userId`: ユーザーID
- `curationId`: キュレーションID
- `interactionType`: インタラクションの種類（read_later/saved_to_album/shared/viewed）
- `albumId`: アルバムに保存した場合のアルバムID（オプション）
- `createdAt`: 作成日時

**インデックス**:
- `by_user`: ユーザーでの検索（ユーザーの「あとで読む」一覧など）
- `by_curation`: キュレーションでの検索（この記事を保存したユーザー数など）
- `by_user_curation`: ユーザー・キュレーションでの検索（重複防止）

**使用例**:
```typescript
// ユーザーの「あとで読む」一覧を取得
const readLaterList = await ctx.db
  .query("curation_interactions")
  .withIndex("by_user", (q) => q.eq("userId", userId))
  .filter((q) => q.eq(q.field("interactionType"), "read_later"))
  .order("desc")
  .collect();

// アルバムに保存
await ctx.db.insert("curation_interactions", {
  userId: userId,
  curationId: curationId,
  interactionType: "saved_to_album",
  albumId: albumId,
  createdAt: Date.now(),
});
```

---

### 20. toilet_condition_masters（トイレ記録用マスターデータ）✅ **2026年追加 - 種別ごとの選択肢**

**目的**: ペットの種類ごとに最適化された選択肢を管理するマスターデータ。管理者のみが登録可能。

**主要フィールド**:
- `targetSpecies`: 対象種別（空配列の場合は全種共通）
- `category`: カテゴリ（general_condition, stool_condition, urine_condition, excretion_color, uric_acid, cecotrope）
- `optionId`: 選択肢のID（一意の識別子）
- `displayName`: 表示名（日本語）
- `icon`: アイコンまたは絵文字（UI表示用）
- `severity`: 異常度（0-5、0が正常、5が最も異常）
- `displayOrder`: 表示順序

**インデックス**:
- `by_species_category`: 種別・カテゴリでの検索
- `by_category`: カテゴリでの検索
- `by_active`: 有効な選択肢のみ取得

**使用例**:
```typescript
// 犬・猫用の便の状態マスターデータ（管理者のみ登録）
await ctx.db.insert("toilet_condition_masters", {
  targetSpecies: ["Dog", "Cat"],
  category: "stool_condition",
  optionId: "stool_hard",
  displayName: "カチカチ（コロコロして硬い）",
  icon: "💩",
  description: "コロコロして硬い便。水分不足の可能性があります。",
  severity: 1, // 注意レベル
  displayOrder: 1,
  isActive: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  createdBy: adminUserId,
});

// うさぎ用の盲腸便マスターデータ
await ctx.db.insert("toilet_condition_masters", {
  targetSpecies: ["Rabbit"],
  category: "cecotrope",
  optionId: "cecotrope_leftover",
  displayName: "食べ残しあり",
  icon: "⚠️",
  description: "栄養過多や肥満、加齢のサインの可能性があります。",
  severity: 2, // 要観察レベル
  displayOrder: 2,
  isActive: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  createdBy: adminUserId,
});
```

---

### 21. cleaning_action_masters（清掃アクションマスターデータ）✅ **2026年追加 - 全種共通**

**目的**: 清掃アクションのマスターデータ。全種共通または種別ごとに定義。管理者のみが登録可能。

**主要フィールド**:
- `actionId`: アクションID（一意の識別子）
- `displayName`: 表示名（日本語）
- `icon`: アイコン（UI表示用）
- `targetSpecies`: 対象種別（空配列の場合は全種共通）
- `points`: 獲得ポイント（清掃アクション実行時に付与）

**インデックス**:
- `by_species`: 種別での検索
- `by_active`: 有効なアクションのみ取得

**使用例**:
```typescript
// 全種共通の清掃アクション
await ctx.db.insert("cleaning_action_masters", {
  actionId: "toilet_partial",
  displayName: "トイレ掃除（部分）",
  icon: "🧹",
  targetSpecies: [], // 全種共通
  points: 5,
  displayOrder: 1,
  isActive: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  createdBy: adminUserId,
});
```

---

### 22. reminder_category_masters（リマインダーカテゴリマスターデータ）✅ **2026年追加 - 種別ごとのプリセット**

**目的**: ペットの種類ごとに最適化されたリマインダーカテゴリを管理するマスターデータ。管理者のみが登録可能。

**主要フィールド**:
- `targetSpecies`: 対象種別（空配列の場合は全種共通）
- `categoryId`: カテゴリID（一意の識別子）
- `displayName`: 表示名（日本語）
- `icon`: アイコン（UI表示用）
- `defaultFrequency`: 推奨頻度の初期値
- `defaultTime`: 推奨時間の初期値（HH:MM形式）
- `defaultPoints`: デフォルトのポイント

**インデックス**:
- `by_species`: 種別での検索
- `by_active`: 有効なカテゴリのみ取得

**使用例**:
```typescript
// 犬用のリマインダーカテゴリ（管理者のみ登録）
await ctx.db.insert("reminder_category_masters", {
  targetSpecies: ["Dog"],
  categoryId: "tooth_brushing",
  displayName: "歯磨き",
  icon: "🦷",
  description: "歯の健康を保つために定期的に歯磨きを行います",
  defaultFrequency: "daily",
  defaultTime: "20:00",
  defaultPoints: 5,
  displayOrder: 1,
  isActive: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  createdBy: adminUserId,
});

// 爬虫類用のリマインダーカテゴリ
await ctx.db.insert("reminder_category_masters", {
  targetSpecies: ["Reptile"],
  categoryId: "misting",
  displayName: "霧吹き（加湿）",
  icon: "💧",
  description: "湿度を保つために定期的に霧吹きを行います",
  defaultFrequency: "daily",
  defaultTime: "09:00",
  defaultPoints: 3,
  displayOrder: 2,
  isActive: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  createdBy: adminUserId,
});
```

---

### 23. reminders（リマインダー設定）✅ **2026年追加 - 掃除のタイマー・リマインダー**

**目的**: ユーザーが設定したリマインダーを管理。ペットの種類ごとのプリセットとカスタム設定の両方に対応。

**主要フィールド**:
- `userId`: ユーザーID
- `petId`: ペットID
- `categoryId`: カテゴリID（reminder_category_mastersのcategoryId、または "custom"）
- `customTitle`: カスタム設定時のテキスト
- `customIcon`: カスタム設定時のアイコン
- `schedule`: スケジュール設定
  - `frequency`: 頻度（daily, weekly, biweekly, monthly, interval）
  - `intervalDays`: 間隔日数（frequency: "interval"の時のみ）
  - `daysOfWeek`: 曜日指定（0-6、日曜日=0）
  - `dayOfMonth`: 毎月の日付指定（1-31、frequency: "monthly"の時のみ）
  - `time`: 時間（"20:30"形式）
- `completionRequirement`: 完了条件（check_only, photo_required）
- `rewardPoints`: 完了時に付与するポイント
- `isEnabled`: 有効/無効フラグ
- `lastCompletedAt`: 最後に完了した日時
- `nextNotificationAt`: 次回の通知予定日時（計算済み）

**インデックス**:
- `by_pet_enabled`: ペット・有効状態での検索
- `by_user`: ユーザーでの検索
- `by_next_notification`: 次回通知日時での検索（Cronジョブ用）

**使用例**:
```typescript
// プリセットからリマインダーを作成
await ctx.db.insert("reminders", {
  userId: userId,
  petId: petId,
  categoryId: "cage_wash",
  schedule: {
    frequency: "weekly",
    daysOfWeek: [0, 6], // 日曜日と土曜日
    time: "09:00",
  },
  completionRequirement: "check_only",
  rewardPoints: 10,
  isEnabled: true,
  nextNotificationAt: calculateNextNotificationAt({
    frequency: "weekly",
    daysOfWeek: [0, 6],
    time: "09:00",
  }),
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

// カスタムリマインダーを作成
await ctx.db.insert("reminders", {
  userId: userId,
  petId: petId,
  categoryId: "custom",
  customTitle: "サプリメントの添加",
  customIcon: "💊",
  schedule: {
    frequency: "interval",
    intervalDays: 3, // 3日おき
    time: "20:00",
  },
  completionRequirement: "check_only",
  rewardPoints: 5,
  isEnabled: true,
  nextNotificationAt: calculateNextNotificationAt({
    frequency: "interval",
    intervalDays: 3,
    time: "20:00",
  }),
  createdAt: Date.now(),
  updatedAt: Date.now(),
});
```

---

### 24. reminder_logs（リマインダー完了履歴）✅ **2026年追加 - 完了記録とポイント付与**

**目的**: リマインダーの完了履歴を記録。ポイント付与の根拠にもなる。

**主要フィールド**:
- `reminderId`: リマインダーID
- `petId`: ペットID
- `userId`: ユーザーID
- `completedAt`: 完了日時
- `completionMethod`: 完了方法（reminder_notification, manual, auto_from_activity）
- `relatedActivityId`: 関連する活動ログID（トイレ記録などから自動完了した場合）
- `photoId`: 写真ID（photo_requiredの場合）
- `memo`: メモ
- `pointsAwarded`: 付与されたポイント

**インデックス**:
- `by_reminder`: リマインダーでの検索
- `by_pet`: ペットでの検索
- `by_user`: ユーザーでの検索
- `by_completed_at`: 完了日時での検索

**使用例**:
```typescript
// リマインダーを完了
await ctx.db.insert("reminder_logs", {
  reminderId: reminderId,
  petId: petId,
  userId: userId,
  completedAt: Date.now(),
  completionMethod: "reminder_notification",
  pointsAwarded: 10,
});

// トイレ記録から自動完了
await ctx.db.insert("reminder_logs", {
  reminderId: reminderId,
  petId: petId,
  userId: userId,
  completedAt: Date.now(),
  completionMethod: "auto_from_activity",
  relatedActivityId: activityId, // トイレ記録のID
  pointsAwarded: 10,
});

// タイムライン統合用のリマインダー完了記録取得（実装例）
// 活動ログとリマインダー完了記録を時系列で統合
const activities = await ctx.db
  .query("activities")
  .withIndex("by_pet_active", (q) =>
    q.eq("petId", petId).eq("deletion", undefined)
  )
  .filter((q) =>
    q.and(
      q.gte(q.field("loggedAt"), startDate),
      q.lte(q.field("loggedAt"), endDate),
      types.length > 0 ? q.or(...types.map((t) => q.eq(q.field("type"), t))) : q.neq(q.field("type"), "none")
    )
  )
  .order("desc")
  .collect();

const reminderLogs = await ctx.db
  .query("reminder_logs")
  .withIndex("by_pet", (q) => q.eq("petId", petId))
  .filter((q) =>
    q.and(
      q.gte(q.field("completedAt"), startDate),
      q.lte(q.field("completedAt"), endDate)
    )
  )
  .order("desc")
  .collect();

// 活動ログとリマインダー完了記録を統合して時系列でソート
const timelineItems = [
  ...activities.map((a) => ({ ...a, itemType: "activity" })),
  ...reminderLogs.map((r) => {
    const reminder = await ctx.db.get(r.reminderId);
    return {
      id: r._id,
      itemType: "reminder",
      loggedAt: r.completedAt,
      reminderId: r.reminderId,
      reminderTitle: reminder?.categoryId === "custom" ? reminder.customTitle : reminder?.categoryId,
      completedAt: r.completedAt,
      isCompleted: true,
      pointsAwarded: r.pointsAwarded,
    };
  }),
].sort((a, b) => b.loggedAt - a.loggedAt);
```

---

### 25. knowledge_base（知識ベース）

---

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

### 27. badge_definitions（バッジ定義）✅ **ゲーミフィケーション要素（2026年追加）**

**目的**: バッジの定義を管理。管理者のみが登録可能。バッジは「金で買えない名誉」として設計。

**主要フィールド**:
- `id`: バッジID（例: "health_guardian_30days"）
- `name`: バッジ名（例: "健康の守護者"）
- `description`: バッジの説明（例: "トイレと餌の記録を連続30日達成"）
- `iconUrl`: バッジアイコンのURL（Convex StorageのID）
- `category`: バッジカテゴリ（health/care/social/achievement）
- `condition`: 獲得条件
  - `type`: 条件タイプ（例: "consecutive_days", "total_count"）
  - `value`: 条件値（例: 30日、100件）
  - `activityTypes`: 対象となる活動タイプ（例: ["toilet", "feeding"]）
- `isGlobal`: グローバル表示（他のユーザーにも見える）かどうか

**インデックス**:
- `by_category`: カテゴリでの検索

**使用例**:
```typescript
// バッジ定義の作成（管理者のみ）
await ctx.db.insert("badge_definitions", {
  id: "health_guardian_30days",
  name: "健康の守護者",
  description: "トイレと餌の記録を連続30日達成",
  iconUrl: "storageId_xxx",
  category: "health",
  condition: {
    type: "consecutive_days",
    value: 30,
    activityTypes: ["toilet", "feeding"],
  },
  isGlobal: true, // 他のユーザーにも見える
  createdAt: Date.now(),
});
```

---

### 28. point_history（ポイント獲得履歴）✅ **ゲーミフィケーション要素（2026年追加）**

**目的**: ポイントの獲得・消費履歴を記録（監査用）。不正防止と透明性の確保。

**主要フィールド**:
- `userId`: ユーザーID
- `points`: 獲得/消費ポイント数（正の値: 獲得、負の値: 消費）
- `reason`: 理由（例: "feeding_logged", "toilet_logged", "journal_created", "asset_purchased"）
- `activityId`: 関連する活動ID（ポイント獲得の場合）
- `assetId`: 関連するアイテムID（ポイント消費の場合）
- `badgeId`: 関連するバッジID（バッジ獲得時のボーナスポイントなど）
- `createdAt`: 獲得/消費日時

**インデックス**:
- `by_user`: ユーザー・日時での検索
- `by_user_reason`: ユーザー・理由での検索

**使用例**:
```typescript
// ポイント獲得履歴の記録
await ctx.db.insert("point_history", {
  userId: userId,
  points: 5, // 5ポイント獲得
  reason: "feeding_logged",
  activityId: activityId,
  createdAt: Date.now(),
});

// ポイント消費履歴の記録
await ctx.db.insert("point_history", {
  userId: userId,
  points: -2000, // 2000ポイント消費
  reason: "asset_purchased",
  assetId: assetId,
  createdAt: Date.now(),
});
```

---

### 29. news（ニュース・更新情報）✅ **2026年追加 - 公式サイト**

**目的**: 公式サイトで公開するニュースや更新情報を管理。アプリの成長と開発の活発さを示す。

**主要フィールド**:
- `title`: ニュースのタイトル
- `content`: ニュースの本文（Markdown形式）
- `category`: カテゴリ（feature: 機能追加, bugfix: バグ修正, announcement: お知らせ, update: アップデート）
- `publishedAt`: 公開日時（公開されていない場合はundefined）
- `isPublished`: 公開フラグ
- `imageUrl`: アイキャッチ画像のURL（オプション）
- `createdAt`: 作成日時
- `updatedAt`: 更新日時
- `createdBy`: 作成者（管理者）

**インデックス**:
- `by_published`: 公開状態・公開日時での検索（公開済みニュースの一覧取得用）
- `by_category`: カテゴリ・公開日時での検索（カテゴリ別フィルタリング用）

**使用例**:
```typescript
// ニュースの作成（下書き）
await ctx.db.insert("news", {
  title: "新機能追加：リマインダー機能",
  content: "掃除のタイマーやリマインダー機能を追加しました...",
  category: "feature",
  isPublished: false,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  createdBy: adminUserId,
});

// ニュースの公開
await ctx.db.patch(newsId, {
  isPublished: true,
  publishedAt: Date.now(),
  updatedAt: Date.now(),
});

// 公開済みニュースの取得
const publishedNews = await ctx.db
  .query("news")
  .withIndex("by_published", (q) =>
    q.eq("isPublished", true).neq("publishedAt", undefined)
  )
  .order("desc")
  .collect();
```

---

### 30. （予約済み - 将来の拡張用）

**注意**: 30番は将来の拡張用に予約されています。現在は使用されていません。

---

### 31. diary_scenes（日記シーンマスターデータ）✅ **2026年追加 - 日記の簡単記録**

**目的**: 日記記録時に選択できるシーン（カテゴリ）のマスターデータを管理。テキスト入力なしでシーンを選択するだけで日記を記録できる。

**主要フィールド**:
- `sceneId`: シーンID（例: "walk", "nap", "play", "meal"）
- `name`: シーン名（例: "お散歩", "お昼寝", "遊び", "食事"）
- `icon`: アイコン（絵文字またはアイコン名）
- `displayOrder`: 表示順序
- `isActive`: 有効/無効

**インデックス**:
- `by_active_order`: 有効なシーンを表示順序で取得

**使用例**:
```typescript
// シーンマスターデータの作成
await ctx.db.insert("diary_scenes", {
  sceneId: "walk",
  name: "お散歩",
  icon: "🚶",
  displayOrder: 1,
  isActive: true,
});

await ctx.db.insert("diary_scenes", {
  sceneId: "play",
  name: "遊び",
  icon: "🎾",
  displayOrder: 2,
  isActive: true,
});

// 有効なシーン一覧を取得
const activeScenes = await ctx.db
  .query("diary_scenes")
  .withIndex("by_active_order", (q) => q.eq("isActive", true))
  .order("asc")
  .collect();
```

---

### 32. diary_emotions（日記感情マスターデータ）✅ **2026年追加 - 日記の簡単記録**

**目的**: 日記記録時に選択できる感情のマスターデータを管理。顔文字アイコンで感情を選択できる。

**主要フィールド**:
- `emotionId`: 感情ID（例: "happy", "loving", "confused", "sad"）
- `name`: 感情名（例: "楽しい", "愛しい", "混乱", "悲しい"）
- `icon`: アイコン（絵文字: 😊, 🥰, 😵, 😢）
- `displayOrder`: 表示順序
- `isActive`: 有効/無効

**インデックス**:
- `by_active_order`: 有効な感情を表示順序で取得

**使用例**:
```typescript
// 感情マスターデータの作成
await ctx.db.insert("diary_emotions", {
  emotionId: "happy",
  name: "楽しい",
  icon: "😊",
  displayOrder: 1,
  isActive: true,
});

await ctx.db.insert("diary_emotions", {
  emotionId: "loving",
  name: "愛しい",
  icon: "🥰",
  displayOrder: 2,
  isActive: true,
});

// 有効な感情一覧を取得
const activeEmotions = await ctx.db
  .query("diary_emotions")
  .withIndex("by_active_order", (q) => q.eq("isActive", true))
  .order("asc")
  .collect();
```

---

### 33. reaction_types（リアクションタイプマスターデータ）✅ **2026年追加 - 多機能リアクション**

**目的**: 投稿へのリアクションタイプのマスターデータを管理。単なる「いいね」だけでなく、複数のリアクションから選択できる。

**主要フィールド**:
- `reactionId`: リアクションID（例: "heart", "sunflower", "muscle", "star", "rainbow"）
- `name`: リアクション名（例: "大好き", "癒やされた", "応援してる", "キラキラ", "虹の橋"）
- `icon`: アイコン（絵文字: ❤️, 🌻, 💪, 🌟, 🌈）
- `displayOrder`: 表示順序
- `isActive`: 有効/無効

**インデックス**:
- `by_active_order`: 有効なリアクションタイプを表示順序で取得

**使用例**:
```typescript
// リアクションタイプマスターデータの作成
await ctx.db.insert("reaction_types", {
  reactionId: "heart",
  name: "大好き",
  icon: "❤️",
  displayOrder: 1,
  isActive: true,
});

await ctx.db.insert("reaction_types", {
  reactionId: "rainbow",
  name: "虹の橋",
  icon: "🌈",
  displayOrder: 5,
  isActive: true,
});

// 有効なリアクションタイプ一覧を取得
const activeReactions = await ctx.db
  .query("reaction_types")
  .withIndex("by_active_order", (q) => q.eq("isActive", true))
  .order("asc")
  .collect();
```

---

### 34. context_stamps（コンテキストスタンプマスターデータ）✅ **2026年追加 - シーン+感情のセット**

**目的**: シーンと感情をセットで選択できるコンテキストスタンプのマスターデータを管理。1タップで「遊び + 興奮」などの組み合わせを記録できる。

**主要フィールド**:
- `stampId`: スタンプID（例: "play_excited", "alone_sad"）
- `name`: スタンプ名（例: "遊び + 興奮", "お留守番 + 寂しい"）
- `sceneIds`: シーンIDの配列（diary_scenesのsceneIdを参照）
- `emotionId`: 感情ID（diary_emotionsのemotionIdを参照）
- `icon`: アイコン（絵文字）
- `displayOrder`: 表示順序
- `isActive`: 有効/無効

**インデックス**:
- `by_active_order`: 有効なコンテキストスタンプを表示順序で取得

**使用例**:
```typescript
// コンテキストスタンプマスターデータの作成
await ctx.db.insert("context_stamps", {
  stampId: "play_excited",
  name: "遊び + 興奮",
  sceneIds: ["play"],
  emotionId: "happy",
  icon: "😆",
  displayOrder: 1,
  isActive: true,
});

await ctx.db.insert("context_stamps", {
  stampId: "alone_sad",
  name: "お留守番 + 寂しい",
  sceneIds: ["alone"],
  emotionId: "sad",
  icon: "🥺",
  displayOrder: 2,
  isActive: true,
});

// 有効なコンテキストスタンプ一覧を取得
const activeStamps = await ctx.db
  .query("context_stamps")
  .withIndex("by_active_order", (q) => q.eq("isActive", true))
  .order("asc")
  .collect();
```

---

### 35. legal_documents（法務ドキュメント）✅ **2026年追加 - 公式サイト**

**目的**: プライバシーポリシー、利用規約、特定商取引法表記などの法務ドキュメントを管理。法的要件を満たし、必要に応じて更新できる。

**主要フィールド**:
- `type`: ドキュメントタイプ
  - `privacy_policy`: プライバシーポリシー
  - `terms_of_service`: 利用規約
  - `specific_commercial_transactions`: 特定商取引法に基づく表記
  - `amazon_associate`: Amazonアソシエイト規約
  - `google_admob`: Google AdMob規約
  - `external_transmission`: 外部送信規約（電気通信事業法）
- `version`: バージョン（例: "1.0", "2.0"）
- `content`: ドキュメントの本文（Markdown形式）
- `effectiveDate`: 効力発生日時
- `createdAt`: 作成日時
- `updatedAt`: 更新日時
- `createdBy`: 作成者（管理者）

**インデックス**:
- `by_type`: ドキュメントタイプ・効力発生日時での検索（最新版の取得用）
- `by_type_version`: ドキュメントタイプ・バージョンでの検索（特定バージョンの取得用）

**使用例**:
```typescript
// プライバシーポリシーの作成
await ctx.db.insert("legal_documents", {
  type: "privacy_policy",
  version: "1.0",
  content: "# プライバシーポリシー\n\n...",
  effectiveDate: Date.now(),
  createdAt: Date.now(),
  updatedAt: Date.now(),
  createdBy: adminUserId,
});

// プライバシーポリシーの改定（新バージョン）
await ctx.db.insert("legal_documents", {
  type: "privacy_policy",
  version: "2.0",
  content: "# プライバシーポリシー（改定版）\n\n...",
  effectiveDate: Date.now(),
  createdAt: Date.now(),
  updatedAt: Date.now(),
  createdBy: adminUserId,
});

// 最新版のプライバシーポリシーを取得
const latestPrivacyPolicy = await ctx.db
  .query("legal_documents")
  .withIndex("by_type", (q) => q.eq("type", "privacy_policy"))
  .order("desc")
  .first();
```

---

## ゲーミフィケーション要素の実装例 ✅ **2026年追加**

### 1. ポイント獲得の実装

**設計のポイント**:
- 1日の最大獲得ポイントを「**30pt**」程度に設定
- **餌の記録**: 5pt（1日3回までOK、計15pt）
- **トイレの記録**: 5pt（1日2回までOK、計10pt）
- **日記の更新**: 10pt（1日1回）
- **1日の最大**: 30pt / **1ヶ月（30日）の最大**: 900pt

**実装例**:
```typescript
// convex/mutations/activities.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// 活動ログ記録時にポイントを付与
export const createActivity = mutation({
  args: {
    petId: v.id("pets"),
    type: v.string(),
    payload: v.any(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("認証が必要です");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) throw new Error("ユーザーが見つかりません");

    // 活動ログを作成
    const activityId = await ctx.db.insert("activities", {
      petId: args.petId,
      createdBy: user._id,
      loggedAt: Date.now(),
      type: args.type,
      payload: args.payload,
      version: 1, // 楽観的ロック用
    });

    // ポイント獲得の判定と付与
    const pointsToAdd = await calculatePoints(ctx, user._id, args.type);
    if (pointsToAdd > 0) {
      // ユーザーのポイントを更新
      await ctx.db.patch(user._id, {
        points: user.points + pointsToAdd,
      });

      // ポイント獲得履歴を記録
      await ctx.db.insert("point_history", {
        userId: user._id,
        points: pointsToAdd,
        reason: `${args.type}_logged`,
        activityId: activityId,
        createdAt: Date.now(),
      });
    }

    return { activityId };
  },
});

// ポイント計算のヘルパー関数
async function calculatePoints(
  ctx: MutationCtx,
  userId: Id<"users">,
  activityType: string
): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStart = today.getTime();
  const todayEnd = todayStart + 24 * 60 * 60 * 1000;

  // 今日のポイント獲得履歴を取得
  const todayHistory = await ctx.db
    .query("point_history")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .filter((q) => 
      q.and(
        q.gte(q.field("createdAt"), todayStart),
        q.lt(q.field("createdAt"), todayEnd),
        q.eq(q.field("points"), q.gt(0)) // 獲得のみ
      )
    )
    .collect();

  // 活動タイプごとのポイントと制限
  const pointRules: Record<string, { points: number; maxPerDay: number }> = {
    feeding: { points: 5, maxPerDay: 3 }, // 1日3回まで、1回5pt
    toilet: { points: 5, maxPerDay: 2 },  // 1日2回まで、1回5pt
    journal: { points: 10, maxPerDay: 1 }, // 1日1回まで、1回10pt
  };

  const rule = pointRules[activityType];
  if (!rule) return 0;

  // 今日の獲得回数をカウント
  const todayCount = todayHistory.filter(
    (h) => h.reason === `${activityType}_logged`
  ).length;

  // 制限を超えている場合はポイントを付与しない
  if (todayCount >= rule.maxPerDay) {
    return 0;
  }

  return rule.points;
}
```

### 2. バッジ獲得の実装

**実装例**:
```typescript
// convex/mutations/badges.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

// バッジ獲得のチェック（活動ログ記録後に呼び出す）
export const checkAndAwardBadges = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("ユーザーが見つかりません");

    // すべてのバッジ定義を取得
    const badgeDefinitions = await ctx.db
      .query("badge_definitions")
      .collect();

    // 各バッジの獲得条件をチェック
    for (const badge of badgeDefinitions) {
      // 既に獲得している場合はスキップ
      if (user.badges.includes(badge.id)) continue;

      // 獲得条件をチェック
      const isEarned = await checkBadgeCondition(ctx, args.userId, badge);
      if (isEarned) {
        // バッジを付与
        await ctx.db.patch(args.userId, {
          badges: [...user.badges, badge.id],
        });

        // バッジ獲得時のボーナスポイント（オプション）
        const bonusPoints = 50; // バッジ獲得で50ポイントボーナス
        await ctx.db.patch(args.userId, {
          points: user.points + bonusPoints,
        });

        // ポイント獲得履歴を記録
        await ctx.db.insert("point_history", {
          userId: args.userId,
          points: bonusPoints,
          reason: "badge_earned",
          badgeId: badge.id,
          createdAt: Date.now(),
        });
      }
    }
  },
});

// バッジ獲得条件のチェック
async function checkBadgeCondition(
  ctx: MutationCtx,
  userId: Id<"users">,
  badge: Doc<"badge_definitions">
): Promise<boolean> {
  const condition = badge.condition;

  if (condition.type === "consecutive_days") {
    // 連続日数のチェック
    const activities = await ctx.db
      .query("activities")
      .filter((q) => 
        q.and(
          q.eq(q.field("createdBy"), userId),
          condition.activityTypes 
            ? q.or(...condition.activityTypes.map((type) => 
                q.eq(q.field("type"), type)
              ))
            : undefined
        )
      )
      .order("desc")
      .take(condition.value);

    // 連続日数の判定ロジック（簡略化）
    // 実際の実装では、日付の連続性をチェックする必要がある
    return activities.length >= condition.value;
  }

  if (condition.type === "total_count") {
    // 累計数のチェック
    const count = await ctx.db
      .query("activities")
      .filter((q) => 
        q.and(
          q.eq(q.field("createdBy"), userId),
          condition.activityTypes 
            ? q.or(...condition.activityTypes.map((type) => 
                q.eq(q.field("type"), type)
              ))
            : undefined
        )
      )
      .collect();

    return count.length >= condition.value;
  }

  return false;
}
```

### 3. アイテム購入・交換の実装

**実装例**:
```typescript
// convex/mutations/shop.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

// アイテムをポイントで交換
export const purchaseAssetWithPoints = mutation({
  args: {
    assetId: v.id("assets"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("認証が必要です");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) throw new Error("ユーザーが見つかりません");

    const asset = await ctx.db.get(args.assetId);
    if (!asset) throw new Error("アイテムが見つかりません");

    // 既に所有している場合はエラー
    if (user.unlockedAssets.includes(args.assetId)) {
      throw new Error("既に所有しているアイテムです");
    }

    // ポイントが足りない場合はエラー
    if (user.points < asset.pointCost) {
      throw new Error("ポイントが不足しています");
    }

    // ポイントを消費
    await ctx.db.patch(user._id, {
      points: user.points - asset.pointCost,
      unlockedAssets: [...user.unlockedAssets, args.assetId],
    });

    // ポイント消費履歴を記録
    await ctx.db.insert("point_history", {
      userId: user._id,
      points: -asset.pointCost,
      reason: "asset_purchased",
      assetId: args.assetId,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// アイテムを現金で購入（RevenueCat連携）
export const purchaseAssetWithMoney = mutation({
  args: {
    assetId: v.id("assets"),
    transactionId: v.string(), // RevenueCatのトランザクションID
  },
  handler: async (ctx, args) => {
    // RevenueCatのトランザクション検証（実装は省略）
    // ...

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("認証が必要です");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) throw new Error("ユーザーが見つかりません");

    const asset = await ctx.db.get(args.assetId);
    if (!asset) throw new Error("アイテムが見つかりません");

    // 既に所有している場合はエラー
    if (user.unlockedAssets.includes(args.assetId)) {
      throw new Error("既に所有しているアイテムです");
    }

    // アイテムを追加
    await ctx.db.patch(user._id, {
      unlockedAssets: [...user.unlockedAssets, args.assetId],
    });

    return { success: true };
  },
});
```

---

### 15. knowledge_base（知識ベース）

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

### 4. セキュリティ
- `visibility`による公開設定
- `pet_members`による権限管理
- 認証IDベースのアクセス制御

### 8. アルバム管理機能 ✅ **思い出をテーマ別に整理**

**設計思想**: 日記や写真をテーマ別（例：「初めてのお散歩」「通院記録」「5歳の誕生日」）に整理することで、ユーザーの愛着が深まります。

**機能制限**:
- **無料ユーザー**: 
  - 作成できるアルバム数: 最大2つまで
  - 1アルバムの枚数: 20枚まで
  - 共同編集: 閲覧のみ
- **プレミアムユーザー**: 
  - 作成できるアルバム数: 無制限
  - 1アルバムの枚数: 無制限
  - 共同編集: 家族で写真を出し合って作れる
  - 書き出し機能: PDF/Webアルバムとして共有可能

**UX設計**:
- **日記からアルバムへ「入れる」体験**: 日記詳細画面の隅に「＋」アイコンを配置し、タップするとアルバム選択シートが表示される
- **複数選択モード**: 日記一覧から「複数選択」して一括でアルバムに追加できる「整理モード」を実装
- **新しいアルバムを作る**: 制限数に達している場合、「プレミアムならアルバムを無制限に作れます」という温かいアップグレード案内を表示

**共有・送信機能との統合**:
- **Webアルバム生成（プレミアム限定）**: 特定のアルバムを「期間限定のWebサイト（閲覧専用URL）」として発行し、親戚や友人にSNSで送れる
- **PDF書き出し（プレミアム限定）**: アルバムにまとめた日記と写真を、そのまま一冊のフォトブックのようなレイアウトでPDF化

**詳細**: `USER_STORIES.md`のUS-060、US-061、US-062、US-063を参照してください。

### 9. メモリアル機能（虹の橋を渡った場合）✅ **非常にセンシティブな項目 - 思い出の保護**

**設計思想**: 「記録の封印」ではなく「思い出の保護」という観点で設計します。ペットが亡くなった後は、「記録する場所」から**「いつでも会える場所」**へと役割を変えます。

**メモリアルステータス**:
- `memorialStatus`オブジェクトが存在する場合、ペットは「虹の橋を渡った」状態
- `deceasedDate`: 命日（Unixタイムスタンプ）。この日で年齢計算を停止
- `message`: 飼い主からの最後の一言（オプション）
- `createdAt`: メモリアルモードに移行した日時

**UI/UXの変更**:
- 記録を「入力」するボタンが消え、代わりにこれまでの思い出を「振り返る」ボタンに変わる
- ペットのアイコンに、優しく光る輪や淡い背景色を添える
- 年齢表示は命日で固定される（例：「14歳5ヶ月でお空へ」）

**思い出のアルバム作成・エクスポート（プレミアム限定）**:
- 指定した期間（1ヶ月、1年、全期間など）の記録と写真を選択できる
- 以下の形式でエクスポート可能:
  1. **シンプルな画像共有**: 1枚の画像をSNS/メッセージで共有（無料ユーザーも利用可能）
  2. **デジタル・フォトアルバム（PDF）**: 指定期間の記録と写真をレイアウトしたPDFファイル
  3. **一括ダウンロード（ZIP）**: 最高画質WebPをまとめてZIP圧縮してダウンロード
- アルバム作成前にプレビュー画面が表示され、「どの写真を入れるか」「背景の色はどうするか」を選べる
- 「〇〇ちゃんの1才のあゆみ」というタイトルが自動で入る
- メールで自分宛に送信できる
- 処理が終わったらプッシュ通知やメールで「ダウンロードの準備ができました」と知らせる

**セキュリティと型安全性**:
- 署名付きURL（Signed URLs）: ダウンロードリンクは一定時間（例：1時間）で無効になる
- Clerk権限チェック: 「自分のペットのデータのみ」をダウンロードできるように、バックエンドのActionで厳格にガード

**詳細**: `USER_STORIES.md`のUS-057、US-058、US-059を参照してください。

### 9. バースデー・記念日機能 ✅ **常に前向きに成長や日々の記録を祝うアプリのスタンス**

**設計思想**: ペットとの特別な日を大切にし、常に前向きに成長や日々の記録を祝うアプリのスタンスを実現します。

**バースデー演出**:
- アプリを開いた際、今日がペットの誕生日だと判定されたら、画面に小さな紙吹雪を降らせる
- 「◯◯くん、お誕生日おめでとうございます！🎉」という温かいメッセージが表示される
- バースデーカードのような特別なUIが表示される（オプション）

**成長の節目通知**:
- 「今日で◯◯くんがうちに来てからちょうど1年が経ちました！」といった通知が表示される
- 1ヶ月、3ヶ月、6ヶ月、1年、2年などの節目で通知される
- 記念日の記録を自動で日記として保存

**実装**:
- `packages/utils/src/petCelebrations.ts`に記念日計算ロジックを実装
- `isBirthdayToday()`: 今日が誕生日かどうかを判定
- `calculateMilestone()`: 記念日を計算
- `formatMilestoneMessage()`: 記念日の通知メッセージを生成

**詳細**: `USER_STORIES.md`のUS-005-2、US-005-3を参照してください。

### 10. ユーザーフィードバック機能 ✅ **温かみのある離脱対応**

**設計思想**: 離脱時も温かく対応し、サービス改善に貢献できるようにします。**「お別れ」という項目は含めない**（常に前向きに成長や日々の記録を祝うアプリのスタンス）。

**プレミアム解除理由**:
- 今は必要な機能を使い切った
- 家計を見直したい
- 無料版の機能で満足している
- 操作が難しく感じた

**退会理由**:
- 今は少しアプリ（記録）から離れたい ✅ **コンテキストを汲み取った「お休み」の提案**
  - この選択肢を選んだ際、AI（Claude）が**「これまで〇〇ちゃんと一緒に歩んできた記録は、私たちが大切に保管しておきます。心が落ち着いたとき、いつでもまた会いに来てくださいね」**というメッセージを出す
- 生活スタイルが変わって記録が難しくなった
- 他の管理方法（ノートやSNSなど）に変える
- アプリの通知や操作が自分に合わなかった
- 使い方がわからなかった

**実装**:
- `premium_cancellation_reasons`テーブル: プレミアム解除理由を記録
- `account_deletion_reasons`テーブル: 退会理由を記録
- 理由別の集計が可能（`by_reason`インデックス）

**詳細**: `USER_STORIES.md`のUS-055、US-056を参照してください。

### 11. AI機能の信頼性確保
- RAG（Retrieval-Augmented Generation）による信頼できる回答生成
- ペットのカルテ情報（`pets`、`activities`）を活用した文脈理解
- ベクトル検索による関連知識の取得
- 引用元の明示（`citedSources`）による透明性の確保

### 12. 管理者厳選のキュレーション機能 ✅ **外部記事の紹介**

**設計思想**: 管理者が厳選した外部記事を紹介し、ユーザーに価値ある情報を提供します。単なるURLの羅列ではなく、管理者が「なぜこれを読んでほしいか」という一言を添えることで、アプリの独自価値を提供します。

**アプリ内ブラウジング（In-App Browser）**:
- **推奨実装**: Expoの`expo-web-browser`を使用
  - `WebBrowser.openBrowserAsync(url)`: iOS/Android標準ブラウザをモーダルとして表示
  - 左上の「完了」ボタンで即座にアプリに戻れる
  - ユーザーに「アプリの中にいる」という安心感を与える
- **高度な制御**: `react-native-webview`を使用（オプション）
  - アプリのヘッダーを維持したまま、下半分に記事を表示
  - 画面上部に「この記事について話す」ボタンを配置し、アプリ内の日記やアルバムへの導線を確保

**キュレーションならではの付加価値**:
1. **「管理者の視点」を被せる**: 記事を開く前に、「この記事のここがレオくんに役立つかも！」というパーソナライズされたポップアップを表示（AIがユーザーのペット情報を元に生成）
2. **あとで読む / アルバム保存**: 「この記事を参考にアルバムを作る」といったボタンを配置し、外部記事を自分たちのペットの記録と紐付けられる
3. **プレミアム制限の戦略**:
   - **無料ユーザー**: 記事のタイトルと要約（summary）まで閲覧可能
   - **プレミアムユーザー**: 外部記事へのアクセスと、その記事に基づいた「AIアドバイス」の受領が可能

**セキュリティとパフォーマンス**:
- **URLの正規化**: 管理者が登録する際、悪意のあるスクリプトが含まれないようサニタイズ（クリーンアップ）
- **サムネイルの最適化**: 外部の大きな画像を直接読み込まず、一度サーバー側で取得・リサイズしてConvex Storageに保存（一覧画面の読み込み速度向上）

**詳細**: `USER_STORIES.md`のUS-026、US-027を参照してください。

**セキュリティとアクセス制御**:
- ✅ 認証チェック: すべてのAIチャット機能で認証を確認
- ✅ ペットアクセス権限チェック: 所有者または共同管理者のみアクセス可能
- ✅ メモリアルモード対応: 虹の橋を渡ったペットへの適切な対応
- ✅ ユーザー情報の活用: システムプロンプトに飼い主情報を含める

**免責事項（ディスクレイマー）の実装** ✅ **信頼性と誠実さを担保**:
- ✅ システムプロンプトに免責事項とガードレールを含める
- ✅ `chat_messages`テーブルに`disclaimerShown`と`disclaimerType`フィールドを追加
- ✅ 免責事項タイプの自動判定（general/medical/food/emergency）
- ✅ 初回利用時のウェルカムメッセージに免責事項を含める
- ✅ チャット画面のフッターに常駐免責事項を表示
- ✅ 回答ごとのインライン注釈（キーワード検出による自動表示）
- ✅ 入力中のリアルタイム警告表示

**詳細**: `AI_CHAT_REVIEW.md`と`AI_CHAT_DISCLAIMER.md`を参照してください。

### 6. 画像保存戦略 ✅ **Convexのプライシングを考慮した設計**

**設計思想**: Convexの無料枠（1GB File Storage）を考慮し、画像をWebP形式で保存することで、ストレージコストを最小化しながら、プレミアム機能としての最高画質保存を実現します。

**ダブルストレージ構造**:
- **表示用（Preview）**: 無料ユーザーも参照可能、WebP形式、幅1080px、Quality 0.6-0.7、約500KB
- **最高画質（Original）**: プレミアムユーザーのみ参照可能、WebP形式、リサイズなし、Quality 0.9-1.0、約数MB

**「温かみと誠実さ」を感じさせる設計**:
- 無料ユーザーがアップロードした画像も、**裏で最高画質データを保存**
- プレミアムにアップグレードした瞬間、過去の全ての写真が美しくなる「マジックモーメント」を実現
- 「データは消していない（温かみ）」と「今すぐは見られない（制限）」を両立

**画像枚数制限**:
- **無料ユーザー**: 累計50枚まで（約25MB）
- **プレミアムユーザー**: 無制限

**画像編集機能**:
- **無料ユーザー**: 編集後の画像のみ保存（編集前は削除）
- **プレミアムユーザー**: 編集前・編集後の両方を保存し、編集メタデータも保存（非破壊編集）

**詳細**: `IMAGE_STORAGE_STRATEGY.md`を参照してください。

### 7. 安全な削除機能（論理削除）✅ **Convexのドキュメント指向な特性を最大限に活用**

**設計思想**: `isDeleted`フラグではなく、削除に関するコンテキストをまとめた`deletion`オブジェクトを使用することで、型安全性とクエリのシンプル化を実現します。

**メリット**:
1. **型安全な条件分岐**: `if (pet.deletion)` というチェックを通るだけで、そのブロック内では削除日時や削除者に型安全にアクセスできます
2. **クエリのシンプル化**: 「オブジェクトが存在するかどうか」で判定できる
   ```typescript
   // アクティブなデータのみ取得
   const activePets = await ctx.db
     .query("pets")
     .withIndex("by_owner_active", (q) => q.eq("deletion", undefined))
     .collect();
   ```
3. **セキュリティと監査（オーディット）**: 「誰が」「いつ」消したかがデータそのものに内包されているため、後から調査するロジックが組みやすい

**実装**:
- `packages/backend/convex/lib/deletionSchema.ts`に共通スキーマ定義を配置
- `pets`、`activities`などの主要テーブルに`deletion: deletionSchema`を追加
- デフォルトで30日間復元可能（`restorableUntil`フィールドで制御）

**使用例**:
```typescript
import { deletionSchema, createDeletion, isRestorable, getRemainingRestorableDays } from "./lib/deletionSchema";

// 削除
await ctx.db.patch(petId, {
  deletion: createDeletion(userId, "誤操作", 30), // 30日間復元可能
});

// 復元
await ctx.db.patch(petId, {
  deletion: undefined, // 削除オブジェクトを削除することで復元
});

// 復元可能かチェック
const pet = await ctx.db.get(petId);
if (pet && isRestorable(pet.deletion)) {
  const remainingDays = getRemainingRestorableDays(pet.deletion);
  console.log(`残り${remainingDays}日で復元可能`);
}
```

---

## データライフサイクルと物理削除のタイミング ✅ **2026年最終設計検証で追加**

### 1. 自動物理削除（Convex Cronジョブ）

`restorableUntil`を過ぎたデータを自動で物理削除するCronジョブを実装します。

**実装例**:
```typescript
// convex/crons.ts
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";

export const cron = cronJobs({
  // 毎日午前3時に実行
  deleteExpiredData: {
    schedule: "0 3 * * *", // Cron形式: 毎日午前3時
    args: {},
  },
});

// convex/internal/deleteExpiredData.ts
import { internalAction } from "../_generated/server";
import { api } from "../_generated/api";
import { v } from "convex/values";

export const deleteExpiredData = internalAction({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    
    // 1. ペットの物理削除
    const expiredPets = await ctx.runQuery(api.pets.getExpiredDeletions, {});
    for (const pet of expiredPets) {
      // 関連する画像も削除
      const images = await ctx.runQuery(api.images.getByPetId, { petId: pet._id });
      for (const image of images) {
        await ctx.storage.delete(image.previewStorageId);
        await ctx.storage.delete(image.originalStorageId);
      }
      await ctx.runMutation(api.pets.permanentDelete, { petId: pet._id });
    }
    
    // 2. 活動ログの物理削除
    const expiredActivities = await ctx.runQuery(api.activities.getExpiredDeletions, {});
    for (const activity of expiredActivities) {
      await ctx.runMutation(api.activities.permanentDelete, { activityId: activity._id });
    }
    
    // 3. 画像の物理削除
    const expiredImages = await ctx.runQuery(api.images.getExpiredDeletions, {});
    for (const image of expiredImages) {
      await ctx.storage.delete(image.previewStorageId);
      await ctx.storage.delete(image.originalStorageId);
      await ctx.runMutation(api.images.permanentDelete, { imageId: image._id });
    }
  },
});
```

### 2. 退会後のデータ削除（法的要件対応）

**GDPR等の個人情報保護法に基づき、退会後30日経過で画像ストレージからも完全に削除**します。

**実装例**:
```typescript
// convex/mutations/users.ts
export const deleteAccount = mutation({
  args: { reason: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("認証が必要です");
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    
    if (!user) throw new Error("ユーザーが見つかりません");
    
    // 退会理由を記録
    await ctx.db.insert("account_deletion_reasons", {
      userId: user._id,
      reason: args.reason || "other",
      createdAt: Date.now(),
    });
    
    // 30日後に物理削除するためのスケジュールを設定
    const deletionDate = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30日後
    
    // ユーザーのすべてのデータに削除マークを付ける
    // （実際の物理削除はCronジョブで実行）
    await ctx.scheduler.runAfter(
      30 * 24 * 60 * 60 * 1000, // 30日後
      internal.users.permanentDeleteAccount,
      { userId: user._id }
    );
    
    return { success: true };
  },
});

// convex/internal/users.ts
export const permanentDeleteAccount = internalAction({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // ユーザーのすべての画像を削除
    const images = await ctx.runQuery(api.images.getByUserId, { userId: args.userId });
    for (const image of images) {
      await ctx.storage.delete(image.previewStorageId);
      await ctx.storage.delete(image.originalStorageId);
    }
    
    // ユーザーデータを物理削除
    await ctx.runMutation(api.users.permanentDelete, { userId: args.userId });
  },
});
```

---

## オフラインエクスペリエンス（モバイル特有の課題） ✅ **2026年最終設計検証で追加**

### 1. 画像アップロードキュー管理

**課題**: ペットとの生活では、電波の悪い散歩中やドッグランで写真を撮ることが多い。画像アップロード中に通信が切れた場合の整合性を保つ必要がある。

**対策**:
- Expo（クライアント側）にアップロードキューを持ち、再試行するロジックを実装
- ConvexのMutationで「画像レコードはあるが、StorageIdがまだ空」という中間状態を許容
- UIで「アップロード中...」と表示し続ける設計

**実装例**:
```typescript
// apps/expo/hooks/useImageUploadQueue.ts
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { useMutation } from "convex/react";
import { api } from "@repo/backend/convex/_generated/api";

interface QueuedImage {
  id: string;
  uri: string;
  petId: string;
  activityId?: string;
  status: "pending" | "uploading" | "completed" | "failed";
  retryCount: number;
}

export function useImageUploadQueue() {
  const [queue, setQueue] = useState<QueuedImage[]>([]);
  const createImageRecord = useMutation(api.images.createPending);
  const uploadImage = useMutation(api.images.upload);
  
  const addToQueue = async (imageUri: string, petId: string, activityId?: string) => {
    const imageId = crypto.randomUUID();
    const queuedImage: QueuedImage = {
      id: imageId,
      uri: imageUri,
      petId,
      activityId,
      status: "pending",
      retryCount: 0,
    };
    
    setQueue((prev) => [...prev, queuedImage]);
    
    // 中間状態のレコードを作成（StorageIdは空）
    await createImageRecord({
      imageId,
      petId,
      activityId,
      // storageIdは後で設定
    });
    
    // アップロードを開始
    processQueue();
  };
  
  const processQueue = async () => {
    const pending = queue.filter((img) => img.status === "pending" || img.status === "failed");
    
    for (const image of pending) {
      if (image.retryCount >= 3) {
        setQueue((prev) =>
          prev.map((img) =>
            img.id === image.id ? { ...img, status: "failed" } : img
          )
        );
        continue;
      }
      
      setQueue((prev) =>
        prev.map((img) =>
          img.id === image.id ? { ...img, status: "uploading" } : img
        )
      );
      
      try {
        // 画像をアップロード
        await uploadImage({
          imageId: image.id,
          imageUri: image.uri,
        });
        
        setQueue((prev) =>
          prev.map((img) =>
            img.id === image.id ? { ...img, status: "completed" } : img
          )
        );
      } catch (error) {
        setQueue((prev) =>
          prev.map((img) =>
            img.id === image.id
              ? { ...img, status: "failed", retryCount: img.retryCount + 1 }
              : img
          )
        );
        
        // 5秒後に再試行
        setTimeout(() => processQueue(), 5000);
      }
    }
  };
  
  useEffect(() => {
    processQueue();
  }, [queue]);
  
  return { queue, addToQueue };
}
```

**Convex側の実装**:
```typescript
// convex/mutations/images.ts
export const createPending = mutation({
  args: {
    imageId: v.string(),
    petId: v.id("pets"),
    activityId: v.optional(v.id("activities")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("認証が必要です");
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    
    if (!user) throw new Error("ユーザーが見つかりません");
    
    // 中間状態のレコードを作成（StorageIdは空）
    await ctx.db.insert("images", {
      userId: user._id,
      petId: args.petId,
      activityId: args.activityId,
      previewStorageId: "", // 空文字列（後で設定）
      originalStorageId: "", // 空文字列（後で設定）
      width: 0,
      height: 0,
      fileSizeOriginal: 0,
      fileSizePreview: 0,
      format: "webp",
      hasEdits: false,
      isPremiumAtUpload: user.subscription.tier === "premium",
      deletion: undefined,
      createdAt: Date.now(),
    });
  },
});

export const upload = mutation({
  args: {
    imageId: v.string(),
    imageUri: v.string(),
  },
  handler: async (ctx, args) => {
    // 画像を取得してConvex Storageにアップロード
    // StorageIdを設定してレコードを更新
    // ...
  },
});
```

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
- アクティブなデータのみ取得する場合は、`by_owner_active`や`by_pet_active`インデックスを使用

### 3. セキュリティ
- 認証チェックをすべてのmutationで実施
- 権限チェックを適切に実装
- 入力検証を実施

### 4. 削除機能の実装
- 削除時は`createDeletion()`ヘルパー関数を使用して`deletion`オブジェクトを作成
- 復元時は`deletion: undefined`を設定して削除オブジェクトを削除
- **物理削除**: `restorableUntil`を過ぎたデータを自動で物理削除するConvex Cronジョブを実装（必須）
- **法的要件**: 退会後30日経過で画像ストレージからも完全に削除する処理を組み込む（GDPR等の個人情報保護法対応）
- クエリでは常に`deletion: undefined`でフィルタリングしてアクティブなデータのみ取得

### 5. 管理者厳選のキュレーション機能の実装 ✅ **外部記事の紹介**

**キュレーション記事の登録（管理者）**:
- 外部URLからOGP情報（タイトル、画像、説明）を自動取得（`packages/backend/convex/actions/fetchOGP.ts`）
- URLをサニタイズ（悪意のあるスクリプトを除去）
- サムネイル画像をConvex Storageに保存（`packages/backend/convex/actions/optimizeThumbnail.ts`）
- 管理者が紹介文（summary）を入力

**キュレーション記事の閲覧（ユーザー）**:
- アプリ内ブラウザ（`expo-web-browser`）を使用して記事を表示
- パーソナライズされた紹介文をAIが生成（ユーザーのペット情報を元に）
- 「あとで読む」「アルバムに保存」などのインタラクションを記録

**詳細**: 
- アプリ側: `USER_STORIES.md`のUS-026、US-027、US-028、US-029を参照してください。
- 管理画面側: `ADMIN_USER_STORIES.md`のADM-004、ADM-005を参照してください。

### 6. アルバム管理機能の実装 ✅ **思い出をテーマ別に整理**

**アルバム作成時の制限チェック**:
- 無料ユーザーの場合、既存のアルバム数をチェック
- 2つを超える場合はエラーを返す
- プレミアムユーザーは無制限に作成可能

**アルバムへのアイテム追加時の制限チェック**:
- 無料ユーザーの場合、アルバム内のアイテム数をチェック
- 20枚を超える場合はエラーを返す
- プレミアムユーザーは無制限に追加可能

**アルバム共有機能（プレミアム限定）**:
- Webアルバム生成: 期間限定の閲覧専用URLを発行
- PDF書き出し: アルバムの内容をフォトブック形式でPDF化
- 署名付きURL（Signed URLs）: ダウンロードリンクは一定時間で無効になる

**詳細**: `USER_STORIES.md`のUS-060、US-061、US-062、US-063、US-064を参照してください。

### 7. 画像アップロード・処理の実装 ✅ **Convexのプライシングを考慮した設計**

**フロントエンド（Expo）での処理**:
- `expo-image-manipulator`を使用して画像をWebP形式に変換
- 表示用（Preview）: 幅1080px、Quality 0.6-0.7、約500KB
- 最高画質（Original）: リサイズなし、Quality 0.9-1.0、約数MB

**バックエンド（Convex Action）での処理**:
- 2種類のWebPをConvex File Storageにアップロード
- `images`テーブルに保存（`previewStorageId`と`originalStorageId`の両方を保存）
- 無料ユーザーの画像枚数制限をチェック（`packages/backend/convex/lib/imageLimits.ts`を参照）
  - 累計50枚まで（約25MB）
  - 制限に達した場合はエラーを返す

**画像表示**:
- プレミアム判定に応じて適切な`storageId`を使用
- 無料ユーザー: `previewStorageId`を使用
- プレミアムユーザー: `originalStorageId`を使用

**画像編集**:
- 無料ユーザー: 編集後の画像のみ保存（編集前は削除）
- プレミアムユーザー: 編集前・編集後の両方を保存、編集メタデータも保存（非破壊編集）

**詳細**: `IMAGE_STORAGE_STRATEGY.md`を参照してください。

### 7.5. アソシエイトAPI連携 ✅ **2026年追加 - Amazon/楽天API**

**設計思想**: 商品情報の取得は、スクレイピングではなく、Amazon Product Advertising API（PA-API）と楽天商品検索APIを使用して公式情報を取得します。これにより、データの信頼性が向上し、アフィリエイトリンクも自動で取得できます。

**APIソース**:
- **Amazon Product Advertising API (PA-API)**: 
  - 商品情報、画像、価格、アフィリエイトリンクを取得
  - ASIN（Amazon Standard Identification Number）で商品を特定
  - APIキー、シークレットキー、アソシエイトIDが必要
- **楽天商品検索API**:
  - 商品情報、画像、価格、アフィリエイトリンクを取得
  - 楽天商品IDで商品を特定
  - アプリケーションIDが必要

**実装例**:
```typescript
// packages/backend/convex/actions/fetchProductInfo.ts
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Amazon Product Advertising APIを使用して商品情報を取得
export const fetchProductInfoFromAmazon = action({
  args: {
    productName: v.string(),
    brand: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Amazon PA-APIの設定（環境変数から取得）
    const amazonAccessKey = process.env.AMAZON_ACCESS_KEY;
    const amazonSecretKey = process.env.AMAZON_SECRET_KEY;
    const amazonAssociateId = process.env.AMAZON_ASSOCIATE_ID;
    const amazonPartnerTag = process.env.AMAZON_PARTNER_TAG;

    if (!amazonAccessKey || !amazonSecretKey || !amazonAssociateId) {
      throw new Error("Amazon API設定が不完全です");
    }

    // Amazon PA-APIを呼び出し（実装は省略、paapi5-nodejs-sdkなどを使用）
    // 商品名で検索して、最初の結果を取得
    const searchResponse = await searchAmazonProducts({
      Keywords: args.productName,
      SearchIndex: "PetSupplies", // ペット用品カテゴリ
      PartnerTag: amazonPartnerTag,
      PartnerType: "Associates",
      Marketplace: "www.amazon.co.jp",
    });

    if (!searchResponse.SearchResult?.Items || searchResponse.SearchResult.Items.length === 0) {
      return {
        apiStatus: "not_found" as const,
        apiError: "商品が見つかりませんでした",
      };
    }

    const product = searchResponse.SearchResult.Items[0];
    const asin = product.ASIN;

    // 商品詳細を取得
    const itemResponse = await getAmazonProductDetails({
      ItemIds: [asin],
      PartnerTag: amazonPartnerTag,
      PartnerType: "Associates",
      Marketplace: "www.amazon.co.jp",
      Resources: [
        "ItemInfo.Title",
        "ItemInfo.ByLineInfo",
        "ItemInfo.ContentInfo",
        "ItemInfo.Classifications",
        "Images.Primary.Large",
        "Offers.Listings.Price",
      ],
    });

    const item = itemResponse.ItemsResult?.Items?.[0];
    if (!item) {
      return {
        apiStatus: "not_found" as const,
        apiError: "商品詳細が見つかりませんでした",
      };
    }

    // 商品情報を抽出
    const productInfo = {
      name: item.ItemInfo?.Title?.DisplayValue || args.productName,
      brand: item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue || args.brand,
      manufacturer: item.ItemInfo?.ByLineInfo?.Manufacturer?.DisplayValue,
      description: item.ItemInfo?.ContentInfo?.FeatureDisplayValues?.join("\n"),
      imageUrl: item.Images?.Primary?.Large?.URL,
      affiliateLink: item.DetailPageURL,
      // 餌の場合の追加情報（商品説明から抽出、または別途取得）
      foodInfo: extractFoodInfo(item.ItemInfo?.ContentInfo?.FeatureDisplayValues || []),
    };

    return {
      apiStatus: "success" as const,
      productId: asin,
      productInfo,
      dataAvailability: {
        hasManufacturer: !!productInfo.manufacturer,
        hasDescription: !!productInfo.description,
        hasIngredients: !!productInfo.foodInfo?.ingredients,
        hasNutrition: !!productInfo.foodInfo?.nutrition,
      },
    };
  },
});

// 楽天商品検索APIを使用して商品情報を取得
export const fetchProductInfoFromRakuten = action({
  args: {
    productName: v.string(),
    brand: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 楽天APIの設定（環境変数から取得）
    const rakutenAppId = process.env.RAKUTEN_APP_ID;
    const rakutenAffiliateId = process.env.RAKUTEN_AFFILIATE_ID;

    if (!rakutenAppId) {
      throw new Error("楽天API設定が不完全です");
    }

    // 楽天商品検索APIを呼び出し
    const searchUrl = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?applicationId=${rakutenAppId}&keyword=${encodeURIComponent(args.productName)}&genreId=100227&affiliateId=${rakutenAffiliateId}`;
    
    const response = await fetch(searchUrl);
    const data = await response.json();

    if (!data.Items || data.Items.length === 0) {
      return {
        apiStatus: "not_found" as const,
        apiError: "商品が見つかりませんでした",
      };
    }

    const item = data.Items[0].Item;
    const productId = item.itemCode;

    // 商品情報を抽出
    const productInfo = {
      name: item.itemName || args.productName,
      brand: args.brand,
      manufacturer: item.makerName,
      description: item.itemCaption,
      imageUrl: item.mediumImageUrls?.[0]?.imageUrl,
      affiliateLink: item.affiliateUrl,
      // 餌の場合の追加情報（商品説明から抽出）
      foodInfo: extractFoodInfoFromDescription(item.itemCaption),
    };

    return {
      apiStatus: "success" as const,
      productId: productId,
      productInfo,
      dataAvailability: {
        hasManufacturer: !!productInfo.manufacturer,
        hasDescription: !!productInfo.description,
        hasIngredients: !!productInfo.foodInfo?.ingredients,
        hasNutrition: !!productInfo.foodInfo?.nutrition,
      },
    };
  },
});

// 商品登録時にAPIから情報を取得して保存
export const createProductWithApiInfo = action({
  args: {
    productName: v.string(),
    category: v.string(),
    brand: v.optional(v.string()),
    apiSource: v.union(v.literal("amazon"), v.literal("rakuten")),
  },
  handler: async (ctx, args) => {
    // APIから商品情報を取得
    const apiResult = args.apiSource === "amazon"
      ? await fetchProductInfoFromAmazon({ productName: args.productName, brand: args.brand })
      : await fetchProductInfoFromRakuten({ productName: args.productName, brand: args.brand });

    if (apiResult.apiStatus === "not_found" || apiResult.apiStatus === "failed") {
      // APIで取得できなかった場合、基本情報のみで登録
      const productId = await ctx.runMutation(api.products.create, {
        name: args.productName,
        category: args.category,
        brand: args.brand,
        affiliateApiInfo: {
          apiSource: args.apiSource,
          productId: "",
          fetchedAt: Date.now(),
          apiStatus: apiResult.apiStatus,
          apiError: apiResult.apiError,
          dataAvailability: {
            hasManufacturer: false,
            hasDescription: false,
            hasIngredients: false,
            hasNutrition: false,
          },
        },
        isVerified: false,
        reviewCount: 0,
      });

      return { productId, apiStatus: apiResult.apiStatus };
    }

    // APIで取得できた場合、取得した情報で登録
    const productId = await ctx.runMutation(api.products.create, {
      name: apiResult.productInfo.name,
      category: args.category,
      brand: apiResult.productInfo.brand || args.brand,
      manufacturer: apiResult.productInfo.manufacturer,
      description: apiResult.productInfo.description,
      foodInfo: apiResult.productInfo.foodInfo,
      imageUrl: apiResult.productInfo.imageUrl,
      affiliateLink: apiResult.productInfo.affiliateLink,
      affiliateApiInfo: {
        apiSource: args.apiSource,
        productId: apiResult.productId,
        fetchedAt: Date.now(),
        apiStatus: "success",
        dataAvailability: apiResult.dataAvailability,
      },
      isVerified: false,
      reviewCount: 0,
    });

    return { productId, apiStatus: "success" };
  },
});

// ヘルパー関数: 商品説明から餌の情報を抽出（簡易版）
function extractFoodInfo(features: string[]): {
  ingredients?: string;
  nutrition?: {
    protein?: number;
    fat?: number;
    fiber?: number;
    moisture?: number;
  };
} | undefined {
  // 実装は省略（自然言語処理や正規表現を使用）
  // 商品説明から成分表や栄養成分を抽出
  return undefined;
}

function extractFoodInfoFromDescription(description: string): {
  ingredients?: string;
  nutrition?: {
    protein?: number;
    fat?: number;
    fiber?: number;
    moisture?: number;
  };
} | undefined {
  // 実装は省略（自然言語処理や正規表現を使用）
  return undefined;
}
```

**環境変数の設定**:
```bash
# Amazon Product Advertising API
AMAZON_ACCESS_KEY=your_access_key
AMAZON_SECRET_KEY=your_secret_key
AMAZON_ASSOCIATE_ID=your_associate_id
AMAZON_PARTNER_TAG=your_partner_tag

# 楽天商品検索API
RAKUTEN_APP_ID=your_app_id
RAKUTEN_AFFILIATE_ID=your_affiliate_id
```

**注意事項**:
- APIキーやアソシエイトIDは環境変数で管理し、コードに直接記述しない
- APIのレート制限に注意（Amazon PA-APIは1リクエスト/秒、楽天APIは1リクエスト/秒）
- APIの利用規約を遵守する（特にアフィリエイトリンクの表示方法）
- エラーハンドリングを適切に実装する（APIが失敗した場合のフォールバック）

---

### 7.6. データ取得戦略 ✅ **2026年追加 - 初回シードとオンデマンド更新の分離**

**設計思想**: 初回用の一括データ蓄積（シード）と、運用時のオンデマンド更新を分離し、商品ごとに1日1回の更新制限を設けることで、APIコストとリスクを最小化します。

#### 1. 初回シード（一括データ蓄積）

**目的**: カテゴリごとに絞った定期実行による初期データ収集

**実装例**:
```typescript
// packages/backend/convex/internal/products.ts
import { internalAction, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// カテゴリごとの商品検索とDBへの登録（初回シード用）
export const seedProductsByCategory = internalAction({
  args: {
    category: v.string(), // "food", "toy", "cage"など
    browseNodeId: v.optional(v.string()), // AmazonのBrowseNode ID（例: ペット用品のカテゴリID）
    maxPages: v.optional(v.number()), // 最大ページ数（デフォルト: 10ページ = 100件）
  },
  handler: async (ctx, args) => {
    const maxPages = args.maxPages || 10;
    const pageSize = 10; // Amazon APIは1ページ10件まで

    // 1ページ目から順に取得
    for (let page = 1; page <= maxPages; page++) {
      // Amazon APIで商品検索（カテゴリ指定）
      const searchResponse = await searchAmazonProductsByCategory({
        BrowseNodeId: args.browseNodeId,
        ItemCount: pageSize,
        ItemPage: page,
        PartnerTag: process.env.AMAZON_PARTNER_TAG!,
        PartnerType: "Associates",
        Marketplace: "www.amazon.co.jp",
      });

      if (!searchResponse.SearchResult?.Items || searchResponse.SearchResult.Items.length === 0) {
        break; // これ以上商品がない場合は終了
      }

      // 10件ずつまとめて詳細情報を取得（バッチ処理）
      const asins = searchResponse.SearchResult.Items.map((item) => item.ASIN);
      const detailsResponse = await getAmazonProductDetailsBatch({
        ItemIds: asins,
        PartnerTag: process.env.AMAZON_PARTNER_TAG!,
        PartnerType: "Associates",
        Marketplace: "www.amazon.co.jp",
        Resources: [
          "ItemInfo.Title",
          "ItemInfo.ByLineInfo",
          "ItemInfo.ContentInfo",
          "ItemInfo.Classifications",
          "Images.Primary.Large",
          "Offers.Listings.Price",
          "CustomerReviews.StarRating",
        ],
      });

      // DBに登録（重複チェック付き）
      for (const item of detailsResponse.ItemsResult?.Items || []) {
        await ctx.runMutation(api.products.upsertFromAmazon, {
          asin: item.ASIN,
          category: args.category,
          rawData: item,
        });
      }

      // API制限を守るため、1秒待機
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  },
});

// 商品の重複チェックと登録（初回シード用）
export const upsertFromAmazon = internalMutation({
  args: {
    asin: v.string(),
    category: v.string(),
    rawData: v.any(), // Amazon APIのレスポンス
  },
  handler: async (ctx, args) => {
    // ASINで既存商品を検索
    const existing = await ctx.db
      .query("products")
      .withIndex("by_asin", (q) => 
        q.eq("affiliateApiInfo.productId", args.asin)
      )
      .first();

    // 既存商品がある場合は、初回シードでは更新しない（重複を避ける）
    if (existing) {
      return existing._id;
    }

    // 新規商品として登録
    const productId = await ctx.db.insert("products", {
      name: args.rawData.ItemInfo?.Title?.DisplayValue || "商品名不明",
      category: args.category,
      brand: args.rawData.ItemInfo?.ByLineInfo?.Brand?.DisplayValue,
      manufacturer: args.rawData.ItemInfo?.ByLineInfo?.Manufacturer?.DisplayValue,
      description: args.rawData.ItemInfo?.ContentInfo?.FeatureDisplayValues?.join("\n"),
      imageUrl: args.rawData.Images?.Primary?.Large?.URL,
      affiliateLink: args.rawData.DetailPageURL,
      price: args.rawData.Offers?.Listings?.[0]?.Price?.Amount
        ? args.rawData.Offers.Listings[0].Price.Amount / 100 // 円単位に変換
        : undefined,
      originalPrice: args.rawData.Offers?.Listings?.[0]?.Price?.Savings?.Amount
        ? (args.rawData.Offers.Listings[0].Price.Amount + args.rawData.Offers.Listings[0].Price.Savings.Amount) / 100
        : undefined,
      discountRate: args.rawData.Offers?.Listings?.[0]?.Price?.Savings?.Percentage
        ? args.rawData.Offers.Listings[0].Price.Savings.Percentage
        : undefined,
      currency: args.rawData.Offers?.Listings?.[0]?.Price?.Currency || "JPY",
      availability: args.rawData.Offers?.Listings?.[0]?.Availability?.Message === "In Stock"
        ? "in_stock"
        : "out_of_stock",
      amazonRating: args.rawData.CustomerReviews?.StarRating?.Value,
      amazonReviewCount: args.rawData.CustomerReviews?.TotalCount,
      affiliateApiInfo: {
        apiSource: "amazon",
        productId: args.asin,
        fetchedAt: Date.now(),
        apiStatus: "success",
        dataAvailability: {
          hasManufacturer: !!args.rawData.ItemInfo?.ByLineInfo?.Manufacturer?.DisplayValue,
          hasDescription: !!args.rawData.ItemInfo?.ContentInfo?.FeatureDisplayValues,
          hasIngredients: false, // 商品説明から抽出する必要がある
          hasNutrition: false, // 商品説明から抽出する必要がある
        },
      },
      lastUpdatedAt: Date.now(), // 初回登録時も更新日時を記録
      createdAt: Date.now(),
      isVerified: false,
      reviewCount: 0,
      viewCount: 0,
    });

    return productId;
  },
});
```

#### 2. オンデマンド更新（1日1回制限）

**目的**: ユーザーが商品詳細を開いた際、24時間以上経過している場合のみ更新

**実装例**:
```typescript
// packages/backend/convex/queries/products.ts
import { query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// 商品詳細を取得（オンデマンド更新付き）
export const getProductDetail = query({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error("商品が見つかりません");

    // 24時間以上経過している場合、裏側で更新をスケジュール
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    const shouldUpdate = product.lastUpdatedAt < (now - twentyFourHours);

    if (shouldUpdate && product.affiliateApiInfo?.apiSource === "amazon") {
      // バックグラウンドで更新を実行（ユーザーを待たせない）
      await ctx.scheduler.runAfter(0, api.products.updateProductFromApi, {
        productId: args.productId,
        asin: product.affiliateApiInfo.productId,
      });
    }

    // 閲覧数を更新
    await ctx.db.patch(args.productId, {
      viewCount: product.viewCount + 1,
      lastViewedAt: now,
    });

    // 即座に現在のDB値を返す（Stale-While-Revalidate パターン）
    return product;
  },
});

// 商品をAPIから更新（オンデマンド更新用）
export const updateProductFromApi = internalAction({
  args: {
    productId: v.id("products"),
    asin: v.string(),
  },
  handler: async (ctx, args) => {
    // 商品の現在の状態を確認
    const product = await ctx.runQuery(api.products.getById, { productId: args.productId });
    if (!product) throw new Error("商品が見つかりません");

    // 24時間以内の場合は更新しない（重複更新を防ぐ）
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    if (product.lastUpdatedAt >= (now - twentyFourHours)) {
      return { skipped: true, reason: "24時間以内に更新済み" };
    }

    try {
      // Amazon APIから最新情報を取得
      const itemResponse = await getAmazonProductDetails({
        ItemIds: [args.asin],
        PartnerTag: process.env.AMAZON_PARTNER_TAG!,
        PartnerType: "Associates",
        Marketplace: "www.amazon.co.jp",
        Resources: [
          "Offers.Listings.Price",
          "Offers.Listings.Availability",
          "CustomerReviews.StarRating",
        ],
      });

      const item = itemResponse.ItemsResult?.Items?.[0];
      if (!item) {
        throw new Error("商品が見つかりませんでした");
      }

      // 価格・在庫・評価のみを更新（画像や説明は変更されないため）
      await ctx.runMutation(api.products.updatePriceAndAvailability, {
        productId: args.productId,
        price: item.Offers?.Listings?.[0]?.Price?.Amount
          ? item.Offers.Listings[0].Price.Amount / 100
          : undefined,
        originalPrice: item.Offers?.Listings?.[0]?.Price?.Savings?.Amount
          ? (item.Offers.Listings[0].Price.Amount + item.Offers.Listings[0].Price.Savings.Amount) / 100
          : undefined,
        discountRate: item.Offers?.Listings?.[0]?.Price?.Savings?.Percentage,
        availability: item.Offers?.Listings?.[0]?.Availability?.Message === "In Stock"
          ? "in_stock"
          : "out_of_stock",
        amazonRating: item.CustomerReviews?.StarRating?.Value,
        amazonReviewCount: item.CustomerReviews?.TotalCount,
        lastUpdatedAt: now,
      });

      return { success: true };
    } catch (error) {
      // エラーが発生した場合、lastUpdatedAtは更新しない（30分後に再試行）
      await ctx.scheduler.runAfter(30 * 60 * 1000, api.products.updateProductFromApi, {
        productId: args.productId,
        asin: args.asin,
      });

      return { success: false, error: String(error) };
    }
  },
});

// 価格・在庫・評価のみを更新（Mutation）
export const updatePriceAndAvailability = internalMutation({
  args: {
    productId: v.id("products"),
    price: v.optional(v.number()),
    originalPrice: v.optional(v.number()),
    discountRate: v.optional(v.number()),
    availability: v.optional(v.union(v.literal("in_stock"), v.literal("out_of_stock"), v.literal("preorder"))),
    amazonRating: v.optional(v.number()),
    amazonReviewCount: v.optional(v.number()),
    lastUpdatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.productId, {
      price: args.price,
      originalPrice: args.originalPrice,
      discountRate: args.discountRate,
      availability: args.availability,
      amazonRating: args.amazonRating,
      amazonReviewCount: args.amazonReviewCount,
      lastUpdatedAt: args.lastUpdatedAt,
      // affiliateApiInfoのfetchedAtも更新
      affiliateApiInfo: {
        ...(await ctx.db.get(args.productId))?.affiliateApiInfo,
        fetchedAt: args.lastUpdatedAt,
      },
    });
  },
});
```

#### 3. 定期Cronジョブ（優先度付き更新）

**目的**: 閲覧数の多い商品を優先的に更新

**実装例**:
```typescript
// packages/backend/convex/cronJobs.ts
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// 毎日深夜2時に、閲覧数の多い商品を優先的に更新
crons.daily(
  "updatePopularProducts",
  {
    hourUTC: 17, // JST 2時（UTC 17時）
    minuteUTC: 0,
  },
  internal.products.updatePopularProductsBatch
);

// 閲覧数の多い商品をバッチ更新
export const updatePopularProductsBatch = internalAction({
  args: {},
  handler: async (ctx) => {
    // 過去3日間に閲覧された商品を取得（優先度: 高）
    const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
    const popularProducts = await ctx.runQuery(api.products.getProductsToUpdate, {
      minViewCount: 10,
      lastViewedAfter: threeDaysAgo,
      maxItems: 100, // 1回のCronで更新する最大件数
    });

    // 10件ずつまとめて更新（バッチ処理）
    for (let i = 0; i < popularProducts.length; i += 10) {
      const batch = popularProducts.slice(i, i + 10);
      
      // 各商品を更新（並列実行）
      await Promise.all(
        batch.map((product) => {
          if (product.affiliateApiInfo?.apiSource === "amazon" && product.affiliateApiInfo?.productId) {
            return ctx.scheduler.runAfter(0, api.products.updateProductFromApi, {
              productId: product._id,
              asin: product.affiliateApiInfo.productId,
            });
          }
        })
      );

      // API制限を守るため、1秒待機
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  },
});

// 更新対象の商品を取得（Query）
export const getProductsToUpdate = query({
  args: {
    minViewCount: v.number(),
    lastViewedAfter: v.number(),
    maxItems: v.number(),
  },
  handler: async (ctx, args) => {
    // 閲覧数が多い順に、24時間以上経過した商品を取得
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    return await ctx.db
      .query("products")
      .withIndex("by_view_count", (q) => q.gte("viewCount", args.minViewCount))
      .filter((q) => 
        q.and(
          q.gte(q.field("lastViewedAt"), args.lastViewedAfter),
          q.lt(q.field("lastUpdatedAt"), now - twentyFourHours)
        )
      )
      .order("desc")
      .take(args.maxItems);
  },
});
```

#### 4. データ取得戦略のまとめ

| 機能 | 実行タイミング | 更新対象 | 重複チェック |
|------|---------------|---------|------------|
| **初回シード** | 管理者の手動起動（カテゴリ別） | 新規商品のみ | ASINで重複チェック、既存商品は更新しない |
| **オンデマンド更新** | ユーザーが詳細を開いた時 | 24時間以上経過した商品のみ | `lastUpdatedAt`で判定、1日1回制限 |
| **定期Cron更新** | 毎日深夜2時 | 閲覧数の多い商品（過去3日間） | `lastUpdatedAt`で判定、1日1回制限 |

**設計のポイント**:
- **重複更新の防止**: 初回シードでは既存商品を更新しない、オンデマンド更新では24時間以内の更新をスキップ
- **APIコストの最小化**: バッチ処理（10件ずつ）とレート制限の遵守（1秒待機）
- **ユーザー体験の最適化**: Stale-While-Revalidateパターンで、即座にDB値を返し、裏側で更新
- **エラー耐性**: APIエラー時は`lastUpdatedAt`を更新せず、30分後に再試行

### 8. プレミアム権限管理 ✅ **機能制限とUXをシームレスに繋ぐ設計**

**設計思想**: プレミアムユーザーの管理は、**「機能制限」**と**「UX（アップグレード案内）」**をシームレスに繋ぐために、Convexのテーブル定義とReactのガード機能を組み合わせます。

**スキーマ設計**:
- `users.subscription`オブジェクトでサブスクリプションの状態を管理
- `tier`: プラン（free/premium、将来的にfamilyなども追加可能）
- `status`: サブスクリプションの状態（active/canceled/past_due/trialing）
- `endsAt`: サブスクリプションの期限
- `gracePeriodEndsAt`: 猶予期間の期限（支払い失敗後も機能を維持する期間）

**バックエンド（Convex）でのガード**:
```typescript
// packages/backend/convex/lib/permissions.ts
import { QueryCtx, MutationCtx } from "./_generated/server";

export async function assertPremium(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("認証が必要です");
  
  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
    .unique();

  if (!user) throw new Error("ユーザーが見つかりません");

  // プレミアム判定（猶予期間も考慮）
  const isPremium = user.subscription.tier === "premium" && 
    (user.subscription.status === "active" || 
     user.subscription.status === "trialing" ||
     (user.subscription.status === "past_due" && 
      user.subscription.gracePeriodEndsAt && 
      Date.now() < user.subscription.gracePeriodEndsAt));

  if (!isPremium) {
    throw new Error("PREMIUM_REQUIRED"); // フロントエンドで捕まえるためのエラーコード
  }
  
  return user;
}

export async function isPremiumUser(ctx: QueryCtx | MutationCtx): Promise<boolean> {
  try {
    await assertPremium(ctx);
    return true;
  } catch {
    return false;
  }
}
```

**フロントエンド（React）でのガード**:
```typescript
// packages/ui/src/components/PremiumGuard.tsx
import { useQuery } from "convex/react";
import { api } from "@repo/backend/convex/_generated/api";
import { UpgradePrompt } from "./UpgradePrompt";

export const PremiumGuard = ({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) => {
  const user = useQuery(api.users.getCurrentUser);

  if (!user) {
    return <>{children}</>; // ローディング中は表示
  }

  const isPremium = user.subscription.tier === "premium" && 
    (user.subscription.status === "active" || 
     user.subscription.status === "trialing" ||
     (user.subscription.status === "past_due" && 
      user.subscription.gracePeriodEndsAt && 
      Date.now() < user.subscription.gracePeriodEndsAt));

  if (!isPremium) {
    return fallback || <UpgradePrompt />;
  }

  return <>{children}</>;
};
```

**プレミアム限定機能の例**:
- **画像管理**: 最高画質表示・ダウンロード、無制限アップロード、非破壊編集（US-051, US-052, US-053）
- **アルバム管理**: 無制限作成、無制限アイテム追加、共同編集、共有・送信機能（US-060, US-061, US-062, US-063, US-064）
- **キュレーション機能**: 外部記事へのアクセスと、その記事に基づいた「AIアドバイス」の受領（US-026, US-027）
- **詳細な統計情報**: 体重推移グラフ、統計情報表示（US-017, US-072）
- **家族・チーム管理**: Phase 2の共同管理機能（US-033〜US-038）
- **高度なAI相談機能**: 詳細分析、過去の相談履歴の詳細表示（US-020〜US-025）
- **データエクスポート機能**: PDF/CSV出力

**UX（アップグレード案内）の3段階**:
1. **ロックアイコンの表示**: プレミアム機能の横に小さな鍵アイコンを表示
2. **ハーフモーダル（Sheet）**: 機能をクリックした際に下から表示される案内
3. **プレースホルダー**: プレミアム限定の統計画面などは、ぼかし（Blur）をかけた背景に案内テキストを表示

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
    // ✅ 1. 認証チェック
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証が必要です");
    }

    const currentUser = await ctx.runQuery(api.users.getCurrentUser);
    if (!currentUser) {
      throw new Error("ユーザーが見つかりません");
    }

    // ✅ 2. ペットアクセス権限チェック
    const pet = await ctx.runQuery(api.pets.getById, { petId: args.petId });
    if (!pet) {
      throw new Error("ペットが見つかりません");
    }

    // 所有者または共同管理者かチェック
    const hasAccess = await ctx.runQuery(api.pets.checkAccess, {
      petId: args.petId,
      userId: currentUser._id,
    });
    if (!hasAccess) {
      throw new Error("このペットへのアクセス権限がありません");
    }

    // ✅ 3. ペットのカルテ情報を取得（削除されたログは除外）
    const recentActivities = await ctx.runQuery(api.activities.getRecent, {
      petId: args.petId,
      days: 7, // 3日から7日に拡張（質問内容によって動的に変更することも検討）
      includeDeleted: false, // 削除されたログは除外
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

    // ✅ 4. 年齢計算（packages/utilsを使用、メモリアルモード対応）
    import { calculatePetAgeInfo, formatPetAgeDisplay } from "@repo/utils/petAge";
    
    const ageInfo = pet.birthDate 
      ? calculatePetAgeInfo(
          pet.birthDate, 
          pet.species,
          Date.now(),
          pet.memorialStatus?.deceasedDate // ✅ メモリアルモード対応
        )
      : null;
    const ageDisplay = ageInfo 
      ? formatPetAgeDisplay(ageInfo, !!pet.memorialStatus) // ✅ メモリアルモード対応
      : "不明";

    // ✅ 5. システムプロンプトを作成（ユーザー情報・メモリアルモード対応・免責事項強化）
    const systemPrompt = `あなたはペットの健康管理をサポートするAIアシスタントです。

【重要な免責事項とガードレール】
- あなたは獣医師ではありません。診断を下さず、あくまで一般的なアドバイスと受診の目安を提示してください。
- 緊急度が高い場合は、必ず動物病院への受診を推奨してください。
- 回答には引用元を明示してください。
- 医療的な判断が必要な場合は、必ず「この判断は専門家（獣医師）にご相談ください」という一文を回答の最後に含めてください。
- 薬物や治療法について具体的な指示は行わず、一般的な情報提供にとどめてください。
- 誤った情報を提供する可能性があることを常に意識し、不確実な場合は「確実な情報ではないため、専門家にご確認ください」と明記してください。

飼い主情報:
- 名前: ${currentUser.name || "飼い主さん"}

ペット情報:
- 名前: ${pet.name}
- 種別: ${pet.species}
- 品種: ${pet.breed || "不明"}
- 年齢: ${ageDisplay}
- 体重: ${pet.weight || "不明"}g
${pet.memorialStatus 
  ? `- メモリアルモード: このペットは虹の橋を渡りました（命日: ${new Date(pet.memorialStatus.deceasedDate).toLocaleDateString("ja-JP")}）\n- 注意: 過去の記録に基づいたアドバイスを提供しますが、現在の状態に関する質問には対応できません。`
  : ""}

直近の記録:
${recentActivities.length > 0 
  ? recentActivities.map((a) => `- ${a.type}: ${JSON.stringify(a.payload)}`).join("\n")
  : "- 記録がありません。より詳しいアドバイスのために、日々の記録を続けてください。"}

参考知識:
${knowledgeResults.map((k) => `- ${k.title}: ${k.content}`).join("\n")}`;

    // ✅ 6. OpenAI ChatCompletion APIを呼び出し（エラーハンドリング追加）
    let response: string;
    let citedKnowledgeIds: Id<"knowledge_base">[] = [];

    try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: args.message },
      ],
      temperature: 0.7,
    });

      response = completion.choices[0].message.content || "";
      citedKnowledgeIds = knowledgeResults.map((k) => k._id);
    } catch (error) {
      console.error("AIチャット処理エラー:", error);
      throw new Error("AIチャットの処理中にエラーが発生しました。しばらくしてから再度お試しください。");
    }

    // ✅ 7. 免責事項タイプの判定（回答内容から自動判定）
    const disclaimerType = determineDisclaimerType(args.message, response);

    // ✅ 8. メッセージを保存（免責事項フラグ付き）
    await ctx.runMutation(api.chat.saveUserMessage, {
      threadId: args.threadId,
      content: args.message,
      disclaimerShown: false, // ユーザーメッセージには免責事項不要
    });

    const assistantMessageId = await ctx.runMutation(api.chat.saveAssistantMessage, {
      threadId: args.threadId,
      content: response,
      citedSources: knowledgeResults.map((k) => k._id),
      disclaimerShown: true, // ✅ 免責事項を表示
      disclaimerType: disclaimerType, // ✅ 免責事項タイプを保存
    });

    return {
      messageId: assistantMessageId,
      content: response,
      citedSources: knowledgeResults.map((k) => ({
        id: k._id,
        title: k.title,
        url: k.sourceUrl,
      })),
      disclaimerShown: true,
      disclaimerType: disclaimerType,
    };
  },
});

// ✅ 免責事項タイプの判定関数（ヘルパー）
function determineDisclaimerType(
  userMessage: string,
  aiResponse: string
): "general" | "medical" | "food" | "emergency" {
  const message = (userMessage + " " + aiResponse).toLowerCase();
  
  // 緊急時のキーワード
  const emergencyKeywords = ["誤飲", "誤食", "中毒", "けいれん", "意識", "呼吸困難", "大量出血"];
  if (emergencyKeywords.some((kw) => message.includes(kw))) {
    return "emergency";
  }
  
  // 医療・健康のキーワード
  const medicalKeywords = ["病気", "症状", "治療", "薬", "診断", "病院", "獣医", "痛み", "発熱", "下痢", "嘔吐"];
  if (medicalKeywords.some((kw) => message.includes(kw))) {
    return "medical";
  }
  
  // 食事・栄養のキーワード
  const foodKeywords = ["フード", "食事", "栄養", "サプリメント", "おやつ", "食べ物", "給餌"];
  if (foodKeywords.some((kw) => message.includes(kw))) {
    return "food";
  }
  
  // デフォルトは一般的な免責事項
  return "general";
}
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

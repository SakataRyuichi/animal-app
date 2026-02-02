# Cloudflare R2移行設計

**📚 ドキュメントインデックス**: [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)

## 概要

このドキュメントは、画像・動画の保存をConvex File StorageからCloudflare R2に移行する設計をまとめています。

**作成日**: 2026年2月1日  
**目的**: コスト削減、パフォーマンス向上、スケーラビリティの確保

**関連ドキュメント**:
- [IMAGE_STORAGE_STRATEGY.md](./IMAGE_STORAGE_STRATEGY.md): 画像保存戦略（R2移行後）
- [CONVEX_SCHEMA.md](./CONVEX_SCHEMA.md): スキーマ定義（R2キーとURLフィールド）
- [USER_STORIES.md](./USER_STORIES.md): US-092〜US-095（動画管理機能）

---

## 1. 移行の背景と目的

### 1.1 なぜCloudflare R2に移行するのか

**コスト面**:
- **Convex File Storage**: ストレージ料金 + 帯域幅（Egress Fee）が高額
- **Cloudflare R2**: ストレージ料金は安価、**下り通信料（Egress Fee）が完全に無料**

**パフォーマンス面**:
- Cloudflare CDNとの統合により、世界中のユーザーに高速なコンテンツ配信が可能
- 動画の再生がスムーズになる

**スケーラビリティ**:
- 動画のような大容量ファイルも扱いやすい
- バズった際のコスト増加リスクが低い

### 1.2 移行対象

- **画像**: 既存の画像データと新規アップロード
- **動画**: 新規追加機能（US-092〜US-095）

---

## 2. Cloudflare R2の設定

### 2.1 R2バケットの作成

**バケット名**: `pet-app-assets`  
**リージョン**: `APAC`（日本に近いリージョン）

### 2.2 CORS設定

アプリ（Expo）やWeb（Next.js）から直接アップロードできるようにCORSを設定します。

```json
[
  {
    "AllowedOrigins": ["*"], // 本番はドメインを絞る
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedHeaders": ["*"]
  }
]
```

### 2.3 カスタムドメインの設定

デフォルトURL（`https://pub-xxx.r2.dev`）ではなく、カスタムドメインを使用します。

**ドメイン**: `assets.your-pet-app.com`  
**メリット**: Cloudflare CDNのキャッシュが効き、動画配信が高速化

### 2.4 APIキーの発行

ConvexのActionからR2にアクセスするために、R2 API Tokenを発行します。

**権限**:
- Object Read & Write
- 特定のバケット（`pet-app-assets`）へのアクセス権限

**環境変数**:
- `CLOUDFLARE_R2_ACCESS_KEY_ID`
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
- `CLOUDFLARE_R2_BUCKET_NAME`
- `CLOUDFLARE_R2_ENDPOINT`
- `CLOUDFLARE_R2_PUBLIC_URL`（カスタムドメイン）

---

## 3. アーキテクチャ設計

### 3.1 データフロー

```
┌─────────────┐
│   EXPO App  │
│  Next.js    │
└──────┬──────┘
       │ 1. Presigned URL要求
       ▼
┌─────────────┐
│   Convex    │
│   Action    │
└──────┬──────┘
       │ 2. Presigned URL発行
       ▼
┌─────────────┐
│   EXPO App  │
│  Next.js    │
└──────┬──────┘
       │ 3. 直接アップロード
       ▼
┌─────────────┐
│ Cloudflare  │
│     R2      │
└─────────────┘
```

### 3.2 メタデータ管理

**Convex（メタデータ）**:
- ファイルのパス（R2キー）
- URL（カスタムドメイン経由）
- ファイルサイズ、形式、サムネイルURLなど

**Cloudflare R2（実体）**:
- 実際のバイナリデータ（画像・動画）

---

## 4. スキーマ変更

### 4.1 `images`テーブルの変更

```typescript
// CONVEX_SCHEMA.md の images テーブルに追加
images: defineTable({
  // ...既存フィールド
  
  // Cloudflare R2関連フィールド ✅ **2026年追加**
  r2Key: v.string(), // R2上のパス（例: pets/123/image_abc.webp）
  r2Url: v.string(), // カスタムドメイン経由のURL（例: https://assets.your-pet-app.com/pets/123/image_abc.webp）
  thumbnailR2Key: v.optional(v.string()), // サムネイルのR2キー（動画用）
  thumbnailR2Url: v.optional(v.string()), // サムネイルのURL
  
  // 後方互換性のため、既存のConvex Storage IDも保持（移行期間中）
  previewStorageId: v.optional(v.string()), // 移行完了後に削除予定
  originalStorageId: v.optional(v.string()), // 移行完了後に削除予定
  
  // メディアタイプ ✅ **2026年追加**
  mediaType: v.union(v.literal("image"), v.literal("video")), // 画像 or 動画
  videoDuration: v.optional(v.number()), // 動画の長さ（秒）
  videoCodec: v.optional(v.string()), // コーデック（HEVC, AV1など）
  videoResolution: v.optional(v.string()), // 解像度（720p, 1080pなど）
})
```

### 4.2 移行戦略

**段階的移行**:
1. **Phase 1**: 新規アップロードはR2に保存
2. **Phase 2**: 既存データをR2に移行（バックグラウンドジョブ）
3. **Phase 3**: Convex Storageの参照を削除

---

## 5. 実装詳細

### 5.1 Presigned URLの発行（Convex Action）

```typescript
// packages/backend/convex/actions/r2.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const generateR2UploadUrl = internalAction({
  args: {
    r2Key: v.string(), // 例: pets/123/image_abc.webp
    contentType: v.string(), // 例: image/webp, video/mp4
    fileSize: v.number(), // ファイルサイズ（バイト）
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("認証が必要です");
    
    // ファイルサイズ制限チェック
    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
    if (args.fileSize > MAX_FILE_SIZE) {
      throw new Error("ファイルサイズが大きすぎます");
    }
    
    const s3Client = new S3Client({
      region: "auto",
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
      },
    });
    
    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: args.r2Key,
      ContentType: args.contentType,
    });
    
    // Presigned URLを発行（有効期限: 5分）
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    
    return {
      uploadUrl: signedUrl,
      publicUrl: `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${args.r2Key}`,
    };
  },
});
```

### 5.2 クライアント側でのアップロード（Expo）

```typescript
// apps/expo/utils/r2Upload.ts
import { useMutation } from "convex/react";
import { api } from "@repo/backend/convex/_generated/api";

export const uploadToR2 = async (
  file: File | Blob,
  r2Key: string,
  contentType: string
) => {
  // 1. Convex ActionからPresigned URLを取得
  const { uploadUrl, publicUrl } = await generateR2UploadUrl({
    r2Key,
    contentType,
    fileSize: file.size,
  });
  
  // 2. R2に直接アップロード
  const response = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": contentType,
    },
  });
  
  if (!response.ok) {
    throw new Error("アップロードに失敗しました");
  }
  
  return publicUrl;
};
```

### 5.3 動画の圧縮（Expo）

```typescript
// apps/expo/utils/videoCompression.ts
import * as VideoThumbnails from "expo-video-thumbnails";
import { Video } from "expo-av";

export const compressVideo = async (
  videoUri: string,
  maxDuration: number, // 無料: 15秒、プレミアム: 60秒
  resolution: "720p" | "1080p" // 無料: 720p、プレミアム: 1080p
): Promise<{
  compressedUri: string;
  thumbnailUri: string;
  duration: number;
  fileSize: number;
}> => {
  // expo-video-compressorを使用（実装例）
  // 実際の実装では、expo-video-compressorやreact-native-video-processingを使用
  
  // サムネイル生成
  const { uri: thumbnailUri } = await VideoThumbnails.getThumbnailAsync(
    videoUri,
    {
      time: 0, // 最初のフレーム
      quality: 0.8,
    }
  );
  
  // 動画の圧縮（HEVC形式）
  // 実際の実装では、ネイティブモジュールを使用
  
  return {
    compressedUri: videoUri, // 圧縮後のURI
    thumbnailUri,
    duration: 0, // 実際の動画の長さ
    fileSize: 0, // 実際のファイルサイズ
  };
};
```

---

## 6. コスト試算

### 6.1 Cloudflare R2の料金（2026年版）

**ストレージ**:
- 10GBまで: 無料
- 10GB超: $0.015/GB/月（約2.25円/GB/月）

**帯域幅（Egress Fee）**:
- **完全に無料**（$0）

**操作（Operations）**:
- Class A（書き込み）: $4.50/百万回
- Class B（読み込み）: $0.36/百万回

### 6.2 動画の容量試算

| 解像度・設定 | コーデック | 容量/分 | 1GBで保存できる時間 |
|------------|----------|--------|-------------------|
| 高画質 (1080p/30fps) | HEVC | 約30〜40MB | 約25〜30分 |
| 標準 (720p/30fps) | HEVC | 約15〜20MB | 約50〜60分 |
| SNS用 (480p相当) | HEVC | 約8〜10MB | 約100〜120分 |

### 6.3 無料枠での制限設計

**無料ユーザー**:
- 動画の長さ: 1本あたり最大15秒
- 動画の本数: 1ペットにつき月間3本まで
- 自動圧縮: 720p/HEVC（約15-20MB/分）

**プレミアムユーザー**:
- 動画の長さ: 1本あたり最大60秒
- 動画の本数: 無制限
- 自動圧縮: 1080p/HEVC（約30-40MB/分）

**試算**:
- 無料ユーザー（月間3本、各15秒）: 約3本 × 0.25分 × 17.5MB = 約13MB/月
- プレミアムユーザー（月間10本、各60秒）: 約10本 × 1分 × 35MB = 約350MB/月

**無料枠（10GB）で耐えられるユーザー数**:
- 無料ユーザーのみ: 約770ユーザー/月
- プレミアムユーザーのみ: 約28ユーザー/月
- 混合（無料:プレミアム = 9:1）: 約250ユーザー/月

---

## 7. セキュリティとプライバシー

### 7.1 署名付きURL（Presigned URLs）

**目的**: プライベートな画像・動画を保護

**実装**:
- Convex ActionからR2に対して、有効期限付きのURL（例：5分間だけ有効）を生成
- ユーザーに渡すURLは有効期限が短いため、スクレイピングや不正アクセスを防げる

### 7.2 WAF（Web Application Firewall）の活用

Cloudflare側で、不審なアクセスやスクレイピングから大切なペットの画像・動画を守る設定が可能です。

---

## 8. Terraform設定

### 8.1 ディレクトリ構成

```
infra/
├── cloudflare/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── r2.tf
└── README.md
```

### 8.2 Terraform設定例

```hcl
# infra/cloudflare/r2.tf
terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

# R2バケットの作成
resource "cloudflare_r2_bucket" "pet_assets" {
  account_id = var.cloudflare_account_id
  name       = "pet-app-assets"
  location   = "apac" # 日本に近いリージョン
}

# カスタムドメインの設定
resource "cloudflare_r2_bucket_domain" "pet_assets_domain" {
  account_id = var.cloudflare_account_id
  bucket     = cloudflare_r2_bucket.pet_assets.name
  domain     = "assets.your-pet-app.com"
}

# DNSレコードの設定
resource "cloudflare_record" "assets_dns" {
  zone_id = var.cloudflare_zone_id
  name    = "assets"
  value   = cloudflare_r2_bucket_domain.pet_assets_domain.domain
  type    = "CNAME"
  proxied = true # CDN機能を有効化
}

# CORS設定（Terraformでは直接設定できないため、CLIまたはAPIで設定）
# 参考: https://developers.cloudflare.com/r2/api/s3/cors/
```

### 8.3 変数定義

```hcl
# infra/cloudflare/variables.tf
variable "cloudflare_account_id" {
  description = "Cloudflare Account ID"
  type        = string
}

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID"
  type        = string
}
```

---

## 9. 移行計画

### 9.1 移行フェーズ

**Phase 1: 新規アップロードをR2に保存（即座に実施）**
- 新規の画像・動画アップロードはR2に保存
- 既存データはConvex Storageから読み込み（後方互換性）

**Phase 2: 既存データの移行（バックグラウンドジョブ）**
- Convex Cronジョブで既存データをR2に移行
- 移行完了後、Convex Storageの参照を削除

**Phase 3: Convex Storageの参照を削除（移行完了後）**
- スキーマから`previewStorageId`と`originalStorageId`を削除
- コードからConvex Storage関連の処理を削除

### 9.2 移行スクリプト（Convex Action）

```typescript
// packages/backend/convex/actions/migrateToR2.ts
export const migrateImageToR2 = internalAction({
  args: {
    imageId: v.id("images"),
  },
  handler: async (ctx, args) => {
    const image = await ctx.runQuery(api.images.get, { imageId: args.imageId });
    if (!image) throw new Error("画像が見つかりません");
    
    // Convex Storageから画像を取得
    const previewBlob = await ctx.storage.get(image.previewStorageId);
    const originalBlob = await ctx.storage.get(image.originalStorageId);
    
    // R2にアップロード
    const previewR2Key = `images/${image._id}/preview.webp`;
    const originalR2Key = `images/${image._id}/original.webp`;
    
    // Presigned URLを取得してアップロード
    // ...（実装）
    
    // メタデータを更新
    await ctx.runMutation(api.images.updateR2Info, {
      imageId: args.imageId,
      previewR2Key,
      originalR2Key,
      previewR2Url: `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${previewR2Key}`,
      originalR2Url: `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${originalR2Key}`,
    });
  },
});
```

---

## 10. まとめ

### 10.1 メリット

1. **コスト削減**: 下り通信料が無料のため、動画再生時のコストが大幅に削減
2. **パフォーマンス向上**: Cloudflare CDNにより、世界中のユーザーに高速なコンテンツ配信
3. **スケーラビリティ**: 動画のような大容量ファイルも扱いやすい

### 10.2 次のステップ

1. Cloudflare R2バケットの作成（Terraform）
2. Convex Actionの実装（Presigned URL発行）
3. クライアント側の実装（アップロード処理）
4. 動画圧縮機能の実装（Expo）
5. 既存データの移行（バックグラウンドジョブ）

---

**作成日**: 2026年2月1日  
**最終更新**: 2026年2月1日

# 5. images（画像・動画管理）

**📚 インデックス**: [CONVEX_SCHEMA_INDEX.md](../CONVEX_SCHEMA_INDEX.md)

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

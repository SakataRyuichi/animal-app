# IPA セキュリティ実装規約

このファイルは、IPA（情報処理推進機構）の「安全なウェブサイトの作り方」に基づくセキュリティ実装規約を定義します。

**重要**: すべてのコード実装は、この規約に従う必要があります。セキュリティは機能実装よりも優先されます。

## 1. SQLインジェクション対策 (IPA 1.1)

### 根本的解決
- **Convexのクエリ引数（`v.string()`等）を必ず使用**し、文字列結合によるクエリ構築を**絶対に禁止**する。
- **バインド機構**: Convexの標準的な `query` / `mutation` 定義を逸脱しない。

### 実装例

```typescript
// ✅ 良い例: Convexの型安全な引数を使用
import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const updatePet = mutation({
  args: {
    petId: v.id("pets"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // Convexの型安全なクエリAPIを使用
    await ctx.db.patch(args.petId, { name: args.name });
  },
});

// ❌ 悪い例: 文字列結合によるクエリ構築（絶対禁止）
// const query = `SELECT * FROM pets WHERE id = '${petId}'`; // 禁止！
```

### チェックポイント
- [ ] すべてのConvex関数で`args`に`v.*`を使用しているか？
- [ ] 文字列結合によるクエリ構築がないか？
- [ ] 外部入力が直接SQLに含まれていないか？

## 2. パス名パラメータ / ディレクトリ・トラバーサル (IPA 1.3)

### 根本的解決
- **Cloudflare R2へ保存するファイル名は、ユーザー入力を直接使わず UUID (v4) 等で生成**する。
- **アクセス制限**: 外部からパスを直接指定させず、DB(Convex)に保存したIDを介してのみアクセスを許可する。

### 実装例

```typescript
// ✅ 良い例: UUIDでファイル名を生成し、DBにIDを保存
import { v4 as uuidv4 } from "uuid";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const uploadPetImage = mutation({
  args: {
    imageData: v.string(), // base64エンコードされた画像データ
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("認証が必要です");
    }

    // UUIDでファイル名を生成（ユーザー入力を使わない）
    const fileName = `${uuidv4()}.jpg`;
    
    // Cloudflare R2にアップロード
    const uploadUrl = await uploadToR2(fileName, args.imageData);
    
    // DBにIDを保存（外部から直接パスを推測できない）
    const fileId = await ctx.db.insert("petImages", {
      userId: identity.subject,
      fileName, // UUIDベースのファイル名
      r2Url: uploadUrl,
      uploadedAt: Date.now(),
    });

    return { fileId };
  },
});

// ✅ 良い例: DBのIDを介してのみアクセスを許可
export const getPetImage = query({
  args: {
    fileId: v.id("petImages"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("認証が必要です");
    }

    // DBからIDで検索（パス名を直接指定させない）
    const image = await ctx.db.get(args.fileId);
    if (!image || image.userId !== identity.subject) {
      throw new ConvexError("アクセス権限がありません");
    }

    // 署名付きURLを生成（一時的なアクセスのみ）
    return generateSignedUrl(image.r2Url);
  },
});

// ❌ 悪い例: ユーザー入力を直接ファイル名に使用（絶対禁止）
// const fileName = args.userProvidedFileName; // 禁止！
// const filePath = `/uploads/${args.userProvidedPath}`; // 禁止！
```

### チェックポイント
- [ ] ファイル名にUUID等の安全な生成方法を使用しているか？
- [ ] ユーザー入力が直接ファイルパスに含まれていないか？
- [ ] DBのIDを介してのみファイルアクセスを許可しているか？
- [ ] 署名付きURLを使用して一時的なアクセスのみを許可しているか？

## 3. クロスサイト・スクリプティング (XSS) (IPA 1.5)

### 根本的解決
- **React/Next.jsのエスケープ機能を信頼**し、`dangerouslySetInnerHTML` は**原則使用禁止**。
- **出力処理**: 外部URL（ペットのプロフィール等）を `<a>` タグ等に渡す際は、`javascript:` プロトコルを排除する。

### 実装例

```typescript
// ✅ 良い例: Reactの自動エスケープを信頼
import { Text } from "@repo/ui";

export function PetProfile({ petName }: { petName: string }) {
  // Reactは自動的にエスケープするため、安全
  return <Text>{petName}</Text>;
}

// ✅ 良い例: URLのバリデーション（javascript:プロトコルを排除）
import { z } from "zod";

const safeUrlSchema = z.string().url().refine(
  (url) => {
    try {
      const parsed = new URL(url);
      // javascript:プロトコルを禁止
      return parsed.protocol !== "javascript:";
    } catch {
      return false;
    }
  },
  { message: "無効なURLです" }
);

export function PetLink({ url }: { url: string }) {
  const safeUrl = safeUrlSchema.parse(url);
  return <a href={safeUrl}>{safeUrl}</a>;
}

// ❌ 悪い例: dangerouslySetInnerHTMLの使用（原則禁止）
// <div dangerouslySetInnerHTML={{ __html: userProvidedHtml }} /> // 禁止！

// ❌ 悪い例: javascript:プロトコルの許可
// <a href={userProvidedUrl}>リンク</a> // バリデーションなしは禁止！
```

### チェックポイント
- [ ] `dangerouslySetInnerHTML`を使用していないか？
- [ ] 外部URLを`<a>`タグに渡す前に、`javascript:`プロトコルを排除しているか？
- [ ] React/Next.jsの自動エスケープ機能を活用しているか？

## 4. CSRF (クロスサイト・リクエスト・フォージェリ) (IPA 1.6)

### 根本的解決
- **Clerkの認証トークンが自動で付与されるConvexクライアントを使用**し、認証が必要な処理には `ctx.auth.getUserIdentity()` のチェックを**必須**とする。

### 実装例

```typescript
// ✅ 良い例: 認証チェックを必須とする
import { mutation } from "./_generated/server";
import { ConvexError } from "convex/values";

export const updatePetSettings = mutation({
  args: {
    petId: v.id("pets"),
    settings: v.object({
      // ...
    }),
  },
  handler: async (ctx, args) => {
    // 認証チェックを必須とする
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        type: "https://api.pet-app.com/errors/authentication-required",
        title: "Authentication Required",
        status: 401,
        detail: "認証が必要です。ログインしてください。",
      });
    }

    // 認可チェック（所有者のみが更新可能）
    const pet = await ctx.db.get(args.petId);
    if (!pet || pet.userId !== identity.subject) {
      throw new ConvexError({
        type: "https://api.pet-app.com/errors/authorization-failed",
        title: "Authorization Failed",
        status: 403,
        detail: "このペットの設定を更新する権限がありません。",
      });
    }

    // 処理を実行
    await ctx.db.patch(args.petId, { settings: args.settings });
  },
});

// ❌ 悪い例: 認証チェックなし（絶対禁止）
// export const updatePetSettings = mutation({
//   handler: async (ctx, args) => {
//     // 認証チェックがない → CSRF脆弱性
//     await ctx.db.patch(args.petId, { settings: args.settings });
//   },
// });
```

### チェックポイント
- [ ] すべての`mutation`で`ctx.auth.getUserIdentity()`をチェックしているか？
- [ ] 認証が必要な`query`でも認証チェックを実施しているか？
- [ ] 認可チェック（所有者確認等）を実施しているか？

## 5. エラーメッセージの情報漏洩対策 (IPA 1.7)

### 根本的解決
- **エラーメッセージにサーバー内部の情報（スタックトレース、DB構造等）を含めない**。
- **RFC 9457準拠のエラーレスポンス**を使用し、詳細情報は`extensions`に含めない（ログのみに記録）。

### 実装例

```typescript
// ✅ 良い例: ユーザー向けの安全なエラーメッセージ
import { ConvexError } from "convex/values";

export const getPet = query({
  args: {
    petId: v.id("pets"),
  },
  handler: async (ctx, args) => {
    try {
      const pet = await ctx.db.get(args.petId);
      if (!pet) {
        // ユーザー向けの安全なメッセージ（内部情報を含まない）
        throw new ConvexError({
          type: "https://api.pet-app.com/errors/resource-not-found",
          title: "Resource Not Found",
          status: 404,
          detail: "指定されたペットが見つかりませんでした。",
          instance: `/pets/${args.petId}`,
        });
      }
      return pet;
    } catch (error) {
      // 内部エラーはログに記録（ユーザーには返さない）
      console.error("Internal error:", error);
      
      // ユーザーには汎用的なエラーメッセージを返す
      throw new ConvexError({
        type: "https://api.pet-app.com/errors/internal-server-error",
        title: "Internal Server Error",
        status: 500,
        detail: "エラーが発生しました。しばらくしてから再度お試しください。",
      });
    }
  },
});

// ❌ 悪い例: スタックトレースやDB構造をエラーメッセージに含める（絶対禁止）
// throw new Error(`Database error: ${dbError.stack}`); // 禁止！
// throw new Error(`Table 'pets' doesn't exist`); // 禁止！
```

### チェックポイント
- [ ] エラーメッセージにスタックトレースを含めていないか？
- [ ] エラーメッセージにDB構造やテーブル名を含めていないか？
- [ ] エラーメッセージにファイルパスや内部IDを含めていないか？
- [ ] RFC 9457準拠のエラーレスポンスを使用しているか？

## 6. 3ヶ月ロック機能のセキュリティ検証

### 脆弱性リスクと対策

#### アクセス制御の不備

**リスク**: 有料級の動画URLを、ブラウザ側のCSS非表示だけで隠す。

**対策**:
- **Convex側でURL（署名付き）の発行自体を拒否**する。
- 無料ユーザーが3ヶ月以前のデータにアクセスしようとした場合、Convex関数でエラーを返す。

```typescript
// ✅ 良い例: Convex側でアクセス制御を実施
export const getPetVideo = query({
  args: {
    videoId: v.id("petVideos"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        type: "https://api.pet-app.com/errors/authentication-required",
        title: "Authentication Required",
        status: 401,
        detail: "認証が必要です。",
      });
    }

    const video = await ctx.db.get(args.videoId);
    if (!video) {
      throw new ConvexError({
        type: "https://api.pet-app.com/errors/resource-not-found",
        title: "Resource Not Found",
        status: 404,
        detail: "動画が見つかりませんでした。",
      });
    }

    // 3ヶ月以前のデータかチェック
    const threeMonthsAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
    const isOldData = video.recordedAt < threeMonthsAgo;

    // ユーザーの有料プラン確認
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (isOldData && !user?.isPremium) {
      // 無料ユーザーは3ヶ月以前のデータにアクセス不可
      throw new ConvexError({
        type: "https://api.pet-app.com/errors/premium-required",
        title: "Premium Required",
        status: 403,
        detail: "3ヶ月以前のデータはプレミアム会員限定です。",
      });
    }

    // 署名付きURLを生成（一時的なアクセスのみ）
    return generateSignedUrl(video.r2Url);
  },
});
```

#### 情報の漏洩

**リスク**: モザイク画像はサーバーサイド（またはアップロード時）で生成し、オリジナル画像へのパスが無料ユーザーに推測されないようにする。

**対策**:
- **モザイク画像はアップロード時に生成**し、別のR2オブジェクトとして保存する。
- 無料ユーザーにはモザイク画像のURLのみを返す。

```typescript
// ✅ 良い例: アップロード時にモザイク画像を生成
export const uploadPetImage = mutation({
  args: {
    imageData: v.string(), // base64エンコードされた画像データ
    recordedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        type: "https://api.pet-app.com/errors/authentication-required",
        title: "Authentication Required",
        status: 401,
        detail: "認証が必要です。",
      });
    }

    // オリジナル画像をR2にアップロード
    const originalFileName = `${uuidv4()}.jpg`;
    const originalUrl = await uploadToR2(originalFileName, args.imageData);

    // モザイク画像を生成（サーバーサイドで処理）
    const mosaicImageData = await generateMosaicImage(args.imageData);
    const mosaicFileName = `${uuidv4()}_mosaic.jpg`;
    const mosaicUrl = await uploadToR2(mosaicFileName, mosaicImageData);

    // DBに保存（オリジナルとモザイクの両方のURLを保存）
    const imageId = await ctx.db.insert("petImages", {
      userId: identity.subject,
      originalFileName,
      originalUrl, // 有料ユーザーのみアクセス可能
      mosaicFileName,
      mosaicUrl, // 無料ユーザーもアクセス可能
      recordedAt: args.recordedAt,
      uploadedAt: Date.now(),
    });

    return { imageId };
  },
});

// ✅ 良い例: ユーザーのプランに応じて適切なURLを返す
export const getPetImage = query({
  args: {
    imageId: v.id("petImages"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        type: "https://api.pet-app.com/errors/authentication-required",
        title: "Authentication Required",
        status: 401,
        detail: "認証が必要です。",
      });
    }

    const image = await ctx.db.get(args.imageId);
    if (!image || image.userId !== identity.subject) {
      throw new ConvexError({
        type: "https://api.pet-app.com/errors/authorization-failed",
        title: "Authorization Failed",
        status: 403,
        detail: "アクセス権限がありません。",
      });
    }

    // ユーザーの有料プラン確認
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    // 3ヶ月以前のデータかチェック
    const threeMonthsAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
    const isOldData = image.recordedAt < threeMonthsAgo;

    // 無料ユーザーかつ3ヶ月以前のデータの場合、モザイク画像を返す
    if (isOldData && !user?.isPremium) {
      return generateSignedUrl(image.mosaicUrl);
    }

    // 有料ユーザーまたは3ヶ月以内のデータの場合、オリジナル画像を返す
    return generateSignedUrl(image.originalUrl);
  },
});
```

### チェックポイント
- [ ] 3ヶ月以前のデータへのアクセスをConvex側で制御しているか？
- [ ] CSS非表示だけでアクセス制御していないか？
- [ ] モザイク画像はサーバーサイド（またはアップロード時）で生成しているか？
- [ ] オリジナル画像のURLが無料ユーザーに推測されないようにしているか？

## セキュリティチェックリスト

コード実装時は、以下のチェックリストを確認してください：

### 入力検証
- [ ] すべての外部入力にZodバリデーションを実施しているか？
- [ ] ファイル名にUUID等の安全な生成方法を使用しているか？
- [ ] URLの`javascript:`プロトコルを排除しているか？

### 認証・認可
- [ ] すべての`mutation`で`ctx.auth.getUserIdentity()`をチェックしているか？
- [ ] 認可チェック（所有者確認等）を実施しているか？
- [ ] 3ヶ月以前のデータへのアクセスをConvex側で制御しているか？

### エラーハンドリング
- [ ] エラーメッセージにスタックトレースを含めていないか？
- [ ] エラーメッセージにDB構造やテーブル名を含めていないか？
- [ ] RFC 9457準拠のエラーレスポンスを使用しているか？

### ファイルアクセス
- [ ] DBのIDを介してのみファイルアクセスを許可しているか？
- [ ] 署名付きURLを使用して一時的なアクセスのみを許可しているか？
- [ ] モザイク画像はサーバーサイドで生成しているか？

## 参考資料

- [IPA「安全なウェブサイトの作り方」](https://www.ipa.go.jp/security/vuln/websecurity.html)
- [RFC 9457: Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html)
- [Convex Security Best Practices](https://docs.convex.dev/security)
- [.cursor/rules/ERROR_HANDLING.md](./ERROR_HANDLING.md): エラーハンドリング規格

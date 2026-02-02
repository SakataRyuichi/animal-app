# エラーハンドリング規格（RFC 9457準拠）

このファイルは、プロジェクト全体で統一されたエラーハンドリング規格を定義します。

**重要**: すべてのAPIエラーは RFC 9457 (Problem Details for HTTP APIs) に準拠する必要があります。

## 基本原則

### なぜ統一規格が必要か？

1. **一貫性**: Convexのバックエンド関数、Next.jsのAPI、Expoのエラーハンドリング全てで同じレスポンス構造を強制
2. **監視・分析**: Better Stack Logsでの分析が劇的に楽になる（構造化されたエラーログ）
3. **デバッグ**: `instance`フィールドでエラーが発生した具体的なリソースを特定可能
4. **拡張性**: `extensions`フィールドに`requestId`や`traceId`を入れることで、ClerkのユーザーIDとBetter Stackのログを瞬時に紐付け

## RFC 9457準拠のエラーレスポンス構造

### 基本構造

```typescript
type ErrorResponse = {
  type: string;        // エラーの種類を特定するURI（必須）
  title: string;       // 人間が読める短いエラー概要（必須）
  status: number;      // HTTPステータスコード（必須）
  detail?: string;     // この発生事例に関する具体的な説明（推奨）
  instance?: string;   // エラーが発生した具体的なリソースのURI（デバッグ用）
  extensions?: {       // 拡張フィールド（Better Stack、Sentry用）
    requestId?: string;
    traceId?: string;
    userId?: string;
    sentryEventId?: string; // SentryのイベントID（フロントとバックのエラーを紐付ける）
    [key: string]: unknown;
  };
};
```

### エラータイプの定義

エラータイプは以下のURI形式で定義します：

```
https://api.pet-app.com/errors/{error-code}
```

#### エラーコード一覧

| エラーコード | HTTPステータス | 説明 |
|------------|--------------|------|
| `authentication-required` | 401 | 認証が必要です |
| `authorization-failed` | 403 | 権限がありません |
| `premium-required` | 403 | プレミアム会員が必要です |
| `resource-not-found` | 404 | リソースが見つかりません |
| `validation-failed` | 400 | バリデーションエラー |
| `insufficient-points` | 403 | ポイントが不足しています |
| `rate-limit-exceeded` | 429 | レート制限を超えました |
| `internal-server-error` | 500 | 内部サーバーエラー |
| `external-api-error` | 502 | 外部APIエラー |
| `service-unavailable` | 503 | サービスが利用できません |

## 実装ルール

### Convex関数でのエラーハンドリング

Convex関数では`ConvexError`を使用し、RFC 9457準拠の構造を渡します。

```typescript
import { ConvexError } from "convex/values";

// ✅ 良い例: RFC 9457準拠のエラーレスポンス
export const createPet = mutation({
  args: {
    name: v.string(),
    species: v.union(v.literal("dog"), v.literal("cat"), v.literal("reptile"), v.literal("other")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        type: "https://api.pet-app.com/errors/authentication-required",
        title: "Authentication Required",
        status: 401,
        detail: "認証が必要です。ログインしてください。",
        instance: `/pets`,
        extensions: {
          requestId: ctx.requestId,
        },
      });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new ConvexError({
        type: "https://api.pet-app.com/errors/resource-not-found",
        title: "User Not Found",
        status: 404,
        detail: "ユーザーが見つかりません。",
        instance: `/users/${identity.tokenIdentifier}`,
        extensions: {
          requestId: ctx.requestId,
          userId: identity.tokenIdentifier,
        },
      });
    }

    // プレミアム会員チェック
    if (!isPremiumSubscription(user.subscription)) {
      throw new ConvexError({
        type: "https://api.pet-app.com/errors/premium-required",
        title: "Premium Required",
        status: 403,
        detail: "この機能はプレミアム会員限定です。",
        instance: `/pets`,
        extensions: {
          requestId: ctx.requestId,
          userId: user._id,
        },
      });
    }

    // ポイント不足チェック
    if (user.points < requiredPoints) {
      throw new ConvexError({
        type: "https://api.pet-app.com/errors/insufficient-points",
        title: "Insufficient Points",
        status: 403,
        detail: `あと${requiredPoints - user.points}pt足りません。`,
        instance: `/pets`,
        extensions: {
          requestId: ctx.requestId,
          userId: user._id,
          requiredPoints,
          currentPoints: user.points,
        },
      });
    }

    // 正常処理
    const petId = await ctx.db.insert("pets", args);
    return petId;
  },
});
```

### エラーヘルパー関数の作成

共通のエラーヘルパー関数を作成し、一貫性を保ちます。

**重要**: Sentry統合を含む完全版の実装は **[MONITORING.md](./MONITORING.md)** を参照してください。

```typescript
// packages/backend/convex/lib/errors.ts
import { ConvexError } from "convex/values";

type ErrorCode =
  | "authentication-required"
  | "authorization-failed"
  | "premium-required"
  | "resource-not-found"
  | "validation-failed"
  | "insufficient-points"
  | "rate-limit-exceeded"
  | "internal-server-error"
  | "external-api-error"
  | "service-unavailable";

type ErrorExtensions = {
  requestId?: string;
  traceId?: string;
  userId?: string;
  sentryEventId?: string; // SentryのイベントID（通常はサーバー側で付与）
  [key: string]: unknown;
};

const ERROR_BASE_URL = "https://api.pet-app.com/errors";

const ERROR_TITLES: Record<ErrorCode, string> = {
  "authentication-required": "Authentication Required",
  "authorization-failed": "Authorization Failed",
  "premium-required": "Premium Required",
  "resource-not-found": "Resource Not Found",
  "validation-failed": "Validation Failed",
  "insufficient-points": "Insufficient Points",
  "rate-limit-exceeded": "Rate Limit Exceeded",
  "internal-server-error": "Internal Server Error",
  "external-api-error": "External API Error",
  "service-unavailable": "Service Unavailable",
};

const ERROR_STATUS_CODES: Record<ErrorCode, number> = {
  "authentication-required": 401,
  "authorization-failed": 403,
  "premium-required": 403,
  "resource-not-found": 404,
  "validation-failed": 400,
  "insufficient-points": 403,
  "rate-limit-exceeded": 429,
  "internal-server-error": 500,
  "external-api-error": 502,
  "service-unavailable": 503,
};

// 基本版（Sentry統合なし）
export function createError(
  code: ErrorCode,
  detail: string,
  instance?: string,
  extensions?: ErrorExtensions
): ConvexError {
  return new ConvexError({
    type: `${ERROR_BASE_URL}/${code}`,
    title: ERROR_TITLES[code],
    status: ERROR_STATUS_CODES[code],
    detail,
    instance,
    extensions,
  });
}

// 使用例（Sentry統合なし）
export const createPet = mutation({
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw createError(
        "authentication-required",
        "認証が必要です。ログインしてください。",
        "/pets",
        { requestId: ctx.requestId }
      );
    }

    // ...
  },
});
```

**注意**: 本番環境では、Sentry統合を含む完全版の`createError`を使用してください。詳細は **[MONITORING.md](./MONITORING.md)** の「Convex関数でのSentry統合」セクションを参照してください。

### Next.js API Routeでのエラーハンドリング

Next.jsのAPI Routeでも同じ構造を使用します：

```typescript
// apps/www/app/api/pets/route.ts
import { NextResponse } from "next/server";
import { createError } from "@repo/backend/convex/lib/errors";

export async function GET(request: Request) {
  try {
    // 処理
    const pets = await getPets();
    return NextResponse.json(pets);
  } catch (error) {
    if (error instanceof ConvexError) {
      // ConvexErrorは既にRFC 9457準拠の構造
      return NextResponse.json(error.data, { status: error.data.status });
    }

    // 予期しないエラー
    return NextResponse.json(
      createError(
        "internal-server-error",
        "予期しないエラーが発生しました。",
        request.url,
        { requestId: crypto.randomUUID() }
      ),
      { status: 500 }
    );
  }
}
```

### Expo（モバイルアプリ）でのエラーハンドリング

Expoアプリでは、Convex関数のエラーをキャッチし、ユーザーに分かりやすいメッセージを表示します。

**重要**: Sentry統合を含む完全版の実装は **[MONITORING.md](./MONITORING.md)** を参照してください。

```typescript
// apps/expo/lib/error-handler.ts
import { ConvexError } from "convex/values";
import * as Sentry from "sentry-expo";
import * as Clipboard from "expo-clipboard";
import { showToast } from "@/components/toast";

type ErrorResponse = {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  extensions?: {
    requestId?: string;
    traceId?: string;
    userId?: string;
    sentryEventId?: string; // SentryのイベントID（フロントとバックのエラーを紐付ける）
    [key: string]: unknown;
  };
};

export function handleError(error: unknown): void {
  // ConvexErrorの場合
  if (error instanceof ConvexError) {
    const errorData = error.data as ErrorResponse;
    const sentryEventId = errorData.extensions?.sentryEventId;

    // ユーザーに分かりやすいメッセージを表示
    showToast({
      type: "error",
      title: errorData.title,
      message: errorData.detail || errorData.title,
      // Sentry IDを表示（ユーザーがサポートに問い合わせる際に使用）
      action: sentryEventId
        ? {
            label: `お問い合わせID: ${sentryEventId}`,
            onPress: () => {
              // クリップボードにコピー
              Clipboard.setString(sentryEventId);
            },
          }
        : undefined,
    });

    // Sentryにエラーを送信（フロントエンド側でも）
    Sentry.withScope((scope) => {
      scope.setTag("errorType", errorData.type);
      scope.setTag("statusCode", errorData.status.toString());
      scope.setContext("error", {
        type: errorData.type,
        title: errorData.title,
        detail: errorData.detail,
        instance: errorData.instance,
      });

      // Convex側のSentryイベントIDをリンクとして追加
      if (sentryEventId) {
        scope.setContext("backend", {
          sentryEventId,
          sentryUrl: `https://sentry.io/organizations/your-org/issues/?query=${sentryEventId}`,
        });
      }

      Sentry.captureException(error);
    });

    return;
  }

  // 予期しないエラー
  showToast({
    type: "error",
    title: "エラーが発生しました",
    message: "しばらくしてから再度お試しください。",
  });

  if (typeof Sentry !== "undefined") {
    Sentry.captureException(error);
  }
}

// 使用例
import { useMutation } from "convex/react";
import { api } from "@repo/backend/convex/_generated/api";
import { handleError } from "@/lib/error-handler";

const CreatePetForm = () => {
  const createPet = useMutation(api.pets.create);

  const onSubmit = async (data: PetFormData) => {
    try {
      await createPet(data);
      showToast({ type: "success", message: "ペットを登録しました" });
    } catch (error) {
      handleError(error);
    }
  };

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
};
```

## Better Stack連携

### エラーログの構造化

RFC 9457準拠のエラーレスポンスにより、Better Stack Logsでの分析が劇的に楽になります：

```typescript
// Better Stackへのログ送信例
import { log } from "@betterstack/logs";

export const createPet = mutation({
  handler: async (ctx, args) => {
    try {
      // 処理
      const petId = await ctx.db.insert("pets", args);
      return petId;
    } catch (error) {
      if (error instanceof ConvexError) {
        const errorData = error.data as ErrorResponse;
        
        // Better Stackに構造化されたログを送信
        await log({
          level: "error",
          message: errorData.title,
          context: {
            type: errorData.type,
            status: errorData.status,
            detail: errorData.detail,
            instance: errorData.instance,
            ...errorData.extensions,
          },
        });
      }

      throw error;
    }
  },
});
```

### Better Stackでの分析例

構造化されたエラーログにより、以下のような分析が可能になります：

```sql
-- 過去24時間で急増しているエラータイプを特定
SELECT 
  type,
  COUNT(*) as error_count
FROM logs
WHERE level = 'error'
  AND timestamp > NOW() - INTERVAL '24 hours'
GROUP BY type
ORDER BY error_count DESC;

-- 特定のユーザーIDに関連するエラーを検索
SELECT *
FROM logs
WHERE context->>'userId' = 'user_123'
  AND level = 'error'
ORDER BY timestamp DESC;
```

## Sentry連携

Sentryにもエラー情報を送信し、`extensions`フィールドの情報を活用します。

**重要**: Sentryの最大の強みは、**ユーザーの手元（Expo）で起きたエラーと、サーバー（Convex）で起きたエラーを一つの「Issue」として紐付けられる点**です。

詳細は **[MONITORING.md](./MONITORING.md)** を参照してください。

### Convex関数でのSentry統合

```typescript
// packages/backend/convex/lib/errors.ts
import { ConvexError } from "convex/values";
import * as Sentry from "@sentry/node";

export function createError(
  code: ErrorCode,
  detail: string,
  instance?: string,
  extensions?: ErrorExtensions
): ConvexError {
  // Sentryにエラーを送信（withScopeでタグを付与）
  const eventId = Sentry.withScope((scope) => {
    scope.setTag("errorType", code);
    scope.setTag("statusCode", ERROR_STATUS_CODES[code].toString());
    scope.setContext("error", {
      type: `${ERROR_BASE_URL}/${code}`,
      title: ERROR_TITLES[code],
      detail,
      instance,
    });
    
    // User Contextを設定（extensionsに含まれるuserIdを設定）
    if (extensions?.userId) {
      scope.setUser({ id: extensions.userId });
    }
    
    const error = new Error(detail);
    return Sentry.captureException(error);
  });

  // RFC 9457準拠のエラーレスポンスを作成（SentryのeventIdを含める）
  return new ConvexError({
    type: `${ERROR_BASE_URL}/${code}`,
    title: ERROR_TITLES[code],
    status: ERROR_STATUS_CODES[code],
    detail,
    instance,
    extensions: {
      ...extensions,
      sentryEventId: eventId, // SentryのイベントIDを含める
    },
  });
}
```

### ExpoアプリでのSentry統合

**重要**: 完全版の実装は **[MONITORING.md](./MONITORING.md)** の「4. フロントエンド: エラー画面に『お問い合わせID: [Sentry ID]』を表示」セクションを参照してください。

上記の`handleError`関数の実装例を参照してください。

### Sentry導入時の3つの「神設定」

1. **User Contextの注入**: Clerkから取得した`userId`を`Sentry.setUser()`にセット
2. **Sampling Rateの管理**: 本番環境では`0.1`（10%）に設定し、重大なエラー（status: 500）は必ず送信
3. **Source Mapsのアップロード**: CI/CD（GitHub Actions）でソースマップをSentryに送る設定

詳細は **[MONITORING.md](./MONITORING.md)** を参照してください。

## チェックリスト

コードを書く際は、以下のチェックリストを確認してください：

- [ ] エラーは`ConvexError`を使用しているか？（Convex関数の場合）
- [ ] エラーレスポンスはRFC 9457準拠の構造になっているか？
- [ ] `type`フィールドは正しいURI形式か？
- [ ] `title`フィールドは人間が読める形式か？
- [ ] `status`フィールドは適切なHTTPステータスコードか？
- [ ] `detail`フィールドはユーザーに分かりやすいメッセージか？
- [ ] `instance`フィールドはエラーが発生したリソースのURIか？
- [ ] `extensions`フィールドに`requestId`や`traceId`を含めているか？
- [ ] `extensions`フィールドに`sentryEventId`を含めているか？（Convex関数の場合）
- [ ] フロントエンドでエラーを適切にハンドリングしているか？
- [ ] Better StackやSentryにエラー情報を送信しているか？
- [ ] SentryのUser Contextを設定しているか？（ClerkのuserId）
- [ ] SentryのSampling Rateを設定しているか？（本番環境では0.1）
- [ ] 重大なエラー（status: 500）は必ずSentryに送信するようフィルタリングしているか？

## 参考資料

- [RFC 9457: Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html)
- [Convex Error Handling](https://docs.convex.dev/functions/error-handling)
- [Better Stack Logs](https://betterstack.com/docs/logs/)
- [Sentry Error Tracking](https://docs.sentry.io/platforms/react-native/)
- **[MONITORING.md](./MONITORING.md)**: SentryとBetter Stackの詳細設計

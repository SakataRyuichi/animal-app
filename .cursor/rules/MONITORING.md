# 監視・エラー追跡設計（Sentry + Better Stack）

このファイルは、SentryとBetter Stackを使った監視・エラー追跡の設計を定義します。

**重要**: SentryとBetter Stackは**役割が異なる**ため、両方を活用します。

## 役割分担

### Sentry: 「なぜ（Why）」起きたかを探る場所
- **目的**: スタックトレースや変数の状態を見てバグを修正する
- **強み**: フロント（Expo）とバック（Convex）のエラーを一つの「Issue」として紐付け
- **用途**: エラーの詳細な原因分析、デバッグ、パフォーマンス監視

### Better Stack: 「何が（What）」起きているか、サービス全体を俯瞰する場所
- **目的**: エラー数、レスポンスタイム、死活監視、リソース限界の監視
- **強み**: SQLクエリベースの分析、構造化ログの集計
- **用途**: サービス全体の健全性監視、トレンド分析、アラート設定

## Sentryの役割分担：フロントとバックの統合

Sentryの最大の強みは、**ユーザーの手元（Expo）で起きたエラーと、サーバー（Convex）で起きたエラーを一つの「Issue」として紐付けられる点**です。

### 環境ごとの送信内容と実装ポイント

| 環境 | 送信すべき内容 | 実装のポイント |
|------|--------------|---------------|
| **Expo (App)** | クラッシュログ、レンダリングエラー、ネットワーク遅延 | `Sentry.init`で自動キャプチャ。パンくずリスト（エラー直前の画面遷移）が重要 |
| **Next.js (Web)** | SSRエラー、ハイドレーション失敗、VercelのEdge Runtimeエラー | Vercel連携により、デプロイごとのエラー率を監視 |
| **Convex (Backend)** | DBクエリ失敗、外部API（Stripe/R2）連携エラー、Cronの失敗 | `ConvexError`を投げる際に、SentryのイベントIDを含める |

## RFC 9457を活用したエラー追跡フロー

エラーが発生した際、ユーザー、Convex、Sentry、Better Stackの間で情報を以下のようにリレーします：

### 1. Convexでエラー発生

RFC 9457形式のオブジェクトを作成し、Sentryに送信：

```typescript
// packages/backend/convex/lib/errors.ts
import { ConvexError } from "convex/values";
import * as Sentry from "@sentry/node";

type ErrorCode = "authentication-required" | "premium-required" | ...;

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
    
    // extensionsに含まれるuserIdをSentryのUser Contextに設定
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

**注意**: Convexの実行環境はV8ベースのため、`@sentry/node`が利用できない場合があります。  
その場合は、SentryのHTTPエンドポイントへの送信（fetchベース）や、対応する軽量SDKを使用してください。

### 2. レスポンス: extensionsフィールドにsentryEventIdを入れてフロントエンドに返す

Convex関数から返されるエラーには、`extensions.sentryEventId`が含まれます。

### 3. Better Stackへ: SentryのURLリンクを含めた構造化ログを送信

```typescript
// packages/backend/convex/lib/monitoring.ts
import { log } from "@betterstack/logs";

export async function logErrorToBetterStack(
  errorData: ErrorResponse,
  context?: Record<string, unknown>
): Promise<void> {
  const sentryUrl = errorData.extensions?.sentryEventId
    ? `https://sentry.io/organizations/your-org/issues/?query=${errorData.extensions.sentryEventId}`
    : undefined;

  await log({
    level: "error",
    message: errorData.title,
    context: {
      type: errorData.type,
      status: errorData.status,
      detail: errorData.detail,
      instance: errorData.instance,
      sentryUrl, // SentryのURLリンクを含める
      ...errorData.extensions,
      ...context,
    },
  });
}
```

### 4. フロントエンド: エラー画面に「お問い合わせID: [Sentry ID]」を表示

```typescript
// apps/expo/lib/error-handler.ts
import { ConvexError } from "convex/values";
import * as Sentry from "sentry-expo";
import * as Clipboard from "expo-clipboard";
import { showToast } from "@/components/toast";

export function handleError(error: unknown): void {
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
  }
}
```

## Sentry導入時に設定すべき3つの「神設定」

### 1. User Contextの注入

Clerkから取得した`userId`を`Sentry.setUser()`にセットします。これにより「特定のユーザーだけに起きているエラー」が即座にわかります。

```typescript
// apps/expo/lib/sentry.ts
import * as Sentry from "sentry-expo";
import { useAuth } from "@clerk/clerk-expo";

export function initializeSentry(): void {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    enableInExpoDevelopment: false,
    debug: __DEV__,
    tracesSampleRate: __DEV__ ? 1.0 : 0.1, // 本番環境では10%
    beforeSend(event, hint) {
      // 重大なエラー（status: 500）は必ず送信
      if (event.level === "error" && event.tags?.statusCode === "500") {
        return event;
      }
      return event;
    },
  });
}

// Clerkのユーザー情報をSentryに設定
export function setSentryUser(userId: string, email?: string): void {
  Sentry.setUser({
    id: userId,
    email,
  });
}

// 使用例: ログイン後に呼び出す
// apps/expo/app/_layout.tsx
import { useEffect } from "react";
import { Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { initializeSentry, setSentryUser } from "@/lib/sentry";

export function AppRoot(): JSX.Element {
  const { userId, emailAddress } = useAuth();

  useEffect(() => {
    initializeSentry();
  }, []);

  useEffect(() => {
    if (userId) {
      setSentryUser(userId, emailAddress);
    }
  }, [userId, emailAddress]);

  return <Stack />;
}
```

```typescript
// packages/backend/convex/lib/sentry.ts
import * as Sentry from "@sentry/node";

export function initializeSentry(): void {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0.1, // 本番環境では10%
    beforeSend(event, hint) {
      // 重大なエラー（status: 500）は必ず送信
      if (event.level === "error" && event.tags?.statusCode === "500") {
        return event;
      }
      return event;
    },
  });
}

// Convex関数内でユーザー情報を設定
export function setSentryUser(ctx: QueryCtx | MutationCtx, userId: string): void {
  Sentry.withScope((scope) => {
    scope.setUser({ id: userId });
  });
}
```

### 2. Sampling Rateの管理

無料枠を守るため、`tracesSampleRate`を本番環境では`0.1`（10%）程度に絞りつつ、**重大なエラー（status: 500）は必ず送るようフィルタリング**します。

```typescript
// apps/expo/lib/sentry.ts
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  tracesSampleRate: __DEV__ ? 1.0 : 0.1, // 開発環境: 100%, 本番環境: 10%
  beforeSend(event, hint) {
    // 重大なエラー（status: 500）は必ず送信
    if (event.level === "error" && event.tags?.statusCode === "500") {
      return event;
    }
    
    // その他のエラーはサンプリングレートに従う
    return event;
  },
});
```

```typescript
// packages/backend/convex/lib/sentry.ts
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1, // 本番環境では10%
  beforeSend(event, hint) {
    // 重大なエラー（status: 500）は必ず送信
    if (event.level === "error" && event.tags?.statusCode === "500") {
      return event;
    }
    
    // その他のエラーはサンプリングレートに従う
    return event;
  },
});
```

### 3. Source Mapsのアップロード

ExpoやNext.jsの難読化されたコードを、元のTypeScriptコードで表示するために、CI/CD（GitHub Actions）でソースマップをSentryに送る設定をします。

```yaml
# .github/workflows/sentry-sourcemaps.yml
name: Upload Source Maps to Sentry

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  upload-sourcemaps:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build Expo app
        run: |
          cd apps/expo
          pnpm expo export --platform ios --output-dir dist/ios
          pnpm expo export --platform android --output-dir dist/android
        env:
          EXPO_PUBLIC_SENTRY_DSN: ${{ secrets.EXPO_PUBLIC_SENTRY_DSN }}
      
      - name: Upload iOS source maps
        uses: getsentry/action-release@v1
        with:
          environment: production
          version: ${{ github.sha }}
          url: https://sentry.io/
          auth_token: ${{ secrets.SENTRY_AUTH_TOKEN }}
          org: your-org
          project: your-project
          sourcemaps: apps/expo/dist/ios
      
      - name: Upload Android source maps
        uses: getsentry/action-release@v1
        with:
          environment: production
          version: ${{ github.sha }}
          url: https://sentry.io/
          auth_token: ${{ secrets.SENTRY_AUTH_TOKEN }}
          org: your-org
          project: your-project
          sourcemaps: apps/expo/dist/android
```

```yaml
# .github/workflows/sentry-sourcemaps-nextjs.yml
name: Upload Next.js Source Maps to Sentry

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  upload-sourcemaps:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build Next.js app
        run: |
          cd apps/www
          pnpm build
        env:
          SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
      
      - name: Upload source maps
        uses: getsentry/action-release@v1
        with:
          environment: production
          version: ${{ github.sha }}
          url: https://sentry.io/
          auth_token: ${{ secrets.SENTRY_AUTH_TOKEN }}
          org: your-org
          project: your-project-nextjs
          sourcemaps: apps/www/.next
```

## Better StackとSentryの使い分け（詳細）

### Sentryの詳細な用途

**用途**:
- スタックトレースや変数の状態を見てバグを修正する
- フロント（Expo）とバック（Convex）のエラーを一つの「Issue」として紐付け
- パフォーマンス監視（遅いAPI呼び出しの特定）
- リリースごとのエラー追跡

**使用例**:
- 「このエラーは特定のユーザーだけに起きているか？」
- 「このエラーは最新リリースで増加しているか？」
- 「このAPI呼び出しが遅い原因は何か？」

### Better Stackの詳細な用途

**用途**:
- エラー数、レスポンスタイム、死活監視、リソース限界の監視
- SQLクエリベースの分析
- 構造化ログの集計
- アラート設定（例: エラー数が1時間で100件を超えたら通知）

**使用例**:
- 「過去24時間で急増しているエラータイプは何か？」
- 「特定のユーザーIDに関連するエラーは何件か？」
- 「Convexのリソース使用率は何%か？」
- 「Amazon APIの更新が失敗しているか？」

## 実装例

### Convex関数でのSentry統合

```typescript
// packages/backend/convex/lib/errors.ts
import { ConvexError } from "convex/values";
import * as Sentry from "@sentry/node";
import { logErrorToBetterStack } from "./monitoring";

export function createError(
  code: ErrorCode,
  detail: string,
  instance?: string,
  extensions?: ErrorExtensions
): ConvexError {
  // Sentryにエラーを送信
  const eventId = Sentry.withScope((scope) => {
    scope.setTag("errorType", code);
    scope.setTag("statusCode", ERROR_STATUS_CODES[code].toString());
    scope.setContext("error", {
      type: `${ERROR_BASE_URL}/${code}`,
      title: ERROR_TITLES[code],
      detail,
      instance,
    });
    
    // User Contextを設定
    if (extensions?.userId) {
      scope.setUser({ id: extensions.userId });
    }
    
    const error = new Error(detail);
    return Sentry.captureException(error);
  });

  const errorResponse: ErrorResponse = {
    type: `${ERROR_BASE_URL}/${code}`,
    title: ERROR_TITLES[code],
    status: ERROR_STATUS_CODES[code],
    detail,
    instance,
    extensions: {
      ...extensions,
      sentryEventId: eventId,
    },
  };

  // Better Stackにログを送信（非同期、エラーを投げない）
  logErrorToBetterStack(errorResponse, {
    sentryUrl: `https://sentry.io/organizations/your-org/issues/?query=${eventId}`,
  }).catch((err) => {
    // Better Stackへの送信が失敗しても、エラーを投げない
    console.error("Failed to log to Better Stack:", err);
  });

  return new ConvexError(errorResponse);
}
```

### ExpoアプリでのSentry統合

```typescript
// apps/expo/lib/sentry.ts
import * as Sentry from "sentry-expo";
import { useAuth } from "@clerk/clerk-expo";

export function initializeSentry(): void {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    enableInExpoDevelopment: false,
    debug: __DEV__,
    tracesSampleRate: __DEV__ ? 1.0 : 0.1,
    beforeSend(event, hint) {
      // 重大なエラー（status: 500）は必ず送信
      if (event.level === "error" && event.tags?.statusCode === "500") {
        return event;
      }
      return event;
    },
    // パンくずリスト（エラー直前の画面遷移）は自動収集を利用
    // 追加の計測が必要な場合は、Sentry公式のReact Native/Expo連携ガイドに従う
  });
}

// Clerkのユーザー情報をSentryに設定
export function setSentryUser(userId: string, email?: string): void {
  Sentry.setUser({
    id: userId,
    email,
  });
}

// 使用例: アプリ起動時に初期化
// apps/expo/app/_layout.tsx
import { useEffect } from "react";
import { Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { initializeSentry, setSentryUser } from "@/lib/sentry";

export default function RootLayout() {
  const { userId, emailAddress } = useAuth();

  useEffect(() => {
    initializeSentry();
  }, []);

  useEffect(() => {
    if (userId) {
      setSentryUser(userId, emailAddress);
    }
  }, [userId, emailAddress]);

  return <Stack />;
}
```

### Next.jsアプリでのSentry統合

```typescript
// apps/www/sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
  beforeSend(event, hint) {
    // 重大なエラー（status: 500）は必ず送信
    if (event.level === "error" && event.tags?.statusCode === "500") {
      return event;
    }
    return event;
  },
});
```

```typescript
// apps/www/sentry.server.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
  beforeSend(event, hint) {
    // 重大なエラー（status: 500）は必ず送信
    if (event.level === "error" && event.tags?.statusCode === "500") {
      return event;
    }
    return event;
  },
});
```

## チェックリスト

SentryとBetter Stackを導入する際は、以下のチェックリストを確認してください：

### Sentry設定
- [ ] Expoアプリで`Sentry.init`を設定しているか？
- [ ] Next.jsアプリで`Sentry.init`を設定しているか？（クライアント・サーバー両方）
- [ ] Convex関数で`Sentry.init`を設定しているか？
- [ ] User Contextを注入しているか？（ClerkのuserIdを設定）
- [ ] Sampling Rateを設定しているか？（本番環境では0.1）
- [ ] 重大なエラー（status: 500）は必ず送信するようフィルタリングしているか？
- [ ] Source MapsをアップロードするCI/CDパイプラインを設定しているか？
- [ ] パンくずリスト（エラー直前の画面遷移）を記録しているか？（Expo）

### Better Stack設定
- [ ] Better Stack LogsのHTTP Source URLを設定しているか？
- [ ] Better Stack API Tokenを設定しているか？
- [ ] Better Stack UptimeのHeartbeat URLを設定しているか？
- [ ] エラーログにSentryのURLリンクを含めているか？
- [ ] 構造化ログを送信しているか？（RFC 9457準拠のエラーレスポンス）

### エラー追跡フロー
- [ ] Convex関数でエラー発生時にSentryに送信しているか？
- [ ] SentryのeventIdを`extensions.sentryEventId`に含めているか？
- [ ] Better StackにSentryのURLリンクを含めたログを送信しているか？
- [ ] フロントエンドでエラー画面に「お問い合わせID: [Sentry ID]」を表示しているか？

## 参考資料

- [Sentry Documentation](https://docs.sentry.io/)
- [Sentry Expo Integration](https://docs.sentry.io/platforms/react-native/)
- [Sentry Next.js Integration](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Better Stack Logs](https://betterstack.com/docs/logs/)
- [Better Stack Uptime](https://betterstack.com/docs/uptime/)
- [RFC 9457: Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html)

# 10. 技術的制約と考慮事項

**📚 インデックス**: [DESIGN_DOCUMENT_INDEX.md](../DESIGN_DOCUMENT_INDEX.md)

技術的制約と考慮事項

### 10.1 Convexの制約
- ファイルサイズ制限
- クエリの複雑さ制限
- リアルタイム更新の制限

### 10.2 モバイルアプリの制約
- **オフライン対応**: 画像アップロードキュー管理と再試行ロジックを実装 ✅ **2026年最終設計検証で追加**
- 画像の最適化
- バッテリー消費の最適化

### 10.3 データライフサイクルと物理削除 ✅ **2026年最終設計検証で追加**

#### 自動物理削除（Convex Cronジョブ）
- `restorableUntil`を過ぎたデータを自動で物理削除するCronジョブを実装
- 毎日午前3時に実行し、期限切れのデータを物理削除
- 関連する画像ストレージも同時に削除

#### 退会後のデータ削除（法的要件対応）
- **GDPR等の個人情報保護法に基づき、退会後30日経過で画像ストレージからも完全に削除**
- 退会時に30日後の物理削除をスケジュール
- ユーザーのすべてのデータ（ペット、活動ログ、画像）を削除

### 10.4 オフラインエクスペリエンス ✅ **2026年最終設計検証で追加**

#### 画像アップロードキュー管理
- Expo（クライアント側）にアップロードキューを持ち、再試行するロジックを実装
- ConvexのMutationで「画像レコードはあるが、StorageIdがまだ空」という中間状態を許容
- UIで「アップロード中...」と表示し続ける設計
- 最大3回まで自動的に再試行

#### 中間状態の許容
- 画像レコードは作成されるが、StorageIdは空文字列
- アップロードが完了すると、StorageIdが設定される
- UIでは「アップロード中...」と表示され、完了すると通常の画像として表示される

### 10.5 追悼（メモリアル）プラン ✅ **2026年最終設計検証で追加**

#### 設計思想
- ペットが亡くなり、新しい記録がなくなった後も、思い出（高画質画像）を見るために課金を続けなければならない問題を解決
- 「追悼（メモリアル）プラン」の導入により、経済的な負担を感じることなく思い出を大切にできる

#### 機能
- 月額無料または極安価で、データの保持と閲覧だけを許可する「読み取り専用」の状態
- プレミアム会員だった期間のデータは、退会後も一定期間（例：1年間）「最高画質」でエクスポート可能
- メモリアルプランでは、新しい記録の追加はできないが、これまでの記録と写真は最高画質で閲覧可能

### 10.6 家族共有の競合解決 ✅ **2026年最終設計検証で追加**

#### 楽観的ロック
- Convexは楽観的ロックで保護してくれるが、UI側で「他の人が更新しました」と優しく伝える配慮を追加
- `activities.version`フィールドでバージョン番号を管理
- 更新時にバージョン番号をチェックし、競合が発生した場合は優しいメッセージを表示

### 10.7 ゲーミフィケーション要素 ✅ **2026年追加 - 習慣化と収益性の両立**

#### 設計の目的
- **習慣化**: 毎日の記録が楽しくなり、継続的な健康管理ができる
- **収益性**: サブスクリプションに加えて、個別課金による追加収益を確保
- **コミュニティの質**: バッジによる「金で買えない名誉」で、真剣にペットを大切にしている飼い主を可視化

#### ポイント獲得システム
- **1日の最大獲得ポイント**: 30pt
- **ポイント獲得ルール**:
  - 餌の記録: 5pt（1日3回までOK、計15pt）
  - トイレの記録: 5pt（1日2回までOK、計10pt）
  - 日記の更新: 10pt（1日1回）
- **ポイント獲得履歴**: `point_history`テーブルで記録（監査用）
- **実装**: 活動ログ記録時に自動でポイントを付与（`activities.createActivity` Mutation内で処理）

#### バッジ獲得システム
- **設計思想**: バッジは「金で買えない名誉」として設計（ポイントや現金では購入不可）
- **バッジの種類**:
  - **健康の守護者**: トイレと餌の記録を連続30日達成
  - **愛の語り部**: 日記を累計100件投稿
  - 将来的に追加可能（管理者が`badge_definitions`テーブルに登録）
- **グローバル表示**: `isGlobal: true`のバッジは、他のユーザーのペットプロフィールにも表示される
- **実装**: 活動ログ記録後に`badges.checkAndAwardBadges` Mutationを呼び出し、条件を満たしているかチェック

#### ショップ機能
- **アイテムの種類**:
  - 静止画フレーム: 500pt 〜 または 300円 〜
  - 動くフレーム: 2,000pt 〜 または 800円 〜
  - アルバム表紙: 1,000pt 〜 または 500円 〜
- **購入方法**:
  - ポイント交換: `shop.purchaseAssetWithPoints` Mutation
  - 現金購入: `shop.purchaseAssetWithMoney` Mutation（RevenueCat連携）
- **期間限定アイテム**: `assets.availableFrom`と`assets.availableUntil`で管理
- **実装**: 管理者が`assets`テーブルにアイテムを登録し、ユーザーが購入/交換できる

#### 収益性の試算
- **ライトユーザー（無料）**: 毎日コツコツ記録し、月間約700〜900pt獲得。2ヶ月に1回、少し豪華な「動くフレーム」を交換
- **コアユーザー（課金）**: ポイントを待たずに、新作の「季節限定動くフレーム」や「プレミアム表紙」を都度課金で購入
- **試算**: 1,000人のアクティブユーザーのうち、3%が毎月1つアイテムを買うだけで、月間約1.5万〜3万円の追加収益（ConvexのProプラン代を余裕で賄える）

#### ポイント管理機能 ✅ **2026年追加**
- **所持ポイント確認（US-083）**:
  - プロフィール画面またはショップ画面に現在の所持ポイントを大きく表示
  - ポイント数が視覚的に分かりやすく表示される（例: 1,234pt）
  - ポイントの増減がリアルタイムで反映される
  - ポイント獲得履歴へのリンクが表示される
- **ポイント取得方法確認（US-084）**:
  - ポイント取得方法の一覧を表示
  - 各取得方法のポイント数と説明を明記
  - 各取得方法から直接記録画面に遷移できる
  - 1日の最大獲得ポイント（30pt）を明示
- **ポイント取得履歴確認（US-088）**:
  - ポイント取得履歴画面で、時系列順に履歴を表示
  - 各履歴に獲得/消費日時、ポイント数、理由、関連する活動ログやアイテムへのリンクを表示
  - フィルター機能（獲得のみ、消費のみ、期間でフィルター）
  - ソート機能（新しい順、古い順、ポイント数順）
  - ページネーション機能（履歴が多い場合）
  - 合計獲得ポイントと合計消費ポイントを表示

#### ショップ機能の拡張 ✅ **2026年追加**
- **ショップ一覧表示（US-085）**:
  - 利用可能なアイテムを一覧表示
  - アイテムの種類別にカテゴリ分け（静止画フレーム、動くフレーム、アルバム表紙など）
  - 各アイテムにポイント価格、現金価格、交換済みかどうかを表示
  - フィルター機能（ポイント購入可能、現金購入可能、期間限定）
  - ソート機能（ポイント価格順、現金価格順、新着順）
- **交換済みアイテム確認（US-086）**:
  - プロフィール画面またはショップ画面に「所有しているアイテム」セクションを表示
  - 交換済みアイテムを一覧で表示（アイテム名、画像、交換日時、交換方法）
  - アイテムをタップすると詳細画面に遷移
  - アイテムを直接使用できる（フレームを選択してペットの写真に適用など）
- **交換アイテム詳細確認（US-087）**:
  - アイテム詳細画面でアイテム名、画像、説明、価格、種類、使用可能な場所を表示
  - 期間限定アイテムの場合、利用可能期間を表示
  - 所有しているアイテムの場合、「所有済み」と表示し、「使用する」ボタンを表示
  - 所有していないアイテムの場合、「ポイントで交換」または「現金で購入」ボタンを表示
  - アイテムのプレビューを表示（実際に使用した場合の見た目）

#### UX設計
- **ポイント獲得時のアニメーション**: 活動ログ記録時に、ポイント獲得を視覚的に通知
- **バッジ獲得時の祝福**: バッジ獲得時に祝福のアニメーションを表示
- **ショップUI**: Discord風のUIで、ポイント交換と現金購入を選択できる
- **プロフィール画面**: 獲得したバッジと所有しているアイテムを表示
- **ポイント表示**: プロフィール画面やショップ画面に現在の所持ポイントを大きく表示
- **ショップ一覧**: カテゴリ分けとフィルター・ソート機能で、欲しいアイテムを素早く見つけられる
- **アイテム詳細**: プレビュー機能で、実際に使用した場合の見た目を確認できる

---

### 10.8 監視・アラートシステム ✅ **2026年追加 - サービス停止防止**

#### 設計の目的
- **サービス停止防止**: Convexの無料枠やプランの限界を越えて、サービスが突然停止するのを防ぐ
- **予兆検知**: リソースの枯渇を事前に検知し、適切な対策を講じる
- **自動レポート**: 毎日のアプリの状況を自動で把握し、問題を早期発見する
- **高度な監視**: Better Stackを活用した構造化ログと分析により、システムの健全性を可視化する

#### 監視対象リソース

**Convexのリソース限界**:
- **Database Size（レコード数/容量）**: 無料枠の制限を監視
- **Storage（ファイルストレージ）**: 画像やファイルの使用量を監視
- **Monthly Operations（実行数）**: Action/Mutation/Queryの月間実行数を監視
- **Action Duration（実行時間）**: Actionの実行時間がタイムアウト（最大10分）に近づいていないか監視

**外部サービスの監視**:
- **Amazon PA-API**: APIキーの状態、レート制限の状況
- **Clerk（認証）**: 認証サービスの稼働状況
- **RevenueCat（課金）**: サブスクリプション管理の稼働状況

#### Convexリソース監視ダッシュボード（ADM-012）

**実装方法**:
- **内部Query関数**: `internal.health.getResourceUsage`で各テーブルのレコード数を集計
- **ストレージ使用量**: Convex Storage APIを使用してファイルサイズを集計
- **実行数**: Convexの内部メトリクス（利用可能な場合）またはログから集計
- **ダッシュボード表示**: 管理画面（`apps/admin/`）でリアルタイムに表示

**表示内容**:
- データベースの総レコード数（テーブル別の内訳）
- ストレージ使用量（GB）
- 月間のAction実行数
- 各リソースの使用率（無料枠に対する割合）
- リソース使用状況の推移グラフ（過去30日間）
- 閾値（80%、90%、95%）を超えた場合の警告表示
- 各リソースの残り容量

**技術実装**:
```typescript
// packages/backend/convex/health.ts
export const getResourceUsage = internalQuery({
  handler: async (ctx) => {
    // 各テーブルのレコード数をカウント
    const tableCounts = await Promise.all([
      ctx.db.query("users").collect().then(rows => rows.length),
      ctx.db.query("pets").collect().then(rows => rows.length),
      ctx.db.query("activities").collect().then(rows => rows.length),
      // ... 他のテーブル
    ]);
    
    // ストレージ使用量を取得（Convex Storage APIを使用）
    // 実行数はConvexの内部メトリクスから取得（利用可能な場合）
    
    return {
      dbRows: tableCounts.reduce((sum, count) => sum + count, 0),
      storageGB: 0, // Convex Storage APIから取得
      monthlyOperations: 0, // Convex内部メトリクスから取得
      usageRate: {
        db: (tableCounts.reduce((sum, count) => sum + count, 0) / 50000) * 100, // 無料枠50,000レコード
        storage: 0,
        operations: 0,
      },
    };
  },
});
```

#### Discord日報送信機能（ADM-013）

**実装方法**:
- **Cronジョブ**: Convexの`crons.ts`で毎日決まった時間（デフォルト: 朝9時）に実行
- **内部Action**: `internal.discord.sendDailyReport`でDiscord Webhookに送信
- **統計Query**: `internal.stats.getYesterdayStats`で昨日の統計データを取得

**送信内容**:
```
📊 ペットケアアプリ日報 [2026/02/01]

👤 ユーザーアクティビティ
- 新規登録: 15名
- アクティブユーザー: 120名
- プレミアム移行: 2名

📝 記録統計
- 日記: 45件 (😊 20 / 😴 15 / 🥺 10)
- トイレ: 80件 / 餌: 150件
- リマインダー完了率: 85%

💰 ビジネス・システム
- Amazon API更新: 1,200件
- ポイント発行総数: 4,500pt
- エラーログ発生: 0件 ✅

🚨 システム健全性
- APIレスポンス平均: 120ms (正常)
- エラーログ（Level: Error）: 2件 [詳細リンク]
- 外部API（Amazon/Clerk）生存確認: 100%

[管理画面で詳細を確認する](https://admin.example.com/dashboard)
```

**技術実装**:
```typescript
// packages/backend/convex/discord.ts
export const sendDailyReport = internalAction({
  handler: async (ctx) => {
    // 1. 昨日の統計データを取得
    const stats = await ctx.runQuery(internal.stats.getYesterdayStats);
    
    // 2. Discord Webhookへ送信
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL!;
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [{
          title: `📊 アプリ日報 [${stats.date}]`,
          description: stats.summary,
          color: 0x5865F2, // Discord Blurple
          fields: [
            { name: "👤 ユーザーアクティビティ", value: stats.userActivity, inline: false },
            { name: "📝 記録統計", value: stats.records, inline: false },
            { name: "💰 ビジネス・システム", value: stats.business, inline: false },
            { name: "🚨 システム健全性", value: stats.health, inline: false },
          ],
        }],
      }),
    });
  },
});

// packages/backend/convex/crons.ts
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

export const crons = cronJobs({
  dailyReport: {
    cron: "0 9 * * *", // 毎日朝9時
    args: {},
    handler: internal.discord.sendDailyReport,
  },
});
```

#### Better Stack連携（ADM-014）

**実装方法**:
- **構造化ログ送信**: Convex Action内で、特定のイベント（日記投稿、リマインダー完了、プレミアム登録など）をBetter Stack Logsへ送信
- **Heartbeat監視**: ConvexのCronが正常に動作していることをBetter Stack Uptimeに報告
- **アラート設定**: Better Stack側でSQLクエリベースのアラートを設定

**送信するログの種類**:
- **ビジネスメトリクス**: 日記投稿、リマインダー完了、プレミアム登録などのイベント
- **エラーログ**: システムエラー、APIエラーなど
- **パフォーマンスログ**: APIレスポンス時間、Action実行時間など

**技術実装**:
```typescript
// packages/backend/convex/betterstack.ts
export const sendToBetterStack = internalAction({
  args: {
    level: v.union(v.literal("info"), v.literal("warn"), v.literal("error"), v.literal("crit")),
    message: v.string(),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    await fetch("https://in.logs.betterstack.app", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.BETTER_STACK_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        level: args.level,
        message: args.message,
        ...args.data,
        timestamp: Date.now(),
      }),
    });
  },
});

// 日報送信完了時にHeartbeatを報告
export const reportHeartbeat = internalAction({
  handler: async (ctx) => {
    await fetch(`https://uptime.betterstack.com/api/v1/heartbeat/${process.env.BETTER_STACK_HEARTBEAT_ID}`, {
      method: "POST",
    });
  },
});
```

**Better Stack側のアラート設定例**:
- **SQLクエリ**: `SELECT COUNT(*) FROM logs WHERE level = 'crit' AND timestamp > NOW() - INTERVAL '1 hour'`
- **アラート条件**: 1時間以内に`crit`レベルのログが3件以上発生したらDiscordに通知

#### アラート設定機能（ADM-015）

**閾値設定**:
- **警告（80%）**: リソース使用率が80%に達した際に通知
- **注意（90%）**: リソース使用率が90%に達した際に通知
- **緊急（95%）**: リソース使用率が95%に達した際に通知（@everyoneメンション付き）

**自動対策**:
- **データ圧縮**: 1年以上前のログを自動でアーカイブまたは削除
- **クロール制限**: Amazon APIの更新頻度を自動で下げる（1日1回→3日に1回）
- **オンデマンド無効化**: 一時的にオンデマンド更新を停止し、キャッシュされたデータを使用

**技術実装**:
```typescript
// packages/backend/convex/alerts.ts
export const checkResourceLimits = internalAction({
  handler: async (ctx) => {
    const stats = await ctx.runQuery(internal.health.getResourceUsage);
    
    // 閾値をチェック
    if (stats.usageRate.db > 95) {
      // 緊急: @everyoneメンション付きでDiscordに通知
      await ctx.runAction(internal.discord.sendAlert, {
        level: "crit",
        message: `🚨 緊急: データベース使用率が${stats.usageRate.db.toFixed(1)}%に達しました！`,
        mentionEveryone: true,
      });
      
      // 自動対策: 古いログを削除
      await ctx.runMutation(internal.cleanup.purgeOldLogs, {
        olderThanDays: 365,
      });
    } else if (stats.usageRate.db > 90) {
      // 注意: 通常の通知
      await ctx.runAction(internal.discord.sendAlert, {
        level: "warn",
        message: `⚠️ 注意: データベース使用率が${stats.usageRate.db.toFixed(1)}%に達しました。`,
      });
    } else if (stats.usageRate.db > 80) {
      // 警告: 通常の通知
      await ctx.runAction(internal.discord.sendAlert, {
        level: "info",
        message: `ℹ️ 警告: データベース使用率が${stats.usageRate.db.toFixed(1)}%に達しました。`,
      });
    }
    
    // Better Stackにも送信
    await ctx.runAction(internal.betterstack.sendToBetterStack, {
      level: stats.usageRate.db > 95 ? "crit" : stats.usageRate.db > 90 ? "warn" : "info",
      message: "Convex Resource Health Check",
      data: {
        db_rows: stats.dbRows,
        storage_gb: stats.storageGB,
        action_calls: stats.monthlyOperations,
        usage_rate: stats.usageRate,
      },
    });
  },
});

// Cronで1時間ごとにチェック
export const crons = cronJobs({
  resourceCheck: {
    cron: "0 * * * *", // 毎時0分
    args: {},
    handler: internal.alerts.checkResourceLimits,
  },
});
```

#### ダッシュボードUI設計

**管理画面のダッシュボード構成**:
- **リソース監視セクション**: 各リソースの使用率を視覚的に表示（プログレスバー、グラフ）
- **統計情報セクション**: ユーザー数、記録数、プレミアム会員数などの統計
- **アラート履歴セクション**: 過去のアラート送信履歴
- **設定セクション**: Discord Webhook URL、Better Stack設定、アラート閾値の設定

**UX設計**:
- **色分け**: 使用率が80%未満は緑、80-90%は黄、90-95%はオレンジ、95%以上は赤
- **リアルタイム更新**: ダッシュボードを開いている間、定期的に（例: 5分ごと）データを更新
- **詳細リンク**: 各リソースの詳細ページへのリンクを提供

---

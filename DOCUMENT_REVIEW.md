# ドキュメント全体レビュー結果

このドキュメントは、プロジェクト全体のドキュメントをレビューし、修正点やブラッシュアップが必要な箇所、情報の差異をまとめたものです。

**レビュー日**: 2026年2月1日

---

## ✅ 一貫性が取れている点

### 1. ディレクトリ構造
- ✅ `apps/expo/` - すべてのドキュメントで統一
- ✅ `apps/admin/` - すべてのドキュメントで統一
- ✅ `packages/backend/` - すべてのドキュメントで統一（独立パッケージ）
- ✅ `packages/ui/`, `packages/utils/`, `packages/tsconfig/` - すべてのドキュメントで統一

### 2. 技術スタック
- ✅ Turborepo + pnpm - すべてのドキュメントで一致
- ✅ Convex, Clerk, OpenAI, Resend, Sentry, RevenueCat - すべてのドキュメントで一致
- ✅ Tamagui, Zustand, Expo Router - すべてのドキュメントで一致

### 3. 環境変数の命名規則
- ✅ `EXPO_PUBLIC_*` - Expo用（SETUP_CHECKLIST.mdで明確に定義）
- ✅ `NEXT_PUBLIC_*` - Next.js用（SETUP_CHECKLIST.mdで明確に定義）
- ✅ `process.env.*` - Convex用（SETUP_CHECKLIST.mdで明確に定義）

---

## ⚠️ 修正が必要な点

### 1. パッケージ名の不一致

**問題**: `TECH_STACK_PLANNING.md`で`@animal-app/`が使われているが、他のドキュメントでは`@repo/`が使われている。

**影響箇所**:
- `TECH_STACK_PLANNING.md`: `@animal-app/ui`, `@animal-app/eslint-config`など
- 他のドキュメント: `@repo/ui`, `@repo/backend`など

**推奨**: `@repo/`に統一（2026年版のベストプラクティスに合わせる）

**修正箇所**:
- `TECH_STACK_PLANNING.md`の`package.json`例
- ESLint設定の例

---

### 2. DESIGN_DOCUMENT.mdにUS-027のAI相談ボタンが記載されていない

**問題**: `USER_STORIES.md`には「コラムの末尾に、そのトピックに関連したAIへの質問ボタンが表示される」と記載されているが、`DESIGN_DOCUMENT.md`のコラム詳細画面の説明にこれが含まれていない。

**修正内容**:
- `DESIGN_DOCUMENT.md`の「5.6 コラム画面」>「コラム詳細画面」に以下を追加：
  - コラムの末尾にAIへの質問ボタンが表示される
  - AI相談ボタンをタップすると、コラムの内容をコンテキストとして含めた状態でAI相談画面が開く

---

### 3. DESIGN_DOCUMENT.mdにUS-042の専門家のいいね機能が記載されていない

**問題**: `USER_STORIES.md`には「専門家（獣医師など）が「いいね」した投稿には特別なバッジが表示される」と記載されているが、`DESIGN_DOCUMENT.md`のいいねフローにこれが含まれていない。

**修正内容**:
- `DESIGN_DOCUMENT.md`の「3.9 フォロー・いいねフロー」>「いいねフロー」に以下を追加：
  - 専門家（獣医師など）が「いいね」した場合、特別なバッジが表示される
  - 専門家の「いいね」は通常の「いいね」とは区別される
- `DESIGN_DOCUMENT.md`の「5.9 SNSフィード画面」>「投稿カード」に以下を追加：
  - 専門家が「いいね」した投稿には「獣医師が推奨」バッジが表示される

---

### 4. CONVEX_SCHEMA.mdに専門家のいいね機能に必要なスキーマが不足している可能性

**問題**: `USER_STORIES.md`には専門家のいいね機能が記載されているが、`CONVEX_SCHEMA.md`の`likes`テーブルに専門家のいいねを識別するフィールドがない。

**検討事項**:
- `likes`テーブルに`isExpertLike`フィールドを追加するか
- `users`テーブルに`isExpert`フラグを追加し、`likes`テーブルの`userId`から専門家かどうかを判定するか

**推奨**: `users`テーブルに`isExpert`フラグを追加（事業者ユーザーの中から認定獣医師を識別するため）

**修正内容**:
- `CONVEX_SCHEMA.md`の`users`テーブルに`isExpert`フィールドを追加
- `CONVEX_SCHEMA.md`の`likes`テーブルの説明に専門家のいいねについて追記

---

### 5. .cursor/skills/auto-verify/SKILL.mdに`apps/mobile`が残っている

**問題**: 他のドキュメントは`apps/expo`に統一されているが、`auto-verify/SKILL.md`だけ`apps/mobile`が残っている。

**修正内容**:
- `apps/mobile`を`apps/expo`に変更

---

### 6. DESIGN_DOCUMENT.mdのコラム詳細画面の説明が不十分

**問題**: `USER_STORIES.md`のUS-027には詳細な受け入れ基準が記載されているが、`DESIGN_DOCUMENT.md`のコラム詳細画面の説明が簡潔すぎる。

**修正内容**:
- `DESIGN_DOCUMENT.md`の「5.6 コラム画面」>「コラム詳細画面」を拡充：
  - 記事の重要ポイントのハイライト
  - 「後で読む」機能
  - **コラムの末尾にAIへの質問ボタン**（最重要）

---

### 7. DESIGN_DOCUMENT.mdのおすすめフィードに専門家のいいねが考慮されていない

**問題**: `USER_STORIES.md`には「専門家が推奨」バッジが付いた投稿はおすすめフィードで優先的に表示されると記載されているが、`DESIGN_DOCUMENT.md`のおすすめフィードの説明にこれが含まれていない。

**修正内容**:
- `DESIGN_DOCUMENT.md`の「3.8 SNSフィード表示フロー」>「おすすめ（For You）タブ」に以下を追加：
  - 専門家が「いいね」した投稿を優先的に表示

---

### 8. CONVEX_SCHEMA.mdのusersテーブルに専門家フラグがない

**問題**: `USER_STORIES.md`には専門家のいいね機能が記載されているが、`CONVEX_SCHEMA.md`の`users`テーブルに専門家を識別するフィールドがない。

**修正内容**:
- `CONVEX_SCHEMA.md`の`users`テーブルに`isExpert`フィールドを追加
- 説明に専門家の認定方法を追記

---

## 📝 ブラッシュアップ推奨事項

### 1. パッケージ名の統一

**推奨**: すべてのドキュメントで`@repo/`を使用

**理由**:
- 2026年版のベストプラクティスに合わせる
- モノレポでの一般的な命名規則
- 他のドキュメントとの一貫性

**修正対象**:
- `TECH_STACK_PLANNING.md`の`package.json`例
- ESLint設定の例

---

### 2. 専門家のいいね機能のスキーマ設計

**推奨**: `users`テーブルに`isExpert`フラグを追加

**理由**:
- 専門家の認定はユーザー属性として管理するのが自然
- `likes`テーブルをシンプルに保てる
- 将来的に専門家向け機能を拡張しやすい

**実装例**:
```typescript
users: defineTable({
  // ... 既存フィールド
  isExpert: v.optional(v.boolean()), // 認定専門家（獣医師など）かどうか
  expertInfo: v.optional(v.object({
    licenseNumber: v.string(), // 免許証番号
    verifiedAt: v.number(), // 認定日時
  })),
})
```

---

### 3. コラム詳細画面のUI/UX設計の詳細化

**推奨**: `DESIGN_DOCUMENT.md`のコラム詳細画面の説明を拡充

**追加すべき内容**:
- AI相談ボタンの配置とデザイン
- コラムの内容をコンテキストとして含めたAI相談の実装方法
- 関連コラムのレコメンデーションロジック

---

### 4. 信頼できる飼い主の証の実装方法

**推奨**: `CONVEX_SCHEMA.md`と`DESIGN_DOCUMENT.md`に信頼できる飼い主の証の実装方法を追加

**検討事項**:
- 一定期間以上記録を続けているユーザーの判定方法
- 専門家から「いいね」を受けたユーザーの追跡方法
- バッジ表示のロジック

---

## 🔍 情報の差異チェック

### 1. 環境変数の一貫性 ✅

すべてのドキュメントで環境変数の命名規則が一致しています。

### 2. 機能の説明の一貫性 ⚠️

**差異あり**:
- US-027（コラム詳細表示）のAI相談ボタン: `USER_STORIES.md`には記載、`DESIGN_DOCUMENT.md`には未記載
- US-042（いいね機能）の専門家のいいね: `USER_STORIES.md`には記載、`DESIGN_DOCUMENT.md`には未記載

### 3. スキーマとユーザーストーリーの対応 ⚠️

**差異あり**:
- 専門家のいいね機能: `USER_STORIES.md`には記載、`CONVEX_SCHEMA.md`にはスキーマが不足

### 4. 設計ドキュメントとユーザーストーリーの対応 ⚠️

**差異あり**:
- コラム詳細表示のAI相談ボタン: `USER_STORIES.md`には記載、`DESIGN_DOCUMENT.md`には未記載
- 専門家のいいね機能: `USER_STORIES.md`には記載、`DESIGN_DOCUMENT.md`には未記載

---

## 📋 修正チェックリスト

### 優先度：高

- [x] `TECH_STACK_PLANNING.md`のパッケージ名を`@repo/`に統一 ✅
- [x] `DESIGN_DOCUMENT.md`のコラム詳細画面にAI相談ボタンを追加 ✅
- [x] `DESIGN_DOCUMENT.md`のいいねフローに専門家のいいね機能を追加 ✅
- [x] `CONVEX_SCHEMA.md`の`users`テーブルに`isExpert`フィールドを追加 ✅
- [x] `.cursor/skills/auto-verify/SKILL.md`の`apps/mobile`を`apps/expo`に変更 ✅

### 優先度：中

- [x] `DESIGN_DOCUMENT.md`のおすすめフィードに専門家のいいねを考慮 ✅
- [x] `CONVEX_SCHEMA.md`の`likes`テーブルの説明に専門家のいいねについて追記 ✅
- [x] `DESIGN_DOCUMENT.md`のコラム詳細画面の説明を拡充 ✅

### 優先度：低

- [ ] 信頼できる飼い主の証の実装方法を`CONVEX_SCHEMA.md`と`DESIGN_DOCUMENT.md`に追加
- [ ] コラム詳細画面のUI/UX設計の詳細化

---

## 次のステップ

1. **修正の実施**: 上記のチェックリストに従って修正を実施
2. **再レビュー**: 修正後に再度レビューを実施
3. **ドキュメントの最終確認**: すべての修正が完了したら、最終確認を実施

---

## 参考

- [USER_STORIES.md](./USER_STORIES.md) - ユーザーストーリー（開発の憲法）
- [DESIGN_DOCUMENT.md](./DESIGN_DOCUMENT.md) - アプリ設計ドキュメント
- [CONVEX_SCHEMA.md](./CONVEX_SCHEMA.md) - Convexスキーマ定義
- [TECH_STACK_PLANNING.md](./TECH_STACK_PLANNING.md) - 技術選定プランニング

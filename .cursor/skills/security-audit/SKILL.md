# セキュリティ監査スキル

このスキルは、IPA（情報処理推進機構）の「安全なウェブサイトの作り方」に基づいて、コード実装時のセキュリティ監査を自動化します。

## 使用方法

コード実装後、またはコードレビュー時に、このスキルを使用してセキュリティチェックを実行してください。

## セキュリティチェック項目

### 1. 入力検証チェック

**チェック内容**:
- すべての外部入力にZodバリデーションが実施されているか？
- Convex関数の`args`に`v.*`スキーマが定義されているか？
- ファイル名にUUID等の安全な生成方法を使用しているか？

**実行方法**:
```bash
# Convex関数のargs定義を確認
grep -r "args:" packages/backend/convex --include="*.ts" | grep -v "v\."

# Zodバリデーションの使用を確認
grep -r "z\." apps/expo --include="*.ts" apps/expo --include="*.tsx"
```

### 2. SQLインジェクション対策チェック

**チェック内容**:
- 文字列結合によるクエリ構築がないか？
- Convexの型安全なクエリAPIを使用しているか？

**実行方法**:
```bash
# 文字列結合によるクエリ構築を検索（見つかってはいけない）
grep -r "SELECT.*\${" packages/backend/convex --include="*.ts"
grep -r "INSERT.*\${" packages/backend/convex --include="*.ts"
grep -r "UPDATE.*\${" packages/backend/convex --include="*.ts"
```

### 3. パストラバーサル対策チェック

**チェック内容**:
- ユーザー入力を直接ファイルパスに使用していないか？
- UUID等の安全な生成方法を使用しているか？

**実行方法**:
```bash
# ユーザー入力をファイルパスに使用している箇所を検索
grep -r "fileName.*args\." packages/backend/convex --include="*.ts"
grep -r "filePath.*args\." packages/backend/convex --include="*.ts"
```

### 4. XSS対策チェック

**チェック内容**:
- `dangerouslySetInnerHTML`を使用していないか？
- 外部URLの`javascript:`プロトコルを排除しているか？

**実行方法**:
```bash
# dangerouslySetInnerHTMLの使用を検索（見つかってはいけない）
grep -r "dangerouslySetInnerHTML" apps/expo --include="*.tsx" apps/www --include="*.tsx"

# URLバリデーションの実装を確認
grep -r "javascript:" apps/expo --include="*.ts" apps/expo --include="*.tsx"
```

### 5. CSRF対策チェック

**チェック内容**:
- すべての`mutation`で`ctx.auth.getUserIdentity()`をチェックしているか？
- 認証が必要な`query`でも認証チェックを実施しているか？

**実行方法**:
```bash
# mutation関数で認証チェックがないものを検索
grep -r "export const.*= mutation" packages/backend/convex --include="*.ts" -A 20 | grep -L "getUserIdentity"
```

### 6. エラーメッセージの情報漏洩対策チェック

**チェック内容**:
- エラーメッセージにスタックトレースを含めていないか？
- エラーメッセージにDB構造やテーブル名を含めていないか？

**実行方法**:
```bash
# スタックトレースを含むエラーメッセージを検索
grep -r "\.stack" packages/backend/convex --include="*.ts"
grep -r "Error.*stack" packages/backend/convex --include="*.ts"
```

### 7. 3ヶ月ロック機能のセキュリティチェック

**チェック内容**:
- 3ヶ月以前のデータへのアクセスをConvex側で制御しているか？
- CSS非表示だけでアクセス制御していないか？
- モザイク画像はサーバーサイドで生成しているか？

**実行方法**:
```bash
# 3ヶ月ロック機能の実装を確認
grep -r "threeMonthsAgo\|90.*24.*60.*60" packages/backend/convex --include="*.ts"
grep -r "isPremium\|premium" packages/backend/convex --include="*.ts" -A 10
```

## 自動化コマンド

### 包括的なセキュリティチェック

```bash
# すべてのセキュリティチェックを実行
pnpm security:audit
```

### 個別チェック

```bash
# 入力検証チェック
pnpm security:check-input-validation

# SQLインジェクション対策チェック
pnpm security:check-sql-injection

# パストラバーサル対策チェック
pnpm security:check-path-traversal

# XSS対策チェック
pnpm security:check-xss

# CSRF対策チェック
pnpm security:check-csrf

# エラーメッセージチェック
pnpm security:check-error-messages

# 3ヶ月ロック機能チェック
pnpm security:check-three-month-lock
```

## セキュリティ監査レポートの生成

セキュリティチェックの結果をレポートとして出力します。

```bash
# セキュリティ監査レポートを生成
pnpm security:report > security-audit-report.md
```

## 参考資料

- [.cursor/rules/SECURITY_IPA.md](../../rules/SECURITY_IPA.md): IPAセキュリティ実装規約
- [IPA「安全なウェブサイトの作り方」](https://www.ipa.go.jp/security/vuln/websecurity.html)

# Cursor Commands

このディレクトリには、Cursorエージェントが使用できるコマンドが定義されています。

## セキュリティ検証コマンド ⭐ **2026年追加**

IPAガイドラインに基づくセキュリティ検証を自動化するコマンドです。

### `/security-verify`

包括的なセキュリティ検証を実行します。

- **セキュリティ監査**: IPAガイドライン準拠のセキュリティチェック
- **依存関係監査**: 依存ライブラリの脆弱性スキャン
- **Terraformセキュリティスキャン**: Cloudflare R2バケットの設定確認

詳細は [security-verify.md](./security-verify.md) を参照してください。

### `/security-audit`

IPAガイドラインに基づくセキュリティ監査を実行します。

- 入力検証チェック
- SQLインジェクション対策チェック
- パストラバーサル対策チェック
- XSS対策チェック
- CSRF対策チェック
- エラーメッセージの情報漏洩対策チェック
- 3ヶ月ロック機能のセキュリティチェック

詳細は [security-audit.md](./security-audit.md) を参照してください。

### `/dependency-audit`

依存ライブラリの脆弱性をスキャンします。

- `pnpm audit`を実行
- High以上の深刻度の脆弱性を検出

詳細は [dependency-audit.md](./dependency-audit.md) を参照してください。

### `/terraform-security`

Cloudflare R2バケットの設定を確認し、セキュリティリスクを検出します。

- Public Accessの確認
- CORS設定の確認
- バケットポリシーの確認

詳細は [terraform-security.md](./terraform-security.md) を参照してください。

## 既存のコマンド

### `/verify`

開発後の自動検証フローを実行します。

- 型チェック
- リント
- フォーマット
- テスト
- **セキュリティ検証** ⭐ **2026年追加**

詳細は [verify.md](./verify.md) を参照してください。

### `/test`

テストを実行します。

詳細は [test.md](./test.md) を参照してください。

### `/lint`

リントを実行します。

詳細は [lint.md](./lint.md) を参照してください。

### `/typecheck`

型チェックを実行します。

詳細は [typecheck.md](./typecheck.md) を参照してください。

### `/review`

コードレビューを実行します。

詳細は [review.md](./review.md) を参照してください。

### `/debug`

デバッグを実行します。

詳細は [debug.md](./debug.md) を参照してください。

## Hooks（自動実行）

セキュリティ検証は、以下のタイミングで自動実行されます：

### `after_edit`（ファイル編集後）

- 型チェック（変更されたパッケージのみ）
- **セキュリティ監査** ⭐ **2026年追加**（オプション）

### `before_commit`（コミット前）

- コードフォーマット
- リント（自動修正含む）
- 型チェック（オプション）
- **包括的なセキュリティ検証** ⭐ **2026年追加**（オプション）

詳細は [.cursor/hooks.json](../hooks.json) を参照してください。

## 参考資料

- [.cursor/rules/SECURITY_IPA.md](../rules/SECURITY_IPA.md): IPAセキュリティ実装規約
- [.cursor/skills/security-audit/SKILL.md](../skills/security-audit/SKILL.md): セキュリティ監査スキル
- [.cursor/skills/dependency-audit/SKILL.md](../skills/dependency-audit/SKILL.md): 依存関係監査スキル
- [.cursor/skills/terraform-security/SKILL.md](../skills/terraform-security/SKILL.md): Terraformセキュリティスキャンスキル

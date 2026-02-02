# Security Verify Command

包括的なセキュリティ検証を実行します。セキュリティ監査、依存関係監査、Terraformセキュリティスキャンを順番に実行します。

## 使用方法

```bash
/security-verify
```

## ワークフロー

1. **セキュリティ監査**
   - IPAガイドラインに基づくセキュリティチェックを実行
   - エラーがあれば修正してから次へ

2. **依存関係監査**
   - `pnpm audit`を実行し、High以上の脆弱性を検出
   - 脆弱性があれば報告

3. **Terraformセキュリティスキャン**
   - Cloudflare R2バケットの設定を確認
   - Public AccessやCORS設定をチェック

4. **結果の要約**
   - すべての検証結果を要約
   - 修正が必要な項目を報告

## 使用例

```
/security-verify
```

## 検証項目

- ✅ IPAガイドライン準拠のセキュリティチェック
- ✅ 依存ライブラリの脆弱性スキャン
- ✅ Terraform設定のセキュリティチェック

## 注意事項

- 各ステップでエラーが発生した場合は、修正してから次のステップに進む
- すべての検証が成功するまで繰り返す
- 検証に時間がかかる場合は、進捗を報告

## 参考資料

- [.cursor/rules/SECURITY_IPA.md](../../rules/SECURITY_IPA.md): IPAセキュリティ実装規約
- [.cursor/commands/security-audit.md](./security-audit.md): セキュリティ監査コマンド
- [.cursor/commands/dependency-audit.md](./dependency-audit.md): 依存関係監査コマンド
- [.cursor/commands/terraform-security.md](./terraform-security.md): Terraformセキュリティスキャンコマンド

# Terraform Security Scan Command

Cloudflare R2バケットの設定を確認し、セキュリティリスクを検出します。

## 使用方法

```bash
/terraform-security
```

または

```bash
pnpm security:terraform
```

## 実行内容

以下のセキュリティチェックを実行します：

1. **Public Accessの確認**: R2バケットがPublic Accessになっていないか
2. **CORS設定の確認**: すべてのオリジンからのアクセスを許可していないか
3. **バケットポリシーの確認**: すべてのユーザーに読み取り権限を付与していないか

## 出力

- **Errors**: 即座に対応が必要な重大な問題
- **Warnings**: 対応が推奨される問題

## 注意事項

`infra`ディレクトリが存在しない場合、スキャンはスキップされます。

## 参考資料

- [.cursor/skills/terraform-security/SKILL.md](../../skills/terraform-security/SKILL.md): Terraformセキュリティスキャンスキル
- [.cursor/rules/SECURITY_IPA.md](../../rules/SECURITY_IPA.md): IPAセキュリティ実装規約

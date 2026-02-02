# Terraformセキュリティスキャンスキル

このスキルは、Cloudflare R2のバケット設定が公開設定（Public Access）になっていないか、Terraformのプランを読み込んで警告します。

## 使用方法

Terraformの設定ファイルを確認し、セキュリティリスクを検出します。

## 基本的なセキュリティチェック

### Terraformプランの確認

```bash
# Terraformプランを生成
cd infra
terraform plan -out=tfplan

# プランを読み取り可能な形式で表示
terraform show tfplan
```

### Cloudflare R2バケットの設定確認

```bash
# R2バケットの設定を確認
grep -r "r2_bucket" infra/ --include="*.tf"
grep -r "public_access" infra/ --include="*.tf"
```

## セキュリティチェック項目

### 1. Public Accessの確認

**チェック内容**:
- R2バケットがPublic Accessになっていないか？
- 署名付きURLを使用しているか？

**実行方法**:
```bash
# Public Accessの設定を検索（見つかってはいけない）
grep -r "public.*=.*true" infra/ --include="*.tf"
grep -r "public_access.*=.*true" infra/ --include="*.tf"
```

### 2. CORS設定の確認

**チェック内容**:
- CORS設定が適切に制限されているか？
- すべてのオリジンからのアクセスを許可していないか？

**実行方法**:
```bash
# CORS設定を確認
grep -r "cors_rule" infra/ --include="*.tf" -A 10
grep -r "allowed_origins.*\*" infra/ --include="*.tf"
```

### 3. バケットポリシーの確認

**チェック内容**:
- バケットポリシーが適切に設定されているか？
- すべてのユーザーに読み取り権限を付与していないか？

**実行方法**:
```bash
# バケットポリシーを確認
grep -r "bucket_policy" infra/ --include="*.tf" -A 20
```

## 自動化スクリプト

### Terraformセキュリティスキャン

```bash
#!/bin/bash
# scripts/terraform-security-scan.sh

echo "🔍 Terraform Security Scan"
echo "=========================="

# Public Accessのチェック
echo ""
echo "1. Checking for Public Access..."
if grep -r "public.*=.*true" infra/ --include="*.tf" 2>/dev/null; then
  echo "❌ WARNING: Public Access detected!"
  exit 1
else
  echo "✅ No Public Access found"
fi

# CORS設定のチェック
echo ""
echo "2. Checking CORS configuration..."
if grep -r "allowed_origins.*\*" infra/ --include="*.tf" 2>/dev/null; then
  echo "⚠️  WARNING: CORS allows all origins (*)"
else
  echo "✅ CORS configuration looks safe"
fi

# バケットポリシーのチェック
echo ""
echo "3. Checking bucket policies..."
if grep -r "Effect.*Allow.*Principal.*\*" infra/ --include="*.tf" 2>/dev/null; then
  echo "❌ WARNING: Bucket policy allows all principals!"
  exit 1
else
  echo "✅ Bucket policies look safe"
fi

echo ""
echo "✅ Security scan completed"
```

### GitHub Actionsでの自動スキャン

```yaml
# .github/workflows/terraform-security.yml
name: Terraform Security Scan

on:
  pull_request:
    paths:
      - 'infra/**'
  push:
    branches: [main]
    paths:
      - 'infra/**'

jobs:
  terraform-security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
        with:
          terraform_version: 1.5.0
      
      - name: Terraform Init
        working-directory: infra
        run: terraform init
      
      - name: Terraform Plan
        working-directory: infra
        run: terraform plan -out=tfplan
      
      - name: Check for Public Access
        run: |
          if grep -r "public.*=.*true" infra/ --include="*.tf" 2>/dev/null; then
            echo "❌ ERROR: Public Access detected in Terraform configuration!"
            exit 1
          fi
      
      - name: Check CORS Configuration
        run: |
          if grep -r "allowed_origins.*\*" infra/ --include="*.tf" 2>/dev/null; then
            echo "⚠️  WARNING: CORS allows all origins (*)"
          fi
```

## セキュリティベストプラクティス

### Cloudflare R2の推奨設定

```hcl
# ✅ 良い例: 署名付きURLを使用し、Public Accessを無効化
resource "cloudflare_r2_bucket" "pet_images" {
  account_id = var.cloudflare_account_id
  name       = "pet-images"
  
  # Public Accessを無効化（デフォルト）
  # public_access = false  # 明示的に設定する場合は false
}

# ✅ 良い例: 署名付きURLを生成するためのAPIトークンを使用
# アプリケーションコードで署名付きURLを生成
```

### ❌ 悪い例: Public Accessを有効化

```hcl
# ❌ 悪い例: Public Accessを有効化（絶対禁止）
resource "cloudflare_r2_bucket" "pet_images" {
  account_id = var.cloudflare_account_id
  name       = "pet-images"
  public_access = true  # 禁止！
}
```

## セキュリティチェックリスト

Terraform設定を変更する際は、以下のチェックリストを確認してください：

- [ ] R2バケットのPublic Accessが無効化されているか？
- [ ] CORS設定が適切に制限されているか？（すべてのオリジン（*）を許可していないか？）
- [ ] バケットポリシーが適切に設定されているか？（すべてのユーザーに読み取り権限を付与していないか？）
- [ ] 署名付きURLを使用して一時的なアクセスのみを許可しているか？
- [ ] 環境変数に機密情報（APIキー等）がハードコードされていないか？

## 参考資料

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Terraform Cloudflare Provider](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs)
- [.cursor/rules/SECURITY_IPA.md](../../rules/SECURITY_IPA.md): IPAセキュリティ実装規約

# Cloudflare R2 インフラ設定

このディレクトリには、Cloudflare R2バケットとDNS設定を管理するTerraformファイルが含まれています。

## セットアップ

### 1. 前提条件

- Terraformがインストールされていること
- Cloudflareアカウントがあること
- Cloudflare API Tokenがあること

### 2. 環境変数の設定

```bash
export CLOUDFLARE_API_TOKEN="your-api-token"
export CLOUDFLARE_ACCOUNT_ID="your-account-id"
export CLOUDFLARE_ZONE_ID="your-zone-id"
```

### 3. Terraformの初期化

```bash
cd infra/cloudflare
terraform init
```

### 4. 変数の設定

`terraform.tfvars`ファイルを作成し、以下の変数を設定します：

```hcl
cloudflare_account_id = "your-account-id"
cloudflare_zone_id    = "your-zone-id"
domain_name           = "your-pet-app.com"
```

### 5. 実行計画の確認

```bash
terraform plan
```

### 6. 適用

```bash
terraform apply
```

## 注意事項

### R2バケットのカスタムドメイン設定

Cloudflare R2のカスタムドメイン設定は、Terraformでは直接サポートされていません。以下の手順で手動設定が必要です：

1. CloudflareダッシュボードでR2バケットを開く
2. 「Settings」→「Custom Domains」を開く
3. カスタムドメイン（例: `assets.your-pet-app.com`）を追加
4. DNSレコードが自動で作成されることを確認

### CORS設定

CORS設定はTerraformでは直接サポートされていません。以下の手順で手動設定が必要です：

1. CloudflareダッシュボードでR2バケットを開く
2. 「Settings」→「CORS Policy」を開く
3. 以下のCORS設定を追加：

```json
[
  {
    "AllowedOrigins": ["*"], // 本番はドメインを絞る
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedHeaders": ["*"]
  }
]
```

### R2 API Tokenの発行

ConvexのActionからR2にアクセスするために、R2 API Tokenを発行します：

1. Cloudflareダッシュボードで「R2」→「Manage R2 API Tokens」を開く
2. 「Create API Token」をクリック
3. 以下の権限を付与：
   - Object Read & Write
   - 特定のバケット（`pet-app-assets`）へのアクセス権限
4. 発行された`ACCESS_KEY_ID`と`SECRET_ACCESS_KEY`をConvexの環境変数に設定

## 参考資料

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Cloudflare Terraform Provider](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs)

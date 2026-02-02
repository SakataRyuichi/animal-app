# Cloudflare R2 バケットとDNS設定

terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

# 変数定義
variable "cloudflare_account_id" {
  description = "Cloudflare Account ID"
  type        = string
}

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID"
  type        = string
}

variable "domain_name" {
  description = "カスタムドメイン名（例: your-pet-app.com）"
  type        = string
  default     = "your-pet-app.com"
}

# R2バケットの作成
resource "cloudflare_r2_bucket" "pet_assets" {
  account_id = var.cloudflare_account_id
  name       = "pet-app-assets"
  location   = "apac" # 日本に近いリージョン
}

# カスタムドメインの設定（R2バケットにカスタムドメインを紐付け）
# 注意: Cloudflare R2のカスタムドメイン設定はTerraformでは直接サポートされていないため、
# 手動またはCloudflare APIを使用して設定する必要があります。
# 参考: https://developers.cloudflare.com/r2/buckets/custom-domains/

# DNSレコードの設定（CNAME）
resource "cloudflare_record" "assets_dns" {
  zone_id = var.cloudflare_zone_id
  name    = "assets"
  value   = "${cloudflare_r2_bucket.pet_assets.name}.r2.cloudflarestorage.com"
  type    = "CNAME"
  proxied = true # CDN機能を有効化
  comment = "R2バケット用のカスタムドメイン"
}

# 出力
output "r2_bucket_name" {
  description = "R2バケット名"
  value       = cloudflare_r2_bucket.pet_assets.name
}

output "r2_bucket_id" {
  description = "R2バケットID"
  value       = cloudflare_r2_bucket.pet_assets.id
}

output "assets_domain" {
  description = "アセット用のカスタムドメイン"
  value       = "assets.${var.domain_name}"
}

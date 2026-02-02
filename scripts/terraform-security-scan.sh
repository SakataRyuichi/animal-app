#!/bin/bash
# Terraformセキュリティスキャンスクリプト
# Cloudflare R2バケットの設定を確認

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

# miseでツールを有効化
if command -v mise &> /dev/null; then
  eval "$(mise activate bash)" 2>/dev/null || eval "$(mise activate zsh)" 2>/dev/null || true
fi

ERRORS=0
WARNINGS=0

echo "🔍 Terraform Security Scan"
echo "=========================="
echo ""

if [ ! -d "infra" ]; then
  echo "⚠️  infra directory not found, skipping Terraform security scan"
  exit 0
fi

# 1. Public Accessのチェック
echo "1. Checking for Public Access..."
if grep -r "public.*=.*true" infra/ --include="*.tf" 2>/dev/null || \
   grep -r "public_access.*=.*true" infra/ --include="*.tf" 2>/dev/null; then
  echo "   ❌ ERROR: Public Access detected!"
  ERRORS=$((ERRORS + 1))
else
  echo "   ✅ No Public Access found"
fi

# 2. CORS設定のチェック
echo "2. Checking CORS configuration..."
if grep -r "allowed_origins.*\*" infra/ --include="*.tf" 2>/dev/null; then
  echo "   ⚠️  WARNING: CORS allows all origins (*)"
  WARNINGS=$((WARNINGS + 1))
else
  echo "   ✅ CORS configuration looks safe"
fi

# 3. バケットポリシーのチェック
echo "3. Checking bucket policies..."
if grep -r "Effect.*Allow.*Principal.*\*" infra/ --include="*.tf" 2>/dev/null; then
  echo "   ❌ ERROR: Bucket policy allows all principals!"
  ERRORS=$((ERRORS + 1))
else
  echo "   ✅ Bucket policies look safe"
fi

echo ""
echo "=========================="
echo "Summary:"
echo "  Errors: $ERRORS"
echo "  Warnings: $WARNINGS"
echo ""

if [ $ERRORS -gt 0 ]; then
  echo "❌ Terraform security scan failed with $ERRORS error(s)"
  exit 1
elif [ $WARNINGS -gt 0 ]; then
  echo "⚠️  Terraform security scan completed with $WARNINGS warning(s)"
  exit 0
else
  echo "✅ Terraform security scan passed"
  exit 0
fi

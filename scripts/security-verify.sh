#!/bin/bash
# 包括的なセキュリティ検証スクリプト
# セキュリティ監査、依存関係監査、Terraformセキュリティスキャンを実行

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

# miseでツールを有効化（プロジェクトディレクトリに入ると自動的に有効化されるが、明示的に実行）
if command -v mise &> /dev/null; then
  eval "$(mise activate bash)" 2>/dev/null || eval "$(mise activate zsh)" 2>/dev/null || true
fi

echo "🔒 Security Verification"
echo "========================"
echo ""

ERRORS=0

# 1. セキュリティ監査
echo "Step 1: Security Audit"
echo "-----------------------"
if bash "$SCRIPT_DIR/security-audit.sh"; then
  echo ""
else
  ERRORS=$((ERRORS + 1))
  echo ""
fi

# 2. 依存関係監査
echo "Step 2: Dependency Audit"
echo "------------------------"
if bash "$SCRIPT_DIR/dependency-audit.sh" high; then
  echo ""
else
  ERRORS=$((ERRORS + 1))
  echo ""
fi

# 3. Terraformセキュリティスキャン
echo "Step 3: Terraform Security Scan"
echo "--------------------------------"
if bash "$SCRIPT_DIR/terraform-security-scan.sh"; then
  echo ""
else
  ERRORS=$((ERRORS + 1))
  echo ""
fi

# 結果の要約
echo "========================"
echo "Summary"
echo "========================"
if [ $ERRORS -eq 0 ]; then
  echo "✅ All security verifications passed"
  exit 0
else
  echo "❌ Security verification failed with $ERRORS error(s)"
  echo ""
  echo "Please review the errors above and fix them before committing."
  exit 1
fi

#!/bin/bash
# セキュリティ監査スクリプト
# IPAガイドラインに基づくセキュリティチェックを実行

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

echo "🔍 Security Audit (IPA Guidelines)"
echo "===================================="
echo ""

# 1. 入力検証チェック
echo "1. Checking input validation..."
if grep -r "args:" packages/backend/convex --include="*.ts" 2>/dev/null | grep -v "v\." | grep -v "v\.id\|v\.string\|v\.number\|v\.boolean\|v\.object\|v\.array\|v\.optional\|v\.union\|v\.any\|v\.null\|v\.undefined" > /dev/null; then
  echo "   ⚠️  WARNING: Some Convex functions may not use proper v.* schema"
  WARNINGS=$((WARNINGS + 1))
else
  echo "   ✅ Convex functions use proper v.* schema"
fi

# 2. SQLインジェクション対策チェック
echo "2. Checking SQL injection prevention..."
if grep -r "SELECT.*\${" packages/backend/convex --include="*.ts" 2>/dev/null || \
   grep -r "INSERT.*\${" packages/backend/convex --include="*.ts" 2>/dev/null || \
   grep -r "UPDATE.*\${" packages/backend/convex --include="*.ts" 2>/dev/null; then
  echo "   ❌ ERROR: String concatenation in queries detected!"
  ERRORS=$((ERRORS + 1))
else
  echo "   ✅ No string concatenation in queries"
fi

# 3. パストラバーサル対策チェック
echo "3. Checking path traversal prevention..."
if grep -r "fileName.*args\." packages/backend/convex --include="*.ts" 2>/dev/null | grep -v "uuid\|v4\|random" > /dev/null || \
   grep -r "filePath.*args\." packages/backend/convex --include="*.ts" 2>/dev/null | grep -v "uuid\|v4\|random" > /dev/null; then
  echo "   ⚠️  WARNING: User input may be used directly in file paths"
  WARNINGS=$((WARNINGS + 1))
else
  echo "   ✅ File paths use safe generation methods (UUID)"
fi

# 4. XSS対策チェック
echo "4. Checking XSS prevention..."
if grep -r "dangerouslySetInnerHTML" apps/expo --include="*.tsx" apps/www --include="*.tsx" 2>/dev/null; then
  echo "   ❌ ERROR: dangerouslySetInnerHTML detected!"
  ERRORS=$((ERRORS + 1))
else
  echo "   ✅ No dangerouslySetInnerHTML usage"
fi

# 5. CSRF対策チェック
echo "5. Checking CSRF prevention..."
MUTATION_FILES=$(grep -r "export const.*= mutation" packages/backend/convex --include="*.ts" -l 2>/dev/null || true)
if [ -n "$MUTATION_FILES" ]; then
  MISSING_AUTH=0
  while IFS= read -r file; do
    if ! grep -q "getUserIdentity" "$file"; then
      echo "   ⚠️  WARNING: Mutation without auth check: $file"
      MISSING_AUTH=$((MISSING_AUTH + 1))
    fi
  done <<< "$MUTATION_FILES"
  if [ $MISSING_AUTH -eq 0 ]; then
    echo "   ✅ All mutations have auth checks"
  else
    WARNINGS=$((WARNINGS + MISSING_AUTH))
  fi
else
  echo "   ✅ No mutations found"
fi

# 6. エラーメッセージの情報漏洩対策チェック
echo "6. Checking error message information leakage..."
if grep -r "\.stack" packages/backend/convex --include="*.ts" 2>/dev/null | grep -v "//\|/\*" > /dev/null || \
   grep -r "Error.*stack" packages/backend/convex --include="*.ts" 2>/dev/null | grep -v "//\|/\*" > /dev/null; then
  echo "   ⚠️  WARNING: Stack traces may be exposed in error messages"
  WARNINGS=$((WARNINGS + 1))
else
  echo "   ✅ No stack traces in error messages"
fi

# 7. 3ヶ月ロック機能のセキュリティチェック
echo "7. Checking 3-month lock feature security..."
if grep -r "threeMonthsAgo\|90.*24.*60.*60" packages/backend/convex --include="*.ts" 2>/dev/null | grep -q "isPremium\|premium"; then
  echo "   ✅ 3-month lock feature has proper access control"
else
  echo "   ⚠️  WARNING: 3-month lock feature may not have proper access control"
  WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "===================================="
echo "Summary:"
echo "  Errors: $ERRORS"
echo "  Warnings: $WARNINGS"
echo ""

if [ $ERRORS -gt 0 ]; then
  echo "❌ Security audit failed with $ERRORS error(s)"
  exit 1
elif [ $WARNINGS -gt 0 ]; then
  echo "⚠️  Security audit completed with $WARNINGS warning(s)"
  exit 0
else
  echo "✅ Security audit passed"
  exit 0
fi

#!/bin/bash
# 依存関係監査スクリプト
# npm auditを実行し、重大な脆弱性を検出

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

# miseでツールを有効化
if command -v mise &> /dev/null; then
  eval "$(mise activate bash)" 2>/dev/null || eval "$(mise activate zsh)" 2>/dev/null || true
fi

AUDIT_LEVEL="${1:-high}"

echo "🔍 Dependency Audit"
echo "==================="
echo ""

# ルートディレクトリで監査を実行
echo "Running pnpm audit (level: $AUDIT_LEVEL)..."
if pnpm audit --audit-level="$AUDIT_LEVEL" 2>&1; then
  echo ""
  echo "✅ Dependency audit passed"
  exit 0
else
  AUDIT_EXIT_CODE=$?
  echo ""
  echo "❌ Dependency audit found vulnerabilities"
  echo ""
  echo "To fix automatically (if possible):"
  echo "  pnpm audit --fix"
  echo ""
  echo "To view detailed report:"
  echo "  pnpm audit --json > audit-report.json"
  exit $AUDIT_EXIT_CODE
fi

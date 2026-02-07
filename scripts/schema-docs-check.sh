#!/bin/bash
# スキーマ関連ファイルの変更時に、関連ドキュメント（ER図など）の更新漏れを検知する
# 用途: before_commit フック、または手動で pnpm docs:schema-check 実行時
#
# 動作:
# - ステージ済みファイルに docs/schema/ または Convex schema が含まれ、
#   かつ docs/diagrams/ に変更が無い場合 → リマインダーを表示し exit 1（コミット阻止）
# - 環境変数 SCHEMA_DOCS_CHECK_STRICT=0 のときは警告のみ（exit 0）

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

# ステージ済みファイル一覧
STAGED="$(git diff --cached --name-only 2>/dev/null || true)"
if [ -z "$STAGED" ]; then
  exit 0
fi

# スキーマ関連として扱うパス（ここを変更したら関連ドキュメントの更新を促す）
SCHEMA_PATTERNS=(
  "docs/schema/"
)
if [ -f "packages/backend/convex/schema.ts" ]; then
  SCHEMA_PATTERNS+=("packages/backend/convex/schema.ts")
fi

# 関連ドキュメント（ここが一緒に変更されていれば OK）
DOCS_PATTERNS=(
  "docs/diagrams/"
)

schema_changed=false
docs_changed=false

for path in $STAGED; do
  for pattern in "${SCHEMA_PATTERNS[@]}"; do
    case "$path" in
      $pattern*) schema_changed=true ;;
    esac
  done
  for pattern in "${DOCS_PATTERNS[@]}"; do
    case "$path" in
      $pattern*) docs_changed=true ;;
    esac
  done
done

if [ "$schema_changed" = false ]; then
  exit 0
fi

if [ "$docs_changed" = true ]; then
  exit 0
fi

# スキーマは変更されたが、関連ドキュメントに変更がない
echo ""
echo "⚠️  Schema-related files were changed, but no change in related docs (e.g. ER diagram)."
echo "   Consider updating:"
echo "   - docs/diagrams/er-diagram.drawio"
echo "   - docs/diagrams/README.md (if table list or notation changed)"
echo "   See: docs/diagrams/README.md (スキーマとの紐づけ)"
echo ""
echo "   Then stage those files and commit again."
echo "   To skip this check for this commit: git commit --no-verify"
echo ""

if [ "${SCHEMA_DOCS_CHECK_STRICT:-1}" = "0" ]; then
  exit 0
fi
exit 1

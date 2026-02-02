# 依存関係監査スキル

このスキルは、依存ライブラリの脆弱性をスキャンし、IPAの「安全性向上の取り組み」を自動化します。

## 使用方法

定期的に依存ライブラリの脆弱性をスキャンし、セキュリティパッチを適用してください。

## 基本的な監査コマンド

### npm auditの実行

```bash
# ルートディレクトリで全パッケージの監査を実行
pnpm audit

# 特定のパッケージのみ監査
pnpm --filter expo audit
pnpm --filter backend audit
pnpm --filter www audit
```

### 自動修正の実行

```bash
# 自動修正可能な脆弱性を修正
pnpm audit --fix

# 特定のパッケージのみ自動修正
pnpm --filter expo audit --fix
pnpm --filter backend audit --fix
```

## 高度な監査オプション

### 深刻度別の監査

```bash
# 重大（Critical）な脆弱性のみ表示
pnpm audit --audit-level=critical

# 重大（Critical）と高（High）な脆弱性を表示
pnpm audit --audit-level=high
```

### JSON形式での出力

```bash
# JSON形式で監査結果を出力
pnpm audit --json > audit-report.json
```

## 自動化スクリプト

### 定期監査の設定

GitHub Actionsで定期監査を実行する例：

```yaml
# .github/workflows/security-audit.yml
name: Security Audit

on:
  schedule:
    - cron: '0 0 * * 1' # 毎週月曜日の0時
  workflow_dispatch:

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run security audit
        run: pnpm audit --audit-level=high
      
      - name: Create GitHub Issue if vulnerabilities found
        if: failure()
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: '🚨 Security Audit: Vulnerabilities Found',
              body: 'Security audit found vulnerabilities. Please review and update dependencies.',
              labels: ['security', 'dependencies']
            })
```

## 監査結果の解釈

### 脆弱性の深刻度

- **Critical**: 即座に対応が必要な重大な脆弱性
- **High**: 早急に対応が必要な高リスクの脆弱性
- **Moderate**: 対応が推奨される中程度の脆弱性
- **Low**: 対応が推奨される低リスクの脆弱性

### 対応方針

1. **Critical/High**: 即座にパッチを適用するか、代替ライブラリを検討
2. **Moderate**: 次回のリリースまでに対応を検討
3. **Low**: 定期的な監視を継続

## パッケージ別の監査

### Expoアプリの監査

```bash
cd apps/expo
pnpm audit
```

### Convexバックエンドの監査

```bash
cd packages/backend
pnpm audit
```

### Next.jsアプリの監査

```bash
cd apps/www
pnpm audit
```

## 監査結果の記録

監査結果を記録し、トレンドを追跡します。

```bash
# 監査結果をファイルに保存
pnpm audit --json > audit-$(date +%Y%m%d).json

# 監査結果をMarkdown形式で保存
pnpm audit > audit-$(date +%Y%m%d).md
```

## 参考資料

- [npm audit documentation](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [pnpm audit documentation](https://pnpm.io/cli/audit)
- [IPA「安全なウェブサイトの作り方」](https://www.ipa.go.jp/security/vuln/websecurity.html)

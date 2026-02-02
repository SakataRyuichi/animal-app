# mise セットアップガイド

このプロジェクトでは、**mise**（旧名: rtx）を使用してNode.jsとpnpmのバージョンを管理します。

**重要**: すべての開発者は、miseを使用して開発環境を統一してください。

## 目次

1. [miseとは](#miseとは)
2. [インストール](#インストール)
3. [プロジェクトのセットアップ](#プロジェクトのセットアップ)
4. [使用方法](#使用方法)
5. [CI/CDでの使用](#cicdでの使用)
6. [トラブルシューティング](#トラブルシューティング)

---

## miseとは

**mise**は、複数のランタイムバージョンを管理するツールです。asdfの後継として開発され、より高速で使いやすい設計になっています。

### 主な特徴

- **高速**: asdfより最大10倍高速
- **シェル統合**: プロジェクトディレクトリに入ると自動的にツールを有効化
- **設定ファイル**: `.mise.toml`でプロジェクトごとにバージョンを管理
- **クロスプラットフォーム**: macOS、Linux、Windowsに対応

### このプロジェクトでの使用目的

- **Node.jsのバージョン管理**: チーム全体で同じバージョンを使用
- **pnpmのバージョン管理**: パッケージマネージャーのバージョンを統一
- **開発環境の統一**: 新しいメンバーがすぐに開発を始められる

---

## インストール

### macOS

**Homebrewを使用（推奨）**:
```bash
brew install mise
```

**公式インストーラーを使用**:
```bash
curl https://mise.run | sh
```

### Linux

```bash
curl https://mise.run | sh
```

### Windows

**PowerShell**:
```powershell
irm https://mise.run | iex
```

### インストール後の設定

**シェル統合の有効化**:

**zsh**:
```bash
echo 'eval "$(mise activate zsh)"' >> ~/.zshrc
source ~/.zshrc
```

**bash**:
```bash
echo 'eval "$(mise activate bash)"' >> ~/.bashrc
source ~/.bashrc
```

**fish**:
```bash
echo 'mise activate fish | source' >> ~/.config/fish/config.fish
source ~/.config/fish/config.fish
```

### インストールの確認

```bash
mise --version
```

---

## プロジェクトのセットアップ

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd animal-app
```

### 2. miseでツールをインストール

プロジェクトディレクトリに入ると、`.mise.toml`が自動的に読み込まれ、必要なツールがインストールされます。

**手動でインストールする場合**:
```bash
mise install
```

これにより、以下のツールがインストールされます：
- Node.js 20.18.0
- pnpm 9.12.3

### 3. インストールの確認

```bash
# Node.jsのバージョンを確認
node --version
# v20.18.0

# pnpmのバージョンを確認
pnpm --version
# 9.12.3
```

### 4. 依存関係のインストール

```bash
pnpm install
```

---

## 使用方法

### 基本的な使い方

**プロジェクトディレクトリに入る**:
```bash
cd animal-app
```

プロジェクトディレクトリに入ると、miseが自動的に`.mise.toml`を読み込み、必要なツールを有効化します。

**ツールのバージョンを確認**:
```bash
mise ls
```

**ツールを手動でインストール**:
```bash
mise install
```

**ツールのバージョンを更新**:
```bash
mise install node@20.18.0  # 特定のバージョンをインストール
```

### 開発コマンド

miseでツールが有効化された状態で、通常通りコマンドを実行できます：

```bash
# 開発サーバーを起動
pnpm dev

# 型チェック
pnpm typecheck

# リント
pnpm lint

# テスト
pnpm test
```

### グローバルツールのインストール（オプション）

プロジェクト外でも使用したいツールがある場合：

```bash
# グローバルにNode.jsをインストール
mise install --global node@20.18.0

# グローバルにpnpmをインストール
mise install --global pnpm@9.12.3
```

---

## CI/CDでの使用

### GitHub Actions

GitHub Actionsでもmiseを使用して、開発環境と同じバージョンを使用できます。

**例: `.github/workflows/ci.yml`**:
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install mise
        uses: jdx/mise-action@v2
      
      - name: Install tools
        run: mise install
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Type check
        run: pnpm typecheck
      
      - name: Lint
        run: pnpm lint
      
      - name: Test
        run: pnpm test
```

### その他のCI/CD

**CircleCI**:
```yaml
- run:
    name: Install mise
    command: |
      curl https://mise.run | sh
      echo 'export PATH="$HOME/.local/bin:$PATH"' >> $BASH_ENV
      source $BASH_ENV

- run:
    name: Install tools
    command: mise install

- run:
    name: Install dependencies
    command: pnpm install --frozen-lockfile
```

**GitLab CI**:
```yaml
before_script:
  - curl https://mise.run | sh
  - export PATH="$HOME/.local/bin:$PATH"
  - mise install
  - pnpm install --frozen-lockfile
```

---

## トラブルシューティング

### miseが認識されない

**原因**: シェル統合が有効化されていない

**解決方法**:
```bash
# zshの場合
echo 'eval "$(mise activate zsh)"' >> ~/.zshrc
source ~/.zshrc

# bashの場合
echo 'eval "$(mise activate bash)"' >> ~/.bashrc
source ~/.bashrc
```

### ツールがインストールされない

**原因**: ネットワークエラーや権限の問題

**解決方法**:
```bash
# 詳細なログを表示
mise install --verbose

# キャッシュをクリア
mise cache clear

# 再インストール
mise uninstall node
mise install node
```

### バージョンが正しくない

**原因**: `.mise.toml`の設定が間違っている、または別のバージョンが優先されている

**解決方法**:
```bash
# 現在のバージョンを確認
mise ls

# .mise.tomlの設定を確認
cat .mise.toml

# ツールを再インストール
mise install
```

### プロジェクトディレクトリに入ってもツールが有効化されない

**原因**: `activate_aggressive`が無効になっている

**解決方法**:
`.mise.toml`に以下を追加：
```toml
[settings]
activate_aggressive = true
```

---

## 参考資料

- [mise公式ドキュメント](https://mise.jdx.dev/)
- [mise GitHubリポジトリ](https://github.com/jdx/mise)
- [.mise.toml設定ファイル](./.mise.toml)

---

## 次のステップ

miseのセットアップが完了したら、以下を実行：

1. **依存関係のインストール**:
   ```bash
   pnpm install
   ```

2. **開発環境の起動**:
   ```bash
   pnpm dev
   ```

3. **セットアップチェックリストの確認**:
   [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)を参照

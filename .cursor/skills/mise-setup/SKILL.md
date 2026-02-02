# mise セットアップスキル

このスキルは、miseを使用した開発環境のセットアップと管理を支援します。

## 使用方法

開発環境のセットアップやトラブルシューティング時に、このスキルを参照してください。

## miseとは

**mise**は、複数のランタイムバージョンを管理するツールです。asdfの後継として開発され、より高速で使いやすい設計になっています。

### 主な特徴

- **高速**: asdfより最大10倍高速
- **シェル統合**: プロジェクトディレクトリに入ると自動的にツールを有効化
- **設定ファイル**: `.mise.toml`でプロジェクトごとにバージョンを管理
- **クロスプラットフォーム**: macOS、Linux、Windowsに対応

## 基本的な使い方

### インストール

**macOS（Homebrew推奨）**:
```bash
brew install mise
```

**Linux / macOS（公式インストーラー）**:
```bash
curl https://mise.run | sh
```

**Windows（PowerShell）**:
```powershell
irm https://mise.run | iex
```

### シェル統合の有効化

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

### プロジェクトのセットアップ

```bash
# プロジェクトディレクトリに入る
cd animal-app

# miseでツールをインストール（.mise.tomlが自動的に読み込まれる）
mise install

# インストールの確認
node --version  # v20.18.0
pnpm --version  # 9.12.3
```

## コマンド実行

### mise経由でコマンドを実行

**通常のコマンド実行**:
```bash
# プロジェクトディレクトリに入ると自動的にツールが有効化される
pnpm dev
pnpm typecheck
pnpm lint
```

**明示的にmise経由で実行**:
```bash
# mise execを使用（推奨）
mise exec -- pnpm dev
mise exec -- pnpm typecheck
mise exec -- pnpm lint
```

### スクリプト内での使用

スクリプト内でmiseを使用する場合：

```bash
#!/bin/bash
# miseでツールを有効化
if command -v mise &> /dev/null; then
  eval "$(mise activate bash)" 2>/dev/null || eval "$(mise activate zsh)" 2>/dev/null || true
fi

# 通常通りコマンドを実行
pnpm dev
```

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

## CI/CDでの使用

### GitHub Actions

```yaml
- name: Install mise
  uses: jdx/mise-action@v2

- name: Install tools
  run: mise install

- name: Install dependencies
  run: pnpm install --frozen-lockfile
```

## 参考資料

- [MISE_SETUP.md](../../MISE_SETUP.md): miseセットアップガイド
- [SETUP_CHECKLIST.md](../../SETUP_CHECKLIST.md): セットアップチェックリスト
- [mise公式ドキュメント](https://mise.jdx.dev/)

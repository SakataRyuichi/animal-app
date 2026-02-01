# Pencil.dev セットアップガイド

このドキュメントは、Pencil.devをプロジェクトに統合するための初期セットアップ手順です。

## 📋 目次

1. [Pencil.devとは](#pencildevとは)
2. [インストール手順](#インストール手順)
3. [プロジェクトへの統合](#プロジェクトへの統合)
4. [デザインファイルの管理](#デザインファイルの管理)
5. [Tamaguiとの連携](#tamaguiとの連携)
6. [開発ワークフロー](#開発ワークフロー)

---

## Pencil.devとは

**Pencil.dev**は、IDE内でデザインとコーディングを統合するMCP（Model Context Protocol）ベースのデザインキャンバスツールです。

### 主な特徴

- ✅ **IDE統合**: Cursor、VS Code、Claude Codeで使用可能
- ✅ **デザインからコード生成**: HTML/CSS/Reactコードを自動生成
- ✅ **Figma連携**: Figmaからコピー&ペーストでデザインをインポート可能
- ✅ **Git管理**: `.pen`ファイル形式でデザインファイルをGitで管理
- ✅ **AIマルチプレイヤー**: AIと並行してデザインを生成・改善
- ✅ **オープンフォーマット**: デザインファイルは完全にオープンで拡張可能

### このプロジェクトでの活用方法

- **UIデザイン**: 画面レイアウトのデザインとプロトタイプ
- **コンポーネント設計**: Tamaguiコンポーネントのデザイン
- **デザインシステム**: ブランドキットとデザインシステムの管理
- **プロトタイピング**: 実装前のUI/UX検証

---

## インストール手順

### 1. Cursor拡張機能のインストール

**手順**:
1. Cursorを開く
2. `Cmd+Shift+X`（macOS）または`Ctrl+Shift+X`（Windows/Linux）で拡張機能パネルを開く
3. 「Pencil」で検索
4. 「Install」をクリック
5. インストール後、Cursorを再起動

**確認方法**:
- `.pen`ファイルを作成すると、Pencilアイコンがエディタに表示される
- ファイルを開くと、Pencilキャンバスが自動的にアクティブになる

### 2. Claude Code CLIの認証（オプション）

AIマルチプレイヤー機能を使用する場合、Claude Code CLIの認証が必要です。

**手順**:
1. ターミナルで以下を実行：
   ```bash
   claude auth login
   ```
2. ブラウザで認証を完了
3. 認証が完了したら、`claude`コマンドが使用可能になります

**確認方法**:
```bash
claude --version
```

---

## プロジェクトへの統合

### 1. ディレクトリ構造

Pencilデザインファイルは、プロジェクトの`designs/`ディレクトリに配置します。

```
animal-app/
├── designs/                    # Pencilデザインファイル
│   ├── screens/                # 画面デザイン
│   │   ├── home.pen
│   │   ├── pet-register.pen
│   │   ├── pet-detail.pen
│   │   └── timeline.pen
│   ├── components/             # コンポーネントデザイン
│   │   ├── pet-card.pen
│   │   ├── activity-form.pen
│   │   └── ai-chat.pen
│   ├── design-system/         # デザインシステム
│   │   ├── colors.pen
│   │   ├── typography.pen
│   │   └── components.pen
│   └── flows/                  # ユーザーフロー
│       ├── pet-registration-flow.pen
│       └── ai-consultation-flow.pen
├── apps/
│   ├── expo/
│   └── admin/
├── packages/
│   ├── backend/
│   ├── ui/                     # Tamaguiコンポーネント（Pencilから生成）
│   └── utils/
└── ...
```

### 2. `.gitignore`の設定

`.pen`ファイルはGitで管理するため、`.gitignore`には追加しません。

```gitignore
# PencilデザインファイルはGitで管理
# .penファイルは除外しない
```

### 3. 初期デザインファイルの作成

**手順**:
1. `designs/`ディレクトリを作成：
   ```bash
   mkdir -p designs/{screens,components,design-system,flows}
   ```

2. 最初のデザインファイルを作成：
   ```bash
   touch designs/screens/home.pen
   ```

3. Cursorで`.pen`ファイルを開く
4. Pencilキャンバスが自動的にアクティブになる

---

## デザインファイルの管理

### 1. ファイル命名規則

**推奨命名規則**:
- **画面**: `{screen-name}.pen`（例: `home.pen`, `pet-register.pen`）
- **コンポーネント**: `{component-name}.pen`（例: `pet-card.pen`, `activity-form.pen`）
- **デザインシステム**: `{category}.pen`（例: `colors.pen`, `typography.pen`）
- **フロー**: `{flow-name}-flow.pen`（例: `pet-registration-flow.pen`）

### 2. デザインファイルの構造

各`.pen`ファイルには以下を含めることを推奨します：

- **画面デザイン**: レイアウト、コンポーネント配置、インタラクション
- **コンポーネントデザイン**: 再利用可能なUIコンポーネント
- **デザインシステム**: カラー、タイポグラフィ、スペーシング、コンポーネントライブラリ

### 3. Gitでの管理

`.pen`ファイルは通常のソースコードと同様にGitで管理します：

```bash
# デザインファイルをコミット
git add designs/
git commit -m "feat(design): Add home screen design"

# ブランチでデザインを管理
git checkout -b feature/pet-registration-ui
# デザインを変更
git add designs/screens/pet-register.pen
git commit -m "feat(design): Update pet registration form"
```

---

## Tamaguiとの連携

### 1. デザインからTamaguiコンポーネントへの変換

Pencil.devでデザインしたコンポーネントを、Tamaguiコンポーネントとして`packages/ui/`に生成します。

**ワークフロー**:
1. Pencilでコンポーネントをデザイン
2. Pencilの「Export to Code」機能を使用
3. 生成されたReactコードを`packages/ui/src/components/`に配置
4. Tamaguiコンポーネントに変換（必要に応じて手動調整）

### 2. デザインシステムの統一

**カラーパレット**:
- Pencilのデザインシステムでカラーを定義
- `packages/ui/src/theme/colors.ts`に反映

**タイポグラフィ**:
- Pencilでタイポグラフィを定義
- `packages/ui/src/theme/typography.ts`に反映

**コンポーネントライブラリ**:
- Pencilでコンポーネントをデザイン
- `packages/ui/src/components/`に実装

### 3. デザインとコードの同期

**推奨ワークフロー**:
1. Pencilでデザインを作成・更新
2. デザインが確定したら、コードを生成
3. `packages/ui/`にコンポーネントを実装
4. `apps/expo`と`apps/admin`で使用

---

## 開発ワークフロー

### 1. 新機能のデザイン

**ステップ**:
1. `USER_STORIES.md`で要件を確認
2. Pencilで画面デザインを作成（`designs/screens/{screen-name}.pen`）
3. ユーザーフローをデザイン（`designs/flows/{flow-name}-flow.pen`）
4. コンポーネントをデザイン（`designs/components/{component-name}.pen`）
5. デザインをレビュー・承認
6. コードを生成・実装

### 2. 既存画面の改善

**ステップ**:
1. 既存の`.pen`ファイルを開く
2. デザインを更新
3. 変更をGitでコミット
4. 必要に応じてコードを更新

### 3. Figmaからの移行

**手順**:
1. Figmaでデザインを選択
2. `Cmd+C`（macOS）または`Ctrl+C`（Windows/Linux）でコピー
3. Pencilキャンバスで`Cmd+V`（macOS）または`Ctrl+V`（Windows/Linux）でペースト
4. ベクター、テキスト、スタイルがそのままインポートされる

---

## 設定ファイル

### `.cursor/settings.json`（推奨設定）

```json
{
  "pencil.enabled": true,
  "pencil.autoOpen": true,
  "files.associations": {
    "*.pen": "pencil"
  }
}
```

---

## 参考リンク

- **Pencil.dev公式サイト**: https://www.pencil.dev/
- **Pencil.devドキュメント**: https://docs.pencil.dev/
- **インストールガイド**: https://docs.pencil.dev/installation
- **Getting Started**: https://docs.pencil.dev/getting-started
- **Discordコミュニティ**: https://discord.gg/Azsk8cnnVp

---

## トラブルシューティング

### Pencilキャンバスが開かない

**解決方法**:
1. Cursorを再起動
2. `.pen`ファイルを再度開く
3. 拡張機能が正しくインストールされているか確認

### AIマルチプレイヤーが動作しない

**解決方法**:
1. Claude Code CLIが認証されているか確認：
   ```bash
   claude auth status
   ```
2. 認証されていない場合：
   ```bash
   claude auth login
   ```

### Figmaからのコピー&ペーストが機能しない

**解決方法**:
1. Figmaでデザインを選択（グループ化されている場合はグループ全体を選択）
2. コピー（`Cmd+C` / `Ctrl+C`）
3. Pencilキャンバスでペースト（`Cmd+V` / `Ctrl+V`）
4. それでも動作しない場合は、FigmaからSVGとしてエクスポートしてインポート

---

## 次のステップ

1. **Pencil拡張機能をインストール**
2. **`designs/`ディレクトリを作成**
3. **最初のデザインファイルを作成**（例: `designs/screens/home.pen`）
4. **ホーム画面のデザインを開始**

---

## チェックリスト

- [ ] Cursor拡張機能をインストール
- [ ] Claude Code CLIを認証（オプション）
- [ ] `designs/`ディレクトリを作成
- [ ] 最初の`.pen`ファイルを作成
- [ ] Pencilキャンバスが正常に動作することを確認
- [ ] Figmaからのコピー&ペーストをテスト（オプション）

# プロジェクト初期化ガイド

このドキュメントは、リポジトリを初期化して開発を開始する際の手順を説明します。

## 概要

このプロジェクトは、MCP（Model Context Protocol）を活用してAIの開発効率を最大化する構成になっています。初期化時は、AIに「思考」させながら段階的に構築することを推奨します。

## 初期化手順

### ステップ1: リポジトリの初期化

まず、空のディレクトリで以下を実行します：

```bash
# プロジェクトディレクトリの作成
mkdir animal-app
cd animal-app

# Gitリポジトリの初期化
git init

# ルートpackage.jsonの作成
pnpm init
```

### ステップ2: モノレポ構造の作成

基本的なディレクトリ構造を作成します：

```bash
# ディレクトリ構造の作成
mkdir -p apps/expo
mkdir -p apps/admin
mkdir -p packages/backend
mkdir -p packages/ui
mkdir -p packages/utils
mkdir -p packages/tsconfig
mkdir -p packages/config
```

### ステップ3: MCP設定の追加

1. **`.cursor/mcp.json.example`を`.cursor/mcp.json`にコピー**：
   ```bash
   cp .cursor/mcp.json.example .cursor/mcp.json
   ```

2. **`.cursor/mcp.json`を編集**：
   - `${PROJECT_ROOT}`をプロジェクトの絶対パスに置き換え
   - 例: `"/Users/yourname/Documents/GitHub/animal-app"`

3. **Cursorを再起動**

### ステップ4: AIに「思考」させる

Cursorのチャット（`Cmd+L` または `Cmd+K`）で以下のように指示します：

```
Sequential Thinkingを使って、このペットアプリのモノレポ構造をどう構築すべきか、
turbo.json や pnpm-workspace.yaml の内容を含めて思考（Thought）をステップごとに書き出して。
その計画に合意できたら、一気にファイルを生成してほしい。
```

**期待される動作**:
- Sequential Thinking MCPが自動的に使用される
- AIが思考ステップを刻みながら計画を立てる
- 計画に合意したら、必要なファイルを一気に生成
- **数分でバックエンド、フロント、管理画面の土台が組み上がる**

**プロジェクト開始用の具体的なプロンプト例**:

```
Sequential Thinkingを使って、以下の手順でペット管理アプリのモノレポ構造を構築してください：

1. 思考ステップ1: Turborepo + pnpmのモノレポ構造を設計
   - apps/expo (React Native Expo)
   - apps/admin (Next.js、ローカルのみ)
   - packages/backend (Convex - 独立パッケージ)
   - packages/ui (Tamagui共通コンポーネント)
   - packages/utils (ビジネスロジック)
   - packages/tsconfig (TypeScript共通設定)

2. 思考ステップ2: turbo.jsonの設定を設計
   - 依存関係の定義
   - キャッシュ設定
   - 並列実行の最適化

3. 思考ステップ3: pnpm-workspace.yamlの設定を設計
   - ワークスペースの定義
   - パッケージ間の依存関係

4. 思考ステップ4: 各パッケージのpackage.jsonを設計
   - 依存関係の定義
   - スクリプトの設定

5. 思考ステップ5: .gitignoreの設定
   - 環境変数ファイルの除外
   - ビルド成果物の除外

思考ステップをすべて書き出したら、その計画に基づいて一気にファイルを生成してください。
```

### ステップ5: 生成されたファイルの確認

AIが生成した以下のファイルを確認します：

- `turbo.json` - Turborepo設定
- `pnpm-workspace.yaml` - pnpm workspace設定
- `package.json` - ルートpackage.json（更新）
- `.gitignore` - Git除外設定
- 各パッケージの`package.json`

### ステップ6: 依存関係のインストール

```bash
pnpm install
```

### ステップ7: 開発環境の起動確認

```bash
# すべてのアプリを起動
pnpm dev

# または、個別に起動
pnpm --filter backend dev
pnpm --filter expo dev
pnpm --filter admin dev
```

## Sequential Thinking MCPの活用

このプロジェクトでは、Sequential Thinking MCPを積極的に活用します。

### 使用シーン

1. **モノレポ構造の変更時**:
   ```
   Sequential Thinkingを使って、新しいパッケージを追加する際の影響範囲を分析して。
   ステップごとに思考を書き出してから実装して。
   ```

2. **複雑なビジネスロジックの実装時**:
   ```
   Sequential Thinkingを使って、ペットの健康状態を自動判定するアルゴリズムを設計して。
   思考ステップを刻んでから実装して。
   ```

3. **型整合性の確認時**:
   ```
   Sequential Thinkingを使って、Convexスキーマの変更が
   apps/expo と apps/admin に与える影響を分析して。
   ```

### AIへの指示例

**モノレポ構造の構築**:
```
Sequential Thinkingを使って、このペットアプリのモノレポ構造をどう構築すべきか、
turbo.json や pnpm-workspace.yaml の内容を含めて思考（Thought）をステップごとに書き出して。
その計画に合意できたら、一気にファイルを生成してほしい。
```

**Convexスキーマの設計**:
```
Sequential Thinkingを使って、ペット管理アプリのConvexスキーマを設計して。
users, pets, activities テーブルの関係性を思考ステップごとに分析してから実装して。
```

**UIコンポーネントの実装**:
```
Sequential Thinkingを使って、Tamaguiを使った共通UIコンポーネントの設計を考えて。
packages/ui に配置するコンポーネントを思考ステップごとに整理してから実装して。
```

## チェックリスト

初期化が完了したら、以下を確認します：

- [ ] `turbo.json`が正しく設定されている
- [ ] `pnpm-workspace.yaml`が正しく設定されている
- [ ] 各パッケージの`package.json`が作成されている
- [ ] `.cursor/mcp.json`が設定されている
- [ ] `.gitignore`に適切なファイルが除外されている
- [ ] `pnpm install`が正常に完了する
- [ ] `pnpm dev`で開発環境が起動する
- [ ] Sequential Thinking MCPが動作する（AIが思考ステップを刻む）

## トラブルシューティング

### Sequential Thinking MCPが動作しない

**原因**:
- `.cursor/mcp.json`が設定されていない
- Cursorを再起動していない

**解決方法**:
1. `.cursor/mcp.json`が存在するか確認
2. Cursorを再起動
3. AIに「Sequential Thinkingを使って...」と明示的に指示

### モノレポ構造が正しく構築されない

**原因**:
- `turbo.json`や`pnpm-workspace.yaml`の設定が間違っている

**解決方法**:
1. AIに再度「Sequential Thinkingを使って、モノレポ構造を確認して」と指示
2. 生成されたファイルを確認
3. 必要に応じて手動で修正

## 参考

- [.cursor/MCP_REPOSITORY_SETUP.md](./MCP_REPOSITORY_SETUP.md) - MCP設定をリポジトリに含める方法
- [SETUP_CHECKLIST.md](../SETUP_CHECKLIST.md) - セットアップチェックリスト
- [TECH_STACK_PLANNING.md](../TECH_STACK_PLANNING.md) - 技術選定の詳細

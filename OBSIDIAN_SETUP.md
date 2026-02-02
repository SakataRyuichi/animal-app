# Obsidian設定ガイド

このプロジェクトにObsidianを導入する際の設定ガイドです。

## セットアップ手順

### 1. Obsidianのインストール

[Obsidian公式サイト](https://obsidian.md/)からObsidianをダウンロードしてインストールしてください。

### 2. このリポジトリをObsidianのVaultとして開く

1. Obsidianを起動
2. 「Open folder as vault」を選択
3. このリポジトリのルートディレクトリ（`/Users/sakataryuichi/Documents/GitHub/animal-app`）を選択

### 3. 設定の確認

`.obsidian/`ディレクトリに以下の設定ファイルが作成されます：

- `app.json`: 基本設定（既にコミット済み）
- `core-plugins.json`: コアプラグイン設定（既にコミット済み）
- `workspace.json`: ワークスペース設定（個人設定、Gitにコミットされない）

### 4. 推奨プラグインのインストール

以下のプラグインをインストールすることを推奨します：

#### 必須プラグイン

1. **Dataview**
   - 用途: ドキュメントの動的なクエリと表示
   - 例: `USER_STORIES.md`から特定のPhaseのストーリーを抽出

2. **Templater**
   - 用途: 高度なテンプレート機能
   - 例: 新しいユーザーストーリーのテンプレート

#### 推奨プラグイン

3. **Tag Wrangler**
   - 用途: タグ管理の強化
   - 例: `#phase1`, `#premium`, `#api`などのタグ管理

4. **Excalidraw**
   - 用途: 図表作成
   - 例: アーキテクチャ図、フローチャート

5. **Kanban**
   - 用途: タスク管理
   - 例: 実装タスクの管理

### 5. 設定のカスタマイズ

#### ファイルリンク形式

既存のドキュメントはMarkdownリンク形式（`[テキスト](./ファイル名.md)`）を使用しているため、`app.json`で`"useMarkdownLinks": true`に設定されています。

Wikiリンク形式（`[[ファイル名]]`）も使用できますが、既存のドキュメントとの一貫性を保つため、Markdownリンク形式の使用を推奨します。

#### グラフビューの活用

Obsidianのグラフビューを活用することで、ドキュメント間の関係性を可視化できます。

特に以下のドキュメントは多くの参照を持っているため、グラフビューで確認すると便利です：

- `DOCUMENTATION_INDEX.md`: すべてのドキュメントへのインデックス
- `CONVEX_SCHEMA.md`: スキーマ定義
- `USER_STORIES.md`: ユーザーストーリー
- `DESIGN_DOCUMENT.md`: 設計ドキュメント

## 既存のドキュメント構造との統合

### ドキュメントインデックス

`DOCUMENTATION_INDEX.md`がすべてのドキュメントへのマスターインデックスとして機能しています。

Obsidianのバックリンク機能を活用することで、各ドキュメントがどこから参照されているかを確認できます。

### ユーザーストーリー

`USER_STORIES.md`、`ADMIN_USER_STORIES.md`、`WEB_USER_STORIES.md`は、Obsidianのアウトライン機能や検索機能を活用して効率的に閲覧できます。

### スキーマ定義

`CONVEX_SCHEMA.md`は長いドキュメントですが、Obsidianのアウトライン機能や検索機能を活用して、必要な情報を素早く見つけることができます。

## ワークフロー例

### 新機能の実装時

1. `USER_STORIES.md`または`WEB_USER_STORIES.md`から該当するストーリーを確認
2. `CONVEX_SCHEMA.md`でスキーマ定義を確認
3. `DESIGN_DOCUMENT.md`で設計詳細を確認
4. Obsidianのバックリンク機能で関連ドキュメントを確認

### ドキュメントの更新時

1. 更新するドキュメントを開く
2. Obsidianのバックリンク機能で、そのドキュメントを参照している他のドキュメントを確認
3. 必要に応じて関連ドキュメントも更新

## 注意事項

### Gitとの統合

- `.obsidian/workspace.json`などの個人設定は`.gitignore`に含まれているため、Gitにコミットされません
- `app.json`と`core-plugins.json`は共有設定としてコミットされています
- チームでObsidianを使用する場合は、これらの設定ファイルを共有することで、一貫した環境を構築できます

### パフォーマンス

- このプロジェクトには多くのMarkdownファイルが含まれているため、Obsidianの起動時に少し時間がかかる場合があります
- グラフビューは多くのノードを表示するため、パフォーマンスに影響を与える可能性があります

## 参考リンク

- [Obsidian公式ドキュメント](https://help.obsidian.md/)
- [Obsidianプラグイン一覧](https://obsidian.md/plugins)

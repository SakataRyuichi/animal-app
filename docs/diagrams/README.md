# 図表（draw.io）

このディレクトリには draw.io 形式の図を配置し、Git で管理します。

## ファイル

| ファイル | 内容 |
|----------|------|
| **er-diagram.drawio** | Convex スキーマの ER 図（本番様）。1行1項目・括弧を避けた表記で、エンジニア以外にも読みやすくしてある |
| **NOTATION.md** | ER図の表記ルール（視認性・非エンジニア向け）。カンマ／括弧をやめ「／」「主キー」「→」で統一する方針 |

## 開き方

### VSCode / Cursor
1. 拡張機能 **「Draw.io Integration」**（id: `hediet.vscode-drawio`）をインストール
2. `er-diagram.drawio` を開く → エディタ内で図が表示・編集できます

### ブラウザ
- [draw.io](https://app.diagrams.net/) を開き、「Open Existing Diagram」からこのファイルを選択

### デスクトップ
- [draw.io Desktop](https://github.com/jgraph/drawio-desktop/releases) で開く

## スキーマとの紐づけ

| 役割 | 場所 | 説明 |
|------|------|------|
| **正の定義** | [docs/schema/](../schema/) | [CONVEX_SCHEMA_INDEX.md](../schema/CONVEX_SCHEMA_INDEX.md) がインデックス。[convex-schema/](../schema/convex-schema/) にテーブルごとの説明。実装時の型定義は `00-schema-definition.md` を参照。 |
| **このER図** | 当ディレクトリ | 上記スキーマの**可視化**。主要テーブル（users, pets, activities, pet_members, images）に限定したサンプル。 |

**運用**:
- 図中のテーブル名・フィールド名は、スキーマ文書の表記と一致させる。
- スキーマを変更したときは、必要に応じてこのER図も更新する（図は「主要テーブル」のみのため、該当する場合のみでよい）。

**更新漏れ防止**（Cursor）:
- コミット前に `docs/schema/` だけを変更していると、`scripts/schema-docs-check.sh`（before_commit フック）が実行され、`docs/diagrams/` の更新を促すかコミットを阻止します。
- 手動で確認・更新するときは Cursor の `/schema-docs-sync` コマンドを実行してください。手順は [.cursor/commands/schema-docs-sync.md](../.cursor/commands/schema-docs-sync.md) を参照。

**動作確認の手順**（スキーマのみ変更したときのブロックを試す）:
1. `docs/schema/` のどれか 1 ファイルを編集して保存する（例: CONVEX_SCHEMA_INDEX.md に空行を 1 行追加）。
2. そのファイルだけステージする: `git add docs/schema/CONVEX_SCHEMA_INDEX.md`
3. `bash scripts/schema-docs-check.sh` を実行する → 警告が表示され exit 1 になる。
4. `docs/diagrams/` のどれかも一緒にステージする（例: `git add docs/diagrams/README.md`）か、図を更新してから再度 3 を実行する → exit 0 で通る。

## 参照

- 表記ルール: [NOTATION.md](./NOTATION.md)
- スキーマ定義（正）: [docs/schema/CONVEX_SCHEMA_INDEX.md](../schema/CONVEX_SCHEMA_INDEX.md) / [CONVEX_SCHEMA.md](../schema/CONVEX_SCHEMA.md)
- スキーマ分割: [docs/schema/convex-schema/](../schema/convex-schema/)

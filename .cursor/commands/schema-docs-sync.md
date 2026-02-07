# `/schema-docs-sync` コマンド

スキーマ（docs/schema/ または Convex schema）を更新したあと、関連ドキュメントの更新漏れを防ぐために実行します。

## 目的

- **更新漏れの防止**: スキーマ変更に伴い、ER図・README などの関連ドキュメントが古いままになるのを防ぐ
- **ドキュメントを死なせない**: 正の定義（スキーマ）と可視化（ER図）の紐づけを維持する

## ワークフロー

1. **スキーマ変更の検知**
   - `bash scripts/schema-docs-check.sh` を実行する（コミット前フックでも自動実行される）
   - スキーマ関連ファイルが変更されているが、`docs/diagrams/` に変更がない場合は警告が出る

2. **関連ドキュメントの確認・更新**
   - [docs/diagrams/README.md](../../docs/diagrams/README.md) の「スキーマとの紐づけ」を確認
   - 以下を必要に応じて更新する:
     - **ER図**: [docs/diagrams/er-diagram.drawio](../../docs/diagrams/er-diagram.drawio) — テーブル追加・削除・リレーション変更があれば反映
     - **表記**: [docs/diagrams/NOTATION.md](../../docs/diagrams/NOTATION.md) — 表記ルールを変えた場合
     - **README**: [docs/diagrams/README.md](../../docs/diagrams/README.md) — ファイル一覧や紐づけ説明の変更
   - [docs/schema/CONVEX_SCHEMA_INDEX.md](../../docs/schema/CONVEX_SCHEMA_INDEX.md) にテーブルを追加した場合は、ER図にそのテーブルを載せるか「主要テーブルのみ」の注記を維持する

3. **変更のステージと再コミット**
   - 更新したドキュメントを `git add` し、再度コミットする（この時点で schema-docs-check は通る）

## 使用例

```
/schema-docs-sync
```

手動でチェックだけ実行する場合（リポジトリルートで）:

```bash
bash scripts/schema-docs-check.sh
```

警告を出してもコミットを阻止しない場合:

```bash
SCHEMA_DOCS_CHECK_STRICT=0 bash scripts/schema-docs-check.sh
```

## フックとの関係

- **before_commit**: コミット時に `scripts/schema-docs-check.sh` が実行される（optional で追加する想定）。スキーマだけ変更して diagrams を変更していないと exit 1 でコミットがブロックされる
- どうしても今回だけスキーマだけコミットしたい場合は `git commit --no-verify` でスキップ可能（非推奨）

## 参照

- スキーマとER図の紐づけ: [docs/diagrams/README.md](../../docs/diagrams/README.md#スキーマとの紐づけ)
- 正の定義: [docs/schema/CONVEX_SCHEMA_INDEX.md](../../docs/schema/CONVEX_SCHEMA_INDEX.md)

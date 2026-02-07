# アプリケーションドキュメント

このディレクトリには、**アプリケーションの使用・要件・設計・実装**に関するドキュメントを文脈ごとに整理して格納しています。

設定用ファイル（AGENTS.md、CLAUDE.md、.cursor/ など）はリポジトリルートにあります。

## ディレクトリ構成

| ディレクトリ | 内容 |
|-------------|------|
| **[stories/](./stories/)** | ユーザーストーリー（モバイル・管理画面・公式サイト） |
| **[requirements/](./requirements/)** | 要件・レビュー・議事録 |
| **[design/](./design/)** | 詳細設計・アーキテクチャ・機能別設計書 |
| **[schema/](./schema/)** | Convexスキーマ定義 |
| **[app-structure/](./app-structure/)** | アプリディレクトリ構成・画面マッピング |
| **[implementation/](./implementation/)** | エピック・実装フェーズ・実装計画 |

## クイックリンク

- **マasterインデックス**: [DOCUMENTATION_INDEX.md](../DOCUMENTATION_INDEX.md)（ルート）
- **開発の憲法**: stories/ の各 USER_STORIES / ADMIN_USER_STORIES / WEB_USER_STORIES と schema/ の CONVEX_SCHEMA

## 参照

プロジェクトルール・エージェント設定はリポジトリルートを参照してください。

- [AGENTS.md](../AGENTS.md) - Cursorエージェントガイドライン
- [CLAUDE.md](../CLAUDE.md) - Claude AI設定
- [.cursor/rules/PROJECT.md](../.cursor/rules/PROJECT.md) - プロジェクトルール

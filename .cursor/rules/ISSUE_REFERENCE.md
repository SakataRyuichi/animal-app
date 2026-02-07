# GitHub Issue参照方法のガイドライン

このドキュメントは、SkillsやRulesファイルでGitHub Issueを参照する際の統一的な方法を定義します。

## 基本原則

1. **Issue番号は必ず記載**: Issueを参照する場合は、Issue番号（`#123`）を必ず記載する
2. **Issueタイトルも記載**: Issue番号だけでなく、タイトルも記載することで、コンテキストが明確になる
3. **リンク形式で記載**: GitHubのIssue URLまたはMarkdownリンク形式で記載
4. **関連Issueも記載**: 依存関係や関連するIssueがあれば、すべて記載する

## 記載形式

### 形式1: Markdownリンク形式（推奨）

```markdown
- **関連Issue**: [#123](https://github.com/your-org/animal-app/issues/123): TASK-0-3-1: Convexスキーマの定義（usersテーブル）
```

### 形式2: GitHub Issue番号形式

```markdown
- **関連Issue**: #123 (TASK-0-3-1: Convexスキーマの定義（usersテーブル）)
```

### 形式3: 簡潔な形式（Issue番号のみ）

```markdown
- **実装Issue**: #123
- **依存Issue**: #120, #121
```

## Skillsファイルでの記載方法

### 例: Convex開発パターンSkill

```markdown
# Convex開発パターン

## スキーマ定義

スキーマ定義の実装については、以下のIssueを参照してください：

- **実装Issue**: [#123](https://github.com/your-org/animal-app/issues/123): TASK-0-3-1: Convexスキーマの定義（usersテーブル）
- **関連Issue**: [#124](https://github.com/your-org/animal-app/issues/124): TASK-0-3-3: Convex関数の作成（ユーザー情報の同期）

## 実装時の注意事項

1. Issue #123の「必須参照ドキュメント」を確認
2. Issue #123の「受け入れ基準」を満たす実装
3. Issue #124で定義された関数パターンに従う
```

## Rulesファイルでの記載方法

### 例: PROJECT.md

```markdown
## Convexスキーマ定義

Convexスキーマの定義方法については、以下のIssueを参照してください：

- **実装ガイド**: [#123](https://github.com/your-org/animal-app/issues/123): TASK-0-3-1: Convexスキーマの定義（usersテーブル）
- **実装計画**: [docs/implementation/EPIC_IMPLEMENTATION_PLAN.md](../../docs/implementation/EPIC_IMPLEMENTATION_PLAN.md): Epic 0-3の実装タスク

### 実装時の必須チェックリスト

- [ ] Issue #123の「必須参照ドキュメント」をすべて確認
- [ ] Issue #123の「受け入れ基準」を満たす実装
- [ ] Issue #123の「検証項目」をすべてクリア
```

## Issue番号の取得方法

### GitHub CLIを使用

```bash
# Issueを作成して番号を取得
gh issue create --title "[TASK]: タイトル" --body-file issue-body.md

# 作成されたIssue番号を確認
gh issue list --limit 1
```

### GitHub Web UIを使用

1. Issueを作成
2. Issue番号を確認（例: `#123`）
3. Issue URLをコピー（例: `https://github.com/your-org/animal-app/issues/123`）

## Issue参照の更新タイミング

### 実装開始時

- SkillsやRulesファイルにIssue番号を追加
- 実装計画ドキュメント（`EPIC_IMPLEMENTATION_PLAN.md`）にIssue番号を追加

### 実装完了時

- Issueをクローズ（`Closes #123`）
- 関連するSkillsやRulesファイルのIssue参照を確認
- 必要に応じて、実装結果へのリンクを追加

### Issue変更時

- Issue番号が変更された場合は、すべての参照を更新
- Issueタイトルが変更された場合は、参照を更新

## 実装計画ドキュメントでの記載方法

### EPIC_IMPLEMENTATION_PLAN.mdでの記載

```markdown
#### TASK-0-3-1: Convexスキーマの定義（usersテーブル）

**Issue番号**: #123（作成後）
**Issue URL**: https://github.com/your-org/animal-app/issues/123

**概要**:
ユーザー情報を管理するConvexスキーマを定義します。

**実装内容**:
- [ ] `packages/backend/convex/schema.ts`に`users`テーブルを定義
- [ ] スキーマの型定義（`v`スキーマを使用）
- [ ] インデックスの定義
- [ ] スキーマの動作確認

**必須参照ドキュメント**:
- **スキーマ定義**: `CONVEX_SCHEMA.md`: usersテーブル定義（1. users）
- **セキュリティ規約**: `.cursor/rules/SECURITY_IPA.md`: IPAセキュリティ実装規約
- **ユーザーストーリー**: `USER_STORIES.md`: US-001（ユーザー登録）
- **実装計画**: [docs/implementation/IMPLEMENTATION_PHASES.md](../../docs/implementation/IMPLEMENTATION_PHASES.md): Phase 0-3の実装計画

**テンプレート**: `ai-task.yml`
```

## 注意事項

1. **Issue番号は作成後に記載**: Issueを作成する前に参照を記載する場合は、「（作成後）」と明記
2. **リンク切れに注意**: Issueが削除された場合、参照を削除または更新
3. **一貫性を保つ**: 同じIssueを参照する場合は、同じ形式で記載
4. **依存関係を明確に**: 依存するIssueがある場合は、必ず記載

## 参考資料

- [ISSUE_GUIDELINES.md](../../ISSUE_GUIDELINES.md): GitHub Issue作成ガイドライン
- [docs/implementation/EPIC_IMPLEMENTATION_PLAN.md](../../docs/implementation/EPIC_IMPLEMENTATION_PLAN.md): エピックと実装タスクの詳細定義
- [docs/implementation/IMPLEMENTATION_PHASES.md](../../docs/implementation/IMPLEMENTATION_PHASES.md): 実装フェーズ計画

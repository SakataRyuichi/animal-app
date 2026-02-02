# Dependency Audit Command

依存ライブラリの脆弱性をスキャンします。

## 使用方法

```bash
/dependency-audit
```

または

```bash
pnpm security:dependency-audit
```

## 実行内容

`pnpm audit`を実行し、依存ライブラリの脆弱性をスキャンします。

デフォルトでは、**High**以上の深刻度の脆弱性を検出します。

## オプション

### 深刻度レベルの指定

```bash
# Criticalのみ
pnpm security:dependency-audit critical

# High以上（デフォルト）
pnpm security:dependency-audit high

# Moderate以上
pnpm security:dependency-audit moderate
```

### 自動修正

```bash
pnpm audit --fix
```

## 出力

- **脆弱性が見つかった場合**: エラーコードを返し、修正方法を表示
- **脆弱性が見つからなかった場合**: 成功メッセージを表示

## 参考資料

- [.cursor/skills/dependency-audit/SKILL.md](../../skills/dependency-audit/SKILL.md): 依存関係監査スキル

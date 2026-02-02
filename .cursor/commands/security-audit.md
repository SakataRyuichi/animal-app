# Security Audit Command

IPAガイドラインに基づくセキュリティ監査を実行します。

## 使用方法

```bash
/security-audit
```

または

```bash
pnpm security:audit
```

## 実行内容

以下のセキュリティチェックを実行します：

1. **入力検証チェック**: Convex関数の`args`に`v.*`スキーマが定義されているか
2. **SQLインジェクション対策**: 文字列結合によるクエリ構築がないか
3. **パストラバーサル対策**: ユーザー入力を直接ファイルパスに使用していないか
4. **XSS対策**: `dangerouslySetInnerHTML`を使用していないか
5. **CSRF対策**: すべての`mutation`で`ctx.auth.getUserIdentity()`をチェックしているか
6. **エラーメッセージの情報漏洩対策**: スタックトレースを含めていないか
7. **3ヶ月ロック機能**: 適切なアクセス制御が実装されているか

## 出力

- **Errors**: 即座に対応が必要な重大な問題
- **Warnings**: 対応が推奨される問題

## 参考資料

- [.cursor/rules/SECURITY_IPA.md](../../rules/SECURITY_IPA.md): IPAセキュリティ実装規約
- [.cursor/skills/security-audit/SKILL.md](../../skills/security-audit/SKILL.md): セキュリティ監査スキル

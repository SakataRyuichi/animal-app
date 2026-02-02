# 35. legal_documents（法務ドキュメント）

**📚 インデックス**: [CONVEX_SCHEMA_INDEX.md](../CONVEX_SCHEMA_INDEX.md)

### 35. legal_documents（法務ドキュメント）✅ **2026年追加 - 公式サイト**

**目的**: プライバシーポリシー、利用規約、特定商取引法表記などの法務ドキュメントを管理。法的要件を満たし、必要に応じて更新できる。

**主要フィールド**:
- `type`: ドキュメントタイプ
  - `privacy_policy`: プライバシーポリシー
  - `terms_of_service`: 利用規約
  - `specific_commercial_transactions`: 特定商取引法に基づく表記
  - `amazon_associate`: Amazonアソシエイト規約
  - `google_admob`: Google AdMob規約
  - `external_transmission`: 外部送信規約（電気通信事業法）
- `version`: バージョン（例: "1.0", "2.0"）
- `content`: ドキュメントの本文（Markdown形式）
- `effectiveDate`: 効力発生日時
- `createdAt`: 作成日時
- `updatedAt`: 更新日時
- `createdBy`: 作成者（管理者）

**インデックス**:
- `by_type`: ドキュメントタイプ・効力発生日時での検索（最新版の取得用）
- `by_type_version`: ドキュメントタイプ・バージョンでの検索（特定バージョンの取得用）

**使用例**:
```typescript
// プライバシーポリシーの作成
await ctx.db.insert("legal_documents", {
  type: "privacy_policy",
  version: "1.0",
  content: "# プライバシーポリシー\n\n...",
  effectiveDate: Date.now(),
  createdAt: Date.now(),
  updatedAt: Date.now(),
  createdBy: adminUserId,
});

// プライバシーポリシーの改定（新バージョン）
await ctx.db.insert("legal_documents", {
  type: "privacy_policy",
  version: "2.0",
  content: "# プライバシーポリシー（改定版）\n\n...",
  effectiveDate: Date.now(),
  createdAt: Date.now(),
  updatedAt: Date.now(),
  createdBy: adminUserId,
});

// 最新版のプライバシーポリシーを取得
const latestPrivacyPolicy = await ctx.db
  .query("legal_documents")
  .withIndex("by_type", (q) => q.eq("type", "privacy_policy"))
  .order("desc")
  .first();
```

---

# AIチャット機能の設計レビュー

**📚 ドキュメントインデックス**: [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)

**関連ドキュメント**:
- [CONVEX_SCHEMA.md](./CONVEX_SCHEMA.md): AIチャット機能の実装例
- [AI_CHAT_DISCLAIMER.md](./AI_CHAT_DISCLAIMER.md): 免責事項の設計
- [USER_STORIES.md](./USER_STORIES.md): US-020〜US-025（AI相談機能）

## レビュー目的

AIチャット機能が適切にユーザー情報とペット情報にアクセスできているか、またRAG（Retrieval-Augmented Generation）と組み合わせて適切に設計されているかをレビューします。

---

## ✅ 良い点

### 1. RAGアーキテクチャの基本設計
- ✅ ベクトル検索による知識ベース検索が実装されている
- ✅ `citedSources`フィールドで引用元を明示している
- ✅ ペットのカルテ情報（`pets`、`activities`）を活用している
- ✅ 年齢計算に`packages/utils`を使用して一貫性を保っている

### 2. スキーマ設計
- ✅ `chat_threads`テーブルで`userId`と`petId`を適切に管理
- ✅ `chat_messages`テーブルで`citedSources`を配列で保存
- ✅ `knowledge_base`テーブルにベクトルインデックスが設定されている

---

## ⚠️ 問題点と改善案

### 1. **認証チェックの欠如** 🔴 **重要**

**問題点**:
- `chat` actionの実装例に認証チェックがない
- 誰でも任意のペットIDでチャットを開始できてしまう

**改善案**:
```typescript
export const chat = action({
  args: {
    petId: v.id("pets"),
    threadId: v.id("chat_threads"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    // ✅ 認証チェックを追加
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証が必要です");
    }

    const currentUser = await ctx.runQuery(api.users.getCurrentUser);
    if (!currentUser) {
      throw new Error("ユーザーが見つかりません");
    }

    // ✅ ペットアクセス権限チェックを追加
    const pet = await ctx.runQuery(api.pets.getById, { petId: args.petId });
    if (!pet) {
      throw new Error("ペットが見つかりません");
    }

    // 所有者または共同管理者かチェック
    const hasAccess = await ctx.runQuery(api.pets.checkAccess, {
      petId: args.petId,
      userId: currentUser._id,
    });
    if (!hasAccess) {
      throw new Error("このペットへのアクセス権限がありません");
    }

    // ... 以下、既存の処理
  },
});
```

---

### 2. **ペットアクセス権限チェックの欠如** 🔴 **重要**

**問題点**:
- ユーザーがそのペットの所有者または共同管理者かチェックしていない
- `pet_members`テーブルを使った権限チェックがない
- 他のユーザーのペット情報にアクセスできてしまう可能性がある

**改善案**:
```typescript
// packages/backend/convex/pets.ts
export const checkAccess = query({
  args: {
    petId: v.id("pets"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const pet = await ctx.db.get(args.petId);
    if (!pet) return false;

    // 所有者かチェック
    if (pet.ownerId === args.userId) {
      return true;
    }

    // 共同管理者かチェック
    const member = await ctx.db
      .query("pet_members")
      .withIndex("by_pet", (q) => q.eq("petId", args.petId))
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    return !!member; // admin/editor/viewerのいずれでもアクセス可能
  },
});
```

---

### 3. **ユーザー情報の欠如** 🟡 **改善推奨**

**問題点**:
- システムプロンプトにユーザー情報（名前など）が含まれていない
- よりパーソナライズされた回答ができない

**改善案**:
```typescript
// システムプロンプトにユーザー情報を追加
const systemPrompt = `あなたはペットの健康管理をサポートするAIアシスタントです。
重要な注意事項:
- あなたは獣医師ではありません。診断を下さず、あくまで一般的なアドバイスと受診の目安を提示してください。
- 緊急度が高い場合は、必ず動物病院への受診を推奨してください。
- 回答には引用元を明示してください。

飼い主情報:
- 名前: ${currentUser.name || "飼い主さん"}

ペット情報:
- 名前: ${pet.name}
- 種別: ${pet.species}
- 品種: ${pet.breed || "不明"}
- 年齢: ${ageDisplay}
- 体重: ${pet.weight || "不明"}g
${pet.memorialStatus ? `- メモリアルモード: このペットは虹の橋を渡りました（命日: ${new Date(pet.memorialStatus.deceasedDate).toLocaleDateString("ja-JP")}）` : ""}

直近の記録:
${recentActivities.length > 0 
  ? recentActivities.map((a) => `- ${a.type}: ${JSON.stringify(a.payload)}`).join("\n")
  : "- 記録がありません。より詳しいアドバイスのために、日々の記録を続けてください。"}

参考知識:
${knowledgeResults.map((k) => `- ${k.title}: ${k.content}`).join("\n")}`;
```

---

### 4. **メモリアルモードの考慮不足** 🟡 **改善推奨**

**問題点**:
- メモリアルモードのペットへの対応が不明確
- 年齢計算で`deceasedDate`が考慮されていない

**改善案**:
```typescript
// 年齢計算にdeceasedDateを追加
const ageInfo = pet.birthDate 
  ? calculatePetAgeInfo(
      pet.birthDate, 
      pet.species,
      Date.now(),
      pet.memorialStatus?.deceasedDate // ✅ メモリアルモード対応
    )
  : null;
const ageDisplay = ageInfo 
  ? formatPetAgeDisplay(ageInfo, !!pet.memorialStatus) // ✅ メモリアルモード対応
  : "不明";

// システムプロンプトにメモリアル情報を追加
if (pet.memorialStatus) {
  systemPrompt += `\n\n注意: このペットは虹の橋を渡りました。過去の記録に基づいたアドバイスを提供しますが、現在の状態に関する質問には対応できません。`;
}
```

---

### 5. **RAG検索の最適化不足** 🟡 **改善推奨**

**問題点**:
- 知識ベースの検索で種別による絞り込みがない
- 検索結果の関連性スコアを考慮していない

**改善案**:
```typescript
// 3. 知識ベースを検索（種別による絞り込みを追加）
const knowledgeResults = await ctx.vectorSearch(
  "knowledge_base",
  "by_embedding",
  {
    vector: queryEmbedding,
    limit: 10, // まず多めに取得
  }
);

// 種別によるフィルタリング（オプション）
// ペットの種別に関連する知識を優先
const filteredKnowledge = knowledgeResults
  .filter((k) => {
    // カテゴリやタグで種別を判定（knowledge_baseテーブルに種別フィールドを追加することを推奨）
    // 例: k.category === pet.species または k.tags.includes(pet.species)
    return true; // 暫定的に全て含める
  })
  .slice(0, 5); // 上位5件を使用

// 関連性スコアが低い場合は警告
const minScore = 0.7; // 閾値は調整が必要
const relevantKnowledge = filteredKnowledge.filter((k) => k._score >= minScore);

if (relevantKnowledge.length === 0) {
  // 関連する知識が見つからない場合の処理
  console.warn("関連する知識が見つかりませんでした");
}
```

---

### 6. **スレッド作成時の権限チェック不足** 🟡 **改善推奨**

**問題点**:
- `chat_threads`作成時に`userId`と`petId`の整合性チェックがない
- 他のユーザーのペットでスレッドを作成できてしまう可能性がある

**改善案**:
```typescript
// packages/backend/convex/chat.ts
export const createThread = mutation({
  args: {
    petId: v.id("pets"),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUser(ctx);

    // ペットアクセス権限チェック
    const hasAccess = await ctx.runQuery(api.pets.checkAccess, {
      petId: args.petId,
      userId: currentUser._id,
    });
    if (!hasAccess) {
      throw new Error("このペットへのアクセス権限がありません");
    }

    // スレッド作成
    const threadId = await ctx.db.insert("chat_threads", {
      userId: currentUser._id, // ✅ 現在のユーザーIDを使用
      petId: args.petId,
      createdAt: Date.now(),
    });

    return threadId;
  },
});
```

---

### 7. **活動ログ取得の最適化** 🟢 **任意改善**

**問題点**:
- 直近3日間のログのみ取得しているが、質問内容によっては過去の記録も必要
- 削除されたログ（`deletion`）が含まれる可能性がある

**改善案**:
```typescript
// 活動ログ取得時に削除チェックを追加
const recentActivities = await ctx.runQuery(api.activities.getRecent, {
  petId: args.petId,
  days: 7, // ✅ 3日から7日に拡張（質問内容によって動的に変更することも検討）
  includeDeleted: false, // ✅ 削除されたログは除外
});

// または、質問内容を分析して必要な期間を決定
// 例: 「最近」→3日、「先月」→30日、「去年」→365日
```

---

### 8. **エラーハンドリングの強化** 🟢 **任意改善**

**問題点**:
- OpenAI API呼び出し時のエラーハンドリングが不十分
- ベクトル検索が失敗した場合の処理がない

**改善案**:
```typescript
try {
  // ベクトル検索
  const knowledgeResults = await ctx.vectorSearch(
    "knowledge_base",
    "by_embedding",
    {
      vector: queryEmbedding,
      limit: 5,
    }
  );

  // OpenAI API呼び出し
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: args.message },
    ],
    temperature: 0.7,
  });

  // ... 処理続行
} catch (error) {
  // ✅ エラーログを記録
  console.error("AIチャット処理エラー:", error);
  
  // ✅ ユーザーに分かりやすいエラーメッセージを返す
  throw new Error("AIチャットの処理中にエラーが発生しました。しばらくしてから再度お試しください。");
}
```

---

## 📋 実装チェックリスト

### 必須対応（セキュリティ）
- [ ] `chat` actionに認証チェックを追加
- [ ] ペットアクセス権限チェック関数（`checkAccess`）を実装
- [ ] `chat_threads`作成時に権限チェックを追加
- [ ] 活動ログ取得時に削除チェックを追加

### 推奨対応（UX向上）
- [ ] システムプロンプトにユーザー情報を追加
- [ ] メモリアルモードのペットへの対応を追加
- [ ] 年齢計算に`deceasedDate`パラメータを追加
- [ ] RAG検索の最適化（種別フィルタリング、スコア閾値）

### 任意対応（堅牢性向上）
- [ ] エラーハンドリングの強化
- [ ] 活動ログ取得期間の動的調整
- [ ] 知識ベースの種別フィールド追加

---

## 🔍 追加検討事項

### 1. プレミアム機能との統合
- AIチャット機能はプレミアム限定か、無料ユーザーにも一部提供するか？
- 無料ユーザーには1日1回などの制限を設けるか？

### 2. チャット履歴の管理
- スレッドの自動削除機能（例：30日以上未使用）
- スレッドタイトルの自動生成ロジック

### 3. 緊急度判定の実装
- 質問内容から緊急度を判定するロジック
- 緊急時の病院マップ表示機能

### 4. 知識ベースの拡充
- 種別ごとの知識ベース分類
- カテゴリ（Emergency/Food/Illnessなど）による検索最適化

---

## 📝 まとめ

### 現状の評価
- **RAGアーキテクチャ**: ✅ 基本的な設計は良好
- **セキュリティ**: ⚠️ 認証・権限チェックが不足
- **UX**: 🟡 ユーザー情報の活用が不足
- **堅牢性**: 🟡 エラーハンドリングが不十分

### 優先度
1. **高**: 認証・権限チェック（セキュリティ）
2. **中**: ユーザー情報の追加、メモリアルモード対応
3. **低**: RAG検索の最適化、エラーハンドリング強化

### 次のステップ
1. `packages/backend/convex/lib/permissions.ts`に`checkPetAccess`関数を追加
2. `chat` actionに認証・権限チェックを追加
3. システムプロンプトにユーザー情報を追加
4. メモリアルモード対応を追加

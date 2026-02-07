# 日記の更新・削除・下書き機能の検証と設計

**📚 ドキュメントインデックス**: [DOCUMENTATION_INDEX.md](../../DOCUMENTATION_INDEX.md)

## 概要

このドキュメントは、日記機能の更新・削除・下書き機能について、現在のユーザーストーリーの確認と、Convexでの実現可能性を検証した結果をまとめています。

**作成日**: 2026年2月1日

---

## 1. 現在のユーザーストーリーの確認

### 1.1 日記の更新・削除機能

#### ✅ 存在するストーリー

**US-077: 活動ログ編集**
- **画面パス**: `app/timeline/[id].tsx`
- **対象**: すべての活動ログ（日記を含む）
- **受け入れ基準**:
  - ログ詳細画面から編集できる
  - すべてのフィールドを変更できる
  - 変更が即座に反映される
- **問題点**: 日記に特化した詳細な受け入れ基準がない

**US-078: 活動ログ削除**
- **画面パス**: `app/timeline/[id].tsx`
- **対象**: すべての活動ログ（日記を含む）
- **受け入れ基準**:
  - ログ詳細画面から削除できる
  - 削除確認ダイアログが表示される
  - 削除時に「後から元に戻せます（30日間）」というメッセージが表示される
  - 削除後、タイムラインから消える（論理削除）
  - 削除理由を選択できる（誤操作、データ整理など）
- **問題点**: 日記に特化した詳細な受け入れ基準がない

#### ❌ 不足しているストーリー

1. **日記編集の詳細な手順**
   - シーン・感情・タグの編集方法
   - 画像の追加・削除方法
   - 公開設定の変更方法

2. **日記削除の詳細な手順**
   - 日記削除時の特別な考慮事項（公開日記の場合など）

---

### 1.2 下書き機能

#### ❌ 存在しないストーリー

現在、モバイルアプリのユーザーストーリーには**日記の下書き機能は存在しません**。

**参考**: 管理画面と公式サイトには下書き機能があります
- **管理画面**: コラム記事の下書き保存（`ADMIN_USER_STORIES.md`）
- **公式サイト**: ニュース記事の下書き保存（`WEB_USER_STORIES.md`）

---

## 2. Convexでの実現可能性検証

### 2.1 日記の更新・削除機能

#### ✅ 実現可能

**理由**:
- Convexの`patch`と`delete`メソッドで実現可能
- 既存の`activities`テーブルに`deletion`オブジェクトを使用した論理削除機能が実装済み
- US-077、US-078のストーリーが存在し、実装の方向性は明確

**実装方法**:
```typescript
// 日記の更新（Mutation）
export const updateDiary = mutation({
  args: {
    activityId: v.id("activities"),
    payload: v.object({
      text: v.optional(v.string()),
      scenes: v.optional(v.array(v.string())),
      emotion: v.optional(v.string()),
      timeOfDay: v.optional(v.string()),
      location: v.optional(v.string()),
      contextStamp: v.optional(v.string()),
      imageIds: v.optional(v.array(v.id("images"))),
    }),
    isPublic: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // 権限チェック
    const activity = await ctx.db.get(args.activityId);
    if (!activity || activity.type !== "diary") {
      throw new Error("日記が見つかりません");
    }
    
    // 更新
    await ctx.db.patch(args.activityId, {
      payload: {
        ...activity.payload,
        ...args.payload,
      },
      isPublic: args.isPublic ?? activity.isPublic,
    });
  },
});

// 日記の削除（論理削除）
export const deleteDiary = mutation({
  args: {
    activityId: v.id("activities"),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const activity = await ctx.db.get(args.activityId);
    if (!activity || activity.type !== "diary") {
      throw new Error("日記が見つかりません");
    }
    
    await ctx.db.patch(args.activityId, {
      deletion: createDeletion(ctx.auth.getUserIdentity().tokenIdentifier, args.reason, 30),
    });
  },
});
```

---

### 2.2 下書き機能

#### ✅ 実現可能（ただし、コストとパフォーマンスを考慮する必要がある）

**理由**:
- Convexの`insert`と`patch`メソッドで実現可能
- リアルタイム同期機能（`useQuery`）により、下書きの自動保存が可能
- ただし、頻繁なMutation呼び出しはコストとパフォーマンスに影響する

**実装方法**:

##### オプション1: `activities`テーブルに`isDraft`フラグを追加（推奨）

**メリット**:
- 既存のテーブル構造を活用できる
- 下書きと公開日記を同じテーブルで管理できる
- 実装が簡単

**デメリット**:
- タイムライン表示時に下書きを除外する必要がある
- 下書き専用のインデックスが必要になる可能性がある

**スキーマ変更**:
```typescript
// CONVEX_SCHEMA.md の activities テーブルに追加
activities: defineTable({
  // ...既存フィールド
  isDraft: v.optional(v.boolean()), // 下書きフラグ（デフォルト: false）
  draftSavedAt: v.optional(v.number()), // 下書き保存日時（Unixタイムスタンプ）
})
```

**実装例**:
```typescript
// 下書きの作成・更新（Mutation）
export const saveDiaryDraft = mutation({
  args: {
    petId: v.id("pets"),
    activityId: v.optional(v.id("activities")), // 既存の下書きを更新する場合
    payload: v.object({
      text: v.optional(v.string()),
      scenes: v.optional(v.array(v.string())),
      emotion: v.optional(v.string()),
      timeOfDay: v.optional(v.string()),
      location: v.optional(v.string()),
      contextStamp: v.optional(v.string()),
      imageIds: v.optional(v.array(v.id("images"))),
    }),
  },
  handler: async (ctx, args) => {
    const userId = ctx.auth.getUserIdentity().tokenIdentifier;
    
    if (args.activityId) {
      // 既存の下書きを更新
      const existing = await ctx.db.get(args.activityId);
      if (existing && existing.isDraft && existing.createdBy === userId) {
        await ctx.db.patch(args.activityId, {
          payload: {
            ...existing.payload,
            ...args.payload,
          },
          draftSavedAt: Date.now(),
        });
        return args.activityId;
      }
    }
    
    // 新しい下書きを作成
    const draftId = await ctx.db.insert("activities", {
      petId: args.petId,
      createdBy: userId,
      loggedAt: Date.now(),
      type: "diary",
      payload: args.payload,
      isDraft: true,
      draftSavedAt: Date.now(),
      isPublic: false,
      likeCount: 0,
    });
    
    return draftId;
  },
});

// 下書きを公開（Mutation）
export const publishDiaryDraft = mutation({
  args: {
    activityId: v.id("activities"),
  },
  handler: async (ctx, args) => {
    const userId = ctx.auth.getUserIdentity().tokenIdentifier;
    const draft = await ctx.db.get(args.activityId);
    
    if (!draft || !draft.isDraft || draft.createdBy !== userId) {
      throw new Error("下書きが見つかりません");
    }
    
    await ctx.db.patch(args.activityId, {
      isDraft: false,
      draftSavedAt: undefined,
    });
  },
});

// 下書きの取得（Query）
export const getDiaryDrafts = query({
  args: {
    petId: v.id("pets"),
  },
  handler: async (ctx, args) => {
    const userId = ctx.auth.getUserIdentity().tokenIdentifier;
    
    return await ctx.db
      .query("activities")
      .withIndex("by_pet_active", (q) => 
        q.eq("petId", args.petId).eq("deletion", undefined)
      )
      .filter((q) => 
        q.and(
          q.eq(q.field("type"), "diary"),
          q.eq(q.field("isDraft"), true),
          q.eq(q.field("createdBy"), userId)
        )
      )
      .order("desc")
      .collect();
  },
});
```

##### オプション2: 専用の`diary_drafts`テーブルを作成

**メリット**:
- 下書きと公開日記を完全に分離できる
- タイムライン表示時に下書きを除外する必要がない
- 下書き専用の最適化が可能

**デメリット**:
- 新しいテーブルが必要
- 下書きを公開する際にデータの移行が必要

**スキーマ変更**:
```typescript
// CONVEX_SCHEMA.md に新しいテーブルを追加
diary_drafts: defineTable({
  petId: v.id("pets"),
  createdBy: v.string(), // userId
  payload: v.object({
    text: v.optional(v.string()),
    scenes: v.optional(v.array(v.string())),
    emotion: v.optional(v.string()),
    timeOfDay: v.optional(v.string()),
    location: v.optional(v.string()),
    contextStamp: v.optional(v.string()),
    imageIds: v.optional(v.array(v.id("images"))),
  }),
  savedAt: v.number(), // 下書き保存日時（Unixタイムスタンプ）
})
  .index("by_pet_user", ["petId", "createdBy"])
  .index("by_user", ["createdBy"]);
```

**推奨**: **オプション1（`isDraft`フラグ）**を推奨します。理由は、既存のテーブル構造を活用でき、実装が簡単で、下書きと公開日記を同じテーブルで管理できるためです。

---

### 2.3 リアルタイム下書き保存

#### ✅ 実現可能（ただし、デバウンスとスロットリングが必要）

**理由**:
- Convexの`useMutation`と`useQuery`により、リアルタイム同期が可能
- ただし、頻繁なMutation呼び出しはコストとパフォーマンスに影響する

**実装方法**:

##### クライアント側（React Native）

```typescript
import { useMutation } from "convex/react";
import { api } from "@repo/backend/convex/_generated/api";
import { useDebouncedCallback } from "use-debounce";

function DiaryEditScreen() {
  const saveDraft = useMutation(api.diary.saveDiaryDraft);
  const [draftId, setDraftId] = useState<Id<"activities"> | null>(null);
  const [formData, setFormData] = useState({
    text: "",
    scenes: [],
    emotion: "",
  });
  
  // デバウンスされた保存関数（2秒間入力がない場合に保存）
  const debouncedSave = useDebouncedCallback(
    async (data: typeof formData) => {
      try {
        const id = await saveDraft({
          petId: petId,
          activityId: draftId,
          payload: data,
        });
        setDraftId(id);
      } catch (error) {
        console.error("下書き保存エラー:", error);
      }
    },
    2000 // 2秒待機
  );
  
  // フォームデータが変更されたら下書きを保存
  useEffect(() => {
    if (formData.text || formData.scenes.length > 0 || formData.emotion) {
      debouncedSave(formData);
    }
  }, [formData, debouncedSave]);
  
  // 画面を離れる前に保存
  useEffect(() => {
    return () => {
      if (formData.text || formData.scenes.length > 0 || formData.emotion) {
        debouncedSave.flush(); // 待機中の保存を即座に実行
      }
    };
  }, []);
}
```

**コスト考慮事項**:
- **デバウンス時間**: 2秒程度が推奨（入力頻度とコストのバランス）
- **スロットリング**: 1秒間に1回以上の保存を防ぐ
- **Convexの無料枠**: 月間のMutation実行数に制限があるため、過度な保存を避ける

**パフォーマンス考慮事項**:
- **オフライン対応**: オフライン時はローカルストレージに保存し、オンライン復帰時に同期
- **楽観的更新**: UIを即座に更新し、バックエンドの応答を待たない

---

## 3. 推奨される実装方針

### 3.1 日記の更新・削除機能

1. **US-077とUS-078を拡張**
   - 日記に特化した詳細な受け入れ基準を追加
   - シーン・感情・タグの編集方法を明確化
   - 画像の追加・削除方法を明確化

2. **実装**
   - 既存の`activities`テーブルを使用
   - `patch`メソッドで更新
   - `deletion`オブジェクトで論理削除

### 3.2 下書き機能

1. **新しいユーザーストーリーを作成**
   - US-089: 日記の下書き保存
   - US-090: 日記の下書き一覧表示
   - US-091: 日記の下書きから公開

2. **実装**
   - `activities`テーブルに`isDraft`フラグを追加（推奨）
   - リアルタイム保存はデバウンス（2秒）を使用
   - オフライン対応はローカルストレージを使用

---

## 4. 追加が必要なユーザーストーリー

### US-089: 日記の下書き保存 ✅ **新規追加**

**画面パス**: `app/pets/[id]/activities/journal.tsx`  
**As a** ペット飼い主  
**I want to** 日記を下書きとして保存できる  
**So that** 途中で中断しても、後で続きから書ける

**受け入れ基準**:
- 日記入力中に自動で下書きが保存される（2秒間入力がない場合）
- 手動で下書きを保存できる
- 下書き保存時に「下書きを保存しました」という通知が表示される
- オフライン時もローカルストレージに保存され、オンライン復帰時に自動で同期される
- 下書きは最大30日間保持される

**体験価値**:
- **安心感**: 途中で中断しても、下書きが自動で保存されるため安心
- **効率性**: 後で続きから書けるため、効率的に日記を書ける

**使用シーン**:
- 日記を書いている途中で電話がかかってきた時
- 日記を書いている途中でアプリを閉じた時
- 長文の日記を書いている時

**優先度**: 中

---

### US-090: 日記の下書き一覧表示 ✅ **新規追加**

**画面パス**: `app/pets/[id]/activities/journal.tsx`（下書きタブ）  
**As a** ペット飼い主  
**I want to** 保存した下書きの一覧を確認できる  
**So that** 続きから書く下書きを選択できる

**受け入れ基準**:
- 下書き一覧が時系列順に表示される
- 各下書きに保存日時、ペット名、プレビューテキストが表示される
- 下書きをタップすると編集画面に遷移する
- 下書きを削除できる
- 30日以上経過した下書きは自動で削除される

**体験価値**:
- **効率性**: 続きから書く下書きを素早く見つけられる
- **整理**: 不要な下書きを削除できる

**使用シーン**:
- 下書きから続きを書きたい時
- 不要な下書きを削除したい時

**優先度**: 中

---

### US-091: 日記の下書きから公開 ✅ **新規追加**

**画面パス**: `app/pets/[id]/activities/journal.tsx`（下書き編集画面）  
**As a** ペット飼い主  
**I want to** 下書きを公開できる  
**So that** 下書きを完成させて公開できる

**受け入れ基準**:
- 下書き編集画面から「公開」ボタンをタップできる
- 公開前に内容を確認できる
- 公開後、下書きフラグが解除され、タイムラインに表示される
- 公開後、下書きは削除される（または`isDraft: false`に変更される）

**体験価値**:
- **効率性**: 下書きを完成させて公開できる
- **安心感**: 公開前に内容を確認できる

**使用シーン**:
- 下書きを完成させて公開したい時

**優先度**: 中

---

### US-077-1: 日記編集の詳細手順 ✅ **US-077の拡張**

**画面パス**: `app/timeline/[id].tsx`（日記編集画面）  
**As a** ペット飼い主  
**I want to** 日記の詳細を編集できる  
**So that** 誤った情報を修正できる

**受け入れ基準**:
- **シーン・感情・タグの編集**: シーン、感情、時間帯、場所を変更できる
- **テキストの編集**: 日記本文を編集できる
- **画像の追加・削除**: 画像を追加・削除できる
- **公開設定の変更**: 公開設定（private/shared/public）を変更できる
- **変更の保存**: 変更を保存すると、即座にタイムラインに反映される
- **変更履歴**: 変更日時が記録される（オプション）

**体験価値**:
- **柔軟性**: 日記の内容をいつでも修正できる
- **正確性**: 誤った情報を修正できる

**使用シーン**:
- 日記の内容を修正したい時
- 画像を追加したい時
- 公開設定を変更したい時

**優先度**: 中

---

### US-078-1: 日記削除の詳細手順 ✅ **US-078の拡張**

**画面パス**: `app/timeline/[id].tsx`（日記詳細画面）  
**As a** ペット飼い主  
**I want to** 日記を削除できる  
**So that** 不要な日記を削除できる

**受け入れ基準**:
- **削除確認**: 削除確認ダイアログが表示される
- **公開日記の場合**: 公開日記を削除する場合、特別な警告が表示される
- **削除理由**: 削除理由を選択できる（誤操作、データ整理、プライバシーなど）
- **論理削除**: 削除後、タイムラインから消えるが、30日間は復元可能
- **復元**: 30日以内であれば、設定画面から復元できる

**体験価値**:
- **安心感**: 誤操作で削除しても、後から復元できる安心感
- **プライバシー**: 不要な日記を削除できる

**使用シーン**:
- 誤って日記を削除してしまった時
- プライバシー上の理由で日記を削除したい時

**優先度**: 中

---

## 5. スキーマ変更の提案

### 5.1 `activities`テーブルへの追加

```typescript
// CONVEX_SCHEMA.md の activities テーブルに追加
activities: defineTable({
  // ...既存フィールド
  isDraft: v.optional(v.boolean()), // 下書きフラグ（デフォルト: false）
  draftSavedAt: v.optional(v.number()), // 下書き保存日時（Unixタイムスタンプ）
})
```

### 5.2 インデックスの追加

```typescript
// 下書き検索用のインデックス
.index("by_pet_draft", ["petId", "isDraft"])
```

---

## 6. 実装時の注意事項

### 6.1 コスト管理

- **デバウンス時間**: 2秒程度が推奨
- **スロットリング**: 1秒間に1回以上の保存を防ぐ
- **Convexの無料枠**: 月間のMutation実行数に制限があるため、過度な保存を避ける

### 6.2 パフォーマンス

- **オフライン対応**: オフライン時はローカルストレージに保存し、オンライン復帰時に同期
- **楽観的更新**: UIを即座に更新し、バックエンドの応答を待たない

### 6.3 データ整合性

- **下書きの自動削除**: 30日以上経過した下書きは自動で削除
- **下書きの重複防止**: 同じペット・同じユーザーの下書きは1つまで（または複数許可）

---

## 7. まとめ

### 7.1 検証結果

1. **日記の更新・削除機能**: ✅ 実現可能（既存のストーリーを拡張）
2. **下書き機能**: ✅ 実現可能（新しいストーリーを追加）
3. **リアルタイム下書き保存**: ✅ 実現可能（デバウンスとスロットリングが必要）

### 7.2 推奨される実装順序

1. **Phase 1**: 日記の更新・削除機能の詳細化（US-077-1、US-078-1）
2. **Phase 2**: 下書き機能の実装（US-089、US-090、US-091）
3. **Phase 3**: リアルタイム下書き保存の最適化

### 7.3 次のステップ

1. `USER_STORIES.md`に新しいストーリー（US-089、US-090、US-091）を追加
2. `USER_STORIES.md`のUS-077とUS-078を拡張（US-077-1、US-078-1）
3. `CONVEX_SCHEMA.md`に`isDraft`フラグとインデックスを追加
4. `DESIGN_DOCUMENT.md`に下書き機能の設計詳細を追加
5. `APP_DIRECTORY_STRUCTURE.md`に下書き関連の画面パスを追加

---

**作成日**: 2026年2月1日  
**最終更新**: 2026年2月1日

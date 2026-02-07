# 3. pet_members（共同管理者）

**📚 インデックス**: [CONVEX_SCHEMA_INDEX.md](../CONVEX_SCHEMA_INDEX.md)

### 3. pet_members（共同管理者）

**目的**: Phase 2で実装。1匹のペットを複数人で管理

**主要フィールド**:
- `petId`: ペットID
- `userId`: ユーザーID
- `role`: 権限（admin/editor/viewer）

**権限の説明**:
- `admin`: すべての操作が可能（共同管理者の追加・削除、権限変更）
- `editor`: 活動ログの記録・編集が可能
- `viewer`: 閲覧のみ可能

**インデックス**:
- `by_pet`: ペットでの検索（共同管理者一覧）
- `by_user`: ユーザーでの検索（自分が管理できるペット一覧）

**使用例**:
```typescript
// 共同管理者追加
await ctx.db.insert("pet_members", {
  petId: petId,
  userId: familyMemberId,
  role: "editor",
});

// ペットアクセス権限チェック（AIチャットなどで使用）
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

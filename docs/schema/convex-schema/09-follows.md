# 9. follows（フォロー関係）

**📚 インデックス**: [CONVEX_SCHEMA_INDEX.md](../CONVEX_SCHEMA_INDEX.md)

### 9. follows（フォロー関係）

**目的**: Phase 3で実装。ユーザー間のフォロー関係を管理

**主要フィールド**:
- `followerId`: フォローする人（フォロワー）
- `followingId`: フォローされる人（フォロイー）
- `createdAt`: フォロー開始日時

**インデックス**:
- `by_follower`: フォローしている人の一覧取得
- `by_following`: フォロワー一覧取得
- `by_follower_following`: フォロー関係の確認（重複防止）

**使用例**:
```typescript
// フォロー
await ctx.db.insert("follows", {
  followerId: currentUserId,
  followingId: targetUserId,
  createdAt: Date.now(),
});

// フォロー解除
await ctx.db.delete(followId);
```

---

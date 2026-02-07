# Documentation Access Skill

## Purpose
This skill provides efficient access to project documentation, avoiding duplication and ensuring consistent references across all project files.

## When to Use
- When implementing new features and need to reference user stories or schema definitions
- When reviewing code and need to check design documents
- When setting up the project and need setup instructions
- When debugging and need to understand architecture decisions

## Documentation Structure

### Master Index
**Always start here**: [DOCUMENTATION_INDEX.md](../../DOCUMENTATION_INDEX.md)

This master document provides:
- Categorized list of all documents
- Purpose and target audience for each document
- Cross-references between related documents
- Quick reference for common tasks

### Key Documents by Category

#### 🎯 Development Constitution (Must Read)
- **[docs/stories/USER_STORIES.md](../../docs/stories/USER_STORIES.md)**: Mobile app user stories
- **[docs/app-structure/APP_DIRECTORY_STRUCTURE.md](../../docs/app-structure/APP_DIRECTORY_STRUCTURE.md)**: App directory structure and screen mapping ✅ **2026年追加 - Expo Router画面構成とユーザーストーリーの紐づけ**
- **[docs/stories/ADMIN_USER_STORIES.md](../../docs/stories/ADMIN_USER_STORIES.md)**: Admin panel user stories
- **[docs/stories/WEB_USER_STORIES.md](../../docs/stories/WEB_USER_STORIES.md)**: Official website user stories ✅ **2026年追加**
- **[docs/schema/CONVEX_SCHEMA.md](../../docs/schema/CONVEX_SCHEMA.md)**: Schema definitions and implementation examples

#### 🏗️ Design & Architecture
- **[docs/design/DESIGN_DOCUMENT.md](../../docs/design/DESIGN_DOCUMENT.md)**: App design details
- **[docs/design/TECH_STACK_PLANNING.md](../../docs/design/TECH_STACK_PLANNING.md)**: Technology selection details
- **[docs/design/IMAGE_STORAGE_STRATEGY.md](../../docs/design/IMAGE_STORAGE_STRATEGY.md)**: Image storage strategy

#### 💎 Feature-Specific Design
- **[docs/design/PREMIUM_FEATURES.md](../../docs/design/PREMIUM_FEATURES.md)**: Premium feature definitions
- **[docs/design/AI_CHAT_DISCLAIMER.md](../../docs/design/AI_CHAT_DISCLAIMER.md)**: AI chat disclaimer design
- **[docs/design/AI_CHAT_REVIEW.md](../../docs/design/AI_CHAT_REVIEW.md)**: AI chat feature review

#### 🛠️ Development Guides
- **[AGENTS.md](../../AGENTS.md)**: Cursor agent guidelines
- **[SETUP_CHECKLIST.md](../../SETUP_CHECKLIST.md)**: Setup checklist
- **[CLAUDE.md](../../CLAUDE.md)**: Claude AI specific settings

## Usage Patterns

### For Feature Implementation
1. Check [DOCUMENTATION_INDEX.md](../../DOCUMENTATION_INDEX.md) for quick reference
2. Read relevant user story from:
   - [docs/stories/USER_STORIES.md](../../docs/stories/USER_STORIES.md): Mobile app features
   - [docs/app-structure/APP_DIRECTORY_STRUCTURE.md](../../docs/app-structure/APP_DIRECTORY_STRUCTURE.md): Screen paths and user story mapping ✅ **2026年追加 - 画面パスとユーザーストーリーの対応関係**
   - [docs/stories/ADMIN_USER_STORIES.md](../../docs/stories/ADMIN_USER_STORIES.md): Admin panel features
   - [docs/stories/WEB_USER_STORIES.md](../../docs/stories/WEB_USER_STORIES.md): Official website features ✅ **2026年追加**
3. Review schema in [docs/schema/CONVEX_SCHEMA.md](../../docs/schema/CONVEX_SCHEMA.md)
4. Check design details in [docs/design/DESIGN_DOCUMENT.md](../../docs/design/DESIGN_DOCUMENT.md)

### For Schema Changes
1. Review [docs/schema/CONVEX_SCHEMA.md](../../docs/schema/CONVEX_SCHEMA.md)
2. Check [docs/requirements/SCHEMA_REVIEW.md](../../docs/requirements/SCHEMA_REVIEW.md) for review guidelines
3. Verify against [docs/stories/USER_STORIES.md](../../docs/stories/USER_STORIES.md) requirements

### For Premium Features
1. Check [docs/design/PREMIUM_FEATURES.md](../../docs/design/PREMIUM_FEATURES.md) for feature definitions
2. Review [docs/schema/CONVEX_SCHEMA.md](../../docs/schema/CONVEX_SCHEMA.md) for permission management
3. Check [docs/design/IMAGE_STORAGE_STRATEGY.md](../../docs/design/IMAGE_STORAGE_STRATEGY.md) if related to images

## Best Practices

1. **Avoid Duplication**: Don't copy documentation content. Reference the master documents instead.
2. **Use Master Index**: Always link to [DOCUMENTATION_INDEX.md](../../DOCUMENTATION_INDEX.md) for comprehensive documentation access.
3. **Follow Cross-References**: Use the "関連ドキュメント" (Related Documents) sections in each document to navigate.
4. **Update Index**: When creating new documents, update [DOCUMENTATION_INDEX.md](../../DOCUMENTATION_INDEX.md).

## Common Tasks Quick Reference

| Task | Primary Document | Supporting Documents |
|------|------------------|---------------------|
| Implement new feature | USER_STORIES.md, ADMIN_USER_STORIES.md, or WEB_USER_STORIES.md | APP_DIRECTORY_STRUCTURE.md, CONVEX_SCHEMA.md, DESIGN_DOCUMENT.md |
| Implement mobile app screen | APP_DIRECTORY_STRUCTURE.md, USER_STORIES.md | CONVEX_SCHEMA.md, DESIGN_DOCUMENT.md |
| Implement website feature | WEB_USER_STORIES.md | CONVEX_SCHEMA.md (news, legal_documents), DESIGN_DOCUMENT.md (5.11) |
| Change schema | docs/schema/CONVEX_SCHEMA.md | docs/requirements/SCHEMA_REVIEW.md, docs/stories/USER_STORIES.md |
| Implement premium feature | docs/design/PREMIUM_FEATURES.md | docs/schema/CONVEX_SCHEMA.md, docs/design/IMAGE_STORAGE_STRATEGY.md |
| Setup project | SETUP_CHECKLIST.md | docs/design/TECH_STACK_PLANNING.md, AGENTS.md |
| Review code | docs/requirements/DOCUMENT_REVIEW.md | docs/requirements/SCHEMA_REVIEW.md, docs/requirements/REQUIREMENTS_REVIEW.md |

## Notes

- All documentation paths are relative to the project root
- The master index ([DOCUMENTATION_INDEX.md](../../DOCUMENTATION_INDEX.md)) is the single source of truth for document organization
- When in doubt, start with the master index and follow cross-references

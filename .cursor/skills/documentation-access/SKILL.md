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
- **[USER_STORIES.md](../../USER_STORIES.md)**: Mobile app user stories
- **[ADMIN_USER_STORIES.md](../../ADMIN_USER_STORIES.md)**: Admin panel user stories
- **[CONVEX_SCHEMA.md](../../CONVEX_SCHEMA.md)**: Schema definitions and implementation examples

#### 🏗️ Design & Architecture
- **[DESIGN_DOCUMENT.md](../../DESIGN_DOCUMENT.md)**: App design details
- **[TECH_STACK_PLANNING.md](../../TECH_STACK_PLANNING.md)**: Technology selection details
- **[IMAGE_STORAGE_STRATEGY.md](../../IMAGE_STORAGE_STRATEGY.md)**: Image storage strategy

#### 💎 Feature-Specific Design
- **[PREMIUM_FEATURES.md](../../PREMIUM_FEATURES.md)**: Premium feature definitions
- **[AI_CHAT_DISCLAIMER.md](../../AI_CHAT_DISCLAIMER.md)**: AI chat disclaimer design
- **[AI_CHAT_REVIEW.md](../../AI_CHAT_REVIEW.md)**: AI chat feature review

#### 🛠️ Development Guides
- **[AGENTS.md](../../AGENTS.md)**: Cursor agent guidelines
- **[SETUP_CHECKLIST.md](../../SETUP_CHECKLIST.md)**: Setup checklist
- **[CLAUDE.md](../../CLAUDE.md)**: Claude AI specific settings

## Usage Patterns

### For Feature Implementation
1. Check [DOCUMENTATION_INDEX.md](../../DOCUMENTATION_INDEX.md) for quick reference
2. Read relevant user story from [USER_STORIES.md](../../USER_STORIES.md) or [ADMIN_USER_STORIES.md](../../ADMIN_USER_STORIES.md)
3. Review schema in [CONVEX_SCHEMA.md](../../CONVEX_SCHEMA.md)
4. Check design details in [DESIGN_DOCUMENT.md](../../DESIGN_DOCUMENT.md)

### For Schema Changes
1. Review [CONVEX_SCHEMA.md](../../CONVEX_SCHEMA.md)
2. Check [SCHEMA_REVIEW.md](../../SCHEMA_REVIEW.md) for review guidelines
3. Verify against [USER_STORIES.md](../../USER_STORIES.md) requirements

### For Premium Features
1. Check [PREMIUM_FEATURES.md](../../PREMIUM_FEATURES.md) for feature definitions
2. Review [CONVEX_SCHEMA.md](../../CONVEX_SCHEMA.md) for permission management
3. Check [IMAGE_STORAGE_STRATEGY.md](../../IMAGE_STORAGE_STRATEGY.md) if related to images

## Best Practices

1. **Avoid Duplication**: Don't copy documentation content. Reference the master documents instead.
2. **Use Master Index**: Always link to [DOCUMENTATION_INDEX.md](../../DOCUMENTATION_INDEX.md) for comprehensive documentation access.
3. **Follow Cross-References**: Use the "関連ドキュメント" (Related Documents) sections in each document to navigate.
4. **Update Index**: When creating new documents, update [DOCUMENTATION_INDEX.md](../../DOCUMENTATION_INDEX.md).

## Common Tasks Quick Reference

| Task | Primary Document | Supporting Documents |
|------|------------------|---------------------|
| Implement new feature | USER_STORIES.md or ADMIN_USER_STORIES.md | CONVEX_SCHEMA.md, DESIGN_DOCUMENT.md |
| Change schema | CONVEX_SCHEMA.md | SCHEMA_REVIEW.md, USER_STORIES.md |
| Implement premium feature | PREMIUM_FEATURES.md | CONVEX_SCHEMA.md, IMAGE_STORAGE_STRATEGY.md |
| Setup project | SETUP_CHECKLIST.md | TECH_STACK_PLANNING.md, AGENTS.md |
| Review code | DOCUMENT_REVIEW.md | SCHEMA_REVIEW.md, REQUIREMENTS_REVIEW.md |

## Notes

- All documentation paths are relative to the project root
- The master index ([DOCUMENTATION_INDEX.md](../../DOCUMENTATION_INDEX.md)) is the single source of truth for document organization
- When in doubt, start with the master index and follow cross-references

# デザインファイル（Pencil.dev）

このディレクトリには、Pencil.devで作成したデザインファイル（`.pen`形式）を配置します。

## 📁 ディレクトリ構成

```
designs/
├── screens/                # 画面デザイン
│   ├── home.pen           # ホーム画面
│   ├── pet-register.pen   # ペット登録画面
│   ├── pet-detail.pen     # ペット詳細画面
│   └── timeline.pen        # タイムライン画面
├── components/             # コンポーネントデザイン
│   ├── pet-card.pen        # ペットカードコンポーネント
│   ├── activity-form.pen  # 活動記録フォーム
│   └── ai-chat.pen        # AI相談チャット
├── design-system/         # デザインシステム
│   ├── colors.pen          # カラーパレット
│   ├── typography.pen      # タイポグラフィ
│   └── components.pen      # コンポーネントライブラリ
└── flows/                  # ユーザーフロー
    ├── pet-registration-flow.pen    # ペット登録フロー
    └── ai-consultation-flow.pen     # AI相談フロー
```

## 🎨 使用方法

1. **デザインファイルの作成**:
   - Cursorで`.pen`ファイルを作成
   - Pencilキャンバスが自動的に開きます

2. **デザインからコードへの変換**:
   - Pencilの「Export to Code」機能を使用
   - 生成されたコードを`packages/ui/`に配置

3. **Gitでの管理**:
   - `.pen`ファイルは通常のソースコードと同様にGitで管理
   - デザインの変更もコミット・レビュー可能

## 📚 参考

詳細なセットアップ手順は [`.cursor/PENCIL_SETUP.md`](../.cursor/PENCIL_SETUP.md) を参照してください。

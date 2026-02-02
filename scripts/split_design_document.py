#!/usr/bin/env python3
"""
DESIGN_DOCUMENT.mdをセクションごとに分割するスクリプト
"""

import re
import os
from pathlib import Path

# プロジェクトルート
ROOT = Path(__file__).parent.parent
DESIGN_FILE = ROOT / "DESIGN_DOCUMENT.md"
OUTPUT_DIR = ROOT / "design-document"

# セクションごとのマッピング
SECTION_MAPPING = {
    "01-project-overview.md": {"title": "1. プロジェクト概要", "pattern": r"## 1\. プロジェクト概要"},
    "02-data-model.md": {"title": "2. データモデル設計", "pattern": r"## 2\. データモデル設計"},
    "03-data-flow.md": {"title": "3. データフロー設計", "pattern": r"## 3\. データフロー設計"},
    "04-features.md": {"title": "4. 機能設計", "pattern": r"## 4\. 機能設計"},
    "05-screens.md": {"title": "5. 画面設計（Phase 1）", "pattern": r"## 5\. 画面設計"},
    "06-api-design.md": {"title": "6. API設計（Convex Functions）", "pattern": r"## 6\. API設計"},
    "07-security.md": {"title": "7. セキュリティ設計", "pattern": r"## 7\. セキュリティ設計"},
    "08-performance.md": {"title": "8. パフォーマンス最適化", "pattern": r"## 8\. パフォーマンス最適化"},
    "09-extensibility.md": {"title": "9. 将来の拡張性", "pattern": r"## 9\. 将来の拡張性"},
    "10-constraints.md": {"title": "10. 技術的制約と考慮事項", "pattern": r"## 10\. 技術的制約と考慮事項"},
    "11-glossary.md": {"title": "11. 用語集", "pattern": r"## 11\. 用語集"},
}

def extract_section(content, pattern):
    """特定のセクションを抽出"""
    match = re.search(pattern + r".*?(?=\n## \d+\.|\Z)", content, re.DOTALL)
    if match:
        return match.group(0).strip()
    return None

def create_section_file(filename, section_info, header_content, all_content):
    """セクションファイルを作成"""
    output_path = OUTPUT_DIR / filename
    
    # ヘッダー部分を取得
    header_match = re.search(r"^#.*?\n---\n\n", all_content, re.DOTALL)
    header = header_match.group(0) if header_match else ""
    
    # セクションファイルの内容を構築
    section_content = f"# {section_info['title']}\n\n"
    section_content += f"**📚 インデックス**: [DESIGN_DOCUMENT_INDEX.md](../DESIGN_DOCUMENT_INDEX.md)\n\n"
    
    # セクションを抽出して追加
    section_text = extract_section(all_content, section_info["pattern"])
    if section_text:
        # セクションタイトルを削除（既に追加済み）
        section_text = re.sub(r"^## \d+\.\s+", "", section_text, flags=re.MULTILINE)
        section_content += section_text + "\n"
    
    # ファイルに書き込み
    output_path.write_text(section_content, encoding="utf-8")
    print(f"Created: {output_path}")

def main():
    # 出力ディレクトリを作成
    OUTPUT_DIR.mkdir(exist_ok=True)
    
    # DESIGN_DOCUMENT.mdを読み込む
    content = DESIGN_FILE.read_text(encoding="utf-8")
    
    # 各セクションファイルを作成
    for filename, section_info in SECTION_MAPPING.items():
        create_section_file(filename, section_info, "", content)
    
    print(f"\n分割完了: {len(SECTION_MAPPING)}個のファイルを作成しました")

if __name__ == "__main__":
    main()

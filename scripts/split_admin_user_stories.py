#!/usr/bin/env python3
"""
ADMIN_USER_STORIES.mdをEpicごとに分割するスクリプト
"""

import re
import os
from pathlib import Path

# プロジェクトルート
ROOT = Path(__file__).parent.parent
ADMIN_STORIES_FILE = ROOT / "ADMIN_USER_STORIES.md"
OUTPUT_DIR = ROOT / "admin-user-stories"

# EpicごとのADM番号のマッピング
EPIC_MAPPING = {
    "01-articles.md": {
        "title": "Epic ADM-1: コラム・記事管理機能",
        "adm_numbers": ["ADM-001", "ADM-002", "ADM-003"],
        "section_start": "## コラム・記事管理機能"
    },
    "02-curations.md": {
        "title": "Epic ADM-2: キュレーション記事管理機能",
        "adm_numbers": ["ADM-004", "ADM-005"],
        "section_start": "## キュレーション記事管理機能"
    },
    "03-products.md": {
        "title": "Epic ADM-3: 商品データベース管理機能",
        "adm_numbers": ["ADM-006", "ADM-007", "ADM-008"],
        "section_start": "## 商品データベース管理機能"
    },
    "04-users.md": {
        "title": "Epic ADM-4: ユーザー管理機能",
        "adm_numbers": ["ADM-009", "ADM-010"],
        "section_start": "## ユーザー管理機能"
    },
    "05-statistics.md": {
        "title": "Epic ADM-5: 統計・分析機能",
        "adm_numbers": ["ADM-011"],
        "section_start": "## 統計・分析機能"
    },
    "06-monitoring.md": {
        "title": "Epic ADM-6: 監視・アラート機能",
        "adm_numbers": ["ADM-012", "ADM-013", "ADM-014", "ADM-015"],
        "section_start": "## 監視・アラート機能"
    },
}

def extract_adm_section(content, adm_number):
    """特定のADM番号のセクションを抽出"""
    pattern = rf"### {re.escape(adm_number)}:.*?(?=\n### ADM-|\n---\n\n## |\Z)"
    match = re.search(pattern, content, re.DOTALL)
    if match:
        return match.group(0).strip()
    return None

def create_epic_file(filename, epic_info, all_content):
    """Epicファイルを作成"""
    output_path = OUTPUT_DIR / filename
    
    # Epicファイルの内容を構築
    epic_content = f"# {epic_info['title']}\n\n"
    epic_content += f"**📚 インデックス**: [ADMIN_USER_STORIES_INDEX.md](../ADMIN_USER_STORIES_INDEX.md)\n\n"
    
    # セクション開始部分を追加
    if epic_info.get("section_start"):
        epic_content += f"{epic_info['section_start']}\n\n"
    
    # 各ADM番号のセクションを抽出して追加
    for adm_number in epic_info["adm_numbers"]:
        adm_section = extract_adm_section(all_content, adm_number)
        if adm_section:
            epic_content += adm_section + "\n\n---\n\n"
    
    # ファイルに書き込み
    output_path.write_text(epic_content, encoding="utf-8")
    print(f"Created: {output_path}")

def main():
    # 出力ディレクトリを作成
    OUTPUT_DIR.mkdir(exist_ok=True)
    
    # ADMIN_USER_STORIES.mdを読み込む
    content = ADMIN_STORIES_FILE.read_text(encoding="utf-8")
    
    # 各Epicファイルを作成
    for filename, epic_info in EPIC_MAPPING.items():
        create_epic_file(filename, epic_info, content)
    
    print(f"\n分割完了: {len(EPIC_MAPPING)}個のファイルを作成しました")

if __name__ == "__main__":
    main()

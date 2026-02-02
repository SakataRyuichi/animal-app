#!/usr/bin/env python3
"""
WEB_USER_STORIES.mdをEpicごとに分割するスクリプト
"""

import re
import os
from pathlib import Path

# プロジェクトルート
ROOT = Path(__file__).parent.parent
WEB_STORIES_FILE = ROOT / "WEB_USER_STORIES.md"
OUTPUT_DIR = ROOT / "web-user-stories"

# EpicごとのWEB番号のマッピング
EPIC_MAPPING = {
    "01-top-page.md": {
        "title": "Epic 1: トップページ・機能紹介",
        "web_numbers": ["WEB-001", "WEB-002"],
        "section_start": "## トップページ・機能紹介"
    },
    "02-news.md": {
        "title": "Epic 2: ニュース・更新情報",
        "web_numbers": ["WEB-003", "WEB-004", "WEB-005"],
        "section_start": "## ニュース・更新情報"
    },
    "03-legal.md": {
        "title": "Epic 3: 法務ドキュメント",
        "web_numbers": ["WEB-007", "WEB-008", "WEB-009", "WEB-010"],
        "section_start": "## 法務ドキュメント管理"
    },
    "04-seo.md": {
        "title": "Epic 4: SEO・LLM最適化",
        "web_numbers": ["WEB-013", "WEB-014"],
        "section_start": "## SEO・LLM最適化"
    },
    "05-brand.md": {
        "title": "Epic 5: ブランド戦略・UI/UXガイドライン",
        "web_numbers": ["WEB-015", "WEB-016", "WEB-017", "WEB-018"],
        "section_start": "## ブランド戦略・UI/UXガイドライン"
    },
    "06-monorepo.md": {
        "title": "Epic 6: モノレポ運用・自動更新",
        "web_numbers": ["WEB-019", "WEB-020"],
        "section_start": None  # このEpicは複数のセクションにまたがる
    },
    "07-global-data.md": {
        "title": "Epic 7: グローバル公開データの閲覧（将来機能）",
        "web_numbers": ["WEB-011", "WEB-012"],
        "section_start": "## グローバル公開データの閲覧（将来機能）"
    },
}

def extract_web_section(content, web_number):
    """特定のWEB番号のセクションを抽出"""
    pattern = rf"### {re.escape(web_number)}:.*?(?=\n### WEB-|\n---\n\n## |\Z)"
    match = re.search(pattern, content, re.DOTALL)
    if match:
        return match.group(0).strip()
    return None

def create_epic_file(filename, epic_info, all_content):
    """Epicファイルを作成"""
    output_path = OUTPUT_DIR / filename
    
    # Epicファイルの内容を構築
    epic_content = f"# {epic_info['title']}\n\n"
    epic_content += f"**📚 インデックス**: [WEB_USER_STORIES_INDEX.md](../WEB_USER_STORIES_INDEX.md)\n\n"
    
    # セクション開始部分を追加
    if epic_info.get("section_start"):
        epic_content += f"{epic_info['section_start']}\n\n"
    
    # 各WEB番号のセクションを抽出して追加
    for web_number in epic_info["web_numbers"]:
        web_section = extract_web_section(all_content, web_number)
        if web_section:
            epic_content += web_section + "\n\n---\n\n"
    
    # ファイルに書き込み
    output_path.write_text(epic_content, encoding="utf-8")
    print(f"Created: {output_path}")

def main():
    # 出力ディレクトリを作成
    OUTPUT_DIR.mkdir(exist_ok=True)
    
    # WEB_USER_STORIES.mdを読み込む
    content = WEB_STORIES_FILE.read_text(encoding="utf-8")
    
    # 各Epicファイルを作成
    for filename, epic_info in EPIC_MAPPING.items():
        create_epic_file(filename, epic_info, content)
    
    print(f"\n分割完了: {len(EPIC_MAPPING)}個のファイルを作成しました")

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
USER_STORIES.mdをEpicごとに分割するスクリプト
"""

import re
import os
from pathlib import Path

# プロジェクトルート
ROOT = Path(__file__).parent.parent
USER_STORIES_FILE = ROOT / "USER_STORIES.md"
OUTPUT_DIR = ROOT / "user-stories"

# EpicごとのUS番号のマッピング
EPIC_MAPPING = {
    "01-authentication.md": {
        "title": "Epic 1: 認証・ユーザー管理",
        "us_numbers": ["US-001", "US-002", "US-003"],
        "section_start": "### 認証・ユーザー管理"
    },
    "02-pet-management.md": {
        "title": "Epic 2: ペット管理",
        "us_numbers": ["US-004", "US-005-1", "US-005", "US-006", "US-007", "US-007-1", "US-005-2", "US-005-3"],
        "section_start": "### ペット管理"
    },
    "03-activity-logs.md": {
        "title": "Epic 3: 活動ログ記録・リマインダー・広告表示",
        "us_numbers": ["US-008", "US-008-1", "US-009", "US-010", "US-011", "US-012", "US-013", "US-013-1", 
                       "US-014", "US-015", "US-018", "US-072", "US-073", "US-074", "US-075", "US-076", 
                       "US-077", "US-078", "US-078-1", "US-065", "US-066"],
        "section_start": "### 活動ログ記録"
    },
    "04-dashboard-statistics.md": {
        "title": "Epic 4: ダッシュボード・統計",
        "us_numbers": ["US-016", "US-017", "US-072"],
        "section_start": "### ダッシュボード・統計"
    },
    "05-premium.md": {
        "title": "Epic 5: プレミアム機能",
        "us_numbers": ["US-019", "US-019-1", "US-019-2", "US-019-3", "US-019-4", "US-055", "US-056", "US-067"],
        "section_start": "### プレミアム機能"
    },
    "06-articles.md": {
        "title": "Epic 6: コラム・記事機能",
        "us_numbers": ["US-026", "US-027", "US-028", "US-029", "US-079", "US-080", "US-081", "US-082"],
        "section_start": "### コラム・記事機能"
    },
    "07-ai-chat.md": {
        "title": "Epic 7: AI相談機能",
        "us_numbers": ["US-020", "US-021", "US-022", "US-023", "US-024", "US-025"],
        "section_start": "### AI相談機能"
    },
    "08-collaboration.md": {
        "title": "Epic 8: 共同管理",
        "us_numbers": ["US-033", "US-034", "US-035", "US-036", "US-037", "US-038"],
        "section_start": "### 共同管理"
    },
    "09-sns.md": {
        "title": "Epic 9: SNS機能",
        "us_numbers": ["US-039", "US-040", "US-041", "US-042", "US-043", "US-075"],
        "section_start": "### SNS機能"
    },
    "10-products.md": {
        "title": "Epic 10: 商品データベース",
        "us_numbers": ["US-044", "US-045", "US-046"],
        "section_start": "### 商品データベース"
    },
    "11-reviews.md": {
        "title": "Epic 11: レビュー機能",
        "us_numbers": ["US-048", "US-049", "US-050"],
        "section_start": "### レビュー機能"
    },
    "12-media.md": {
        "title": "Epic 12: 画像・動画管理機能",
        "us_numbers": ["US-051", "US-052", "US-053", "US-054", "US-092", "US-093", "US-094", "US-095", "US-065", "US-066"],
        "section_start": "### 画像管理機能"
    },
    "13-feedback.md": {
        "title": "Epic 13: ユーザーフィードバック機能",
        "us_numbers": ["US-055", "US-056"],
        "section_start": "### ユーザーフィードバック機能"
    },
    "14-memorial.md": {
        "title": "Epic 14: メモリアル機能",
        "us_numbers": ["US-057", "US-058", "US-059", "US-067"],
        "section_start": "### メモリアル機能"
    },
    "15-albums.md": {
        "title": "Epic 15: アルバム管理機能",
        "us_numbers": ["US-060", "US-061", "US-062", "US-063", "US-064"],
        "section_start": "### アルバム管理機能"
    },
    "16-curation.md": {
        "title": "Epic 16: 管理者厳選のキュレーション機能",
        "us_numbers": ["US-079", "US-080", "US-081", "US-082"],
        "section_start": None  # コラム・記事機能の中に含まれる
    },
    "17-gamification.md": {
        "title": "Epic 17: ゲーミフィケーション要素",
        "us_numbers": ["US-068", "US-069", "US-070", "US-071", "US-083", "US-084", "US-085", "US-086", "US-087", "US-088"],
        "section_start": "### Epic 17: ゲーミフィケーション要素"
    },
}

def extract_us_section(content, us_number):
    """特定のUS番号のセクションを抽出"""
    # US番号のパターン（例: US-001, US-005-1）
    pattern = rf"#### {re.escape(us_number)}:.*?(?=\n#### US-|\n---\n\n## |\Z)"
    match = re.search(pattern, content, re.DOTALL)
    if match:
        return match.group(0).strip()
    return None

def extract_section_by_title(content, section_title):
    """セクションタイトルでセクションを抽出"""
    if section_title is None:
        return None
    pattern = rf"{re.escape(section_title)}\n\n(.*?)(?=\n### |\n## Phase |\Z)"
    match = re.search(pattern, content, re.DOTALL)
    if match:
        return match.group(1).strip()
    return None

def create_epic_file(filename, epic_info, header_content, all_content):
    """Epicファイルを作成"""
    output_path = OUTPUT_DIR / filename
    
    # ヘッダー部分を取得
    header_match = re.search(r"^#.*?\n---\n\n", all_content, re.DOTALL)
    header = header_match.group(0) if header_match else ""
    
    # Epicファイルの内容を構築
    epic_content = f"# {epic_info['title']}\n\n"
    epic_content += f"**📚 インデックス**: [USER_STORIES_INDEX.md](../USER_STORIES_INDEX.md)\n\n"
    
    # セクション開始部分を追加
    if epic_info.get("section_start"):
        epic_content += f"## {epic_info['section_start'].replace('### ', '')}\n\n"
    
    # 各US番号のセクションを抽出して追加
    for us_number in epic_info["us_numbers"]:
        us_section = extract_us_section(all_content, us_number)
        if us_section:
            epic_content += us_section + "\n\n---\n\n"
    
    # ファイルに書き込み
    output_path.write_text(epic_content, encoding="utf-8")
    print(f"Created: {output_path}")

def main():
    # 出力ディレクトリを作成
    OUTPUT_DIR.mkdir(exist_ok=True)
    
    # USER_STORIES.mdを読み込む
    content = USER_STORIES_FILE.read_text(encoding="utf-8")
    
    # ヘッダー部分を抽出（最初の---まで）
    header_match = re.search(r"^#.*?\n---\n\n", content, re.DOTALL)
    header = header_match.group(0) if header_match else ""
    
    # 各Epicファイルを作成
    for filename, epic_info in EPIC_MAPPING.items():
        create_epic_file(filename, epic_info, header, content)
    
    print(f"\n分割完了: {len(EPIC_MAPPING)}個のファイルを作成しました")

if __name__ == "__main__":
    main()

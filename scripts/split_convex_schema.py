#!/usr/bin/env python3
"""
CONVEX_SCHEMA.mdをテーブルごとに分割するスクリプト
"""

import re
import os
from pathlib import Path

# プロジェクトルート
ROOT = Path(__file__).parent.parent
SCHEMA_FILE = ROOT / "CONVEX_SCHEMA.md"
OUTPUT_DIR = ROOT / "convex-schema"

# テーブルごとのマッピング
TABLE_MAPPING = {
    "01-users.md": {"title": "1. users（ユーザー）", "pattern": r"### 1\. users（ユーザー）"},
    "02-pets.md": {"title": "2. pets（ペット）", "pattern": r"### 2\. pets（ペット）"},
    "03-pet-members.md": {"title": "3. pet_members（共同管理者）", "pattern": r"### 3\. pet_members（共同管理者）"},
    "05-images.md": {"title": "5. images（画像・動画管理）", "pattern": r"### 5\. images（画像・動画管理）"},
    "06-activities.md": {"title": "6. activities（活動ログ）", "pattern": r"### 6\. activities（活動ログ）"},
    "07-products.md": {"title": "7. products（商品データベース）", "pattern": r"### 7\. products（商品データベース）"},
    "08-reviews.md": {"title": "8. reviews（商品レビュー）", "pattern": r"### 8\. reviews（商品レビュー）"},
    "09-follows.md": {"title": "9. follows（フォロー関係）", "pattern": r"### 9\. follows（フォロー関係）"},
    "10-likes.md": {"title": "10. likes（いいね・リアクション）", "pattern": r"### 10\. likes（いいね・リアクション）"},
    "11-articles.md": {"title": "11. articles（コラム・記事）", "pattern": r"### 11\. articles（コラム・記事）"},
    "12-chat-threads.md": {"title": "12. chat_threads（AIチャットスレッド）", "pattern": r"### 12\. chat_threads（AIチャットスレッド）"},
    "13-chat-messages.md": {"title": "13. chat_messages（AIチャットメッセージ）", "pattern": r"### 13\. chat_messages（AIチャットメッセージ）"},
    "14-albums.md": {"title": "14. albums（アルバム）", "pattern": r"### 14\. albums（アルバム）"},
    "15-album-items.md": {"title": "15. album_items（アルバムアイテム）", "pattern": r"### 15\. album_items（アルバムアイテム）"},
    "16-premium-cancellation-reasons.md": {"title": "16. premium_cancellation_reasons（プレミアム解除理由）", "pattern": r"### 16\. premium_cancellation_reasons（プレミアム解除理由）"},
    "17-account-deletion-reasons.md": {"title": "17. account_deletion_reasons（退会理由）", "pattern": r"### 17\. account_deletion_reasons（退会理由）"},
    "18-curations.md": {"title": "18. curations（管理者厳選のキュレーション）", "pattern": r"### 18\. curations（管理者厳選のキュレーション）"},
    "19-curation-interactions.md": {"title": "19. curation_interactions（キュレーションインタラクション）", "pattern": r"### 19\. curation_interactions（キュレーションインタラクション）"},
    "20-toilet-condition-masters.md": {"title": "20. toilet_condition_masters（トイレ記録用マスターデータ）", "pattern": r"### 20\. toilet_condition_masters（トイレ記録用マスターデータ）"},
    "21-cleaning-action-masters.md": {"title": "21. cleaning_action_masters（清掃アクションマスターデータ）", "pattern": r"### 21\. cleaning_action_masters（清掃アクションマスターデータ）"},
    "22-reminder-category-masters.md": {"title": "22. reminder_category_masters（リマインダーカテゴリマスターデータ）", "pattern": r"### 22\. reminder_category_masters（リマインダーカテゴリマスターデータ）"},
    "23-reminders.md": {"title": "23. reminders（リマインダー設定）", "pattern": r"### 23\. reminders（リマインダー設定）"},
    "24-reminder-logs.md": {"title": "24. reminder_logs（リマインダー完了履歴）", "pattern": r"### 24\. reminder_logs（リマインダー完了履歴）"},
    "25-knowledge-base.md": {"title": "25. knowledge_base（知識ベース）", "pattern": r"### 25\. knowledge_base（知識ベース）"},
    "26-assets.md": {"title": "26. assets（ショップアイテム）", "pattern": r"### 26\. assets（ショップアイテム）"},
    "27-badge-definitions.md": {"title": "27. badge_definitions（バッジ定義）", "pattern": r"### 27\. badge_definitions（バッジ定義）"},
    "28-point-history.md": {"title": "28. point_history（ポイント獲得履歴）", "pattern": r"### 28\. point_history（ポイント獲得履歴）"},
    "29-news.md": {"title": "29. news（ニュース・更新情報）", "pattern": r"### 29\. news（ニュース・更新情報）"},
    "31-diary-scenes.md": {"title": "31. diary_scenes（日記シーンマスターデータ）", "pattern": r"### 31\. diary_scenes（日記シーンマスターデータ）"},
    "32-diary-emotions.md": {"title": "32. diary_emotions（日記感情マスターデータ）", "pattern": r"### 32\. diary_emotions（日記感情マスターデータ）"},
    "33-reaction-types.md": {"title": "33. reaction_types（リアクションタイプマスターデータ）", "pattern": r"### 33\. reaction_types（リアクションタイプマスターデータ）"},
    "34-context-stamps.md": {"title": "34. context_stamps（コンテキストスタンプマスターデータ）", "pattern": r"### 34\. context_stamps（コンテキストスタンプマスターデータ）"},
    "35-legal-documents.md": {"title": "35. legal_documents（法務ドキュメント）", "pattern": r"### 35\. legal_documents（法務ドキュメント）"},
}

def extract_table_section(content, pattern):
    """特定のテーブルセクションを抽出"""
    match = re.search(pattern + r".*?(?=\n### \d+\.|\n## |\Z)", content, re.DOTALL)
    if match:
        return match.group(0).strip()
    return None

def create_table_file(filename, table_info, header_content, all_content):
    """テーブルファイルを作成"""
    output_path = OUTPUT_DIR / filename
    
    # ヘッダー部分を取得
    header_match = re.search(r"^#.*?\n---\n\n", all_content, re.DOTALL)
    header = header_match.group(0) if header_match else ""
    
    # テーブルファイルの内容を構築
    table_content = f"# {table_info['title']}\n\n"
    table_content += f"**📚 インデックス**: [CONVEX_SCHEMA_INDEX.md](../CONVEX_SCHEMA_INDEX.md)\n\n"
    
    # テーブルセクションを抽出して追加
    table_section = extract_table_section(all_content, table_info["pattern"])
    if table_section:
        table_content += table_section + "\n"
    
    # ファイルに書き込み
    output_path.write_text(table_content, encoding="utf-8")
    print(f"Created: {output_path}")

def main():
    # 出力ディレクトリを作成
    OUTPUT_DIR.mkdir(exist_ok=True)
    
    # CONVEX_SCHEMA.mdを読み込む
    content = SCHEMA_FILE.read_text(encoding="utf-8")
    
    # 各テーブルファイルを作成
    for filename, table_info in TABLE_MAPPING.items():
        create_table_file(filename, table_info, "", content)
    
    print(f"\n分割完了: {len(TABLE_MAPPING)}個のファイルを作成しました")

if __name__ == "__main__":
    main()

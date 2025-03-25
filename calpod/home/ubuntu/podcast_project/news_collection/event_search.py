import sys
sys.path.append('/opt/.manus/.sandbox-runtime')
from data_api import ApiClient
import json
import os
import time

# APIクライアントの初期化
client = ApiClient()

# 検索キーワードリスト - イベント特化
event_keywords = [
    "東京 週末イベント",
    "神奈川 週末イベント",
    "東京 美術展 開催中",
    "神奈川 美術展 開催中",
    "東京 ミートアップ テック",
    "東京 ギャラリー オープニング",
    "東京 音楽ライブ 今週末",
    "神奈川 音楽ライブ 今週末",
    "東京 建築ツアー",
    "東京 ファッションショー"
]

# 結果を保存するディレクトリ
output_dir = "/home/ubuntu/podcast_project/news_collection"

# 各キーワードで検索を実行
for keyword in event_keywords:
    print(f"「{keyword}」で検索中...")
    
    # Twitter検索APIを呼び出し
    try:
        result = client.call_api('Twitter/search_twitter', query={
            'query': keyword,
            'count': 20,
            'type': 'Latest'
        })
        
        # 結果をファイルに保存
        filename = os.path.join(output_dir, f"events_{keyword.replace(' ', '_')}.json")
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        
        print(f"結果を {filename} に保存しました")
        
        # APIリクエスト間に少し待機
        time.sleep(1)
    except Exception as e:
        print(f"エラーが発生しました: {e}")

print("イベント情報の検索が完了しました")

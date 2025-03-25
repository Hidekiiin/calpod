import sys
sys.path.append('/opt/.manus/.sandbox-runtime')
from data_api import ApiClient
import json
import os

# APIクライアントの初期化
client = ApiClient()

# 検索キーワードリスト
search_keywords = [
    "美術展 東京",
    "アート展示 神奈川",
    "デザイン展 東京",
    "ファッションイベント 東京",
    "音楽イベント 東京 神奈川",
    "建築展 東京",
    "美術館 新展示",
    "テックイベント 東京"
]

# 結果を保存するディレクトリ
output_dir = "/home/ubuntu/podcast_project/news_collection"

# 各キーワードで検索を実行
for keyword in search_keywords:
    print(f"「{keyword}」で検索中...")
    
    # Twitter検索APIを呼び出し
    try:
        result = client.call_api('Twitter/search_twitter', query={
            'query': keyword,
            'count': 20,
            'type': 'Latest'
        })
        
        # 結果をファイルに保存
        filename = os.path.join(output_dir, f"twitter_{keyword.replace(' ', '_')}.json")
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        
        print(f"結果を {filename} に保存しました")
    except Exception as e:
        print(f"エラーが発生しました: {e}")

print("Twitter検索が完了しました")

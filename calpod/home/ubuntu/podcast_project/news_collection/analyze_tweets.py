import json
import os
import glob
from collections import defaultdict

# 結果を保存するディレクトリ
input_dir = "/home/ubuntu/podcast_project/news_collection"
output_dir = "/home/ubuntu/podcast_project/news_collection"

# 全JSONファイルを取得
json_files = glob.glob(os.path.join(input_dir, "*.json"))

# カテゴリごとのイベント情報を格納する辞書
events_by_category = defaultdict(list)

# 各JSONファイルを処理
for json_file in json_files:
    filename = os.path.basename(json_file)
    print(f"処理中: {filename}")
    
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # タイムラインの指示を取得
        if 'result' in data and 'timeline' in data['result'] and 'instructions' in data['result']['timeline']:
            instructions = data['result']['timeline']['instructions']
            
            for instruction in instructions:
                if 'entries' in instruction:
                    entries = instruction['entries']
                    
                    for entry in entries:
                        if 'content' in entry and 'items' in entry['content']:
                            items = entry['content']['items']
                            
                            for item in items:
                                if 'item' in item and 'itemContent' in item['item']:
                                    item_content = item['item']['itemContent']
                                    
                                    # ツイート内容を抽出
                                    if '__typename' in item_content and item_content['__typename'] == 'TimelineTweet':
                                        if 'tweet_results' in item_content and 'result' in item_content['tweet_results']:
                                            tweet_result = item_content['tweet_results']['result']
                                            
                                            if 'legacy' in tweet_result and 'full_text' in tweet_result['legacy']:
                                                tweet_text = tweet_result['legacy']['full_text']
                                                
                                                # カテゴリを判定
                                                category = "その他"
                                                if "美術" in filename or "アート" in filename:
                                                    category = "美術・アート"
                                                elif "デザイン" in filename:
                                                    category = "デザイン"
                                                elif "ファッション" in filename:
                                                    category = "ファッション"
                                                elif "音楽" in filename:
                                                    category = "音楽"
                                                elif "建築" in filename:
                                                    category = "建築"
                                                elif "テック" in filename or "ミートアップ" in filename:
                                                    category = "テック・ミートアップ"
                                                
                                                # ツイート情報を保存
                                                tweet_info = {
                                                    "text": tweet_text,
                                                    "source": filename
                                                }
                                                
                                                # ユーザー情報があれば追加
                                                if 'core' in tweet_result and 'user_results' in tweet_result['core'] and 'result' in tweet_result['core']['user_results']:
                                                    user_result = tweet_result['core']['user_results']['result']
                                                    if 'legacy' in user_result and 'name' in user_result['legacy']:
                                                        tweet_info["user_name"] = user_result['legacy']['name']
                                                
                                                events_by_category[category].append(tweet_info)
    except Exception as e:
        print(f"ファイル {filename} の処理中にエラーが発生しました: {e}")

# 結果をカテゴリごとにファイルに保存
for category, events in events_by_category.items():
    output_file = os.path.join(output_dir, f"organized_{category.replace('・', '_')}.json")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(events, f, ensure_ascii=False, indent=2)
    print(f"カテゴリ「{category}」の {len(events)} 件のイベント情報を {output_file} に保存しました")

# テキスト形式でも保存
summary_file = os.path.join(output_dir, "events_summary.txt")
with open(summary_file, 'w', encoding='utf-8') as f:
    for category, events in events_by_category.items():
        f.write(f"## {category} ({len(events)}件)\n\n")
        for i, event in enumerate(events[:20], 1):  # 各カテゴリ最大20件まで
            f.write(f"{i}. ")
            if "user_name" in event:
                f.write(f"【{event['user_name']}】 ")
            f.write(f"{event['text']}\n\n")
        f.write("\n" + "-"*50 + "\n\n")

print(f"サマリーを {summary_file} に保存しました")
print("処理が完了しました")

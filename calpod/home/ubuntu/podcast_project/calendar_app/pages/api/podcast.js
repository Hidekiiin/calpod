import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    // ポッドキャスト台本ファイルのパスを指定
    const podcastFilePath = path.join(process.cwd(), 'public', 'podcast_script.md');
    
    // ファイルが存在しない場合はサンプルコンテンツを返す
    if (!fs.existsSync(podcastFilePath)) {
      return res.status(200).json({
        content: `# 今週のアート＆カルチャーポッドキャスト

こんにちは、リスナーの皆さん！「今週末どこ行く？アート＆カルチャーウィークリー」へようこそ。

今週も東京・神奈川エリアの最新アート、デザイン、ファッション、音楽、建築の話題が盛りだくさん！

## 今週のハイライト

### 美術展情報
東京都美術館で開催中の「ミロ展」（3月1日〜7月6日）がおすすめです。

### ファッションイベント
3月17日から22日まで「Rakuten Fashion Week TOKYO 2025 A/W」が開催中です。

### 音楽イベント
コニカミノルタプラネタリアTOKYOで「プラネタリウムコンサート」が開催中です。

## 今週末のおすすめイベント
1. 東京都現代美術館「坂本龍一｜音を視る 時を聴く」展
2. 根津美術館「武家の正統 片桐石州の茶」
3. 「パウル・クレー展」兵庫県立美術館

素敵な週末をお過ごしください！`
      });
    }
    
    // ファイルを読み込んでコンテンツを返す
    const content = fs.readFileSync(podcastFilePath, 'utf8');
    res.status(200).json({ content });
  } catch (error) {
    console.error('Error reading podcast file:', error);
    res.status(500).json({ error: 'Failed to load podcast content' });
  }
}

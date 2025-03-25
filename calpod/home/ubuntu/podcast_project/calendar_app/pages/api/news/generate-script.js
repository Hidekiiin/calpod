// ニュースからポッドキャスト台本を生成するAPIエンドポイント
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { keywords } = req.body;

  if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
    return res.status(400).json({ error: 'キーワードが必要です' });
  }

  try {
    // 各キーワードについてNewsAPIを使ってニュース検索を行う
    const newsResults = await Promise.all(
      keywords.map(async (keyword) => {
        try {
          // NewsAPIを使用してニュースを取得
          const response = await axios.get(
            `https://newsapi.org/v2/everything?q=${encodeURIComponent(keyword) }&language=ja&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`
          );
          
          // 検索結果から必要な情報を抽出
          const articles = response.data.articles || [];
          return {
            keyword,
            articles: articles.slice(0, 3).map(article => ({
              title: article.title,
              source: article.source.name,
              date: new Date(article.publishedAt).toLocaleDateString('ja-JP'),
              snippet: article.description,
              link: article.url
            }))
          };
        } catch (error) {
          console.error(`Error fetching news for keyword ${keyword}:`, error);
          return {
            keyword,
            articles: [],
            error: `${keyword}のニュース取得に失敗しました`
          };
        }
      })
    );

    // ニュース情報を整形
    const newsData = newsResults.reduce((acc, result) => {
      if (result.articles && result.articles.length > 0) {
        acc[result.keyword] = result.articles;
      }
      return acc;
    }, {});

    // ニュースが取得できなかった場合のフォールバック
    if (Object.keys(newsData).length === 0) {
      return res.status(404).json({ error: 'ニュースが見つかりませんでした' });
    }

    // ニュース情報からポッドキャスト台本を生成
    const script = generateScript(newsData);

    res.status(200).json({ script });
  } catch (error) {
    console.error('Error generating podcast script:', error);
    res.status(500).json({ error: 'スクリプト生成中にエラーが発生しました' });
  }
}

// 台本生成関数（既存のコードを使用）
const generateScript = (newsData) => {
  let script = `# 今週のアート＆カルチャーポッドキャスト台本\n\n`;
  script += `## イントロ\n\n`;
  script += `こんにちは、リスナーの皆さん！「今週末どこ行く？アート＆カルチャーウィークリー」へようこそ。私は司会の[ホスト名]です。\n\n`;
  script += `今週も東京・神奈川エリアの最新アート、デザイン、ファッション、音楽、建築の話題が盛りだくさん！最新ニュースをチェックしながら、今週あった出来事と、これから行けるイベントをご紹介します。\n\n`;
  script += `（効果音：新聞をめくる音）\n\n`;
  script += `## 今週のハイライト\n\n`;

  // 各カテゴリのニュースを追加
  Object.entries(newsData).forEach(([category, articles]) => {
    if (articles.length > 0) {
      script += `### ${category}情報\n\n`;
      
      articles.forEach(article => {
        script += `${article.title}（${article.source}、${article.date}）\n`;
        script += `${article.snippet}\n\n`;
        
        // カテゴリに応じたジョークやコメントを追加
        switch(category) {
          case '美術':
            script += `美術展に行くと、私はいつも「これは何を表現しているんだろう？」と考えすぎて頭が痛くなります。でも、それが美術の魅力ですよね！（笑）\n\n`;
            break;
          case 'デザイン':
            script += `デザインって不思議ですよね。「シンプルが一番」と言いながら、結局私の部屋はごちゃごちゃになってしまいます（笑）\n\n`;
            break;
          case 'ファッション':
            script += `ファッションショーを見ると「これ、実際に誰が着るの？」と思うことありませんか？私のジャージルックとは別世界です（笑）\n\n`;
            break;
          case '音楽':
            script += `コンサートで感動して涙が出そうになったとき、隣の人がスマホをいじっていると、ちょっと複雑な気持ちになりますよね（笑）\n\n`;
            break;
          case '建築':
            script += `素敵な建築を見ると「こんな家に住みたい」と思いますが、掃除のことを考えると現実に引き戻されます（笑）\n\n`;
            break;
          default:
            script += `これは見逃せない情報ですね！\n\n`;
        }
      });
    }
  });

  // 以下は既存のコードと同じ
  script += `## 今週末のおすすめイベント\n\n`;
  script += `1. 東京都美術館「ミロ展」（3月1日〜7月6日）\n`;
  script += `2. Rakuten Fashion Week TOKYO 2025 A/W（3月17日〜22日）\n`;
  script += `3. コニカミノルタプラネタリアTOKYO「プラネタリウムコンサート」（1月18日〜3月30日）\n\n`;

  script += `## 編集後記\n\n`;
  script += `今週のポッドキャストはいかがでしたか？最新のニュースから、皆さんの週末をより楽しくするお手伝いができていれば嬉しいです。\n\n`;
  script += `次回も最新のアート、デザイン、ファッション、音楽、建築の情報をお届けします。お楽しみに！\n\n`;
  script += `それでは、素敵な週末をお過ごしください。また来週お会いしましょう！\n\n`;
  script += `（効果音：新聞を閉じる音）`;

  return script;
};



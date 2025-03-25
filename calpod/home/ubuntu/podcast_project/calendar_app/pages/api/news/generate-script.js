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
    // 各キーワードについてニュース検索を行う
    const newsResults = await Promise.all(
      keywords.map(async (keyword) => {
        try {
          // ここでは簡易的な実装としてWeb検索APIを使用
          // 実際の実装では、Google News APIやその他のニュースAPIを使用することを推奨
          const response = await axios.get(
            `https://serpapi.com/search.json?q=${encodeURIComponent(keyword)}&tbm=nws&api_key=${process.env.SERPAPI_KEY || 'demo'}`
          );
          
          // 検索結果から必要な情報を抽出
          const newsItems = response.data.news_results || [];
          return {
            keyword,
            articles: newsItems.slice(0, 3).map(item => ({
              title: item.title,
              source: item.source,
              date: item.date,
              snippet: item.snippet,
              link: item.link
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

    // モックデータを使用（APIキーがない場合や開発環境用）
    const mockNewsData = {
      美術: [
        {
          title: '東京都美術館で「ミロ展」が大盛況',
          source: '芸術新聞',
          date: '2025-03-24',
          snippet: 'スペインの巨匠ジュアン・ミロの作品約100点を集めた「ミロ展」が東京都美術館で開催中。抽象的な形と鮮やかな色彩で知られる作品が多数展示されている。',
          link: 'https://example.com/miro-exhibition'
        },
        {
          title: '現代アート市場、2025年も拡大傾向',
          source: 'アートジャーナル',
          date: '2025-03-22',
          snippet: '世界の現代アート市場は2025年も拡大傾向にあり、特にデジタルアートとNFTの分野で著しい成長が見られる。',
          link: 'https://example.com/art-market-2025'
        }
      ],
      デザイン: [
        {
          title: '「東京デザインウィーク2025」開催決定',
          source: 'デザイン情報',
          date: '2025-03-23',
          snippet: '今年も「東京デザインウィーク」が5月に開催決定。国内外のデザイナーが集結し、最新のデザイントレンドを発信する。',
          link: 'https://example.com/tokyo-design-week-2025'
        }
      ],
      ファッション: [
        {
          title: 'Rakuten Fashion Week TOKYO 2025 A/W開催中',
          source: 'ファッションプレス',
          date: '2025-03-20',
          snippet: '日本人デザイナーが手掛けるトーキョーブランドを中心に、国内外のコレクションが披露されるビッグイベントが開催中。',
          link: 'https://example.com/rakuten-fashion-week-2025'
        },
        {
          title: '渋谷ファッションウィーク、若手デザイナーに注目',
          source: 'トレンドニュース',
          date: '2025-03-15',
          snippet: '渋谷ファッションウィークでは、特に若手デザイナーの斬新なデザインが注目を集めている。',
          link: 'https://example.com/shibuya-fashion-week'
        }
      ],
      音楽: [
        {
          title: 'プラネタリウムコンサート、新プログラム発表',
          source: '音楽ジャーナル',
          date: '2025-03-21',
          snippet: 'コニカミノルタプラネタリアTOKYOで開催中のプラネタリウムコンサートが新プログラムを発表。宇宙をテーマにした音楽体験が好評。',
          link: 'https://example.com/planetarium-concert'
        }
      ],
      建築: [
        {
          title: '隈研吾氏、新たな都市型木造建築プロジェクト発表',
          source: '建築ニュース',
          date: '2025-03-19',
          snippet: '世界的建築家の隈研吾氏が、東京都内で新たな都市型木造建築プロジェクトを発表。環境に配慮した設計が特徴。',
          link: 'https://example.com/kengo-kuma-project'
        },
        {
          title: '「建築の日本展」が国立新美術館で開催',
          source: '文化ニュース',
          date: '2025-03-18',
          snippet: '日本の伝統的建築から現代建築までを網羅した「建築の日本展」が国立新美術館で開催中。',
          link: 'https://example.com/japan-architecture-exhibition'
        }
      ]
    };

    // ニュース情報からポッドキャスト台本を生成
    // 実際の実装では、OpenAI APIなどを使用して自然言語生成を行うことを推奨
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

    // 実際のニュース結果またはモックデータを使用してスクリプトを生成
    const hasRealNewsData = newsResults.some(result => result.articles && result.articles.length > 0);
    const newsData = hasRealNewsData 
      ? newsResults.reduce((acc, result) => {
          if (result.articles && result.articles.length > 0) {
            acc[result.keyword] = result.articles;
          }
          return acc;
        }, {})
      : mockNewsData;

    const script = generateScript(newsData);

    res.status(200).json({ script });
  } catch (error) {
    console.error('Error generating podcast script:', error);
    res.status(500).json({ error: 'スクリプト生成中にエラーが発生しました' });
  }
}

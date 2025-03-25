// カレンダーイベントを取得するAPIエンドポイント
import { google } from 'googleapis';

// OAuth2クライアントの設定
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

export default async function handler(req, res) {
  // 注意: 実際の実装では、セッションやデータベースからトークンを取得する必要があります
  // この例では簡略化のためにリクエストからトークンを取得していますが、本番環境では適切な認証管理が必要です
  const { access_token, refresh_token } = req.cookies || {};
  
  if (!access_token) {
    return res.status(401).json({ error: '認証が必要です' });
  }

  try {
    // トークンをセット
    oauth2Client.setCredentials({
      access_token,
      refresh_token,
    });

    // Google Calendar APIのインスタンスを作成
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    // 現在の日時
    const now = new Date();
    
    // 1週間後の日時
    const oneWeekLater = new Date();
    oneWeekLater.setDate(now.getDate() + 7);
    
    // カレンダーイベントを取得
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: oneWeekLater.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items;
    
    // イベントをフィルタリングして必要な情報だけを返す
    const filteredEvents = events.map(event => ({
      id: event.id,
      summary: event.summary,
      description: event.description,
      location: event.location,
      start: event.start,
      end: event.end,
      htmlLink: event.htmlLink,
    }));

    res.status(200).json({ events: filteredEvents });
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ error: 'Failed to fetch calendar events' });
  }
}

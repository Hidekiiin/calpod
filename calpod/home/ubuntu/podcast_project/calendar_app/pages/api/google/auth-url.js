// Google OAuth認証URLを生成するAPIエンドポイント
import { google } from 'googleapis';

// OAuth2クライアントの設定
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// 必要なスコープを設定
const SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
];

export default function handler(req, res) {
  try {
    // 認証URLを生成
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent',
    });

    res.status(200).json({ url: authUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ error: 'Failed to generate authentication URL' });
  }
}

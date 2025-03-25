// Google認証コールバック処理用のAPIエンドポイント
import { google } from 'googleapis';

// OAuth2クライアントの設定
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: '認証コードがありません' });
  }

  try {
    // 認証コードからトークンを取得
    const { tokens } = await oauth2Client.getToken(code);
    
    // トークンをセットしてクライアントを認証
    oauth2Client.setCredentials(tokens);
    
    // セッションやデータベースにトークンを保存する処理をここに追加
    // 注意: 実際の実装では、セキュアな方法でトークンを保存する必要があります
    
    // 成功ページにリダイレクト
    res.redirect('/auth-success');
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    res.status(500).json({ error: 'Failed to authenticate with Google' });
  }
}

// 生成されたポッドキャスト台本を保存するAPIエンドポイント
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { script } = req.body;

  if (!script) {
    return res.status(400).json({ error: '保存するスクリプトが必要です' });
  }

  try {
    // publicディレクトリにスクリプトを保存
    const filePath = path.join(process.cwd(), 'public', 'podcast_script.md');
    
    // ファイルに書き込み
    fs.writeFileSync(filePath, script, 'utf8');
    
    res.status(200).json({ success: true, message: 'スクリプトが正常に保存されました' });
  } catch (error) {
    console.error('Error saving podcast script:', error);
    res.status(500).json({ error: 'スクリプトの保存中にエラーが発生しました' });
  }
}

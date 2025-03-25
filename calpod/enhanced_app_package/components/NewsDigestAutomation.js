// ニュース自動取得とポッドキャスト生成機能のコンポーネント
import { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, Box, CircularProgress, Alert, Chip, Stack } from '@mui/material';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export default function NewsDigestAutomation() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [keywords, setKeywords] = useState(['美術', 'デザイン', 'ファッション', '音楽', '建築']);
  const [newKeyword, setNewKeyword] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
    setError('');
    setSuccess(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddKeyword = () => {
    if (newKeyword && !keywords.includes(newKeyword)) {
      setKeywords([...keywords, newKeyword]);
      setNewKeyword('');
    }
  };

  const handleDeleteKeyword = (keywordToDelete) => {
    setKeywords(keywords.filter((keyword) => keyword !== keywordToDelete));
  };

  const handleGenerateScript = async () => {
    if (keywords.length === 0) {
      setError('キーワードを入力してください');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const response = await fetch('/api/news/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keywords }),
      });
      
      const data = await response.json();
      
      if (data.script) {
        setGeneratedScript(data.script);
        setSuccess(true);
      } else {
        setError('スクリプト生成に失敗しました');
      }
    } catch (err) {
      setError('エラーが発生しました: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveScript = async () => {
    if (!generatedScript) {
      setError('保存するスクリプトがありません');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/news/save-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ script: generatedScript }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        // 保存成功後にダイアログを閉じる
        setTimeout(() => {
          setOpen(false);
          // ページをリロードして新しいスクリプトを表示
          window.location.reload();
        }, 1500);
      } else {
        setError('スクリプトの保存に失敗しました');
      }
    } catch (err) {
      setError('エラーが発生しました: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button 
        variant="contained" 
        color="secondary" 
        startIcon={<NewspaperIcon />}
        onClick={handleClickOpen}
      >
        ニュースから自動生成
      </Button>
      
      <Dialog 
        open={open} 
        onClose={handleClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>ニュース自動取得とポッドキャスト生成</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            キーワードを入力して、最新のニュースからポッドキャスト台本を自動生成します。
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && !generatedScript && (
            <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
              スクリプトが正常に生成されました。
            </Alert>
          )}
          
          {success && generatedScript && (
            <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
              スクリプトが正常に保存されました。
            </Alert>
          )}
          
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              検索キーワード
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
              {keywords.map((keyword) => (
                <Chip
                  key={keyword}
                  label={keyword}
                  onDelete={() => handleDeleteKeyword(keyword)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Stack>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                label="新しいキーワード"
                variant="outlined"
                size="small"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                sx={{ mr: 1, flexGrow: 1 }}
              />
              <Button 
                variant="contained" 
                onClick={handleAddKeyword}
                disabled={!newKeyword}
              >
                追加
              </Button>
            </Box>
          </Box>
          
          {generatedScript && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                生成されたスクリプト
              </Typography>
              <TextField
                multiline
                fullWidth
                minRows={10}
                maxRows={20}
                value={generatedScript}
                onChange={(e) => setGeneratedScript(e.target.value)}
                variant="outlined"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>閉じる</Button>
          {!generatedScript ? (
            <Button 
              onClick={handleGenerateScript} 
              color="primary" 
              disabled={loading || keywords.length === 0}
              startIcon={loading ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
            >
              スクリプト生成
            </Button>
          ) : (
            <Button 
              onClick={handleSaveScript} 
              color="secondary" 
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              スクリプト保存
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}

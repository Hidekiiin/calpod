// 認証成功ページ
import { useEffect } from 'react';
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useRouter } from 'next/router';

export default function AuthSuccess() {
  const router = useRouter();

  useEffect(() => {
    // 親ウィンドウに認証成功を通知
    if (window.opener) {
      window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS' }, '*');
      // 数秒後にウィンドウを閉じる
      setTimeout(() => {
        window.close();
      }, 3000);
    }
  }, []);

  const handleClose = () => {
    if (window.opener) {
      window.close();
    } else {
      router.push('/');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            認証成功
          </Typography>
          <Typography variant="body1" paragraph>
            Googleカレンダーとの連携が完了しました。
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            このウィンドウは自動的に閉じられます。
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleClose}
            sx={{ mt: 2 }}
          >
            閉じる
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}

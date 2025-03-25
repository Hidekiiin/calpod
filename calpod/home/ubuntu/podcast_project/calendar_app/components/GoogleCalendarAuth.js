// Google Calendar API連携用のコンポーネント
import { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, Box, CircularProgress, Alert } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function GoogleCalendarAuth() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [events, setEvents] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
    setError('');
    setSuccess(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConnect = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Google OAuth認証URLを取得するAPIを呼び出す
      const response = await fetch('/api/google/auth-url');
      const data = await response.json();
      
      if (data.url) {
        // 新しいウィンドウでGoogle認証ページを開く
        window.open(data.url, '_blank', 'width=800,height=600');
        setSuccess(true);
      } else {
        setError('認証URLの取得に失敗しました');
      }
    } catch (err) {
      setError('エラーが発生しました: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCalendarEvents = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/google/calendar-events');
      const data = await response.json();
      
      if (data.events) {
        setEvents(data.events);
        setSuccess(true);
      } else {
        setError('イベントの取得に失敗しました');
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
        color="primary" 
        startIcon={<CalendarMonthIcon />}
        onClick={handleClickOpen}
      >
        Googleカレンダーと連携
      </Button>
      
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Googleカレンダー連携</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Googleカレンダーと連携して、イベント情報を取得します。
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
              認証が完了しました。イベントを取得できます。
            </Alert>
          )}
          
          {events.length > 0 && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="h6">取得したイベント</Typography>
              {events.map((event, index) => (
                <Box key={index} sx={{ mt: 1, p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                  <Typography variant="subtitle1">{event.summary}</Typography>
                  <Typography variant="body2">
                    {new Date(event.start.dateTime || event.start.date).toLocaleString()} 
                    {event.location && ` @ ${event.location}`}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>閉じる</Button>
          <Button 
            onClick={handleConnect} 
            color="primary" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <CalendarMonthIcon />}
          >
            認証する
          </Button>
          {success && (
            <Button 
              onClick={fetchCalendarEvents} 
              color="secondary" 
              disabled={loading}
            >
              イベント取得
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Paper, Grid, Card, CardContent, CardMedia, Divider, CircularProgress } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MicIcon from '@mui/icons-material/Mic';
import EventIcon from '@mui/icons-material/Event';
import GoogleCalendarAuth from '../components/GoogleCalendarAuth';
import NewsDigestAutomation from '../components/NewsDigestAutomation';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [podcastContent, setPodcastContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);

  useEffect(() => {
    // ポッドキャスト内容を取得
    fetch('/api/podcast')
      .then(response => response.json())
      .then(data => {
        setPodcastContent(data.content);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching podcast content:', error);
        setIsLoading(false);
      });
      
    // カレンダーイベントを取得（実装予定）
    // 現在はモックデータを使用
    const mockEvents = [
      { id: 1, title: 'ミロ展', date: '2025-03-29', location: '東京都美術館', category: '美術展' },
      { id: 2, title: 'Rakuten Fashion Week', date: '2025-03-30', location: '渋谷', category: 'ファッション' },
      { id: 3, title: 'プラネタリウムコンサート', date: '2025-03-30', location: 'コニカミノルタプラネタリア', category: '音楽' },
    ];
    setEvents(mockEvents);

    // Google認証成功メッセージのリスナーを設定
    const handleAuthSuccess = (event) => {
      if (event.data && event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        setIsCalendarConnected(true);
        fetchCalendarEvents();
      }
    };

    window.addEventListener('message', handleAuthSuccess);
    
    return () => {
      window.removeEventListener('message', handleAuthSuccess);
    };
  }, []);

  const fetchCalendarEvents = async () => {
    try {
      const response = await fetch('/api/google/calendar-events');
      const data = await response.json();
      
      if (data.events) {
        setCalendarEvents(data.events);
      }
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          アート＆カルチャーウィークリー
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary">
          カレンダーと連携して最新のアート・カルチャー情報をお届け
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4, mb: 6 }}>
          <GoogleCalendarAuth />
          <NewsDigestAutomation />
        </Box>

        <Grid container spacing={4}>
          {/* 今週のポッドキャスト */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MicIcon color="primary" sx={{ fontSize: 30, mr: 1 }} />
                <Typography variant="h5" component="h2">
                  今週のポッドキャスト
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Typography component="div" sx={{ whiteSpace: 'pre-line' }}>
                  {podcastContent}
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* イベント情報 */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EventIcon color="primary" sx={{ fontSize: 30, mr: 1 }} />
                <Typography variant="h5" component="h2">
                  今週末のイベント
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {/* モックイベント */}
              {events.map((event) => (
                <Card key={event.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {event.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      日付: {event.date}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      場所: {event.location}
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      カテゴリ: {event.category}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
              
              {/* Google Calendarイベント */}
              {isCalendarConnected && calendarEvents.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Googleカレンダーのイベント
                  </Typography>
                  {calendarEvents.map((event) => (
                    <Card key={event.id} sx={{ mb: 2, bgcolor: '#f5f5ff' }}>
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {event.summary}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          日時: {new Date(event.start.dateTime || event.start.date).toLocaleString()}
                        </Typography>
                        {event.location && (
                          <Typography variant="body2" color="text.secondary">
                            場所: {event.location}
                          </Typography>
                        )}
                        {event.description && (
                          <Typography variant="body2" color="text.secondary" noWrap>
                            詳細: {event.description}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import {
  Grid, Card, CardContent, Typography,
  Box, TextField, Button, CircularProgress,
  Snackbar, Alert
} from '@mui/material';
import axios from '../axiosInstance';

const CustomerFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [replyTexts, setReplyTexts] = useState({});
  const [editingReplies, setEditingReplies] = useState({}); // track which replies are being edited
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/customer-feedback');
      setFeedback(res.data);
    } catch {
      setError('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onReplyChange = (id, v) => setReplyTexts(prev => ({ ...prev, [id]: v }));

  const sendReply = async (id) => {
    try {
      await axios.put(`/api/customer-feedback/reply/${id}`, { reply: replyTexts[id] });
      setFeedback(prev =>
        prev.map(fb => fb._id === id ? { ...fb, reply: replyTexts[id] } : fb)
      );
      setReplyTexts(prev => ({ ...prev, [id]: '' }));
      setEditingReplies(prev => ({ ...prev, [id]: false }));
      setSnackbar({ open: true, message: 'Reply sent successfully!', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to send reply', severity: 'error' });
    }
  };

  const startEditing = (id, currentReply) => {
    setReplyTexts(prev => ({ ...prev, [id]: currentReply }));
    setEditingReplies(prev => ({ ...prev, [id]: true }));
  };

  const cancelEditing = (id) => {
    setEditingReplies(prev => ({ ...prev, [id]: false }));
    setReplyTexts(prev => ({ ...prev, [id]: '' }));
  };

  const handleCloseSnackbar = (_event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) return <CircularProgress sx={{ m: 4 }} />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5' }}>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: 30 }}>
        <Typography variant="h3" sx={{ mb: 4, fontWeight: 'bold', color: '#333' }}>
                  Customer Feedback 
            </Typography>
        {error && <Typography color="error">{error}</Typography>}

        <Grid container spacing={3}>
          {feedback.map(fb => (
            <Grid item xs={12} md={6} key={fb._id}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                  <Typography fontWeight="bold">{fb.email}</Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {new Date(fb.created).toLocaleString()}
                  </Typography>
                  <Typography mb={2}>{fb.message}</Typography>

                  {fb.reply ? (
                    editingReplies[fb._id] ? (
                      <Box>
                        <TextField
                          label="Edit Reply"
                          fullWidth
                          multiline
                          minRows={2}
                          value={replyTexts[fb._id]}
                          onChange={e => onReplyChange(fb._id, e.target.value)}
                          sx={{ mb: 1 }}
                        />
                        <Button
                          variant="contained"
                          onClick={() => sendReply(fb._id)}
                          disabled={!replyTexts[fb._id]?.trim()}
                          sx={{ mr: 1 }}
                        >
                          Save
                        </Button>
                        <Button variant="outlined" onClick={() => cancelEditing(fb._id)}>
                          Cancel
                        </Button>
                      </Box>
                    ) : (
                      <Box mt={2}>
                        <Typography fontWeight="bold" color="primary">Admin Reply:</Typography>
                        <Typography>{fb.reply}</Typography>
                        <Button
                          size="small"
                          onClick={() => startEditing(fb._id, fb.reply)}
                          sx={{ mt: 1 }}
                        >
                          Edit Reply
                        </Button>
                      </Box>
                    )
                  ) : (
                    <Box>
                      <TextField
                        label="Reply"
                        fullWidth
                        value={replyTexts[fb._id] || ''}
                        onChange={e => onReplyChange(fb._id, e.target.value)}
                        sx={{ mb: 1 }}
                      />
                      <Button
                        variant="contained"
                        onClick={() => sendReply(fb._id)}
                        disabled={!replyTexts[fb._id]?.trim()}
                      >
                        Send
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </main>
    </div>
  );
};

export default CustomerFeedback;

import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import {
  Grid, Card, CardContent, Typography,
  Box, TextField, Button, CircularProgress,
  Snackbar, Alert, Container
} from '@mui/material';
import axios from '../axiosInstance';
import { motion } from 'framer-motion';

const CustomerFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [replyTexts, setReplyTexts] = useState({});
  const [editingReplies, setEditingReplies] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5' }}>
      <Sidebar />

      <Box component="main" sx={{ flexGrow: 1, py: 5, px: { xs: 2, md: 6 } }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h3" fontWeight="bold" sx={{ mb: 4, color: '#2e7d32' }}>
            💬 Customer Feedback
          </Typography>

          {error && <Typography color="error">{error}</Typography>}

          <Grid container spacing={3}>
            {feedback.map((fb, index) => (
              <Grid item xs={12} md={6} key={fb._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2 }}>
                    <CardContent>
                      <Typography fontWeight="bold" color="primary">{fb.email}</Typography>
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
                            <Typography fontWeight="bold" color="secondary">Admin Reply:</Typography>
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
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

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
      </Box>
    </Box>
  );
};

export default CustomerFeedback;

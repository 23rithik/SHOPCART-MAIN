import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import ShopkeeperHeader from './ShopkeeperHeader';
import Footer from './ShopkeeperFooter';
import axiosInstance from '../axiosInstance';

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [replyMap, setReplyMap] = useState({});
  const [isEditing, setIsEditing] = useState({}); // Track which feedback is being edited

  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axiosInstance.get('/api/shopkeeper-feedbacks/minee');
        setFeedbacks(res.data.feedbacks);
        console.log('Fetched feedbacks:', res.data.feedbacks);
      } catch (err) {
        console.error('Error fetching feedbacks:', err);
        showSnackbar('Failed to fetch feedbacks', 'error');
      }
    };

    fetchFeedbacks();
  }, []);

  const showSnackbar = (msg, severity = 'success') => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleReplyChange = (id, value) => {
    setReplyMap((prev) => ({ ...prev, [id]: value }));
  };

  const handleReplySubmit = async (id) => {
    try {
      await axiosInstance.post(`/api/shopkeeper-feedbacks/reply/${id}`, {
        reply: replyMap[id],
      });
      setFeedbacks((prev) =>
        prev.map((fb) =>
          fb._id === id ? { ...fb, reply: replyMap[id] } : fb
        )
      );
      setIsEditing((prev) => ({ ...prev, [id]: false }));
      showSnackbar('Reply sent!');
    } catch (err) {
      console.error('Failed to send reply:', err);
      showSnackbar('Failed to send reply.', 'error');
    }
  };

  const toggleEdit = (id, currentReply) => {
    setReplyMap((prev) => ({ ...prev, [id]: currentReply || '' }));
    setIsEditing((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  return (
    <>
      <ShopkeeperHeader />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mt: 12, px: 4, flex: 1, mb: 8 }}>
          <Typography variant="h4" gutterBottom>
            Manage Feedbacks
          </Typography>

          {feedbacks.length > 0 ? (
            feedbacks.map((fb) => (
              <Paper key={fb._id} sx={{ p: 2, my: 2 }}>
                <Typography><strong>Email:</strong> {fb.email}</Typography>
                <Typography><strong>Message:</strong> {fb.message}</Typography>

                {fb.reply && !isEditing[fb._id] ? (
                  <>
                    <Typography>
                      <strong>Reply:</strong> {fb.reply}
                    </Typography>
                    <Button
                      variant="outlined"
                      sx={{ mt: 1 }}
                      onClick={() => toggleEdit(fb._id, fb.reply)}
                    >
                      Edit Reply
                    </Button>
                  </>
                ) : !fb.reply || isEditing[fb._id] ? (
                  <>
                    <TextField
                      fullWidth
                      label="Write your reply"
                      value={replyMap[fb._id] || ''}
                      onChange={(e) =>
                        handleReplyChange(fb._id, e.target.value)
                      }
                      sx={{ my: 2 }}
                    />
                    <Button
                      variant="contained"
                      onClick={() => handleReplySubmit(fb._id)}
                    >
                      {fb.reply ? 'Update Reply' : 'Send Reply'}
                    </Button>
                    {fb.reply && (
                      <Button
                        variant="text"
                        sx={{ ml: 2 }}
                        onClick={() => toggleEdit(fb._id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </>
                ) : null}
              </Paper>
            ))
          ) : (
            <Typography>No feedbacks yet</Typography>
          )}
        </Box>
        <Footer />
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Feedbacks;

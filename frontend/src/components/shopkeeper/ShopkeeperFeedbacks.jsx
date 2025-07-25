import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
  Container,
} from '@mui/material';
import ShopkeeperHeader from './ShopkeeperHeader';
import Footer from './ShopkeeperFooter';
import axiosInstance from '../axiosInstance';
import { motion } from 'framer-motion';

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [replyMap, setReplyMap] = useState({});
  const [isEditing, setIsEditing] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axiosInstance.get('/api/shopkeeper-feedbacks/minee');
        setFeedbacks(res.data.feedbacks);
      } catch (err) {
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
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#f9f9f9',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Container sx={{ mt: 15, mb: 10, flexGrow: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" fontWeight={600} color="green" gutterBottom>
              💬 Manage Feedbacks
            </Typography>

            {feedbacks.length > 0 ? (
              feedbacks.map((fb) => (
                <motion.div
                  key={fb._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Paper
                    elevation={6}
                    sx={{
                      p: 3,
                      my: 3,
                      borderRadius: 3,
                      backgroundColor: '#fff',
                    }}
                  >
                    <Typography fontWeight="bold">📧 Email: {fb.email}</Typography>
                    <Typography sx={{ mt: 1 }}>📝 Message: {fb.message}</Typography>

                    {fb.reply && !isEditing[fb._id] ? (
                      <>
                        <Typography sx={{ mt: 2 }}>
                          🟢 <strong>Reply:</strong> {fb.reply}
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
                          onChange={(e) => handleReplyChange(fb._id, e.target.value)}
                          sx={{ my: 2 }}
                        />
                        <Box>
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
                        </Box>
                      </>
                    ) : null}
                  </Paper>
                </motion.div>
              ))
            ) : (
              <Typography>No feedbacks yet</Typography>
            )}
          </motion.div>
        </Container>
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

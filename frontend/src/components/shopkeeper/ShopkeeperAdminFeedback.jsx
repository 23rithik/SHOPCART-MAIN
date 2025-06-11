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
import axiosInstance from '../axiosInstance';
import { jwtDecode } from 'jwt-decode';
import ShopkeeperHeader from './ShopkeeperHeader';
import Footer from './ShopkeeperFooter';
import { motion } from 'framer-motion';

const ShopkeeperSendAndViewFeedback = () => {
  const [message, setMessage] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const token = localStorage.getItem('token');
  const decoded = token ? jwtDecode(token) : {};
  const shopkeeperId = decoded.customerId || '';

  const fetchFeedback = async () => {
    try {
      const res = await axiosInstance.get('/api/customer-feedback/myfeedbacks');
      if (Array.isArray(res.data.feedbacks)) {
        setFeedbacks(res.data.feedbacks);
      }
    } catch (err) {
      console.error('Error fetching feedbacks:', err.response?.data || err.message);
      showSnackbar('Failed to fetch feedbacks', 'error');
    }
  };

  const showSnackbar = (msg, severity = 'success') => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      showSnackbar('Please enter a message', 'error');
      return;
    }

    try {
      const payload = {
        email: decoded.email,
        message,
        type: 'shopkeeper',
        shopkeeper_id: shopkeeperId,
      };

      await axiosInstance.post('/api/shopkeeper-feedback', payload);
      showSnackbar('Feedback sent!');
      setMessage('');
      fetchFeedback();
    } catch (err) {
      console.error('Error sending feedback:', err);
      showSnackbar('Failed to send feedback.', 'error');
    }
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <ShopkeeperHeader />

      <Container sx={{ mt: 15, mb: 10, flexGrow: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h4" fontWeight={600} color="green" gutterBottom>
            📝 Send Feedback
          </Typography>

          <Paper elevation={6} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Your Feedback"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </Paper>

          <Typography variant="h5" fontWeight={500} gutterBottom>
            📬 Your Previous Feedbacks
          </Typography>

          {feedbacks.length > 0 ? (
            feedbacks.map((fb, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Paper elevation={4} sx={{ p: 3, mb: 2, borderRadius: 3 }}>
                  <Typography>
                    <strong>Message:</strong> {fb.message}
                  </Typography>
                  <Typography sx={{ mt: 1 }}>
                    <strong>Reply:</strong>{' '}
                    {fb.reply && fb.reply.trim() !== ''
                      ? fb.reply
                      : <em>Waiting for admin reply</em>}
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', mt: 1, color: 'gray' }}>
                    Submitted on: {new Date(fb.created).toLocaleString()}
                  </Typography>
                </Paper>
              </motion.div>
            ))
          ) : (
            <Typography>No feedbacks submitted yet.</Typography>
          )}
        </motion.div>
      </Container>

      <Footer />

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
    </Box>
  );
};

export default ShopkeeperSendAndViewFeedback;

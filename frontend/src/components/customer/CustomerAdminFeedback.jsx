// src/components/CustomerAdminFeedback.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../axiosInstance';
import CustomerHeader from './CustomerHeader';
import CustomerFooter from './CustomerFooter';
import { motion } from 'framer-motion';

const CustomerAdminFeedback = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  const fetchFeedbacks = async (customer_id) => {
    try {
      setFetching(true);
      const res = await axiosInstance.get(`/api/feedbacks/customer/${customer_id}`);
      setFeedbacks(res.data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first.');
        navigate('/login');
        return;
      }

      const decoded = jwtDecode(token);
      const customer_id = decoded.customerId;
      const email = decoded.email;

      setLoading(true);

      const res = await axiosInstance.post('/api/feedbacks/customer', {
        email,
        message,
        type: 'customer',
        customer_id,
      });

      alert('Feedback submitted successfully!');
      setMessage('');
      fetchFeedbacks(customer_id);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      fetchFeedbacks(decoded.customerId);
    }
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      <CustomerHeader />

      <Container sx={{ pt: 15, pb: 10, flexGrow: 1 }}>
        {/* Feedback Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 4,
              maxWidth: 650,
              mx: 'auto',
              mb: 4,
              borderRadius: 3,
              boxShadow: '0px 4px 15px rgba(0,0,0,0.1)',
              backgroundColor: '#ffffff',
            }}
          >
            <Typography variant="h5" fontWeight={600} mb={3} color="green">
              ✍️ Send Feedback to Admin
            </Typography>
            <TextField
              label="Your Feedback"
              multiline
              rows={5}
              fullWidth
              variant="outlined"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!message.trim() || loading}
              fullWidth 
              sx={{ py: 1.5, fontWeight: 'bold' }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Feedback'}
            </Button>
          </Paper>
        </motion.div>

        {/* Feedback History */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 4,
              maxWidth: 650,
              mx: 'auto',
              borderRadius: 3,
              boxShadow: '0px 4px 15px rgba(0,0,0,0.1)',
              backgroundColor: '#ffffff',
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={2} color="green">
              📜 Your Feedback History
            </Typography>

            {fetching ? (
              <Box textAlign="center" py={3}>
                <CircularProgress />
              </Box>
            ) : feedbacks.length === 0 ? (
              <Typography>No feedbacks submitted yet.</Typography>
            ) : (
              <Box sx={{ maxHeight: 350, overflowY: 'auto' }}>
                {feedbacks.map((fb, idx) => (
                  <Box key={idx} sx={{ mb: 3 }}>
                    <Typography variant="body1" fontWeight="bold" color="text.primary">
                      ➤ You:
                    </Typography>
                    <Typography variant="body2" sx={{ ml: 2, mb: 1 }} color="text.secondary">
                      {fb.message}
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" color="text.primary">
                      ➤ Admin Reply:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ ml: 2 }}
                      color={fb.reply ? 'green' : 'text.disabled'}
                    >
                      {fb.reply || '⏳ Waiting for admin reply...'}
                    </Typography>
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </motion.div>
      </Container>

      <CustomerFooter />
    </Box>
  );
};

export default CustomerAdminFeedback;

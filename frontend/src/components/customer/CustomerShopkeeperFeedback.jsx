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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../axiosInstance';
import CustomerHeader from './CustomerHeader';
import CustomerFooter from './CustomerFooter';

const CustomerShopkeeperFeedback = () => {
  const [message, setMessage] = useState('');
  const [shopkeepers, setShopkeepers] = useState([]);
  const [shopkeeperId, setShopkeeperId] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [fetching, setFetching] = useState(true);

  const fetchShopkeepers = async () => {
    const res = await axiosInstance.get('/api/customer-shopkeeper-feedback/shopkeepers');
    setShopkeepers(res.data.shopkeepers);
  };

  const fetchFeedbacks = async (customer_id) => {
    setFetching(true);
    const res = await axiosInstance.get(`/api/customer-shopkeeper-feedback/by-customer/${customer_id}`);
    setFeedbacks(res.data.feedbacks);
    setFetching(false);
  };

  useEffect(() => {
    fetchShopkeepers();
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      fetchFeedbacks(decoded.customerId);
    }
  }, []);

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const customer_id = decoded.customerId;
    const email = decoded.email;

    setLoading(true);
    await axiosInstance.post('/api/customer-shopkeeper-feedback/submit', {
      email,
      message,
      customer_id,
      shopkeeper_id: shopkeeperId,
    });
    setMessage('');
    fetchFeedbacks(customer_id);
    setLoading(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      <CustomerHeader />
      <Container sx={{ pt: 15, pb: 10, flexGrow: 1 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Paper elevation={6} sx={{ p: 4, maxWidth: 700, mx: 'auto', mb: 4, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight={600} mb={2} color="green">
              💬 Send Feedback to Shopkeeper
            </Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Select Shopkeeper</InputLabel>
              <Select
                value={shopkeeperId}
                onChange={(e) => setShopkeeperId(e.target.value)}
                label="Select Shopkeeper"
              >
                {shopkeepers.map((s) => (
                  <MenuItem key={s._id} value={s._id}>
                    {s.shopname} - {s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Your Feedback"
              multiline
              rows={4}
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button
              variant="contained"
              disabled={!message.trim() || !shopkeeperId || loading}
              onClick={handleSubmit}
              fullWidth
              sx={{ py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Feedback'}
            </Button>
          </Paper>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <Paper elevation={6} sx={{ p: 4, maxWidth: 700, mx: 'auto', borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2} color="green">
              📜 Your Feedback History
            </Typography>
            {fetching ? (
              <Box textAlign="center" py={3}><CircularProgress /></Box>
            ) : feedbacks.length === 0 ? (
              <Typography>No feedbacks submitted yet.</Typography>
            ) : (
              <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                {feedbacks.map((fb, idx) => (
                  <Box key={idx} mb={3}>
                    <Typography fontWeight="bold">To: {fb.shopkeeper_id?.shopname} - {fb.shopkeeper_id?.name}</Typography>
                    <Typography variant="body2" sx={{ ml: 2 }}>{fb.message}</Typography>
                    <Typography fontWeight="bold" sx={{ mt: 1 }}>Reply:</Typography>
                    <Typography variant="body2" sx={{ ml: 2 }} color={fb.reply ? 'green' : 'text.disabled'}>
                      {fb.reply || '⏳ Waiting for reply'}
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

export default CustomerShopkeeperFeedback;
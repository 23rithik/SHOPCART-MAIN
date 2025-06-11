import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import {
  Grid, Card, CardContent, Typography, Box,
  Avatar, Button, CircularProgress, TextField
} from '@mui/material';
import axios from '../axiosInstance';
import { motion } from 'framer-motion';

const ShopkeeperManagement = () => {
  const [shopkeepers, setShopkeepers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchShopkeepers = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/shopkeepers');
        setShopkeepers(res.data);
      } catch (err) {
        setError('Error fetching shopkeepers');
      } finally {
        setLoading(false);
      }
    };

    fetchShopkeepers();
  }, []);

  const handleApprove = async (shopkeeperId) => {
    try {
      await axios.put(`/api/shopkeeper-approve-reject/${shopkeeperId}`, { status: 1 });
      setShopkeepers((prev) =>
        prev.map((s) =>
          s._id === shopkeeperId ? { ...s, status: 1 } : s
        )
      );
    } catch {
      setError('Error approving shopkeeper');
    }
  };

  const handleReject = async (shopkeeperId) => {
    try {
      await axios.put(`/api/shopkeeper-approve-reject/${shopkeeperId}`, { status: 2 });
      setShopkeepers((prev) =>
        prev.map((s) =>
          s._id === shopkeeperId ? { ...s, status: 2 } : s
        )
      );
    } catch {
      setError('Error rejecting shopkeeper');
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <CircularProgress size={60} color="primary" />
        </motion.div>
      </Box>
    );
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(to right, #f0f4f8, #ffffff)',
      marginTop: '-8px',
      marginRight: '-8px'
    }}>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: '30px' }}>
        <Typography
          variant="h3"
          sx={{
            mb: 4,
            fontWeight: 'bold',
            color: '#1565c0',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          🧾 Shopkeeper Management Dashboard
        </Typography>

        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

        <Grid container spacing={4}>
          {shopkeepers.map((shopkeeper, index) => {
            const status = shopkeeper.status;
            const statusLabel =
              status === 1 ? 'Approved' :
              status === 2 ? 'Rejected' :
              status === 3 ? 'Deactivated' : 'Pending';
            const statusColor =
              status === 1 ? '#2e7d32' :
              status === 2 ? '#c62828' :
              status === 3 ? '#616161' : '#9e9e9e';
            const statusBg =
              status === 1 ? '#e8f5e9' :
              status === 2 ? '#ffebee' :
              status === 3 ? '#eeeeee' : '#f5f5f5';

            return (
              <Grid item xs={12} md={4} key={shopkeeper._id}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      borderRadius: 4,
                      boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0px 6px 24px rgba(0,0,0,0.15)'
                      },
                      height: 600,
                    }}
                  >
                    <CardContent>
                      <Box display="flex" flexDirection="column">
                        <Box display="flex" flexDirection="column" alignItems="center">
                          <Avatar
                            alt={shopkeeper.name}
                            src="/shopkeeper-icon.png"
                            sx={{ width: 80, height: 80, mb: 2 }}
                          />
                          <Typography variant="h6" gutterBottom>
                            {shopkeeper.name}
                          </Typography>
                        </Box>

                        <Typography sx={{ mb: 0.5, color: '#555', mt: 1 }}>
                          <strong>Shop Name:</strong> {shopkeeper.shopname}
                        </Typography>
                        <Typography sx={{ mb: 0.5, color: '#555' }}>
                          <strong>Email:</strong> {shopkeeper.email}
                        </Typography>
                        <Typography sx={{ mb: 0.5, color: '#555' }}>
                          <strong>Phone:</strong> {shopkeeper.phno}
                        </Typography>

                        <TextField
                          label="Address"
                          value={shopkeeper.address}
                          multiline
                          fullWidth
                          variant="outlined"
                          InputProps={{ readOnly: true }}
                          sx={{
                            mb: 2,
                            mt: 1,
                            '& .MuiInputBase-root': {
                              backgroundColor: '#f9f9f9',
                            },
                            width: 250,
                          }}
                        />

                        <Typography sx={{ mb: 2, color: '#555' }}>
                          <strong>License No:</strong> {shopkeeper.licenseno}
                        </Typography>

                        <Button
                          variant="outlined"
                          href={`http://localhost:5000/uploads/shopkeepers/${shopkeeper.licenseImage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ mb: 2 }}
                        >
                          View License
                        </Button>

                        <Typography
                          sx={{
                            mb: 2,
                            fontWeight: 600,
                            color: statusColor,
                            backgroundColor: statusBg,
                            px: 2,
                            py: 0.5,
                            borderRadius: 2,
                            fontSize: '0.9rem',
                            display: 'inline-block'
                          }}
                        >
                          Status: {statusLabel}
                        </Typography>

                        <Box>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleApprove(shopkeeper._id)}
                            disabled={status === 1 || status === 3}
                            sx={{
                              mr: 1,
                              boxShadow: '0px 2px 6px rgba(0,0,0,0.2)',
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 'bold'
                            }}
                          >
                            Approve
                          </Button>

                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleReject(shopkeeper._id)}
                            disabled={status === 2 || status === 3}
                            sx={{
                              boxShadow: '0px 2px 6px rgba(0,0,0,0.2)',
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 'bold'
                            }}
                          >
                            Reject
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </main>
    </div>
  );
};

export default ShopkeeperManagement;

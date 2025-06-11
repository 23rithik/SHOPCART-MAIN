import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import {
  Grid, Card, CardContent, Typography, Box,
  Avatar, Button, CircularProgress, TextField
} from '@mui/material';
import axios from '../axiosInstance';
import { motion } from 'framer-motion';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/customer');
        setCustomers(res.data);
      } catch (err) {
        setError('Error fetching customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleApprove = async (customerId) => {
    try {
      await axios.put(`/api/approve-reject/${customerId}`, { status: 1 });
      setCustomers((prev) =>
        prev.map((c) =>
          c._id === customerId ? { ...c, status: 1 } : c
        )
      );
    } catch {
      setError('Error approving customer');
    }
  };

  const handleReject = async (customerId) => {
    try {
      await axios.put(`/api/approve-reject/${customerId}`, { status: 2 });
      setCustomers((prev) =>
        prev.map((c) =>
          c._id === customerId ? { ...c, status: 2 } : c
        )
      );
    } catch {
      setError('Error rejecting customer');
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        sx={{ background: 'linear-gradient(to right, #f0f4f8, #ffffff)' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CircularProgress size={70} thickness={4} color="primary" />
          <Typography variant="h6" align="center" mt={2} color="primary">
            Loading Customers...
          </Typography>
        </motion.div>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'linear-gradient(to right, #f0f4f8, #ffffff)',
        marginTop: '-8px',
        marginRight: '-8px'
      }}
    >
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
          🧾 Customer Management Dashboard
        </Typography>

        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

        <Grid container spacing={5}>
          {customers.map((customer) => {
            const status = customer.status;
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
              <Grid item xs={12} md={4} key={customer._id}>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0px 6px 24px rgba(0,0,0,0.15)'
                    },
                    width: 250,
                    height: 500,
                  }}
                >
                  <CardContent>
                    <Box display="flex" flexDirection="column">
                      <Box display="flex" flexDirection="column" alignItems="center">
                        <Avatar
                          alt={customer.name}
                          src={`http://localhost:5000/uploads/profilePics/${customer.profilePic}`}
                          onError={(e) => e.target.src = '/default-profile-pic.jpg'}
                          sx={{ width: 80, height: 80, mb: 2 }}
                        />
                        <Typography variant="h6" gutterBottom>
                          {customer.name}
                        </Typography>
                      </Box>

                      <Typography sx={{ mb: 0.5, color: '#555', mt: 1 }}>
                        <strong>Email:</strong> {customer.email}
                      </Typography>
                      <Typography sx={{ mb: 0.5, color: '#555', mt: 1 }}>
                        <strong>Phone:</strong> {customer.phno}
                      </Typography>

                      <TextField
                        label="Address"
                        value={customer.address}
                        multiline
                        fullWidth
                        variant="outlined"
                        InputProps={{ readOnly: true }}
                        sx={{
                          mb: 2,
                          wordBreak: 'break-word',
                          '& .MuiInputBase-root': {
                            backgroundColor: '#f9f9f9',
                          },
                          mt: 1,
                        }}
                      />

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
                          onClick={() => handleApprove(customer._id)}
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
                          onClick={() => handleReject(customer._id)}
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
              </Grid>
            );
          })}
        </Grid>
      </main>
    </motion.div>
  );
};

export default CustomerManagement;

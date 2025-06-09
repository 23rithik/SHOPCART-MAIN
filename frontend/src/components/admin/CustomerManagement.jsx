import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { Grid, Card, CardContent, Typography, Box, Avatar, Button, CircularProgress } from '@mui/material';
import axios from '../axiosInstance';  // Custom axios instance

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch Customers
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true); // Start loading
      try {
        const res = await axios.get('/api/customer');
        setCustomers(res.data);
      } catch (err) {
        setError('Error fetching customers');
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchCustomers();
  }, []);

  // Handle Approve
  const handleApprove = async (customerId) => {
    try {
      await axios.put(`/api/approve-reject/${customerId}`, { status: 1 });
      setCustomers((prevState) =>
        prevState.map((customer) =>
          customer._id === customerId ? { ...customer, status: 1 } : customer
        )
      );
      setError('');
    } catch (err) {
      setError('Error approving customer');
    }
  };

  // Handle Reject
  const handleReject = async (customerId) => {
    try {
      await axios.put(`/api/approve-reject/${customerId}`, { status: 2 });
      setCustomers((prevState) =>
        prevState.map((customer) =>
          customer._id === customerId ? { ...customer, status: 2 } : customer
        )
      );
      setError('');
    } catch (err) {
      setError('Error rejecting customer');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(to right, #e0e0e0, #f5f5f5)', marginTop: '-8px', marginRight: '-8px', position: 'relative' }}>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: '30px' }}>
        <Typography variant="h3" sx={{ mb: 4, fontWeight: 'bold', color: '#333' }}>
          Customer Management Dashboard
        </Typography>

        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        

        <Grid container spacing={5}>
          {customers.map((customer) => (
            <Grid item xs={12} md={4} key={customer._id}>
              <Card sx={{ borderRadius: '20px', boxShadow: 6, width: '100%',  margin: '0 auto' }}>
                <CardContent>
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <Avatar
                      alt={customer.name}
                      src={`http://localhost:5000/uploads/profilePics/${customer.profilePic}`}
                      onError={(e) => e.target.src = '/default-profile-pic.jpg'}
                      sx={{ width: 80, height: 80, marginBottom: 2 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      {customer.name}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      Email: {customer.email}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Phone: {customer.phno}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Address: {customer.address}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: customer.status === 1 ? 'green' : customer.status === 2 ? 'red' : 'gray' }}>
                      Status: {customer.status === 1 ? 'Approved' : customer.status === 2 ? 'Rejected' : customer.status === 3 ? 'Deactivated' : 'Pending'}
                    </Typography>

                    <Box display="flex" justifyContent="center">
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleApprove(customer._id)}
                        disabled={customer.status === 1 || customer.status === 3}
                        sx={{ mr: 1 }}
                      >
                        Approve
                      </Button>

                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleReject(customer._id)}
                        disabled={customer.status === 2 || customer.status === 3}
                      >
                        Reject
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </main>
    </div>
  );
};

export default CustomerManagement;

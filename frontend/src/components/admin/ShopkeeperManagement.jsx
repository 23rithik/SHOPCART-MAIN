import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { Grid, Card, CardContent, Typography, Box, Avatar, Button, CircularProgress } from '@mui/material';
import axios from '../axiosInstance';  // Custom axios instance

const ShopkeeperManagement = () => {
  const [shopkeepers, setShopkeepers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch Shopkeepers
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

  // Handle Approve
  const handleApprove = async (shopkeeperId) => {
    try {
      await axios.put(`/api/shopkeeper-approve-reject/${shopkeeperId}`, { status: 1 });
      setShopkeepers((prevState) =>
        prevState.map((shopkeeper) =>
          shopkeeper._id === shopkeeperId ? { ...shopkeeper, status: 1 } : shopkeeper
        )
      );
    } catch (err) {
      setError('Error approving shopkeeper');
    }
  };

  // Handle Reject
  const handleReject = async (shopkeeperId) => {
    try {
      await axios.put(`/api/shopkeeper-approve-reject/${shopkeeperId}`, { status: 2 });
      setShopkeepers((prevState) =>
        prevState.map((shopkeeper) =>
          shopkeeper._id === shopkeeperId ? { ...shopkeeper, status: 2 } : shopkeeper
        )
      );
    } catch (err) {
      setError('Error rejecting shopkeeper');
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
          Shopkeeper Management Dashboard
        </Typography>

        {error && <Typography color="error">{error}</Typography>}

        <Grid container spacing={4}>
          {shopkeepers.map((shopkeeper) => (
            <Grid item xs={12} md={4} key={shopkeeper._id}>
              <Card sx={{ borderRadius: '20px', boxShadow: 6 }}>
                <CardContent>
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <Avatar
                      alt={shopkeeper.name}
                      src="/shopkeeper-icon.png" // Placeholder image for shopkeeper
                      sx={{ width: 80, height: 80, marginBottom: 2 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      {shopkeeper.name}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      Shop Name: {shopkeeper.shopname}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Email: {shopkeeper.email}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Phone: {shopkeeper.phno}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Address: {shopkeeper.address}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      License No: {shopkeeper.licenseno}
                    </Typography>

                    {/* License Image */}
                    <Button
                      variant="outlined"
                      href={`http://localhost:5000/uploads/shopkeepers/${shopkeeper.licenseImage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ mb: 2 }}
                    >
                      View License
                    </Button>

                    {/* Status display */}
                    <Typography variant="body2" sx={{ mb: 2, color: shopkeeper.status === 1 ? 'green' : shopkeeper.status === 2 ? 'red' : shopkeeper.status === 3 ? 'gray' : 'gray' }}>
                      Status: {shopkeeper.status === 1 ? 'Approved' : shopkeeper.status === 2 ? 'Rejected' : shopkeeper.status === 3 ? 'Deactivated' : 'Pending'}
                    </Typography>

                    {/* Approve/Reject buttons */}
                    <Box display="flex" justifyContent="center">
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleApprove(shopkeeper._id)}
                        disabled={shopkeeper.status === 1 || shopkeeper.status === 3}
                        sx={{ mr: 1 }}
                      >
                        Approve
                      </Button>

                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleReject(shopkeeper._id)}
                        disabled={shopkeeper.status === 2 || shopkeeper.status === 3}
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

export default ShopkeeperManagement;

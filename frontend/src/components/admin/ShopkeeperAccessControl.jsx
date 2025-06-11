import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import {
  Grid, Card, CardContent, Typography, Box,
  Avatar, Button, CircularProgress, TextField
} from '@mui/material';
import axios from '../axiosInstance';

const ShopkeeperAccessControl = () => {
  const [shopkeepers, setShopkeepers] = useState([]);
  const [loginStatuses, setLoginStatuses] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchShopkeepers = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/shopkeepers/active-or-deactivated');
        setShopkeepers(res.data);

        const statusMap = res.data.reduce((acc, sk) => {
          acc[sk.email] = sk.status ?? 0;
          return acc;
        }, {});
        setLoginStatuses(statusMap);
      } catch (err) {
        setError('Error fetching shopkeepers');
      } finally {
        setLoading(false);
      }
    };
    fetchShopkeepers();
  }, []);

  const handleActivate = async (email) => {
    try {
      await axios.put(`/api/shopkeepers/activate/${email}`);
      setLoginStatuses(prev => ({ ...prev, [email]: 1 }));
    } catch {
      setError('Error activating shopkeeper');
    }
  };

  const handleDeactivate = async (email) => {
    try {
      await axios.put(`/api/shopkeepers/deactivate/${email}`);
      setLoginStatuses(prev => ({ ...prev, [email]: 3 }));
    } catch {
      setError('Error deactivating shopkeeper');
    }
  };

  if (loading) return <CircularProgress sx={{ m: 4 }} />;

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(to right, #f0f4f8, #ffffff)',
      marginTop: '-8px',
      marginRight: '-8px'
    }}>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: 30 }}>
         <Typography
                  variant="h3"
                  sx={{
                    mb: 4,
                    fontWeight: 'bold',
                    color: '#1565c0',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                  }}
                >
                  🔐 Shopkeeper Access Control
                </Typography>

        {error && <Typography color="error">{error}</Typography>}

        <Grid container spacing={4}>
          {shopkeepers.map((sk) => {
            const status = loginStatuses[sk.email];
            const statusLabel =
              status === 1 ? 'Approved' :
              status === 3 ? 'Deactivated' : 'Pending';
            const statusColor =
              status === 1 ? 'green' :
              status === 3 ? 'gray' : 'gray';

            return (
              <Grid item xs={12} md={4} key={sk._id}>
                <Card sx={{
                  borderRadius: 3,
                  boxShadow: 6,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <CardContent>
                    <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                      <Avatar
                        alt={sk.name}
                        src="/shopkeeper-icon.png"
                        sx={{ width: 80, height: 80, mb: 1 }}
                      >
                        {sk.name?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="h6" gutterBottom>
                        {sk.name.charAt(0).toUpperCase() + sk.name.slice(1)}
                      </Typography>
                    </Box>

                    <Typography sx={{ mb: 1 }}><strong>Shop:</strong> {sk.shopname}</Typography>
                    <Typography sx={{ mb: 1 }}><strong>Email:</strong> {sk.email}</Typography>
                    <Typography sx={{ mb: 1 }}><strong>Phone:</strong> {sk.phno}</Typography>

                    <TextField
                      label="Address"
                      value={sk.address}
                      multiline
                      fullWidth
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                      sx={{
                        mb: 2,
                        '& .MuiInputBase-root': {
                          backgroundColor: '#f9f9f9',
                        }
                      }}
                    />

                    <Typography sx={{ mb: 2 }}><strong>License No:</strong> {sk.licenseno}</Typography>

                    <Button
                      variant="outlined"
                      href={`http://localhost:5000/uploads/shopkeepers/${sk.licenseImage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ mb: 2 }}
                    >
                      View License
                    </Button>

                    <Typography sx={{ mb: 2, color: statusColor, fontWeight: 'bold' }}>
                      Status: {statusLabel}
                    </Typography>

                    <Box>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleActivate(sk.email)}
                        disabled={status === 1}
                        sx={{ mr: 1 }}
                      >
                        Activate
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeactivate(sk.email)}
                        disabled={status === 3}
                      >
                        Deactivate
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </main>
    </div>
  );
};

export default ShopkeeperAccessControl;

import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import {
  Grid, Card, CardContent, Typography, Box,
  Avatar, Button, CircularProgress,
  TextField
} from '@mui/material';
import axios from '../axiosInstance';

const CustomerAccessControl = () => {
  const [customers, setCustomers] = useState([]);
  const [loginStatuses, setLoginStatuses] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/customers/active-or-deactivated');
        setCustomers(res.data);

        const statusMap = res.data.reduce((acc, cust) => {
          acc[cust.email] = cust.status ?? 0;
          return acc;
        }, {});
        setLoginStatuses(statusMap);
      } catch (err) {
        setError('Error fetching customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleActivate = async (email) => {
    try {
      await axios.put(`/api/customers/activate/${email}`);
      setLoginStatuses(prev => ({ ...prev, [email]: 1 }));
    } catch {
      setError('Error activating customer');
    }
  };

  const handleDeactivate = async (email) => {
    try {
      await axios.put(`/api/customers/deactivate/${email}`);
      setLoginStatuses(prev => ({ ...prev, [email]: 3 }));
    } catch {
      setError('Error deactivating customer');
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
          🔐 Customer Access Control 
        </Typography>

        {error && <Typography color="error">{error}</Typography>}

        <Grid container spacing={4}>
          {customers.map((cust) => {
            const status = loginStatuses[cust.email];
            if (status !== 1 && status !== 3) return null;

            const statusLabel =
              status === 1 ? 'Approved' :
              status === 3 ? 'Deactivated' : 'Pending';
            const statusColor =
              status === 1 ? '#2e7d32' :
              status === 3 ? '#616161' : '#9e9e9e';
            const statusBg =
              status === 1 ? '#e8f5e9' :
              status === 3 ? '#eeeeee' : '#f5f5f5';

            return (
              <Grid item xs={12} md={4} key={cust._id}>
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
                    <Box display="flex" flexDirection="column" >
                      <Avatar
                          alt={cust.name}
                          src={
                            cust.profilePic
                              ? `http://localhost:5000/uploads/profilePics/${cust.profilePic}`
                              : '/customer-icon.png'
                          }
                          sx={{ width: 80, height: 80, mb: 2 }}
                        />

                      <Typography variant="h6" gutterBottom>{cust.name}</Typography>
                      <Typography sx={{ mb: 0.5, color: '#555', mt:1 }}><strong>Email:</strong> {cust.email}</Typography>
                      <Typography sx={{ mb: 0.5, color: '#555', mt:1 }}><strong>Phone:</strong> {cust.phno}</Typography>
                      <TextField
                          label="Address"
                          value={cust.address}
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
                            mt:1,
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
                          onClick={() => handleActivate(cust.email)}
                          disabled={status === 1}
                          sx={{
                            mr: 1,
                            boxShadow: '0px 2px 6px rgba(0,0,0,0.2)',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 'bold'
                          }}
                        >
                          Activate
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDeactivate(cust.email)}
                          disabled={status === 3}
                          sx={{
                            boxShadow: '0px 2px 6px rgba(0,0,0,0.2)',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 'bold'
                          }}
                        >
                          Deactivate
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
    </div>
  );
};

export default CustomerAccessControl;

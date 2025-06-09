import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import {
  Grid, Card, CardContent, Typography, Box,
  Avatar, Button, CircularProgress
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
        // Change the API endpoint here if needed
        const res = await axios.get('/api/customers/active-or-deactivated');
        setCustomers(res.data);

        // Map email to status for quick lookup
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

  if (loading) return <CircularProgress />;

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      background: 'linear-gradient(to right, #e0e0e0, #f5f5f5)',
      marginTop: '-8px', marginRight: '-8px'
    }}>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: 30 }}>
        <Typography variant="h3" sx={{ mb: 4, fontWeight: 'bold', color: '#333' }}>
          Customer Access Control Dashboard
        </Typography>

        {error && <Typography color="error">{error}</Typography>}

        <Grid container spacing={4}>
          {customers.map((cust) => {
            const status = loginStatuses[cust.email];
            if (status !== 1 && status !== 3) return null; // Show only status 1 or 3

            const statusLabel =
              status === 1 ? 'Approved' :
              status === 3 ? 'Deactivated' : 'Pending';
            const statusColor =
              status === 1 ? 'green' :
              status === 3 ? 'gray' : 'gray';

            return (
              <Grid item xs={12} md={4} key={cust._id}>
                <Card sx={{ borderRadius: 3, boxShadow: 6 }}>
                  <CardContent>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <Avatar
                        alt={cust.name}
                        src={cust.profilePic || '/customer-icon.png'}
                        sx={{ width: 80, height: 80, mb: 2 }}
                      />
                      <Typography variant="h6" gutterBottom>{cust.name}</Typography>
                      <Typography sx={{ mb: 1 }}>Email: {cust.email}</Typography>
                      <Typography sx={{ mb: 1 }}>Phone: {cust.phno}</Typography>
                      <Typography sx={{ mb: 1 }}>Address: {cust.address}</Typography>

                      <Typography sx={{ mb: 2, color: statusColor }}>
                        Status: {statusLabel}
                      </Typography>

                      <Box>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleActivate(cust.email)}
                          disabled={status === 1}
                          sx={{ mr: 1 }}
                        >
                          Activate
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDeactivate(cust.email)}
                          disabled={status === 3}
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

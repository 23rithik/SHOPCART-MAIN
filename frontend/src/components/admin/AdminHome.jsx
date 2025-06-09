import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';
import { Grid, Card, CardContent, Typography, List, ListItem, ListItemText, Box, Avatar, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, IconButton, InputAdornment, Snackbar, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from '../axiosInstance';  // Your custom axios instance

const AdminHome = () => {
  const [activities, setActivities] = useState([]);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [profilePic, setProfilePic] = useState('/images/admin.png');
  
  // Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get('/api/activities');
        setActivities(res.data || []);
      } catch (err) {
        console.error('Error fetching activities', err);
        setActivities([]);
      }
    };
    fetchActivities();
  }, []);

  const totalActivities = activities.length;
  const uniqueUsers = new Set(activities.map(a => a.userEmail)).size;
  const actionCounts = {};
  activities.forEach(a => {
    actionCounts[a.action] = (actionCounts[a.action] || 0) + 1;
  });
  const mostCommonAction = Object.keys(actionCounts).sort((a, b) => actionCounts[b] - actionCounts[a])[0];
  const recentActivities = activities.slice(-5).reverse();

  const handleOpenChangePassword = () => setOpenChangePassword(true);
  const handleCloseChangePassword = () => setOpenChangePassword(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    try {
      const response = await axios.post('/api/change-password', { currentPassword, newPassword });
      
      // Password changed successfully!
      setError('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      handleCloseChangePassword();
      setOpenSnackbar(true);  // Open Snackbar popup
    } catch (err) {
      setError(err.response?.data?.message || 'Error changing password.');
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(to right, #e0e0e0, #f5f5f5)',
      marginTop: '-8px',
      marginRight: '-8px',
      position: 'relative'
    }}>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: '30px' }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h3" sx={{ mb: 4, fontWeight: 'bold', color: '#333' }}>
            Admin Analytics Dashboard
          </Typography>

          {/* Profile Section */}
          <Box
            display="flex"
            alignItems="center"
            sx={{ mb: 4 }}
            position="absolute"
            top={20}
            right={30}
            style={{ cursor: 'pointer' }}
            onClick={handleOpenChangePassword}
          >
            <Avatar
              alt="Admin Profile"
              src={profilePic}
              sx={{
                width: 60,
                height: 60,
                border: '3px solid black',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
              }}
            />
          </Box>

          <Grid container spacing={4}>
            {/* Cards */}
            <Grid item xs={12} md={4}>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <Card sx={{ borderRadius: '20px', boxShadow: 6, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>Total Activities</Typography>
                    <Typography variant="h3">{totalActivities}</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={4}>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <Card sx={{ borderRadius: '20px', boxShadow: 6, background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>Unique Users</Typography>
                    <Typography variant="h3">{uniqueUsers}</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={4}>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <Card sx={{ borderRadius: '20px', boxShadow: 6, background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>Most Common Action</Typography>
                    <Typography variant="h6">{mostCommonAction || 'No Actions Yet'}</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ marginTop: '40px' }}
          >
            <Typography variant="h4" sx={{ mb: 2, color: '#333' }}>
              Recent Activities
            </Typography>

            <Card sx={{ borderRadius: '20px', boxShadow: 6, padding: 2 }}>
              <List>
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`${activity.userEmail} - ${activity.action}`}
                        secondary={new Date(activity.timestamp).toLocaleString()}
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body1" sx={{ padding: 2 }}>
                    No activities recorded yet.
                  </Typography>
                )}
              </List>
            </Card>
          </motion.div>
        </motion.div>
      </main>

      {/* Change Password Dialog */}
      <Dialog open={openChangePassword} onClose={handleCloseChangePassword}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <TextField
              fullWidth
              label="Current Password"
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowCurrentPassword(prev => !prev)}>
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowNewPassword(prev => !prev)}>
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(prev => !prev)}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
          </motion.div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseChangePassword}>Cancel</Button>
          <Button onClick={handleChangePassword}>Change Password</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar popup */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={handleSnackbarClose} variant="filled">
          Password changed successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminHome;

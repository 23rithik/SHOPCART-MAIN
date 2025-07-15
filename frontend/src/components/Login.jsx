import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Paper, IconButton, InputAdornment } from '@mui/material';
import axios from './axiosInstance';  // Import the custom axios instance
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import Navbar from './Navbar';
import Footer from './Footer';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);  // State for password visibility
  const navigate = useNavigate(); // Use useNavigate hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('/api/login', formData);
      const { token, user, type } = res.data;

      // Save token to localStorage
      localStorage.setItem('token', token);

      // Redirect based on user type
      if (type === 'admin') {
        navigate('/adminhome'); // Use navigate to redirect
      } else if (type === 'customer') {
        navigate('/chome');
      } else if (type === 'shopkeeper') {
        navigate('/shome');
      }

    } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);  // Show backend message
        } else {
          setError('Something went wrong. Please try again.');
        }
        console.error(err);
      }
      
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5', marginTop: '-8px', marginBottom: '-8px', marginRight: '-8px', marginLeft: '-8px' }}>
      <Navbar />

      <Box sx={{ flexGrow: 1, py: 20 }}>
        <Container maxWidth="sm">
          <Paper elevation={6} sx={{ p: 4, borderRadius: 4, marginTop: 9 }}>
            <Typography variant="h4" textAlign="center" fontWeight="bold" color="#4CAF50" mb={4}>
              Login
            </Typography>

            {error && <Typography color="error">{error}</Typography>}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{ marginBottom: 2 }}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}  // Toggle password visibility
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                sx={{ marginBottom: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#45a049' } }}
              >
                Login
              </Button>
            </form>
          </Paper>
          <Typography
  variant="body2"
  align="center"
  sx={{
    mt: 4,
    fontSize: '1rem',
    fontWeight: 500,
    color: '#333',
    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
    fontFamily: 'Segoe UI, sans-serif',
  }}
>
  Don’t have an account?
</Typography>

<Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
  <Button
    variant="outlined"
    onClick={() => navigate('/sreg')}
    sx={{
      textTransform: 'none',
      borderColor: '#4CAF50',
      color: '#4CAF50',
      fontWeight: 'bold',
      '&:hover': {
        backgroundColor: '#e8f5e9',
        borderColor: '#45a049',
      },
    }}
  >
    Register as Shopkeeper
  </Button>
  <Button
    variant="outlined"
    onClick={() => navigate('/creg')}
    sx={{
      textTransform: 'none',
      borderColor: '#2196F3',
      color: '#2196F3',
      fontWeight: 'bold',
      '&:hover': {
        backgroundColor: '#e3f2fd',
        borderColor: '#1976d2',
      },
    }}
  >
    Register as Customer
  </Button>
</Box>

        </Container>
      </Box>

      <Footer sx={{ marginTop: 'auto' }} />
    </Box>
  );
};

export default Login;

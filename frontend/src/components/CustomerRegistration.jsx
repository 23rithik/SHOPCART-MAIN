import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Box, Container, Typography, TextField, Button, Grid, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const CustomerRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phno: '',
    address: '',
    profilePic: null,
    password: '',
    confirmPassword: '',
  });
  const [formValid, setFormValid] = useState(false);


  const navigate = useNavigate();

  

useEffect(() => {
  const nameRegex = /^[A-Za-z\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;
  const passwordRegex = /^.{6,}$/;

  const isValid =
    nameRegex.test(formData.name) &&
    emailRegex.test(formData.email) &&
    phoneRegex.test(formData.phno) &&
    formData.address.trim().length >= 5 &&
    formData.profilePic &&
    passwordRegex.test(formData.password) &&
    formData.password === formData.confirmPassword;

  setFormValid(isValid);
}, [formData]);


  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'profilePic') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      let newValue = value;

      if (name === 'name') {
        newValue = newValue.replace(/[^A-Za-z\s]/g, '');
      }
      if (name === 'phno') {
        newValue = newValue.replace(/[^0-9]/g, '');
      }

      setFormData({ ...formData, [name]: newValue });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // REGEX Validations
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const passwordRegex = /^.{6,}$/;

    if (!nameRegex.test(formData.name)) {
      alert('Name should contain only letters and spaces.');
      return;
    }
    if (!emailRegex.test(formData.email)) {
      alert('Invalid email address.');
      return;
    }
    if (!phoneRegex.test(formData.phno)) {
      alert('Phone number must be exactly 10 digits.');
      return;
    }
    if (!passwordRegex.test(formData.password)) {
      alert('Password should be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const res = await axios.post('http://localhost:5000/customer/register', data);
      alert(res.data.message);
      navigate('/success');
    } catch (err) {
      console.error(err);
      alert('Registration failed');
    }
  };

  return (
    <Box 
      sx={{
        backgroundColor: '#f5f5f5', 
        marginTop: '-8px', 
        marginBottom: '-8px', 
        marginRight: '-8px', 
        marginLeft: '-8px',
      }}
    >
      <Navbar />

      <Box sx={{ flexGrow: 1, py: 6 }}>
        <Container maxWidth="sm">
          <Paper elevation={6} sx={{ p: 4, borderRadius: 4, marginTop: 9 }}>
            <Typography variant="h4" textAlign="center" fontWeight="bold" color="#4CAF50" mb={4}>
              Customer Registration
            </Typography>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <Grid container spacing={3}>
                {[
                  { label: 'Name', name: 'name' },
                  { label: 'Email', name: 'email', type: 'email' },
                  { label: 'Phone Number', name: 'phno' },
                ].map((field, idx) => (
                  <Grid item xs={12} key={idx}>
                    <TextField
                      fullWidth
                      label={field.label}
                      name={field.name}
                      type={field.type || 'text'}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    multiline
                    rows={3}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" mb={1}>Upload Profile Picture</Typography>
                  <input
                    type="file"
                    name="profilePic"
                    accept="image/*"
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#45a049' } }}
                  >
                    Register
                  </Button>
                </Grid>
              </Grid>
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
              
              fontFamily: 'Segoe UI, sans-serif',
            }}
          >
            Already registered?{' '}
            <Button
              variant="text"
              onClick={() => navigate('/login')}
              sx={{
                textTransform: 'none',
                color: '#1976d2',
                fontWeight: 'bold',
                fontSize: '1rem',
                padding: 0,
                minWidth: 'unset',
                textDecoration: 'underline',
               
              }}
            >
              Login
            </Button>
          </Typography>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default CustomerRegistration;

import React, { useState, useEffect } from 'react';
import {
  Container, Typography, TextField, Button, Grid, Box, Paper
} from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import ShopkeeperHeader from './ShopkeeperHeader';
import ShopkeeperFooter from './ShopkeeperFooter';
import axiosInstance from '../axiosInstance';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    shopname: '',
    email: '',
    password: '',
    phno: '',
    address: '',
    licenseno: '',
    licenseImage: null,
  });

  const [existingImage, setExistingImage] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const userId = decoded?.customerId;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get(`/api/shopkeeper/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { shopkeeper, login } = res.data;
        setFormData({
          name: shopkeeper.name || '',
          shopname: shopkeeper.shopname || '',
          email: login.email || '',
          password: login.password || '',
          phno: shopkeeper.phno || '',
          address: shopkeeper.address || '',
          licenseno: shopkeeper.licenseno || '',
          licenseImage: null,
        });
        setExistingImage(shopkeeper.licenseImage);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch profile', err);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, userId]);

  const validate = () => {
    const tempErrors = {};
    if (!formData.phno || !/^\d{10}$/.test(formData.phno)) tempErrors.phno = 'Valid 10-digit phone number required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'licenseImage') {
      setFormData({ ...formData, licenseImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = new FormData();
    for (const key in formData) {
      if (formData[key]) data.append(key, formData[key]);
    }
    data.append('oldLicenseImage', existingImage);

    try {
      await axiosInstance.put(`/api/shopkeeper/edit/${userId}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Update failed. Check console for details.');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ShopkeeperHeader />

      <Container maxWidth="md" sx={{ mt: 17, mb: 6, flexGrow: 1,mb: 15   }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom align="center" color="primary">
            Edit Profile
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {[
                ['name', 'Name'],
                ['shopname', 'Shop Name'],
                ['email', 'Email'],
                ['password', 'Password'],
                ['phno', 'Phone Number'],
                ['address', 'Address'],
                ['licenseno', 'License Number'],
              ].map(([key, label]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <TextField
                    fullWidth
                    label={label}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    error={Boolean(errors[key])}
                    helperText={errors[key] || ''}
                    variant="outlined"
                  />
                </Grid>
              ))}

              <Grid item xs={12}>
                <Typography fontWeight="bold">Current License Image:</Typography>
                {existingImage && (
                  <Box mt={1}>
                    <a
                      href={`http://localhost:5000/uploads/shopkeepers/${existingImage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {existingImage}
                    </a>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12}>
                <Button variant="outlined" component="label">
                  Upload New License
                  <input
                    type="file"
                    name="licenseImage"
                    accept=".pdf,.jpg,.png"
                    hidden
                    onChange={handleChange}
                  />
                </Button>
                {formData.licenseImage && (
                  <Typography variant="body2" mt={1}>
                    Selected: {formData.licenseImage.name}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth size="large">
                  Update Profile
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>

      <ShopkeeperFooter />
    </Box>
  );
};

export default EditProfile;

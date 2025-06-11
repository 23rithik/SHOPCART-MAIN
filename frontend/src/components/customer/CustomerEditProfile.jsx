import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Avatar,
  IconButton,
  CircularProgress,
  InputAdornment,
  Snackbar,
} from '@mui/material';
import CustomerHeader from './CustomerHeader';
import CustomerFooter from './CustomerFooter';
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { motion } from 'framer-motion';

const CustomerEditProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phno: '',
    address: '',
    password: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [originalProfilePic, setOriginalProfilePic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/api/customer/profile/edit');
        const { customer, login } = res.data;
        setFormData({
          name: customer.name || '',
          email: login.email || '',
          phno: customer.phno || '',
          address: customer.address || '',
          password: '',
        });

        if (customer.profilePic) {
          const imageUrl = `http://localhost:5000/uploads/profilePics/${customer.profilePic}`;
          setProfilePicPreview(imageUrl);
          setOriginalProfilePic(customer.profilePic);
        }
      } catch (err) {
        // Optional error handling
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const validators = {
    name: /^[A-Za-z\s]{3,50}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phno: /^\d{10,15}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!validators.name.test(value)) return 'Name must be 3-50 letters/spaces only';
        break;
      case 'email':
        if (!validators.email.test(value)) return 'Invalid email format';
        break;
      case 'phno':
        if (value && !validators.phno.test(value)) return 'Phone must be 10-15 digits';
        break;
      case 'password':
        if (value && !validators.password.test(value))
          return 'Password must be 8+ chars with uppercase, lowercase, digit & special char';
        break;
      case 'confirmPassword':
        if (value !== formData.password) return 'Passwords do not match';
        break;
      default:
        break;
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'password' && confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateField('confirmPassword', confirmPassword),
      }));
    }

    const errorMsg = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));
  };

  const handleConfirmPasswordChange = (e) => {
    const val = e.target.value;
    setConfirmPassword(val);

    const errorMsg = validateField('confirmPassword', val);
    setErrors((prev) => ({
      ...prev,
      confirmPassword: errorMsg,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const isFormValid = () => {
    const currentErrors = {};
    if (!formData.name || validateField('name', formData.name))
      currentErrors.name = validateField('name', formData.name);
    if (!formData.email || validateField('email', formData.email))
      currentErrors.email = validateField('email', formData.email);
    if (formData.phno && validateField('phno', formData.phno))
      currentErrors.phno = validateField('phno', formData.phno);

    if (formData.password) {
      if (validateField('password', formData.password))
        currentErrors.password = validateField('password', formData.password);
      if (confirmPassword !== formData.password)
        currentErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setSaving(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phno', formData.phno);
      data.append('address', formData.address);
      if (formData.password) {
        data.append('password', formData.password);
      }
      if (profilePicFile) {
        data.append('profilePic', profilePicFile);
        data.append('oldPic', originalProfilePic);
      }

      await axiosInstance.put('/api/customer/profile/edit', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (profilePicFile) {
        setOriginalProfilePic(profilePicFile.name);
      }

      setSnackbarOpen(true);
    } catch (error) {
      // Optional error handling
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <CircularProgress sx={{ mt: 10, mx: 'auto', display: 'block' }} />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CustomerHeader />
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <Container component="main" maxWidth="sm" sx={{ flexGrow: 1, py: 14 }}>
          <Typography variant="h4" component="h1" mb={3} align="center" color="green">
            Edit Profile
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="profilePic-upload"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="profilePic-upload" style={{ cursor: 'pointer', textAlign: 'center' }}>
                <Avatar
                  src={profilePicPreview || 'https://i.pravatar.cc/150?img=12'}
                  sx={{ width: 120, height: 120, border: '2px solid green', mb: 1, ml: 3 }}
                />
                <Typography variant="body2" color="textSecondary">
                  Click to change profile picture
                </Typography>
              </label>
              {profilePicFile && (
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                  Selected: {profilePicFile.name}
                </Typography>
              )}
            </Box>

            <TextField fullWidth margin="normal" required label="Name" name="name" value={formData.name}
              onChange={handleChange} error={!!errors.name} helperText={errors.name || ''} />
            <TextField fullWidth margin="normal" required label="Email" name="email" type="email"
              value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email || ''} />
            <TextField fullWidth margin="normal" label="Phone Number" name="phno"
              value={formData.phno} onChange={handleChange} error={!!errors.phno} helperText={errors.phno || ''} />
            <TextField fullWidth margin="normal" label="Address" name="address" multiline rows={3}
              value={formData.address} onChange={handleChange} />

            <TextField
              margin="normal"
              fullWidth
              label="New Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              helperText={errors.password || 'Leave blank to keep your current password'}
              error={!!errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              margin="normal"
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword || ''}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onCopy={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
            />

            <Button type="submit" fullWidth variant="contained" color="success" disabled={saving} sx={{ mt: 3, mb: 2 }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Container>
      </motion.div>
      <CustomerFooter />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Profile updated successfully!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default CustomerEditProfile;

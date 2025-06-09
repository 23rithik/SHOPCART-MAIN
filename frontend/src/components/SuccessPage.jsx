import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import Navbar from './Navbar';
import Footer from './Footer';

const SuccessPage = () => {
  const navigate = useNavigate(); // Updated to use useNavigate

  // Navigate back to homepage or shopkeeper login
  const handleGoHome = () => {
    navigate('/'); // Adjust the path if you want to redirect to a specific page
  };

  return (
    <Box sx={{
        backgroundColor: '#f5f5f5', 
        marginTop: '-8px', 
        marginBottom: '-8px', 
        marginRight: '-8px', 
        marginLeft: '-8px',
      }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ py: 30 }}>
        <Typography variant="h4" textAlign="center" fontWeight="bold" color="#4CAF50" mb={4}>
          Registration Successful!
        </Typography>
        
        <Typography variant="h6" textAlign="center" mb={4}>
          Thank you for registering. Your account will be reviewed, and you will be notified once approved.
        </Typography>

        <Box textAlign="center">
          <Button 
            variant="contained" 
            sx={{ backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#45a049' } }} 
            onClick={handleGoHome}
          >
            Go to Home
          </Button>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default SuccessPage;

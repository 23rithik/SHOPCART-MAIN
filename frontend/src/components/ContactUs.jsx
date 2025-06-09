import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
} from '@mui/material';

const ContactUs = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [responseMsg, setResponseMsg] = React.useState('');

  const handleSubmit = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (data.success) {
        setResponseMsg('Message sent successfully!');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setResponseMsg('Failed to send message.');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setResponseMsg('Failed to send message.');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      sx={{
        bgcolor: '#f5f5f5',
        m: '-8px',
      }}
    >
      <Navbar />

      {/* Contact Section */}
      <Box py={8}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 10 }, mt: 4 }}>
          <Typography
            variant="h3"
            textAlign="center"
            fontWeight="bold"
            color="#4CAF50"
            mb={4}
          >
            Contact Us
          </Typography>

          <Grid container spacing={4}>
            {/* Contact Info */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 8px 15px rgba(0,0,0,0.2)',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h5" fontWeight="bold" color="#4CAF50" gutterBottom>
                    Our Contact Information
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>Email:</strong> chithrarithik@gmail.com
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>Phone:</strong> +91 977 870 8103
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>Address:</strong> Kudumbasree Shopcart, 123, Kerala Street, Kollam, Kerala, India
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <strong>Business Hours:</strong> Mon – Fri, 9:00 AM – 6:00 PM
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Map */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  height: '100%',
                  width: '100%',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 8px 15px rgba(0,0,0,0.2)',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h5" fontWeight="bold" color="#4CAF50" gutterBottom>
                    Find Us on the Map
                  </Typography>
                  <iframe
                    title="Kudumbashree Shopcart Location"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=76.9366%2C8.5241%2C76.9466%2C8.5341&layer=mapnik&marker=8.5291%2C76.9416"
                    style={{ border: 0, width: '100%', height: '400px' }}
                    loading="lazy"
                    allowFullScreen
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Professional Contact Form */}
          <Box
            mt={6}
            maxWidth="600px"
            mx="auto"
            px={4}
            py={5}
            sx={{
              bgcolor: '#fff',
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0',
            }}
          >
            <Typography
              variant="h5"
              textAlign="center"
              fontWeight="bold"
              color="#4CAF50"
              mb={4}
            >
              Send Us a Message
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Your Name"
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 3px rgba(76,175,80,0.3)',
                        borderColor: '#4CAF50',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Your Email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 3px rgba(76,175,80,0.3)',
                        borderColor: '#4CAF50',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Your Message"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 3px rgba(76,175,80,0.3)',
                        borderColor: '#4CAF50',
                      },
                    },
                  }}
                />
              </Grid>

              {/* Button directly below message box */}
              <Grid item xs={12} textAlign="center">
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  sx={{
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    px: 4,
                    py: 1.2,
                    borderRadius: '30px',
                    background: 'linear-gradient(45deg,#4CAF50,#81C784)',
                    boxShadow: '0 4px 10px rgba(76,175,80,0.4)',
                    '&:hover': {
                      background: 'linear-gradient(45deg,#81C784,#4CAF50)',
                      boxShadow: '0 6px 14px rgba(76,175,80,0.6)',
                    },
                  }}
                >
                  Send Message
                </Button>
              </Grid>

              {responseMsg && (
                <Grid item xs={12} textAlign="center">
                  <Typography
                    variant="subtitle1"
                    color={responseMsg.includes('successfully') ? 'green' : 'error'}
                    sx={{ fontWeight: 500 }}
                  >
                    {responseMsg}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default ContactUs;

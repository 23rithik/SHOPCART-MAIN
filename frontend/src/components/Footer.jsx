import React from 'react';
import { Box, Typography, Container, Grid, Divider, IconButton } from '@mui/material';
import { LinkedIn, Facebook, Instagram, Twitter } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        backgroundColor: '#f5f5f5',
        color: '#333',
        height: '200px',
        position: 'relative',
        bottom: 0,
        boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.1)',
        paddingTop: '30px',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between" alignItems="center">
          {/* Column 1 - Quick Links */}
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                <a href="/" style={{ color: '#333', textDecoration: 'none' }}>Home</a>
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                <a href="/about" style={{ color: '#333', textDecoration: 'none' }}>About Us</a>
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                <a href="/contact" style={{ color: '#333', textDecoration: 'none' }}>Contact Us</a>
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                <a href="/privacy" style={{ color: '#333', textDecoration: 'none' }}>Privacy Policy</a>
              </Typography>
            </Box>
          </Grid>

          {/* Column 2 - Social Media Icons */}
          <Grid item xs={12} sm={4} sx={{ textAlign: 'center',marginLeft:'-110px' }}>
            <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Connect With Us
            </Typography>
            <Box>
              <IconButton sx={{ color: '#333' }} href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                <LinkedIn />
              </IconButton>
              <IconButton sx={{ color: '#333' }} href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <Facebook />
              </IconButton>
              <IconButton sx={{ color: '#333' }} href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram />
              </IconButton>
              <IconButton sx={{ color: '#333' }} href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter />
              </IconButton>
            </Box>
          </Grid>

          {/* Column 3 - Contact Info */}
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
              Email: <a href="mailto:support@shopcart.in" style={{ color: '#333' }}>support@shopcart.in</a>
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
              Phone: +91 97787 08103
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: '#ccc' }} />

        {/* Bottom Text */}
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
            © {new Date().getFullYear()} Shopcart. Empowering Women through Local Enterprises.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

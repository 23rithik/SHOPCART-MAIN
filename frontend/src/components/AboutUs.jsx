import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';

const AboutUs = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      sx={{
        backgroundColor: '#f5f5f5', // Light gray shade
        marginTop: '-8px',
        marginBottom: '-8px',
        marginRight: '-8px',
        marginLeft: '-8px',
        paddingTop: '64px',
      }}
    >
      <Navbar />

      {/* About Us Section */}
      <Box py={8}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 10 } }}>
          <Typography variant="h3" textAlign="center" fontWeight="bold" color="#4CAF50" mb={4}>
            About Us
          </Typography>
          
          <Typography variant="h6" paragraph>
            Welcome to Kudumbasree Shopcart! We are a community-driven online store that connects local self-help groups in Kerala to consumers who seek premium quality, organic, and homemade products. 
            Our mission is to empower women, promote sustainable livelihoods, and bring the authentic taste of Kerala to your doorstep.
          </Typography>

          <Typography variant="h6" paragraph>
            With a commitment to health, authenticity, and sustainability, we carefully curate our products directly from Kudumbashree units. From homemade snacks to organic rice and spices, every item tells a story of tradition and care. 
            We take pride in offering eco-friendly packaging, fast delivery, and affordable prices. Our goal is to deliver a delightful shopping experience that supports local communities.
          </Typography>

          {/* Team Section */}
          <Typography variant="h5" textAlign="center" fontWeight="bold" color="#4CAF50" mb={4}>
            Meet Our Team
          </Typography>
          
          <Grid container spacing={4} justifyContent="center">
            {[ 
              { name: 'Sita Kumari', role: 'Founder & CEO', img: 'https://media.istockphoto.com/id/1399788030/photo/portrait-of-young-confident-indian-woman-pose-on-background.jpg?s=612x612&w=0&k=20&c=aQw5YhGl99hL1O77thwpQTmqVE7bc8rCX9H0gTeoX_k=' },
              { name: 'Rajesh Nair', role: 'Product Manager', img: 'https://img.freepik.com/premium-photo/banking-joy-indian-employee-smiling-camera_1077802-108017.jpg' },
              { name: 'Anjali Devi', role: 'Marketing Head', img: 'https://thumbs.dreamstime.com/b/portrait-smiling-indian-female-employee-posing-photo-headshot-portrait-smiling-attractive-indian-female-employee-look-147192879.jpg' },
            ].map((member, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    width: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"  // Adjust the height to make images uniform
                    sx={{ 
                      objectFit: 'cover', 
                      borderRadius: '50%', 
                      width: '150px',   // Fixed width for consistency
                      height: '150px',  // Fixed height to ensure equal size
                      margin: '20px auto' 
                    }}
                    image={member.img}
                    alt={member.name}
                  />
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Typography gutterBottom variant="h6" fontWeight="bold">
                      {member.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.role}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default AboutUs;

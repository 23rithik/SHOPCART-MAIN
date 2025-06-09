import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Box, Container, Typography, Grid, Card, CardContent, Button, CardMedia } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import { Link } from 'react-router-dom';

const Homepage = () => {
  const carouselItems = [
    {
      image: 'https://www.pocketmart.org/assets/carouselImages/carousel-1.jpeg'
    },
    {
      image: 'https://t3.ftcdn.net/jpg/06/60/40/50/360_F_660405082_XVQwLo748NvrtKxDBUfWvxa5CqPcg55c.jpg',
      title: 'Fresh Organic Chips',
    },
    {
      image: 'https://www.yummyntasty.com/wp-content/uploads/2016/06/how-to-make-dates-garlic-pickle-1024x683.jpg',
      title: 'Traditional Pickles & Spices',
    },
  ];

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
      }}
    >
      <Navbar />

      {/* Carousel Section */}
      <Carousel
        indicators={true}
        animation="slide"
        navButtonsAlwaysVisible={true}
        sx={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        {carouselItems.map((item, index) => (
          <Box
            key={index}
            sx={{
              height: { xs: 400, md: 600 },
              backgroundImage: `url(${item.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
              position: 'relative',
              transition: 'transform 0.5s ease-out',
              '&:hover': {
                transform: 'scale(1.03)',
              },
            }}
          >
            <Typography variant="h3" fontWeight="bold" textAlign="center">
              {item.title}
            </Typography>
            
            {/* Shop Now Button */}
            <Button
              variant="contained"
              color="secondary"
              sx={{
                position: 'absolute',
                bottom: '20px',
                textTransform: 'none',
                fontSize: '1.2rem',
                padding: '10px 20px',
                borderRadius: '20px',
                background: 'linear-gradient(45deg, #4CAF50, #81C784)', // Green gradient button
                '&:hover': {
                  background: 'linear-gradient(45deg, #81C784, #4CAF50)',
                },
              }}
              component="a"
              href='/login' // Linking to the category or product page
            >
              Shop Now
            </Button>
          </Box>
        ))}
      </Carousel>

      {/* Categories Section */}
      <Box py={8} sx={{ paddingLeft: "50px" }}>
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 10 } }}>
          <Typography variant="h4" textAlign="center" mb={6} fontWeight="bold" color="#4CAF50">
            Explore Our Products
          </Typography>
          <Grid container spacing={4}>
            {[ 
              { title: 'Homemade Snacks', img: 'https://images.immediate.co.uk/production/volatile/sites/30/2022/06/Party-food-recipes-fcfb3af.jpg?quality=90&resize=556,505' },
              { title: 'Organic Rice', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG0rqokgLjQ0uEFEYBW9aH6yYXO8G98HrnLA&s' },
              { title: 'Pickles & Spices', img: 'https://originz.co/uploadfile/images/Varieties%20of%20Pickles.jpg' },
            ].map((product, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                <Card
                  sx={{
                    height: '100%',
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
                    height="240"
                    sx={{ objectFit: 'cover', borderRadius: '10px' }}
                    image={product.img}
                    alt={product.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {product.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Premium quality products directly from Kudumbashree units!
                    </Typography>
                  </CardContent>
                </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

{/* Features Section */}
<Box bgcolor="grey.100" py={8}>
  <Container maxWidth="lg">
    <Typography
      variant="h4"
      align="center"
      fontWeight="bold"
      gutterBottom
      color="#4CAF50"
      paddingBottom={4}
    >
      Why Choose Us?
    </Typography>
    <Box
      display="flex"
      justifyContent="center"
      flexWrap="wrap"
      gap={4}
    >
      {[0, 1, 2].map((col) => (
        <Box key={col} display="flex" flexDirection="column" gap={5}>
          {[
            { title: 'Pure & Authentic', desc: 'Every product is prepared with love and traditional recipes.' },
            { title: 'Empowering Women', desc: 'Supporting self-help groups across Kerala.' },
            { title: 'Healthy & Organic', desc: 'No chemicals, only fresh and natural ingredients.' },
            { title: 'Fast Delivery', desc: 'We ensure timely delivery to your doorstep, every time.' },
            { title: 'Affordable Prices', desc: 'Get premium products at budget-friendly prices.' },
            { title: 'Eco-friendly Packaging', desc: 'We use biodegradable packaging to reduce environmental impact.' },
            // { title: 'Customer Satisfaction', desc: 'Our top priority is ensuring you’re happy with your purchase.' },
            // { title: 'Local Support', desc: 'We support local communities by promoting local craftsmanship.' },
          ]
            .filter((_, i) => Math.floor(i / 3) === col)
            .map((feature, index) => (
              <Card
                key={index}
                sx={{
                  padding: 3,
                  textAlign: 'center',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.desc}
                </Typography>
              </Card>
            ))}
        </Box>
      ))}
    </Box>
  </Container>
</Box>





      <Footer />
    </Box>
  );
};

export default Homepage;

import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import { Avatar, IconButton,Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import ShopkeeperHeader from './ShopkeeperHeader';
import ShopkeeperFooter from './ShopkeeperFooter';
import axiosInstance from '../axiosInstance';


// Sample featured products for the carousel
const featuredProducts = [
  {
    id: 1,
    name: 'Premium Chips',
    image:
      'https://plus.unsplash.com/premium_photo-1663854478810-26b620ade38a?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFuYW5hJTIwY2hpcHN8ZW58MHx8MHx8fDA%3D',
  },
  {
    id: 2,
    name: 'Tapioca Chips',
    image: 'https://cookingfromheart.com/wp-content/uploads/2017/11/Tapioca-Chips-3.jpg',
  },
  {
    id: 3,
    name: 'Spicy Pickle',
    image:
      'https://png.pngtree.com/background/20250112/original/pngtree-mango-pickle-in-glass-bowl-with-spices-on-black-surface-photo-picture-image_12076267.jpg',
  },
];

// Sample news ticker items
const news = [
  'Banana Chips price increased to ₹150/kg',
  'New stock of Organic Rice available now!',
  'Offer: Buy 2 Pickles, Get 1 Free',
];

const ShopkeeperHome = () => {
  const [showContent, setShowContent] = useState(false);
  const [products, setProducts] = useState([]);
  const [shopkeeperName, setShopkeeperName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setShowContent(true), 1200);

    // Fetch products for logged-in shopkeeper
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token'); // adjust if your token storage differs
        const response = await axiosInstance.get('/api/products/mine', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data.products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    axiosInstance
      .get('/api/shopkeeper/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setShopkeeperName(res.data.name))
      .catch((err) => console.error('Error fetching name', err));
    } 
  }, []);

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
  };

  return (
    <div style={{ backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <ShopkeeperHeader />

      {!showContent ? (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-green-600 text-white text-4xl z-50"
          style={{ fontFamily: 'monospace' }}
        >
          Logging in...
        </motion.div>
      ) : (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <Container sx={{ pt: 12, mb: 6 }}>
            <Grid container spacing={4}>
              {/* Welcome Message */}
              <Grid item xs={12}>
                <Box 
                  display="flex" 
                  justifyContent="space-between" 
                  alignItems="center"
                  width="100%"
                >
                  {/* Left Box: Welcome message */}
                  <Box flex={1}>
                    <Typography
                      variant="h4"
                      sx={{
                        color: '#2e7d32',
                        fontWeight: 700,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      Welcome Back, {shopkeeperName.charAt(0).toUpperCase() + shopkeeperName.slice(1)}!
                    </Typography>
                  </Box>

                  {/* Right Box: Avatar button */}
                  <Box sx={{ flexShrink: 0, ml: 95 }}>
                    <Tooltip title="Edit Profile" arrow>
                      <IconButton
                        onClick={() => navigate('/editprofile')}
                        sx={{
                          p: 0,
                          border: '2px solid black',
                          borderRadius: '50%',
                        }}
                      >
                        <Avatar
                          alt="Shopkeeper Avatar"
                          sx={{
                            bgcolor: 'lightgray',
                            width: 45,
                            height: 45,
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Grid>


              {/* Carousel */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    height: { xs: 300, md: 400 },
                    mb: 4,
                  }}
                >
                  <Slider {...carouselSettings}>
                    {featuredProducts.map((product) => (
                      <Box key={product.id} sx={{ px: 0 }}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.8,
                            ease: 'easeInOut',
                          }}
                        >
                          <Card sx={{ borderRadius: 3, boxShadow: 5 }}>
                            <CardMedia
                              component="img"
                              height="350"
                              image={product.image}
                              alt={product.name}
                              sx={{
                                objectFit: 'cover',
                                width: '100%',
                                borderRadius: 2,
                              }}
                            />
                            <CardContent>
                              <Typography variant="h6" align="center">
                                {product.name}
                              </Typography>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Box>
                    ))}
                  </Slider>
                </Box>
              </Grid>

              {/* News Ticker */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    backgroundColor: '#ffffff',
                    px: 23,
                    py: 1.5,
                    borderRadius: 2,
                    boxShadow: 2,
                  }}
                >
                  <marquee
                    behavior="scroll"
                    direction="left"
                    scrollamount="10"
                    style={{ fontSize: '1rem', color: '#2e7d32' }}
                  >
                    {news.join('   ❖   ')}
                  </marquee>
                </Box>
              </Grid>

              {/* Product List (from backend) */}
              {products.length === 0 ? (
                <Typography variant="body1" align="center" sx={{ mt: 4 }}>
                  No products found.
                </Typography>
              ) : (
                products.map((product) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={product._id}
                    sx={{ marginLeft: 6 }}
                  >
                    <motion.div
                      whileHover={{
                        scale: 1.05,
                        rotate: [0, 1, -1, 0],  // multiple keyframes allowed for 'tween' type
                        boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)',
                      }}
                      transition={{ type: 'tween', duration: 0.5 }}
                    >
                      <Card
                        sx={{
                          borderRadius: 4,
                          boxShadow: 3,
                          backgroundColor: '#ffffff',
                          transition: 'transform 0.3s',
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="200"
                          image={`http://localhost:5000/uploads/product_image/${product.image}`}
                          alt={product.name}
                        />
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {product.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            {product.description}
                          </Typography>
                          <Typography variant="body2" color="text.primary">
                            Category: {product.category}
                          </Typography>
                          <Typography variant="body2" color="text.primary">
                            Price: ₹{product.price}
                          </Typography>
                          <Typography variant="body2" color="text.primary">
                            Quantity left: {product.quantity}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))
              )}
            </Grid>
          </Container>
          <ShopkeeperFooter />
        </motion.div>
      )}
    </div>
  );
};

export default ShopkeeperHome;

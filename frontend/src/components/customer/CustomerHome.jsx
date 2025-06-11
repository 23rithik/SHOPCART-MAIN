import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Button,
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
  Stack,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CustomerHeader from './CustomerHeader';
import CustomerFooter from './CustomerFooter';
import axiosInstance from '../axiosInstance';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.2, duration: 1.0 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.5 } },
};

const loadingVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, yoyo: Infinity } },
};

const CustomerHome = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [groupedProducts, setGroupedProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [addingProductId, setAddingProductId] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [profilePic, setProfilePic] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState('');

  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/api/products/grouped');
        setGroupedProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await axiosInstance.get('/api/customer/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfilePic(res.data.profilePic);
        setCustomerName(res.data.name);
      } catch (error) {
        console.error('Failed to fetch profile picture:', error);
      }
    };

    fetchProducts();
    fetchProfile();
  }, []);

  const handleAddToCart = async (product, quantity = 1) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first.');
        navigate('/login');
        return;
      }

      await axiosInstance.post(
        '/api/cart/add',
        {
          productId: product._id,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Product added to cart!');
    } catch (error) {
      console.error('Add to cart error:', error);
      alert(error.response?.data?.message || 'Failed to add product to cart.');
    }
  };

  const handleBuyNow = (product) => {
    navigate(`/productdetails/${product._id}`);
  };

  // Chat message send handler (mocked - replace with your API logic)
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const userMessage = { sender: 'user', text: newMessage.trim() };
    setChatMessages((prev) => [...prev, userMessage]);
    setNewMessage('');

    // Simulate AI assistant reply after 1s
    setTimeout(() => {
      const botReply = {
        sender: 'bot',
        text: "Hi! How can I assist you with your shopping today?",
      };
      setChatMessages((prev) => [...prev, botReply]);
    }, 1000);
  };

  // Filter products by search term
  const filteredData = {};
  Object.keys(groupedProducts).forEach((category) => {
    filteredData[category] = groupedProducts[category].filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      <CustomerHeader />
      <Box sx={{ flexGrow: 1 }}>
        <Container sx={{ pt: 13 }}>
          <AppBar
            position="static"
            color="transparent"
            elevation={1}
            sx={{ mb: 4, backgroundColor: '#e6f4ea', borderRadius: 2 }}
          >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
              <Typography variant="h6" fontWeight={600} color="green">
                Welcome, {customerName ? ` ${capitalizeFirstLetter(customerName)}` : ''}!
              </Typography>
              <IconButton onClick={() => navigate('/ceditprofile')}>
                <Avatar
                  src={
                    profilePic
                      ? `http://localhost:5000/uploads/profilePics/${profilePic}`
                      : 'https://i.pravatar.cc/150?img=12'
                  }
                  sx={{
                    width: 50,
                    height: 50,
                    border: '2px solid rgba(0, 0, 0, 0.7)',
                    boxSizing: 'border-box',
                  }}
                />
              </IconButton>
            </Toolbar>
          </AppBar>

          <Box textAlign="center" mb={4}>
            <TextField
              variant="outlined"
              placeholder="Search products..."
              size="small"
              fullWidth
              sx={{ maxWidth: 500, mt: 2 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: searchTerm ? (
                  <IconButton onClick={() => setSearchTerm('')}>
                    <CloseIcon />
                  </IconButton>
                ) : null,
              }}
            />
          </Box>

          {loading ? (
            <motion.div initial="hidden" animate="visible" variants={loadingVariants}>
              <Typography align="center" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                Loading products...
              </Typography>
            </motion.div>
          ) : (
            <motion.div initial="hidden" animate="visible" variants={containerVariants}>
              {Object.entries(filteredData).map(([category, items]) =>
                items.length > 0 ? (
                  <motion.div key={category} variants={itemVariants}>
                    <Box mb={6}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h5" fontWeight={600} color="green">
                          {capitalizeFirstLetter(category)}
                        </Typography>
                        <Button variant="outlined" onClick={() => navigate('/products')}>
                          View All
                        </Button>
                      </Box>
                      <Grid container spacing={3}>
                        {items.slice(0, 4).map((product) => (
                          <Grid item xs={12} sm={6} md={4} key={product._id}>
                            <motion.div whileHover={{ scale: 1.05 }}>
                              <Card sx={{ height: 400, borderRadius: 4, boxShadow: 3, p: 1 }}>
                                <CardMedia
                                  component="img"
                                  image={`http://localhost:5000/uploads/product_image/${product.image}`}
                                  alt={product.name}
                                  sx={{ height: 180, objectFit: 'cover', borderRadius: 2, cursor: 'pointer' }}
                                  onClick={() => handleBuyNow(product)}
                                />
                                <CardContent>
                                  <Typography variant="h6">{product.name}</Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {product.description}
                                  </Typography>
                                  <Typography variant="body1" fontWeight={600} color="primary" mt={1}>
                                    ₹{product.price}
                                  </Typography>

                                  {addingProductId === product._id ? (
                                    <Stack spacing={1} direction="row" alignItems="center">
                                      <TextField
                                        type="number"
                                        size="small"
                                        label="Qty"
                                        value={quantities[product._id] || 1}
                                        onChange={(e) => {
                                          const val = Math.max(
                                            1,
                                            Math.min(product.quantity, parseInt(e.target.value) || 1)
                                          );
                                          setQuantities((prev) => ({ ...prev, [product._id]: val }));
                                        }}
                                        inputProps={{
                                          min: 1,
                                          max: product.quantity,
                                          style: { width: 60 },
                                        }}
                                      />
                                      <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => {
                                          handleAddToCart(product, quantities[product._id] || 1);
                                          setAddingProductId(null);
                                        }}
                                      >
                                        Confirm
                                      </Button>
                                      <Button size="small" color="error" onClick={() => setAddingProductId(null)}>
                                        Cancel
                                      </Button>
                                    </Stack>
                                  ) : (
                                    <Stack spacing={1} direction="row">
                                      <Button
                                        variant="contained"
                                        color="success"
                                        size="small"
                                        onClick={() => {
                                          setAddingProductId(product._id);
                                          setQuantities((prev) => ({ ...prev, [product._id]: 1 }));
                                        }}
                                      >
                                        Add to cart
                                      </Button>
                                      <Button
                                        variant="outlined"
                                        color="success"
                                        size="small"
                                        onClick={() => handleBuyNow(product)}
                                      >
                                        Buy Now
                                      </Button>
                                    </Stack>
                                  )}
                                </CardContent>
                              </Card>
                            </motion.div>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </motion.div>
                ) : null
              )}
            </motion.div>
          )}
        </Container>
      </Box>

      {/* AI Assistant Button with popping animation */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
        }}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1300,
          borderRadius: '50%',
        }}
      >
        <IconButton
          onClick={() => setChatOpen(!chatOpen)}
          sx={{
            bgcolor: 'green',
            color: 'white',
            '&:hover': { bgcolor: 'darkgreen' },
            width: 56,
            height: 56,
            boxShadow: 3,
          }}
          aria-label="Open AI Assistant Chat"
        >
          <ChatIcon fontSize="large" />
        </IconButton>
      </motion.div>

      {/* Chat box */}
      {chatOpen && (
        <Paper
          elevation={6}
          sx={{
            position: 'fixed',
            bottom: 90,
            right: 24,
            width: 320,
            height: 420,
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            boxShadow: 5,
            zIndex: 1400,
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1,
              bgcolor: 'green',
              color: 'white',
              fontWeight: 'bold',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            AI Assistant
            <IconButton
              onClick={() => setChatOpen(false)}
              sx={{ color: 'white', p: 0.5 }}
              aria-label="Close chat"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              px: 2,
              py: 1,
              overflowY: 'auto',
              bgcolor: '#f5f5f5',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            {chatMessages.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                Start the conversation...
              </Typography>
            )}
            {chatMessages.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  bgcolor: msg.sender === 'user' ? 'green' : 'grey.300',
                  color: msg.sender === 'user' ? 'white' : 'black',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  maxWidth: '80%',
                  wordBreak: 'break-word',
                }}
              >
                {msg.text}
              </Box>
            ))}
          </Box>

          <Box sx={{ p: 1, display: 'flex', gap: 1 }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Type your message..."
              fullWidth
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button variant="contained" color="success" onClick={handleSendMessage}>
              Send
            </Button>
          </Box>
        </Paper>
      )}

      <CustomerFooter />
    </Box>
  );
};

export default CustomerHome;

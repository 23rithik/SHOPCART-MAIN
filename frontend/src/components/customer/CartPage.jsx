import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  CardContent,
  CardMedia,
  Stack,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import CustomerHeader from './CustomerHeader';
import CustomerFooter from './CustomerFooter';
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { motion, AnimatePresence } from 'framer-motion';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Please login to view your cart.');
          navigate('/login');
          return;
        }

        const decoded = jwtDecode(token);
        setCustomerId(decoded.id);

        const res = await axiosInstance.get('/api/cart', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCartItems(res.data);
      } catch (err) {
        console.error('Error fetching cart items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const handleBuyNow = (productId, qty) => {
    navigate(`/checkout/${productId}?qty=${qty}`);
  };

  const handleDeleteClick = (cartItemId) => {
    setDeleteItemId(cartItemId);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.delete(`/api/cart/${deleteItemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems((prev) => prev.filter((item) => item._id !== deleteItemId));
    } catch (error) {
      console.error('Error deleting item from cart:', error);
      alert('Failed to delete item from cart');
    } finally {
      setConfirmOpen(false);
      setDeleteItemId(null);
    }
  };

  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.productId.price * item.quantity;
  }, 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      <CustomerHeader />

      <Box sx={{ flex: 1 }}>
        <Container sx={{ pt: 14, pb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Typography variant="h4" fontWeight={600} mb={4} color="green" textAlign="center">
              My Cart
            </Typography>
          </motion.div>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
              <CircularProgress color="success" size={60} />
            </Box>
          ) : cartItems.length === 0 ? (
            <Typography textAlign="center">Your cart is empty.</Typography>
          ) : (
            <>
              <AnimatePresence>
                {cartItems.map((item) => {
                  const itemTotal = item.productId.price * item.quantity;

                  return (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7, transition: { duration: 0.3 } }}
                      layout
                      style={{
                        marginBottom: '24px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        overflow: 'hidden',
                        backgroundColor: '#fff',
                        display: 'flex',
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={`http://localhost:5000/uploads/product_image/${item.productId.image}`}
                        alt={item.productId.name}
                        sx={{ width: 200, objectFit: 'cover' }}
                      />
                      <CardContent sx={{ flex: 1 }}>
                        <Typography variant="h6">{item.productId.name}</Typography>
                        <Typography variant="body1" color="primary">₹{item.productId.price}</Typography>
                        <Typography variant="body2">Qty: {item.quantity}</Typography>
                        <Typography variant="body2">Total: ₹{itemTotal}</Typography>
                        <Typography variant="body2">Category: {item.productId.category}</Typography>
                        <Typography variant="body2" color="text.secondary">{item.productId.description}</Typography>

                        <Stack direction="row" spacing={2} mt={2}>
                          <Button
                            variant="outlined"
                            color="success"
                            onClick={() => handleBuyNow(item.productId._id, item.quantity)}
                          >
                            Buy Now
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleDeleteClick(item._id)}
                          >
                            Remove
                          </Button>
                        </Stack>
                      </CardContent>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              <Divider sx={{ my: 3 }} />

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Typography variant="h6" fontWeight={600} textAlign="right">
                  Total Price: ₹{totalPrice}
                </Typography>
              </motion.div>
            </>
          )}
        </Container>
      </Box>

      <CustomerFooter />

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Remove Product</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to remove this item from your cart?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CartPage;

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  CardMedia,
  TextField,
  Stack,
  Button,
  Divider,
  Paper,
  CircularProgress,
} from '@mui/material';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import CustomerHeader from './CustomerHeader';
import CustomerFooter from './CustomerFooter';
import { motion } from 'framer-motion';

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Checkout = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [shippingAddress, setShippingAddress] = useState('');

  useEffect(() => {
    const qty = parseInt(searchParams.get('qty')) || 1;
    setQuantity(qty);
  }, [searchParams]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/api/productdetails/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Error fetching product:', err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value) || 1;
    if (product) {
      setQuantity(Math.min(Math.max(1, val), product.quantity));
    }
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress.trim()) {
      alert('Please enter your shipping address.');
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      alert('Failed to load Razorpay SDK. Please try again later.');
      return;
    }

    try {
      const orderRes = await axiosInstance.post('/api/orders/create-order', {
        productId: product._id,
        quantity,
        shippingAddress,
      });

      const { keyId, razorpayOrderId, amount, orderId } = orderRes.data;

      const options = {
        key: keyId,
        amount,
        currency: 'INR',
        name: 'Your Shop Name',
        description: `Purchase of ${product.name}`,
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            await axiosInstance.post('/api/orders/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            });

            alert('Payment successful! Your order has been placed.');
            navigate('/orders');
          } catch (error) {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          email: '',
          contact: '',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Failed to create order. Please try again.');
    }
  };

  if (!product) {
    return (
      <Box
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <CircularProgress size={60} color="success" />
        <Typography mt={2} color="text.secondary">
          Loading checkout details...
        </Typography>
      </Box>
    );
  }

  const remainingStock = product.quantity - quantity;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CustomerHeader />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Container sx={{ pt: 14, pb: 8 }}>
          <Typography
            variant="h4"
            mb={4}
            fontWeight="bold"
            color="green"
            textAlign="center"
            sx={{ textShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}
          >
            Checkout
          </Typography>

          <Paper
            elevation={12}
            sx={{
              maxWidth: 600,
              margin: 'auto',
              padding: 5,
              borderRadius: 4,
              backgroundColor: '#fefefe',
              boxShadow:
                '0 12px 20px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              border: '1px solid #ddd',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Ribbon on top */}
            <Box
              sx={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: 10,
                borderRadius: '4px 4px 0 0',
                background: 'linear-gradient(90deg, #d7e3fc, #a9c0ff)',
                boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
                transform: 'translateZ(10px)',
                zIndex: 10,
              }}
            />

            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              textAlign="center"
              sx={{ mb: 4 }}
            >
              🧾 Billing Summary
            </Typography>

            <Divider sx={{ mb: 4 }} />

            <Stack direction="row" spacing={3} alignItems="center" mb={4}>
              <CardMedia
                component="img"
                image={`http://localhost:5000/uploads/product_image/${product.image}`}
                alt={product.name}
                sx={{
                  width: 110,
                  height: 110,
                  borderRadius: 2,
                  objectFit: 'cover',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                }}
              />
              <Box flexGrow={1}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Category: {product.category}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Price per item: <strong>₹{product.price}</strong>
                </Typography>
              </Box>
            </Stack>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              alignItems="center"
              justifyContent="space-between"
              mb={4}
            >
              <TextField
                label="Quantity"
                type="number"
                size="small"
                value={quantity}
                onChange={handleQuantityChange}
                inputProps={{
                  min: 1,
                  max: product.quantity,
                  style: { width: 100, textAlign: 'center' },
                }}
                sx={{ flexGrow: 1, maxWidth: 120 }}
              />

              <Typography
                variant="body2"
                color={remainingStock <= 0 ? 'error.main' : 'text.secondary'}
              >
                Remaining stock: {remainingStock >= 0 ? remainingStock : 0}
              </Typography>
            </Stack>

            <TextField
              label="Shipping Address"
              multiline
              rows={3}
              fullWidth
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              sx={{ mb: 4 }}
            />

            <Divider sx={{ mb: 4 }} />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 2,
                backgroundColor: '#e0f2ff',
                borderRadius: 2,
                boxShadow: 'inset 0 0 8px #a0d1ff',
                marginBottom: 2,
                fontSize: '1.2rem',
                fontWeight: '700',
                color: '#0a4f8b',
                letterSpacing: '0.05em',
              }}
            >
              <Typography>Total Amount:</Typography>
              <Typography>₹{product.price * quantity}</Typography>
            </Box>

            <Button
              variant="contained"
              color="success"
              fullWidth
              size="large"
              onClick={handlePlaceOrder}
              disabled={product.quantity === 0}
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                boxShadow: '0 5px 15px rgba(0,128,0,0.4)',
                '&:hover': {
                  boxShadow: '0 7px 20px rgba(0,128,0,0.7)',
                },
              }}
            >
              Place Order
            </Button>
          </Paper>
        </Container>
      </motion.div>

      <CustomerFooter />
    </Box>
  );
};

export default Checkout;

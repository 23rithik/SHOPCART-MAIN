import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Container,
  Card,
  CardMedia,
  CardContent,
  Stack,
  TextField,
  Fade,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import CustomerHeader from './CustomerHeader';
import CustomerFooter from './CustomerFooter';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [qtyWarning, setQtyWarning] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/api/productdetails/${id}`);
        setProduct(res.data);
        setLoaded(true);
      } catch (err) {
        console.error('Error fetching product:', err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (product.quantity === 0) return;

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
          quantity: quantity,
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

  const handleBuyNow = () => {
    if (product.quantity === 0) return;
    navigate(`/checkout/${product._id}?qty=${quantity}`);
  };

  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value) || 1;
    if (val > product.quantity) {
      setQtyWarning(`Only ${product.quantity} in stock`);
    } else {
      setQtyWarning('');
    }
    setQuantity(Math.max(1, Math.min(product.quantity, val)));
  };

  if (!product) {
    return (
      <Box p={10}>
        <Typography>Loading product details...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      <CustomerHeader />

      <Container sx={{ pt: 14, pb: 8 }}>
        <Fade in={loaded} timeout={800}>
          <Box>
            <Typography variant="h4" fontWeight={600} mb={4} color="green" textAlign="center">
              Product Details
            </Typography>

            <Button
              variant="outlined"
              color="secondary"
              sx={{ mb: 3 }}
              onClick={() => navigate('/products')}
            >
              ← Back to Products
            </Button>

            <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, boxShadow: 3, borderRadius: 4 }}>
              <CardMedia
                component="img"
                image={`http://localhost:5000/uploads/product_image/${product.image}`}
                alt={product.name}
                sx={{
                  width: { md: 400 },
                  height: 400,
                  objectFit: 'cover',
                  borderRadius: { md: '16px 0 0 16px', xs: '16px 16px 0 0' },
                }}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h4" fontWeight={600} mb={2}>
                  {product.name}
                </Typography>
                <Typography variant="h6" color="primary" gutterBottom>
                  ₹{product.price}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Category:</strong> {product.category}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Available Stock:</strong>{' '}
                  {product.quantity > 0 ? product.quantity : <span style={{ color: 'red' }}>Out of Stock</span>}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {product.description}
                </Typography>

                {product.quantity > 0 && (
                  <>
                    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                      <TextField
                        type="number"
                        size="small"
                        label="Qty"
                        value={quantity}
                        onChange={handleQuantityChange}
                        inputProps={{ min: 1, max: product.quantity, style: { width: 60 } }}
                      />
                      {qtyWarning && <Typography color="error">{qtyWarning}</Typography>}
                    </Stack>

                    <Stack direction="row" spacing={2}>
                      <Button variant="contained" color="success" onClick={handleAddToCart}>
                        Add to Cart
                      </Button>
                      <Button variant="outlined" color="primary" onClick={handleBuyNow}>
                        Buy Now
                      </Button>
                    </Stack>
                  </>
                )}
              </CardContent>
            </Card>
          </Box>
        </Fade>
      </Container>

      <CustomerFooter />
    </Box>
  );
};

export default ProductDetails;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  TextField,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import CustomerHeader from './CustomerHeader';
import CustomerFooter from './CustomerFooter';
import BarChartIcon from '@mui/icons-material/BarChart';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      duration: 1.8,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 1.0,       // slow individual item animation
      ease: 'easeOut',
    }
  },
};

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [addingProductId, setAddingProductId] = useState(null);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get('/api/products/grouped');
        setCategories(Object.keys(res.data));
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = '/api/products';
        if (selectedCategory) {
          url += `?category=${encodeURIComponent(selectedCategory)}`;
        }
        const res = await axiosInstance.get(url);
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch products', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      setAddingProductId(null);
    } catch (error) {
      console.error('Add to cart error:', error);
      alert(error.response?.data?.message || 'Failed to add product to cart.');
    }
  };

  const handleBuyNow = (product) => {
    navigate(`/productdetails/${product._id}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      <CustomerHeader />
      <Box sx={{ flexGrow: 1 }}>
        <Container sx={{ pt: 13, pb: 6 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600} color="green">
          Products
        </Typography>

        <Button
          variant="contained"
          color="success"
          endIcon={<BarChartIcon />}
          onClick={() => navigate('/scores')}
          sx={{
            px: 3,
            py: 1,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: 'none',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            },
          }}
        >
          Product Scores
        </Button>
      </Box>

          {/* Search Input */}
          <TextField
            fullWidth
            size="small"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Category Select */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ marginBottom: 20, padding: 8, fontSize: 16, width: '100%', maxWidth: 300 }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          {loading ? (
            <Typography>Loading products...</Typography>
          ) : filteredProducts.length === 0 ? (
            <Typography>No products found.</Typography>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Grid container spacing={3}>
                {filteredProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product._id}>
                    <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }}>
                      <Card sx={{ height: 420, borderRadius: 4, boxShadow: 3, p: 1 }}>
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
                            <Stack spacing={1} direction="row" alignItems="center" mt={2}>
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
                                inputProps={{ min: 1, max: product.quantity, style: { width: 60 } }}
                              />
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleAddToCart(product, quantities[product._id] || 1)}
                              >
                                Confirm
                              </Button>
                              <Button size="small" color="error" onClick={() => setAddingProductId(null)}>
                                Cancel
                              </Button>
                            </Stack>
                          ) : (
                            <Stack spacing={1} direction="row" mt={2}>
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
            </motion.div>
          )}
        </Container>
      </Box>
      <CustomerFooter />
    </Box>
  );
};

export default AllProducts;

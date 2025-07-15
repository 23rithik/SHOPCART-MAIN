import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Grid, Card, CardMedia, CardContent,
  Typography, Rating, Button, Chip, Pagination, MenuItem, Select
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import CustomerHeader from './CustomerHeader';
import CustomerFooter from './CustomerFooter';
import { useNavigate } from 'react-router-dom';

const Scores = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('score'); // score or price
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchProducts = () => {
    axios.get('http://localhost:5001/api/sentiment/scores')
      .then((res) => {
        const sorted = sortProducts(res.data, sortBy);
        setProducts(sorted);
      })
      .catch((err) => console.error("Failed to fetch scores", err));
  };

  const sortProducts = (data, key) => {
    if (key === 'price') return [...data].sort((a, b) => a.price - b.price);
    return [...data].sort((a, b) => b.score - a.score); // default: score
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setProducts(prev => sortProducts(prev, sortBy));
    setCurrentPage(1);
  }, [sortBy]);

  const getSentimentChip = (score) => {
    if (score >= 80) return <Chip label="Excellent" color="success" size="small" />;
    if (score >= 50) return <Chip label="Average" color="warning" size="small" />;
    return <Chip label="Poor" color="error" size="small" />;
  };

  const pageCount = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const handleBuyNow = (product) => {
    navigate(`/productdetails/${product._id}`);
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <CustomerHeader />
      <Box flex={1} pt={13} px={3} pb={3} bgcolor="#f5f5f5">
        <Typography variant="h4" gutterBottom textAlign="center">
          Product Sentiment Scores
        </Typography>

        {/* 🔄 Refresh & Sort */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
          <Button variant="outlined" onClick={fetchProducts}>
            Refresh Scores
          </Button>
          <Box>
            <Typography variant="subtitle1" component="span" mr={1}>Sort by:</Typography>
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} size="small">
              <MenuItem value="score">Sentiment Score</MenuItem>
              <MenuItem value="price">Price</MenuItem>
            </Select>
          </Box>
        </Box>

        {/* 📊 Recharts - Top 5 Chart */}
        {products.length > 0 && (
  <Box
    mb={4}
    p={3}
    borderRadius={3}
    boxShadow={4}
    bgcolor="#fdfdfd"
    sx={{
      border: '1px solid #e0e0e0',
      overflowX: 'auto', // Enable scroll if needed
      transition: '0.3s',
      '&:hover': { boxShadow: 6 },
    }}
  >
    <Typography variant="h6" textAlign="center" mb={2} fontWeight={600}>
      🔥 Top Product Sentiment Chart
    </Typography>

    <Box minWidth={products.length * 120 + 100}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={products.slice(0, 5)}
          margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
          width={products.length * 120} // 💡 Adjust width dynamically
        >
          <XAxis
            dataKey="name"
            stroke="#333"
            tick={{ fontSize: 13, fontWeight: 500 }}
          />
          <YAxis
            stroke="#333"
            tick={{ fontSize: 12 }}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              borderRadius: '10px',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
            labelStyle={{ fontWeight: 600 }}
            formatter={(value) => [`${value}/100`, 'Score']}
          />
          <Bar
            dataKey="score"
            radius={[8, 8, 0, 0]}
            fill="url(#colorScore)"
            barSize={50}
          />
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#42a5f5" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#66bb6a" stopOpacity={0.8} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  </Box>
)}



        {/* 🧾 Product Grid */}
        <Grid container spacing={3} justifyContent="center">
          {paginatedProducts.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p._id}>
              <Box
  onClick={() => handleBuyNow(p)}
  sx={{
    cursor: 'pointer',
    height: '100%',
  }}
>
  <Card
    sx={{
      height: '100%',
      borderRadius: 3,
      boxShadow: 3,
      transition: 'transform 0.3s',
      '&:hover': { transform: 'scale(1.03)' }
    }}
  >
    <CardMedia
      component="img"
      height="180"
      image={`http://localhost:5000/uploads/product_image/${p.image}`}
      alt={p.name}
    />
    <CardContent>
      <Typography variant="h6">{p.name}</Typography>
      <Typography color="text.secondary">₹{p.price}</Typography>

      <Box display="flex" alignItems="center" mt={1}>
        <Rating value={p.score / 20} precision={0.1} readOnly />
        <Typography ml={1}>({p.score}/100)</Typography>
      </Box>

      <Box mt={1}>{getSentimentChip(p.score)}</Box>

      <Typography variant="body2" color="text.secondary" mt={1}>
        {p.description?.slice(0, 60)}...
      </Typography>
    </CardContent>
  </Card>
</Box>

            </Grid>
          ))}
        </Grid>

        {/* 🔢 Pagination */}
        {pageCount > 1 && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={pageCount}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Box>
      <CustomerFooter />
    </Box>
  );
};

export default Scores;

// ReviewSectionEnhanced.jsx
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Divider, Paper, Stack, Rating,
  Avatar, IconButton, Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../axiosInstance';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ReviewSection = ({ productId }) => {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingReviewText, setEditingReviewText] = useState('');
  const [editingRating, setEditingRating] = useState(0);
  const [hasReviewed, setHasReviewed] = useState(false);


  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  const token = localStorage.getItem('token');
  const userId = token ? jwtDecode(token).customerId : null;

  const showSnackbar = (message) => {
    setSnackMessage(message);
    setSnackOpen(true);
  };

  const handleSnackClose = () => {
    setSnackOpen(false);
  };

  const fetchReviews = async () => {
  try {
    const res = await axiosInstance.get(`/api/reviews/${productId}`);
    const data = res.data || [];
    setReviews(data);

    // Check if current user has reviewed
    const reviewed = data.some((r) => r.customerId === userId);
    setHasReviewed(reviewed);
  } catch (err) {
    console.error(err);
    setReviews([]);
  }
};


  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleReviewSubmit = async () => {
  if (!reviewText.trim()) return showSnackbar('Please enter your review text.');
  if (rating === 0) return showSnackbar('Please provide a rating.');

  try {
    await axiosInstance.post(
      '/api/reviews/add',
      { productId, reviewText, rating },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 🔁 Trigger sentiment scoring
    await axiosInstance.get('/api/products/triggersentiment');

    setReviewText('');
    setRating(0);
    fetchReviews();
  } catch (err) {
    console.error(err);
    showSnackbar('Login required or error adding review');
  }
};


  const handleCommentSubmit = async (reviewId) => {
    const commentText = commentInputs[reviewId]?.trim();
    if (!commentText) return showSnackbar('Please enter a comment.');

    try {
      await axiosInstance.post(
        `/api/reviews/comment/${reviewId}`,
        { commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentInputs((prev) => ({ ...prev, [reviewId]: '' }));
      fetchReviews();
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to add comment');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axiosInstance.delete(`/api/reviews/delete/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEditReview = async (reviewId) => {
    try {
      await axiosInstance.put(
        `/api/reviews/edit/${reviewId}`,
        { reviewText: editingReviewText, rating: editingRating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingReviewId(null);
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (reviewId, commentId) => {
    try {
      await axiosInstance.delete(`/api/reviews/comment/${reviewId}/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box mt={8}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Product Reviews
      </Typography>

      {!hasReviewed ? (
  <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: '#f5f5f5' }}>
    <Typography variant="h6" gutterBottom>Add Your Review</Typography>
    <Stack spacing={2}>
      <Rating
        name="product-rating"
        value={rating}
        onChange={(e, newValue) => setRating(newValue)}
      />
      <TextField
        label="Write your review"
        multiline
        rows={3}
        fullWidth
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      />
      <Button
        variant="contained"
        onClick={handleReviewSubmit}
        disabled={!reviewText.trim() || rating === 0}
      >
        Submit Review
      </Button>
    </Stack>
  </Paper>
) : (
  <Typography sx={{ mb: 3 }} color="text.secondary">
    You have already reviewed this product.
  </Typography>
)}


      <Divider />

      {Array.isArray(reviews) && reviews.length > 0 ? (
        reviews.map((review) => (
          <Paper key={review._id} elevation={2} sx={{ p: 3, mt: 3, borderRadius: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center" mb={1}>
              <Avatar>{review.customerName[0]}</Avatar>
              <Box>
                <Typography fontWeight={600}>{review.customerName}</Typography>
                <Rating value={review.rating} readOnly size="small" />
              </Box>
            </Stack>

            {editingReviewId === review._id ? (
              <>
                <Rating
                  value={editingRating}
                  onChange={(e, newValue) => setEditingRating(newValue)}
                />
                <TextField
                  multiline
                  fullWidth
                  value={editingReviewText}
                  onChange={(e) => setEditingReviewText(e.target.value)}
                />
                <Stack direction="row" spacing={2} mt={1}>
                  <Button
                    variant="contained"
                    onClick={() => handleSaveEditReview(review._id)}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setEditingReviewId(null)}
                  >
                    Cancel
                  </Button>
                </Stack>
              </>
            ) : (
              <>
                <Typography variant="body1">{review.reviewText}</Typography>
                {review.customerId === userId && (
                  <Stack direction="row" spacing={1} mt={1}>
                    <IconButton onClick={() => {
                      setEditingReviewId(review._id);
                      setEditingReviewText(review.reviewText);
                      setEditingRating(review.rating);
                    }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteReview(review._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                )}
              </>
            )}

            <Box ml={4} mt={2}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Comments:
              </Typography>
              {review.comments.map((comment) => (
                <Stack key={comment._id} direction="row" alignItems="center" spacing={1}>
                  <Typography variant="body2">
                    <strong>{comment.commenterName}:</strong> {comment.commentText}
                  </Typography>
                  {comment.commenterId === userId && (
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteComment(review._id, comment._id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Stack>
              ))}
              <Stack direction="row" spacing={1} mt={1} alignItems="center">
                <TextField
                  size="small"
                  placeholder="Write a comment..."
                  value={commentInputs[review._id] || ''}
                  onChange={(e) =>
                    setCommentInputs((prev) => ({ ...prev, [review._id]: e.target.value }))
                  }
                  sx={{ flex: 1 }}
                />
                <IconButton
                  color="primary"
                  onClick={() => handleCommentSubmit(review._id)}
                  disabled={!commentInputs[review._id]?.trim()}
                >
                  <SendIcon />
                </IconButton>
              </Stack>
            </Box>
          </Paper>
        ))
      ) : (
        <Typography color="text.secondary" mt={3}>
          No reviews yet. Be the first to review this product.
        </Typography>
      )}

      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackClose} severity="warning" sx={{ width: '100%' }}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReviewSection;
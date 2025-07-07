const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Customer = require('../models/Customer');
const verifyToken = require('../middleware/auth');

// GET all reviews for a product
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// ADD new review
router.post('/add', verifyToken, async (req, res) => {
  try {
    const { productId, reviewText, rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const customer = await Customer.findById(req.user.customerId);
    // console.log('Customer:', customer);
    const review = new Review({
      productId,
      customerId: customer._id,
      customerName: customer.name,
      reviewText,
      rating,
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add review' });
  }
});

// EDIT review
router.put('/edit/:reviewId', verifyToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review || review.customerId.toString() !== req.user.customerId) {
      return res.status(403).json({ message: 'Not authorized to edit this review' });
    }

    const { reviewText, rating } = req.body;
    review.reviewText = reviewText;
    review.rating = rating;
    await review.save();

    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Error updating review' });
  }
});

// DELETE review
router.delete('/delete/:reviewId', verifyToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review || review.customerId.toString() !== req.user.customerId) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting review' });
  }
});

// ADD comment
router.post('/comment/:reviewId', verifyToken, async (req, res) => {
  try {
    const { commentText } = req.body;

    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    review.comments.push({
      commenterId: req.customerId,
      commenterName: req.customerName,
      commentText,
    });

    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add comment' });
  }
});

// DELETE comment
router.delete('/comment/:reviewId/:commentId', verifyToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    console.log('Review:', review);
    const commentIndex = review.comments.findIndex(
      (c) => c._id.toString() === req.params.commentId && c.commenterId.toString() === req.user.customerId
    );

    if (commentIndex === -1) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    review.comments.splice(commentIndex, 1);
    await review.save();

    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting comment' });
  }
});

module.exports = router;

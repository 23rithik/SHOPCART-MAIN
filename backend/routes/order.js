// routes/order.js
const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const verifyToken = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');
const nodemailer = require('nodemailer');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order & razorpay order
router.post('/create-order', verifyToken, async (req, res) => {
  try {
    const { productId, quantity, shippingAddress } = req.body;
    const customerId = req.user.customerId;

    // Fetch product details and check stock
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.quantity < quantity)
      return res.status(400).json({ message: 'Insufficient product stock' });

    // Amount calculations
    const amountInRupees = product.price * quantity; // For DB storage
    const amountInPaise = amountInRupees * 100;      // For Razorpay API (smallest currency unit)

    // Create Razorpay order
    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save order in DB with amount in rupees, paymentStatus pending, shippingStatus "ordered"
    const order = new Order({
      customerId,
      productId,
      quantity,
      amount: amountInRupees,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: 'pending',
      shippingStatus: 'ordered',
      shippingAddress,
    });

    await order.save();

    res.json({
      keyId: process.env.RAZORPAY_KEY_ID,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,   // still send paise to frontend for Razorpay checkout
      orderId: order._id,
    });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ message: 'Server error while creating order' });
  }
});

// Verify payment and update order, reduce stock
router.post('/verify-payment', verifyToken, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // Validate signature
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature)
      return res.status(400).json({ message: 'Invalid payment signature' });

    // Update order payment info and status
    const order = await Order.findById(orderId).populate('productId');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.paymentStatus = 'paid';
    await order.save();

    // Decrement product stock
    const product = await Product.findById(order.productId._id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.quantity = product.quantity - order.quantity;
    if (product.quantity < 0) product.quantity = 0;
    await product.save();

    // ✅ Send confirmation email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.user.email, // email from JWT token, ensure it's present in token
      subject: 'Order Confirmation - ShopCart',
      html: `
        <h2>Thank you for your purchase!</h2>
        <p>Your order has been successfully placed.</p>
        <p><strong>Product:</strong> ${order.productId.name}</p>
        <p><strong>Quantity:</strong> ${order.quantity}</p>
        <p><strong>Total Amount:</strong> ₹${order.amount}</p>
        <p><strong>Shipping Address:</strong> ${order.shippingAddress}</p>
        <p>We will notify you when your order is shipped.</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email sending error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.json({ message: 'Payment verified, order updated, email sent' });
  } catch (err) {
    console.error('Verify payment error:', err);
    res.status(500).json({ message: 'Server error during payment verification' });
  }
});


module.exports = router;

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const verifyToken = require('../middleware/auth');
const Activity = require('../models/Activity');
const Shopkeeper = require('../models/Shopkeeper');


const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/product_image/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ✅ Add Product
router.post('/add', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { name, price, quantity, description, category } = req.body;

    if (!name || !price || !quantity || !description || !category || !req.file) {
      return res.status(400).json({ message: 'All fields including image and category are required.' });
    }

    const newProduct = new Product({
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      description,
      category,
      image: req.file.filename,
      shopkeeper_id: req.user.customerId
    });

    await newProduct.save();

    const shopkeeper = await Shopkeeper.findById(req.user.customerId);
    if (shopkeeper) {
      await Activity.create({
        userEmail: shopkeeper.email,
        action: `Shopkeeper ${shopkeeper.name} added a new product "${name}"`,
      });
    }

    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ View My Products
router.get('/mine', verifyToken, async (req, res) => {
  try {
    const products = await Product.find({ shopkeeper_id: req.user.customerId });
    res.json({ products });
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Delete Product by ID
router.delete('/delete/:id', verifyToken, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      shopkeeper_id: req.user.customerId
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }

    // ✅ Add activity with shopkeeper name
    const shopkeeper = await Shopkeeper.findById(req.user.customerId);
    if (shopkeeper) {
      await Activity.create({
        userEmail: shopkeeper.email,
        action: `Shopkeeper ${shopkeeper.name} deleted product "${product.name}"`,
      });
    }


    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Update Product
router.put('/update/:id', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findOne({
      _id: productId,
      shopkeeper_id: req.user.customerId,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found or unauthorized' });
    }
        const oldName = product.name;


    // Update fields if provided
    product.name = req.body.name || product.name;
    product.price = req.body.price ? parseFloat(req.body.price) : product.price;
    product.quantity = req.body.quantity ? parseInt(req.body.quantity) : product.quantity;
    product.description = req.body.description || product.description;
    product.category = req.body.category || product.category;

    // If new image uploaded, delete old image
    if (req.file) {
      const oldImagePath = path.join(__dirname, '..', 'uploads', 'product_image', product.image);
      if (product.image) {
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Failed to delete old image:', err);
        });
      }
      product.image = req.file.filename;
    }

    await product.save();

    // ✅ Add activity with shopkeeper name
    const shopkeeper = await Shopkeeper.findById(req.user.customerId);
    if (shopkeeper) {
      await Activity.create({
        userEmail: shopkeeper.email,
        action: `Shopkeeper ${shopkeeper.name} updated product "${oldName}"`,
      });
    }
    res.json({ message: 'Product updated successfully', product });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

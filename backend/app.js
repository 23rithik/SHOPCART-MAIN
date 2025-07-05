const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
require('./db/mongodb'); // Ensure this connects to MongoDB correctly
const cors = require('cors');
const path = require('path');

const PORT = process.env.PORT || 3000;
const app = express();

const shopkeeperRoute = require('./routes/shopkeeper');
const customerRoutes = require('./routes/customer');
const authRoutes = require('./routes/authRoutes');
const activitiesRoute = require('./routes/activitiesRoute');
const changePasswordRoute = require('./routes/changePasswordRoute'); // import
const customermanage = require('./routes/customerRoutes'); // import customer routes
const shopkeeperRoutes = require('./routes/shopkeeperRoutes');
const shopkeeperActivity = require('./routes/shopkeeper_activity'); // import shopkeeper activity routes
const customeractivityRoutes = require('./routes/customer_activity');
const customerFeedbackRoutes   = require('./routes/customer_feedback');
const shopkeeperFeedbackRoutes = require('./routes/shopkeeper_feedback');
const contactRoutes = require('./routes/contact');
const productRoutes = require('./routes/product');
const feedbackShopkeeperRoute = require('./routes/feedbackShopkeeperRoute');
const shopkeeperhome= require('./routes/ShopkeeperHomepage'); // import shopkeeper home routes
const shopkeepereditprofile = require('./routes/ShopkeeperEditProfile'); // import shopkeeper edit profile routes
const customerhomeProducts = require('./routes/CustomerhomeProducts'); // import customer home products routes
const cartRoutes = require('./routes/cart'); // import cart routes
const customerprofileRoutes = require('./routes/customerProfile'); // import customer profile routes
const customerEditProfileRoutes = require('./routes/customerEditProfile'); // import customer edit profile routes
const productdetailsRoutes = require('./routes/productdetails'); // import product details routes
const orderRoutes = require('./routes/order'); // import order routes
const ordersStatusRoutes = require('./routes/orderStatus'); // import order status routes
const customeradminfeedback=require('./routes/CustomerAdminFeedback'); // import customer admin feedback routes
const shopkeeperOrderRoutes = require('./routes/shopkeeperOrders');
const aiChatRoutes = require('./routes/aiChat'); // import AI chat routes

// const shopkeeperActivity = require('./routes/shopkeeperActivity'); // import shopkeeper activity routes

// Middleware
app.use(express.json()); // Global JSON parsing middleware
app.use(morgan('dev'));
app.use(cors());

// Routes
app.use('/shopkeeper', shopkeeperRoute);
app.use('/customer', customerRoutes);
app.use('/api', authRoutes);
app.use('/api', activitiesRoute);
app.use('/api', changePasswordRoute);
app.use('/api', customermanage);
app.use('/api', shopkeeperRoutes);
app.use('/api', shopkeeperActivity); // Use the shopkeeper activity routes
app.use('/api/customers', customeractivityRoutes);
app.use('/api/customer-feedback',   customerFeedbackRoutes);
app.use('/api/shopkeeper-feedback', shopkeeperFeedbackRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/shopkeeper-feedbacks', feedbackShopkeeperRoute);
app.use('/api', shopkeeperhome); // Use the shopkeeper home routes
app.use('/api/shopkeeper', shopkeepereditprofile); // Use the shopkeeper edit profile routes
app.use('/api/products', customerhomeProducts); // Use the customer home products routes
app.use('/api/cart', cartRoutes); // Use the cart routes
app.use('/api/customer', customerprofileRoutes); // Use the customer profile routes
app.use('/api/customer/profile/edit', customerEditProfileRoutes); // Use the customer edit profile routes
app.use('/api/productdetails', productdetailsRoutes); // Use the product details routes
app.use('/api/orders', orderRoutes); // Use the order routes
app.use('/api/orderstatus/status', ordersStatusRoutes); // Use the order status routes
app.use('/api/feedbacks', customeradminfeedback); // Use the customer admin feedback routes
app.use('/api/customer-shopkeeper-feedback', require('./routes/customerToShopkeeperFeedback'));
app.use('/api/shopkeeper/orders', shopkeeperOrderRoutes);
app.use('/api', aiChatRoutes); // Use the AI chat routes
// app.use('/api', shopkeeperActivity);



app.use('/uploads', express.static('uploads'));

app.get('/*',function(req,res){res.sendFile(path.join(__dirname,'../frontend/index.html'));});
// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`${PORT} is up and running`);
});

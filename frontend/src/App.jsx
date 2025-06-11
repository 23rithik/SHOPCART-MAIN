import { Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './components/Homepage';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import ShopkeeperRegistration from './components/ShopkeeperRegistration';
import SuccessPage from './components/SuccessPage';
import CustomerRegistration from './components/CustomerRegistration';

import PrivateRoute from './PrivateRoute';
import AdminHome from './components/admin/AdminHome';
import CustomerHome from './components/customer/CustomerHome';
import ShopkeeperHome from './components/shopkeeper/ShopkeeperHome';
import Login from './components/Login';
import CustomerManagement from './components/admin/CustomerManagement';
import ShopkeeperManagement from './components/admin/ShopkeeperManagement';
import ShopkeeperAccessControl from './components/admin/ShopkeeperAccessControl';
import CustomerAccessControl from './components/admin/CustomerAccessControl';
import CustomerFeedback from './components/admin/CustomerFeedback';
import ShopkeeperFeedback from './components/admin/ShopkeeperFeedback';
import ManageProducts from './components/shopkeeper/ManageProducts';
import ManageOrders from './components/shopkeeper/ManageOrders';
import Feedbacks from './components/shopkeeper/ShopkeeperFeedbacks';
import EditProfile from './components/shopkeeper/EditProfile';
import ShopkeeperSendFeedback from './components/shopkeeper/ShopkeeperAdminFeedback';
import CustomerEditProfile from './components/customer/CustomerEditProfile';
import AllProducts from './components/customer/AllProducts';
import ProductDetails from './components/customer/ProductDetails';
import Checkout from './components/customer/Checkout';
import CartPage from './components/customer/CartPage';
import CustomerOrders from './components/customer/CustomerOrders';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/sreg" element={<ShopkeeperRegistration />} />
        <Route path="/creg" element={<CustomerRegistration />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/login"  element={<Login />} />
        {/* Private routes */}
        <Route path="/adminhome"  element={<PrivateRoute><AdminHome /></PrivateRoute>} />
        <Route path="/user/customer" element={<PrivateRoute><CustomerManagement /></PrivateRoute>}/>
        <Route path='/user/shopkeeper' element={<PrivateRoute><ShopkeeperManagement /></PrivateRoute>}/>
        <Route path='/access/shopkeeper' element={<PrivateRoute><ShopkeeperAccessControl /></PrivateRoute>}/>
        <Route path='/access/customer' element={<PrivateRoute><CustomerAccessControl /></PrivateRoute>}/>
        <Route path="/feedback/customer" element={<PrivateRoute><CustomerFeedback /></PrivateRoute>} />
        <Route path="/feedback/shopkeeper" element={<PrivateRoute><ShopkeeperFeedback /></PrivateRoute>} />
        
        {/* Customer and Shopkeeper Home */}

        <Route path="/chome" element={<PrivateRoute><CustomerHome /></PrivateRoute>} />
        <Route path="/ceditprofile" element={<PrivateRoute><CustomerEditProfile /></PrivateRoute>} />
        <Route path="/products" element={<PrivateRoute><AllProducts /></PrivateRoute>} />
        <Route path="/productdetails/:id" element={<PrivateRoute><ProductDetails /></PrivateRoute>} />
        <Route path="/checkout/:id" element={<PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute><CustomerOrders /></PrivateRoute>} />
        
        {/* Shopkeeper routes */}
        
        <Route path="/shome" element={<PrivateRoute><ShopkeeperHome /></PrivateRoute>} />
        <Route path="/smproducts" element={<PrivateRoute><ManageProducts /></PrivateRoute>} />
        <Route path="/smorders" element={<PrivateRoute><ManageOrders /></PrivateRoute>} />
        <Route path="/sfeedbacks" element={<PrivateRoute><Feedbacks /></PrivateRoute>} />
        <Route path="/editprofile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
        <Route path="sadminfeedback" element={<PrivateRoute><ShopkeeperSendFeedback /></PrivateRoute>} />
        
        {/* Redirect to login page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;

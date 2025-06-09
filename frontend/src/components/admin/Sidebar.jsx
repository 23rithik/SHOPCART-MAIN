import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Drawer, List, ListItem, ListItemText, Collapse, Button } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const Sidebar = () => {
  const [openUser, setOpenUser] = useState(false);
  const [openAccess, setOpenAccess] = useState(false);
  const [openFeedback, setOpenFeedback] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const toggleUser = () => setOpenUser(!openUser);
  const toggleAccess = () => setOpenAccess(!openAccess);
  const toggleFeedback = () => setOpenFeedback(!openFeedback);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const isUserManagementActive = () => {
  return location.pathname.startsWith('/user');
};

const isAccessControlActive = () => {
  return location.pathname.startsWith('/access');
};

const isFeedbackActive = () => location.pathname.startsWith('/feedback');

  const menuItems = [
    { label: 'Analytics Dashboard', path: '/adminhome' },
    { label: 'Customer Management', path: '/user/customer' },
    { label: 'Shopkeeper Management', path: '/user/shopkeeper' },
    { label: 'Customer Access', path: '/access/customer' },
    { label: 'Shopkeeper Access', path: '/access/shopkeeper' },
    { label: 'Customer Feedbacks', path: '/feedback/customer' },
    { label: 'Shopkeeper Feedbacks', path: '/feedback/shopkeeper' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 260,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        '& .MuiDrawer-paper': {
          width: 250,
          background: 'linear-gradient(to bottom right, rgb(42, 77, 43), rgb(100, 156, 103))',
          color: 'white',
          paddingTop: '10px',
          borderRight: '2px solid rgba(0,0,0,0.1)',
        },
      }}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'left' }}
      >
        <h2 
          style={{ fontWeight: 'bold', marginLeft: '10px', cursor: 'pointer' }} 
          onClick={() => navigate('/adminhome')}
        >
          SHOPCART
        </h2>
        <hr style={{ borderColor: '#fff', width: '100%', margin: '10px auto' }} />
      </motion.div>

      <List sx={{ flexGrow: 1 }}>
  {/* Analytics Dashboard */}
  <ListItem
    button
    sx={{
      cursor: 'pointer',
    //   m: 1,
      borderRadius: '12px',
      ...(isActive('/adminhome') && {
        border: '2px solid white',
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        fontWeight: 'bold',
      }),
    }}
    onClick={() => navigate('/adminhome')}
    selected={isActive('/adminhome')}
  >
    <ListItemText primary="Analytics Dashboard" />
  </ListItem>

  {/* User Management */}
  <ListItem
  button
  onClick={toggleUser}
  sx={{
    cursor: 'pointer',
    ...(isUserManagementActive() && {
      border: '2px solid white',
      background: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      fontWeight: 'bold',
      borderRadius: '12px',
    }),
  }}
>
  <ListItemText primary="User Management" />
  {openUser ? <ExpandLess /> : <ExpandMore />}
</ListItem>

<Collapse in={openUser} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>
    {/* Customer */}
    <ListItem
      button
      sx={{
        pl: 4,
        cursor: 'pointer',
        borderRadius: '12px',
        ...(isActive('/user/customer') && {
          border: '2px solid white',
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          fontWeight: 'bold',
        }),
      }}
      onClick={() => navigate('/user/customer')}
    >
      <ListItemText primary="Customer" />
    </ListItem>

    {/* Shopkeeper */}
    <ListItem
      button
      sx={{
        pl: 4,
        cursor: 'pointer',
        borderRadius: '12px',
        ...(isActive('/user/shopkeeper') && {
          border: '2px solid white',
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          fontWeight: 'bold',
        }),
      }}
      onClick={() => navigate('/user/shopkeeper')}
    >
      <ListItemText primary="Shopkeeper" />
    </ListItem>
  </List>
</Collapse>

  {/* Access Control */}
 <ListItem
  button
  onClick={toggleAccess}
  sx={{
    cursor: 'pointer',
    borderRadius: '12px',
    ...(isAccessControlActive() && {
      border: '2px solid white',
      background: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      fontWeight: 'bold',
    }),
  }}
>
  <ListItemText primary="Access Control" />
  {openAccess ? <ExpandLess /> : <ExpandMore />}
</ListItem>

  <Collapse in={openAccess} timeout="auto" unmountOnExit>
    <List component="div" disablePadding>
      <ListItem
        button
        sx={{
          pl: 4,
          cursor: 'pointer',
        //   m: 1,
          borderRadius: '12px',
          ...(isActive('/access/customer') && {
            border: '2px solid white',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            fontWeight: 'bold',
          }),
        }}
        onClick={() => navigate('/access/customer')}
      >
        <ListItemText primary="Customer" />
      </ListItem>

      <ListItem
        button
        sx={{
          pl: 4,
          cursor: 'pointer',
        //   m: 1,
          borderRadius: '12px',
          ...(isActive('/access/shopkeeper') && {
            border: '2px solid white',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            fontWeight: 'bold',
          }),
        }}
        onClick={() => navigate('/access/shopkeeper')}
      >
        <ListItemText primary="Shopkeeper" />
      </ListItem>
    </List>
  </Collapse>

  {/* Feedbacks */}
  <ListItem
  button
  onClick={toggleFeedback}
  sx={{
    cursor: 'pointer',
    borderRadius: '12px',
    ...(isFeedbackActive() && {
      border: '2px solid white',
      background: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      fontWeight: 'bold',
    }),
  }}
>
  <ListItemText primary="Feedbacks" />
  {openFeedback ? <ExpandLess /> : <ExpandMore />}
</ListItem>
  <Collapse in={openFeedback} timeout="auto" unmountOnExit>
    <List component="div" disablePadding>
      <ListItem
        button
        sx={{
          pl: 4,
          cursor: 'pointer',
        //   m: 1,
          borderRadius: '12px',
          ...(isActive('/feedback/customer') && {
            border: '2px solid white',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            fontWeight: 'bold',
          }),
        }}
        onClick={() => navigate('/feedback/customer')}
      >
        <ListItemText primary="Customer" />
      </ListItem>

      <ListItem
        button
        sx={{
          pl: 4,
          cursor: 'pointer',
        //   m: 1,
          borderRadius: '12px',
          ...(isActive('/feedback/shopkeeper') && {
            border: '2px solid white',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            fontWeight: 'bold',
          }),
        }}
        onClick={() => navigate('/feedback/shopkeeper')}
      >
        <ListItemText primary="Shopkeeper" />
      </ListItem>
    </List>
  </Collapse>
</List>


      {/* Logout Button */}
      <ListItem sx={{ mt: 'auto' }}>
        <Button 
          variant="contained" 
          fullWidth 
          onClick={handleLogout}
          sx={{
            backgroundColor: 'rgba(254, 108, 108, 0.8)',
            color: 'white',
            borderRadius: '20px',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: 'rgba(255, 0, 0, 1)',
            },
            boxShadow: 3,
            marginBottom: '20px',
          }}
        >
          Logout
        </Button>
      </ListItem>
    </Drawer>
  );
};

export default Sidebar;

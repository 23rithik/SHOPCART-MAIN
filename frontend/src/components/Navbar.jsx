import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation(); // Get the current route

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Check if the current route matches the given path
  const isActive = (path) => location.pathname === path;

  return (
    <AppBar
      position="fixed"
      sx={{
        background: '#f5f5f5', // Corrected background property
        zIndex: 10,
        transition: 'background-color 0.3s ease', // Smooth transition for background
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)', // Shadow below the navbar
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo - Shopcart Name with Text Styling */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                color: '#333',
                fontSize: '1.5rem',
                cursor: 'pointer',
                '&:hover': {
                  color: '#2e7d32',
                },
              }}
            >
              SHOPCART
            </Typography>
          </Link>
        </Box>


        {/* Navigation Links */}
        <Box>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button
              sx={isActive('/') ? activeButtonStyles : buttonStyles} // Apply active styles when active
            >
              Home
            </Button>
          </Link>

          <Link to="/about" style={{ textDecoration: 'none' }}>
            <Button
              sx={isActive('/about') ? activeButtonStyles : buttonStyles} // Apply active styles when active
            >
              About Us
            </Button>
          </Link>

          <Link to="/contact" style={{ textDecoration: 'none' }}>
            <Button
              sx={isActive('/contact') ? activeButtonStyles : buttonStyles} // Apply active styles when active
            >
              Contact Us
            </Button>
          </Link>

          {/* Register Dropdown */}
          <Button onClick={handleClick} sx={(isActive('/sreg') || isActive('/creg')) ? activeButtonStyles : buttonStyles}>
            Register
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <Link to="/sreg" style={{ textDecoration: 'none',color: 'black' }}>
              <MenuItem onClick={handleClose}>Shopkeeper</MenuItem>
            </Link>
            <Link to="/creg" style={{ textDecoration: 'none',color: 'black' }}>
              <MenuItem onClick={handleClose}>Customer</MenuItem>
            </Link>
          </Menu>

          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Button
              sx={isActive('/login') ? activeButtonStyles : buttonStyles} // Apply active styles when active
            >
              Login
            </Button>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// Standard button styles
const buttonStyles = {
  transition: 'color 0.3s, transform 0.3s, box-shadow 0.3s',
  color: '#333', // Default button color
  '&:hover': {
    transform: 'scale(1.05)', // Subtle zoom-in effect
    color: '#2e7d32', // Change text color to yellow on hover
  },
};

// Active button styles (when the button is active)
const activeButtonStyles = {
  ...buttonStyles,
  transform: 'scale(1.1)', // Make the button pop by increasing size
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)', // Add a shadow effect to make it pop
  color: '#2e7d32', // Active button color (yellow)
};

export default Navbar;


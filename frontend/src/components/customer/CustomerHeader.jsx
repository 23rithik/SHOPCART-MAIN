import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const CustomerHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navLinks = [
    { label: 'Home', path: '/chome' },
    { label: 'Products', path: '/products' },
      { label: 'Cart', path: '/cart' },       // <-- Added Cart button here
    { label: 'Orders', path: '/orders' },
  ];

const isActive = (path) => {
  if (path === '/chome') {
    return location.pathname === '/chome' || location.pathname === '/ceditprofile';
  }
  if (path === '/products') {
    return location.pathname.startsWith('/products') || location.pathname.startsWith('/productdetails/')|| location.pathname.startsWith('/checkout/');
  }
  return location.pathname === path;
};

  const commonButtonStyles = (active) => ({
    color: active ? 'green' : '#333',
    fontWeight: active ? 'bold' : 'normal',
    boxShadow: active ? '0 4px 8px rgba(0,0,0,0.2)' : 'none',
    transform: active ? 'translateY(-2px)' : 'none',
    borderRadius: '8px',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      color: 'green',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      transform: 'translateY(-2px)',
    },
    textTransform: 'none',
  });

  return (
    <AppBar
      position="fixed"
      elevation={4}
      sx={{
        backgroundColor: '#f5f5f5',
        color: '#333',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar>
        <Typography
          component={Link}
          to="/chome"
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: 'bold',
            color: '#333',
            textDecoration: 'none',
            transition: 'color 0.3s ease',
            '&:hover': {
              color: 'green',
            },
          }}
        >
          Kudumbasree Shop
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {navLinks.map((link) => (
            <Button
              key={link.path}
              component={Link}
              to={link.path}
              sx={commonButtonStyles(isActive(link.path))}
            >
              {link.label}
            </Button>
          ))}

          <Button
            onClick={handleMenuOpen}
            endIcon={<ArrowDropDownIcon />}
            sx={commonButtonStyles(
              location.pathname === '/customeradminfeedback' || location.pathname === '/customershopkeeperfeedback'
            )}
          >
            Feedback
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem
              component={Link}
              to="/customeradminfeedback"
              onClick={handleMenuClose}
            >
              Admin
            </MenuItem>
            <MenuItem
              component={Link}
              to="/customershopkeeperfeedback"
              onClick={handleMenuClose}
            >
              Shopkeeper
            </MenuItem>
          </Menu>

          <Button onClick={handleLogout} sx={commonButtonStyles(false)}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CustomerHeader;

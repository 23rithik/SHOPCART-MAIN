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

const ShopkeeperHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (path) => {
    setAnchorEl(null);
    if (path) navigate(path);
  };

  const navLinks = [
    { label: 'Home', path: '/shome' },
    { label: 'Manage Products', path: '/smproducts' },
    { label: 'Manage Orders', path: '/smorders' },
  ];

  const isActive = (path) => {
    if (path === '/shome') {
      return location.pathname === '/shome' || location.pathname === '/editprofile';
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
          to="/shome"
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

          {/* Feedbacks Dropdown */}
          <Button
            onClick={handleMenuClick}
            sx={commonButtonStyles(
              location.pathname === '/sfeedbacks' || location.pathname === '/sadminfeedback'
            )}
          >
            Feedbacks
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => handleMenuClose()}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={() => handleMenuClose('/sfeedbacks')}>Customer</MenuItem>
            <MenuItem onClick={() => handleMenuClose('/sadminfeedback')}>Admin</MenuItem>
          </Menu>

          {/* Logout */}
          <Button onClick={handleLogout} sx={commonButtonStyles(false)}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default ShopkeeperHeader;

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DirectionsTransitIcon from '@mui/icons-material/DirectionsTransit';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import CustomerHeader from './CustomerHeader';
import CustomerFooter from './CustomerFooter';
import axiosInstance from '../axiosInstance';

const shippingStages = [
  { label: 'ordered', icon: <Inventory2Icon /> },
  { label: 'shipped', icon: <LocalShippingIcon /> },
  { label: 'in transit', icon: <DirectionsTransitIcon /> },
  { label: 'out for delivery', icon: <DeliveryDiningIcon /> },
  { label: 'delivered', icon: <CheckCircleIcon /> },
];

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedProductName, setSelectedProductName] = useState('');
  const [showCancelled, setShowCancelled] = useState(false);
  const [progressToggles, setProgressToggles] = useState({});
  const [bounceOrderId, setBounceOrderId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axiosInstance.get('/api/orderstatus/status/getstatus', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else if (Array.isArray(res.data.orders)) {
        setOrders(res.data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('❌ Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (orderId, productName) => {
    setSelectedOrderId(orderId);
    setSelectedProductName(productName);
    setCancelDialogOpen(true);
  };

  const confirmCancelOrder = async () => {
    try {
      await axiosInstance.put(
        `/api/orderstatus/status/cancel/${selectedOrderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setBounceOrderId(selectedOrderId);
      setSnackbarMessage(`🗑️ "${selectedProductName}" order has been cancelled successfully!`);
      setSnackbarOpen(true);
      fetchOrders();
    } catch (err) {
      console.error('❌ Failed to cancel order', err);
      setSnackbarMessage(`❌ Failed to cancel "${selectedProductName}" order. Please try again.`);
      setSnackbarOpen(true);
    } finally {
      setCancelDialogOpen(false);
      setSelectedOrderId(null);
      setSelectedProductName('');
    }
  };

  const toggleShippingProgress = (orderId) => {
    setProgressToggles((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const filteredOrders = showCancelled
    ? orders
    : orders.filter((order) => order.shippingStatus !== 'cancelled');

  return (
    <>
      <CustomerHeader />
      <Box sx={{ mt: 12, px: 17, minHeight: '100vh', mb: 10 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            My Orders
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={showCancelled}
                onChange={() => setShowCancelled((prev) => !prev)}
                color="primary"
              />
            }
            label="Show Cancelled Orders"
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress size={50} thickness={4} color="primary" />
          </Box>
        ) : (
          <Grid container spacing={6}>
            {filteredOrders.length === 0 ? (
              <Typography sx={{ px: 2 }}>No orders to show.</Typography>
            ) : (
              filteredOrders.map((order) => {
                const currentStageIndex = shippingStages.findIndex(
                  (s) => s.label === order.shippingStatus.toLowerCase()
                );
                const orderDate = new Date(order.createdAt).toLocaleString();
                const isCancelled = order.shippingStatus === 'cancelled';

                return (
                  <Grid item xs={12} sm={6} md={4} key={order._id}>
                    <Card
                      className="fade-in"
                      sx={{
                        height: '100%',
                        p: 2,
                        backgroundColor: isCancelled ? '#ffe6e6' : '#fdfdfd',
                        border: isCancelled ? '2px dashed red' : '1px solid #ddd',
                        borderRadius: 2,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                        animation:
                          bounceOrderId === order._id ? 'bounce 0.5s ease' : 'none',
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <img
                            src={`http://localhost:5000/uploads/product_image/${order.productId?.image}`}
                            alt={order.productId?.name}
                            style={{ width: 70, height: 70, marginRight: 16, borderRadius: 8 }}
                          />
                          <Box>
                            <Typography variant="h6">{order.productId?.name}</Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              Qty: {order.quantity}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              ₹{order.amount}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              Shipping Address: {order.shippingAddress}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              Payment: {order.paymentStatus}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              Ordered on: {orderDate}
                            </Typography>
                            {isCancelled && (
                              <Typography color="error" sx={{ mt: 1 }}>
                                Cancelled
                              </Typography>
                            )}
                          </Box>
                        </Box>

                        {!isCancelled && (
                          <>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={progressToggles[order._id] || false}
                                  onChange={() => toggleShippingProgress(order._id)}
                                  color="primary"
                                />
                              }
                              label="Show Shipping Progress"
                            />

                            {progressToggles[order._id] && (
                              <>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  Shipping Progress:
                                </Typography>
                                <Timeline position="right" sx={{ pl: 0 }}>
                                  {shippingStages.map((stage, index) => {
                                    const isCompleted = index < currentStageIndex;
                                    const isCurrent = index === currentStageIndex;

                                    return (
                                      <TimelineItem key={stage.label}>
                                        <TimelineSeparator>
                                          <TimelineDot
                                            color={
                                              isCurrent
                                                ? 'primary'
                                                : isCompleted
                                                ? 'success'
                                                : 'grey'
                                            }
                                          >
                                            {stage.icon}
                                          </TimelineDot>
                                          {index < shippingStages.length - 1 && (
                                            <TimelineConnector />
                                          )}
                                        </TimelineSeparator>
                                        <TimelineContent>
                                          <Typography
                                            variant="body2"
                                            color={
                                              isCurrent
                                                ? 'primary'
                                                : isCompleted
                                                ? 'green'
                                                : 'textSecondary'
                                            }
                                          >
                                            {stage.label.toUpperCase()}
                                          </Typography>
                                        </TimelineContent>
                                      </TimelineItem>
                                    );
                                  })}
                                </Timeline>
                              </>
                            )}
                          </>
                        )}

                        {order.shippingStatus === 'ordered' && (
                          <Box sx={{ mt: 2 }}>
                            <Button
                              color="error"
                              variant="outlined"
                              size="small"
                              startIcon={<CancelIcon />}
                              onClick={() => handleCancelClick(order._id, order.productId?.name)}
                            >
                              Cancel Order
                            </Button>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            )}
          </Grid>
        )}
      </Box>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel the "{selectedProductName}" order? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>No</Button>
          <Button onClick={confirmCancelOrder} color="error">
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarMessage.includes('successfully') ? 'success' : 'error'}
          sx={{ width: '100%' }}
          icon={snackbarMessage.includes('successfully') ? '🎉' : '⚠️'}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <CustomerFooter />

      {/* Styles */}
      <style>
        {`
          @keyframes bounce {
            0% { transform: scale(1); }
            30% { transform: scale(1.05); }
            60% { transform: scale(0.95); }
            100% { transform: scale(1); }
          }
          .fade-in {
            animation: fadeIn 0.6s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </>
  );
};

export default CustomerOrders;

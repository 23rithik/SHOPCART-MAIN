import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Snackbar,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  Collapse,
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

import ShopkeeperHeader from './ShopkeeperHeader';
import Footer from './ShopkeeperFooter';
import axiosInstance from '../axiosInstance';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const statusStages = [
  { label: 'Ordered', icon: <Inventory2Icon /> },
  { label: 'Dispatched', icon: <LocalShippingIcon /> },
  { label: 'In Transit', icon: <DirectionsTransitIcon /> },
  { label: 'Out for Delivery', icon: <DeliveryDiningIcon /> },
  { label: 'Delivered', icon: <CheckCircleIcon /> },
];

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [cancelDialog, setCancelDialog] = useState({ open: false, orderId: null });
  const [expandedTimeline, setExpandedTimeline] = useState({});

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axiosInstance.get('/api/shopkeeper/orders/myorders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('❌ Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTimeline = (orderId) => {
    setExpandedTimeline((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };


  const handleStatusChange = async (id, newStatus) => {
    try {
      await axiosInstance.put(`/api/shopkeeper/orders/updatestatus/${id}`, {
        shippingStatus: newStatus.toLowerCase(),
      });
      setOrders(prev =>
        prev.map(order =>
          order._id === id ? { ...order, shippingStatus: newStatus.toLowerCase() } : order
        )
      );
      setSnackbar({ open: true, message: 'Status updated successfully!', severity: 'success' });
    } catch (err) {
      console.error('Error updating order status:', err);
      setSnackbar({ open: true, message: 'Failed to update status.', severity: 'error' });
    }
  };

  const handleCancelOrder = async () => {
    const id = cancelDialog.orderId;
    try {
      await axiosInstance.put(`/api/shopkeeper/orders/updatestatus/${id}`, {
        shippingStatus: 'cancelled',
      });
      setOrders(prev =>
        prev.map(order =>
          order._id === id ? { ...order, shippingStatus: 'cancelled' } : order
        )
      );
      setSnackbar({ open: true, message: 'Order cancelled.', severity: 'warning' });
    } catch (err) {
      console.error('Error cancelling order:', err);
      setSnackbar({ open: true, message: 'Failed to cancel order.', severity: 'error' });
    } finally {
      setCancelDialog({ open: false, orderId: null });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableData = filteredOrders.map(order => [
      order.productId?.name,
      order.customerId?.username,
      order.quantity,
      order.amount,
      order.paymentStatus,
      order.shippingStatus,
      new Date(order.createdAt).toLocaleString(),
    ]);

    autoTable(doc, {
      head: [['Product', 'Customer', 'Qty', 'Amount', 'Payment', 'Status', 'Date']],
      body: tableData,
    });

    doc.save('orders.pdf');
  };

  const exportToExcel = () => {
    const data = filteredOrders.map(order => ({
      Product: order.productId?.name,
      Customer: order.customerId?.username,
      Quantity: order.quantity,
      Amount: order.amount,
      PaymentStatus: order.paymentStatus,
      Status: order.shippingStatus,
      Date: new Date(order.createdAt).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'orders.xlsx');
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders =
    filter === 'all'
      ? orders
      : orders.filter(order => order.shippingStatus === filter.toLowerCase());

  const getStatusColor = (status) => {
    switch (status) {
      case 'ordered': return 'primary';
      case 'dispatched': return 'info';
      case 'in transit': return 'warning';
      case 'out for delivery': return 'secondary';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <>
      <ShopkeeperHeader />
      <Box sx={{ mt: 12, px: 4, minHeight: '100vh', mb: 8 }}>
        <Typography variant="h4" gutterBottom>
          Manage Orders
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select value={filter} onChange={e => setFilter(e.target.value)} label="Filter by Status">
              <MenuItem value="all">All</MenuItem>
              {[...statusStages.map(s => s.label.toLowerCase()), 'cancelled'].map(status => (
                <MenuItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={exportToPDF}>Export PDF</Button>
          <Button variant="outlined" onClick={exportToExcel}>Export Excel</Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={8} alignItems="stretch">
            {filteredOrders.map(order => (
              <Grid item xs={12} sm={6} md={4} key={order._id} sx={{ display: 'flex' }}>
                 <Card
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%',
                      width: '100%',
                      p: 2,
                      backgroundColor: '#fdfdfd',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      borderRadius: '16px',
                    }}
                  >
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box
                        component="img"
                        src={`http://localhost:5000/uploads/product_image/${order.productId?.image}`}
                        alt={order.productId?.name || 'Product'}
                        sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                      />
                      <Box>
                        <Typography variant="h6" noWrap>{order.productId?.name}</Typography>
                        <Typography variant="body2">Quantity: {order.quantity}</Typography>
                      </Box>
                    </Box>


                    <Typography variant="body2"><strong>Customer:</strong> {order.customerId?.name || 'N/A'}</Typography>
                    <Typography variant="body2"><strong>Address:</strong> {order.shippingAddress}</Typography>
                    <Typography variant="body2"><strong>Amount:</strong> ₹{order.amount}</Typography>
                    <Typography variant="body2"><strong>Payment Status:</strong> {order.paymentStatus}</Typography>
                    <Typography variant="body2"><strong>Order ID:</strong> {order.razorpayOrderId}</Typography>
                         <Typography variant="body2"><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</Typography>

                    {/* Colored Status Badge */}
                    <Chip
                      label={order.shippingStatus?.charAt(0).toUpperCase() + order.shippingStatus?.slice(1)}
                      color={getStatusColor(order.shippingStatus)}
                      variant="outlined"
                      sx={{ my: 2 }}
                    />

                    <FormControl fullWidth sx={{ my: 2 }}>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={order.shippingStatus || ''}
                        label="Status"
                        disabled={['delivered', 'cancelled'].includes(order.shippingStatus)}
                        onChange={e => handleStatusChange(order._id, e.target.value)}
                      >
                        {statusStages.map(stage => (
                          <MenuItem key={stage.label} value={stage.label.toLowerCase()}>
                            {stage.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {order.shippingStatus !== 'delivered' && order.shippingStatus !== 'cancelled' && (
                      <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        onClick={() => setCancelDialog({ open: true, orderId: order._id })}
                        sx={{ mb: 2 }}
                      >
                        Cancel Order
                      </Button>
                    )}

                    <Button
  variant="text"
  size="small"
  onClick={() => toggleTimeline(order._id)}
  sx={{ mb: 1, textTransform: 'none' }}
>
  {expandedTimeline[order._id] ? 'Hide Timeline ▲' : 'Show Timeline ▼'}
</Button>

<Collapse in={expandedTimeline[order._id]}>
  <Timeline position="right" sx={{ pl: 0 }}>
    {statusStages.map((stage, index) => {
      const currentIndex = statusStages.findIndex(
        (s) => s.label.toLowerCase() === order.shippingStatus
      );
      const isCompleted = currentIndex > index;
      const isCurrent = currentIndex === index;
      return (
        <TimelineItem key={stage.label}>
          <TimelineSeparator>
            <TimelineDot color={isCurrent ? 'primary' : isCompleted ? 'success' : 'grey'}>
              {stage.icon}
            </TimelineDot>
            {index < statusStages.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>
            <Typography
              variant="body2"
              color={isCurrent ? 'primary' : isCompleted ? 'green' : 'textSecondary'}
            >
              {stage.label}
            </Typography>
          </TimelineContent>
        </TimelineItem>
      );
    })}
  </Timeline>
</Collapse>

                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialog.open}
        onClose={() => setCancelDialog({ open: false, orderId: null })}
      >
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this order? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog({ open: false, orderId: null })}>No</Button>
          <Button color="error" onClick={handleCancelOrder}>Yes, Cancel</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Footer />
    </>
  );
};

export default ManageOrders;

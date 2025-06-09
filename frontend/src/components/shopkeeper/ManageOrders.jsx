import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';

// Icons
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DirectionsTransitIcon from '@mui/icons-material/DirectionsTransit';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import ShopkeeperHeader from './ShopkeeperHeader';
import Footer from './ShopkeeperFooter';

const statusStages = [
  { label: 'Ordered', icon: <Inventory2Icon /> },
  { label: 'Dispatched', icon: <LocalShippingIcon /> },
  { label: 'In Transit', icon: <DirectionsTransitIcon /> },
  { label: 'Out for Delivery', icon: <DeliveryDiningIcon /> },
  { label: 'Delivered', icon: <CheckCircleIcon /> },
];

const initialOrders = [
  {
    id: 1,
    name: 'Product A',
    quantity: 2,
    image: '',
    status: 'Ordered',
    timestamps: {
      Ordered: new Date().toLocaleString(),
    },
  },
  {
    id: 2,
    name: 'Product B',
    quantity: 1,
    image: 'https://via.placeholder.com/100',
    status: 'In Transit',
    timestamps: {
      Ordered: '2025-05-25 09:00 AM',
      Dispatched: '2025-05-26 10:30 AM',
      'In Transit': '2025-05-27 03:45 PM',
    },
  },
  {
    id: 3,
    name: 'Product C',
    quantity: 4,
    image: 'https://via.placeholder.com/100',
    status: 'Delivered',
    timestamps: {
      Ordered: '2025-05-24 07:00 AM',
      Dispatched: '2025-05-24 01:00 PM',
      'In Transit': '2025-05-25 10:00 AM',
      'Out for Delivery': '2025-05-26 06:30 AM',
      Delivered: '2025-05-26 09:45 AM',
    },
  },
  {
    id: 3,
    name: 'Product C',
    quantity: 4,
    image: 'https://via.placeholder.com/100',
    status: 'Delivered',
    timestamps: {
      Ordered: '2025-05-24 07:00 AM',
      Dispatched: '2025-05-24 01:00 PM',
      'In Transit': '2025-05-25 10:00 AM',
      'Out for Delivery': '2025-05-26 06:30 AM',
      Delivered: '2025-05-26 09:45 AM',
    },
  },
  {
    id: 3,
    name: 'Product C',
    quantity: 4,
    image: 'https://via.placeholder.com/100',
    status: 'Delivered',
    timestamps: {
      Ordered: '2025-05-24 07:00 AM',
      Dispatched: '2025-05-24 01:00 PM',
      'In Transit': '2025-05-25 10:00 AM',
      'Out for Delivery': '2025-05-26 06:30 AM',
      Delivered: '2025-05-26 09:45 AM',
    },
  },
];

const ManageOrders = () => {
  const [orders, setOrders] = useState(initialOrders);

  const handleStatusChange = (id, newStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === id) {
        const updatedTimestamps = { ...order.timestamps };
        if (!updatedTimestamps[newStatus]) {
          updatedTimestamps[newStatus] = new Date().toLocaleString();
        }
        return { ...order, status: newStatus, timestamps: updatedTimestamps };
      }
      return order;
    });
    setOrders(updatedOrders);
  };

  return (
    <>
      <ShopkeeperHeader />
      <Box sx={{ mt: 12, px: 4, minHeight: '100vh', mb: 8 }}>
        <Typography variant="h4" gutterBottom>
          Manage Orders
        </Typography>
        <Grid container spacing={9}>
          {orders.map(order => (
            <Grid item xs={12} sm={6} md={4} key={order.id}>
              <Card sx={{ height: '100%', p: 2, backgroundColor: '#f5f5f5' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <img
                      src={order.image || 'https://via.placeholder.com/100'}
                      alt={order.name}
                      style={{ width: 80, height: 80, marginRight: 16 }}
                    />
                    <Box>
                      <Typography variant="h6">{order.name}</Typography>
                      <Typography variant="body2">
                        Quantity: {order.quantity}
                      </Typography>
                    </Box>
                  </Box>

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={order.status}
                      label="Status"
                      onChange={e => handleStatusChange(order.id, e.target.value)}
                    >
                      {statusStages.map(stage => (
                        <MenuItem key={stage.label} value={stage.label}>
                          {stage.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Delivery Timeline:
                  </Typography>

                  <Timeline position="right" sx={{ pl: 0 }}>
                    {statusStages.map((stage, index) => {
                      const currentIndex = statusStages.findIndex(
                        s => s.label === order.status
                      );
                      const isCompleted = currentIndex > index;
                      const isCurrent = currentIndex === index;

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
                            {index < statusStages.length - 1 && <TimelineConnector />}
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
                              {stage.label}
                            </Typography>
                            {order.timestamps?.[stage.label] && (
                              <Typography
                                variant="caption"
                                color="textSecondary"
                                sx={{ fontSize: '0.7rem' }}
                              >
                                {order.timestamps[stage.label]}
                              </Typography>
                            )}
                          </TimelineContent>
                        </TimelineItem>
                      );
                    })}
                  </Timeline>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Footer />
    </>
  );
};

export default ManageOrders;

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';
import ShopkeeperHeader from './ShopkeeperHeader';
import Footer from './ShopkeeperFooter';
import axiosInstance from '../axiosInstance';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    quantity: '',
    description: '',
    image: null,
    category: '',
  });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    name: '',
    price: '',
    quantity: '',
    description: '',
    image: null,
    category: '',
  });

  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get('/api/products/mine');
        setProducts(res.data.products);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setNewProduct((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleAddProduct = async () => {
    if (
      newProduct.name &&
      newProduct.price &&
      newProduct.quantity &&
      newProduct.description &&
      newProduct.category &&
      newProduct.image
    ) {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('price', newProduct.price);
      formData.append('quantity', newProduct.quantity);
      formData.append('description', newProduct.description);
      formData.append('category', newProduct.category);
      formData.append('image', newProduct.image);

      try {
        const res = await axiosInstance.post('/api/products/add', formData);
        if (res.data.product) {
          setProducts([...products, res.data.product]);
          setNewProduct({
            name: '',
            price: '',
            quantity: '',
            description: '',
            image: null,
            category: '',
          });
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      } catch (err) {
        console.error('Error uploading product:', err);
        alert('Failed to upload product');
      }
    } else {
      alert('Please fill in all fields and select an image');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/products/delete/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Delete failed');
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setEditData({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      description: product.description,
      category: product.category || '',
      image: null,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditImageChange = (e) => {
    setEditData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleEditSave = async (id) => {
    try {
      const formData = new FormData();
      formData.append('name', editData.name);
      formData.append('price', editData.price);
      formData.append('quantity', editData.quantity);
      formData.append('description', editData.description);
      formData.append('category', editData.category);
      if (editData.image) {
        formData.append('image', editData.image);
      }

      const res = await axiosInstance.put(`/api/products/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updatedProduct = res.data.product;
      setProducts(products.map((p) => (p._id === id ? updatedProduct : p)));
      setEditId(null);
      setEditData({
        name: '',
        price: '',
        quantity: '',
        description: '',
        category: '',
        image: null,
      });

      if (editFileInputRef.current) editFileInputRef.current.value = '';
    } catch (err) {
      console.error('Edit failed:', err);
      alert('Failed to save changes');
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditData({
      name: '',
      price: '',
      quantity: '',
      description: '',
      category: '',
      image: null,
    });
    if (editFileInputRef.current) editFileInputRef.current.value = '';
  };

  return (
    <>
      <ShopkeeperHeader />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mt: 12, px: 4, flex: 1, mb: 8 }}>
          <Typography variant="h4" gutterBottom>
            Manage Products
          </Typography>

          <Card sx={{ mb: 4, p: 2, backgroundColor: '#fafafa' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Add New Product
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <TextField
                  label="Product Name"
                  name="name"
                  value={newProduct.name}
                  onChange={handleChange}
                />
                <TextField
                  label="Price"
                  name="price"
                  type="number"
                  value={newProduct.price}
                  onChange={handleChange}
                />
                <TextField
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={newProduct.quantity}
                  onChange={handleChange}
                />
                <TextField
                  label="Description"
                  name="description"
                  value={newProduct.description}
                  onChange={handleChange}
                />
                <TextField
                  label="Category"
                  name="category"
                  value={newProduct.category}
                  onChange={handleChange}
                />
                <Button variant="outlined" component="label">
                  Upload Image
                  <input type="file" hidden ref={fileInputRef} onChange={handleImageChange} />
                </Button>
                <Button variant="contained" color="success" onClick={handleAddProduct}>
                  Add Product
                </Button>
              </Box>
            </CardContent>
          </Card>

          {products.length > 0 ? (
            <Paper elevation={3}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#e0f2f1' }}>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <img
                          src={`http://localhost:5000/uploads/product_image/${product.image}`}
                          alt={product.name}
                          width="60"
                        />
                      </TableCell>
                      {editId === product._id ? (
                        <>
                          <TableCell>
                            <TextField
                              name="name"
                              value={editData.name}
                              onChange={handleEditChange}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              name="price"
                              type="number"
                              value={editData.price}
                              onChange={handleEditChange}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              name="quantity"
                              type="number"
                              value={editData.quantity}
                              onChange={handleEditChange}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              name="description"
                              value={editData.description}
                              onChange={handleEditChange}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              name="category"
                              value={editData.category}
                              onChange={handleEditChange}
                            />
                          </TableCell>
                          <TableCell>
                            <Button variant="outlined" component="label" sx={{ mb: 1, mr: 1 }}>
                              Change Image
                              <input
                                type="file"
                                hidden
                                ref={editFileInputRef}
                                onChange={handleEditImageChange}
                              />
                            </Button>
                            <Box>
                              <Button
                                color="success"
                                variant="contained"
                                size="small"
                                sx={{ mr: 1 }}
                                onClick={() => handleEditSave(product._id)}
                              >
                                Save
                              </Button>
                              <Button
                                color="secondary"
                                variant="outlined"
                                size="small"
                                onClick={handleEditCancel}
                              >
                                Cancel
                              </Button>
                            </Box>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>₹{product.price}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>{product.description}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() => handleEdit(product)}
                              sx={{ mr: 1 }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => handleDelete(product._id)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          ) : (
            <Typography>No products available</Typography>
          )}
        </Box>

        <Footer />
      </Box>
    </>
  );
};

export default ManageProducts;

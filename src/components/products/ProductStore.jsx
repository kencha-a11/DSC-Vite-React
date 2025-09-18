import React, { useState } from 'react';
import api from '../../services/api';

const ProductStore = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock_quantity: '',
    low_stock_threshold: '',
    image_path: null,
    is_primary: false,
  });

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;

    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('price', formData.price);
      data.append('stock_quantity', formData.stock_quantity);
      data.append('low_stock_threshold', formData.low_stock_threshold);
      data.append('image_path', formData.image_path);
      data.append('is_primary', formData.is_primary ? 1 : 0); // send as 1/0

      const response = await api.post('/products/store', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Response:', response.data);

      setFormData({
        name: '',
        price: '',
        stock_quantity: '',
        low_stock_threshold: '',
        image_path: null,
        is_primary: false,
      });

    } catch (error) {
      if (error.response && error.response.status === 422) {
        console.error('Validation errors:', error.response.data.errors);
      } else {
        console.error('Error storing product and image:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <h2>Create Product with Image</h2>

      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="stock_quantity"
        placeholder="Stock Quantity"
        value={formData.stock_quantity}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="low_stock_threshold"
        placeholder="Low Stock Threshold"
        value={formData.low_stock_threshold}
        onChange={handleChange}
        required
      />

      <input
        type="file"
        name="image_path"
        accept="image/*"
        onChange={handleChange}
        required
      />

      <label>
        <input
          type="checkbox"
          name="is_primary"
          checked={formData.is_primary}
          onChange={handleChange}
        />
        Primary Image
      </label>

      <button type="submit">Create Product + Upload Image</button>
    </form>
  );
};

export default ProductStore;

import React, { useState } from 'react';
import api from '../../../services/api';

const ProductWithImageStore = () => {
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
      // 1️⃣ Create product first
      const productResponse = await api.post('/products/store', {
        name: formData.name,
        price: formData.price,
        stock_quantity: formData.stock_quantity,
        low_stock_threshold: formData.low_stock_threshold,
      });

      const productId = productResponse.data.id;

      // 2️⃣ Upload image for the created product
      const data = new FormData();
      data.append('product_id', productId);
      data.append('image_path', formData.image_path);
      data.append('is_primary', formData.is_primary);

      const imageResponse = await api.post('/products-images/store', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Product created:', productResponse.data);
      console.log('Image uploaded:', imageResponse.data);

      // Reset form
      setFormData({
        name: '',
        price: '',
        stock_quantity: '',
        low_stock_threshold: '',
        image_path: null,
        is_primary: false,
      });

    } catch (error) {
      console.error('Error storing product or image:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Product with Image</h2>
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
      />
      <input
        type="number"
        name="stock_quantity"
        placeholder="Stock Quantity"
        value={formData.stock_quantity}
        onChange={handleChange}
      />
      <input
        type="number"
        name="low_stock_threshold"
        placeholder="Low Stock Threshold"
        value={formData.low_stock_threshold}
        onChange={handleChange}
      />
      <input
        type="file"
        name="image_path"
        onChange={handleChange}
        accept="image/*"
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

export default ProductWithImageStore;

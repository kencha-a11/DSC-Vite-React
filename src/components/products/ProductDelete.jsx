import React, { useState } from 'react';
import api from '../../services/api';

const ProductDelete = () => {
  const [productId, setProductId] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setProductId(e.target.value);
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    if (!productId) {
      setMessage('Please enter a product ID.');
      return;
    }

    try {
      const response = await api.delete(`/products/${productId}`);
      setMessage(response.data.message);
      setProductId('');
    } catch (error) {
      console.error('Error deleting product:', error);
      if (error.response && error.response.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Failed to delete product.');
      }
    }
  };

  return (
    <div>
      <h2>Delete Product</h2>
      <form onSubmit={handleDelete}>
        <input
          type="number"
          name="product_id"
          placeholder="Product ID"
          value={productId}
          onChange={handleChange}
          required
        />
        <button type="submit">Delete Product</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ProductDelete;

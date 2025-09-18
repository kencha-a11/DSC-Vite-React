import React, { useState } from 'react';
import api from '../../../services/api';

const ProductImgDelete = ({ onDeleted }) => {
  const [imageId, setImageId] = useState('');

  const handleDelete = async () => {
    if (!imageId) {
      alert('Please enter an Image ID');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete image ${imageId}?`)) return;

    try {
      await api.delete(`/products-images/${imageId}`);
      console.log(`Image ${imageId} deleted successfully`);
      if (onDeleted) onDeleted(imageId);
      setImageId(''); // clear input
    } catch (error) {
      console.error('Error deleting image:', error.response?.data || error);
    }
  };

  return (
    <div style={{ margin: '10px 0' }}>
      <input
        type="number"
        placeholder="Enter Image ID"
        value={imageId}
        onChange={(e) => setImageId(e.target.value)}
        style={{ padding: '5px', width: '150px' }}
      />
      <button
        onClick={handleDelete}
        style={{
          backgroundColor: 'red',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginLeft: '5px'
        }}
      >
        Delete Image
      </button>
    </div>
  );
};

export default ProductImgDelete;

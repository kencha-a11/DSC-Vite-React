import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

const ProductShow = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Make sure your Laravel endpoint returns product with 'images_path' relationship
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div>
      <h2>{product.name}</h2>
      <p>Price: ${product.price}</p>
      <p>Stock: {product.stock_quantity}</p>
      <p>Low Stock Threshold: {product.low_stock_threshold}</p>

      <h3>Images:</h3>
      {product.images_path && product.images_path.length > 0 ? (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {product.images_path.map((img) => (
            <img
              key={img.id}
              src={img.image_path} // the accessor already returns full URL
              alt={`Product ${product.name}`}
              width="150"
              height="150"
              style={{ objectFit: 'cover', borderRadius: '8px' }}
            />
          ))}
        </div>
      ) : (
        <p>No images available for this product.</p>
      )}
    </div>
  );
};

export default ProductShow;

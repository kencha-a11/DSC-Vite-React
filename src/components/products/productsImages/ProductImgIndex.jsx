import React, { useState, useEffect } from 'react'
import api from '../../../services/api'

const ProductImgIndex = () => {
    const [productImages, setProductImages] = useState([])
    useEffect(() => {
        api.get('/products-images')
            .then((response) => setProductImages(response.data))
            .catch((error) => console.error("Error fetching product images:", error))
    }, []) // empty dependency array = runs only once
    console.log(productImages)

    return (
        <div>
            {productImages.length === 0 && <p>No product images available.</p>}

            {productImages.map(image => (
                <div key={image.id}>
                    {image.image_path}
                </div>
            ))}
            working ProductImgIndex
        </div>
    )
}

export default ProductImgIndex

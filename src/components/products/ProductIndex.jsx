import React, { useEffect, useState } from "react"
import api from '../../services/api'

const ProductIndex = () => {
    const [products, setProducts] = useState([])

    useEffect(() => {
        api.get('/products')
            .then((response) => setProducts(response.data))
            .catch((error) => console.error("Error fetching products:", error))
    }, []) // empty dependency array = runs only once
    console.log(products)

    return (
        <div>
            {products.map(product => (
                <div key={product.id}>{product.name}</div>
            ))}
        </div>
    )
}

export default ProductIndex

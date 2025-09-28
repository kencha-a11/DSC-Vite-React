import React, { useState } from "react";

export default function ProductsContent() {
  const [products, setProducts] = useState(["Shirt", "Mug", "Cap"]);

  return (
    <div className="bg-white p-6 rounded-md shadow">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <ul className="list-disc pl-5">
        {products.map((p, i) => (
          <li key={i} className="text-gray-700">{p}</li>
        ))}
      </ul>
    </div>
  );
}

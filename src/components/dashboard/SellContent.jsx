import React, { useState } from "react";

export default function SellContent() {
  const [product, setProduct] = useState("");
  const [sales, setSales] = useState([]);

  const handleSell = () => {
    if (product.trim()) {
      setSales([...sales, product]);
      setProduct("");
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow">
      <h2 className="text-2xl font-bold mb-4">Sell</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter product name"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          onClick={handleSell}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Sell
        </button>
      </div>
      <ul className="list-disc pl-5">
        {sales.map((item, index) => (
          <li key={index} className="text-gray-700">{item}</li>
        ))}
      </ul>
    </div>
  );
}

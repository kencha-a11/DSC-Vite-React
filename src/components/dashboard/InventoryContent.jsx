import React, { useState } from "react";

export default function InventoryContent() {
  const [inventory, setInventory] = useState([
    { item: "Shirt", stock: 10 },
    { item: "Mug", stock: 5 },
    { item: "Cap", stock: 8 },
  ]);

  const restock = (index) => {
    const updated = [...inventory];
    updated[index].stock += 1;
    setInventory(updated);
  };

  return (
    <div className="bg-white p-6 rounded-md shadow">
      <h2 className="text-2xl font-bold mb-4">Inventory</h2>
      <ul>
        {inventory.map((i, idx) => (
          <li key={idx} className="flex items-center justify-between mb-2">
            <span>{i.item}: {i.stock} in stock</span>
            <button
              onClick={() => restock(idx)}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Restock
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

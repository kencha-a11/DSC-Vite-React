import React, { useState } from "react";

export default function ReportsContent() {
  const [sales] = useState([
    { product: "Shirt", qty: 5 },
    { product: "Mug", qty: 3 },
    { product: "Cap", qty: 2 },
  ]);

  const total = sales.reduce((sum, s) => sum + s.qty, 0);

  return (
    <div className="bg-white p-6 rounded-md shadow">
      <h2 className="text-2xl font-bold mb-4">Reports</h2>
      <ul className="list-disc pl-5 mb-4">
        {sales.map((s, i) => (
          <li key={i} className="text-gray-700">
            {s.product}: {s.qty} sold
          </li>
        ))}
      </ul>
      <p className="font-semibold text-gray-900">
        Total items sold: {total}
      </p>
    </div>
  );
}

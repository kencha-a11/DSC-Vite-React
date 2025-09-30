// src/components/accounts/SalesList.jsx
export default function SalesList({ sales }) {
  if (!sales || sales.length === 0) return <p className="text-gray-500">No sales record found.</p>;

  return (
    <div className="flex flex-col gap-3">
      {sales.map((sale) => {
        const date = new Date(sale.created_at);
        return (
          <div key={sale.id} className="flex justify-between items-start p-3 border rounded-md">
            <div>
              <p className="text-sm font-medium text-gray-800">{date.toLocaleDateString()}</p>
              <p className="text-xs text-gray-500">
                {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-green-600">
                + ₱ {sale.total_amount.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">{sale.quantity || "—"} items</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

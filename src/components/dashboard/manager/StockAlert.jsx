import React, { forwardRef } from 'react';

const StockAlert = forwardRef(({ data, loading }, ref) => {
  // Determine badge color based on status
  const getStatusBadge = (status, stock) => {
    if (status === 'Out of Stock' || stock === 0) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">
          Out of Stock
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded">
        Low Stock
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-gray-200 border-b">
        <h3 className="text-lg font-medium text-gray-900">Stock Alert</h3>
        {/* <span className="text-sm text-gray-500">Low inventory items</span> */}
      </div>

      {/* List of Stock Alerts with Scroll */}
      <div className="max-h-96 overflow-y-auto divide-y">
        {data.length === 0 && !loading ? (
          <div className="p-4 text-center text-gray-500">
            No low stock items
          </div>
        ) : (
          data.map((item, index) => (
            <div 
              key={item.id || index} 
              className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border-gray-200"
            >
              <div className="flex-1">
                <p className="text-base font-medium text-gray-800">
                  {item.product_name || item.name}
                </p>
                {item.category && (
                  <p className="text-sm text-gray-500">{item.category}</p>
                )}
              </div>
              <div className="flex items-center space-x-3 text-sm mt-2 sm:mt-0">
                <div>
                  <span className={`font-medium ${
                    item.stock === 0 ? 'text-red-600' : 
                    item.stock <= 5 ? 'text-orange-600' : 
                    'text-gray-800'
                  }`}>
                    {item.stock ?? 0}
                  </span>
                  <span className="text-gray-600"> remaining </span>
                </div>
                {getStatusBadge(item.status, item.stock)}
              </div>
            </div>
          ))
        )}
        
        {/* Infinite Scroll Trigger */}
        {data.length > 0 && (
          <div ref={ref} className="p-4 text-center">
            {loading ? (
              <span className="text-sm text-gray-500">Loading more...</span>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
});

StockAlert.displayName = 'StockAlert';

export default StockAlert;
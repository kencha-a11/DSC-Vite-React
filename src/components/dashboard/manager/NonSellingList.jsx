import React, { forwardRef } from 'react';

const NonSellingProductList = forwardRef(({ items, selectedDays, onDaysChange, loading }, ref) => {
  const daysOptions = [7, 14, 30, 60, 90];

  // Calculate days ago from last_sold_date
  const calculateDaysAgo = (lastSoldDate) => {
    if (!lastSoldDate || lastSoldDate === 'Never') return null;
    
    const lastSold = new Date(lastSoldDate);
    const today = new Date();
    const diffTime = Math.abs(today - lastSold);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString || dateString === 'Never') return 'Never';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header and Filter */}
      <div className="flex items-center justify-between p-4 border-gray-200 border-b">
        <h3 className="text-lg font-medium text-gray-900">Not-selling items</h3>
        <div className="flex items-center space-x-2">
          {/* Days Unsold Dropdown */}
          <select
            value={selectedDays}
            onChange={(e) => onDaysChange(Number(e.target.value))}
            className="px-3 py-1 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {daysOptions.map((days) => (
              <option key={days} value={days}>
                {days}+
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-700">days unsold</span>
        </div>
      </div>

      {/* List of Non-Selling Items with Scroll */}
      <div className="max-h-96 overflow-y-auto divide-y">
        {items.length === 0 && !loading ? (
          <div className="p-4 text-center text-gray-500">
            No items found
          </div>
        ) : (
          items.map((item, index) => {
            const daysAgo = calculateDaysAgo(item.last_sold_date);
            const formattedDate = formatDate(item.last_sold_date);
            
            return (
              <div 
                key={item.id || index} 
                className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border-gray-200"
              >
                <p className="text-base font-medium text-gray-800">
                  {item.product_name || item.name}
                </p>
                <div className="flex items-center text-sm">
                  <span className="text-gray-600 mr-1">Last sold:</span>
                  <span className="font-medium text-gray-800 mr-2">
                    {formattedDate}
                  </span>
                  {daysAgo !== null && (
                    <span className="text-gray-500">
                      {daysAgo} days ago
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
        
        {/* Infinite Scroll Trigger */}
        {items.length > 0 && (
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

NonSellingProductList.displayName = 'NonSellingProductList';

export default NonSellingProductList;
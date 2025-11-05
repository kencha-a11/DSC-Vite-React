// TopSellingProduct.jsx
import React from "react";

const TopSellingProduct = ({
  title = "Top-selling items",
  items = [],
  className = "",
}) => {
  // Fallback: prevent errors if no data is passed
  if (!items || items.length === 0) {
    return (
      <div
        className={`bg-white border border-gray-200 rounded-xl  ${className}`}
      >
        <h3 className="p-4 text-lg font-medium text-gray-900 border-b border-gray-200">
          {title}
        </h3>
        <div className="p-4 text-gray-500 text-sm text-center">
          No data available
        </div>
      </div>
    );
  }

  // Find the highest quantity to set the reference for bar length
  const maxQuantity = Math.max(...items.map((item) => item.total_sold));

  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl ${className}`}
    >
      {/* Header */}
      <h3 className="p-4 text-lg font-medium text-gray-900 border-b border-gray-200">
        {title}
      </h3>

      {/* List Container */}
      <div className="p-4 space-y-3">
        {items.map((item, index) => {
          // Calculate the width of the bar as a percentage of the max quantity
          const barWidthPercentage = (item.total_sold / maxQuantity) * 100;

          // Alternate bar colors for a pattern
          const barColorClass = index % 2 === 0 ? "bg-blue-600" : "bg-blue-300";
          const textColor = "text-blue-600";

          return (
            <div key={index} className="flex flex-col">
              {/* Item Name */}
              <p className="text-sm text-gray-800 mb-1">{item.product_name}</p>

              {/* Bar and Quantity */}
              <div className="flex items-center">
                <div className="grow h-6 relative bg-gray-100 rounded-sm overflow-hidden">
                  {/* Bar */}
                  <div
                    className={`h-full absolute left-0 top-0 ${barColorClass}`}
                    style={{
                      width: `${barWidthPercentage}%`,
                      transition: "width 0.3s ease",
                    }}
                  ></div>
                </div>

                {/* Quantity Label */}
                <span
                  className={`ml-3 text-sm font-semibold ${textColor} whitespace-nowrap`}
                >
                  {item.total_sold} pcs
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopSellingProduct;

import React from "react";

const SalesTrendChart = ({ title, data, selectedYear, onYearChange, className = "" }) => {
  const months = data.map((d) => d.month.substring(0, 3));

  // Use numeric values for chart calculations
  const numericSales = data.map((d) => d.total_sales);
  const maxSales = Math.max(...numericSales);

  // Generate Y-axis labels as formatted currency
  const yAxisValues = Array.from({ length: 6 }, (_, i) => {
    const value = (maxSales / 5) * i;
    return `₱${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  });

  return (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-sm ${className}`}>
      {/* Header Section */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div className="relative">
          <select
            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            aria-label="Select year"
            value={selectedYear}
            onChange={(e) => onYearChange(Number(e.target.value))}
          >
            {/* <option value="2024">2024</option> */}
            <option value="2025">2025</option>
            {/* <option value="2026">2026</option> */}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex p-4">
        {/* Y-axis */}
        <div className="flex flex-col justify-between pr-4 text-sm text-gray-600 font-medium whitespace-nowrap">
          {yAxisValues.slice().reverse().map((value, index) => (
            <span key={index}>{value}</span>
          ))}
        </div>

        {/* Chart */}
        <div className="grow">
          <svg className="w-full" viewBox="0 0 600 200" preserveAspectRatio="none">
            {/* Grid lines */}
            {yAxisValues.map((_, index) => (
              <line
                key={`grid-${index}`}
                x1="0"
                y1={200 - (index * (200 / (yAxisValues.length - 1)))}
                x2="600"
                y2={200 - (index * (200 / (yAxisValues.length - 1)))}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            ))}

            {/* Line */}
            <polyline
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={numericSales
                .map((sales, i) => {
                  const x = (i / (numericSales.length - 1)) * 600;
                  const y = 200 - (sales / maxSales) * 180;
                  return `${x},${y}`;
                })
                .join(" ")}
            />

            {/* Area fill */}
            <polygon
              fill="#ede9fe"
              points={`0,200 ${numericSales
                .map((sales, i) => {
                  const x = (i / (numericSales.length - 1)) * 600;
                  const y = 200 - (sales / maxSales) * 180;
                  return `${x},${y}`;
                })
                .join(" ")} 600,200`}
            />
          </svg>

          {/* X-axis Labels */}
          <div className="flex justify-between mt-2 text-sm text-gray-600 font-medium">
            {months.map((m, i) => (
              <span key={i}>{m}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesTrendChart;

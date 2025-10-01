import React from "react";

const CategoryConfirmationModal = ({ categoryName, products, onCancel, onConfirm, isLoading }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onCancel}
      ></div>

      {/* Modal container */}
      <div className="bg-white rounded-lg shadow-lg z-10 w-11/12 max-w-md mx-auto p-6 transform transition-all scale-95 opacity-0 animate-fadeIn">
        {/* Upper Section */}
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold mb-2">Category Confirmation Summary</h2>
          <p className="text-gray-700 font-medium">{categoryName}</p>
        </div>

        {/* Middle Section */}
        <div className="mb-6 max-h-64 overflow-y-auto">
          {products && products.length > 0 ? (
            <div className="space-y-3">
              {products.map((product) => (
                <div key={product.id} className="flex items-center space-x-4 p-2 border rounded-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <span className="text-gray-800">{product.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No products selected</p>
          )}
        </div>

        {/* Lower Section */}
        <div className="flex justify-between">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition disabled:cursor-not-allowed disabled:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded text-white ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Creating..." : "Confirm"}
          </button>
        </div>
      </div>

      {/* Fade-in animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CategoryConfirmationModal;

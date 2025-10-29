import React from 'react';

const LeaveCartItemDialog = ({ onConfirm, onCancel, message, subMessage }) => {
  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center px-4">
      {/* Background overlay - visible but darkened */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onCancel}
      />

      {/* Modal content */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border-2 border-pink-500">
        {/* Message */}
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-gray-900 leading-tight">
            {message}
          </h3>
          <p className="text-gray-400 text-lg">
            {subMessage}
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-8 py-3.5 rounded-xl text-lg font-semibold text-gray-400 bg-gray-200 hover:bg-gray-300 focus:outline-none transition duration-150 ease-in-out"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-8 py-3.5 rounded-xl text-lg font-semibold text-white bg-pink-500 hover:bg-pink-600 focus:outline-none transition duration-150 ease-in-out"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveCartItemDialog;
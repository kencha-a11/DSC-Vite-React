import React from "react";
import { MinusIcon, PlusIcon } from "../../icons";

export default function QuantityInput({ value, onChange }) {
  // Ensure the value is treated as a number, defaulting to 1 if invalid
  const numericValue = Number(value) || 1; 

  // Function to handle input field changes
  const handleInputChange = (e) => {
    const newValue = Number(e.target.value);
    onChange(Math.max(1, newValue)); // Min value is 1
  };

  // Function to handle decrement button click
  const handleDecrement = () => {
    onChange(Math.max(1, numericValue - 1)); 
  };

  // Function to handle increment button click
  const handleIncrement = () => {
    onChange(numericValue + 1);
  };

  return (
    <div> {/* Removed max-w-xs to allow it to take full container width */}
      
      {/* Label: Matched ThresholdInput's styling */}
      <label className="text-sm font-medium text-gray-700 mb-1 block">Quantity</label>
      
      {/* Unified Input Control Container (Stepper Design) */}
      <div className="flex items-center w-full border border-gray-300 rounded-lg overflow-hidden">
        
        {/* Decrement Button */}
        <button
          type="button"
          onClick={handleDecrement}
          // p-3 padding retained for consistent height
          className="p-3 border-r border-gray-300 text-gray-700 hover:bg-gray-50 transition duration-150 ease-in-out flex-shrink-0"
        >
          <MinusIcon className="w-5 h-5" /> 
        </button>
        
        {/* Quantity Input Field */}
        <input
          type="number"
          min="1" // Set minimum to 1 for quantity
          value={numericValue}
          onChange={handleInputChange}
          // Input styling: uses py-3 and px-3 to match the p-3 height/padding of the reference input
          // Removed large font size classes to match the small, standard text size
          className="w-full text-center py-3 px-3 border-none focus:ring-0 focus:outline-none text-gray-800"
          // Hide default number arrows (optional)
          style={{ appearance: 'textfield' }} 
        />
        
        {/* Increment Button */}
        <button
          type="button"
          onClick={handleIncrement}
          // p-3 padding retained for consistent height
          className="p-3 border-l border-gray-300 text-gray-700 hover:bg-gray-50 transition duration-150 ease-in-out flex-shrink-0"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
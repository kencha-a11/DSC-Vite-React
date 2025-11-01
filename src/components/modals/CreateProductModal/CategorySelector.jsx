import React, { useState, useRef, useEffect } from "react";

export default function CategorySelector({
  categories,
  selectedCategories,
  onCategoryChange,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if a click occurred AND if the click target is NOT inside the element referenced by dropdownRef
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false); // Close the dropdown
      }
    };

    // Attach the event listener to the entire document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup function to remove the listener when the component is removed
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []); // Empty dependency array means this runs once on mount

  // Handler for category selection
  const handleCategoryToggle = (catId, isChecked) => {
    onCategoryChange(catId, isChecked);
    // 💡 ENHANCEMENT: Keep the dropdown open to allow for quick multi-selection, 
    // but clear the search term if they successfully select a category.
    setSearchTerm("");
  };

  const filteredCategories = categories
    .filter((c) => c.id > 0)
    .filter((c) => c.category_name.toLowerCase().includes(searchTerm.toLowerCase()));

  // 💡 FIX: Extract the logic for displaying selected names for reusability
  const selectedCategoryNames = selectedCategories.map((catId) => {
    const found = categories.find((c) => c.id === catId);
    return found?.category_name || "Unknown";
  });


  return (
    // 💡 STYLING FIX: Remove unnecessary 'px-6' from the relative container
    // so the dropdown's absolute positioning aligns with the input below it.
    <div className="relative" ref={dropdownRef}>
      <label className="text-sm font-medium text-gray-700 mb-2 block px-6">Category</label>

      {/* Input container allows for display of selected items inside the "box" if desired */}
      <div className="px-6">
        <input
          type="text"
          placeholder={"Search or select category..."}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setOpen(true); // Open when typing
          }}
          onFocus={() => setOpen(true)} // Open when focused
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {open && (
        // 💡 STYLING FIX: Use 'inset-x-6' to account for the padding of the parent
        // or just ensure the wrapper of the input and dropdown has consistent padding.
        // We'll use absolute with left/right to span the full width of the input wrapper.
        <div className="absolute left-6 right-6 mt-2 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.id)}
                  onChange={(e) => handleCategoryToggle(cat.id, e.target.checked)}
                  className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                {cat.category_name}
              </label>
            ))
          ) : (
            <div className="text-gray-500 text-center py-2 text-sm">
              No categories found for "{searchTerm}"
            </div>
          )}
        </div>
      )}

      {/* Selected Categories - Displayed Below the Input */}
      {selectedCategoryNames.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 px-6">
          {selectedCategoryNames.map((name) => (
            <span
              key={name}
              className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium flex items-center"
            >
              {name}
              {/* Optional: Add a button to remove the category */}
              <button
                type="button"
                onClick={() => onCategoryChange(categories.find(c => c.category_name === name)?.id, false)}
                className="ml-2 text-indigo-800 hover:text-indigo-900"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
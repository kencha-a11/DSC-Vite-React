import React, { useRef, useEffect } from "react"; // ⬅️ IMPORT useRef and useEffect
import { PlusIcon } from "../../icons/index";

export default function HeaderControls({
  // ayon andito na tayo here makikita nanam natin itong variable na ito
  searchInput, // saan ito ginamit track natin
  setState, // bumalik siya dito kasi nabago yung value - balik tayo sa parent component
  dropdownOpen,
  setDropdownOpen,
}) {
  // 1. Create a ref for the dropdown container
  const dropdownRef = useRef(null);

  // 2. Add the click-outside logic
  useEffect(() => {
    function handleClickOutside(event) {
      // If the click is outside the dropdown container AND the dropdown is open
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && dropdownOpen) {
        setDropdownOpen(false);
      }
    }

    // Attach the event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen, setDropdownOpen]); // Rerun effect if dropdownOpen state changes

  return (
    <div className="flex items-center p-4 shrink-0 relative">
      {/* Search */}
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Search products"
          value={searchInput} // 
          onChange={(e) => setState("searchInput", e.target.value)} // here dito siya ginamit - sa onchange saan papunta itong onchange or setState
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
        />
      </div>

      {/* Manage Inventory Dropdown */}
      {/* 3. Attach the ref to the main dropdown container */}
      <div className="ml-4 relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-950 flex items-center gap-1"
        >
          Manage Inventory
          <PlusIcon className="w-4 h-4" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-lg z-10">
            {[
              { label: "+ Products", action: "showCreateProduct" },
              { label: "+ Category", action: "showCreateCategory" },
              { label: "- Category", action: "showRemoveCategory" },
              { label: "- Products", action: "showRemoveProducts" },
            ].map(({ label, action }) => (
              <button
                key={label}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setState(action, true);
                  setDropdownOpen(false); // ⬅️ OPTIONAL: Close dropdown on menu item click
                }}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
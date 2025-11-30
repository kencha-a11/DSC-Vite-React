import React, { useState, useEffect, useRef } from "react";
import Modal from "../../common/Modal";

export function EditProduct({ product, categories, isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    category_ids: product?.categories?.map(c => c.id) || [],
    price: product?.price || "",
    low_stock_threshold: product?.low_stock_threshold || 10,
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(product?.image_url || "");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        name: product.name,
        category_ids: product.categories?.map(c => c.id) || [],
        price: product.price,
        low_stock_threshold: product.low_stock_threshold || 10,
        image: null,
      });
      setPreviewUrl(product.image_url || "");
    }
  }, [isOpen, product]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCategorySelect = (id) => {
    if (!formData.category_ids.includes(id)) {
      setFormData(prev => ({
        ...prev,
        category_ids: [...prev.category_ids, id],
      }));
    }
    setDropdownOpen(false);
  };

  const handleRemoveCategory = (id) => {
    setFormData(prev => ({
      ...prev,
      category_ids: prev.category_ids.filter(cid => cid !== id),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price ?? "0");
      data.append("low_stock_threshold", formData.low_stock_threshold ?? "10");
      formData.category_ids.forEach((id) => data.append("category_ids[]", id));
      if (formData.image) data.append("image_path", formData.image);

      await onSuccess(data, product.id);
      onClose(); // close modal after update
    } catch (error) {
      console.error("Failed to update product:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedCategories = categories.filter(c => formData.category_ids.includes(c.id));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Product" maxWidth="2xl">
      <form onSubmit={handleSubmit}>
        {/* Image */}
        <div className="px-4 pt-4">
          <div className="relative cursor-pointer">
            <img
              src={previewUrl || "https://via.placeholder.com/400x200"}
              alt="Product Preview"
              className="w-full h-36 object-cover rounded-lg border border-purple-500 "
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Name */}
        <div className="px-4 pt-4">
          <label className="block text-sm font-semibold mb-1">Item name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-600 border-gray-200"
            required
          />
        </div>

        {/* Category Pills + Dropdown */}
        <div className="px-4 pt-4 relative" ref={dropdownRef}>
          <label className="block text-sm font-semibold mb-1">Categories</label>

          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="border rounded-md px-3 py-2 cursor-pointer flex justify-between items-center bg-white hover:border-purple-500 border-gray-200"
          >
            <span className="text-gray-600 text-sm">
              {dropdownOpen ? "Select a category..." : "Click to add category"}
            </span>
            <svg
              className={`w-4 h-4 transform transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {dropdownOpen && (
            <div className="absolute z-10 mt-1 w-[95%] bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto border-gray-200">
              {categories
                ?.filter(
                  (c) =>
                    c.category_name !== "All" &&
                    c.category_name !== "Uncategorized" &&
                    !formData.category_ids.includes(c.id) // 🔥 exclude already selected
                )
                .map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleCategorySelect(c.id)}
                    className="px-3 py-2 hover:bg-purple-100 cursor-pointer text-sm text-gray-700"
                  >
                    {c.category_name}
                  </div>
                ))}

              {/* If no more categories left */}
              {categories?.filter(
                (c) =>
                  c.category_name !== "All" &&
                  c.category_name !== "Uncategorized" &&
                  !formData.category_ids.includes(c.id)
              ).length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-400 text-center">
                    All categories selected
                  </div>
                )}
            </div>
          )}


          {/* Selected category pills */}
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedCategories.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-1 bg-purple-100 text-purple-700  rounded-full text-xs border border-purple-300"
                >
                  <span>{c.category_name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(c.id)}
                    className="text-purple-500 hover:text-purple-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price & Threshold */}
        <div className="grid grid-cols-2 gap-4 px-4 pt-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Price</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              className="w-full border rounded-md px-3 py-2 border-gray-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Low stock threshold</label>
            <input
              type="number"
              value={formData.low_stock_threshold}
              onChange={(e) => handleInputChange("low_stock_threshold", e.target.value)}
              className="w-full border rounded-md px-3 py-2 border-gray-200"
              required
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between gap-2 border-t border-gray-200 mt-4 p-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-5 py-2 bg-purple-600 text-white rounded-md">
            {loading ? "Updating..." : "Confirm"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

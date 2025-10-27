import React, { useState, useEffect, useRef } from "react";
import { createProduct } from "../../services/productServices";
import { UploadIcon, MinusIcon, PlusIcon } from "../icons";

export default function CreateProductModal({ onClose, onSuccess, setMessage, categories = [] }) {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [stockThreshold, setStockThreshold] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [productImage, setProductImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef(null);

  /** 🟢 Filter out invalid categories on mount */
  useEffect(() => {
    const validCategoryIds = categories
      .filter((c) => c.id > 0)
      .map((c) => c.id);
    
    setSelectedCategories((prev) => 
      prev.filter((id) => validCategoryIds.includes(id))
    );
  }, [categories]);

  /** 🟢 Close dropdown when clicking outside */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** 🟢 Handle category toggle */
  const handleCategoryChange = (e) => {
    const id = Number(e.target.value);
    
    // Ignore invalid IDs (0 or negative)
    if (id <= 0) return;
    
    setSelectedCategories((prev) =>
      e.target.checked ? [...prev, id] : prev.filter((c) => c !== id)
    );
  };

  /** 🟢 Handle image upload preview */
  const handleImageChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setProductImage(URL.createObjectURL(selected));
    }
  };

  /** 🟢 Form submission */
  const handleConfirm = async () => {
    if (!productName.trim()) {
      setMessage?.({ type: "error", text: "Product name is required." });
      return;
    }

    if (price <= 0) {
      setMessage?.({ type: "error", text: "Price must be greater than 0." });
      return;
    }

    try {
      setLoading(true);
      
      // Filter out any invalid category IDs before sending
      const validCategoryIds = selectedCategories.filter((id) => id > 0);
      
      const formData = new FormData();
      formData.append("name", productName);
      formData.append("price", price);
      formData.append("stock_quantity", quantity);
      formData.append("low_stock_threshold", stockThreshold || 0);
      
      // Only add valid categories
      validCategoryIds.forEach((id) => formData.append("category_ids[]", id));
      
      if (file) formData.append("image_path", file);

      console.log("📤 Sending:", {
        name: productName,
        price,
        stock_quantity: quantity,
        category_ids: validCategoryIds,
      });

      const response = await createProduct(formData);
      const product = response?.data?.product || response?.product || response?.data;

      console.log("✅ Product created:", product);

      if (product?.id) {
        setMessage?.({ type: "success", text: "Product created successfully!" });
        onSuccess?.();
        onClose?.();
      } else {
        setMessage?.({ type: "error", text: "Unexpected response from server." });
      }
    } catch (err) {
      console.error("❌ Product creation error:", err);
      console.error("❌ Response data:", err?.response?.data);

      const errorData = err?.response?.data;
      let message = "Something went wrong.";

      if (typeof errorData === "string") {
        message = errorData;
      } else if (errorData?.errors) {
        const validationErrors = Object.entries(errorData.errors)
          .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
          .join(" | ");
        message = validationErrors;
      } else if (errorData?.message) {
        message = errorData.message;
      }

      setMessage?.({ type: "error", text: message });
    } finally {
      setLoading(false);
    }
  };

  /** 🟢 Modal Markup */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 max-w-2xl w-full bg-white shadow-xl rounded-lg p-6 max-h-[90vh] overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h1>

        {/* 🟣 Image Upload */}
        <label
          htmlFor="product-image-upload"
          className="block w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 relative overflow-hidden mb-6"
        >
          {productImage ? (
            <img src={productImage} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <UploadIcon />
              <span className="text-sm font-medium">+ Add product image</span>
            </div>
          )}
          <input
            id="product-image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        {/* 🟣 Product Name */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter product name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* 🟣 Price */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Price</label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">₱</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              min="1"
              className="w-full pl-7 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* 🟣 Categories Dropdown */}
        <div className="mb-6 relative" ref={dropdownRef}>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
          <input
            type="text"
            placeholder="Search or select category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setOpen(true)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />

          {open && (
            <div className="absolute left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
              {categories.length > 0 ? (
                categories
                  .filter((c) => c.id !== 0 && c.id > 0)
                  .filter((c) =>
                    c.category_name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={cat.id}
                        checked={selectedCategories.includes(cat.id)}
                        onChange={handleCategoryChange}
                        className="mr-2"
                      />
                      {cat.category_name}
                    </label>
                  ))
              ) : (
                <div className="text-gray-500 text-center py-2">No categories</div>
              )}
            </div>
          )}
        </div>

        {/* 🟣 Selected Categories */}
        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedCategories.map((catId) => {
              const found = categories.find((c) => c.id === catId);
              return (
                <span
                  key={catId}
                  className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                >
                  {found?.category_name || "Unknown"}
                </span>
              );
            })}
          </div>
        )}

        {/* 🟣 Quantity + Threshold */}
        <div className="flex gap-6 mb-8">
          {/* Quantity */}
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Quantity</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2 border rounded-lg hover:bg-gray-100"
              >
                <MinusIcon />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                className="w-full text-center border rounded-lg py-3 font-semibold"
              />
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="p-2 border rounded-lg hover:bg-gray-100"
              >
                <PlusIcon />
              </button>
            </div>
          </div>

          {/* Threshold */}
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Low Stock Threshold
            </label>
            <input
              type="number"
              value={stockThreshold}
              onChange={(e) => setStockThreshold(e.target.value)}
              min="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* 🟣 Footer */}
        <div className="pt-4 border-t flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleConfirm}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
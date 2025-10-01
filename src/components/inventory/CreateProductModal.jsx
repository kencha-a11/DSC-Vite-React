import React, { useState, useEffect, useRef } from "react";
import { createProduct } from "../../services/productServices";

// --- Simple Inline Icons ---
const PlusIcon = () => <span className="text-xl font-bold">+</span>;
const MinusIcon = () => <span className="text-xl font-bold align-top">-</span>;
const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-8 h-8 mb-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
    />
  </svg>
);

// Demo categories (replace with API data if needed)
const categories = ["Electronics", "Apparel", "Home Goods", "Books", "Groceries", "Uncategorized"];

const CreateProductModal = ({ onClose, onSuccess }) => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState(["Uncategorized"]);
  const [quantity, setQuantity] = useState(1);
  const [stockThreshold, setStockThreshold] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
const dropdownRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);


  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedCategories((prev) =>
        [...prev, value].filter((v, i, a) => a.indexOf(v) === i && v !== "")
      );
    } else {
      setSelectedCategories((prev) => prev.filter((c) => c !== value));
    }
  };

  const handleImageChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setProductImage(URL.createObjectURL(selected));
    }
  };

  const handleConfirm = async () => {
    if (!productName.trim()) {
      alert("⚠️ Product name is required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", productName);
      formData.append("price", price);
      formData.append("stock_quantity", quantity);
      formData.append("low_stock_threshold", stockThreshold || 0);

      selectedCategories.forEach((c) => formData.append("category_ids[]", c));
      if (file) formData.append("image_path", file);

      await createProduct(formData);

      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 max-w-2xl w-full bg-white shadow-xl rounded-lg p-6">
        <form onSubmit={(e) => e.preventDefault()}>
          {/* --- Section A: Title --- */}
          <section className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Add New Product</h1>
          </section>

          {/* --- Section B: Product Image --- */}
          <section className="mb-8">
            <label
              htmlFor="product-image-upload"
              className="block w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 relative overflow-hidden"
            >
              {productImage ? (
                <img
                  src={productImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
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
          </section>

          {/* --- Section C: Product Name --- */}
          <section className="mb-8">
            <div className="text-sm font-medium text-gray-700 mb-1">Product Name</div>
            <input
              type="text"
              placeholder="Enter name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </section>

          {/* --- Section D: Price --- */}
          <section className="mb-8">
            <div className="text-sm font-medium text-gray-700 mb-1">Set Price</div>
            <div className="relative">
              <span className="absolute left-0 top-0 mt-3 ml-3 text-gray-500">₱</span>
              <input
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                min="1"
                className="w-full pl-7 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </section>

{/* --- Section E: Category (Multiple Selection, Default Uncategorized) --- */}
<section className="mb-8 relative" ref={dropdownRef}>
  <div className="text-sm font-medium text-gray-700 mb-2">Category</div>

  <div className="p-3 border border-gray-300 rounded-lg">
    {/* Selected Categories */}
    <div className="flex flex-wrap justify-center gap-2 mb-3 min-h-[30px]">
      {selectedCategories.map((cat) => (
        <span
          key={cat}
          className="inline-flex items-center px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-800 rounded-full"
        >
          {cat}
        </span>
      ))}
    </div>

    {/* Dropdown Toggle */}
    <button
      type="button"
      onClick={() => setOpen((prev) => !prev)}
      className="w-full px-4 py-2 text-indigo-600 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium flex justify-center"
    >
      Select Categories
    </button>

    {/* Dropdown Menu */}
    {open && (
      <div className="absolute left-0 right-0 mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
        {categories.map((cat) => (
          <label
            key={cat}
            className="flex items-center space-x-2 py-2 px-3 cursor-pointer hover:bg-gray-100 border border-gray-200 rounded-md"
          >
            <input
              type="checkbox"
              value={cat}
              checked={selectedCategories.includes(cat)}
              onChange={handleCategoryChange}
              className="form-checkbox text-indigo-600 rounded"
            />
            <span>{cat}</span>
          </label>
        ))}
      </div>
    )}
  </div>
</section>



          {/* --- Section F: Quantity & Threshold --- */}
          <section className="mb-8 flex gap-8">
            {/* Quantity */}
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700 mb-1">Quantity</div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition w-10 h-10 flex items-center justify-center"
                >
                  <MinusIcon />
                </button>
                <div className="flex-1 text-center py-3 border border-gray-300 rounded-lg font-semibold">
                  {quantity}
                </div>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition w-10 h-10 flex items-center justify-center"
                >
                  <PlusIcon />
                </button>
              </div>
            </div>

            {/* Stock Threshold */}
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700 mb-1">Set Stock Threshold</div>
              <input
                type="number"
                placeholder="Enter low stock threshold"
                value={stockThreshold}
                onChange={(e) => setStockThreshold(e.target.value)}
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </section>

          {/* --- Section G: Actions --- */}
          <section className="pt-6 border-t border-gray-200 flex justify-between items-center">
            {/* Cancel (Left) */}
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            {/* Confirm (Right) */}
            <button
              type="submit"
              disabled={loading}
              onClick={handleConfirm}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-md disabled:opacity-50"
            >
              {loading ? "Saving..." : "Confirm"}
            </button>
          </section>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;

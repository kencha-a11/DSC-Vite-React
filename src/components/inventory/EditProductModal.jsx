import React, { useState, useEffect, useRef } from "react";
import { PlusIcon, MinusIcon, UploadIcon } from "../icons";
import { updateProduct, deleteProduct } from "../../services/productServices";

const EditProductModal = ({ product, categories = [], onClose, onSuccess, setMessage, onDelete }) => {
  const [productName, setProductName] = useState(product.name || "");
  const [price, setPrice] = useState(Number(product.price) || 1);
  const [selectedCategories, setSelectedCategories] = useState(
    Array.isArray(product.categories) ? product.categories.map((c) => c.id) : []
  );
  const [quantity, setQuantity] = useState(Number(product.stock_quantity) || 1);
  const [stockThreshold, setStockThreshold] = useState(Number(product.low_stock_threshold) || 0);
  const [productImage, setProductImage] = useState(product.image || null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  /** Close dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryChange = (e) => {
    const id = Number(e.target.value);
    if (id <= 0) return;
    setSelectedCategories((prev) => (e.target.checked ? [...prev, id] : prev.filter((c) => c !== id)));
  };

  const handleImageChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setProductImage(URL.createObjectURL(selected));
    }
  };

  /** Save product smoothly */
  const handleSave = async () => {
    if (!productName.trim()) {
      setMessage?.({ type: "error", text: "Product name is required." });
      return;
    }
    if (!price || price <= 0) {
      setMessage?.({ type: "error", text: "Price must be greater than 0." });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", productName);
      formData.append("price", Number(price));
      formData.append("stock_quantity", Number(quantity));
      formData.append("low_stock_threshold", Number(stockThreshold));

      selectedCategories.filter((id) => id > 0)
        .forEach((id) => formData.append("category_ids[]", Number(id)));

      if (file) formData.append("image_path", file);

      await updateProduct(product.id, formData);

      setMessage?.({ type: "success", text: "Product updated successfully!" });
      onClose?.();
      onSuccess?.();
    } catch (err) {
      console.error("❌ Update error:", err);
      const errors = err?.response?.data?.errors;
      const message = errors
        ? Object.entries(errors).map(([k, v]) => `${k}: ${v.join(", ")}`).join(" | ")
        : "Failed to update product.";
      setMessage?.({ type: "error", text: message });
    } finally {
      setLoading(false);
    }
  };

  /** Delete product smoothly */
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      setLoading(true);
      await deleteProduct(product.id);
      setMessage?.({ type: "success", text: "Product deleted successfully!" });
      onClose?.();
      onDelete?.();
    } catch (err) {
      console.error("❌ Delete error:", err);
      setMessage?.({ type: "error", text: "Failed to delete product." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 max-w-2xl w-full bg-white shadow-xl rounded-lg p-6 max-h-[90vh] overflow-y-auto scrollbar-thin">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Product</h1>

        {/* Image Upload */}
        <section className="mb-8">
          <label
            htmlFor="edit-product-image-upload"
            className="block w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 relative overflow-hidden"
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
              id="edit-product-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </section>

        {/* Product Name */}
        <section className="mb-8">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Product Name</label>
          <input
            type="text"
            placeholder="Enter name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </section>

        {/* Price */}
        <section className="mb-8">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Set Price</label>
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

        {/* Categories */}
        <section className="mb-8 relative" ref={dropdownRef}>
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
            <div className="absolute left-0 right-0 mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto scrollbar-thin z-10">
              {categories
                .filter((cat) => cat.category_name.toLowerCase().includes(searchTerm.toLowerCase()))
                .filter((c) => c.id > 0)
                .map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center space-x-2 py-2 px-3 cursor-pointer hover:bg-gray-100 border border-gray-200 rounded-md"
                  >
                    <input
                      type="checkbox"
                      value={cat.id}
                      checked={selectedCategories.includes(cat.id)}
                      onChange={handleCategoryChange}
                      className="form-checkbox text-indigo-600 rounded"
                    />
                    <span>{cat.category_name}</span>
                  </label>
                ))}
            </div>
          )}
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 max-h-24 overflow-y-auto scrollbar-thin">
              {selectedCategories.map((cat) => {
                const found = categories.find((c) => c.id === cat);
                return (
                  <span
                    key={cat}
                    className="inline-flex items-center px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-800 rounded-full"
                  >
                    {found?.category_name || "Empty Category"}
                  </span>
                );
              })}
            </div>
          )}
        </section>

        {/* Quantity & Threshold */}
        <section className="mb-8 flex gap-8">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Quantity</label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 w-10 h-10 flex items-center justify-center"
              >
                <MinusIcon />
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                className="w-full text-center py-3 border border-gray-300 rounded-lg font-semibold focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
                className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 w-10 h-10 flex items-center justify-center"
              >
                <PlusIcon />
              </button>
            </div>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Low Stock Threshold</label>
            <input
              type="number"
              value={stockThreshold}
              onChange={(e) => setStockThreshold(Number(e.target.value))}
              min="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </section>

        {/* Footer */}
        <section className="pt-6 border-t border-gray-200 flex justify-between items-center sticky bottom-0 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100"
          >
            Cancel
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 shadow-md disabled:opacity-50"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-md disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EditProductModal;

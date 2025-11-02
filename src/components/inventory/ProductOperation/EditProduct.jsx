import React, { useState } from "react";

export function EditProduct({ product, categories, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    category_id: product?.category_id || "",
    price: product?.price || "",
    low_stock_threshold: product?.low_stock_threshold || 10,
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(product?.image_url || "");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category_id", formData.category_id);
      data.append("price", formData.price);
      data.append("low_stock_threshold", formData.low_stock_threshold);

      // Image is optional - only append if a new image was selected
      if (formData.image) {
        data.append("image", formData.image);
      }

      await onSuccess(data);
    } catch (error) {
      console.error("Failed to update product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="w-96 bg-white border-2 border-purple-600 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 p-4">
            Edit item
          </h2>

          {/* Image Preview */}
          <div className="p-4">
            <div className="relative cursor-pointer">
              <img
                src={previewUrl || "https://via.placeholder.com/400x200"}
                alt="Product Preview"
                className="w-full h-36 object-cover rounded-lg"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Click image to change</p>
          </div>

          {/* Item Name */}
          <div className="p-4">
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Item name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Category */}
          <div className="p-4">
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Category
            </label>
            <div className="relative">
              <select
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="">Please select an item (optional)</option>
                {categories
                  ?.filter(
                    (c) =>
                      c.category_name !== "All" && c.category_name !== "Uncategorized"
                  )
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.category_name}
                    </option>
                  ))}
              </select>
              <span className="absolute right-3 top-2.5 text-gray-500 pointer-events-none">
                ▼
              </span>
            </div>
          </div>


          {/* Price and Stock Threshold */}
          <div className="grid grid-cols-2 gap-4 p-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Price
              </label>
              <div className="flex items-center border border-gray-300 rounded-md px-2 py-2 text-sm text-gray-700 focus-within:ring-2 focus-within:ring-purple-600">
                <span className="mr-2 text-gray-600">₱</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="flex-1 outline-none bg-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Set stock threshold
              </label>
              <input
                type="number"
                value={formData.low_stock_threshold}
                onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-between border-t border-gray-200 p-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-600 font-medium hover:bg-gray-300 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-purple-600 text-white font-medium hover:bg-purple-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Updating..." : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
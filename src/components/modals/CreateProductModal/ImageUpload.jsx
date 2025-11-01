import React from "react";
import { UploadIcon } from "../../icons/index";

export default function ImageUpload({ image, onChange }) {
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) onChange(file);
  };

  return (
    <div className="px-6 pt-6">
      <label
        htmlFor="product-image-upload"
        className="block w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 relative overflow-hidden"
      >
        {image ? (
          <img src={image} alt="Preview" className="w-full h-full object-cover" />
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
          onChange={handleChange}
          className="hidden"
        />
      </label>
    </div>
  );
}
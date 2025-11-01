import { useState, useEffect } from "react";
import { createProduct } from "../../../services/productServices";

export function useCreateProductForm({ onClose, onSuccess, setMessage, categories }) {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [stockThreshold, setStockThreshold] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [productImage, setProductImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filter out invalid categories on mount
  useEffect(() => {
    const validCategoryIds = categories
      .filter((c) => c.id > 0)
      .map((c) => c.id);
    
    setSelectedCategories((prev) => 
      prev.filter((id) => validCategoryIds.includes(id))
    );
  }, [categories]);

  // Handle category toggle
  const handleCategoryChange = (categoryId, isChecked) => {
    if (categoryId <= 0) return;
    
    setSelectedCategories((prev) =>
      isChecked ? [...prev, categoryId] : prev.filter((c) => c !== categoryId)
    );
  };

  // Handle image upload preview
  const handleImageChange = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      setProductImage(URL.createObjectURL(selectedFile));
    }
  };

  // Form validation
  const validateForm = () => {
    if (!productName.trim()) {
      setMessage?.({ type: "error", text: "Product name is required." });
      return false;
    }

    if (price <= 0) {
      setMessage?.({ type: "error", text: "Price must be greater than 0." });
      return false;
    }

    return true;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const validCategoryIds = selectedCategories.filter((id) => id > 0);
      
      const formData = new FormData();
      formData.append("name", productName);
      formData.append("price", price);
      formData.append("stock_quantity", quantity);
      formData.append("low_stock_threshold", stockThreshold || 0);
      
      validCategoryIds.forEach((id) => formData.append("category_ids[]", id));
      
      if (file) formData.append("image_path", file);

      const response = await createProduct(formData);
      const product = response?.data?.product || response?.product || response?.data;

      if (product?.id) {
        setMessage?.({ type: "success", text: "Product created successfully!" });
        onSuccess?.();
        onClose?.();
      } else {
        setMessage?.({ type: "error", text: "Unexpected response from server." });
      }
    } catch (err) {
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

  return {
    formState: {
      productName,
      price,
      quantity,
      stockThreshold,
      selectedCategories,
      productImage,
    },
    handlers: {
      setProductName,
      setPrice,
      setQuantity,
      setStockThreshold,
      handleCategoryChange,
      handleImageChange,
    },
    loading,
    handleSubmit,
  };
}
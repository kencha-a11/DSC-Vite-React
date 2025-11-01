import { useCreateProductForm } from "./useCreateProductForm";
import Modal from "../../common/Modal";

import {
    ImageUpload,
    ProductNameInput,
    PriceInput,
    CategorySelector,
    QuantityInput,
    ThresholdInput,
} from './index'

export default function CreateProductModal({ onClose, onSuccess, setMessage, categories = [] }) {
  const {
    formState,
    handlers,
    loading,
    handleSubmit,
  } = useCreateProductForm({ onClose, onSuccess, setMessage, categories });

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Add new item"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <ImageUpload
          image={formState.productImage}
          onChange={handlers.handleImageChange}
        />

        <ProductNameInput
          value={formState.productName}
          onChange={handlers.setProductName}
        />

        <PriceInput
          value={formState.price}
          onChange={handlers.setPrice}
        />

        <CategorySelector
          categories={categories}
          selectedCategories={formState.selectedCategories}
          onCategoryChange={handlers.handleCategoryChange}
        />

        <div className="grid grid-cols-2 gap-6 px-6">
          <QuantityInput
            value={formState.quantity}
            onChange={handlers.setQuantity}
          />
          <ThresholdInput
            value={formState.stockThreshold}
            onChange={handlers.setStockThreshold}
          />
        </div>

        <div className="pt-4 border-t-2 border-gray-200 flex justify-between gap-4 p-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Confirm"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

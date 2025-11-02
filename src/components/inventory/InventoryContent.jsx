// InventoryContent.jsx
import React from "react";
import HeaderControls from "./InventoryContent/HeaderControl";
import TableHeader from "./InventoryContent/TableHeader";
import ProductTable from "./InventoryContent/ProductTable";
import MessageToast from "../MessageToast";

import { useInventoryHandlers } from "../../hooks/useInventoryhandlers";
import { useProductOperationHandler } from "./ProductOperation/useProductOperationHandler";

// ✅ Import modals
import CreateCategoryModal from "../modals/CreateCategoryModal";
import CreateProductModal from "../modals/CreateProductModal";
import RemoveMultipleProductsModal from "../modals/RemoveMultipleProductModal/RemoveMultipleProductsModal";
import RemoveMultipleCategoriesModal from "../modals/RemoveMultipleCategoriesModal/RemoveMultipleCategoriesModal";

// ✅ Import product operation components
import { EditProduct } from "./ProductOperation/EditProduct";
import { RestockProduct } from "./ProductOperation/RestockProduct";
import { DeductProduct } from "./ProductOperation/DeductProduct";
import { RemoveProduct } from "./ProductOperation/RemoveProduct";

export default function InventoryContent() {
  const {
    state,
    setState,
    handlers,
    categories,
    filteredPages,
    loaderRef,
    message,
    refetch,
    refetchCategories,
  } = useInventoryHandlers();

  // ✅ Product operation handlers
  const productOperations = useProductOperationHandler({
    setState,
    setMessage: setState.setMessage,
    refetch,
  });

  return (
    <div className="flex flex-col h-204 bg-white rounded-xl shadow m-4 border border-gray-200">

      {/* Header with search and dropdown */}
      <HeaderControls
        searchInput={state.searchInput}
        setState={setState.set}
        dropdownOpen={state.dropdownOpen}
        setDropdownOpen={setState.setDropdownOpen}
      />

      {/* Table Header with filters */}
      <TableHeader
        selectedCategory={state.selectedCategory}
        statusFilter={state.statusFilter}
        setState={setState.set}
        categories={categories}
      />

      {/* Product Table */}
      <ProductTable
        productsPages={filteredPages}
        getStatus={handlers.getStatus}
        onEditProduct={(product) => setState.setEditProduct(product)}
        onRestockProduct={(product) => setState.setRestockProduct(product)}
        onDeductProduct={(product) => setState.setDeductProduct(product)}
        onRemoveProduct={(product) => setState.setRemoveProduct(product)}
        loaderRef={loaderRef}
        isFetchingNextPage={handlers.isFetchingNextPage}
      />

      {/* ✅ Category & Product Creation/Removal Modals */}
      {state.showCreateCategory && (
        <CreateCategoryModal
          categories={categories}
          setMessage={setState.setMessage}
          onClose={() => setState.set("showCreateCategory", false)}
          onSuccess={() => {
            setState.set("showCreateCategory", false);
            setState.setMessage({ type: "success", text: "Category created successfully!" });
            refetch();
            refetchCategories();
          }}
        />
      )}

      {state.showCreateProduct && (
        <CreateProductModal
          categories={categories}
          setMessage={setState.setMessage}
          onClose={() => setState.set("showCreateProduct", false)}
          onSuccess={() => {
            setState.set("showCreateProduct", false);
            setState.setMessage({ type: "success", text: "Product created successfully!" });
            refetch();
          }}
        />
      )}

      {state.showRemoveCategory && (
        <RemoveMultipleCategoriesModal
          categories={categories.filter(c => c.category_name !== "All" && c.category_name !== "Uncategorized")}
          onClose={() => setState.set("showRemoveCategory", false)}
          onSuccess={() => {
            setState.set("showRemoveCategory", false);
            setState.setMessage({ type: "success", text: "Categories removed successfully!" });
            refetchCategories();
            refetch();
          }}
        />
      )}

      {state.showRemoveProducts && (
        <RemoveMultipleProductsModal
          products={filteredPages.flatMap(page => page.data || [])}
          onClose={() => setState.set("showRemoveProducts", false)}
          onSuccess={() => {
            setState.set("showRemoveProducts", false);
            setState.setMessage({ type: "success", text: "Products removed successfully!" });
            refetch();
          }}
        />
      )}

      {/* 🧩 Edit Product Modal */}
      {state.editProduct && (
        <EditProduct
          product={state.editProduct}
          categories={categories}
          onClose={() => setState.setEditProduct(null)}
          onSuccess={(formData) => 
            productOperations.handleEditProduct(state.editProduct.id, formData)
          }
        />
      )}

      {/* 🧩 Restock Product Modal */}
      {state.restockProduct && (
        <RestockProduct
          product={state.restockProduct}
          onClose={() => setState.setRestockProduct(null)}
          onSuccess={(quantity) => 
            productOperations.handleRestockProduct(state.restockProduct.id, quantity)
          }
        />
      )}

      {/* 🧩 Deduct Product Modal */}
      {state.deductProduct && (
        <DeductProduct
          product={state.deductProduct}
          onClose={() => setState.setDeductProduct(null)}
          onSuccess={(quantity, reason) => 
            productOperations.handleDeductProduct(state.deductProduct.id, quantity, reason)
          }
        />
      )}

      {/* 🧩 Remove Product Modal */}
      {state.removeProduct && (
        <RemoveProduct
          product={state.removeProduct}
          onClose={() => setState.setRemoveProduct(null)}
          onSuccess={() => 
            productOperations.handleRemoveProduct(state.removeProduct.id)
          }
        />
      )}

      {/* Toast Messages */}
      <MessageToast
        message={message}
        onClose={() => setState.setMessage(null)}
      />
    </div>
  );
}
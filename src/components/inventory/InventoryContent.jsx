import React from "react";
import HeaderControls from "./InventoryContent/HeaderControl";
import TableHeader from "./InventoryContent/TableHeader";
import ProductTable from "./InventoryContent/ProductTable";
import MessageToast from "../MessageToast";

import { useInventoryHandler } from "./InventoryContent/useInventoryHandler";
import { useProductOperationHandler } from "./ProductOperation/useProductOperationHandler";

// ✅ Import modals
import CreateCategoryModal from "../modals/CreateCategoryModal";
import CreateProductModal from "../modals/CreateProductModal";
import RemoveMultipleProductsModal from "../modals/RemoveMultipleProductModal/RemoveMultipleProductsModal";
import RemoveMultipleCategoriesModal from "../modals/RemoveMultipleCategoriesModal/RemoveMultipleCategoriesModal";

// ✅ Import other product operation components
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
  } = useInventoryHandler();

  // ✅ Centralized product operation handlers
  const productOperations = useProductOperationHandler({
    setState,
    setMessage: setState.setMessage,
  });

  const { getStatus, isFetchingNextPage } = handlers;

  return (
    <div className="flex flex-col h-[88vh] bg-white rounded-xl shadow m-4 border border-gray-200">
      {/* Header */}
      <HeaderControls
        searchInput={state.searchInput}
        setState={setState.set}
        dropdownOpen={state.dropdownOpen}
        setDropdownOpen={setState.setDropdownOpen}
      />

      {/* Table Header */}
      <TableHeader
        selectedCategory={state.selectedCategory}
        statusFilter={state.statusFilter}
        setState={setState.set}
        categories={categories}
      />

      {/* Product Table */}
      <ProductTable
        productsPages={filteredPages}
        categories={categories}
        getStatus={getStatus}
        // ✅ Open operation modals instead of instant actions
        onRestockProduct={(product) => setState.setRestockProduct(product)}
        onDeductProduct={(product) => setState.setDeductProduct(product)}
        onRemoveProduct={(product) => setState.setRemoveProduct(product)}
        loaderRef={loaderRef}
        isFetchingNextPage={isFetchingNextPage}
        onEditProduct={(product, formData) =>
          productOperations.handleEditProduct(product.id, formData)
        }
      />

      {/* ✅ Category & Product Management Modals */}
      {state.showCreateCategory && (
        <CreateCategoryModal
          categories={categories}
          setMessage={setState.setMessage}
          onClose={() => setState.set("showCreateCategory", false)}
          onSuccess={() => {
            setState.set("showCreateCategory", false);
            setState.setMessage({
              type: "success",
              text: "Category created successfully!",
            });
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
            setState.setMessage({
              type: "success",
              text: "Product created successfully!",
            });
            refetch();
          }}
        />
      )}

      {state.showRemoveCategory && (
        <RemoveMultipleCategoriesModal
          categories={categories.filter(
            (c) => c.category_name !== "All" && c.category_name !== "Uncategorized"
          )}
          onClose={() => setState.set("showRemoveCategory", false)}
          onSuccess={() => {
            setState.set("showRemoveCategory", false);
            setState.setMessage({
              type: "success",
              text: "Categories removed successfully!",
            });
            refetchCategories();
            refetch();
          }}
        />
      )}

      {state.showRemoveProducts && (
        <RemoveMultipleProductsModal
          products={filteredPages.flatMap((page) => page.data || [])}
          onClose={() => setState.set("showRemoveProducts", false)}
          onSuccess={() => {
            setState.set("showRemoveProducts", false);
            setState.setMessage({
              type: "success",
              text: "Products removed successfully!",
            });
            refetch();
          }}
        />
      )}

      {/* ✅ Restock Modal */}
      {state.restockProduct && (
        <RestockProduct
          product={state.restockProduct}
          onClose={() => setState.setRestockProduct(null)}
          onSuccess={async (quantity) => {
            try {
              await productOperations.handleRestockProduct(
                state.restockProduct.id,
                quantity
              );
              setState.setRestockProduct(null);
              setState.setMessage({
                type: "success",
                text: "Product restocked successfully!",
              });
              refetch();
            } catch (error) {
              console.error(error);
              setState.setMessage({
                type: "error",
                text: "Failed to restock product.",
              });
            }
          }}
        />
      )}

      {/* ✅ Deduct Modal */}
      {state.deductProduct && (
        <DeductProduct
          product={state.deductProduct}
          onClose={() => setState.setDeductProduct(null)}
          onSuccess={async (quantity, reason) => {
            try {
              await productOperations.handleDeductProduct(
                state.deductProduct.id,
                quantity,
                reason
              );
              setState.setDeductProduct(null);
              setState.setMessage({
                type: "success",
                text: "Product deducted successfully!",
              });
              refetch();
            } catch (error) {
              console.error(error);
              setState.setMessage({
                type: "error",
                text: "Failed to deduct product.",
              });
            }
          }}
        />
      )}

      {/* ✅ Remove Modal */}
      {state.removeProduct && (
        <RemoveProduct
          product={state.removeProduct}
          isOpen={true}
          onClose={() => setState.setRemoveProduct(null)}
          onSuccess={async () => {
            try {
              await productOperations.handleRemoveProduct(state.removeProduct.id);
              setState.setRemoveProduct(null);
              setState.setMessage({
                type: "success",
                text: "Product removed successfully!",
              });
              refetch();
            } catch (error) {
              console.error(error);
              setState.setMessage({
                type: "error",
                text: "Failed to remove product.",
              });
            }
          }}
        />
      )}

      {/* ✅ Toast Messages */}
      <MessageToast message={message} onClose={() => setState.setMessage(null)} />
    </div>
  );
}

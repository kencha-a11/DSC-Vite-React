import React from "react";
import HeaderControls from "./InventoryContent/HeaderControl";
import TableHeader from "./InventoryContent/TableHeader";
import ProductTable from "./InventoryContent/ProductTable";
import MessageToast from "../MessageToast";

import { useInventoryHandlers } from "../../hooks/useInventoryhandlers";

// ✅ Import modals
import CreateCategoryModal from "../modals/CreateCategoryModal";
import CreateProductModal from "../modals/CreateProductModal";
// import EditProductModal from "../modals/EditProductModal";
// import RemoveMultipleProductsModal from "../modals/RemoveMultipleProductsModal";
// import RemoveMultipleCategoriesModal from "../modals/RemoveMultipleCategoriesModal";

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
        onEditProduct={setState.setEditProduct}
        loaderRef={loaderRef}
        isFetchingNextPage={handlers.isFetchingNextPage}
      />

      {/* ✅ Modals - show based on state */}
      {state.showCreateCategory && (
        <CreateCategoryModal
          categories={categories}
          setMessage={setState.setMessage}
          onClose={() => setState.set("showCreateCategory", false)}
          onSuccess={() => {
            setState.set("showCreateCategory", false);
            setState.setMessage({ type: "success", text: "✅ Category created successfully!" });
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
            setState.setMessage({ type: "success", text: "✅ Product created successfully!" });
            refetch();
          }}
        />
      )}

      {/* Uncomment and implement as needed */}
      {/* 
      {state.editProduct && (
        <EditProductModal
          product={state.editProduct}
          categories={categories}
          setMessage={setState.setMessage}
          onClose={() => setState.setEditProduct(null)}
          onSuccess={() => {
            setState.setEditProduct(null);
            setState.setMessage({ type: "success", text: "Product updated successfully!" });
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
      */}

      {/* Toast Messages */}
      <MessageToast
        message={message}
        onClose={() => setState.setMessage(null)}
      />
    </div>
  );
}

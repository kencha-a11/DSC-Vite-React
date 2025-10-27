import CreateCategoryModal from "../inventory/CreateCategoryModal";
import CreateProductModal from "../inventory/CreateProductModal";
import EditProductModal from "../inventory/EditProductModal";
import RemoveMultipleCategoriesModal from "../inventory/RemoveMultipleCategoriesModal";
import RemoveMultipleProductsModal from "../../components/inventory/RemoveMultipleProductsModal";
import MessageToast from "../MessageToast";
import { useState, useMemo, useRef, useEffect } from "react";
import { SearchIcon, SettingsIcon, PlusIcon } from "../icons";
import { useProductsData } from "../../hooks/useProductsData";
import { useFilteredProducts } from "../../hooks/useFilteredProduct";
import { useCategories } from "../../hooks/useCategories";

export default function InventoryContent() {
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [showRemoveCategory, setShowRemoveCategory] = useState(false);
  const [showRemoveProducts, setShowRemoveProducts] = useState(false);
  const [message, setMessage] = useState(null);

  const dropdownRef = useRef(null);
  const loaderRef = useRef(null);

  // ✅ Fetch categories with refetch support
  const { data: categoriesData = [], refetch: refetchCategories } = useCategories();

  const categories = useMemo(
    () => [{ id: 0, category_name: "All" }, ...categoriesData],
    [categoriesData]
  );

  const [selectedCategory, setSelectedCategory] = useState("All");

  // ✅ Fetch products
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useProductsData({
      search: searchInput,
      category: selectedCategory,
      perPage: 10,
    });

  const products = data?.pages?.flatMap((page) => page.data) ?? [];

  const { filteredProducts } = useFilteredProducts(products);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Infinite scroll
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loaderRef, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const getStatus = (p) => {
    const stock = p.stock_quantity ?? 0;
    const threshold = p.low_stock_threshold ?? 10;
    return stock === 0 ? "out of stock" : stock <= threshold ? "low stock" : "stock";
  };

  const statusOrder = { "out of stock": 0, "low stock": 1, stock: 2 };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white rounded shadow">
      {/* Search + Manage Inventory */}
      <div className="flex items-center p-4 border-b shrink-0 relative">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="ml-4 relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-1"
          >
            Manage Inventory
            <PlusIcon className="w-4 h-4" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-lg z-10">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setShowCreateProduct(true);
                  setDropdownOpen(false);
                }}
              >
                + Products
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setShowCreateCategory(true);
                  setDropdownOpen(false);
                }}
              >
                + Category
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setShowRemoveCategory(true);
                  setDropdownOpen(false);
                }}
              >
                - Category
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setShowRemoveProducts(true);
                  setDropdownOpen(false);
                }}
              >
                - Products
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Table */}
      <div className="flex-1 overflow-auto p-4">
        <div className="min-w-full">
          <div className="grid grid-cols-[60px_2fr_100px_1fr_1.5fr_1fr_60px] gap-4 text-gray-500 font-semibold py-2 px-2 border-b">
            <div>Image</div>
            <div className="truncate">Product Name</div>
            <div>Price</div>
            <div>Quantity</div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:border-blue-300"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.category_name}>
                    {c.category_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="">Status</option>
                {["stock", "low stock", "out of stock"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-right">Actions</div>
          </div>

          <div className="space-y-2 mt-2">
            {filteredProducts.length === 0 ? (
              <div className="text-center text-sm text-gray-500 py-8">
                No products found
              </div>
            ) : (
              filteredProducts
                .sort((a, b) => statusOrder[getStatus(a)] - statusOrder[getStatus(b)])
                .map((p) => (
                  <div
                    key={p.id}
                    className="grid grid-cols-[60px_2fr_100px_1fr_1.5fr_1fr_60px] gap-4 items-center p-2 border rounded hover:bg-gray-50"
                  >
                    <div>
                      <img
                        src={p.image || `https://via.placeholder.com/40?text=${p.name?.[0] || "P"}`}
                        alt={p.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    </div>
                    <div className="truncate">{p.name}</div>
                    <div>₱{Number(p.price ?? 0).toFixed(2)}</div>
                    <div>{p.stock_quantity ?? 0}</div>
                    <div className="truncate">
                      {p.categories?.map(c => c.name).join(", ") || "Uncategorized"}
                    </div>
                    <div>{getStatus(p)}</div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => setEditProduct(p)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <SettingsIcon className="w-5 h-5 cursor-pointer" />
                      </button>
                    </div>
                  </div>
                ))
            )}
            <div ref={loaderRef} className="h-10"></div>
            {isFetchingNextPage && <div className="text-center py-2">Loading more...</div>}
          </div>
        </div>
      </div>

      {/* ✅ Modals */}
      {showCreateCategory && (
        <CreateCategoryModal
          products={products}
          onClose={() => setShowCreateCategory(false)}
          setMessage={setMessage}
          onSuccess={() => {
            refetchCategories();
            setShowCreateCategory(false);
            setMessage({ type: "success", text: "Category created!" });
          }}
        />
      )}

      {showRemoveCategory && (
        <RemoveMultipleCategoriesModal
          products={products}
          onClose={() => setShowRemoveCategory(false)}
          setMessage={setMessage}
        />
      )}

      {showCreateProduct && (
        <CreateProductModal
          categories={categoriesData}  // ← Pass categoriesData instead of categories
          onClose={() => setShowCreateProduct(false)}
          onSuccess={() => {
            setShowCreateProduct(false);
            refetch();
            setMessage({ type: "success", text: "Product created!" });
          }}
        />
      )}

      {showCreateProduct && (
        <CreateProductModal
          categories={categoriesData}
          onClose={() => setShowCreateProduct(false)}
          onSuccess={async () => {
            console.log("🔄 Product created - refetching data...");
            await refetch(); // Refetch the product list
            setShowCreateProduct(false);
          }}
          setMessage={setMessage}
        />
      )}

      {editProduct && (
        <EditProductModal
          product={editProduct}
          categories={categoriesData}
          onClose={() => setEditProduct(null)}
          onSuccess={async () => {
            console.log("🔄 Product updated - refetching data...");
            await refetch();
            setEditProduct(null);
          }}
          onDelete={async () => {
            console.log("🔄 Product deleted - refetching data...");
            await refetch();
            setEditProduct(null);
          }}
          setMessage={setMessage}
        />
      )}

      {showRemoveProducts && (
        <RemoveMultipleProductsModal
          onClose={() => setShowRemoveProducts(false)}
          setMessage={setMessage}
        />
      )}


      <MessageToast message={message} onClose={() => setMessage(null)} />
    </div>
  );
}

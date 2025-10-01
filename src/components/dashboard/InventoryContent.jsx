import { useState, useMemo, useRef, useEffect } from "react";
import { SearchIcon, SettingsIcon, PlusIcon } from "../icons/index";
import { useProductsData } from "../../hooks/useProductsData";
import { useCategories } from "../../hooks/useCategories";
import CreateCategoryModal from "../inventory/CreateCategoryModal";
import CreateProductModal from "../inventory/CreateProductModal"; // ✅ FIXED import
import MessageToast from "../sells/MessageToast";

export default function InventoryContent() {
  const {
    data: products = [],
    isLoading: isProductsLoading,
    isError: isProductsError,
    refetch: refetchProducts,
  } = useProductsData();

  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [showCreateProduct, setShowCreateProduct] = useState(false); // ✅ Product modal state
  const [message, setMessage] = useState(null);

  const dropdownRef = useRef(null);

  const statusOptions = ["stock", "low stock", "out of stock"];
  const statusOrder = { "out of stock": 0, "low stock": 1, stock: 2 };

  const getStatus = (p) => {
    const stock = p.stock_quantity ?? 0;
    const threshold = p.low_stock_threshold ?? 10;
    return stock === 0 ? "out of stock" : stock <= threshold ? "low stock" : "stock";
  };

  const categoryOptions = useMemo(() => {
    const names = categories.map((c) => c.category_name);
    if (!names.includes("Uncategorized")) names.unshift("Uncategorized");
    return names;
  }, [categories]);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryFilter
        ? true
        : categoryFilter === "Uncategorized"
        ? !Array.isArray(p.categories) || p.categories.length === 0
        : Array.isArray(p.categories)
        ? p.categories.some((c) => c.category_name === categoryFilter)
        : false;
      const matchesStatus = !statusFilter || getStatus(p) === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });

    return filtered.sort((a, b) => {
      const statusA = getStatus(a);
      const statusB = getStatus(b);
      return statusOrder[statusA] - statusOrder[statusB];
    });
  }, [products, search, categoryFilter, statusFilter]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  if (isProductsLoading || isCategoriesLoading)
    return <div className="p-6 text-center">Loading...</div>;
  if (isProductsError)
    return <div className="p-6 text-center text-red-500">Failed to load products.</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white rounded shadow">
      {/* Header */}
      <div className="p-4 border-b flex-shrink-0">
        <h2 className="text-2xl font-bold text-gray-800">Inventory</h2>
      </div>

      {/* Search + Manage Inventory */}
      <div className="flex items-center p-4 border-b flex-shrink-0 relative">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={`Search ${categoryFilter ? `in ${categoryFilter}` : "products"}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Dropdown */}
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
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="">Category</option>
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
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
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-right">Actions</div>
          </div>

          <div className="space-y-2 mt-2">
            {categoryFilter && filteredProducts.length === 0 ? (
              <div className="text-center text-sm text-gray-500 py-8">
                No products available in {categoryFilter}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center text-sm text-gray-500 py-8">No products found</div>
            ) : (
              filteredProducts.map((p) => (
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
                    {Array.isArray(p.categories) && p.categories.length > 0
                      ? p.categories.map((c) => c.category_name).join(", ")
                      : "Uncategorized"}
                  </div>
                  <div>{getStatus(p)}</div>
                  <div className="flex justify-end">
                    <SettingsIcon className="w-5 h-5 text-gray-500 cursor-pointer" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateCategory && (
        <CreateCategoryModal
          products={products}
          onClose={() => setShowCreateCategory(false)}
          setMessage={setMessage}
        />
      )}

      {showCreateProduct && (
        <CreateProductModal
          onClose={() => setShowCreateProduct(false)}
          onSuccess={() => {
            setShowCreateProduct(false);
            setMessage({ type: "success", text: "Product created successfully!" });
            refetchProducts();
          }}
        />
      )}

      <MessageToast message={message} />
    </div>
  );
}

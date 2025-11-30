import React, { useState, useRef, useEffect, memo } from "react";

// ==============================
// Single Inventory Row Component
// ==============================
const InventoryRow = memo(({ item }) => {
  const [imgError, setImgError] = useState(false);

  // Select the proper image
  const img =
    item?.images_path?.length > 0
      ? item.images_path.find((img) => img.is_primary)?.image_path ||
        item.images_path[0].image_path
      : item?.image || null;

  return (
    <div className="grid grid-cols-[80px_2fr_1fr_1.2fr_1.5fr_1fr] items-center py-3 px-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="flex justify-center">
        {img && !imgError ? (
          <img
            src={img}
            alt={item.product_name}
            loading="lazy"
            className="w-12 h-12 object-cover rounded-md"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-12 h-12 border border-gray-300 rounded-md flex items-center justify-center text-gray-400 text-sm font-semibold bg-gray-50">
            {item.product_name?.charAt(0).toUpperCase() || "?"}
          </div>
        )}
      </div>

      <div className="text-gray-800 font-medium truncate pr-2" title={item.product_name}>
        {item.product_name}
      </div>

      <div className="text-gray-700">{item.stock ?? 0}</div>
      <div className="text-gray-700">₱ {parseFloat(item.price ?? 0).toFixed(2)}</div>
      <div className="text-gray-700 truncate" title={item.categories?.map((c) => c.name).join(", ")}>
        {item.categories?.length > 0 ? item.categories.map((c) => c.name).join(", ") : "-"}
      </div>
      <div className={`font-semibold capitalize ${item.statusColor ?? "text-green-600"}`}>
        {item.status ?? "In stock"}
      </div>
    </div>
  );
});

InventoryRow.displayName = "InventoryRow";

// ==============================
// Loading Skeleton Component
// ==============================
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-3 p-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="grid grid-cols-[80px_2fr_1fr_1.2fr_1.5fr_1fr] gap-4 items-center">
        <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-12"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
    ))}
  </div>
);

// ==============================
// Main Inventory Table Component
// ==============================
export const InventoryTable = memo(({ data, loading, meta, loadMore, scrollRef, searchTerm, setSearchTerm }) => {
  const containerRef = scrollRef || useRef(null);
  const sentinelRef = useRef(null);

  // ==============================
  // Robust Infinite Scroll
  // ==============================
  useEffect(() => {
    const sentinel = sentinelRef.current;
    const container = containerRef.current;

    if (!sentinel || !container || !loadMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          !loading &&
          meta?.current_page < meta?.last_page
        ) {
          console.log("[InventoryTable] Sentinel visible, loading page", meta.current_page + 1);
          loadMore();
        }
      },
      {
        root: container,
        rootMargin: "300px", // triggers before reaching bottom
        threshold: 0,        // fires as soon as any part of sentinel is visible
      }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [loading, meta?.current_page, meta?.last_page, loadMore, containerRef]);

  const showEmptyState = !loading && data.length === 0;
  const showLoadingState = loading && data.length === 0;

  return (
    <div className="flex flex-col bg-white shadow-md rounded-lg overflow-hidden h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 border-b border-gray-200 flex-none bg-white">
        <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Body */}
      <div ref={containerRef} className="flex-1 min-h-0 overflow-y-auto">
        {/* Column Headers */}
        <div className="sticky top-0 z-10 grid grid-cols-[80px_2fr_1fr_1.2fr_1.5fr_1fr] text-xs sm:text-sm font-semibold text-gray-600 bg-gray-100 border-b border-gray-300 shadow-sm">
          {["Image", "Item name", "Stock", "Unit price", "Category", "Status"].map((col, i) => (
            <div key={i} className={`py-3 px-2 ${i === 0 ? "justify-center flex" : ""}`}>{col}</div>
          ))}
        </div>

        {/* Loading / Empty */}
        {showLoadingState && <LoadingSkeleton />}
        {showEmptyState && <div className="p-4 text-gray-500">No inventory items found</div>}

        {/* Inventory Rows */}
        {data.length > 0 && (
          <>
            {data.map((item) => <InventoryRow key={item.id} item={item} />)}

            {/* Sentinel for Infinite Scroll */}
            <div ref={sentinelRef} className="h-20" />

            {/* Loading More Indicator */}
            {loading && data.length > 0 && (
              <div className="text-center py-4 text-gray-500">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-sm">Loading more items...</p>
              </div>
            )}

            {/* End of Results */}
            {!loading && meta?.current_page >= meta?.last_page && data.length > 0 && (
              <div className="text-center py-4 text-gray-400 text-sm">End</div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

InventoryTable.displayName = "InventoryTable";

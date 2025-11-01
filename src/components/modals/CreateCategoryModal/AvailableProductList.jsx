export default function AvailableProductsList({
  products,
  isFetchingNextPage,
  loaderRef,
  onProductAdd,
}) {
  return (
    <div className="flex-1 overflow-auto space-y-2 p-4">
      {products.length === 0 ? (
        <div className="text-gray-400 text-sm text-center py-8">
          No products available
        </div>
      ) : (
        products.map((p) => (
          <div
            key={p.id}
            className="flex justify-between items-center border border-gray-200 rounded-lg px-2 py-6 hover:bg-gray-50 cursor-pointer"
            onClick={() => onProductAdd(p)}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">

              <span className="truncate">{p.name}</span>
            </div>
            <div className="text-sm text-gray-500 flex-shrink-0 ml-2">
              {Array.isArray(p.categories) && p.categories.length > 0
                ? p.categories
                  .map((c) => c?.category_name)
                  .filter(Boolean)
                  .join(", ")
                : "Uncategorized"}
            </div>
          </div>
        ))
      )}

      {/* <pre className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
        {JSON.stringify(
          {
            categoryFilter,
            search,
            totalProducts: products.length,
            filtered: availableProducts.length,
          },
          null,
          2
        )}
      </pre> */}


      <div ref={loaderRef} className="h-10" />
      {isFetchingNextPage && (
        <div className="text-center py-2 text-gray-500">Loading more...</div>
      )}
    </div>
  );
}
import React, { useEffect } from 'react';

// ✅ StockAlert component with containerRef (scroll container) and sentinelRef (trigger for infinite scroll)
const StockAlert = ({ data, loading, sentinelRef, containerRef, loadMore }) => {
  const getStatusBadge = (status, stock) => {
    if (status === 'Out of Stock' || stock === 0) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">
          Out of Stock
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded">
        Low Stock
      </span>
    );
  };

  // ✅ Attach IntersectionObserver to sentinelRef to detect when scroll reaches bottom
  useEffect(() => {
    if (!sentinelRef?.current || !containerRef?.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // ✅ When sentinel is visible and not already loading, call loadMore
        if (entry.isIntersecting && !loading) {
          loadMore();
        }
      },
      {
        root: containerRef.current, // ✅ scrollable container as root
        rootMargin: '0px',
        threshold: 1.0,
      }
    );

    observer.observe(sentinelRef.current);

    return () => {
      if (sentinelRef.current) observer.unobserve(sentinelRef.current);
    };
  }, [sentinelRef, containerRef, loadMore, loading]);

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="flex items-center justify-between p-4 border-gray-200 border-b">
        <h3 className="text-lg font-medium text-gray-900">Stock Alert</h3>
      </div>

      {/* ✅ containerRef allows IntersectionObserver to observe the scroll */}
      <div className="max-h-96 overflow-y-auto divide-y" ref={containerRef}>
        {data.length === 0 && !loading ? (
          <div className="p-4 text-center text-gray-500">No low stock items</div>
        ) : (
          data.map((item, index) => (
            <div
              key={item.id || index}
              className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border-gray-200"
            >
              <p className="text-base font-medium text-gray-800">{item.product_name}</p>
              <div className="flex items-center space-x-3 text-sm mt-2 sm:mt-0">
                <div>
                  <span
                    className={`font-medium ${
                      item.stock === 0
                        ? 'text-red-600'
                        : item.stock <= 5
                        ? 'text-orange-600'
                        : 'text-gray-800'
                    }`}
                  >
                    {item.stock ?? 0}
                  </span>
                  <span className="text-gray-600"> remaining </span>
                </div>
                {getStatusBadge(item.status, item.stock)}
              </div>
            </div>
          ))
        )}

        {/* ✅ sentinel div triggers IntersectionObserver */}
        <div ref={sentinelRef} className="p-4 text-center">
          {loading && <span className="text-sm text-gray-500">Loading more...</span>}
        </div>
      </div>
    </div>
  );
};

export default StockAlert;

/*
✅ Explanation:

1. Added `useEffect` inside StockAlert to attach an IntersectionObserver to sentinelRef.
2. The observer watches sentinelRef within the scrollable container (containerRef).
3. When sentinel enters viewport (isIntersecting) and loading is false, loadMore() is called.
4. loadMore function must be provided from the parent hook/component (e.g., useManagerDashboardHandler)
   to increment page number and fetch next items.
5. Cleanup in return ensures observer is removed if component unmounts or ref changes.
6. This setup ensures scroll down automatically triggers fetch when user reaches the bottom.
*/

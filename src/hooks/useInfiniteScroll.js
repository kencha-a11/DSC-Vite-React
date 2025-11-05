import { useEffect, useCallback, useRef } from "react";

/**
 * Reusable Infinite Scroll Hook
 * @param {React.RefObject} sentinelRef - Ref for the sentinel element at the bottom of the list
 * @param {Function} loadMore - Callback to load the next page
 * @param {boolean} hasMore - Whether there are more pages to fetch
 * @param {boolean} isLoading - Loading state to prevent concurrent fetches
 * @param {React.RefObject} containerRef - Optional scroll container ref
 */
export default function useInfiniteScroll(
  sentinelRef,
  loadMore,
  hasMore,
  isLoading,
  containerRef = null
) {
  const observerRef = useRef(null);

  // Stable callback for intersection observer
  const handleIntersection = useCallback(
    (entries) => {
      const [entry] = entries;
      
      // Trigger loadMore only when:
      // 1. Sentinel is intersecting (visible in viewport)
      // 2. There are more pages available
      // 3. Not currently loading
      if (entry.isIntersecting && hasMore && !isLoading) {
        loadMore();
      }
    },
    [hasMore, isLoading, loadMore]
  );

  useEffect(() => {
    // Get current DOM elements
    const sentinel = sentinelRef?.current;
    const container = containerRef?.current;

    // Early return if sentinel doesn't exist
    if (!sentinel) {
      return;
    }

    // Disconnect existing observer before creating new one
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new IntersectionObserver
    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: container || null, // Use container as root or viewport if null
      rootMargin: "200px",     // Start loading 200px before sentinel is visible
      threshold: 0.1,          // Trigger when 10% of sentinel is visible
    });

    // Start observing the sentinel
    observerRef.current.observe(sentinel);

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [sentinelRef, containerRef, handleIntersection]);

  // No return value needed - this is a side-effect only hook
}
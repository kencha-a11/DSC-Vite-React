// src/hooks/useInfiniteScroll.js
import { useEffect, useCallback } from "react";

/**
 * Reusable Infinite Scroll Hook
 * @param {object} ref - Ref to the sentinel (observer target)
 * @param {function} callback - Function to call when near bottom
 * @param {boolean} hasMore - Whether there are more pages to load
 * @param {boolean} isLoading - Prevents double fetching
 * @param {HTMLElement|null} root - Optional scroll container
 */
export default function useInfiniteScroll(ref, callback, hasMore, isLoading, root = null) {
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !isLoading) {
        requestAnimationFrame(() => callback());
      }
    },
    [callback, hasMore, isLoading]
  );

  useEffect(() => {
    if (!ref?.current) return;

    const observer = new IntersectionObserver(handleObserver, {
      root, // ⬅️ important for container-based scrolling
      rootMargin: "200px",
      threshold: 0.1,
    });

    const current = ref.current;
    observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
      observer.disconnect();
    };
  }, [ref, handleObserver, root]);
}

  import { useEffect } from "react";

  export default function useInfiniteScroll(ref, callback, hasMore, isLoading) {
    useEffect(() => {
      if (!ref?.current) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && hasMore && !isLoading) callback();
        },
        { threshold: 0.1 }
      );
      observer.observe(ref.current);
      return () => observer.disconnect();
    }, [ref, callback, hasMore, isLoading]);
  }

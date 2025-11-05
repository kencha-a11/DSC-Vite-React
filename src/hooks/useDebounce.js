import { useState, useEffect } from "react";

/**
 * Debounces a changing value.
 * @param {T} value - The input value to debounce
 * @param {number} delay - Milliseconds to wait before updating
 * @returns {T} The debounced value
 */
export default function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(() => value);

  useEffect(() => {
    let active = true;
    const handler = setTimeout(() => {
      if (active) setDebounced(value);
    }, delay);

    return () => {
      active = false;
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debounced;
}

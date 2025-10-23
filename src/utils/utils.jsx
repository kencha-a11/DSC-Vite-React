// src/routes/utils.jsx (New File)
import { lazy, Suspense } from "react";

// A simple loading component for all lazy routes
const LoaderFallback = () => <p>Loading...</p>;

/**
 * Wraps a component loader (from ../pages/index.js) in lazy() and Suspense.
 * @param {function} componentLoader - The function that returns import() promise (e.g., loadHomePage)
 * @returns {JSX.Element} The component wrapped in Suspense.
 */
export function wrapRouteElement(componentLoader) {
  const LazyComponent = lazy(componentLoader);
  
  // Return the element wrapped in Suspense
  return (
    <Suspense fallback={<LoaderFallback />}>
      <LazyComponent />
    </Suspense>
  );
}

export function normalizeCategory(product) {
  // Use categories array if exists
  if (product?.categories?.length) {
    return product.categories[0].category_name || "No Category";
  }
  // Single category relation
  if (product?.category) {
    return product.category.category_name || "No Category";
  }
  // Fallback
  return "No Category";
}


export const formatPeso = (amount) => `₱ ${Number(amount ?? 0).toFixed(2)}`;


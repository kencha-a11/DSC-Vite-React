// src/hooks/useFilteredProducts.js
import { useMemo, useState, useEffect } from "react";
import { normalizeCategory } from "../../src/utils/normalizedCategory";

export function useFilteredProducts(products) {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setSearch(searchInput.trim().toLowerCase()), 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Compute unique categories
  const categories = useMemo(() => {
  const cats = products
    .flatMap((p) => p.categories?.map((c) => c.category_name) ?? [])
    .filter(Boolean);
  return ["All", ...Array.from(new Set(cats))];
}, [products]);


  // Filter products
  const filteredProducts = useMemo(() => {
    const searchLower = search.trim().toLowerCase();

    return products.filter((p) => {
      const name = (p.name ?? "").toLowerCase();
      const categoryNormalized = (normalizeCategory(p) || "No Category").trim().toLowerCase();

      const matchesCategory =
        selectedCategory === "All" || categoryNormalized === selectedCategory.trim().toLowerCase();
      const matchesSearch =
        !searchLower || name.includes(searchLower) || categoryNormalized.includes(searchLower);

      return matchesCategory && matchesSearch;
    });
  }, [products, search, selectedCategory]);

  return {
    searchInput,
    setSearchInput,
    selectedCategory,
    setSelectedCategory,
    categories,
    filteredProducts,
  };
}

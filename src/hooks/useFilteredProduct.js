// src/hooks/useFilteredProducts.js
import { useMemo, useState, useEffect } from "react";

export function useFilteredProducts(data = []) {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Normalize products from API structure
  const products = useMemo(() => {
    // Case 1: data is array of categories each with products
    if (data.length > 0 && data[0]?.products) {
      return data.flatMap(cat =>
        cat.products.map(p => ({
          ...p,
          categories: [{ category_name: cat.category_name }],
        }))
      );
    }
    // Case 2: already product-based
    return data;
  }, [data]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Unique categories
  const categories = useMemo(() => {
    const unique = new Set();
    products.forEach(p => {
      if (Array.isArray(p.categories) && p.categories.length > 0) {
        p.categories.forEach(c => c?.category_name && unique.add(c.category_name.trim()));
      } else {
        unique.add("Uncategorized");
      }
    });
    return ["All", ...Array.from(unique)];
  }, [products]);

  // Filtering
  const filteredProducts = useMemo(() => {
    const s = search.trim().toLowerCase();
    return products.filter(p => {
      const name = (p.name ?? "").toLowerCase();
      const categoryNames =
        Array.isArray(p.categories) && p.categories.length 
          ? p.categories.map(c => c?.category_name?.toLowerCase().trim()).filter(Boolean)
          : ["uncategorized"];
      const matchCat =
        selectedCategory === "All" ||
        (selectedCategory === "Uncategorized" && categoryNames.includes("uncategorized")) ||
        categoryNames.includes(selectedCategory.toLowerCase());
      const matchSearch =
        !s || name.includes(s) || categoryNames.some(c => c.includes(s));
      return matchCat && matchSearch;
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

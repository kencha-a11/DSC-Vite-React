import { useState, useEffect } from "react";
import { getCategories } from "../services/categoryServices"; // Adjust path as needed

export function useCategoryData() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      setError(null);

      try {
        const data = await getCategories();
        setCategories(data.data ?? []); // API returns { data: [...] }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  // ✅ Add refetch function
  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategories();
      setCategories(data.data ?? []);
    } catch (err) {
      console.error("Failed to refetch categories:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    data: categories, // now matches your hook usage
    loading,
    error,
    refetch,
  };
}

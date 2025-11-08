// src/hooks/useAccountHandler.js
import { useState, useCallback, useEffect, useRef } from "react";
import { getUsersData } from "../../services/userServices";

export default function useAccountHandler() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);

  const loaderRef = useRef();

  const fetchUsers = useCallback(
    async (pageToFetch = 1, isNewSearch = false) => {
      if (loading) {
        console.log("⏳ Already loading, skipping fetch");
        return;
      }

      console.log("📦 Fetching users...", { pageToFetch, searchTerm });
      setLoading(true);
      setError(null);

      try {
        const params = {
          page: pageToFetch,
          perPage: 20,
          search: searchTerm || undefined,
        };

        const response = await getUsersData(params);
        console.log("✅ Response from API:", response);

        // Correctly handle API returning a flat array or { data: [...] }
        let fetchedUsers = [];
        let more = false;
        let total = 0;

        if (Array.isArray(response)) {
          fetchedUsers = response;
          more = false;
          total = fetchedUsers.length;
        } else if (Array.isArray(response.data)) {
          fetchedUsers = response.data;
          more = response.hasMore || false;
          total = response.total || fetchedUsers.length;
        }

        console.log("🔹 Fetched users array:", fetchedUsers);

        setUsers((prev) => {
          console.log("🔸 Previous users:", prev);
          if (isNewSearch || pageToFetch === 1) {
            console.log("🔹 Replacing users with new fetch");
            return fetchedUsers;
          }
          const existingIds = new Set(prev.map((u) => u.id));
          const newUsers = fetchedUsers.filter((u) => !existingIds.has(u.id));
          console.log("🔹 Appending new users:", newUsers);
          return [...prev, ...newUsers];
        });

        setHasMore(more);
        setTotalUsers(total);
        console.log("📊 Updated state -> totalUsers:", total, "hasMore:", more);
      } catch (err) {
        console.error("❌ Failed to fetch users:", err);
        setError(err.message || "Failed to load users");
        setUsers([]);
        setHasMore(false);
      } finally {
        setLoading(false);
        console.log("⏹ Fetch complete, loading set to false");
      }
    },
    [searchTerm, loading]
  );

  // Reset & fetch when search term changes
  useEffect(() => {
    console.log("🔍 Search term changed:", searchTerm);
    setUsers([]);
    setPage(1);
    setHasMore(true);
    fetchUsers(1, true);
  }, [searchTerm]);

  // Load more users when page changes
  useEffect(() => {
    if (page > 1) {
      console.log("📄 Page changed:", page);
      fetchUsers(page);
    }
  }, [page]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
          console.log("📜 Infinite scroll triggered, loading next page...");
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
      console.log("👀 Observer attached to loaderRef");
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
        console.log("🚫 Observer detached from loaderRef");
      }
    };
  }, [hasMore, loading]);

  const handleUserAdded = useCallback((newUser) => {
    console.log("➕ Adding new user:", newUser);
    setUsers((prev) => {
      const userWithStatus = {
        ...newUser,
        active_status:
          newUser.latest_time_log?.current_status === "Active"
            ? "active"
            : "inactive",
      };
      const updated = [userWithStatus, ...prev].sort((a, b) =>
        a.active_status === b.active_status ? 0 : a.active_status === "active" ? -1 : 1
      );
      console.log("🔹 Users after add:", updated);
      return updated;
    });
    setTotalUsers((prev) => prev + 1);
  }, []);

  const handleUserUpdated = useCallback((updatedUser) => {
    console.log("✏️ Updating user:", updatedUser);
    setUsers((prev) => {
      const updated = prev.map((user) => {
        if (user.id === updatedUser.id) {
          return {
            ...updatedUser,
            active_status:
              updatedUser.latest_time_log?.current_status === "Active"
                ? "active"
                : "inactive",
          };
        }
        return user;
      });
      console.log("🔹 Users after update:", updated);
      return updated;
    });
  }, []);

  const handleSearch = useCallback((term) => {
    console.log("✏️ Search handler called:", term);
    setSearchTerm(term);
  }, []);

  console.log("📝 Hook state -> users:", users, "loading:", loading, "totalUsers:", totalUsers);

  return {
    users,
    loading,
    error,
    hasMore,
    totalUsers,
    searchTerm,
    loaderRef,
    handleSearch,
    handleUserAdded,
    handleUserUpdated,
    refetch: () => {
      console.log("🔄 Refetch triggered");
      setUsers([]);
      setPage(1);
      fetchUsers(1, true);
    },
  };
}

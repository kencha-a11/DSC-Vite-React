import api from "../api/axios";

// Fetch dashboard data from Laravel backend
export async function getDashboardData() {
  const response = await api.get("/dashboard");
  return response.data; // return only the useful data
}
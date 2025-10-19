import api from "../api/axios";

export const getDashboardData = async () => {
  const response = await api.get("/dashboard");
  console.log("Dashboard data fetched:", response.data);
  return response.data;
};

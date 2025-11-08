// src/services/userServices.js
import api from "../api/axios";

// Accept params for pagination & search
export async function getUsersData(params = {}) {
  // Pass the params object to axios as query string
  const response = await api.get("/users", { params });
  return response.data;
}

export async function createUser(data) {
  const response = await api.post("/users", data);
  return response.data;
}

export async function updateUser(id, data) {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
}
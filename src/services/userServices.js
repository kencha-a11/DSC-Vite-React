// src/services/userServices.js
import api from "../api/axios";

export async function getUsersData() {
  const response = await api.get("/users");
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
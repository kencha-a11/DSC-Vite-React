import api from "../api/axios";

export async function getUsersData() {
    const response = await api.get("/users")
    return response.data
}   
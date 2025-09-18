import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ✅ use env var
  timeout: 5000,
})

// Add token to every request if exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api

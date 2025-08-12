import axios from 'axios'
import { showReauthPrompt } from '@/utils/sessionManager.js'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Optional: Add token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config
    if (error.response?.status === 401 || error.response?.status === 419) {
      // Session expired, prompt user to re-authenticate
      // try {
      //   return await showReauthPrompt(error.config)
      // } catch (reauthError) {
      //   return Promise.reject(reauthError)
      // }
      originalConfig._retry = true
      return await showReauthPrompt(originalConfig)
    }
    return Promise.reject(error)
  },
)

export default api

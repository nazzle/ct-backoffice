import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/plugins/axios.js'
import router from '@/router'
import api from '@/api/axios.js'
import { ElMessage } from 'element-plus'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const isAuthenticated = ref(false)
  const loading = ref(false)
  const error = ref(null)
  const token_expiry = ref(null)
  const logoutResponse = ref(null)
  const location = ref(null)

  // Initialize auth state from localStorage
  if (token.value) {
    isAuthenticated.value = true
    // You might want to fetch user profile here
  }

  // Actions
  const login = async (username, password, location_id) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/login', {username, password, location_id})
      token.value = response.data?.auth_object?.access_token
      user.value = response.data?.auth_object?.username
      isAuthenticated.value = true
      token_expiry.value = response.data?.auth_object?.expires_at
      location.value = response.data?.auth_object?.location

      const roles = response.data?.auth_object?.roles[0]
      const user_roles = {
        role: roles?.name,
        permissions: roles?.permissions.map(perm => {
          return perm.name
        }),
      }

      // Store token in localStorage
      localStorage.setItem('token', token.value)
      localStorage.setItem('token_expire', token_expiry.value)
      localStorage.setItem('user', user.value)
      localStorage.setItem('role', user_roles.role)
      localStorage.setItem('permissions', JSON.stringify(user_roles.permissions))
      localStorage.setItem('location', location.value?.name)
      localStorage.setItem('location_id', location.value?.id)

      // Set default auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`

      // Redirect after login
      //await router.push('/home')
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed'
      throw err // Re-throw for component handling
    } finally {
      loading.value = false
    }
  }

   const logout = async () => {
    // Sending logout request
     logoutResponse.value = await api.post('/logout')

     if (logoutResponse.value.data?.status) {
       ElMessage.success(logoutResponse.value.data?.message)
     }else {
       ElMessage.error('Server could not process logout request')
     }

    // Clear state
    token.value = null
    user.value = null
    isAuthenticated.value = false

    // Remove items from storage
     localStorage.removeItem('token')
     localStorage.removeItem('token_expire')
     localStorage.removeItem('user')
     localStorage.removeItem('roles')

    // Remove auth header
    // delete axios.defaults.headers.common['Authorization']
     delete api.defaults.headers.common['Authorization']

    // Redirect to log-in
    await router.push('/login')
  }

  const checkAuth = async () => {
    if (!token.value) return false

    try {
      const response = await axios.get('/api/auth/me')
      user.value = response.data.user
      isAuthenticated.value = true
      return true
    } catch (err) {
      console.log('Error: ',err)
      await logout() // Auto-logout if token is invalid
      return false
    }
  }

  return {
    // State
    user,
    token,
    isAuthenticated,
    loading,
    error,
    logoutResponse,

    // Actions
    login,
    logout,
    checkAuth
  }
})


// const refreshToken = ref(null)
//
// const refreshAuth = async () => {
//   const response = await axios.post('/api/auth/refresh', {
//     refresh_token: refreshToken.value
//   })
//   token.value = response.data.token
// }

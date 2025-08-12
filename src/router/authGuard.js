import { useAuthStore } from '@/stores/authStore'

export const authGuard = async (to, from, next) => {
  const authStore = useAuthStore()
  const tokenExpireAt = localStorage.getItem('token_expire')
  const now = new Date()
  const expireDate = new Date(tokenExpireAt)
  const isExpired = expireDate <= now

  // 1. Check if route requires authentication
  if (to.meta.requiresAuth) {
    // 2. Check if user is authenticated
    if (authStore.isAuthenticated && !isExpired) {
      next() // Allow access
    } else {
      // 3. Try to refresh auth state if token exists
      try {
        const isAuthenticated = await authStore.checkAuth()
        if (isAuthenticated) {
          next() // Token was valid
        } else {
          // 4. Redirect to login with return URL
          next({
            path: '/login',
            query: { redirect: to.fullPath }
          })
        }
      } catch (error) {
        next('/login')
      }
    }
  } else {
    next() // Non-protected route
  }
}

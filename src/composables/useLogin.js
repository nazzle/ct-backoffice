import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'
import { ElMessage } from 'element-plus' // Assuming Pinia store
import { getActiveLocationList } from '@/modules/authentication/api/authentication.js'

export default function useLogin() {
  const router = useRouter()
  const authStore = useAuthStore()

  // Reactive state
  const loginFormObject = ref({
    username: '',
    password: '',
    location_id:''
  })

  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)
  const activeLocations = ref([])

  // Validate loginFormObject
  const validate = () => {
    // if (!loginFormObject.value.email.includes('@')) {
    //   error.value = 'Invalid email'
    //   return false
    // }
    if (loginFormObject.value.username.length < 1) {
      error.value = 'Enter username'
      return false
    }
    if (loginFormObject.value.password.length < 6) {
      error.value = 'Password too short'
      return false
    }
    return true
  }

  // Submit handler
  const submit = async () => {
    if (!validate()) return

    loading.value = true
    //error.value = null

    try {
      await authStore.login(loginFormObject.value.username, loginFormObject.value.password, loginFormObject.value.location_id)
      success.value = true
      ElMessage.success('Login successfully')
      await router.push('/home') // Redirect on success
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed'
    } finally {
      loading.value = false
    }
  }

  // Reset error when user starts typing
  const resetError = () => {
    error.value = null
  }

  const getActiveLocationsList = async () => {
    loading.value = true
    try {
      const response = await getActiveLocationList();
      const responseObj = response?.data
      if (responseObj.status) {
        activeLocations.value = responseObj?.locations
        loading.value = false
      } else {
        ElMessage.error(responseObj.message)
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to fetch locations'
      ElMessage.error(error.value)
    }
  }

  return {
    loginFormObject,
    loading,
    error,
    submit,
    success,
    resetError,
    getActiveLocationsList,
    activeLocations,
  }
}

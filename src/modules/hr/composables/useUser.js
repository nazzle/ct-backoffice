import { onMounted, ref } from 'vue'
import {
  deleteUser,
  getAllRoles,
  getLoggedInUserProfile,
  getUsers,
  saveUser,
  updateUser
} from '@/modules/hr/api/users.js'
import { ElMessage } from 'element-plus'

export function useUser() {
  const users = ref([])
  const roles = ref([])
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)
  const myProfile = ref(null)

  const fetchUsers = async () => {
    loading.value = true
    try {
      const response = await getUsers()
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        users.value = responseObj?.usersResponse?.data
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch users'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const getNonPaginatedListOfRoles = async () => {
    loading.value = true
    try {
      const response = await getAllRoles()
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        roles.value = responseObj?.roles
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch roles'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const saveNewUser = async (data) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await saveUser(data)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message)
      }
    } catch (error) {
      error.value = JSON.stringify(error?.response?.data?.errors) || JSON.stringify(error?.response?.data?.message) || 'Failed to save user'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const changeUserStatus = async (userDto) => {
    loading.value = true
    try {
      const userId = userDto?.id
      const response = await deleteUser(userDto, userId)
      if (response?.data?.status === true) {
        loading.value = false
        await fetchUsers()
        ElMessage.success(response?.data?.message)
      }else {
        ElMessage.error(response?.data?.message)
      }
    } catch (error) {
      console.log(error)
    } finally {
      loading.value = false
    }
  }

  const updateUserDetails = async (data) => {
    loading.value = true
    try {
      console.log('User data',data)
      const userId = data?.id
      const response = await updateUser(data, userId)
      if (response?.data?.status === true) {
        loading.value = false
        await fetchUsers()
        ElMessage.success(response?.data?.message)
      } else {
        ElMessage.error(response?.data?.message)
      }
    } catch (error) {
      ElMessage.error(error?.response?.data?.message)
    }
  }

  const getUserProfile = async (data) => {
    loading.value = true

    try {
      const response = await getLoggedInUserProfile(data)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        loading.value = false

        myProfile.value = responseObj?.user
      } else {
        ElMessage.error(response?.data?.message)
      }
    } catch (error) {
      ElMessage.error(error?.response?.data?.message)
    }
  }

  onMounted(() => fetchUsers())

  return {
    users,
    fetchUsers,
    getNonPaginatedListOfRoles,
    roles,
    loading,
    error,
    success,
    saveNewUser,
    changeUserStatus,
    updateUserDetails,
    getUserProfile,
    myProfile,
  }

}

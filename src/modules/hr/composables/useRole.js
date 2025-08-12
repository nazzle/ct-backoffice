import { onMounted, ref } from 'vue'
import {
  getPaginatedRoles,
  getPermissionsList,
  saveRole,
  updateRole
} from '@/modules/hr/api/roles.js'
import { ElMessage } from 'element-plus'

export function useRole() {

  const paginatedRoles = ref([])
  const permissionsList = ref([])
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)

  const fetchRoles = async () => {
    loading.value = true

    try {
      const response = await getPaginatedRoles()
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        paginatedRoles.value = responseObj?.rolesResponse?.data
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch roles'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const fetchPermissions = async () => {
    loading.value = true
    try {
      const response = await getPermissionsList()
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        permissionsList.value = responseObj?.permissions
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch permissions'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const createRole = async (data) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await saveRole(data)
      console.log(response)
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

  const updateRoleDetails = async (data) => {
    loading.value = true
    success.value = false

    try {
      const response = await updateRole(data, data?.id)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message)
      } else {
        ElMessage.error(responseObj.message)
      }
    } catch (error) {
      error.value = JSON.stringify(error?.response?.data?.errors)
    }
  }

  onMounted(() => fetchRoles())

  return {
    fetchRoles,
    error,
    success,
    paginatedRoles,
    fetchPermissions,
    permissionsList,
    createRole,
    updateRoleDetails,
  }

}

import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getPaginatedConfigurations,
  createConfiguration,
  updateConfiguration,
  updateConfigurationStatus,
  getAllConfigurations,
} from '@/modules/configuration/api/configurations.js'
import { usePagination } from '@/composables/usePagination.js'

export function useConfiguration() {
  const configurations = ref([])
  const allConfigurations = ref([])
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)
  const pagination = usePagination().pagination

  const fetchConfigurations = async () => {
    loading.value = true
    try {
      const response = await getPaginatedConfigurations(
        pagination.value.page,
        pagination.value.pageSize,
      )
      const responseObj = response.data
      if (responseObj.status === true) {
        configurations.value = responseObj?.configurations?.data
        pagination.value.page = responseObj.configurations.current_page
        pagination.value.pageSize = responseObj.configurations.per_page
        pagination.value.totalItems = responseObj.configurations.total
      } else {
        ElMessage.error(responseObj.message)
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch configurations'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const getNonPaginatedConfigurations = async () => {
    loading.value = true
    try {
      const response = await getAllConfigurations()
      const responseObj = response.data
      if (responseObj.status === true) {
        allConfigurations.value = responseObj?.configurations || []
      } else {
        ElMessage.error(responseObj.message)
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch all configurations'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const saveConfigurationDetails = async (data) => {
    loading.value = true
    try {
      const response = await createConfiguration(data)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message)
      } else {
        success.value = false
        ElMessage.error(responseObj.message)
      }
    } catch (err) {
      success.value = false
      error.value = err.response?.data?.message || 'Failed to save configuration details'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const updateConfigurationDetails = async (data) => {
    loading.value = true
    try {
      const response = await updateConfiguration(data, data?.id)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message)
      } else {
        success.value = false
        ElMessage.error(responseObj.message)
      }
    } catch (err) {
      error.value = err.response?.data?.message
      ElMessage.error(error.value)
    }
  }

  const activateDeactivateConfiguration = async (id) => {
    loading.value = true
    try {
      const response = await updateConfigurationStatus(id)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message)
      } else {
        success.value = false
        ElMessage.error(responseObj.message)
      }
    } catch (err) {
      error.value = err.response?.data?.message
    }
  }

  onMounted(() => fetchConfigurations())

  return {
    configurations,
    loading,
    error,
    success,
    fetchConfigurations,
    saveConfigurationDetails,
    activateDeactivateConfiguration,
    updateConfigurationDetails,
    pagination,
    allConfigurations,
    getNonPaginatedConfigurations,
  }
}

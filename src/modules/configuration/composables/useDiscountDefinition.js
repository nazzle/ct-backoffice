import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getPaginatedDiscountDefinitions,
  createDiscountDefinition,
  updateDiscountDefinition,
  updateDiscountDefinitionStatus,
  getAllDiscountDefinitions,
} from '@/modules/configuration/api/discountDefinitions.js'
import { usePagination } from '@/composables/usePagination.js'

export function useDiscountDefinition() {
  const discountDefinitions = ref([])
  const allDiscountDefinitions = ref([])
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)
  const pagination = usePagination().pagination

  const fetchDiscountDefinitions = async () => {
    loading.value = true
    try {
      const response = await getPaginatedDiscountDefinitions(
        pagination.value.page,
        pagination.value.pageSize,
      )
      const responseObj = response.data
      if (responseObj.status === true) {
        discountDefinitions.value = responseObj?.discount_definitions?.data
        pagination.value.page = responseObj.discount_definitions.current_page
        pagination.value.pageSize = responseObj.discount_definitions.per_page
        pagination.value.totalItems = responseObj.discount_definitions.total
      } else {
        ElMessage.error(responseObj.message)
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch discount definitions'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const getNonPaginatedDiscountDefinitions = async () => {
    loading.value = true
    try {
      const response = await getAllDiscountDefinitions()
      const responseObj = response.data
      if (responseObj.status === true) {
        allDiscountDefinitions.value = responseObj?.discount_definitions || []
      } else {
        ElMessage.error(responseObj.message)
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch all discount definitions'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const saveDiscountDefinitionDetails = async (data) => {
    loading.value = true
    try {
      const response = await createDiscountDefinition(data)
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
      error.value = err.response?.data?.message || 'Failed to save discount definition details'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const updateDiscountDefinitionDetails = async (data) => {
    loading.value = true
    try {
      const response = await updateDiscountDefinition(data, data?.id)
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

  const activateDeactivateDiscountDefinition = async (id) => {
    loading.value = true
    try {
      const response = await updateDiscountDefinitionStatus(id)
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

  onMounted(() => fetchDiscountDefinitions())

  return {
    discountDefinitions,
    loading,
    error,
    success,
    fetchDiscountDefinitions,
    saveDiscountDefinitionDetails,
    activateDeactivateDiscountDefinition,
    updateDiscountDefinitionDetails,
    pagination,
    allDiscountDefinitions,
    getNonPaginatedDiscountDefinitions,
  }
}

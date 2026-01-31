import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getPaginatedDiscounts,
  createDiscount,
  updateDiscount,
  updateDiscountStatus,
  getAllDiscounts,
} from '@/modules/configuration/api/discounts.js'
import { usePagination } from '@/composables/usePagination.js'

export function useDiscount() {
  const discounts = ref([])
  const allDiscounts = ref([])
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)
  const pagination = usePagination().pagination

  const fetchDiscounts = async () => {
    loading.value = true
    try {
      const response = await getPaginatedDiscounts(pagination.value.page, pagination.value.pageSize)
      const responseObj = response.data
      if (responseObj.status === true) {
        discounts.value = responseObj?.discounts?.data
        pagination.value.page = responseObj.discounts.current_page
        pagination.value.pageSize = responseObj.discounts.per_page
        pagination.value.totalItems = responseObj.discounts.total
      } else {
        ElMessage.error(responseObj.message)
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch discounts'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const getNonPaginatedDiscounts = async () => {
    loading.value = true
    try {
      const response = await getAllDiscounts()
      const responseObj = response.data
      if (responseObj.status === true) {
        allDiscounts.value = responseObj?.discounts || []
      } else {
        ElMessage.error(responseObj.message)
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch all discounts'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const saveDiscountDetails = async (data) => {
    loading.value = true
    try {
      const response = await createDiscount(data)
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
      error.value = err.response?.data?.message || 'Failed to save discount details'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const updateDiscountDetails = async (data) => {
    loading.value = true
    try {
      const response = await updateDiscount(data, data?.id)
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

  const activateDeactivateDiscount = async (id) => {
    loading.value = true
    try {
      const response = await updateDiscountStatus(id)
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

  onMounted(() => fetchDiscounts())

  return {
    discounts,
    loading,
    error,
    success,
    fetchDiscounts,
    saveDiscountDetails,
    activateDeactivateDiscount,
    updateDiscountDetails,
    pagination,
    allDiscounts,
    getNonPaginatedDiscounts,
  }
}

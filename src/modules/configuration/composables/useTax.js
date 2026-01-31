import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getPaginatedTaxes,
  createTax,
  updateTax,
  updateTaxStatus,
  getAllTaxes,
} from '@/modules/configuration/api/taxes.js'
import { usePagination } from '@/composables/usePagination.js'

export function useTax() {
  const taxes = ref([])
  const allTaxes = ref([])
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)
  const pagination = usePagination().pagination

  const fetchTaxes = async () => {
    loading.value = true
    try {
      const response = await getPaginatedTaxes(pagination.value.page, pagination.value.pageSize)
      const responseObj = response.data
      if (responseObj.status === true) {
        taxes.value = responseObj?.taxes?.data
        pagination.value.page = responseObj.taxes.current_page
        pagination.value.pageSize = responseObj.taxes.per_page
        pagination.value.totalItems = responseObj.taxes.total
      } else {
        ElMessage.error(responseObj.message)
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch taxes'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const getNonPaginatedTaxes = async () => {
    loading.value = true
    try {
      const response = await getAllTaxes()
      const responseObj = response.data
      if (responseObj.status === true) {
        allTaxes.value = responseObj?.taxes || []
      } else {
        ElMessage.error(responseObj.message)
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch all taxes'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const saveTaxDetails = async (data) => {
    loading.value = true
    try {
      const response = await createTax(data)
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
      error.value = err.response?.data?.message || 'Failed to save tax details'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const updateTaxDetails = async (data) => {
    loading.value = true
    try {
      const response = await updateTax(data, data?.id)
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

  const activateDeactivateTax = async (id) => {
    loading.value = true
    try {
      const response = await updateTaxStatus(id)
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

  onMounted(() => fetchTaxes())

  return {
    taxes,
    loading,
    error,
    success,
    fetchTaxes,
    saveTaxDetails,
    activateDeactivateTax,
    updateTaxDetails,
    pagination,
    allTaxes,
    getNonPaginatedTaxes,
  }
}

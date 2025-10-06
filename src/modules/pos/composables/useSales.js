import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getPaginatedSales,
  getSaleById,
  createSale,
  updateSale,
  completeSale,
  cancelSale,
  getPendingSales,
  getCompletedSales,
  getSalesSummary,
} from '@/modules/pos/api/sales.js'
import { usePagination } from '@/composables/usePagination.js'

export function useSales() {
  const sales = ref([])
  const pendingSales = ref([])
  const completedSales = ref([])
  const currentSale = ref(null)
  const salesSummary = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)
  const pagination = usePagination().pagination

  const fetchSales = async (params = {}) => {
    loading.value = true
    try {
      const response = await getPaginatedSales(
        pagination.value.page,
        pagination.value.pageSize,
        params,
      )
      const responseObj = response.data
      if (responseObj.status === true) {
        sales.value = responseObj?.sales?.data
        pagination.value.page = responseObj.sales.current_page
        pagination.value.pageSize = responseObj.sales.per_page
        pagination.value.totalItems = responseObj.sales.total
      } else {
        ElMessage.error(responseObj.message)
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch sales'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const fetchPendingSales = async () => {
    loading.value = true
    try {
      const response = await getPendingSales(pagination.value.page, pagination.value.pageSize)
      const responseObj = response.data
      if (responseObj.status === true) {
        pendingSales.value = responseObj?.sales?.data
      } else {
        ElMessage.error(responseObj.message)
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch pending sales'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const fetchCompletedSales = async () => {
    loading.value = true
    try {
      const response = await getCompletedSales(pagination.value.page, pagination.value.pageSize)
      const responseObj = response.data
      if (responseObj.status === true) {
        completedSales.value = responseObj?.sales?.data
      } else {
        ElMessage.error(responseObj.message)
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch completed sales'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const fetchSaleById = async (id) => {
    loading.value = true
    try {
      const response = await getSaleById(id)
      const responseObj = response.data
      if (responseObj.status === true) {
        currentSale.value = responseObj?.sale
        return responseObj?.sale
      } else {
        ElMessage.error(responseObj.message)
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch sale'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const saveSale = async (data, isPending = true) => {
    loading.value = true
    success.value = false
    try {
      const payload = {
        ...data,
        status: isPending ? 'pending' : 'completed',
      }

      const response = await createSale(payload)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Sale saved successfully')
        return responseObj?.sale
      } else {
        success.value = false
        ElMessage.error(responseObj.message)
      }
    } catch (err) {
      success.value = false
      error.value = err.response?.data?.message || 'Failed to save sale'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const completeSaleTransaction = async (id, paymentData) => {
    loading.value = true
    success.value = false
    try {
      const response = await completeSale(id, paymentData)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Sale completed successfully')
        return responseObj?.sale
      } else {
        success.value = false
        ElMessage.error(responseObj.message)
      }
    } catch (err) {
      success.value = false
      error.value = err.response?.data?.message || 'Failed to complete sale'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const cancelSaleTransaction = async (id) => {
    loading.value = true
    success.value = false
    try {
      const response = await cancelSale(id)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Sale cancelled successfully')
      } else {
        success.value = false
        ElMessage.error(responseObj.message)
      }
    } catch (err) {
      success.value = false
      error.value = err.response?.data?.message || 'Failed to cancel sale'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const fetchSalesSummary = async (params = {}) => {
    loading.value = true
    try {
      const response = await getSalesSummary(params)
      const responseObj = response.data
      if (responseObj.status === true) {
        salesSummary.value = responseObj?.summary
      } else {
        ElMessage.error(responseObj.message)
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch sales summary'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  return {
    sales,
    pendingSales,
    completedSales,
    currentSale,
    salesSummary,
    loading,
    error,
    success,
    pagination,
    fetchSales,
    fetchPendingSales,
    fetchCompletedSales,
    fetchSaleById,
    saveSale,
    completeSaleTransaction,
    cancelSaleTransaction,
    fetchSalesSummary,
  }
}

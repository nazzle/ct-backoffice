import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getPaginatedPaymentOptions,
  createPaymentOption,
  updatePaymentOption,
  updatePaymentOptionStatus,
  getAllPaymentOptions,
} from '@/modules/configuration/api/paymentOptions.js'
import { usePagination } from '@/composables/usePagination.js'

export function usePaymentOption() {
  const paymentOptions = ref([])
  const allPaymentOptions = ref([])
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)
  const pagination = usePagination().pagination

  const fetchPaymentOptions = async () => {
    loading.value = true
    try {
      const response = await getPaginatedPaymentOptions(
        pagination.value.page,
        pagination.value.pageSize,
      )
      const responseObj = response.data
      if (responseObj.status === true) {
        paymentOptions.value = responseObj?.payment_options?.data
        pagination.value.page = responseObj.payment_options.current_page
        pagination.value.pageSize = responseObj.payment_options.per_page
        pagination.value.totalItems = responseObj.payment_options.total
      } else {
        ElMessage.error(responseObj.message)
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch payment options'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const getNonPaginatedPaymentOptions = async () => {
    loading.value = true
    try {
      const response = await getAllPaymentOptions()
      const responseObj = response.data
      if (responseObj.status === true) {
        allPaymentOptions.value = responseObj?.payment_options || []
      } else {
        ElMessage.error(responseObj.message)
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch all payment options'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const savePaymentOptionDetails = async (data) => {
    loading.value = true
    try {
      const response = await createPaymentOption(data)
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
      error.value = err.response?.data?.message || 'Failed to save payment option details'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const updatePaymentOptionDetails = async (data) => {
    loading.value = true
    try {
      const response = await updatePaymentOption(data, data?.id)
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

  const activateDeactivatePaymentOption = async (id) => {
    loading.value = true
    try {
      const response = await updatePaymentOptionStatus(id)
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

  onMounted(() => fetchPaymentOptions())

  return {
    paymentOptions,
    loading,
    error,
    success,
    fetchPaymentOptions,
    savePaymentOptionDetails,
    activateDeactivatePaymentOption,
    updatePaymentOptionDetails,
    pagination,
    allPaymentOptions,
    getNonPaginatedPaymentOptions,
  }
}

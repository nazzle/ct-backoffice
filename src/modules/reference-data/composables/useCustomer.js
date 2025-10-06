import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getPaginatedCustomers,
  createCustomer,
  updateCustomer,
  updateCustomerStatus,
  getAllCustomers,
} from '@/modules/reference-data/api/customers.js'
import { usePagination } from '@/composables/usePagination.js'

export function useCustomer() {
  const customers = ref([])
  const allCustomers = ref([])
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)
  const pagination = usePagination().pagination

  const fetchCustomers = async () => {
    loading.value = true
    try {
      const response = await getPaginatedCustomers(pagination.value.page, pagination.value.pageSize)
      const responseObj = response.data
      if (responseObj.status === true) {
        customers.value = responseObj?.customers?.data
        pagination.value.page = responseObj.customers.current_page
        pagination.value.pageSize = responseObj.customers.per_page
        pagination.value.totalItems = responseObj.customers.total
      } else {
        ElMessage.error(responseObj.message)
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch customers'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const getNonPaginatedCustomers = async () => {
    loading.value = true
    try {
      const response = await getAllCustomers()
      const responseObj = response.data
      if (responseObj.status === true) {
        allCustomers.value = responseObj?.customers || []
      } else {
        ElMessage.error(responseObj.message)
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch all customers'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const saveCustomerDetails = async (data) => {
    loading.value = true
    try {
      const response = await createCustomer(data)
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
      error.value = err.response?.data?.message || 'Failed to save customer details'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const updateCustomerDetails = async (data) => {
    loading.value = true
    try {
      const response = await updateCustomer(data, data?.id)
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

  const activateDeactivateCustomer = async (id) => {
    loading.value = true
    try {
      const response = await updateCustomerStatus(id)
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

  onMounted(() => fetchCustomers())

  return {
    customers,
    loading,
    error,
    success,
    fetchCustomers,
    saveCustomerDetails,
    activateDeactivateCustomer,
    updateCustomerDetails,
    pagination,
    allCustomers,
    getNonPaginatedCustomers,
  }
}

import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getInventoryRecords,
  createInventoryRecord,
  updateInventoryRecord,
  updateInventoryRecordStatus,
  deleteInventoryRecord,
  getAllInventoryRecords,
  getInventoryRecordByItem,
  getInventoryRecordByLocation,
} from '@/modules/inventory/api/inventoryRecord.js'
import { usePagination } from '@/composables/usePagination.js'

export function useInventoryRecord() {
  const inventoryRecords = ref([])
  const allInventoryRecords = ref([])
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)
  const pagination = usePagination().pagination

  const fetchInventoryRecords = async () => {
    loading.value = true
    try {
      const response = await getInventoryRecords(pagination.value.page, pagination.value.pageSize)
      const responseObj = response.data
      if (responseObj.status === true) {
        inventoryRecords.value = responseObj?.inventory_records?.data || responseObj?.data || []
        pagination.value.page = responseObj.inventory_records?.current_page || responseObj.current_page || 1
        pagination.value.pageSize = responseObj.inventory_records?.per_page || responseObj.per_page || 10
        pagination.value.totalItems = responseObj.inventory_records?.total || responseObj.total || 0
      } else {
        ElMessage.error(responseObj.message || 'Failed to fetch inventory records')
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch inventory records'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const saveInventoryRecord = async (data) => {
    loading.value = true
    error.value = null
    success.value = false
    try {
      const response = await createInventoryRecord(data)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Inventory record created successfully')
      } else {
        ElMessage.error(responseObj.message || 'Failed to create inventory record')
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to save inventory record'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const updateInventoryRecordDetails = async (data) => {
    loading.value = true
    error.value = null
    success.value = false
    const recordId = data.id
    const payload = { ...data }
    delete payload.id
    try {
      const response = await updateInventoryRecord(payload, recordId)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Inventory record updated successfully')
      } else {
        ElMessage.error(responseObj.message || 'Failed to update inventory record')
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update inventory record'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const changeInventoryRecordStatus = async (recordId) => {
    loading.value = true
    error.value = null
    success.value = false
    try {
      const response = await updateInventoryRecordStatus(recordId)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Inventory record status updated successfully')
      } else {
        ElMessage.error(responseObj.message || 'Failed to update inventory record status')
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update inventory record status'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const removeInventoryRecord = async (recordId) => {
    loading.value = true
    error.value = null
    success.value = false
    try {
      const response = await deleteInventoryRecord(recordId)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Inventory record deleted successfully')
      } else {
        ElMessage.error(responseObj.message || 'Failed to delete inventory record')
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete inventory record'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const getAllInventoryRecordsList = async () => {
    loading.value = true
    try {
      const response = await getAllInventoryRecords()
      const responseObj = response.data
      if (responseObj.status === true) {
        allInventoryRecords.value = responseObj?.data || []
      }
    } catch (err) {
      console.log('Error fetching all inventory records:', err)
    } finally {
      loading.value = false
    }
  }

  const getInventoryRecordsForItem = async (itemId) => {
    loading.value = true
    try {
      const response = await getInventoryRecordByItem(itemId)
      const responseObj = response.data
      if (responseObj.status === true) {
        return responseObj?.data || []
      }
    } catch (err) {
      console.log('Error fetching inventory records for item:', err)
    } finally {
      loading.value = false
    }
  }

  const getInventoryRecordsForLocation = async (locationId) => {
    loading.value = true
    try {
      const response = await getInventoryRecordByLocation(locationId)
      const responseObj = response.data
      if (responseObj.status === true) {
        return responseObj?.data || []
      }
    } catch (err) {
      console.log('Error fetching inventory records for location:', err)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => fetchInventoryRecords())

  return {
    inventoryRecords,
    allInventoryRecords,
    loading,
    error,
    success,
    pagination,
    fetchInventoryRecords,
    saveInventoryRecord,
    updateInventoryRecordDetails,
    changeInventoryRecordStatus,
    removeInventoryRecord,
    getAllInventoryRecordsList,
    getInventoryRecordsForItem,
    getInventoryRecordsForLocation,
  }
}

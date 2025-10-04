import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getInventory,
  createInventory,
  updateInventory,
  updateInventoryStatus,
  deleteInventory,
  getAllInventory,
  getInventoryByItem,
  getInventoryByLocation,
} from '@/modules/inventory/api/inventory.js'
import { usePagination } from '@/composables/usePagination.js'

export function useInventory() {
  const inventory = ref([])
  const allInventory = ref([])
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)
  const pagination = usePagination().pagination

  const fetchInventory = async () => {
    loading.value = true
    try {
      const response = await getInventory(pagination.value.page, pagination.value.pageSize)
      const responseObj = response.data
      if (responseObj.status === true) {
        inventory.value = responseObj?.inventories?.data || responseObj?.data || []
        pagination.value.page = responseObj.inventories?.current_page || responseObj.current_page || 1
        pagination.value.pageSize = responseObj.inventories?.per_page || responseObj.per_page || 10
        pagination.value.totalItems = responseObj.inventories?.total || responseObj.total || 0
      } else {
        ElMessage.error(responseObj.message || 'Failed to fetch inventory')
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to fetch inventory'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const saveInventory = async (data) => {
    loading.value = true
    error.value = null
    success.value = false
    try {
      const response = await createInventory(data)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Inventory created successfully')
      } else {
        ElMessage.error(responseObj.message || 'Failed to create inventory')
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to save inventory'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const updateInventoryDetails = async (data) => {
    loading.value = true
    error.value = null
    success.value = false
    const inventoryId = data.id
    delete data.id
    try {
      const response = await updateInventory(data, inventoryId)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Inventory updated successfully')
      } else {
        ElMessage.error(responseObj.message || 'Failed to update inventory')
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to update inventory'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const changeInventoryStatus = async (inventoryId) => {
    loading.value = true
    error.value = null
    success.value = false
    try {
      const response = await updateInventoryStatus(inventoryId)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Inventory status updated successfully')
      } else {
        ElMessage.error(responseObj.message || 'Failed to update inventory status')
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to update inventory status'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const removeInventory = async (inventoryId) => {
    loading.value = true
    error.value = null
    success.value = false
    try {
      const response = await deleteInventory(inventoryId)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Inventory deleted successfully')
      } else {
        ElMessage.error(responseObj.message || 'Failed to delete inventory')
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to delete inventory'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const getAllInventoryList = async () => {
    loading.value = true
    try {
      const response = await getAllInventory()
      const responseObj = response.data
      if (responseObj.status === true) {
        allInventory.value = responseObj?.data || []
      }
    } catch (error) {
      console.log('Error fetching all inventory:', error)
    } finally {
      loading.value = false
    }
  }

  const getInventoryForItem = async (itemId) => {
    loading.value = true
    try {
      const response = await getInventoryByItem(itemId)
      const responseObj = response.data
      if (responseObj.status === true) {
        return responseObj?.data || []
      }
    } catch (error) {
      console.log('Error fetching inventory for item:', error)
    } finally {
      loading.value = false
    }
  }

  const getInventoryForLocation = async (locationId) => {
    loading.value = true
    try {
      const response = await getInventoryByLocation(locationId)
      const responseObj = response.data
      if (responseObj.status === true) {
        return responseObj?.data || []
      }
    } catch (error) {
      console.log('Error fetching inventory for location:', error)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => fetchInventory())

  return {
    inventory,
    allInventory,
    loading,
    error,
    success,
    pagination,
    fetchInventory,
    saveInventory,
    updateInventoryDetails,
    changeInventoryStatus,
    removeInventory,
    getAllInventoryList,
    getInventoryForItem,
    getInventoryForLocation,
  }
}

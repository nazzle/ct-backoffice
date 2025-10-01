import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getInventoryMovements,
  createInventoryMovement,
  updateInventoryMovement,
  updateInventoryMovementStatus,
  deleteInventoryMovement,
  getAllInventoryMovements,
  getMovementsByItem,
  getMovementsByLocation,
  getMovementsByDateRange,
} from '@/modules/inventory/api/inventoryMovements.js'
import { usePagination } from '@/composables/usePagination.js'

export function useInventoryMovement() {
  const movements = ref([])
  const allMovements = ref([])
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)
  const pagination = usePagination().pagination

  const fetchInventoryMovements = async () => {
    loading.value = true
    try {
      const response = await getInventoryMovements(pagination.value.page, pagination.value.pageSize)
      const responseObj = response.data
      if (responseObj.status === true) {
        movements.value = responseObj?.movements?.data || responseObj?.data || []
        pagination.value.page = responseObj.movements?.current_page || responseObj.current_page || 1
        pagination.value.pageSize = responseObj.movements?.per_page || responseObj.per_page || 10
        pagination.value.totalItems = responseObj.movements?.total || responseObj.total || 0
      } else {
        ElMessage.error(responseObj.message || 'Failed to fetch inventory movements')
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to fetch inventory movements'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const saveInventoryMovement = async (data) => {
    loading.value = true
    error.value = null
    success.value = false
    try {
      const response = await createInventoryMovement(data)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Inventory movement created successfully')
      } else {
        ElMessage.error(responseObj.message || 'Failed to create inventory movement')
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to save inventory movement'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const updateInventoryMovementDetails = async (data) => {
    loading.value = true
    error.value = null
    success.value = false
    const movementId = data.id
    delete data.id
    try {
      const response = await updateInventoryMovement(data, movementId)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Inventory movement updated successfully')
      } else {
        ElMessage.error(responseObj.message || 'Failed to update inventory movement')
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to update inventory movement'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const changeInventoryMovementStatus = async (movementId) => {
    loading.value = true
    error.value = null
    success.value = false
    try {
      const response = await updateInventoryMovementStatus(movementId)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Inventory movement status updated successfully')
      } else {
        ElMessage.error(responseObj.message || 'Failed to update inventory movement status')
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to update inventory movement status'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const removeInventoryMovement = async (movementId) => {
    loading.value = true
    error.value = null
    success.value = false
    try {
      const response = await deleteInventoryMovement(movementId)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Inventory movement deleted successfully')
      } else {
        ElMessage.error(responseObj.message || 'Failed to delete inventory movement')
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to delete inventory movement'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const getAllInventoryMovementsList = async () => {
    loading.value = true
    try {
      const response = await getAllInventoryMovements()
      const responseObj = response.data
      if (responseObj.status === true) {
        allMovements.value = responseObj?.data || []
      }
    } catch (error) {
      console.log('Error fetching all inventory movements:', error)
    } finally {
      loading.value = false
    }
  }

  const getMovementsForItem = async (itemId) => {
    loading.value = true
    try {
      const response = await getMovementsByItem(itemId)
      const responseObj = response.data
      if (responseObj.status === true) {
        return responseObj?.data || []
      }
    } catch (error) {
      console.log('Error fetching movements for item:', error)
    } finally {
      loading.value = false
    }
  }

  const getMovementsForLocation = async (locationId) => {
    loading.value = true
    try {
      const response = await getMovementsByLocation(locationId)
      const responseObj = response.data
      if (responseObj.status === true) {
        return responseObj?.data || []
      }
    } catch (error) {
      console.log('Error fetching movements for location:', error)
    } finally {
      loading.value = false
    }
  }

  const getMovementsByDate = async (startDate, endDate) => {
    loading.value = true
    try {
      const response = await getMovementsByDateRange(startDate, endDate)
      const responseObj = response.data
      if (responseObj.status === true) {
        return responseObj?.data || []
      }
    } catch (error) {
      console.log('Error fetching movements by date range:', error)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => fetchInventoryMovements())

  return {
    movements,
    allMovements,
    loading,
    error,
    success,
    pagination,
    fetchInventoryMovements,
    saveInventoryMovement,
    updateInventoryMovementDetails,
    changeInventoryMovementStatus,
    removeInventoryMovement,
    getAllInventoryMovementsList,
    getMovementsForItem,
    getMovementsForLocation,
    getMovementsByDate,
  }
}

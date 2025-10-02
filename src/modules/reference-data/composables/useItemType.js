import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getItemTypes,
  createItemType,
  updateItemType,
  updateItemTypeStatus,
  deleteItemType,
  getAllItemTypes,
} from '@/modules/reference-data/api/itemTypes.js'
import { usePagination } from '@/composables/usePagination.js'

export function useItemType() {
  const itemTypes = ref([])
  const allItemTypes = ref([])
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)
  const pagination = usePagination().pagination

  const fetchItemTypes = async () => {
    loading.value = true
    try {
      const response = await getItemTypes(pagination.value.page, pagination.value.pageSize)
      const responseObj = response.data
      if (responseObj.status === true) {
        itemTypes.value = responseObj?.item_types?.data || responseObj?.data || []
        pagination.value.page = responseObj.item_types?.current_page || responseObj.current_page || 1
        pagination.value.pageSize = responseObj.item_types?.per_page || responseObj.per_page || 10
        pagination.value.totalItems = responseObj.item_types?.total || responseObj.total || 0
      } else {
        ElMessage.error(responseObj.message || 'Failed to fetch item types')
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to fetch item types'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const saveItemType = async (data) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await createItemType(data)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Item type created successfully')
      } else {
        ElMessage.error(responseObj.message || 'Failed to create item type')
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to save item type'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const updateItemTypeDetails = async (data) => {
    loading.value = true
    error.value = null
    success.value = false

    const itemTypeId = data.id
    delete data.id

    try {
      const response = await updateItemType(data, itemTypeId)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Item type updated successfully')
      } else {
        ElMessage.error(responseObj.message || 'Failed to update item type')
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to update item type'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const changeItemTypeStatus = async (itemTypeId) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await updateItemTypeStatus(itemTypeId)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Item type status updated successfully')
      } else {
        ElMessage.error(responseObj.message || 'Failed to update item type status')
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to update item type status'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const removeItemType = async (itemTypeId) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await deleteItemType(itemTypeId)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Item type deleted successfully')
      } else {
        ElMessage.error(responseObj.message || 'Failed to delete item type')
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to delete item type'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const getAllItemTypesList = async () => {
    loading.value = true
    try {
      const response = await getAllItemTypes()
      const responseObj = response.data
      if (responseObj.status === true) {
        allItemTypes.value = responseObj?.item_types || []
      }
    } catch (error) {
      console.log('Error fetching all item types:', error)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => fetchItemTypes())

  return {
    itemTypes,
    allItemTypes,
    loading,
    error,
    success,
    pagination,
    fetchItemTypes,
    saveItemType,
    updateItemTypeDetails,
    changeItemTypeStatus,
    removeItemType,
    getAllItemTypesList,
  }
}

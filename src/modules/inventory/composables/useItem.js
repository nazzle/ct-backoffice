import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getPaginatedItems,
  updateItemStatus,
  createItem,
  updateItem,
  deleteItem,
  getAllItems,
} from '@/modules/inventory/api/items.js'
import { usePagination } from '@/composables/usePagination.js'

export function useItem() {
  const items = ref([])
  const allItems = ref([])
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)
  const pagination = usePagination().pagination

  const fetchItems = async () => {
    loading.value = true
    try {
      const response = await getPaginatedItems(pagination.value.page, pagination.value.pageSize)
      const responseObj = response.data
      if (responseObj.status === true) {
        items.value = responseObj?.items?.data
        pagination.value.page = responseObj.items.current_page
        pagination.value.pageSize = responseObj.items.per_page
        pagination.value.totalItems = responseObj.items.total
      } else {
        ElMessage.error(responseObj.message)
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to fetch items'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const saveItemDetails = async (data) => {
    loading.value = true
    try {
      const response = await createItem(data)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message)
      } else {
        success.value = false
        ElMessage.error(responseObj.message)
      }
    } catch (error) {
      success.value = false
      error.value = error.response?.data?.errors?.code[0] || 'Failed to save item details'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const updateItemDetails = async (data) => {
    loading.value = true
    try {
      const response = await updateItem(data, data?.id)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message)
      } else {
        success.value = false
        ElMessage.error(responseObj.message)
      }
    } catch (error) {
      error.value = error.response?.data?.errors?.code[0]
      ElMessage.error(error.value)
    }
  }

  const activateDeactivateItem = async (itemId) => {
    loading.value = true
    try {
      const response = await updateItemStatus(itemId)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message)
      } else {
        success.value = false
        ElMessage.error(responseObj.message)
      }
    } catch (error) {
      error.value = error.response?.data?.errors?.code[0]
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const removeItem = async (itemId) => {
    loading.value = true
    error.value = null
    success.value = false
    try {
      const response = await deleteItem(itemId)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Item deleted successfully')
      } else {
        ElMessage.error(responseObj.message || 'Failed to delete item')
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to delete item'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const getAllItemsList = async () => {
    loading.value = true
    try {
      const response = await getAllItems()
      const responseObj = response.data
      if (responseObj.status === true) {
        allItems.value = responseObj?.items || []
      }
    } catch (error) {
      console.log('Error fetching all items:', error)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => fetchItems())

  return {
    items,
    loading,
    error,
    success,
    pagination,
    fetchItems,
    saveItemDetails,
    updateItemDetails,
    activateDeactivateItem,
    removeItem,
    getAllItemsList,
    allItems
  }
}

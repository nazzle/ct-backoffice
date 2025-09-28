import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getItemGenders,
  createItemGender,
  updateItemGender,
  updateItemGenderStatus,
  deleteItemGender,
  getAllItemGenders,
} from '@/modules/reference-data/api/itemGenders.js'
import { usePagination } from '@/composables/usePagination.js'

export function useItemGender() {
  const itemGenders = ref([])
  const allItemGenders = ref([])
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)
  const pagination = usePagination().pagination

  const fetchItemGenders = async () => {
    loading.value = true
    try {
      const response = await getItemGenders(pagination.value.page, pagination.value.pageSize)
      const responseObj = response.data
      if (responseObj.status === true) {
        itemGenders.value = responseObj?.itemGenders?.data || responseObj?.data || []
        pagination.value.page =
          responseObj.itemGenders?.current_page || responseObj.current_page || 1
        pagination.value.pageSize = responseObj.itemGenders?.per_page || responseObj.per_page || 10
        pagination.value.totalItems = responseObj.itemGenders?.total || responseObj.total || 0
      } else {
        ElMessage.error(responseObj.message || 'Failed to fetch item genders')
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to fetch item genders'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const saveItemGender = async (data) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await createItemGender(data)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Item gender created successfully')
      } else {
        ElMessage.error(responseObj.message || 'Failed to create item gender')
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to save item gender'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const updateItemGenderDetails = async (data) => {
    loading.value = true
    error.value = null
    success.value = false

    const itemGenderId = data.id
    delete data.id

    try {
      const response = await updateItemGender(data, itemGenderId)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Item gender updated successfully')
      } else {
        ElMessage.error(responseObj.message || 'Failed to update item gender')
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to update item gender'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const changeItemGenderStatus = async (itemGenderId) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await updateItemGenderStatus(itemGenderId)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Item gender status updated successfully')
      } else {
        ElMessage.error(responseObj.message || 'Failed to update item gender status')
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to update item gender status'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const removeItemGender = async (itemGenderId) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await deleteItemGender(itemGenderId)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Item gender deleted successfully')
      } else {
        ElMessage.error(responseObj.message || 'Failed to delete item gender')
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to delete item gender'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const getAllItemGendersList = async () => {
    loading.value = true
    try {
      const response = await getAllItemGenders()
      const responseObj = response.data
      if (responseObj.status === true) {
        allItemGenders.value = responseObj?.data || []
      }
    } catch (error) {
      console.log('Error fetching all item genders:', error)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => fetchItemGenders())

  return {
    itemGenders,
    allItemGenders,
    loading,
    error,
    success,
    pagination,
    fetchItemGenders,
    saveItemGender,
    updateItemGenderDetails,
    changeItemGenderStatus,
    removeItemGender,
    getAllItemGendersList,
  }
}

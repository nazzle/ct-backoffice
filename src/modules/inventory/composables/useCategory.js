import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getPaginatedCategories, createCategory, updateCategory, updateCategoryStatus
} from '@/modules/inventory/api/categories.js'
import { usePagination } from '@/composables/usePagination.js'

export function useCategory () {

  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)
  const pagination = usePagination().pagination

  const fetchCategories = async () => {
    loading.value = true
    try {
      const response = await getPaginatedCategories(pagination.value.page, pagination.value.pageSize)
      const responseObj = response.data
      if (responseObj.status === true) {
        categories.value = responseObj?.categories?.data
        pagination.value.page = responseObj.categories.current_page;
        pagination.value.pageSize = responseObj.categories.per_page;
        pagination.value.totalItems = responseObj.categories.total;
      } else {
        ElMessage.error(responseObj.message)
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to fetch categories'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const saveCategoryDetails = async (data) => {
    loading.value = true
    try {
      const response = await createCategory(data)
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
      error.value = error.response?.data?.errors?.code[0] || 'Failed to save category details'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const updateCategoryDetails = async (data) => {
    loading.value = true
    try {
      const response = await updateCategory(data, data?.id)
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

  const activateDeactivateCategory = async (categoryId) => {
    loading.value = true
    try {
      const response = await updateCategoryStatus(categoryId)
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
    }
  }

  onMounted(() => fetchCategories())

  return {
    categories,
    loading,
    error,
    success,
    fetchCategories,
    saveCategoryDetails,
    activateDeactivateCategory,
    updateCategoryDetails,
    pagination,
  }

}


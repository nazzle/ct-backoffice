import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getAgeGroups,
  createAgeGroup,
  updateAgeGroup,
  updateAgeGroupStatus,
  deleteAgeGroup,
  getAllAgeGroups,
} from '@/modules/reference-data/api/ageGroups.js'
import { usePagination } from '@/composables/usePagination.js'

export function useAgeGroup() {
  const ageGroups = ref([])
  const allAgeGroups = ref([])
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)
  const pagination = usePagination().pagination

  const fetchAgeGroups = async () => {
    loading.value = true
    try {
      const response = await getAgeGroups(pagination.value.page, pagination.value.pageSize)
      const responseObj = response.data
      if (responseObj.status === true) {
        ageGroups.value = responseObj?.age_groups?.data || responseObj?.data || []
        pagination.value.page =
          responseObj.age_groups?.current_page || responseObj.current_page || 1
        pagination.value.pageSize = responseObj.age_groups?.per_page || responseObj.per_page || 10
        pagination.value.totalItems = responseObj.age_groups?.total || responseObj.total || 0
      } else {
        ElMessage.error(responseObj.message || 'Failed to fetch age groups')
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch age groups'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const saveAgeGroup = async (data) => {
    loading.value = true
    error.value = null
    success.value = false
    try {
      const response = await createAgeGroup(data)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Age group created successfully')
      } else {
        ElMessage.error(responseObj.message || 'Failed to create age group')
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to save age group'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const updateAgeGroupDetails = async (data) => {
    loading.value = true
    error.value = null
    success.value = false
    const id = data.id
    delete data.id
    try {
      const response = await updateAgeGroup(data, id)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Age group updated successfully')
      } else {
        ElMessage.error(responseObj.message || 'Failed to update age group')
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update age group'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const changeAgeGroupStatus = async (id) => {
    loading.value = true
    error.value = null
    success.value = false
    try {
      const response = await updateAgeGroupStatus(id)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Age group status updated successfully')
      } else {
        ElMessage.error(responseObj.message || 'Failed to update age group status')
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update age group status'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const removeAgeGroup = async (id) => {
    loading.value = true
    error.value = null
    success.value = false
    try {
      const response = await deleteAgeGroup(id)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Age group deleted successfully')
      } else {
        ElMessage.error(responseObj.message || 'Failed to delete age group')
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete age group'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const getAllAgeGroupsList = async () => {
    loading.value = true
    try {
      const response = await getAllAgeGroups()
      const responseObj = response.data
      if (responseObj.status === true) {
        allAgeGroups.value = responseObj?.data || []
      }
    } catch (err) {
      console.log('Error fetching all age groups:', err)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => fetchAgeGroups())

  return {
    ageGroups,
    allAgeGroups,
    loading,
    error,
    success,
    pagination,
    fetchAgeGroups,
    saveAgeGroup,
    updateAgeGroupDetails,
    changeAgeGroupStatus,
    removeAgeGroup,
    getAllAgeGroupsList,
  }
}

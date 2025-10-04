import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getPaginatedLocations, createLocation, updateLocation, updateLocationStatus, getAllLocations
} from '@/modules/inventory/api/Locations.js'
import { usePagination } from '@/composables/usePagination.js'

export function useLocation () {

  const locations = ref([])
  const allLocations = ref([])
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)
  const pagination = usePagination().pagination

  const fetchLocations = async () => {
    loading.value = true
    try {
      const response = await getPaginatedLocations(pagination.value.page, pagination.value.pageSize)
      const responseObj = response.data
      if (responseObj.status === true) {
        locations.value = responseObj?.locations?.data
        pagination.value.page = responseObj.locations.current_page;
        pagination.value.pageSize = responseObj.locations.per_page;
        pagination.value.totalItems = responseObj.locations.total;
      } else {
        ElMessage.error(responseObj.message)
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to fetch locations'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const getNonPaginatedLocationList = async () => {
    loading.value = true
    try {
      const response = await getAllLocations()
      const responseObj = response.data
      if (responseObj.status === true) {
        allLocations.value = responseObj?.locations
      } else {
        ElMessage.error(responseObj.message)
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to fetch all locations'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const saveLocationDetails = async (data) => {
    loading.value = true
    try {
      const response = await createLocation(data)
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
      error.value = error.response?.data?.errors?.code[0] || 'Failed to save location details'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const updateLocationDetails = async (data) => {
    loading.value = true
    try {
      const response = await updateLocation(data, data?.id)
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

  const activateDeactivateLocation = async (locationId) => {
    loading.value = true
    try {
      const response = await updateLocationStatus(locationId)
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

  onMounted(() => fetchLocations())

  return {
    locations,
    loading,
    error,
    success,
    fetchLocations,
    saveLocationDetails,
    activateDeactivateLocation,
    updateLocationDetails,
    pagination,
    getNonPaginatedLocationList,
    allLocations
  }

}


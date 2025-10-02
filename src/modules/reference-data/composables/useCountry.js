import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getCountries,
  createCountry,
  updateCountry,
  updateCountryStatus,
  deleteCountry,
  getAllCountries,
} from '@/modules/reference-data/api/countries.js'
import { usePagination } from '@/composables/usePagination.js'

export function useCountry() {
  const countries = ref([])
  const allCountries = ref([])
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)
  const pagination = usePagination().pagination

  const fetchCountries = async () => {
    loading.value = true
    try {
      const response = await getCountries(pagination.value.page, pagination.value.pageSize)
      const responseObj = response.data
      if (responseObj.status === true) {
        countries.value = responseObj?.countries?.data || responseObj?.data || []
        pagination.value.page = responseObj.countries?.current_page || responseObj.current_page || 1
        pagination.value.pageSize = responseObj.countries?.per_page || responseObj.per_page || 10
        pagination.value.totalItems = responseObj.countries?.total || responseObj.total || 0
      } else {
        ElMessage.error(responseObj.message || 'Failed to fetch countries')
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to fetch countries'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const saveCountry = async (data) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await createCountry(data)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Country created successfully')
      } else {
        ElMessage.error(responseObj.message || 'Failed to create country')
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to save country'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const updateCountryDetails = async (data) => {
    loading.value = true
    error.value = null
    success.value = false

    const countryId = data.id
    delete data.id

    try {
      const response = await updateCountry(data, countryId)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Country updated successfully')
      } else {
        ElMessage.error(responseObj.message || 'Failed to update country')
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to update country'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const changeCountryStatus = async (countryId) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await updateCountryStatus(countryId)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Country status updated successfully')
      } else {
        ElMessage.error(responseObj.message || 'Failed to update country status')
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to update country status'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const removeCountry = async (countryId) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await deleteCountry(countryId)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message || 'Country deleted successfully')
      } else {
        ElMessage.error(responseObj.message || 'Failed to delete country')
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to delete country'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const getAllCountriesList = async () => {
    loading.value = true
    try {
      const response = await getAllCountries()
      const responseObj = response.data
      if (responseObj.status === true) {
        allCountries.value = responseObj?.countries || []
      }
    } catch (error) {
      console.log('Error fetching all countries:', error)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => fetchCountries())

  return {
    countries,
    allCountries,
    loading,
    error,
    success,
    pagination,
    fetchCountries,
    saveCountry,
    updateCountryDetails,
    changeCountryStatus,
    removeCountry,
    getAllCountriesList,
  }
}

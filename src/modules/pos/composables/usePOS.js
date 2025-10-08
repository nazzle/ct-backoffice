import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  searchItems,
  getItemByBarcode,
  getAvailableStock,
  holdSale,
  getHeldSales,
  retrieveHeldSale,
  deleteHeldSale,
} from '@/modules/pos/api/pos.js'

export function usePOS() {
  const searchResults = ref([])
  const heldSales = ref([])
  const loading = ref(false)
  const error = ref(null)

  const searchPOSItems = async (query, locationId = null) => {
    if (!query) {
      searchResults.value = []
      return
    }

    loading.value = true
    try {
      const data = {
        location_id: locationId,
        keyword: query,
      }
      const response = await searchItems(data)
      const responseObj = response.data
      if (responseObj.status === true) {
        searchResults.value = responseObj?.inventories || []
      } else {
        searchResults.value = []
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to search items'
      searchResults.value = []
    } finally {
      loading.value = false
    }
  }

  const scanBarcode = async (barcode, locationId = null) => {
    loading.value = true
    try {
      const data = {
        location_id: locationId,
        keyword: barcode,
      }
      console.log('Data: ',data)
      const response = await getItemByBarcode(data)
      const responseObj = response.data
      if (responseObj.status === true) {
        return responseObj?.inventories
      } else {
        ElMessage.warning(responseObj.message || 'Item not found')
        return null
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to find item'
      ElMessage.error(error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  const checkStock = async (itemId, locationId) => {
    try {
      const response = await getAvailableStock(itemId, locationId)
      const responseObj = response.data
      if (responseObj.status === true) {
        return responseObj?.stock || 0
      }
      return 0
    } catch (err) {
      console.error('Failed to check stock:', err)
      return 0
    }
  }

  const holdCurrentSale = async (cartData) => {
    loading.value = true
    try {
      const response = await holdSale(cartData)
      const responseObj = response.data
      if (responseObj.status === true) {
        ElMessage.success('Sale held successfully')
        return responseObj?.held_sale
      } else {
        ElMessage.error(responseObj.message)
        return null
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to hold sale'
      ElMessage.error(error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  const fetchHeldSales = async () => {
    loading.value = true
    try {
      const response = await getHeldSales()
      const responseObj = response.data
      if (responseObj.status === true) {
        heldSales.value = responseObj?.held_sales || []
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch held sales'
    } finally {
      loading.value = false
    }
  }

  const retrieveSale = async (id) => {
    loading.value = true
    try {
      const response = await retrieveHeldSale(id)
      const responseObj = response.data
      if (responseObj.status === true) {
        ElMessage.success('Sale retrieved')
        return responseObj?.held_sale
      } else {
        ElMessage.error(responseObj.message)
        return null
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to retrieve sale'
      ElMessage.error(error.value)
      return null
    } finally {
      loading.value = false
    }
  }

  const removeHeldSale = async (id) => {
    loading.value = true
    try {
      const response = await deleteHeldSale(id)
      const responseObj = response.data
      if (responseObj.status === true) {
        ElMessage.success('Held sale deleted')
        await fetchHeldSales()
      } else {
        ElMessage.error(responseObj.message)
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete held sale'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  return {
    searchResults,
    heldSales,
    loading,
    error,
    searchPOSItems,
    scanBarcode,
    checkStock,
    holdCurrentSale,
    fetchHeldSales,
    retrieveSale,
    removeHeldSale,
  }
}

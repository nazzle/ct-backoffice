import api from '@/api/axios.js'

// POS specific endpoints
export const searchItems = (query, locationId = null) =>
  api.get(`/pos/items/search`, {
    params: { query, location_id: locationId },
  })

export const getItemByBarcode = (barcode, locationId = null) =>
  api.get(`/pos/items/barcode/${barcode}`, {
    params: { location_id: locationId },
  })

export const getAvailableStock = (itemId, locationId) =>
  api.get(`/pos/stock/check`, {
    params: { item_id: itemId, location_id: locationId },
  })

export const holdSale = (payload) => api.post(`/pos/hold`, payload)

export const getHeldSales = () => api.get(`/pos/held-sales`)

export const retrieveHeldSale = (id) => api.get(`/pos/held-sales/${id}`)

export const deleteHeldSale = (id) => api.delete(`/pos/held-sales/${id}`)

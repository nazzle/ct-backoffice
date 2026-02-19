import api from '@/api/axios.js'

// POS specific endpoints
export const searchItems = (data) =>
  api.get(`/inventories/search`, {
    params: { location_id: data.location_id, keyword: data.keyword },
  })

export const getItemByBarcode = (data) =>
  api.get(`/inventories/search`, {params: data})

export const getAvailableStock = (itemId, locationId) =>
  api.get(`/pos/stock/check`, {
    params: { item_id: itemId, location_id: locationId },
  })

export const holdSale = (payload) => api.post(`/pos/hold`, payload)

export const getHeldSales = () => api.get(`/pos/held-sales`)

export const retrieveHeldSale = (id) => api.get(`/pos/held-sales/${id}`)

export const deleteHeldSale = (id) => api.delete(`/pos/held-sales/${id}`)

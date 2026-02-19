import api from '@/api/axios.js'

// Inventory API endpoints
export const getInventoryRecords = (page, perPage) =>
  api.get(`/inventory-records`, {
    params: { page, per_page: perPage },
  })

export const createInventoryRecord = (inventoryRecordDto) => api.post(`/inventory-records`, inventoryRecordDto)

export const updateInventoryRecord = (inventoryRecordDto, inventoryRecordId) =>
  api.put(`/inventory-records/${inventoryRecordId}`, inventoryRecordDto)

export const updateInventoryRecordStatus = (inventoryRecordId) => api.patch(`/inventory-records/${inventoryRecordId}/status`)

export const deleteInventoryRecord = (inventoryRecordId) => api.delete(`/inventory-records/${inventoryRecordId}`)

export const getAllInventoryRecords = () => api.get(`/inventory-records/all`)

export const getInventoryRecordByItem = (itemId) => api.get(`/inventory-records/item/${itemId}`)

export const getInventoryRecordByLocation = (locationId) => api.get(`/inventory-records/location/${locationId}`)

import api from '@/api/axios.js'

// Inventory API endpoints
export const getInventory = (page, perPage) =>
  api.get(`/inventories`, {
    params: { page, per_page: perPage },
  })

export const createInventory = (inventoryDto) => api.post(`/inventories`, inventoryDto)

export const updateInventory = (inventoryDto, inventoryId) =>
  api.put(`/inventories/${inventoryId}`, inventoryDto)

export const updateInventoryStatus = (inventoryId) => api.patch(`/inventories/${inventoryId}/status`)

export const deleteInventory = (inventoryId) => api.delete(`/inventories/${inventoryId}`)

export const getAllInventory = () => api.get(`/inventories/all`)

export const getInventoryByItem = (itemId) => api.get(`/inventories/item/${itemId}`)

export const getInventoryByLocation = (locationId) => api.get(`/inventories/location/${locationId}`)

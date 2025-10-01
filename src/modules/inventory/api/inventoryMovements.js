import api from '@/api/axios.js'

// Inventory Movements API endpoints
export const getInventoryMovements = (page, perPage) =>
  api.get(`/movements`, {
    params: { page, per_page: perPage },
  })

export const createInventoryMovement = (movementDto) =>
  api.post(`/movements`, movementDto)

export const updateInventoryMovement = (movementDto, movementId) =>
  api.put(`/movements/${movementId}`, movementDto)

export const updateInventoryMovementStatus = (movementId) =>
  api.patch(`/movements/${movementId}/status`)

export const deleteInventoryMovement = (movementId) =>
  api.delete(`/movements/${movementId}`)

export const getAllInventoryMovements = () => api.get(`/movements/all`)

export const getMovementsByItem = (itemId) => api.get(`/movements/item/${itemId}`)

export const getMovementsByLocation = (locationId) =>
  api.get(`/movements/location/${locationId}`)

export const getMovementsByDateRange = (startDate, endDate) =>
  api.get(`/movements/date-range`, {
    params: { start_date: startDate, end_date: endDate },
  })

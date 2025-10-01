import api from '@/api/axios.js'

// Items API endpoints
export const getPaginatedItems = (page, perPage) =>
  api.get(`/items`, {
    params: { page, per_page: perPage },
  })

export const createItem = (itemDto) => api.post(`/items`, itemDto)

export const updateItem = (itemDto, itemId) => api.put(`/items/${itemId}`, itemDto)

export const updateItemStatus = (itemId) => api.patch(`/items/${itemId}/status`)

export const deleteItem = (itemId) => api.delete(`/items/${itemId}`)

export const getAllItems = () => api.get(`/items/all`)

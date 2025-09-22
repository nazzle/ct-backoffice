import api from '@/api/axios.js'

// exporting items end-points constants
export const getPaginatedItems = (page, perPage) =>
  api.get(`/items`, {
    params: { page, per_page: perPage },
  })
export const createItem  = (itemDto) => api.post(`/items` , itemDto)
export const updateItem = (itemDto, itemId) => api.put(`/items/${itemId}`, itemDto)
export const updateItemStatus = (itemId) => api.patch(`/items/${itemId}/delete`)

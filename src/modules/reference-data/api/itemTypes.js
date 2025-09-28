import api from '@/api/axios.js'

// Item Types API endpoints
export const getItemTypes = (page, perPage) =>
  api.get(`/item-types`, {
    params: { page, per_page: perPage },
  })

export const createItemType = (itemTypeDto) => api.post(`/item-types`, itemTypeDto)

export const updateItemType = (itemTypeDto, itemTypeId) =>
  api.put(`/item-types/${itemTypeId}`, itemTypeDto)

export const updateItemTypeStatus = (itemTypeId) =>
  api.patch(`/item-types/${itemTypeId}/status`)

export const deleteItemType = (itemTypeId) => api.delete(`/item-types/${itemTypeId}`)

export const getAllItemTypes = () => api.get(`/item-types/all`)

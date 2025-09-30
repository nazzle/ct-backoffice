import api from '@/api/axios.js'

// Item Genders API endpoints
export const getItemGenders = (page, perPage) =>
  api.get(`/item-genders`, {
    params: { page, per_page: perPage },
  })

export const createItemGender = (itemGenderDto) =>
  api.post(`/item-genders`, itemGenderDto)

export const updateItemGender = (itemGenderDto, itemGenderId) =>
  api.put(`/item-genders/${itemGenderId}`, itemGenderDto)

export const updateItemGenderStatus = (itemGenderId) =>
  api.patch(`/item-genders/${itemGenderId}/delete`)

export const deleteItemGender = (itemGenderId) =>
  api.delete(`/item-genders/${itemGenderId}`)

export const getAllItemGenders = () => api.get(`/item-genders/all`)

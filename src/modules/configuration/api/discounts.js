import api from '@/api/axios.js'

// exporting discounts end-points constants
export const getPaginatedDiscounts = (page, perPage) =>
  api.get(`/discounts`, {
    params: { page, per_page: perPage },
  })

export const createDiscount = (payload) => api.post(`/discounts`, payload)

export const updateDiscount = (payload, id) => api.put(`/discounts/${id}`, payload)

export const updateDiscountStatus = (id) => api.patch(`/discounts/${id}/delete`)

export const getAllDiscounts = () => api.get(`/discounts/all`)

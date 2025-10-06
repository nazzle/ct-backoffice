import api from '@/api/axios.js'

// exporting discount definitions end-points constants
export const getPaginatedDiscountDefinitions = (page, perPage) =>
  api.get(`/discount-definitions`, {
    params: { page, per_page: perPage },
  })

export const createDiscountDefinition = (payload) => api.post(`/discount-definitions`, payload)

export const updateDiscountDefinition = (payload, id) =>
  api.put(`/discount-definitions/${id}`, payload)

export const updateDiscountDefinitionStatus = (id) =>
  api.patch(`/discount-definitions/${id}/delete`)

export const getAllDiscountDefinitions = () => api.get(`/discount-definitions/all`)

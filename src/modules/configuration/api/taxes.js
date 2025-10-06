import api from '@/api/axios.js'

// exporting taxes end-points constants
export const getPaginatedTaxes = (page, perPage) =>
  api.get(`/taxes`, {
    params: { page, per_page: perPage },
  })

export const createTax = (payload) => api.post(`/taxes`, payload)

export const updateTax = (payload, id) => api.put(`/taxes/${id}`, payload)

export const updateTaxStatus = (id) => api.patch(`/taxes/${id}/delete`)

export const getAllTaxes = () => api.get(`/taxes/all`)

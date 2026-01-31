import api from '@/api/axios.js'

// Sales API endpoints
export const getPaginatedSales = (page, perPage, params = {}) =>
  api.get(`/sales`, {
    params: { page, per_page: perPage, ...params },
  })

export const getSaleById = (id) => api.get(`/sales/${id}`)

export const createSale = (payload) => api.post(`/sales`, payload)

export const updateSale = (payload, id) => api.put(`/sales/${id}`, payload)

export const completeSale = (id, payload) => api.post(`/sales/${id}/complete`, payload)

export const cancelSale = (id) => api.patch(`/sales/${id}/cancel`)

export const getPendingSales = (page, perPage) =>
  api.get(`/sales/pending`, {
    params: { page, per_page: perPage },
  })

export const getCompletedSales = (page, perPage) =>
  api.get(`/sales/completed`, {
    params: { page, per_page: perPage },
  })

export const getSalesSummary = (params = {}) => api.get(`/sales/summary`, { params })

// Receipt
export const printReceipt = (id) => api.get(`/sales/${id}/receipt`)

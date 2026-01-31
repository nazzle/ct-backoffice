import api from '@/api/axios.js'

// exporting payment options end-points constants
export const getPaginatedPaymentOptions = (page, perPage) =>
  api.get(`/payment-options`, {
    params: { page, per_page: perPage },
  })

export const createPaymentOption = (payload) => api.post(`/payment-options`, payload)

export const updatePaymentOption = (payload, id) => api.put(`/payment-options/${id}`, payload)

export const updatePaymentOptionStatus = (id) => api.patch(`/payment-options/${id}/delete`)

export const getAllPaymentOptions = () => api.get(`/payment-options/all`)

import api from '@/api/axios.js'

// exporting customers end-points constants
export const getPaginatedCustomers = (page, perPage) =>
  api.get(`/customers`, {
    params: { page, per_page: perPage },
  })

export const createCustomer = (payload) => api.post(`/customers`, payload)

export const updateCustomer = (payload, id) => api.put(`/customers/${id}`, payload)

export const updateCustomerStatus = (id) => api.patch(`/customers/${id}/delete`)

export const getAllCustomers = () => api.get(`/customers/all`)

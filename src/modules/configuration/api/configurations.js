import api from '@/api/axios.js'

// exporting configurations end-points constants
export const getPaginatedConfigurations = (page, perPage) =>
  api.get(`/configurations`, {
    params: { page, per_page: perPage },
  })

export const createConfiguration = (payload) => api.post(`/configurations`, payload)

export const updateConfiguration = (payload, id) => api.put(`/configurations/${id}`, payload)

export const updateConfigurationStatus = (id) => api.patch(`/configurations/${id}/delete`)

export const getAllConfigurations = () => api.get(`/configurations/all`)

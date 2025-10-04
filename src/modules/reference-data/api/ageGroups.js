import api from '@/api/axios.js'

// Age Groups API endpoints
export const getAgeGroups = (page, perPage) =>
  api.get(`/age-groups`, {
    params: { page, per_page: perPage },
  })

export const createAgeGroup = (dto) => api.post(`/age-groups`, dto)

export const updateAgeGroup = (dto, id) => api.put(`/age-groups/${id}`, dto)

export const updateAgeGroupStatus = (id) => api.patch(`/age-groups/${id}/status`)

export const deleteAgeGroup = (id) => api.delete(`/age-groups/${id}`)

export const getAllAgeGroups = () => api.get(`/age-groups/all`)

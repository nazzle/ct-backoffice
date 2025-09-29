import api from '@/api/axios.js'

// Exporting users endpoints constants
export const getPaginatedRoles = () => api.get(`/roles/paginated`, {})
export const getPermissionsList = () => api.get(`/permissions`, {})
export const saveRole = (data) => api.post(`/roles`, data)
export const updateRole = (data, id) => api.put(`/roles/${id}/permissions`, data)
export const deleteRole = (id) => api.patch(`/roles/${id}/delete`)

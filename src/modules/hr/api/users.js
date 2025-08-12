import api from '@/api/axios.js'

// Exporting users endpoints constants
export const getUsers = () => api.get(`/users`, {})
export const getAllRoles = () => api.get(`/roles/all`)
export const saveUser = (data) => api.post(`/users`, data)
export const deleteUser = (userDto, id) => api.patch(`/users/${id}`)
export const updateUser = (data, id) => api.put(`/users/${id}`, data)

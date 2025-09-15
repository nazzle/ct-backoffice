import api from '@/api/axios.js'

// exporting category end-points constants
export const getPaginatedCategories = () => api.get(`/categories`, {})
export const createCategory  = (categoryDto) => api.post(`/categories` , categoryDto)
export const updateCategory = (categoryDto, categoryId) => api.put(`/categories/${categoryId}`, categoryDto)
export const updateCategoryStatus = (categoryDto, categoryId) => api.patch(`/categories/${categoryId}/delete`)

import api from '@/api/axios.js'

// exporting category end-points constants
export const getPaginatedCategories = (page, perPage) =>
  api.get(`/categories`, {
    params: { page, per_page: perPage },
  })
export const createCategory  = (categoryDto) => api.post(`/categories` , categoryDto)
export const updateCategory = (categoryDto, categoryId) => api.put(`/categories/${categoryId}`, categoryDto)
export const updateCategoryStatus = (categoryId) => api.patch(`/categories/${categoryId}/delete`)
export const getAllCategories  = () => api.get(`/categories/all` )

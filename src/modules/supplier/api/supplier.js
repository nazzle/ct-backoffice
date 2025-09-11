import api from '@/api/axios.js'

// exporting supplier end-points constants
export const getSuppliers = () => api.get(`/suppliers`, {})
export const createSupplier = (supplierDto) => api.post(`/suppliers` , supplierDto)
export const updateSupplier = (supplierDto, supplierId) => api.put(`/suppliers/${supplierId}`, supplierDto)
export const updateSupplierStatus = (supplierDto, supplierId) => api.patch(`/suppliers/${supplierId}/status`)
export const getAllSuppliers = () => api.get(`/suppliers/all`, {})

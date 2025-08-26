import api from '@/api/axios.js'

// exporting supplier end-points constants
export const getSuppliers = () => api.get(`/suppliers`, {})
export const createSupplier = (employeeDto) => api.post(`/suppliers` , employeeDto)
export const updateSupplier = (employeeDto, supplierId) => api.put(`/suppliers/${supplierId}`, employeeDto)
export const updateSupplierStatus = (employeeDto, employeeId) => api.patch(`/employees/${employeeId}/status`)
export const getAllSuppliers = () => api.get(`/suppliers/all`, {})

import api from '@/api/axios.js'

// exporting employees end-points constants
export const getEmployees = () => api.get(`/employees`, {})
export const createEmployee = (employeeDto) => api.post(`/employees` , employeeDto)
export const updateEmployee = (employeeDto, employeeId) => api.put(`/employees/${employeeId}`, employeeDto)
export const updateEmployeeStatus = (employeeDto, employeeId) => api.patch(`/employees/${employeeId}/status`)
export const getAllEmployees = () => api.get(`/employees/all`, {})

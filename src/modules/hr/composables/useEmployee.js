import { onMounted, ref } from 'vue'
import {
  createEmployee, getAllEmployees,
  getEmployees,
  updateEmployee,
  updateEmployeeStatus
} from '@/modules/hr/api/employees.js'
import { ElMessage } from 'element-plus'

export function useEmployee() {
  const employees = ref([])
  const allEmployees = ref([])
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)

  const fetchEmployees = async () => {
    loading.value = true
    try {
      const response = await getEmployees()
      const responseObj = response.data
      if (responseObj.status === true) {
        employees.value = responseObj?.employeesResponse?.data
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to fetch employees'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const saveEmployee = async (employeeDto) => {

    loading.value = true
    error.value = null
    success.value = false

    try {
      const response = await createEmployee(employeeDto)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message)
      }
    } catch (error) {
      error.value = JSON.stringify(error?.response?.data?.errors) || 'Failed to save employee'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }

  }

  const updateEmployeeDetails = async (employeeDto) => {

    loading.value = true
    error.value = null
    success.value = false

    const employeeId = employeeDto.id
    delete employeeDto.id
    try {
      const response = await updateEmployee(employeeDto, employeeId)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message)
      }
    } catch (error) {
      console.log('Error: ',error)
      error.value = JSON.stringify(error?.response?.data?.errors) || 'Failed to update employee'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }

  }

  const changeStatus = async (employeeDto) => {

    loading.value = true
    error.value = null
    // success.value = false

    const employeeId = employeeDto.id
    try {
      const response = await updateEmployeeStatus(employeeDto, employeeId)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message)
      }
    } catch (error) {
      error.value = JSON.stringify(error?.response?.data?.errors) || 'Failed to update employee'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }

  }

  const getNonPaginatedListOfEmployees = async () => {
    loading.value = true

    try {
      const response = await getAllEmployees()
      const responseObj = response.data
      if (responseObj.status === true) {
        allEmployees.value = responseObj?.employeesResponse
      }
    } catch (err) {
      console.log('Error: ',err)
    }
  }

  onMounted(() => fetchEmployees())

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    saveEmployee,
    updateEmployeeDetails,
    changeStatus,
    success,
    getNonPaginatedListOfEmployees,
    allEmployees,
  }
}

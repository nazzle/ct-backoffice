import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { createSupplier, getSuppliers } from '@/modules/supplier/api/supplier.js'

export function useSupplier() {
  const suppliers = ref([])
  const allSuppliers = ref([])
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)

  const fetchSuppliers = async () => {
    loading.value = true
    try {
      const response = await getSuppliers()
      const responseObj = response.data
      if (responseObj.status === true) {
        suppliers.value = responseObj?.suppliers?.data
      } else {
        ElMessage.error("error")
      }
    } catch (error) {
      error.value = error.response?.data?.message || 'Failed to fetch suppliers'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const saveSupplierDetails = async (data) => {
    loading.value = true
    try {
      const response = await createSupplier(data.value)
      const responseObj = response.data
      if (responseObj.status === true) {
        success.value = true
        ElMessage.success(responseObj.message)
      } else {
        success.value = false
        ElMessage.error("error")
      }
    } catch (error) {
      success.value = false
      error.value = error.response?.data?.errors?.code[0] || 'Failed to save suppliers details'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => fetchSuppliers())

  return {
    suppliers,
    loading,
    error,
    success,
    allSuppliers,
    fetchSuppliers,
    saveSupplierDetails,
  }

}

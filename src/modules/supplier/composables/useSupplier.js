import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getSuppliers } from '@/modules/supplier/api/supplier.js'

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
        suppliers.value = responseObj?.data
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

  onMounted(() => fetchSuppliers())

  return {
    suppliers,
    loading,
    error,
    success,
    allSuppliers,
    fetchSuppliers
  }

}

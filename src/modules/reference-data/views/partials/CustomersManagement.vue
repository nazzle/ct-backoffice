<script setup>
import { onMounted, ref } from 'vue'
import { hasPermission } from '@/utils/permissions.js'
import BaseTable from '@/components/globals/BaseTable.vue'
import { ElMessage } from 'element-plus'
import CustomerForm from '@/modules/reference-data/views/partials/CustomerForm.vue'
import { useCustomer } from '@/modules/reference-data/composables/useCustomer.js'

// #------------- Reactive & Refs State -------------#
const formDialogVisible = ref(false)
const crudOption = ref()
const formObject = ref()
const columns = [
  { key: 'id', label: 'S/N', type: 'index' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'loyalty_points', label: 'Loyalty Points' },
]

const { fetchCustomers, customers, pagination, success, activateDeactivateCustomer } = useCustomer()

// #------------- Lifecycle ---------------------------#
onMounted(() => {
  fetchCustomers()
})

// #------------- Methods ---------------------------#
const openFormDialog = (crud, data) => {
  crudOption.value = crud
  formObject.value = data
  formDialogVisible.value = true
}

const operationCompleted = () => {
  formDialogVisible.value = false
  fetchCustomers()
}

const getNextData = (newPage) => {
  pagination.value.page = newPage
  fetchCustomers()
}

function changePageSize(newSize) {
  pagination.value.pageSize = newSize
  pagination.value.page = 1
  fetchCustomers()
}

const changeCustomerStatus = async (id) => {
  if (id) {
    await activateDeactivateCustomer(id)
    if (success.value) {
      await fetchCustomers()
    }
  } else {
    ElMessage.error('Missing customer ID')
  }
}
</script>

<template>
  <div class="customers-management">
    <el-row :gutter="20" class="pb-2">
      <el-col :span="24" class="text-right">
        <el-button
          v-if="hasPermission('CREATE_CUSTOMERS')"
          type="primary"
          size="small"
          plain
          @click="openFormDialog('create', null)"
        >
          <Icon icon="mdi-light:plus-circle" width="14" height="14" /> Add New Customer
        </el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="pb-2">
      <el-col :span="24" class="text-right">
        <base-table
          :pagination="pagination"
          :rows="customers"
          :columns="columns"
          @update:page="getNextData"
          @update:pageSize="changePageSize"
        >
          <el-table-column prop="type" label="Customer Type">
            <template #default="scope">
              <el-tag
                :type="
                  scope.row.type === 'vip'
                    ? 'warning'
                    : scope.row.type === 'wholesale'
                      ? 'success'
                      : 'info'
                "
              >
                {{ scope.row.type.toUpperCase() }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="active" label="Status">
            <template #default="scope">
              <el-tag :type="scope.row.active ? 'primary' : 'danger'">
                {{ scope.row.active ? 'Active' : 'Deactivated' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Actions">
            <template #default="scope">
              <el-button
                v-if="hasPermission('UPDATE_CUSTOMERS')"
                type="primary"
                size="small"
                plain
                round
                title="Update Customer Details"
                @click="openFormDialog('update', scope.row)"
              >
                <Icon icon="mdi-light:pencil" />
              </el-button>
              <el-button
                v-if="hasPermission('DELETE_CUSTOMERS')"
                :type="scope.row.active ? 'danger' : 'primary'"
                size="small"
                plain
                round
                :title="scope.row.active ? 'Deactivate Customer' : 'Activate Customer'"
                @click="changeCustomerStatus(scope.row?.id)"
              >
                <Icon :icon="`mdi-light:${scope.row.active ? 'delete' : 'check-circle'}`" />
              </el-button>
            </template>
          </el-table-column>
        </base-table>
      </el-col>
    </el-row>

    <!--   CUSTOMER FORM MODAL/DIALOG   -->
    <el-dialog v-model="formDialogVisible" width="55%">
      <CustomerForm
        :crud-option="crudOption"
        :customer-object="formObject"
        @completeCustomerAction="operationCompleted"
      />
    </el-dialog>
  </div>
</template>

<style scoped>
.customers-management {
  padding: 20px 0;
}
</style>

<script setup>
import { onMounted, ref } from 'vue'
import { hasPermission } from '@/utils/permissions.js'
import BaseTable from '@/components/globals/BaseTable.vue'
import { ElMessage } from 'element-plus'
import TaxForm from '@/modules/configuration/views/partials/TaxForm.vue'
import { useTax } from '@/modules/configuration/composables/useTax.js'

// #------------- Reactive & Refs State -------------#
const formDialogVisible = ref(false)
const crudOption = ref()
const formObject = ref()
const columns = [
  { key: 'id', label: 'S/N', type: 'index' },
  { key: 'name', label: 'Tax Name' },
  { key: 'rate', label: 'Rate (%)' },
]

const { fetchTaxes, taxes, pagination, success, activateDeactivateTax } = useTax()

// #------------- Lifecycle ---------------------------#
onMounted(() => {
  fetchTaxes()
})

// #------------- Methods ---------------------------#
const openFormDialog = (crud, data) => {
  crudOption.value = crud
  formObject.value = data
  formDialogVisible.value = true
}

const operationCompleted = () => {
  formDialogVisible.value = false
  fetchTaxes()
}

const getNextData = (newPage) => {
  pagination.value.page = newPage
  fetchTaxes()
}

function changePageSize(newSize) {
  pagination.value.pageSize = newSize
  pagination.value.page = 1
  fetchTaxes()
}

const changeTaxStatus = async (id) => {
  if (id) {
    await activateDeactivateTax(id)
    if (success.value) {
      await fetchTaxes()
    }
  } else {
    ElMessage.error('Missing tax ID')
  }
}
</script>

<template>
  <div class="taxes-management">
    <el-row :gutter="20" class="pb-2">
      <el-col :span="24" class="text-right">
        <el-button
          v-if="hasPermission('CREATE_CONFIGURATIONS')"
          type="primary"
          size="small"
          plain
          @click="openFormDialog('create', null)"
        >
          <Icon icon="mdi-light:plus-circle" width="14" height="14" /> Add New Tax
        </el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="pb-2">
      <el-col :span="24" class="text-right">
        <base-table
          :pagination="pagination"
          :rows="taxes"
          :columns="columns"
          @update:page="getNextData"
          @update:pageSize="changePageSize"
        >
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
                v-if="hasPermission('UPDATE_CONFIGURATIONS')"
                type="primary"
                size="small"
                plain
                round
                title="Update Tax Details"
                @click="openFormDialog('update', scope.row)"
              >
                <Icon icon="mdi-light:pencil" />
              </el-button>
              <el-button
                v-if="hasPermission('DELETE_CONFIGURATIONS')"
                :type="scope.row.active ? 'danger' : 'primary'"
                size="small"
                plain
                round
                :title="scope.row.active ? 'Deactivate Tax' : 'Activate Tax'"
                @click="changeTaxStatus(scope.row?.id)"
              >
                <Icon :icon="`mdi-light:${scope.row.active ? 'delete' : 'check-circle'}`" />
              </el-button>
            </template>
          </el-table-column>
        </base-table>
      </el-col>
    </el-row>

    <!--   TAX FORM MODAL/DIALOG   -->
    <el-dialog v-model="formDialogVisible" width="55%">
      <TaxForm
        :crud-option="crudOption"
        :tax-object="formObject"
        @completeTaxAction="operationCompleted"
      />
    </el-dialog>
  </div>
</template>

<style scoped>
.taxes-management {
  padding: 20px 0;
}
</style>

<script setup>
import { onMounted, ref } from 'vue'
import { hasPermission } from '@/utils/permissions.js'
import BaseTable from '@/components/globals/BaseTable.vue'
import { ElMessage } from 'element-plus'
import DiscountDefinitionForm from '@/modules/configuration/views/partials/DiscountDefinitionForm.vue'
import { useDiscountDefinition } from '@/modules/configuration/composables/useDiscountDefinition.js'

// #------------- Reactive & Refs State -------------#
const formDialogVisible = ref(false)
const crudOption = ref()
const formObject = ref()
const columns = [
  { key: 'id', label: 'S/N', type: 'index' },
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'value', label: 'Value' },
  { key: 'scope', label: 'Scope' },
]

const {
  fetchDiscountDefinitions,
  discountDefinitions,
  pagination,
  success,
  activateDeactivateDiscountDefinition,
} = useDiscountDefinition()

// #------------- Lifecycle ---------------------------#
onMounted(() => {
  fetchDiscountDefinitions()
})

// #------------- Methods ---------------------------#
const openFormDialog = (crud, data) => {
  crudOption.value = crud
  formObject.value = data
  formDialogVisible.value = true
}

const operationCompleted = () => {
  formDialogVisible.value = false
  fetchDiscountDefinitions()
}

const getNextData = (newPage) => {
  pagination.value.page = newPage
  fetchDiscountDefinitions()
}

function changePageSize(newSize) {
  pagination.value.pageSize = newSize
  pagination.value.page = 1
  fetchDiscountDefinitions()
}

const changeDiscountDefinitionStatus = async (id) => {
  if (id) {
    await activateDeactivateDiscountDefinition(id)
    if (success.value) {
      await fetchDiscountDefinitions()
    }
  } else {
    ElMessage.error('Missing discount definition ID')
  }
}
</script>

<template>
  <div class="discount-definitions-management">
    <el-row :gutter="20" class="pb-2">
      <el-col :span="24" class="text-right">
        <el-button
          v-if="hasPermission('CREATE_CONFIGURATIONS')"
          type="primary"
          size="small"
          plain
          @click="openFormDialog('create', null)"
        >
          <Icon icon="mdi-light:plus-circle" width="14" height="14" /> Add New Discount Definition
        </el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="pb-2">
      <el-col :span="24" class="text-right">
        <base-table
          :pagination="pagination"
          :rows="discountDefinitions"
          :columns="columns"
          @update:page="getNextData"
          @update:pageSize="changePageSize"
        >
          <el-table-column prop="type" label="Type">
            <template #default="scope">
              <el-tag :type="scope.row.type === 'percentage' ? 'warning' : 'success'">
                {{ scope.row.type.toUpperCase() }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="scope" label="Scope">
            <template #default="scope">
              <el-tag type="info">
                {{ scope.row.scope.toUpperCase() }}
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
                v-if="hasPermission('UPDATE_CONFIGURATIONS')"
                type="primary"
                size="small"
                plain
                round
                title="Update Discount Definition Details"
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
                :title="
                  scope.row.active
                    ? 'Deactivate Discount Definition'
                    : 'Activate Discount Definition'
                "
                @click="changeDiscountDefinitionStatus(scope.row?.id)"
              >
                <Icon :icon="`mdi-light:${scope.row.active ? 'delete' : 'check-circle'}`" />
              </el-button>
            </template>
          </el-table-column>
        </base-table>
      </el-col>
    </el-row>

    <!--   DISCOUNT DEFINITION FORM MODAL/DIALOG   -->
    <el-dialog v-model="formDialogVisible" width="55%">
      <DiscountDefinitionForm
        :crud-option="crudOption"
        :discount-definition-object="formObject"
        @completeDiscountDefinitionAction="operationCompleted"
      />
    </el-dialog>
  </div>
</template>

<style scoped>
.discount-definitions-management {
  padding: 20px 0;
}
</style>

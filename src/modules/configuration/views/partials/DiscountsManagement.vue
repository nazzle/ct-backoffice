<script setup>
import { onMounted, ref } from 'vue'
import { hasPermission } from '@/utils/permissions.js'
import BaseTable from '@/components/globals/BaseTable.vue'
import { ElMessage } from 'element-plus'
import DiscountForm from '@/modules/configuration/views/partials/DiscountForm.vue'
import { useDiscount } from '@/modules/configuration/composables/useDiscount.js'
import { dateFormatter } from '@/components/globals/constants.js'

// #------------- Reactive & Refs State -------------#
const formDialogVisible = ref(false)
const crudOption = ref()
const formObject = ref()
const columns = [
  { key: 'id', label: 'S/N', type: 'index' },
  { key: 'definition_id', label: 'Definition ID' },
]

const { fetchDiscounts, discounts, pagination, success, activateDeactivateDiscount } = useDiscount()

// #------------- Lifecycle ---------------------------#
onMounted(() => {
  fetchDiscounts()
})

// #------------- Methods ---------------------------#
const openFormDialog = (crud, data) => {
  crudOption.value = crud
  formObject.value = data
  formDialogVisible.value = true
}

const operationCompleted = () => {
  formDialogVisible.value = false
  fetchDiscounts()
}

const getNextData = (newPage) => {
  pagination.value.page = newPage
  fetchDiscounts()
}

function changePageSize(newSize) {
  pagination.value.pageSize = newSize
  pagination.value.page = 1
  fetchDiscounts()
}

const changeDiscountStatus = async (id) => {
  if (id) {
    await activateDeactivateDiscount(id)
    if (success.value) {
      await fetchDiscounts()
    }
  } else {
    ElMessage.error('Missing discount ID')
  }
}
</script>

<template>
  <div class="discounts-management">
    <el-row :gutter="20" class="pb-2">
      <el-col :span="24" class="text-right">
        <el-button
          v-if="hasPermission('CREATE_CONFIGURATIONS')"
          type="primary"
          size="small"
          plain
          @click="openFormDialog('create', null)"
        >
          <Icon icon="mdi-light:plus-circle" width="14" height="14" /> Add New Discount
        </el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="pb-2">
      <el-col :span="24" class="text-right">
        <base-table
          :pagination="pagination"
          :rows="discounts"
          :columns="columns"
          @update:page="getNextData"
          @update:pageSize="changePageSize"
        >
          <el-table-column label="Item">
            <template #default="scope">
              {{ scope.row?.item?.description }} ({{ scope.row?.item?.barcode }})
            </template>
          </el-table-column>
          <el-table-column prop="valid_from" label="Valid From">
            <template #default="scope">
              {{ dateFormatter(scope.row.valid_from) }}
            </template>
          </el-table-column>
          <el-table-column prop="valid_to" label="Valid To">
            <template #default="scope">
              {{ scope.row.valid_to ? dateFormatter(scope.row.valid_to) : 'No expiry' }}
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
                title="Update Discount Details"
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
                :title="scope.row.active ? 'Deactivate Discount' : 'Activate Discount'"
                @click="changeDiscountStatus(scope.row?.id)"
              >
                <Icon :icon="`mdi-light:${scope.row.active ? 'delete' : 'check-circle'}`" />
              </el-button>
            </template>
          </el-table-column>
        </base-table>
      </el-col>
    </el-row>

    <!--   DISCOUNT FORM MODAL/DIALOG   -->
    <el-dialog v-model="formDialogVisible" width="55%">
      <DiscountForm
        :crud-option="crudOption"
        :discount-object="formObject"
        @completeDiscountAction="operationCompleted"
      />
    </el-dialog>
  </div>
</template>

<style scoped>
.discounts-management {
  padding: 20px 0;
}
</style>

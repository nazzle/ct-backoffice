<script setup>
import { watch } from 'vue'
import { useInventoryRecord } from '@/modules/inventory/composables/useInventoryRecord.js'
import { ElMessageBox } from 'element-plus'
import BaseTable from '@/components/globals/BaseTable.vue'
import { hasPermission } from '@/utils/permissions.js'
import { dateFormatter } from '@/components/globals/constants.js'

const emit = defineEmits(['openInventoryRecordModal'])

const columns = [
  { key: 'id', label: 'S/N', type: 'index' },
  { key: 'active', label: 'Status' },
  { key: 'quantity', label: 'Quantity' },
]

const {
  inventoryRecords,
  loading,
  success,
  fetchInventoryRecords,
  changeInventoryRecordStatus,
  removeInventoryRecord,
  pagination,
} = useInventoryRecord()

watch(success, (value) => {
  if (value) {
    fetchInventoryRecords()
  }
})

const addInventoryRecord = () => {
  emit('openInventoryRecordModal', { type: 'create', data: null })
}

const editInventoryRecord = (record) => {
  emit('openInventoryRecordModal', { type: 'edit', data: record })
}

const deleteRecord = (record) => {
  ElMessageBox.confirm(
    'Are you sure you want to delete this inventory record? This action cannot be undone.',
    'Warning',
    {
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      type: 'warning',
    },
  )
    .then(() => {
      removeInventoryRecord(record.id)
    })
    .catch(() => {
      // User cancelled
    })
}

const toggleStatus = (record) => {
  const action = record.active ? 'deactivate' : 'activate'
  ElMessageBox.confirm(`Are you sure you want to ${action} this inventory record?`, 'Warning', {
    confirmButtonText: `Yes, ${action}`,
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(() => {
      changeInventoryRecordStatus(record.id)
    })
    .catch(() => {
      // User cancelled
    })
}

const getNextData = (newPage) => {
  pagination.value.page = newPage
  fetchInventoryRecords()
}

function changePageSize(newSize) {
  pagination.value.pageSize = newSize
  pagination.value.page = 1
  fetchInventoryRecords()
}

const reloadInventoryRecords = () => {
  fetchInventoryRecords()
}

defineExpose({
  reload: reloadInventoryRecords,
})
</script>

<template>
  <div class="inventory-record-management">
    <el-row :gutter="20" class="pb-2">
      <el-col :span="24" class="text-right">
        <el-button
          v-if="hasPermission('CREATE_INVENTORY_RECORDS')"
          type="primary"
          size="small"
          plain
          @click="addInventoryRecord"
        >
          <Icon icon="mdi-light:plus-circle" width="14" height="14" /> Add New Record
        </el-button>
      </el-col>
    </el-row>
    <BaseTable
      :pagination="pagination"
      :rows="inventoryRecords"
      :columns="columns"
      @update:page="getNextData"
      @update:pageSize="changePageSize"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column label="Item">
        <template #default="scope">
          {{ scope.row?.item?.description }} ({{ scope.row?.item?.barcode }})
        </template>
      </el-table-column>
      <el-table-column label="Location">
        <template #default="scope">
          {{ scope.row?.location?.name }}
        </template>
      </el-table-column>
      <el-table-column label="Reference">
        <template #default="scope">
          {{ scope.row?.reference || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="Date">
        <template #default="scope">
          {{ dateFormatter(scope.row?.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="220">
        <template #default="scope">
          <el-button
            v-if="hasPermission('UPDATE_INVENTORY_RECORDS')"
            type="primary"
            size="small"
            plain
            round
            title="Edit Record"
            @click="editInventoryRecord(scope.row)"
          >
            <Icon icon="mdi-light:pencil" />
          </el-button>
          <el-button
            v-if="hasPermission('UPDATE_INVENTORY_RECORDS')"
            :type="scope.row.active ? 'warning' : 'success'"
            size="small"
            plain
            round
            :title="scope.row.active ? 'Deactivate' : 'Activate'"
            @click="toggleStatus(scope.row)"
          >
            <Icon :icon="`mdi-light:${scope.row.active ? 'eye-off' : 'eye'}`" />
          </el-button>
          <el-button
            v-if="hasPermission('DELETE_INVENTORY_RECORDS')"
            type="danger"
            size="small"
            plain
            round
            title="Delete Record"
            @click="deleteRecord(scope.row)"
          >
            <Icon icon="mdi-light:delete" />
          </el-button>
        </template>
      </el-table-column>
    </BaseTable>
  </div>
</template>

<style scoped>
.inventory-record-management {
  padding: 20px 0;
}
</style>

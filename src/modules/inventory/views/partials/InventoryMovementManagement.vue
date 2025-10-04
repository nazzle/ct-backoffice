<script setup>
import { ref, watch } from 'vue'
import { useInventoryMovement } from '@/modules/inventory/composables/useInventoryMovement.js'
import { ElMessageBox } from 'element-plus'
import BaseTable from '@/components/globals/BaseTable.vue'
import { hasPermission } from '@/utils/permissions.js'
import { dateFormatter } from '@/components/globals/constants.js'

// #------------- Props / Emits ---------------------#
const emit = defineEmits(['openInventoryMovementModal'])

// #------------- Reactive & Refs State -------------#
const columns = [
  { key: 'id', label: 'S/N', type: 'index' },
  { key: 'active', label: 'Status' },
  { key: 'item_name', label: 'Item' },
  { key: 'location_name', label: 'Location' },
  { key: 'movement_type', label: 'Type' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'reference', label: 'Reference' },
  { key: 'created_at', label: 'Date' },
]

const {
  movements,
  loading,
  success,
  fetchInventoryMovements,
  changeInventoryMovementStatus,
  removeInventoryMovement,
  pagination,
} = useInventoryMovement()

// #------------- Watchers ---------------------------#
watch(success, (value) => {
  if (value) {
    fetchInventoryMovements()
  }
})

// #------------- Methods ---------------------------#
const addInventoryMovement = () => {
  emit('openInventoryMovementModal', { type: 'create', data: null })
}

const editInventoryMovement = (movement) => {
  emit('openInventoryMovementModal', { type: 'edit', data: movement })
}

const deleteInventoryMovement = (movement) => {
  ElMessageBox.confirm(
    `Are you sure you want to delete this inventory movement? This action cannot be undone.`,
    'Warning',
    {
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      type: 'warning',
    },
  )
    .then(() => {
      removeInventoryMovement(movement.id)
    })
    .catch(() => {
      // User cancelled
    })
}

const toggleStatus = (movement) => {
  const action = movement.active ? 'deactivate' : 'activate'
  ElMessageBox.confirm(`Are you sure you want to ${action} this inventory movement?`, 'Warning', {
    confirmButtonText: `Yes, ${action}`,
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(() => {
      changeInventoryMovementStatus(movement.id)
    })
    .catch(() => {
      // User cancelled
    })
}

const getNextData = (newPage) => {
  pagination.value.page = newPage
  fetchInventoryMovements()
}

function changePageSize(newSize) {
  pagination.value.pageSize = newSize
  pagination.value.page = 1
  fetchInventoryMovements()
}

const reloadInventoryMovements = () => {
  fetchInventoryMovements()
}

defineExpose({
  reload: reloadInventoryMovements,
})
</script>

<template>
  <div class="inventory-movement-management">
    <el-row :gutter="20" class="pb-2">
      <el-col :span="24" class="text-right">
        <el-button
          v-if="hasPermission('CREATE_MOVEMENTS')"
          type="primary"
          size="small"
          plain
          @click="addInventoryMovement"
        >
          <Icon icon="mdi-light:plus-circle" width="14" height="14" /> Add New Movement
        </el-button>
      </el-col>
    </el-row>

    <BaseTable
      :pagination="pagination"
      :rows="movements"
      :columns="columns"
      @update:page="getNextData"
      @update:pageSize="changePageSize"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column label="Actions" width="200">
        <template #default="scope">
          <el-button
            v-if="hasPermission('UPDATE_MOVEMENTS')"
            type="primary"
            size="small"
            plain
            round
            title="Edit Movement"
            @click="editInventoryMovement(scope.row)"
          >
            <Icon icon="mdi-light:pencil" />
          </el-button>
          <el-button
            v-if="hasPermission('DELETE_MOVEMENTS')"
            :type="scope.row.active ? 'warning' : 'success'"
            size="small"
            plain
            round
            :title="scope.row.active ? 'Deactivate' : 'Activate'"
            @click="toggleStatus(scope.row)"
          >
            <Icon :icon="`mdi-light:${scope.row.active ? 'eye-off' : 'eye'}`" />
          </el-button>
          <!-- Optional Delete action
          <el-button
            type="danger"
            size="small"
            plain
            round
            title="Delete Movement"
            @click="deleteInventoryMovement(scope.row)"
          >
            <Icon icon="mdi-light:delete" />
          </el-button>
          -->
        </template>
      </el-table-column>
    </BaseTable>
  </div>
</template>

<style scoped>
.inventory-movement-management {
  padding: 20px 0;
}
</style>

<script setup>
import { watch } from 'vue'
import { useInventory } from '@/modules/inventory/composables/useInventory.js'
import { ElMessageBox } from 'element-plus'
import BaseTable from '@/components/globals/BaseTable.vue'
import { hasPermission } from '@/utils/permissions.js'

// #------------- Props / Emits ---------------------#
const emit = defineEmits(['openInventoryModal'])

// #------------- Reactive & Refs State -------------#
const columns = [
  { key: 'id', label: 'S/N', type: 'index' },
  { key: 'active', label: 'Status' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'reorder_level', label: 'Min Quantity' },
  { key: 'created_at', label: 'Created At' },
]

const {
  inventory,
  loading,
  success,
  fetchInventory,
  changeInventoryStatus,
  removeInventory,
  pagination,
} = useInventory()

// #------------- Watchers ---------------------------#
watch(success, (value) => {
  if (value) {
    fetchInventory()
  }
})

// #------------- Methods ---------------------------#
const addInventory = () => {
  emit('openInventoryModal', { type: 'create', data: null })
}

const editInventory = (inventoryItem) => {
  emit('openInventoryModal', { type: 'edit', data: inventoryItem })
}

const deleteInventory = (inventoryItem) => {
  ElMessageBox.confirm(
    `Are you sure you want to delete this inventory record? This action cannot be undone.`,
    'Warning',
    {
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      type: 'warning',
    },
  )
    .then(() => {
      removeInventory(inventoryItem.id)
    })
    .catch(() => {
      // User cancelled
    })
}

const toggleStatus = (inventoryItem) => {
  const action = inventoryItem.active ? 'deactivate' : 'activate'
  ElMessageBox.confirm(`Are you sure you want to ${action} this inventory record?`, 'Warning', {
    confirmButtonText: `Yes, ${action}`,
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(() => {
      changeInventoryStatus(inventoryItem.id)
    })
    .catch(() => {
      // User cancelled
    })
}

const getNextData = (newPage) => {
  pagination.value.page = newPage
  fetchInventory()
}

function changePageSize(newSize) {
  pagination.value.pageSize = newSize
  pagination.value.page = 1
  fetchInventory()
}

const reloadInventory = () => {
  fetchInventory()
}

defineExpose({
  reload: reloadInventory,
})
</script>

<template>
  <div class="inventory-management">
    <el-row :gutter="20" class="pb-2">
      <el-col :span="24" class="text-right">
        <el-button
          v-if="hasPermission('CREATE_RESTOCKING')"
          type="primary"
          size="small"
          plain
          @click="addInventory"
        >
          <Icon icon="mdi-light:plus-circle" width="14" height="14" /> Add New Inventory
        </el-button>
      </el-col>
    </el-row>
    <BaseTable
      :pagination="pagination"
      :rows="inventory"
      :columns="columns"
      @update:page="getNextData"
      @update:pageSize="changePageSize"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column label="Item">
        <template #default="scope">
          {{ scope.row?.item?.description }} ({{ scope.row?.item.barcode }})
        </template>
      </el-table-column>
      <el-table-column label="Location">
        <template #default="scope">
          {{ scope.row?.location?.name }}
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="200">
        <template #default="scope">
          <el-button
            v-if="hasPermission('UPDATE_INVENTORY')"
            type="primary"
            size="small"
            plain
            round
            title="Edit Inventory"
            @click="editInventory(scope.row)"
          >
            <Icon icon="mdi-light:pencil" />
          </el-button>
          <el-button
            v-if="hasPermission('DELETE_INVENTORY')"
            :type="scope.row.active ? 'warning' : 'success'"
            size="small"
            plain
            round
            :title="scope.row.active ? 'Deactivate' : 'Activate'"
            @click="toggleStatus(scope.row)"
          >
            <Icon :icon="`mdi-light:${scope.row.active ? 'eye-off' : 'eye'}`" />
          </el-button>
        </template>
      </el-table-column>
    </BaseTable>
  </div>
</template>

<style scoped>
.inventory-management {
  padding: 20px 0;
}
</style>

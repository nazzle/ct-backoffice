<script setup>
import { ref, watch } from 'vue'
import { hasPermission } from '@/utils/permissions.js'
import { useItem } from '@/modules/inventory/composables/useItem.js'
import BaseTable from '@/components/globals/BaseTable.vue'
import { ElMessageBox } from 'element-plus'
import { dateFormatter } from '@/components/globals/constants.js'

// #------------- Props / Emits ---------------------#
const emit = defineEmits(['openItemModal'])

// #------------- Reactive & Refs State -------------#
const columns = [
  { key: 'id', label: 'S/N', type: 'index' },
  { key: 'active', label: 'Status' },
  { key: 'barcode', label: 'Barcode' },
  { key: 'buying_price', label: 'Buying Price' },
  { key: 'selling_price', label: 'Selling Price' },
  { key: 'type', label: 'Type' },
  { key: 'description', label: 'Description' },
  { key: 'created_at', label: 'Created At' },
]

const { pagination, items, loading, success, fetchItems, activateDeactivateItem, removeItem } =
  useItem()

// #------------- Watchers ---------------------------#
watch(success, (value) => {
  if (value) {
    fetchItems()
  }
})

// #------------- Methods ---------------------------#
const addItem = () => {
  emit('openItemModal', { type: 'create', data: null })
}

const editItem = (item) => {
  emit('openItemModal', { type: 'edit', data: item })
}

const deleteItem = (item) => {
  ElMessageBox.confirm(
    `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
    'Warning',
    {
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      type: 'warning',
    },
  )
    .then(() => {
      removeItem(item.id)
    })
    .catch(() => {
      // User cancelled
    })
}

const toggleStatus = (item) => {
  const action = item.active ? 'deactivate' : 'activate'
  ElMessageBox.confirm(`Are you sure you want to ${action} "${item.name}"?`, 'Warning', {
    confirmButtonText: `Yes, ${action}`,
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(() => {
      activateDeactivateItem(item.id)
    })
    .catch(() => {
      // User cancelled
    })
}

const getNextData = (newPage) => {
  pagination.value.page = newPage
  fetchItems()
}

function changePageSize(newSize) {
  pagination.value.pageSize = newSize
  pagination.value.page = 1
  fetchItems()
}

const reloadItems = () => {
  fetchItems()
}

defineExpose({
  reload: reloadItems,
})
</script>

<template>
  <div class="item-management">
    <el-row :gutter="20" class="pb-2">
      <el-col :span="24" class="text-right">
        <el-button
          v-if="hasPermission('CREATE_ITEMS')"
          type="primary"
          size="small"
          plain
          @click="addItem"
        >
          <Icon icon="mdi-light:plus-circle" width="14" height="14" /> Add New Item
        </el-button>
      </el-col>
    </el-row>

    <BaseTable
      :pagination="pagination"
      :rows="items"
      :columns="columns"
      @update:page="getNextData"
      @update:pageSize="changePageSize"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column label="Actions" width="200">
        <template #default="scope">
          <el-button
            v-if="hasPermission('UPDATE_ITEMS')"
            type="primary"
            size="small"
            plain
            round
            title="Edit Item"
            @click="editItem(scope.row)"
          >
            <Icon icon="mdi-light:pencil" />
          </el-button>
          <el-button
            v-if="hasPermission('DELETE_ITEMS')"
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
            title="Delete Item"
            @click="deleteItem(scope.row)"
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
.item-management {
  padding: 20px 0;
}
</style>

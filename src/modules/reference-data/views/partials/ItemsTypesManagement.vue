<script setup>
import { ref, watch } from 'vue'
import { useItemType } from '@/modules/reference-data/composables/useItemType.js'
import { ElMessageBox } from 'element-plus'
import { dateFormatter } from '@/components/globals/constants.js'
import BaseTable from '@/components/globals/BaseTable.vue'
import { hasPermission } from '@/utils/permissions.js'

// #------------- Props / Emits ---------------------#
const emit = defineEmits(['openItemTypeModal'])

// #------------- Reactive & Refs State -------------#
const columns = [
  { key: 'id', label: 'S/N', type: 'index' },
  { key: 'active', label: 'Status' },
  { key: 'code', label: 'Code' },
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'created_at', label: 'Created At' },
]
const {
  itemTypes,
  loading,
  success,
  fetchItemTypes,
  changeItemTypeStatus,
  removeItemType,
  pagination,
} = useItemType()

// #------------- Computed Properties -------------#

// #------------- Watchers ---------------------------#
watch(success, (value) => {
  if (value) {
    fetchItemTypes()
  }
})

// #------------- Methods ---------------------------#
const addItemType = () => {
  emit('openItemTypeModal', { type: 'create', data: null })
}

const editItemType = (itemType) => {
  emit('openItemTypeModal', { type: 'edit', data: itemType })
}

const deleteItemType = (itemType) => {
  ElMessageBox.confirm(
    `Are you sure you want to delete "${itemType.name}"? This action cannot be undone.`,
    'Warning',
    {
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      type: 'warning',
    },
  )
    .then(() => {
      removeItemType(itemType.id)
    })
    .catch(() => {
      // User cancelled
    })
}

const toggleStatus = (itemType) => {
  const action = itemType.active ? 'deactivate' : 'activate'
  ElMessageBox.confirm(`Are you sure you want to ${action} "${itemType.name}"?`, 'Warning', {
    confirmButtonText: `Yes, ${action}`,
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(() => {
      changeItemTypeStatus(itemType.id)
    })
    .catch(() => {
      // User cancelled
    })
}
const getNextData = (newPage) => {
  pagination.value.page = newPage
  fetchItemTypes()
}

function changePageSize(newSize) {
  pagination.value.pageSize = newSize
  pagination.value.page = 1
  fetchItemTypes()
}

const reloadItemsTypes = () => {
  fetchItemTypes()
}

defineExpose({
  reload: reloadItemsTypes,
})
</script>

<template>
  <div class="item-types-management">
    <el-row :gutter="20" class="pb-2">
      <el-col :span="24" class="text-right">
        <el-button type="primary" size="small" plain @click="addItemType" v-if="hasPermission('CREATE_ITEMS')">
          <Icon icon="mdi-light:plus-circle" width="14" height="14" /> Add New Item Type
        </el-button>
      </el-col>
    </el-row>
    <BaseTable
      :pagination="pagination"
      :rows="itemTypes"
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
            title="Edit Item Type"
            @click="editItemType(scope.row)"
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
        </template>
      </el-table-column>
    </BaseTable>
  </div>
</template>

<style scoped>
.item-types-management {
  padding: 20px 0;
}
</style>

<script setup>
import { ref, watch } from 'vue'
import { useItemGender } from '@/modules/reference-data/composables/useItemGender.js'
import { ElMessageBox } from 'element-plus'
import { dateFormatter } from '@/components/globals/constants.js'
import BaseTable from '@/components/globals/BaseTable.vue'

// #------------- Props / Emits ---------------------#
const emit = defineEmits(['openItemGenderModal'])

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
  itemGenders,
  loading,
  success,
  fetchItemGenders,
  changeItemGenderStatus,
  removeItemGender,
  pagination,
} = useItemGender()

// #------------- Computed Properties -------------#

// #------------- Watchers ---------------------------#
watch(success, (value) => {
  if (value) {
    fetchItemGenders()
  }
})

// #------------- Methods ---------------------------#
const addItemGender = () => {
  emit('openItemGenderModal', { type: 'create', data: null })
}

const editItemGender = (itemGender) => {
  emit('openItemGenderModal', { type: 'edit', data: itemGender })
}

const deleteItemGender = (itemGender) => {
  ElMessageBox.confirm(
    `Are you sure you want to delete "${itemGender.name}"? This action cannot be undone.`,
    'Warning',
    {
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      type: 'warning',
    },
  )
    .then(() => {
      removeItemGender(itemGender.id)
    })
    .catch(() => {
      // User cancelled
    })
}

const toggleStatus = (itemGender) => {
  const action = itemGender.active ? 'deactivate' : 'activate'
  ElMessageBox.confirm(`Are you sure you want to ${action} "${itemGender.name}"?`, 'Warning', {
    confirmButtonText: `Yes, ${action}`,
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(() => {
      changeItemGenderStatus(itemGender.id)
    })
    .catch(() => {
      // User cancelled
    })
}

const getNextData = (newPage) => {
  pagination.value.page = newPage
  fetchItemGenders()
}

function changePageSize(newSize) {
  pagination.value.pageSize = newSize
  pagination.value.page = 1
  fetchItemGenders()
}

const reloadItemGenders = () => {
  fetchItemGenders()
}

defineExpose({
  reload: reloadItemGenders,
})
</script>

<template>
  <div class="item-genders-management">
    <el-row :gutter="20" class="pb-2">
      <el-col :span="24" class="text-right">
        <el-button type="primary" size="small" plain @click="addItemGender">
          <Icon icon="mdi-light:plus-circle" width="14" height="14" /> Add New Item Gender
        </el-button>
      </el-col>
    </el-row>

    <BaseTable
      :pagination="pagination"
      :rows="itemGenders"
      :columns="columns"
      @update:page="getNextData"
      @update:pageSize="changePageSize"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column label="Actions" width="200">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            plain
            round
            title="Edit Item Type"
            @click="editItemGender(scope.row)"
          >
            <Icon icon="mdi-light:pencil" />
          </el-button>
          <el-button
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
            type="danger"
            size="small"
            plain
            round
            title="Delete Item Type"
            @click="deleteItemGender(scope.row)"
          >
            <Icon icon="mdi-light:delete" />
          </el-button>
        </template>
      </el-table-column>
    </BaseTable>
  </div>
</template>

<style scoped>
.item-genders-management {
  padding: 20px 0;
}
</style>

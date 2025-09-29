<script setup>
import { ref, watch } from 'vue'
import { useItemGender } from '@/modules/reference-data/composables/useItemGender.js'
import { ElMessageBox } from 'element-plus'
import { dateFormatter } from '@/components/globals/constants.js'

// #------------- Props / Emits ---------------------#
const emit = defineEmits(['openItemGenderModal'])

// #------------- Reactive & Refs State -------------#
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

    <el-table :data="itemGenders" style="width: 100%" v-loading="loading">
      <el-table-column label="S/N" type="index" width="80" />
      <el-table-column prop="name" label="Item Gender Name" />
      <el-table-column prop="description" label="Description" />
      <el-table-column prop="active" label="Status" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.active ? 'primary' : 'danger'">
            {{ scope.row.active ? 'Active' : 'Inactive' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="Date Created" width="150">
        <template #default="scope">
          {{ dateFormatter(scope.row?.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="200">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            plain
            round
            title="Edit Item Gender"
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
            title="Delete Item Gender"
            @click="deleteItemGender(scope.row)"
          >
            <Icon icon="mdi-light:delete" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.item-genders-management {
  padding: 20px 0;
}
</style>

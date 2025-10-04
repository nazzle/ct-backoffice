<script setup>
import { ref, watch } from 'vue'
import { useAgeGroup } from '@/modules/reference-data/composables/useAgeGroup.js'
import { ElMessageBox } from 'element-plus'
import BaseTable from '@/components/globals/BaseTable.vue'
import { hasPermission } from '@/utils/permissions.js'

// #------------- Props / Emits ---------------------#
const emit = defineEmits(['openAgeGroupModal'])

// #------------- Reactive & Refs State -------------#
const columns = [
  { key: 'id', label: 'S/N', type: 'index' },
  { key: 'active', label: 'Status' },
  { key: 'code', label: 'Code' },
  { key: 'from', label: 'From' },
  { key: 'to', label: 'To' },
  { key: 'description', label: 'Description' },
  { key: 'created_at', label: 'Created At' },
]

const {
  ageGroups,
  loading,
  success,
  fetchAgeGroups,
  changeAgeGroupStatus,
  removeAgeGroup,
  pagination,
} = useAgeGroup()

// #------------- Watchers ---------------------------#
watch(success, (value) => {
  if (value) {
    fetchAgeGroups()
  }
})

// #------------- Methods ---------------------------#
const addAgeGroup = () => {
  emit('openAgeGroupModal', { type: 'create', data: null })
}

const editAgeGroup = (row) => {
  emit('openAgeGroupModal', { type: 'edit', data: row })
}

const deleteAgeGroup = (row) => {
  ElMessageBox.confirm(`Are you sure you want to delete "${row.name}"?`, 'Warning', {
    confirmButtonText: 'Yes, Delete',
    cancelButtonText: 'Cancel',
    type: 'warning',
  }).then(() => removeAgeGroup(row.id))
}

const toggleStatus = (row) => {
  const action = row.active ? 'deactivate' : 'activate'
  ElMessageBox.confirm(`Are you sure you want to ${action} "${row.name}"?`, 'Warning', {
    confirmButtonText: `Yes, ${action}`,
    cancelButtonText: 'Cancel',
    type: 'warning',
  }).then(() => changeAgeGroupStatus(row.id))
}

const getNextData = (newPage) => {
  pagination.value.page = newPage
  fetchAgeGroups()
}

function changePageSize(newSize) {
  pagination.value.pageSize = newSize
  pagination.value.page = 1
  fetchAgeGroups()
}

const reloadAgeGroups = () => {
  fetchAgeGroups()
}

defineExpose({
  reload: reloadAgeGroups,
})
</script>

<template>
  <div class="age-groups-management">
    <el-row :gutter="20" class="pb-2">
      <el-col :span="24" class="text-right">
        <el-button type="primary" size="small" plain @click="addAgeGroup"  v-if="hasPermission('CREATE_ITEMS')">
          <Icon icon="mdi-light:plus-circle" width="14" height="14" /> Add New Age Group
        </el-button>
      </el-col>
    </el-row>

    <BaseTable
      :pagination="pagination"
      :rows="ageGroups"
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
            title="Edit Age Group"
            @click="editAgeGroup(scope.row)"
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
            title="Delete Age Group"
            @click="deleteAgeGroup(scope.row)"
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
.age-groups-management {
  padding: 20px 0;
}
</style>

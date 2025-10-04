<script setup>
import { ref, watch } from 'vue'
import { useCountry } from '@/modules/reference-data/composables/useCountry.js'
import { ElMessageBox } from 'element-plus'
import { dateFormatter } from '@/components/globals/constants.js'
import BaseTable from '@/components/globals/BaseTable.vue'
import { hasPermission } from '@/utils/permissions.js'

// #------------- Props / Emits ---------------------#
const emit = defineEmits(['openCountryModal'])

// #------------- Reactive & Refs State -------------#
const columns = [

  { key: 'id', label: 'S/N', type: 'index' },
  { key: 'active', label: 'Status' },
  { key: 'code', label: 'Code' },
  { key: 'name', label: 'Name' },
  { key: 'created_at', label: 'Created At' },
]
const {
  countries,
  loading,
  success,
  fetchCountries,
  changeCountryStatus,
  removeCountry,
  pagination,
} = useCountry()

// #------------- Computed Properties -------------#

// #------------- Watchers ---------------------------#
watch(success, (value) => {
  if (value) {
    fetchCountries()
  }
})

// #------------- Methods ---------------------------#
const addCountry = () => {
  emit('openCountryModal', { type: 'create', data: null })
}

const editCountry = (country) => {
  emit('openCountryModal', { type: 'edit', data: country })
}

const deleteCountry = (country) => {
  ElMessageBox.confirm(
    `Are you sure you want to delete "${country.name}"? This action cannot be undone.`,
    'Warning',
    {
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      type: 'warning',
    },
  )
    .then(() => {
      removeCountry(country.id)
    })
    .catch(() => {
      // User cancelled
    })
}

const toggleStatus = (country) => {
  const action = country.active ? 'deactivate' : 'activate'
  ElMessageBox.confirm(`Are you sure you want to ${action} "${country.name}"?`, 'Warning', {
    confirmButtonText: `Yes, ${action}`,
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(() => {
      changeCountryStatus(country.id)
    })
    .catch(() => {
      // User cancelled
    })
}

const getNextData = (newPage) => {
  pagination.value.page = newPage
  fetchCountries()
}

function changePageSize(newSize) {
  pagination.value.pageSize = newSize
  pagination.value.page = 1
  fetchCountries()
}

const reloadCountries = () => {
  fetchCountries()
}

defineExpose({
  reload: reloadCountries,
})
</script>

<template>
  <div class="countries-management">
    <el-row :gutter="20" class="pb-2">
      <el-col :span="24" class="text-right">
        <el-button type="primary" size="small" plain @click="addCountry"  v-if="hasPermission('CREATE_ITEMS')">
          <Icon icon="mdi-light:plus-circle" width="14" height="14" /> Add New Country
        </el-button>
      </el-col>
    </el-row>

    <BaseTable
      :pagination="pagination"
      :rows="countries"
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
            @click="editCountry(scope.row)"
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
.countries-management {
  padding: 20px 0;
}
</style>

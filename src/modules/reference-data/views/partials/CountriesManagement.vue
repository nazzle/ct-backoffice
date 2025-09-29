<script setup>
import { ref, watch } from 'vue'
import { useCountry } from '@/modules/reference-data/composables/useCountry.js'
import { ElMessageBox } from 'element-plus'
import { dateFormatter } from '@/components/globals/constants.js'

// #------------- Props / Emits ---------------------#
const emit = defineEmits(['openCountryModal'])

// #------------- Reactive & Refs State -------------#
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
        <el-button type="primary" size="small" plain @click="addCountry">
          <Icon icon="mdi-light:plus-circle" width="14" height="14" /> Add New Country
        </el-button>
      </el-col>
    </el-row>

    <el-table :data="countries" style="width: 100%" v-loading="loading">
      <el-table-column label="S/N" type="index" width="80" />
      <el-table-column prop="name" label="Country Name" />
      <el-table-column prop="code" label="Country Code" width="120" />
      <el-table-column prop="currency" label="Currency" width="100" />
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
            title="Edit Country"
            @click="editCountry(scope.row)"
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
            title="Delete Country"
            @click="deleteCountry(scope.row)"
          >
            <Icon icon="mdi-light:delete" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.countries-management {
  padding: 20px 0;
}
</style>

<script setup>
import { hasPermission } from '@/utils/permissions.js'
import { useLocation } from '@/modules/inventory/composables/useLocation.js'
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import BaseTable from '@/components/globals/BaseTable.vue'
import PageTitle from '@/components/globals/PageTitle.vue'

// #------------- Reactive & Refs State -------------#
const locationForm = ref(null)
const formDialogVisible = ref(false)
const crudOption = ref()
const form = ref({
  name: '',
  code: '',
  description: '',
})
const columns = [
  { key: 'id', label: 'S/N', type: 'index' },
  { key: 'code', label: 'Code' },
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'description', label: 'Description' },
]
const locationTypes = ref([
  { id: 1, name: 'Shop', value: 'shop' },
  { id: 2, name: 'Store', value: 'store' },
])
const {
  pagination, fetchLocations, locations, activateDeactivateLocation, success, saveLocationDetails,
  updateLocationDetails,
} = useLocation()

// #------------- Computed Properties ---------------#
const pageTitle = computed(() => {
  return  crudOption.value === 'create' ? 'CREATE NEW LOCATION' : 'UPDATE CATEGORY LOCATION'
})

// #------------- Watchers ---------------------------#
onMounted(() => {
  fetchLocations()
})

// #------------- Methods ---------------------------#
const openFormDialog = (crud, data) => {
  crudOption.value = crud
  if (crud === 'update') { form.value = data }
  formDialogVisible.value = true
}

const operationCompleted = () => {
  locationForm.value.resetFields()
  formDialogVisible.value = false
  fetchLocations()
}

const getNextData = (newPage) => {
  pagination.value.page = newPage;
  fetchLocations()
}

function changePageSize(newSize) {
  pagination.value.pageSize = newSize;
  pagination.value.page = 1;
  fetchLocations()
}

const onSubmit = () => {
  locationForm.value.validate(async (valid) => {
    if (valid) {
      await saveLocationDetails(form.value)
      if (success) {
        await fetchLocations()
        operationCompleted()
      }
    }
  })
}

const onUpdate = () => {
  locationForm.value.validate(async (valid) => {
    if (valid) {
      await updateLocationDetails(form.value)
      if (success) {
        await fetchLocations()
        operationCompleted()
      }
    }
  })
}

const changeLocationStatus = async (locationId) => {
  if (locationId) {
    await activateDeactivateLocation(locationId)
    if (success.value) {await fetchLocations()}
  } else {
    ElMessage.error('Missing location ID')
  }
}

</script>

<template>
  <el-row :gutter="20" class="pb-2">
    <el-col :span="24" class="text-right">
      <el-button
        v-if="hasPermission('CREATE_CATEGORIES')" type="primary" size="small"
        plain
        @click="openFormDialog('create', null)"
      >
        <Icon icon="mdi-light:plus-circle" width="14" height="14" /> Add New Location
      </el-button>
    </el-col>
  </el-row>

  <el-row :gutter="20" class="pb-2">
    <el-col :span="24" class="text-right">
      <base-table
        :pagination="pagination"
        :rows="locations"
        :columns="columns"
        @update:page="getNextData"
        @update:pageSize="changePageSize"
      >
        <el-table-column prop="active" label="Status">
          <template #default="scope">
            <el-tag :type="scope.row.active ? 'primary' : 'danger'">
              {{ scope.row.active ? 'Active' : 'Deactivated' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Actions">
          <template #default="scope">
            <el-button
              v-if="hasPermission('UPDATE_CATEGORIES')"
              type="primary"
              size="small"
              plain
              round
              title="Update Category Details"
              @click="openFormDialog('update', scope.row)"
            >
              <Icon icon="mdi-light:pencil" />
            </el-button>
            <el-button
              v-if="hasPermission('DELETE_CATEGORIES')"
              :type="scope.row.active ? 'danger' : 'primary'"
              size="small"
              plain
              round
              :title="scope.row.active ? 'Deactivate Category' : 'Activate Category'"
              @click="changeLocationStatus(scope.row?.id)"
            >
              <Icon :icon="`mdi-light:${scope.row.active ? 'delete' : 'check-circle'}`" />
            </el-button>
          </template>
        </el-table-column>
      </base-table>
    </el-col>
  </el-row>

  <!--   LOCATION FORM MODAL/DIALOG   -->
  <el-dialog v-model="formDialogVisible" width="55%">
    <PageTitle :title="pageTitle" />
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form :model="form" ref="locationForm" label-position="top">
          <el-form-item label="Code" prop="code" required>
            <el-input v-model="form.code" placeholder="Write unique codification" clearable />
          </el-form-item>
          <el-form-item label="Name" prop="name" required>
            <el-input v-model="form.name" placeholder="Write code name" clearable />
          </el-form-item>
          <el-form-item label="Type" prop="type" required>
            <el-select v-model="form.type" clearable filterable placeholder="Select type">
              <el-option v-for="item in locationTypes" :key="item.id" :label="item.name" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="Description" prop="description" required>
            <el-input
              type="textarea" v-model="form.description" placeholder="Enter code description"
              clearable
            />
          </el-form-item>
          <el-divider />
          <el-form-item>
            <el-button
              v-if="crudOption === 'create' " type="primary" plain size="small"
              @click="onSubmit"
            >
              Create New Location
            </el-button>
            <el-button
              v-if="crudOption === 'update' " type="primary" plain size="small"
              @click="onUpdate"
            >
              Update Location Details
            </el-button>
            <el-button plain size="small" @click="cancelForm">Cancel</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<style scoped>

</style>

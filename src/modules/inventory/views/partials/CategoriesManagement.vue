<script setup>
import { onMounted, ref } from 'vue'
import { useCategory } from '@/modules/inventory/composables/useCategory.js'
import { hasPermission } from '@/utils/permissions.js'
import BaseTable from '@/components/globals/BaseTable.vue'
import CategoryForm from '@/modules/inventory/views/partials/CategoryForm.vue'

// #------------- Props / Emits ---------------------#

// #------------- Reactive & Refs State -------------#
const formDialogVisible = ref(false)
const crudOption = ref()
const formObject = ref()
const columns = [
  { key: 'id', label: 'S/N', type: 'index' },
  { key: 'code', label: 'Code' },
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
]

const { fetchCategories, categories, pagination } = useCategory()

// #------------- Watchers ---------------------------#
onMounted(() => {
  fetchCategories()
})

// #------------- Methods ---------------------------#
const openFormDialog = (crud, data) => {
  crudOption.value = crud
  formObject.value = data
  formDialogVisible.value = true
}

const operationCompleted = () => {
  formDialogVisible.value = false
  fetchCategories()
}

const getNextData = (newPage) => {
  pagination.value.page = newPage;
  fetchCategories()
}

function changePageSize(newSize) {
  pagination.value.pageSize = newSize;
  pagination.value.page = 1;
  fetchCategories()
}

</script>

<template>
  <el-row :gutter="20" class="pb-2">
    <el-col :span="24" class="text-right">
      <el-button
        v-if="hasPermission('SAVE_EMPLOYEE_DETAILS')" type="primary" size="small"
        plain @click="openFormDialog('create', null)"
      >
        <Icon icon="mdi-light:plus-circle" width="14" height="14" /> Add New Category
      </el-button>
    </el-col>
  </el-row>
  <el-row :gutter="20" class="pb-2">
    <el-col :span="24" class="text-right">
      <base-table
        :pagination="pagination"
        :rows="categories"
        :columns="columns"
        @update:page="getNextData"
        @update:pageSize="changePageSize"
      >
        <el-table-column label="Actions">
          <template #default="scope">
            <el-button
              v-if="hasPermission('UPDATE_USERS')"
              type="primary"
              size="small"
              plain
              round
              title="Update User Details"
            >
              <Icon icon="mdi-light:pencil" />
            </el-button>
            <el-button
              v-if="hasPermission('DELETE_USERS')"
              :type="scope.row.active ? 'danger' : 'primary'"
              size="small"
              plain
              round
              :title="scope.row.active ? 'Deactivate Employee' : 'Activate Employee'"
            >
              <Icon :icon="`mdi-light:${scope.row.active ? 'delete' : 'check-circle'}`" />
            </el-button>
          </template>
        </el-table-column>
      </base-table>
    </el-col>
  </el-row>

  <!--   CATEGORY FORM MODAL/DIALOG   -->
  <el-dialog v-model="formDialogVisible" width="55%">
    <CategoryForm
      :crud-option="crudOption" :category-object="formObject"
      @completeCategoryAction="operationCompleted"
    />
  </el-dialog>
</template>

<style scoped>

</style>

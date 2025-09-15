<script setup>
import PageTitle from '@/components/globals/PageTitle.vue'
import { hasPermission } from '@/utils/permissions.js'
import BaseTable from '@/components/globals/BaseTable.vue'
import CategoryForm from '@/modules/inventory/views/partials/CategoryForm.vue'
import { onMounted, ref } from 'vue'
import { useCategory } from '@/modules/inventory/composables/useCategory.js'

// #------------- Props / Emits ---------------------#

// #------------- Reactive & Refs State -------------#
const pageTitle = 'Items & Inventories Management'
const categoryColumns = ref([])
const formDialogVisible = ref(false)
const crudOption = ref()
const formObject = ref()
const { fetchCategories, categories } = useCategory()
const componentType = ref()

// #------------- Watchers ---------------------------#
onMounted(() => {
  fetchCategories()
})

// #------------- Methods ---------------------------#
const openFormDialog = (type, crud, data) => {
  crudOption.value = crud
  formObject.value = data
  componentType.value = type
  formDialogVisible.value = true
}

const operationCompleted = () => {
  formDialogVisible.value = false
  if (componentType.value === 'CAT') {
    fetchCategories()
  }
}

</script>

<template>
  <div class="page-container">
    <PageTitle :title="pageTitle" />
    <el-row :gutter="20">
      <el-col :span="24">
        <el-tabs type="border-card">

          <!--   CATEGORIES LIST TAB   -->
          <el-tab-pane v-if="hasPermission('VIEW_EMPLOYEES_LIST')" label="Categories Management">
            <el-row :gutter="20" class="pb-2">
              <el-col :span="24" class="text-right">
                <el-button
                  v-if="hasPermission('SAVE_EMPLOYEE_DETAILS')" type="primary" size="small"
                  plain @click="openFormDialog('CAT', 'create', null)"
                >
                  <Icon icon="mdi-light:plus-circle" width="14" height="14" /> Add New Category
                </el-button>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="pb-2">
              <el-col :span="24" class="text-right">
                <base-table
                  pagination=""
                  :rows="categories"
                  :columns="[
                    { key: 'code', label: 'Code' },
                    { key: 'name', label: 'Name' },
                    { key: 'description', label: 'Description' },
                  ]"
                >
                </base-table>
              </el-col>
            </el-row>
          </el-tab-pane>

          <!--   LOCATION LIST TAB   -->
          <el-tab-pane v-if="hasPermission('VIEW_EMPLOYEES_LIST')" label="Locations Management">
          </el-tab-pane>

          <!--   ITEMS LIST TAB   -->
          <el-tab-pane v-if="hasPermission('VIEW_EMPLOYEES_LIST')" label="Items Management">
          </el-tab-pane>

          <!--   INVENTORIES LIST TAB   -->
          <el-tab-pane v-if="hasPermission('VIEW_EMPLOYEES_LIST')" label="Inventory Management">
          </el-tab-pane>

          <!--   INVENTORY MOVEMENTS LIST TAB   -->
          <el-tab-pane v-if="hasPermission('VIEW_EMPLOYEES_LIST')" label="Inventory-Movements Management">
          </el-tab-pane>

        </el-tabs>
      </el-col>
    </el-row>
  </div>

  <!--   CATEGORY FORM MODAL/DIALOG   -->
  <el-dialog v-model="formDialogVisible" width="55%">
    <CategoryForm
      v-if="componentType === 'CAT' " :crud-option="crudOption" :category-object="formObject"
      @completeCategoryAction="operationCompleted"
    />
  </el-dialog>
</template>

<style scoped>

</style>

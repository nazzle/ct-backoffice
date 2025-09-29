<script setup>
import { ref } from 'vue'
import { hasPermission } from '@/utils/permissions.js'
import { useItem } from '@/modules/inventory/composables/useItem.js'
import BaseTable from '@/components/globals/BaseTable.vue'
import { ElMessage } from 'element-plus'

// #------------- Reactive & Refs State -------------#
const itemForm = ref(null)
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
const { pagination, items, fetchItems } = useItem()

// #------------- Methods ---------------------------#
const openFormDialog = (crud, data) => {
  crudOption.value = crud
  if (crud === 'update') { form.value = data }
  formDialogVisible.value = true
}
const getNextData = (newPage) => {
  pagination.value.page = newPage;
  fetchItems()
}

function changePageSize(newSize) {
  pagination.value.pageSize = newSize;
  pagination.value.page = 1;
  fetchItems()
}
const changeItemStatus = async (itemId) => {

}

</script>

<template>
  <el-row :gutter="20" class="pb-2">
    <el-col :span="24" class="text-right">
      <el-button
        v-if="hasPermission('CREATE_ITEMS')" type="primary" size="small"
        plain
      >
        <Icon icon="mdi-light:plus-circle" width="14" height="14" /> Add New Item
      </el-button>
    </el-col>
  </el-row>

  <el-row :gutter="20" class="pb-2">
    <el-col :span="24" class="text-right">
      <base-table
        :pagination="pagination"
        :rows="items"
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
              v-if="hasPermission('UPDATE_ITEMS')"
              type="primary"
              size="small"
              plain
              round
              title="Update Item Details"
              @click="openFormDialog('update', scope.row)"
            >
              <Icon icon="mdi-light:pencil" />
            </el-button>
            <el-button
              v-if="hasPermission('DELETE_ITEMS')"
              :type="scope.row.active ? 'danger' : 'primary'"
              size="small"
              plain
              round
              :title="scope.row.active ? 'Deactivate Item' : 'Activate Item'"
              @click="changeItemStatus(scope.row?.id)"
            >
              <Icon :icon="`mdi-light:${scope.row.active ? 'delete' : 'check-circle'}`" />
            </el-button>
          </template>
        </el-table-column>
      </base-table>
    </el-col>
  </el-row>

</template>

<style scoped>

</style>

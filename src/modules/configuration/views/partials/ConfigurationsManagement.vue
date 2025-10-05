<script setup>
import { computed, onMounted, ref } from 'vue'
import { hasPermission } from '@/utils/permissions.js'
// import BaseTable from '@/components/globals/BaseTable.vue'
// import { ElMessage } from 'element-plus'
import ConfigurationForm from '@/modules/configuration/views/partials/ConfigurationForm.vue'
import { useConfiguration } from '@/modules/configuration/composables/useConfiguration.js'
import { dateFormatter } from '@/components/globals/constants.js'

// #------------- Reactive & Refs State -------------#
const formDialogVisible = ref(false)
const crudOption = ref()
const formObject = ref()
// const columns = [
//   { key: 'id', label: 'S/N', type: 'index' },
//   { key: 'company_name', label: 'Company Name' },
//   { key: 'email', label: 'Email' },
//   { key: 'phone', label: 'Phone' },
//   { key: 'currency_code', label: 'Currency Code' },
//   { key: 'currency_symbol', label: 'Currency Symbol' },
// ]

const {
  fetchConfigurations,
  configurations,
  // pagination,
  // success,
  // activateDeactivateConfiguration,
} = useConfiguration()

// #------------- Lifecycle ---------------------------#
onMounted(() => {
  fetchConfigurations()
})

const appConfigs = computed(() => {
  return configurations.value.length ? configurations.value[0] : null
})

// #------------- Methods ---------------------------#
const openFormDialog = (crud, data) => {
  crudOption.value = crud
  formObject.value = data
  formDialogVisible.value = true
}

const operationCompleted = () => {
  formDialogVisible.value = false
  fetchConfigurations()
}

// const getNextData = (newPage) => {
//   pagination.value.page = newPage
//   fetchConfigurations()
// }
//
// function changePageSize(newSize) {
//   pagination.value.pageSize = newSize
//   pagination.value.page = 1
//   fetchConfigurations()
// }
//
// const changeConfigurationStatus = async (id) => {
//   if (id) {
//     await activateDeactivateConfiguration(id)
//     if (success.value) {
//       await fetchConfigurations()
//     }
//   } else {
//     ElMessage.error('Missing configuration ID')
//   }
// }
</script>

<template>
  <div class="configurations-management">
    <el-row :gutter="20" class="pb-2">
      <el-col :span="24" class="text-right">
        <el-descriptions
          class="margin-top"
          title="App Configurations"
          :column="1"
          size="small"
          border
        >
          <template v-if="!appConfigs" #extra>
            <el-button
              v-if="hasPermission('CREATE_CONFIGURATIONS')"
              type="primary"
              size="small"
              plain
              @click="openFormDialog('create', null)"
            >
              <Icon icon="mdi-light:plus-circle" width="14" height="14" /> Add Configurations
            </el-button>
          </template>
          <template v-else #extra>
            <el-button
              v-if="hasPermission('CREATE_CONFIGURATIONS')"
              type="primary"
              size="small"
              plain
              @click="openFormDialog('update', appConfigs)"
            >
              <Icon icon="mdi-light:plus-circle" width="14" height="14" /> Update Configurations
            </el-button>
          </template>
          <el-descriptions-item label="Company Name">{{appConfigs?.company_name}}</el-descriptions-item>
          <el-descriptions-item label="Logo">{{appConfigs?.company_logo}}</el-descriptions-item>
          <el-descriptions-item label="Company Address">{{appConfigs?.address}}</el-descriptions-item>
          <el-descriptions-item label="Website">{{appConfigs?.website}}</el-descriptions-item>
          <el-descriptions-item label="Company Email">{{appConfigs?.email}}</el-descriptions-item>
          <el-descriptions-item label="Phone">{{appConfigs?.phone}}</el-descriptions-item>
          <el-descriptions-item label="Return Policy">{{appConfigs?.return_policy}}</el-descriptions-item>
          <el-descriptions-item label="Currency Code">{{appConfigs?.currency_code}}</el-descriptions-item>
          <el-descriptions-item label="Currency Symbol">{{appConfigs?.currency_symbol}}</el-descriptions-item>
          <el-descriptions-item label="Date Create">{{dateFormatter(appConfigs?.created_at)}}</el-descriptions-item>
        </el-descriptions>

<!--        <base-table-->
<!--          :pagination="pagination"-->
<!--          :rows="configurations"-->
<!--          :columns="columns"-->
<!--          @update:page="getNextData"-->
<!--          @update:pageSize="changePageSize"-->
<!--        >-->
<!--          <el-table-column prop="active" label="Status">-->
<!--            <template #default="scope">-->
<!--              <el-tag :type="scope.row.active ? 'primary' : 'danger'">-->
<!--                {{ scope.row.active ? 'Active' : 'Deactivated' }}-->
<!--              </el-tag>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column label="Actions">-->
<!--            <template #default="scope">-->
<!--              <el-button-->
<!--                v-if="hasPermission('UPDATE_CONFIGURATIONS')"-->
<!--                type="primary"-->
<!--                size="small"-->
<!--                plain-->
<!--                round-->
<!--                title="Update Configuration Details"-->
<!--                @click="openFormDialog('update', scope.row)"-->
<!--              >-->
<!--                <Icon icon="mdi-light:pencil" />-->
<!--              </el-button>-->
<!--              <el-button-->
<!--                v-if="hasPermission('DELETE_CONFIGURATIONS')"-->
<!--                :type="scope.row.active ? 'danger' : 'primary'"-->
<!--                size="small"-->
<!--                plain-->
<!--                round-->
<!--                :title="scope.row.active ? 'Deactivate Configuration' : 'Activate Configuration'"-->
<!--                @click="changeConfigurationStatus(scope.row?.id)"-->
<!--              >-->
<!--                <Icon :icon="`mdi-light:${scope.row.active ? 'delete' : 'check-circle'}`" />-->
<!--              </el-button>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--        </base-table>-->
      </el-col>
    </el-row>

    <!--   CONFIGURATION FORM MODAL/DIALOG   -->
    <el-dialog v-model="formDialogVisible" width="65%">
      <ConfigurationForm
        :crud-option="crudOption"
        :configuration-object="formObject"
        @completeConfigurationAction="operationCompleted"
      />
    </el-dialog>
  </div>
</template>

<style scoped>
.configurations-management {
  padding: 20px 0;
}
</style>

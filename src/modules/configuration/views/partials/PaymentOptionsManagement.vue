<script setup>
import { onMounted, ref } from 'vue'
import { hasPermission } from '@/utils/permissions.js'
import BaseTable from '@/components/globals/BaseTable.vue'
import { ElMessage } from 'element-plus'
import PaymentOptionForm from '@/modules/configuration/views/partials/PaymentOptionForm.vue'
import { usePaymentOption } from '@/modules/configuration/composables/usePaymentOption.js'

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

const {
  fetchPaymentOptions,
  paymentOptions,
  pagination,
  success,
  activateDeactivatePaymentOption,
} = usePaymentOption()

// #------------- Lifecycle ---------------------------#
onMounted(() => {
  fetchPaymentOptions()
})

// #------------- Methods ---------------------------#
const openFormDialog = (crud, data) => {
  crudOption.value = crud
  formObject.value = data
  formDialogVisible.value = true
}

const operationCompleted = () => {
  formDialogVisible.value = false
  fetchPaymentOptions()
}

const getNextData = (newPage) => {
  pagination.value.page = newPage
  fetchPaymentOptions()
}

function changePageSize(newSize) {
  pagination.value.pageSize = newSize
  pagination.value.page = 1
  fetchPaymentOptions()
}

const changePaymentOptionStatus = async (id) => {
  if (id) {
    await activateDeactivatePaymentOption(id)
    if (success.value) {
      await fetchPaymentOptions()
    }
  } else {
    ElMessage.error('Missing payment option ID')
  }
}
</script>

<template>
  <div class="payment-options-management">
    <el-row :gutter="20" class="pb-2">
      <el-col :span="24" class="text-right">
        <el-button
          v-if="hasPermission('CREATE_PAYMENT_OPTIONS')"
          type="primary"
          size="small"
          plain
          @click="openFormDialog('create', null)"
        >
          <Icon icon="mdi-light:plus-circle" width="14" height="14" /> Add New Payment Option
        </el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="pb-2">
      <el-col :span="24" class="text-right">
        <base-table
          :pagination="pagination"
          :rows="paymentOptions"
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
                v-if="hasPermission('UPDATE_PAYMENT_OPTIONS')"
                type="primary"
                size="small"
                plain
                round
                title="Update Payment Option Details"
                @click="openFormDialog('update', scope.row)"
              >
                <Icon icon="mdi-light:pencil" />
              </el-button>
              <el-button
                v-if="hasPermission('DELETE_PAYMENT_OPTIONS')"
                :type="scope.row.active ? 'danger' : 'primary'"
                size="small"
                plain
                round
                :title="scope.row.active ? 'Deactivate Payment Option' : 'Activate Payment Option'"
                @click="changePaymentOptionStatus(scope.row?.id)"
              >
                <Icon :icon="`mdi-light:${scope.row.active ? 'delete' : 'check-circle'}`" />
              </el-button>
            </template>
          </el-table-column>
        </base-table>
      </el-col>
    </el-row>

    <!--   PAYMENT OPTION FORM MODAL/DIALOG   -->
    <el-dialog v-model="formDialogVisible" width="55%">
      <PaymentOptionForm
        :crud-option="crudOption"
        :payment-option-object="formObject"
        @completePaymentOptionAction="operationCompleted"
      />
    </el-dialog>
  </div>
</template>

<style scoped>
.payment-options-management {
  padding: 20px 0;
}
</style>

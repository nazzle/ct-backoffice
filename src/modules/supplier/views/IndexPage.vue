<script setup>
import PageTitle from '@/components/globals/PageTitle.vue'
import { useSupplier } from '@/modules/supplier/composables/useSupplier.js'
import { ref } from 'vue'
import { hasPermission } from '@/utils/permissions.js'
import { countries } from '@/utils/countries.js'
import { dateFormatter } from '../../../components/globals/constants.js'
import { ElMessage, ElMessageBox } from 'element-plus'

// #------------- Props / Emits -------------#

// #------------- Reactive & Refs State -------------#
const pageTitle = 'Suppliers'
const formTitle = ref()
const page = ref({
  size: 10,
  totalElements: 1,
  totalPages: 1,
  number: 0,
})
const supplierFormVisible = ref(false)
const supplierFormObj = ref({})
const supplierForm = ref(null)
const {
  suppliers, saveSupplierDetails, fetchSuppliers, success, updateSupplierDetails,
  changeSupplierStatus,
} = useSupplier()

// #------------- Functions/Methods -------------#
const indexNumber = (scope) => {
  return page.value.number !== 0
    ? Math.abs((page.value.number - 1) * page.value.size + scope.$index + 1)
    : scope.$index + 1
}
const openSupplierForm = (crudOption, row) => {
  formTitle.value = crudOption === 'create' ? 'CREATE NEW SUPPLIER' : 'UPDATE SUPPLIER DETAILS'
  if (crudOption === 'update') {
    supplierFormObj.value = {
      name: row?.name || '',
      code: row?.code || '',
      country: row?.country || '',
      id: row?.id,
    }
  }
  supplierFormVisible.value = true
}
const submitSupplierDetails = () => {
  supplierForm.value.validate(async (valid) => {
    if (valid) {
      await saveSupplierDetails(supplierFormObj)
      if (success.value) {
        await fetchSuppliers()
        cancelSupplierForm()
      }
    }
  })
}

const editSupplierDetails = () => {
  supplierForm.value.validate(async (valid) => {
    if (valid) {
      await updateSupplierDetails(supplierFormObj)
      if (success.value) {
        await fetchSuppliers()
        cancelSupplierForm()
      }
    }
  })
}

const activateDeactivateSupplier = async (data) => {
  const status = data?.active ? 'deactivate' : 'activate'
  if (data) {
    ElMessageBox.confirm(
      `This action will ${status} this supplier. Continue?`,
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    ).then(async () => {
      await changeSupplierStatus(data)
      if (success.value) {
        await fetchSuppliers()
      }
    }).catch(() => {
      ElMessage({
        type: 'info',
        message: 'Operation canceled',
      })
    })
  }
}

const cancelSupplierForm = () => {
  supplierForm.value.resetFields()
  supplierFormVisible.value = false
}

</script>

<template>
  <div class="page-container">
    <PageTitle :title="pageTitle" />
    <el-row :gutter="20" class="pb-2">
      <el-col :span="24" class="text-right">
        <el-button
          v-if="hasPermission('CREATE_SUPPLIERS')" type="primary" size="small" plain
          @click="openSupplierForm('create', null)"
        >
          <Icon icon="mdi-light:plus-circle" width="14" height="14" /> Add New Supplier
        </el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="pb-2">
      <el-col :span="24">
        <el-table :data="suppliers" style="width: 100%">
          <el-table-column label="S/N" type="index">
            <template #default="scope">
              <slot name="index" v-bind="scope">
                {{ indexNumber(scope) }}
              </slot>
            </template>
          </el-table-column>
          <el-table-column prop="active" label="Status">
            <template #default="scope">
              <el-tag :type="scope.row.active ? 'primary' : 'danger'">
                {{ scope.row.active ? 'Active' : 'Deactivated' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="code" label="Code" />
          <el-table-column prop="name" label="Name" />
          <el-table-column prop="country" label="Country" />
          <el-table-column prop="created_at" label="Created At">
            <template #default="scope">
              {{ dateFormatter(scope.row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column label="Actions">
            <template #default="scope">
              <el-button
                v-if="hasPermission('UPDATE_SUPPLIERS')"
                type="primary"
                size="small"
                plain
                round
                title="Update Supplier Details"
                @click="openSupplierForm('update', scope?.row)"
              >
                <Icon icon="mdi-light:pencil" />
              </el-button>
              <el-button
                v-if="hasPermission('DELETE_SUPPLIERS')"
                :type="scope.row.active ? 'danger' : 'primary'"
                size="small"
                plain
                round
                :title="scope.row.active ? 'Deactivate Supplier' : 'Activate Supplier'"
                @click="activateDeactivateSupplier(scope?.row)"
              >
                <Icon :icon="`mdi-light:${scope.row.active ? 'delete' : 'check-circle'}`" />
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      </el-row>

  <!--  SUPPLIER FORM DIALOG  -->
    <el-dialog v-model="supplierFormVisible" width="50%" center>
      <div class="modal-container">
        <PageTitle :title="formTitle" />
        <el-form :model="supplierFormObj" ref="supplierForm" label-position="top">
          <el-form-item label="Supplier Name" prop="name" required>
            <el-input v-model="supplierFormObj.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="Supplier Code" prop="code" required>
            <el-input v-model="supplierFormObj.code" autocomplete="off" />
          </el-form-item>
          <el-form-item label="Supplier Country" prop="country">
            <el-select v-model="supplierFormObj.country" filterable clearable placeholder="Select supplier country of origin">
              <el-option v-for="item in countries" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-divider />
          <el-form-item>
            <el-button
              type="primary" size="small" plain @click="submitSupplierDetails"
              v-if="formTitle.includes('CREATE')"
            >
              Submit Details
            </el-button>
            <el-button
              type="primary" size="small" plain @click="editSupplierDetails"
              v-if="formTitle.includes('UPDATE')"
            >
              Update Details
            </el-button>
            <el-button size="small" @click="cancelSupplierForm">Cancel</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>

</style>

<script setup>
import PageTitle from '@/components/globals/PageTitle.vue'
import { ref, watch } from 'vue'
import { useEmployee } from '@/modules/hr/composables/useEmployee.js'
import { useUser } from '@/modules/hr/composables/useUser.js'
import NewEmployee from '@/modules/hr/views/partials/NewEmployee.vue'
import { ElMessageBox } from 'element-plus'
import UserManagement from '@/modules/hr/views/partials/UserManagement.vue'
import UserForm from '@/modules/hr/views/partials/UserForm.vue'
import { dateFormatter } from '@/components/globals/constants.js'
import RolesManagement from '@/modules/hr/views/partials/RolesManagement.vue'
import PermissionsManagement from '@/modules/hr/views/partials/PermissionsManagement.vue'
import NewRole from '@/modules/hr/views/partials/NewRole.vue'
import { useRole } from '@/modules/hr/composables/useRole.js'
import { hasPermission } from '@/utils/permissions.js'

// #------------- Props / Emits -------------#

// #------------- Reactive & Refs State -------------#
const pageTitle = 'Employees And Users Management'
const { employees, fetchEmployees, changeStatus, success } = useEmployee()
const { fetchUsers } = useUser()
const { fetchRoles } = useRole()
const dialogVisible = ref(false)
const dialogTitle = ref(null)
const componentType = ref(null) // EMP, USR for Employee and User respectively
const page = ref({
  size: 10,
  totalElements: 1,
  totalPages: 1,
  number: 0,
})
const employeeDetails = ref(null)
const userDetails = ref(null)
const roleDetails = ref(null)

// #------------- Computed Properties -------------#

// #------------- Watchers -------------#
watch(success, (value) => {
  if (value) {
    fetchEmployees()
  }
})

// #------------- Functions/Methods -------------#
const openModal = (formName) => {
  if (formName === 'employee') {
    employeeDetails.value = null
    dialogTitle.value = 'NEW EMPLOYEE FORM'
    componentType.value = 'EMP'
  } else if (formName === 'user') {
    userDetails.value = null
    componentType.value = 'USR'
    dialogTitle.value = 'NEW USER FORM'
  } else if (formName === 'role') {
    roleDetails.value = null
    componentType.value = 'ROL'
    dialogTitle.value = 'NEW ROLE FORM'
  }
  dialogVisible.value = true
}

const indexNumber = (scope) => {
  return page.value.number !== 0
    ? Math.abs((page.value.number - 1) * page.value.size + scope.$index + 1)
    : scope.$index + 1
}

const completeCreateAction = () => {
  dialogVisible.value = false
  if (componentType.value === 'EMP') {
    fetchEmployees()
  } else if (componentType.value === 'USR') {
    fetchUsers()
  } else if (componentType.value === 'ROL') {
    fetchRoles()
  }
}

const callUpdateForm = (data, componentTypeValue) => {
  delete data.created_at
  delete data.updated_at
  // delete data.active
  employeeDetails.value = data
  componentType.value = componentTypeValue
  dialogTitle.value = 'UPDATE EMPLOYEE DETAILS'
  dialogVisible.value = true
}

const activateDeactivateEmployee = (data) => {
  const status = data.active ? 'deactivate' : 'activate'
  ElMessageBox.confirm(
    `Are you sure you want to ${status} this employee record?. Continue?`,
    'Warning',
    {
      confirmButtonText: 'Yes! Continue',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(() => {
      changeStatus(data)
      if(success.value) {
        alert(success.value)
        fetchEmployees()
      }
    })
}
</script>

<template>
  <div class="page-container">
    <PageTitle :title="pageTitle" />
    <el-row :gutter="20">
      <el-col :span="24">
        <el-tabs type="border-card">
          <!--   EMPLOYEES LIST TAB   -->
          <el-tab-pane v-if="hasPermission('VIEW_EMPLOYEES_LIST')" label="Employees Management">
            <el-row :gutter="20" class="pb-2">
              <el-col :span="24" class="text-right">
                <el-button v-if="hasPermission('SAVE_EMPLOYEE_DETAILS')" type="primary" size="small" plain @click="openModal('employee')">
                  <Icon icon="mdi-light:plus-circle" width="14" height="14" /> Add New Employee
                </el-button>
              </el-col>
            </el-row>
            <el-table :data="employees" style="width: 100%">
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
              <el-table-column prop="lastName" label="Name">
                <template #default="scope">
                  {{ scope.row.firstName }} {{ scope.row.lastName }}
                </template>
              </el-table-column>
              <el-table-column prop="gender" label="Gender" />
              <el-table-column prop="phone" label="Phone" />
              <el-table-column prop="email" label="Email" />
              <el-table-column prop="address" label="Address" />
              <el-table-column prop="created_at" label="Date Created">
                <template #default="scope">
                  {{ dateFormatter(scope.row?.created_at) }}
                </template>
              </el-table-column>
              <el-table-column label="Actions">
                <template #default="scope">
                  <el-button
                    v-if="hasPermission('UPDATE_EMPLOYEE_DETAILS')"
                    type="primary"
                    size="small"
                    plain
                    round
                    title="Update Employee Details"
                    @click="callUpdateForm(scope.row, 'EMP')"
                  >
                    <Icon icon="mdi-light:pencil" />
                  </el-button>
                  <el-button
                    v-if="hasPermission('DELETE_EMPLOYEE_DETAILS')"
                    :type="scope.row.active ? 'danger' : 'primary'"
                    size="small"
                    plain
                    round
                    :title="scope.row.active ? 'Deactivate Employee' : 'Activate Employee'"
                    @click="activateDeactivateEmployee(scope.row)"
                  >
                    <Icon :icon="`mdi-light:${scope.row.active ? 'delete' : 'check-circle'}`" />
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!--   USERS LIST TAB   -->
          <el-tab-pane v-if="hasPermission('VIEW_USERS')" label="Users Management">
            <el-row :gutter="20" class="pb-2">
              <el-col :span="24" class="text-right">
                <el-button v-if="hasPermission('CREATE_USERS')" type="primary" size="small" plain @click="openModal('user')">
                  <Icon icon="mdi-light:plus-circle" width="14" height="14" /> Add New User
                </el-button>
              </el-col>
            </el-row>
            <user-management />
          </el-tab-pane>
          <!--   ROLES LIST TAB   -->
          <el-tab-pane v-if="hasPermission('ASSIGN_ROLES')" label="Roles">
            <el-row :gutter="20" class="pb-2">
              <el-col :span="24" class="text-right">
                <el-button v-if="hasPermission('UPDATE_ROLES')" type="primary" size="small" plain @click="openModal('role')">
                  <Icon icon="mdi-light:plus-circle" width="14" height="14" /> Add New Role
                </el-button>
              </el-col>
            </el-row>
            <RolesManagement />
          </el-tab-pane>
          <!--   PERMISSIONS LIST TAB   -->
          <el-tab-pane v-if="hasPermission('UPDATE_ROLES')" label="Permissions">
            <PermissionsManagement />
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <!--   FORMS DIALOG   -->
      <el-dialog v-model="dialogVisible" width="60%">
        <div class="content">
          <PageTitle :title="dialogTitle" />
          <div class="form-components">
            <NewEmployee
              v-if="componentType === 'EMP'" :employeeDetails="employeeDetails"
              @completeEmployeeCreate="completeCreateAction"
            />
            <UserForm
              v-if="componentType === 'USR'" :userDetails="userDetails"
              @completeUserCreate="completeCreateAction"
            />
            <NewRole
              v-if="componentType === 'ROL'" :role-details="roleDetails"
              @completeRoleCreate="completeCreateAction"
            />
          </div>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>

<style scoped></style>

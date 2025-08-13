<script setup>
import { onMounted, ref } from 'vue'
import { dateFormatter } from '@/components/globals/constants.js'
import { useRole } from '@/modules/hr/composables/useRole.js'
import PageTitle from '@/components/globals/PageTitle.vue'
import NewRole from '@/modules/hr/views/partials/NewRole.vue'
import { ElMessageBox } from 'element-plus'
import { hasPermission } from '@/utils/permissions.js'

// #------------- Reactive & Refs State -------------#
const roleFormVisible = ref(false)
const title = 'UPDATE ROLE DETAILS'
const roleDetails = ref()
const page = ref({
  size: 10,
  totalElements: 1,
  totalPages: 1,
  number: 0,
})
const { fetchRoles, paginatedRoles, activateDeactivateRole, success } = useRole()

// #------------- Watchers -------------#
onMounted(() => {
  fetchRoles()
})

// #------------- Functions/Methods -------------#
const indexNumber = (scope) => {
  return page.value.number !== 0
    ? Math.abs((page.value.number - 1) * page.value.size + scope.$index + 1)
    : scope.$index + 1
}

const openRoleForm = (data) => {
  roleDetails.value = data
  roleFormVisible.value = true
}

const completeCreateAction = () => {
  roleFormVisible.value = false
  fetchRoles()
}

const changeRoleStatus = (data) => {
  const status = data.active ? 'deactivate' : 'activate'
  ElMessageBox.confirm(
    `Are you sure you want to ${status} this role?. Continue?`,
    'Warning',
    {
      confirmButtonText: 'Yes! Continue',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(() => {
      activateDeactivateRole(data?.id)
      if(success.value) {
        fetchRoles()
      }
    })
}

</script>

<template>
  <div class="roles-management">
    <el-row :gutter="20" class="pb-2">
      <el-col :span="24">
        <el-table :data="paginatedRoles" style="width: 100%">
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
          <el-table-column prop="name" label="Role" />
          <el-table-column prop="created_at" label="Date Created">
            <template #default="scope">
              {{ dateFormatter(scope.row?.created_at) }}
            </template>
          </el-table-column>
          <el-table-column label="Actions">
            <template #default="scope">
              <el-button
                v-if="hasPermission('UPDATE_ROLES')"
                type="primary"
                size="small"
                plain
                round
                title="Update Role Details"
                @click="openRoleForm(scope.row)"
              >
                <Icon icon="mdi-light:pencil" />
              </el-button>
              <el-button
                v-if="hasPermission('UPDATE_ROLES')"
                :type="scope.row.active ? 'danger' : 'primary'"
                size="small"
                plain
                round
                :title="scope.row.active ? 'Deactivate Employee' : 'Activate Employee'"
                @click="changeRoleStatus(scope.row)"
              >
                <Icon :icon="`mdi-light:${scope.row.active ? 'delete' : 'check-circle'}`" />
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!--   FORMS DIALOG   -->
    <el-dialog v-model="roleFormVisible" width="60%">
      <PageTitle :title="title" />
      <div class="content">
        <NewRole
          :role-details="roleDetails" @complete-role-create="completeCreateAction"
          crud-option="update"
        />
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>

</style>

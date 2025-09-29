<script setup>
import { useUser } from '@/modules/hr/composables/useUser.js'
import { dateFormatter } from '@/components/globals/constants.js'
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import UserForm from '@/modules/hr/views/partials/UserForm.vue'
import PageTitle from '@/components/globals/PageTitle.vue'
import { hasPermission } from '@/utils/permissions.js'

// #------------- Props / Emits -------------#

// #------------- Reactive & Refs State -------------#
const { users, changeUserStatus } = useUser()
const page = ref({
  size: 10,
  totalElements: 1,
  totalPages: 1,
  number: 0,
})
const dialogVisible = ref(false)
const userData = ref()
const dialogTitle = 'Update User Details'

// #------------- Functions/Methods -------------#
const indexNumber = (scope) => {
  return page.value.number !== 0
    ? Math.abs((page.value.number - 1) * page.value.size + scope.$index + 1)
    : scope.$index + 1
}

const deactivateActivateUser = async (data) => {
  if (data) {
    const status = data?.active ? 'deactivate' : 'activate'
    ElMessageBox.confirm(
      `This action will ${status} this user status. Continue?`,
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )
      .then(() => {
         changeUserStatus(data)
      })
      .catch(() => {
        console.log('change user status request could not be processed')
      })
  }
}

const updateUserDetails = async (data) => {
  userData.value = data
  dialogVisible.value = true
}

const closeModal = () => {
  dialogVisible.value = false
}

</script>

<template>
  <div class="user-management">
    <el-row :gutter="20" class="pb-2">
      <el-col :span="24">
        <el-table :data="users" style="width: 100%">
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
          <el-table-column prop="username" label="Username" />
          <el-table-column prop="email" label="Email" />
          <el-table-column prop="created_at" label="Date Created">
            <template #default="scope">
              {{ dateFormatter(scope.row?.created_at) }}
            </template>
          </el-table-column>
          <el-table-column label="Actions">
            <template #default="scope">
              <el-button
                v-if="hasPermission('UPDATE_USERS')"
                type="primary"
                size="small"
                plain
                round
                title="Update User Details"
                @click="updateUserDetails(scope?.row)"
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
                @click="deactivateActivateUser(scope.row)"
              >
                <Icon :icon="`mdi-light:${scope.row.active ? 'delete' : 'check-circle'}`" />
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- USER FORM -->
    <el-dialog v-model="dialogVisible" width="60%">
      <PageTitle :title="dialogTitle" />
      <div class="content">
        <user-form :user-details="userData" @completeUserCreate="closeModal" />
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>

</style>

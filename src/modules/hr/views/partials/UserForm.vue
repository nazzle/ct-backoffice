<script setup>
import { onMounted, ref, watch } from 'vue'
import { useUser } from '@/modules/hr/composables/useUser.js'
import { useEmployee } from '@/modules/hr/composables/useEmployee.js'

// #------------- Props / Emits -------------#
const emit = defineEmits(['completeUserCreate'])
const props = defineProps(
  {
    userDetails:{
      type: Object,
      default: () => ({})
    }
  }
)

// #------------- Reactive & Refs State -------------#
const crudOption = ref(null)
const userForm = ref(null)
const form = ref({
  password: '',
  employee_id: '',
  username: '',
  email: '',
  role_ids: '',
})

const {
  getNonPaginatedListOfRoles, roles, saveNewUser, success, updateUserDetails
} = useUser()
const { getNonPaginatedListOfEmployees, allEmployees } = useEmployee()

// #------------- Watchers -------------#
onMounted(() => {
  getNonPaginatedListOfRoles()
  getNonPaginatedListOfEmployees()
})

watch(
  () => props.userDetails,
  (newValue, oldValue) => {
    if (newValue) {
      crudOption.value = 'update'
      form.value = {
        ...newValue,
        // username: newValue.username,
        // password: null,
        // employee_id: newValue.employee_id,
        // email: newValue.email,
        role_ids: [ newValue.roles[0]?.id ],
      }
    }
  },
  { immediate: true, deep: true }
)

// #------------- Functions/Methods -------------#
const cancelForm = () => {
  userForm.value.resetFields()
  emit('completeUserCreate')
}

const saveUserDetails = () => {
  userForm.value.validate(async (valid) => {
    if (valid) {
      await saveNewUser(form.value)
      if (success.value) {
        userForm.value.resetFields()
        emit('completeUserCreate')
      }
    }
  })
}

const updateUser = () => {
  userForm.value.validate(async (valid) => {
    if (valid) {
      await updateUserDetails(form.value)
      if (success.value) {
        userForm.value.resetFields()
        emit('completeUserCreate')
      }
    }
  })
}

</script>

<template>
  <div class="userForm">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form :model="form" ref="userForm" label-position="right" label-width="200px">
          <el-form-item label="Username" prop="username" required>
            <el-input v-model="form.username" placeholder="Type Username" />
          </el-form-item>
          <el-form-item label="Employee Name" prop="employee_id" required>
            <el-select
              v-model="form.employee_id" placeholder="Select Employee" clearable filterable
            >
              <el-option
                v-for="item in allEmployees" :key="item.id" :value="item.id"
                :label="`${item.firstName} ${item.lastName}`"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Email" prop="email" required>
            <el-input v-model="form.email" placeholder="Type Email" />
          </el-form-item>
          <el-form-item label="Roles" prop="role_ids" required>
            <el-select
              v-model="form.role_ids" placeholder="Enter Phone number" clearable filterable multiple
            >
              <el-option v-for="item in roles" :key="item.id" :value="item.id" :label="item.name" />
            </el-select>
          </el-form-item>
          <el-form-item label="Password" prop="password" required>
            <el-input v-model="form.password" placeholder="Type User Password" />
          </el-form-item>
          <el-divider />
          <el-form-item>
            <el-button v-if="crudOption !== 'update' " type="primary" plain size="small" @click="saveUserDetails">Submit</el-button>
            <el-button v-if="crudOption === 'update' " type="primary" plain size="small" @click="updateUser">Update</el-button>
            <el-button plain size="small" @click="cancelForm">Cancel</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>

</style>

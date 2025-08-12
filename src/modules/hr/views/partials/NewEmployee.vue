<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { genders } from '@/components/globals/constants.js'
import { useEmployee } from '@/modules/hr/composables/useEmployee.js'

// #------------- Props / Emits -------------#
const emit = defineEmits(['completeEmployeeCreate'])
const props = defineProps(
  {
    employeeDetails:{
      type: Object,
      default: () => ({})
    }
  }
)

// #------------- Reactive & Refs State -------------#
const { saveEmployee, success, updateEmployeeDetails } = useEmployee()
const employeeForm = ref(null)
const crudOption = ref(null)
const employeeId = ref(null)
const form = ref({
  firstName: '',
  middleName: '',
  lastName: '',
  phone: '',
  email: '',
  gender: '',
  address: '',
})

// #------------- Computed Properties -------------#

// #------------- Watchers -------------#
watch(() => props.employeeDetails, (newVal) => {
  if (newVal) {
    delete newVal.active
    form.value = newVal
    employeeId.value = newVal.id
    crudOption.value = 'update'
  }else {
    crudOption.value = 'create'
    form.value = {
      firstName: '',
      middleName: '',
      lastName: '',
      phone: '',
      email: '',
      gender: '',
      address: '',
    }
  }
}, { immediate: true });

onMounted(() => {

})

// #------------- Functions/Methods -------------#
const onSubmit = () => {
  employeeForm.value.validate(async (valid) => {
    if (valid) {
      await saveEmployee(form.value)
      if (success.value) {
        emit('completeEmployeeCreate')
      }
    }
  })
}
const onUpdate = () => {
  employeeForm.value.validate(async (valid) => {
    if (valid) {
      await updateEmployeeDetails(form.value)
      if (success.value) {
        emit('completeEmployeeCreate')
      }
    }
  })
}
const cancelForm = () => {
  employeeForm.value.resetFields()
  emit('completeEmployeeCreate')
}
</script>

<template>
  <el-form :model="form" ref="employeeForm" label-width="auto" label-position="top">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="First Name" prop="firstName" required>
          <el-input v-model="form.firstName" placeholder="Enter First Name" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="Middle Name">
          <el-input v-model="form.middleName" placeholder="Enter Middle Name" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="Last Name" prop="lastName" required>
          <el-input v-model="form.lastName" placeholder="Enter Last Name" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="Phone" prop="phone" required>
          <el-input v-model="form.phone" placeholder="Enter Phone number" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="Email">
          <el-input v-model="form.email" placeholder="Enter Email address" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="Gender" prop="gender" required>
          <el-select v-model="form.gender" placeholder="Select Gender" filterable clearable>
            <el-option v-for="item in genders" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="Physical Address" prop="address" required>
      <el-input v-model="form.address" placeholder="Enter employee physical address" />
    </el-form-item>
    <el-divider />
    <el-form-item>
      <el-button
        v-if="crudOption === 'create' " type="primary" @click="onSubmit" plain size="small"
      >
        Create
      </el-button>
      <el-button
        v-if="crudOption === 'update' " type="primary" @click="onUpdate" plain size="small"
      >
        Update
      </el-button>
      <el-button @click="cancelForm" plain size="small">Cancel</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>

</style>

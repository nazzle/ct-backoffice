<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRole } from '@/modules/hr/composables/useRole.js'
import { removeUnderscore } from '@/components/globals/constants.js'

// #------------- Props / Emits -------------#
const emit = defineEmits(['completeRoleCreate'])
const props = defineProps(
  {
    roleDetails:{
      type: Object,
      default: () => ({})
    },
    crudOption: {
      type: String,
      default: ''
    }
  }
)

// #------------- Reactive & Refs State -------------#
const roleForm = ref(null)
let permissions = ref()
const { fetchPermissions, permissionsList, createRole, success, updateRoleDetails } = useRole()
const form = ref({
  name: '',
  permission_ids: []
})

// #------------- Watchers -------------#
onMounted(() => {
  fetchPermissions()
})
watch(() => props.roleDetails, (newVal, oldVal) => {
  if (newVal) {
    form.value = {
      id: newVal?.id,
      name: newVal?.name,
      //permission_ids: newVal.permissions
    }
    permissions.value = newVal?.permissions
  }
},
  { deep: true, immediate: true } // optional
)

// #------------- Functions/Methods -------------#
const cancelForm = () => {
  roleForm.value.resetFields()
  emit('completeRoleCreate')
}

const onSubmit = () => {
  roleForm.value.validate(async (valid) => {
    if (valid) {
      console.log('Role forrm data: ', form.value)
      await createRole(form.value)
      if (success.value) {
        emit('completeRoleCreate')
      }
    }
  })
}

const updateRole = () => {
  roleForm.value.validate(async (valid) => {
    if (valid) {
      await updateRoleDetails(form.value)
      if (success.value) {
        emit('completeRoleCreate')
      }
    }
  })
}

const checkIfRoleAssigned = (roleId) => {
  if (permissions.value) {
     return permissions.value.some(item => item?.id === roleId)
  } else {
    return false
  }
}

</script>

<template>
  role details {{props.roleDetails?.permissions}}
  <el-form :model="form" ref="roleForm" label-width="auto" label-position="top">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="Role Name" prop="name" required>
          <el-input v-model="form.name" placeholder="Enter Role Name" />
        </el-form-item>
        <el-form-item label="Select permissions to be assigned for this role">
          <el-checkbox-group v-model="form.permission_ids">
            <el-checkbox
              v-for="(item, index) in permissionsList" :key="index"
              :label="removeUnderscore(item.name)" :value="item.id"
              :checked="checkIfRoleAssigned(item.id)"
              style="width: 30%"
            />
          </el-checkbox-group>
        </el-form-item>
        <el-divider />
        <el-form-item>
          <el-button
            type="primary" plain size="small" @click="onSubmit"
            v-if="props.crudOption !== 'update' "
          >
            Submit
          </el-button>
          <el-button
            type="primary" plain size="small" @click="updateRole"
            v-if="props.crudOption === 'update' "
          >
            Update
          </el-button>
          <el-button
            plain size="small" @click="cancelForm"
          >
            Cancel
          </el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<style scoped>

</style>

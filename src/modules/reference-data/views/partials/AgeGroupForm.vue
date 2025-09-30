<script setup>
import { ref, watch } from 'vue'
import { useAgeGroup } from '@/modules/reference-data/composables/useAgeGroup.js'

// #------------- Props / Emits -------------#
const emit = defineEmits(['completeAgeGroupCreate'])
const props = defineProps({
  ageGroupDetails: {
    type: Object,
    default: () => ({}),
  },
})

// #------------- Reactive & Refs State -------------#
const { saveAgeGroup, updateAgeGroupDetails, success } = useAgeGroup()
const ageGroupForm = ref(null)
const crudOption = ref('create')
const id = ref(null)

const form = ref({
  code: '',
  description: '',
  active: true,
})

const rules = {
  code: [{ required: true, message: 'Age group code is required', trigger: 'blur' }],
  from: [
    { required: true, message: 'Age group lower bound is required', trigger: 'blur' }
  ],
  to: [{ required: true, message: 'Age group upper bound is required', trigger: 'blur' }],
}

// #------------- Watchers -------------#
watch(
  () => props.ageGroupDetails,
  (newVal) => {
    if (newVal && Object.keys(newVal).length > 0) {
      form.value = { ...newVal }
      id.value = newVal.id
      crudOption.value = 'update'
    } else {
      crudOption.value = 'create'
      form.value = {
        name: '',
        code: '',
        from: '',
        to: '',
        description: '',
        active: true,
      }
      id.value = null
    }
  },
  { immediate: true },
)

watch(success, (value) => {
  if (value) {
    emit('completeAgeGroupCreate')
  }
})

// #------------- Methods -------------#
const submitForm = async () => {
  if (!ageGroupForm.value) return

  await ageGroupForm.value.validate(async (valid) => {
    if (valid) {
      if (crudOption.value === 'create') {
        await saveAgeGroup(form.value)
      } else {
        await updateAgeGroupDetails({ ...form.value, id: id.value })
      }
    }
  })
}

const resetForm = () => {
  ageGroupForm.value?.resetFields()
  form.value = {
    name: '',
    code: '',
    description: '',
    active: true,
  }
  crudOption.value = 'create'
  id.value = null
}
</script>

<template>
  <div class="age-group-form">
    <el-form
      ref="ageGroupForm"
      :model="form"
      :rules="rules"
      label-width="120px"
      label-position="left"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="Code" prop="code">
            <el-input v-model="form.code" placeholder="Enter age group code" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="From" prop="from">
            <el-input v-model="form.from" type="number" placeholder="Enter from" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="To" prop="to">
            <el-input v-model="form.to" type="number" placeholder="Enter to" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="Description" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
              placeholder="Enter description (optional)"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="Status">
            <el-switch v-model="form.active" active-text="Active" inactive-text="Inactive" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24" class="text-right">
          <el-button @click="resetForm">Reset</el-button>
          <el-button type="primary" @click="submitForm">
            {{ crudOption === 'create' ? 'Create' : 'Update' }} Age Group
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<style scoped>
.age-group-form {
  padding: 20px;
}
</style>

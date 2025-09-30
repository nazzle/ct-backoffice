<script setup>
import { reactive, ref, watch } from 'vue'
import { useItemGender } from '@/modules/reference-data/composables/useItemGender.js'

// #------------- Props / Emits -------------#
const emit = defineEmits(['completeItemGenderCreate'])
const props = defineProps({
  itemGenderDetails: {
    type: Object,
    default: () => ({}),
  },
})

// #------------- Reactive & Refs State -------------#
const { saveItemGender, updateItemGenderDetails, success } = useItemGender()
const itemGenderForm = ref(null)
const crudOption = ref('create')
const itemGenderId = ref(null)

const form = ref({
  name: '',
  code: '',
  description: '',
  active: true,
})

const rules = {
  name: [
    { required: true, message: 'Item gender name is required', trigger: 'blur' },
    { min: 2, max: 100, message: 'Name must be between 2 and 100 characters', trigger: 'blur' },
  ],
  description: [
    { max: 500, message: 'Description must not exceed 500 characters', trigger: 'blur' },
  ],
}

// #------------- Watchers -------------#
watch(
  () => props.itemGenderDetails,
  (newVal) => {
    if (newVal && Object.keys(newVal).length > 0) {
      form.value = { ...newVal }
      itemGenderId.value = newVal.id
      crudOption.value = 'update'
    } else {
      crudOption.value = 'create'
      form.value = {
        name: '',
        description: '',
        active: true,
      }
      itemGenderId.value = null
    }
  },
  { immediate: true },
)

watch(success, (value) => {
  if (value) {
    emit('completeItemGenderCreate')
  }
})

// #------------- Methods -------------#
const submitForm = async () => {
  if (!itemGenderForm.value) return

  await itemGenderForm.value.validate(async (valid) => {
    if (valid) {
      if (crudOption.value === 'create') {
        await saveItemGender(form.value)
      } else {
        await updateItemGenderDetails({ ...form.value, id: itemGenderId.value })
      }
    }
  })
}

const resetForm = () => {
  itemGenderForm.value?.resetFields()
  form.value = {
    name: '',
    description: '',
    active: true,
  }
  crudOption.value = 'create'
  itemGenderId.value = null
}
</script>

<template>
  <div class="item-gender-form">
    <el-form
      ref="itemGenderForm"
      :model="form"
      :rules="rules"
      label-width="120px"
      label-position="left"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="Name" prop="name">
            <el-input v-model="form.name" placeholder="Enter item gender name" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="Code" prop="code">
            <el-input v-model="form.code" placeholder="Enter code" clearable />
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
            {{ crudOption === 'create' ? 'Create' : 'Update' }} Item Gender
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<style scoped>
.item-gender-form {
  padding: 20px;
}
</style>

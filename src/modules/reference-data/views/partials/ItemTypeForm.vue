<script setup>
import { reactive, ref, watch } from 'vue'
import { useItemType } from '@/modules/reference-data/composables/useItemType.js'

// #------------- Props / Emits -------------#
const emit = defineEmits(['completeItemTypeCreate'])
const props = defineProps({
  itemTypeDetails: {
    type: Object,
    default: () => ({}),
  },
})

// #------------- Reactive & Refs State -------------#
const { saveItemType, updateItemTypeDetails, success } = useItemType()
const itemTypeForm = ref(null)
const crudOption = ref('create')
const itemTypeId = ref(null)

const form = ref({
  name: '',
  description: '',
  active: true,
})

const rules = {
  name: [
    { required: true, message: 'Item type name is required', trigger: 'blur' },
    { min: 2, max: 100, message: 'Name must be between 2 and 100 characters', trigger: 'blur' },
  ],
  description: [
    { max: 500, message: 'Description must not exceed 500 characters', trigger: 'blur' },
  ],
}

// #------------- Watchers -------------#
watch(
  () => props.itemTypeDetails,
  (newVal) => {
    if (newVal && Object.keys(newVal).length > 0) {
      form.value = { ...newVal }
      itemTypeId.value = newVal.id
      crudOption.value = 'update'
    } else {
      crudOption.value = 'create'
      form.value = {
        name: '',
        code: '',
        description: '',
        active: true,
      }
      itemTypeId.value = null
    }
  },
  { immediate: true },
)

watch(success, (value) => {
  if (value) {
    emit('completeItemTypeCreate')
  }
})

// #------------- Methods -------------#
const submitForm = async () => {
  if (!itemTypeForm.value) return

  await itemTypeForm.value.validate(async (valid) => {
    if (valid) {
      if (crudOption.value === 'create') {
        await saveItemType(form.value)
      } else {
        await updateItemTypeDetails({ ...form.value, id: itemTypeId.value })
      }
    }
  })
}

const resetForm = () => {
  itemTypeForm.value?.resetFields()
  form.value = {
    name: '',
    description: '',
    active: true,
  }
  crudOption.value = 'create'
  itemTypeId.value = null
}
</script>

<template>
  <div class="item-type-form">
    <el-form
      ref="itemTypeForm"
      :model="form"
      :rules="rules"
      label-width="120px"
      label-position="left"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="Name" prop="name">
            <el-input v-model="form.name" placeholder="Enter item type name" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="Code" prop="code">
            <el-input v-model="form.code" placeholder="Enter item type code" clearable />
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
            {{ crudOption === 'create' ? 'Create' : 'Update' }} Item Type
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<style scoped>
.item-type-form {
  padding: 20px;
}
</style>

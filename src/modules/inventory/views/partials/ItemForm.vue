<script setup>
import { reactive, ref, watch } from 'vue'
import { useItem } from '@/modules/inventory/composables/useItem.js'

// #------------- Props / Emits -------------#
const emit = defineEmits(['completeItemCreate'])
const props = defineProps({
  itemDetails: {
    type: Object,
    default: () => ({}),
  },
})

// #------------- Reactive & Refs State -------------#
const { saveItemDetails, updateItemDetails, success } = useItem()
const itemForm = ref(null)
const crudOption = ref('create')
const itemId = ref(null)

const form = ref({
  name: '',
  code: '',
  description: '',
  category_id: '',
  item_type_id: '',
  item_gender_id: '',
  active: true,
})

const rules = {
  name: [
    { required: true, message: 'Item name is required', trigger: 'blur' },
    { min: 2, max: 100, message: 'Name must be between 2 and 100 characters', trigger: 'blur' },
  ],
  code: [
    { required: true, message: 'Item code is required', trigger: 'blur' },
    { min: 2, max: 50, message: 'Code must be between 2 and 50 characters', trigger: 'blur' },
  ],
  category_id: [{ required: true, message: 'Category is required', trigger: 'change' }],
}

// #------------- Watchers -------------#
watch(
  () => props.itemDetails,
  (newVal) => {
    if (newVal && Object.keys(newVal).length > 0) {
      form.value = { ...newVal }
      itemId.value = newVal.id
      crudOption.value = 'update'
    } else {
      crudOption.value = 'create'
      form.value = {
        name: '',
        code: '',
        description: '',
        category_id: '',
        item_type_id: '',
        item_gender_id: '',
        active: true,
      }
      itemId.value = null
    }
  },
  { immediate: true },
)

watch(success, (value) => {
  if (value) {
    emit('completeItemCreate')
  }
})

// #------------- Methods -------------#
const submitForm = async () => {
  if (!itemForm.value) return

  await itemForm.value.validate(async (valid) => {
    if (valid) {
      if (crudOption.value === 'create') {
        await saveItemDetails(form.value)
      } else {
        await updateItemDetails({ ...form.value, id: itemId.value })
      }
    }
  })
}

const resetForm = () => {
  itemForm.value?.resetFields()
  form.value = {
    name: '',
    code: '',
    description: '',
    category_id: '',
    item_type_id: '',
    item_gender_id: '',
    active: true,
  }
  crudOption.value = 'create'
  itemId.value = null
}
</script>

<template>
  <div class="item-form">
    <el-form ref="itemForm" :model="form" :rules="rules" label-width="120px" label-position="left">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Item Name" prop="name">
            <el-input v-model="form.name" placeholder="Enter item name" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Item Code" prop="code">
            <el-input v-model="form.code" placeholder="Enter item code" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Category" prop="category_id">
            <el-select
              v-model="form.category_id"
              placeholder="Select category"
              clearable
              style="width: 100%"
            >
              <!-- TODO: Populate with categories from API -->
              <el-option label="Category 1" value="1" />
              <el-option label="Category 2" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Item Type">
            <el-select
              v-model="form.item_type_id"
              placeholder="Select item type"
              clearable
              style="width: 100%"
            >
              <!-- TODO: Populate with item types from API -->
              <el-option label="Type 1" value="1" />
              <el-option label="Type 2" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Item Gender">
            <el-select
              v-model="form.item_gender_id"
              placeholder="Select item gender"
              clearable
              style="width: 100%"
            >
              <!-- TODO: Populate with item genders from API -->
              <el-option label="Gender 1" value="1" />
              <el-option label="Gender 2" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Status">
            <el-switch v-model="form.active" active-text="Active" inactive-text="Inactive" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="Description">
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
        <el-col :span="24" class="text-right">
          <el-button @click="resetForm">Reset</el-button>
          <el-button type="primary" @click="submitForm">
            {{ crudOption === 'create' ? 'Create' : 'Update' }} Item
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<style scoped>
.item-form {
  padding: 20px;
}
</style>

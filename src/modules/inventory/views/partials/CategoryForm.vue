<script setup>
import PageTitle from '@/components/globals/PageTitle.vue'
import { computed, ref, watch } from 'vue'
import { useCategory } from '@/modules/inventory/composables/useCategory.js'

// #------------- Props / Emits ---------------------#
const props = defineProps({
  crudOption: { type: String, required: true, default: 'create' },
  categoryObject: { type: Object },
})
const emits = defineEmits(['completeCategoryAction'])

// #------------- Reactive & Refs State -------------#
const categoryForm = ref(null)
const form = ref({
  name: '',
  code: '',
  description: '',
})
const { saveCategoryDetails, success, updateCategoryDetails } = useCategory()

// #------------- Computed Properties ---------------#
const pageTitle = computed(() => {
  return  props.crudOption === 'create' ? 'CREATE NEW CATEGORY' : 'UPDATE CATEGORY DETAILS'
})

// #------------- Watchers --------------------------#
watch(
  () => props.categoryObject,
  (newValue) => {
    if (newValue) {
      form.value = {
        ...newValue
      }
    }
  },
  { immediate: true, deep: true }
)

// #------------- methods ---------------------------#
const onSubmit = () => {
  categoryForm.value.validate(async (valid) => {
    if (valid) {
      await saveCategoryDetails(form.value)
      if (success.value) {
        emits('completeCategoryAction')
      }
    }
  })
}

const onUpdate = () => {
  categoryForm.value.validate(async (valid) => {
    if (valid) {
      await updateCategoryDetails(form.value)
      if (success.value) {
        emits('completeCategoryAction')
      }
    }
  })
}

const cancelForm = () => {
  categoryForm.value.resetFields()
  emits('completeCategoryAction')
}

</script>

<template>
  <div class="page-container">
    <PageTitle :title="pageTitle" />
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form :model="form" ref="categoryForm" label-position="top">
          <el-form-item label="Code" prop="code" required>
            <el-input v-model="form.code" placeholder="Write unique codification" clearable />
          </el-form-item>
          <el-form-item label="Name" prop="name" required>
            <el-input v-model="form.name" placeholder="Write code name" clearable />
          </el-form-item>
          <el-form-item label="Description" prop="description" required>
            <el-input
              type="textarea" v-model="form.description" placeholder="Enter code description"
              clearable
            />
          </el-form-item>
          <el-divider />
          <el-form-item>
            <el-button
              v-if="crudOption === 'create' " type="primary" plain size="small"
              @click="onSubmit"
            >
              Create New Category
            </el-button>
            <el-button
              v-if="crudOption === 'update' " type="primary" plain size="small"
              @click="onUpdate"
            >
              Update Category Details
            </el-button>
            <el-button plain size="small" @click="cancelForm">Cancel</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>

</style>

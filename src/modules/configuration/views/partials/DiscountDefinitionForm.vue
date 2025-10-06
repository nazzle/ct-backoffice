<script setup>
import PageTitle from '@/components/globals/PageTitle.vue'
import { computed, ref, watch } from 'vue'
import { useDiscountDefinition } from '@/modules/configuration/composables/useDiscountDefinition.js'

// #------------- Props / Emits ---------------------#
const props = defineProps({
  crudOption: { type: String, required: true, default: 'create' },
  discountDefinitionObject: { type: Object },
})
const emits = defineEmits(['completeDiscountDefinitionAction'])

// #------------- Reactive & Refs State -------------#
const definitionFormRef = ref(null)
const form = ref({
  active: true,
  name: '',
  type: 'percentage',
  value: 0,
  scope: 'sale',
})

const discountTypes = [
  { label: 'Fixed Amount', value: 'fixed' },
  { label: 'Percentage', value: 'percentage' },
]

const discountScopes = [
  { label: 'Sale', value: 'sale' },
  { label: 'Item', value: 'item' },
  { label: 'Category', value: 'category' },
]

const { saveDiscountDefinitionDetails, success, updateDiscountDefinitionDetails } =
  useDiscountDefinition()

// #------------- Computed Properties ---------------#
const pageTitle = computed(() => {
  return props.crudOption === 'create'
    ? 'CREATE NEW DISCOUNT DEFINITION'
    : 'UPDATE DISCOUNT DEFINITION'
})

// #------------- Watchers --------------------------#
watch(
  () => props.discountDefinitionObject,
  (newValue) => {
    if (newValue) {
      form.value = {
        ...newValue,
      }
    }
  },
  { immediate: true, deep: true },
)

// #------------- methods ---------------------------#
const onSubmit = () => {
  definitionFormRef.value.validate(async (valid) => {
    if (valid) {
      await saveDiscountDefinitionDetails(form.value)
      if (success.value) {
        definitionFormRef.value.resetFields()
        emits('completeDiscountDefinitionAction')
      }
    }
  })
}

const onUpdate = () => {
  definitionFormRef.value.validate(async (valid) => {
    if (valid) {
      await updateDiscountDefinitionDetails(form.value)
      if (success.value) {
        definitionFormRef.value.resetFields()
        emits('completeDiscountDefinitionAction')
      }
    }
  })
}

const cancelForm = () => {
  definitionFormRef.value.resetFields()
  emits('completeDiscountDefinitionAction')
}
</script>

<template>
  <div class="page-container">
    <PageTitle :title="pageTitle" />
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form :model="form" ref="definitionFormRef" label-position="top">
          <el-form-item label="Name" prop="name" required>
            <el-input v-model="form.name" placeholder="Discount name" clearable />
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Discount Type" prop="type" required>
                <el-select v-model="form.type" placeholder="Select type" style="width: 100%">
                  <el-option
                    v-for="type in discountTypes"
                    :key="type.value"
                    :label="type.label"
                    :value="type.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Discount Value" prop="value" required>
                <el-input-number
                  v-model="form.value"
                  :min="0"
                  :precision="2"
                  style="width: 100%"
                  placeholder="10.00"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="Discount Scope" prop="scope" required>
            <el-select v-model="form.scope" placeholder="Select scope" style="width: 100%">
              <el-option
                v-for="scope in discountScopes"
                :key="scope.value"
                :label="scope.label"
                :value="scope.value"
              />
            </el-select>
          </el-form-item>
          <el-divider />
          <el-form-item>
            <el-button
              v-if="crudOption === 'create'"
              type="primary"
              plain
              size="small"
              @click="onSubmit"
            >
              Create Discount Definition
            </el-button>
            <el-button
              v-if="crudOption === 'update'"
              type="primary"
              plain
              size="small"
              @click="onUpdate"
            >
              Update Discount Definition
            </el-button>
            <el-button plain size="small" @click="cancelForm">Cancel</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped></style>

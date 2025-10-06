<script setup>
import PageTitle from '@/components/globals/PageTitle.vue'
import { computed, ref, watch } from 'vue'
import { useTax } from '@/modules/configuration/composables/useTax.js'

// #------------- Props / Emits ---------------------#
const props = defineProps({
  crudOption: { type: String, required: true, default: 'create' },
  taxObject: { type: Object },
})
const emits = defineEmits(['completeTaxAction'])

// #------------- Reactive & Refs State -------------#
const taxFormRef = ref(null)
const form = ref({
  active: true,
  name: '',
  rate: 0,
})

const { saveTaxDetails, success, updateTaxDetails } = useTax()

// #------------- Computed Properties ---------------#
const pageTitle = computed(() => {
  return props.crudOption === 'create' ? 'CREATE NEW TAX' : 'UPDATE TAX DETAILS'
})

// #------------- Watchers --------------------------#
watch(
  () => props.taxObject,
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
  taxFormRef.value.validate(async (valid) => {
    if (valid) {
      await saveTaxDetails(form.value)
      if (success.value) {
        taxFormRef.value.resetFields()
        emits('completeTaxAction')
      }
    }
  })
}

const onUpdate = () => {
  taxFormRef.value.validate(async (valid) => {
    if (valid) {
      await updateTaxDetails(form.value)
      if (success.value) {
        taxFormRef.value.resetFields()
        emits('completeTaxAction')
      }
    }
  })
}

const cancelForm = () => {
  taxFormRef.value.resetFields()
  emits('completeTaxAction')
}
</script>

<template>
  <div class="page-container">
    <PageTitle :title="pageTitle" />
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form :model="form" ref="taxFormRef" label-position="top">
          <el-form-item label="Tax Name" prop="name" required>
            <el-input v-model="form.name" placeholder="VAT, GST, Sales Tax..." clearable />
          </el-form-item>
          <el-form-item label="Tax Rate (%)" prop="rate" required>
            <el-input-number
              v-model="form.rate"
              :min="0"
              :max="100"
              :precision="2"
              style="width: 100%"
              placeholder="16.00"
            />
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
              Create Tax
            </el-button>
            <el-button
              v-if="crudOption === 'update'"
              type="primary"
              plain
              size="small"
              @click="onUpdate"
            >
              Update Tax
            </el-button>
            <el-button plain size="small" @click="cancelForm">Cancel</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped></style>

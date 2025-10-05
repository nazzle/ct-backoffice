<script setup>
import PageTitle from '@/components/globals/PageTitle.vue'
import { computed, ref, watch } from 'vue'
import { usePaymentOption } from '@/modules/configuration/composables/usePaymentOption.js'

// #------------- Props / Emits ---------------------#
const props = defineProps({
  crudOption: { type: String, required: true, default: 'create' },
  paymentOptionObject: { type: Object },
})
const emits = defineEmits(['completePaymentOptionAction'])

// #------------- Reactive & Refs State -------------#
const optionFormRef = ref(null)
const form = ref({
  active: true,
  code: '',
  name: '',
  description: '',
})
const { savePaymentOptionDetails, success, updatePaymentOptionDetails } = usePaymentOption()

// #------------- Computed Properties ---------------#
const pageTitle = computed(() => {
  return props.crudOption === 'create' ? 'CREATE NEW PAYMENT OPTION' : 'UPDATE PAYMENT OPTION'
})

// #------------- Watchers --------------------------#
watch(
  () => props.paymentOptionObject,
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
  optionFormRef.value.validate(async (valid) => {
    if (valid) {
      await savePaymentOptionDetails(form.value)
      if (success.value) {
        optionFormRef.value.resetFields()
        emits('completePaymentOptionAction')
      }
    }
  })
}

const onUpdate = () => {
  optionFormRef.value.validate(async (valid) => {
    if (valid) {
      await updatePaymentOptionDetails(form.value)
      if (success.value) {
        optionFormRef.value.resetFields()
        emits('completePaymentOptionAction')
      }
    }
  })
}

const cancelForm = () => {
  optionFormRef.value.resetFields()
  emits('completePaymentOptionAction')
}
</script>

<template>
  <div class="page-container">
    <PageTitle :title="pageTitle" />
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form :model="form" ref="optionFormRef" label-position="top">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Code" prop="code" required>
                <el-input v-model="form.code" placeholder="Unique code" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Name" prop="name" required>
                <el-input v-model="form.name" placeholder="Name" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="Description" prop="description">
            <el-input
              type="textarea"
              v-model="form.description"
              placeholder="Short description"
              clearable
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
              Create Payment Option
            </el-button>
            <el-button
              v-if="crudOption === 'update'"
              type="primary"
              plain
              size="small"
              @click="onUpdate"
            >
              Update Payment Option
            </el-button>
            <el-button plain size="small" @click="cancelForm">Cancel</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped></style>

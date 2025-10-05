<script setup>
import PageTitle from '@/components/globals/PageTitle.vue'
import { computed, ref, watch } from 'vue'
import { useConfiguration } from '@/modules/configuration/composables/useConfiguration.js'

// #------------- Props / Emits ---------------------#
const props = defineProps({
  crudOption: { type: String, required: true, default: 'create' },
  configurationObject: { type: Object },
})
const emits = defineEmits(['completeConfigurationAction'])

// #------------- Reactive & Refs State -------------#
const configurationForm = ref(null)
const form = ref({
  active: true,
  company_name: '',
  company_logo: '',
  address: '',
  website: '',
  email: '',
  phone: '',
  return_policy: '',
  currency_code: '',
  currency_symbol: '',
})
const { saveConfigurationDetails, success, updateConfigurationDetails } = useConfiguration()

// #------------- Computed Properties ---------------#
const pageTitle = computed(() => {
  return props.crudOption === 'create' ? 'CREATE NEW CONFIGURATION' : 'UPDATE CONFIGURATION DETAILS'
})

// #------------- Watchers --------------------------#
watch(
  () => props.configurationObject,
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
  configurationForm.value.validate(async (valid) => {
    if (valid) {
      await saveConfigurationDetails(form.value)
      if (success.value) {
        configurationForm.value.resetFields()
        emits('completeConfigurationAction')
      }
    }
  })
}

const onUpdate = () => {
  configurationForm.value.validate(async (valid) => {
    if (valid) {
      await updateConfigurationDetails(form.value)
      if (success.value) {
        configurationForm.value.resetFields()
        emits('completeConfigurationAction')
      }
    }
  })
}

const cancelForm = () => {
  configurationForm.value.resetFields()
  emits('completeConfigurationAction')
}
</script>

<template>
  <div class="page-container">
    <PageTitle :title="pageTitle" />
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form :model="form" ref="configurationForm" label-position="top">
          <el-form-item label="Company Name" prop="company_name" required>
            <el-input v-model="form.company_name" placeholder="Company name" clearable />
          </el-form-item>
          <el-form-item label="Company Logo URL" prop="company_logo" required>
            <el-input v-model="form.company_logo" placeholder="Logo URL" clearable />
          </el-form-item>
          <el-form-item label="Address" prop="address" required>
            <el-input v-model="form.address" placeholder="Business address" clearable />
          </el-form-item>
          <el-form-item label="Website" prop="website" required>
            <el-input v-model="form.website" placeholder="Website" clearable />
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Email" prop="email" required>
                <el-input v-model="form.email" placeholder="Email" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Phone" prop="phone" required>
                <el-input v-model="form.phone" placeholder="Phone" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="Return Policy" prop="return_policy" required>
            <el-input
              type="textarea"
              v-model="form.return_policy"
              placeholder="Return policy"
              clearable
            />
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Currency Code" prop="currency_code" required>
                <el-input v-model="form.currency_code" placeholder="USD, KES..." clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Currency Symbol" prop="currency_symbol" required>
                <el-input v-model="form.currency_symbol" placeholder="$" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider />
          <el-form-item>
            <el-button
              v-if="crudOption === 'create'"
              type="primary"
              plain
              size="small"
              @click="onSubmit"
            >
              Create Configuration
            </el-button>
            <el-button
              v-if="crudOption === 'update'"
              type="primary"
              plain
              size="small"
              @click="onUpdate"
            >
              Update Configuration
            </el-button>
            <el-button plain size="small" @click="cancelForm">Cancel</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped></style>

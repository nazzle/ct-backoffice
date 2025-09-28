<script setup>
import { reactive, ref, watch } from 'vue'
import { useCountry } from '@/modules/reference-data/composables/useCountry.js'

// #------------- Props / Emits -------------#
const emit = defineEmits(['completeCountryCreate'])
const props = defineProps({
  countryDetails: {
    type: Object,
    default: () => ({}),
  },
})

// #------------- Reactive & Refs State -------------#
const { saveCountry, updateCountryDetails, success } = useCountry()
const countryForm = ref(null)
const crudOption = ref('create')
const countryId = ref(null)

const form = ref({
  name: '',
  code: '',
  currency: '',
  active: true,
})

const rules = {
  name: [
    { required: true, message: 'Country name is required', trigger: 'blur' },
    { min: 2, max: 100, message: 'Name must be between 2 and 100 characters', trigger: 'blur' },
  ],
  code: [
    { required: true, message: 'Country code is required', trigger: 'blur' },
    { min: 2, max: 10, message: 'Code must be between 2 and 10 characters', trigger: 'blur' },
  ],
  currency: [{ max: 10, message: 'Currency code must not exceed 10 characters', trigger: 'blur' }],
}

// #------------- Watchers -------------#
watch(
  () => props.countryDetails,
  (newVal) => {
    if (newVal && Object.keys(newVal).length > 0) {
      form.value = { ...newVal }
      countryId.value = newVal.id
      crudOption.value = 'update'
    } else {
      crudOption.value = 'create'
      form.value = {
        name: '',
        code: '',
        currency: '',
        active: true,
      }
      countryId.value = null
    }
  },
  { immediate: true },
)

watch(success, (value) => {
  if (value) {
    emit('completeCountryCreate')
  }
})

// #------------- Methods -------------#
const submitForm = async () => {
  if (!countryForm.value) return

  await countryForm.value.validate(async (valid) => {
    if (valid) {
      if (crudOption.value === 'create') {
        await saveCountry(form.value)
      } else {
        await updateCountryDetails({ ...form.value, id: countryId.value })
      }
    }
  })
}

const resetForm = () => {
  countryForm.value?.resetFields()
  form.value = {
    name: '',
    code: '',
    currency: '',
    active: true,
  }
  crudOption.value = 'create'
  countryId.value = null
}
</script>

<template>
  <div class="country-form">
    <el-form
      ref="countryForm"
      :model="form"
      :rules="rules"
      label-width="120px"
      label-position="left"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="Country Name" prop="name">
            <el-input v-model="form.name" placeholder="Enter country name" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Country Code" prop="code">
            <el-input
              v-model="form.code"
              placeholder="e.g., US, NG, GB"
              clearable
              style="text-transform: uppercase"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Currency" prop="currency">
            <el-input
              v-model="form.currency"
              placeholder="e.g., USD, NGN, GBP"
              clearable
              style="text-transform: uppercase"
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
            {{ crudOption === 'create' ? 'Create' : 'Update' }} Country
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<style scoped>
.country-form {
  padding: 20px;
}
</style>

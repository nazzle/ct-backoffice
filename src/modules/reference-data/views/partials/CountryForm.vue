<script setup>
import { ref, watch } from 'vue'
import { useCountry } from '@/modules/reference-data/composables/useCountry.js'
import { countries } from '@/utils/countries.js'
import { ElMessage } from 'element-plus'

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
    active: true,
  }
  crudOption.value = 'create'
  countryId.value = null
}
const getCountryCode = (name) => {
  if (name) {
    const selectedCountry = countries.find(
      (country) => country.name === name
    )
    form.value.code = selectedCountry ? selectedCountry.code : ''
  } else {
    form.value.code = ''
    ElMessage.error('Country code is required')
  }
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
            <el-select v-model="form.name" clearable filterable style="width: 100%" @change="getCountryCode">
              <el-option
              v-for="(item, i) in countries"
              :key="i"
              :label="item.name"
              :value="item.name"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="Country Code" prop="code">
            <el-input
              v-model="form.code"
              placeholder="e.g., US, NG, GB"
              clearable
              style="text-transform: uppercase"
              readonly
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

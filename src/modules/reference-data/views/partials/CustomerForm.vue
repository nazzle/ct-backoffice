<script setup>
import PageTitle from '@/components/globals/PageTitle.vue'
import { computed, ref, watch } from 'vue'
import { useCustomer } from '@/modules/reference-data/composables/useCustomer.js'

// #------------- Props / Emits ---------------------#
const props = defineProps({
  crudOption: { type: String, required: true, default: 'create' },
  customerObject: { type: Object },
})
const emits = defineEmits(['completeCustomerAction'])

// #------------- Reactive & Refs State -------------#
const customerFormRef = ref(null)
const form = ref({
  active: true,
  name: '',
  email: '',
  phone: '',
  address: '',
  loyalty_card_number: '',
  loyalty_points: 0,
  type: 'regular',
})

const customerTypes = [
  { label: 'Regular', value: 'regular' },
  { label: 'VIP', value: 'vip' },
  { label: 'Wholesale', value: 'wholesale' },
]

const { saveCustomerDetails, success, updateCustomerDetails } = useCustomer()

// #------------- Computed Properties ---------------#
const pageTitle = computed(() => {
  return props.crudOption === 'create' ? 'CREATE NEW CUSTOMER' : 'UPDATE CUSTOMER DETAILS'
})

// #------------- Watchers --------------------------#
watch(
  () => props.customerObject,
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
  customerFormRef.value.validate(async (valid) => {
    if (valid) {
      await saveCustomerDetails(form.value)
      if (success.value) {
        customerFormRef.value.resetFields()
        emits('completeCustomerAction')
      }
    }
  })
}

const onUpdate = () => {
  customerFormRef.value.validate(async (valid) => {
    if (valid) {
      await updateCustomerDetails(form.value)
      if (success.value) {
        customerFormRef.value.resetFields()
        emits('completeCustomerAction')
      }
    }
  })
}

const cancelForm = () => {
  customerFormRef.value.resetFields()
  emits('completeCustomerAction')
}
</script>

<template>
  <div class="page-container">
    <PageTitle :title="pageTitle" />
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form :model="form" ref="customerFormRef" label-position="top">
          <el-form-item label="Name" prop="name" required>
            <el-input v-model="form.name" placeholder="Customer name" clearable />
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Email" prop="email">
                <el-input v-model="form.email" placeholder="Email address" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Phone" prop="phone">
                <el-input v-model="form.phone" placeholder="Phone number" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="Address" prop="address">
            <el-input
              type="textarea"
              v-model="form.address"
              placeholder="Customer address"
              clearable
            />
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Customer Type" prop="type" required>
                <el-select
                  v-model="form.type"
                  placeholder="Select customer type"
                  style="width: 100%"
                >
                  <el-option
                    v-for="type in customerTypes"
                    :key="type.value"
                    :label="type.label"
                    :value="type.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Loyalty Card Number" prop="loyalty_card_number">
                <el-input
                  v-model="form.loyalty_card_number"
                  placeholder="Loyalty card number"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="Loyalty Points" prop="loyalty_points">
            <el-input-number
              v-model="form.loyalty_points"
              :min="0"
              :precision="2"
              style="width: 100%"
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
              Create Customer
            </el-button>
            <el-button
              v-if="crudOption === 'update'"
              type="primary"
              plain
              size="small"
              @click="onUpdate"
            >
              Update Customer
            </el-button>
            <el-button plain size="small" @click="cancelForm">Cancel</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped></style>

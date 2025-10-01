<script setup>
import { reactive, ref, watch } from 'vue'
import { useInventoryMovement } from '@/modules/inventory/composables/useInventoryMovement.js'

// #------------- Props / Emits -------------#
const emit = defineEmits(['completeInventoryMovementCreate'])
const props = defineProps({
  movementDetails: {
    type: Object,
    default: () => ({})
  }
})

// #------------- Reactive & Refs State -------------#
const { saveInventoryMovement, updateInventoryMovementDetails, success } = useInventoryMovement()
const movementForm = ref(null)
const crudOption = ref('create')
const movementId = ref(null)

const form = ref({
  item_id: '',
  location_id: '',
  movement_type: '',
  quantity: 0,
  reference: '',
  notes: '',
  active: true
})

const movementTypes = [
  { label: 'In', value: 'IN' },
  { label: 'Out', value: 'OUT' },
  { label: 'Transfer', value: 'TRANSFER' },
  { label: 'Adjustment', value: 'ADJUSTMENT' }
]

const rules = {
  item_id: [
    { required: true, message: 'Item is required', trigger: 'change' }
  ],
  location_id: [
    { required: true, message: 'Location is required', trigger: 'change' }
  ],
  movement_type: [
    { required: true, message: 'Movement type is required', trigger: 'change' }
  ],
  quantity: [
    { required: true, message: 'Quantity is required', trigger: 'blur' },
    { type: 'number', min: 1, message: 'Quantity must be greater than 0', trigger: 'blur' }
  ],
  reference: [
    { required: true, message: 'Reference is required', trigger: 'blur' },
    { min: 2, max: 100, message: 'Reference must be between 2 and 100 characters', trigger: 'blur' }
  ]
}

// #------------- Watchers -------------#
watch(() => props.movementDetails, (newVal) => {
  if (newVal && Object.keys(newVal).length > 0) {
    form.value = { ...newVal }
    movementId.value = newVal.id
    crudOption.value = 'update'
  } else {
    crudOption.value = 'create'
    form.value = {
      item_id: '',
      location_id: '',
      movement_type: '',
      quantity: 0,
      reference: '',
      notes: '',
      active: true
    }
    movementId.value = null
  }
}, { immediate: true })

watch(success, (value) => {
  if (value) {
    emit('completeInventoryMovementCreate')
  }
})

// #------------- Methods -------------#
const submitForm = async () => {
  if (!movementForm.value) return
  
  await movementForm.value.validate(async (valid) => {
    if (valid) {
      if (crudOption.value === 'create') {
        await saveInventoryMovement(form.value)
      } else {
        await updateInventoryMovementDetails({ ...form.value, id: movementId.value })
      }
    }
  })
}

const resetForm = () => {
  movementForm.value?.resetFields()
  form.value = {
    item_id: '',
    location_id: '',
    movement_type: '',
    quantity: 0,
    reference: '',
    notes: '',
    active: true
  }
  crudOption.value = 'create'
  movementId.value = null
}
</script>

<template>
  <div class="inventory-movement-form">
    <el-form
      ref="movementForm"
      :model="form"
      :rules="rules"
      label-width="120px"
      label-position="left"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Item" prop="item_id">
            <el-select
              v-model="form.item_id"
              placeholder="Select item"
              clearable
              style="width: 100%"
            >
              <!-- TODO: Populate with items from API -->
              <el-option label="Item 1" value="1" />
              <el-option label="Item 2" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Location" prop="location_id">
            <el-select
              v-model="form.location_id"
              placeholder="Select location"
              clearable
              style="width: 100%"
            >
              <!-- TODO: Populate with locations from API -->
              <el-option label="Location 1" value="1" />
              <el-option label="Location 2" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Movement Type" prop="movement_type">
            <el-select
              v-model="form.movement_type"
              placeholder="Select movement type"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="type in movementTypes"
                :key="type.value"
                :label="type.label"
                :value="type.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Quantity" prop="quantity">
            <el-input-number
              v-model="form.quantity"
              :min="1"
              placeholder="Enter quantity"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Reference" prop="reference">
            <el-input
              v-model="form.reference"
              placeholder="Enter reference (PO, Invoice, etc.)"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Status">
            <el-switch
              v-model="form.active"
              active-text="Active"
              inactive-text="Inactive"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="Notes">
            <el-input
              v-model="form.notes"
              type="textarea"
              :rows="3"
              placeholder="Enter notes (optional)"
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
            {{ crudOption === 'create' ? 'Create' : 'Update' }} Movement
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<style scoped>
.inventory-movement-form {
  padding: 20px;
}
</style>

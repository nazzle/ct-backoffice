<script setup>
import { onMounted, ref, watch } from 'vue'
import { useInventoryMovement } from '@/modules/inventory/composables/useInventoryMovement.js'
import { useItem } from '@/modules/inventory/composables/useItem.js'
import { useLocation } from '@/modules/inventory/composables/useLocation.js'

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
const { getAllItemsList, allItems } = useItem()
const { allLocations, getNonPaginatedLocationList } = useLocation()
const movementForm = ref(null)
const crudOption = ref('create')
const movementId = ref(null)
const fromLocationVisible = ref(false)
const toLocationVisible = ref(false)

const form = ref({
  item_id: '',
  from_location: '',
  to_location: '',
  movement_type: '',
  quantity: 0,
  reference: '',
  notes: '',
  active: true
})

const movementTypes = [
  { label: 'In', value: 'in' },
  { label: 'Out', value: 'out' },
  { label: 'Transfer', value: 'transfer' }
]

const rules = {
  item_id: [
    { required: true, message: 'Item is required', trigger: 'change' }
  ],
  from_location: [
    { required: true, message: 'Location is required', trigger: 'change' }
  ],
  to_location: [
    { required: true, message: 'Location is required', trigger: 'change' }
  ],
  movement_type: [
    { required: true, message: 'Movement type is required', trigger: 'change' }
  ],
  quantity: [
    { required: true, message: 'Quantity is required', trigger: 'blur' },
    { type: 'number', min: 1, message: 'Quantity must be greater than 0', trigger: 'blur' }
  ],
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
      from_location: '',
      to_location: '',
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

onMounted(() => {
  getAllItemsList()
  getNonPaginatedLocationList()
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
    from_location: '',
    to_location: '',
    movement_type: '',
    quantity: 0,
    reference: '',
    notes: '',
    active: true
  }
  crudOption.value = 'create'
  movementId.value = null
}

const checkMovementType = () => {
  if (form.value?.movement_type === 'in') {
    toLocationVisible.value = true
    fromLocationVisible.value = false
  } else if (form.value?.movement_type === 'out') {
    toLocationVisible.value = false
    fromLocationVisible.value = true
  } else if (form.value?.movement_type === 'transfer') {
    toLocationVisible.value = true
    fromLocationVisible.value = true
  } else {
    toLocationVisible.value = false
    fromLocationVisible.value = false
  }
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
              filterable
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="(item, i) in allItems" :key="i"
                :label="`${item.description} - ${item.barcode} (Qty: ${item.inventory.quantity})`" :value="item.id"
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
          <el-form-item label="Type" prop="movement_type">
            <el-select
              v-model="form.movement_type"
              placeholder="Select movement type"
              clearable
              style="width: 100%"
              @change="checkMovementType"
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
          <el-form-item label="Reference" prop="reference">
            <el-input
              v-model="form.reference"
              placeholder="Enter reference (PO, Invoice, etc.)"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12" v-if="fromLocationVisible">
          <el-form-item label="From" prop="from_location">
            <el-select
              v-model="form.from_location"
              placeholder="Select source location"
              clearable
              filterable
              style="width: 100%"
            >
              <el-option
                v-for="(item, i) in allLocations" :key="i"
                :label="item.name" :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="toLocationVisible">
          <el-form-item label="To" prop="to_location">
            <el-select
              v-model="form.to_location"
              placeholder="Select destination location"
              clearable
              filterable
              style="width: 100%"
            >
              <el-option
                v-for="(item, i) in allLocations" :key="i"
                :label="item.name" :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Status">
            <el-switch
              v-model="form.active"
              active-text="Active"
              inactive-text="Inactive"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
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

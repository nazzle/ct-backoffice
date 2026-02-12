<script setup>
import { onMounted, ref, watch } from 'vue'
import { useInventoryRecord } from '@/modules/inventory/composables/useInventoryRecord.js'
import { useItem } from '@/modules/inventory/composables/useItem.js'
import { useLocation } from '@/modules/inventory/composables/useLocation.js'

const emit = defineEmits(['completeInventoryRecordCreate'])
const props = defineProps({
  recordDetails: {
    type: Object,
    default: () => ({}),
  },
})

const { saveInventoryRecord, updateInventoryRecordDetails, success } = useInventoryRecord()
const { getAllItemsList, allItems } = useItem()
const { allLocations, getNonPaginatedLocationList } = useLocation()
const recordForm = ref(null)
const crudOption = ref('create')
const recordId = ref(null)

const form = ref({
  item_id: '',
  location_id: '',
  quantity: 0,
  reference: '',
  notes: '',
  active: true,
})

const rules = {
  item_id: [{ required: true, message: 'Item is required', trigger: 'change' }],
  location_id: [{ required: true, message: 'Location is required', trigger: 'change' }],
  quantity: [
    { required: true, message: 'Quantity is required', trigger: 'blur' },
    { type: 'number', min: 0, message: 'Quantity must be a positive number', trigger: 'blur' },
  ],
}

watch(
  () => props.recordDetails,
  (newVal) => {
    if (newVal && Object.keys(newVal).length > 0) {
      form.value = {
        item_id: newVal.item_id ?? newVal.item?.id ?? '',
        location_id: newVal.location_id ?? newVal.location?.id ?? '',
        quantity: newVal.quantity ?? 0,
        reference: newVal.reference ?? '',
        notes: newVal.notes ?? '',
        active: newVal.active ?? true,
      }
      recordId.value = newVal.id
      crudOption.value = 'update'
    } else {
      crudOption.value = 'create'
      form.value = {
        item_id: '',
        location_id: '',
        quantity: 0,
        reference: '',
        notes: '',
        active: true,
      }
      recordId.value = null
    }
  },
  { immediate: true },
)

watch(success, (value) => {
  if (value) {
    emit('completeInventoryRecordCreate')
  }
})

onMounted(() => {
  getAllItemsList()
  getNonPaginatedLocationList()
})

const submitForm = async () => {
  if (!recordForm.value) return

  await recordForm.value.validate(async (valid) => {
    if (valid) {
      if (crudOption.value === 'create') {
        await saveInventoryRecord(form.value)
      } else {
        await updateInventoryRecordDetails({ ...form.value, id: recordId.value })
      }
    }
  })
}

const resetForm = () => {
  recordForm.value?.resetFields()
  form.value = {
    item_id: '',
    location_id: '',
    quantity: 0,
    reference: '',
    notes: '',
    active: true,
  }
  crudOption.value = 'create'
  recordId.value = null
}
</script>

<template>
  <div class="inventory-record-form">
    <el-form
      ref="recordForm"
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
              filterable
              style="width: 100%"
            >
              <el-option
                v-for="(item, i) in allItems"
                :key="i"
                :label="`${item.description} (${item.barcode})`"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Location" prop="location_id">
            <el-select
              v-model="form.location_id"
              placeholder="Select location"
              clearable
              filterable
              style="width: 100%"
            >
              <el-option
                v-for="(item, i) in allLocations"
                :key="i"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Quantity" prop="quantity">
            <el-input-number
              v-model="form.quantity"
              :min="0"
              placeholder="Enter quantity"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Reference" prop="reference">
            <el-input
              v-model="form.reference"
              placeholder="PO, Invoice, etc."
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Status">
            <el-switch v-model="form.active" active-text="Active" inactive-text="Inactive" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="Notes" prop="notes">
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
            {{ crudOption === 'create' ? 'Create' : 'Update' }} Record
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<style scoped>
.inventory-record-form {
  padding: 20px;
}
</style>

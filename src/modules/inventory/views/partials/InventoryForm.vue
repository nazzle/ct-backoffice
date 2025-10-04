<script setup>
import { onMounted, ref, watch } from 'vue'
import { useInventory } from '@/modules/inventory/composables/useInventory.js'
import { useItem } from '@/modules/inventory/composables/useItem.js'
import { useLocation } from '@/modules/inventory/composables/useLocation.js'

// #------------- Props / Emits -------------#
const emit = defineEmits(['completeInventoryCreate'])
const props = defineProps({
  inventoryDetails: {
    type: Object,
    default: () => ({}),
  },
})

// #------------- Reactive & Refs State -------------#
const { saveInventory, updateInventoryDetails, success } = useInventory()
const { getAllItemsList, allItems } = useItem()
const { allLocations, getNonPaginatedLocationList } = useLocation()
const inventoryForm = ref(null)
const crudOption = ref('create')
const inventoryId = ref(null)

const form = ref({
  item_id: '',
  location_id: '',
  quantity: 0,
  reorder_level: 0,
  active: true,
})

const rules = {
  item_id: [{ required: true, message: 'Item is required', trigger: 'change' }],
  location_id: [{ required: true, message: 'Location is required', trigger: 'change' }],
  quantity: [
    { required: true, message: 'Quantity is required', trigger: 'blur' },
    { type: 'number', min: 0, message: 'Quantity must be a positive number', trigger: 'blur' },
  ],
  reorder_level: [
    { required: true, message: 'Min quantity is required', trigger: 'blur' },
    { type: 'number', min: 0, message: 'Min quantity must be a positive number', trigger: 'blur' },
  ],
}

// #------------- Watchers -------------#
watch(
  () => props.inventoryDetails,
  (newVal) => {
    if (newVal && Object.keys(newVal).length > 0) {
      form.value = { ...newVal }
      inventoryId.value = newVal.id
      crudOption.value = 'update'
    } else {
      crudOption.value = 'create'
      form.value = {
        item_id: '',
        location_id: '',
        quantity: 0,
        reorder_level: 0,
        active: true,
      }
      inventoryId.value = null
    }
  },
  { immediate: true },
)

watch(success, (value) => {
  if (value) {
    emit('completeInventoryCreate')
  }
})

onMounted(() => {
  getAllItemsList()
  getNonPaginatedLocationList()
})

// #------------- Methods -------------#
const submitForm = async () => {
  if (!inventoryForm.value) return

  await inventoryForm.value.validate(async (valid) => {
    if (valid) {
      if (crudOption.value === 'create') {
        await saveInventory(form.value)
      } else {
        await updateInventoryDetails({ ...form.value, id: inventoryId.value })
      }
    }
  })
}

const resetForm = () => {
  inventoryForm.value?.resetFields()
  form.value = {
    item_id: '',
    location_id: '',
    quantity: 0,
    reorder_level: 0,
    active: true,
  }
  crudOption.value = 'create'
  inventoryId.value = null
}
</script>

<template>
  <div class="inventory-form">
    <el-form
      ref="inventoryForm"
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
                v-for="(item, i) in allItems" :key="i"
                :label="`${item.description} (${item.barcode})`" :value="item.id"
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
                v-for="(item, i) in allLocations" :key="i"
                :label="item.name" :value="item.id"
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
          <el-form-item label="Status">
            <el-switch v-model="form.active" active-text="Active" inactive-text="Inactive" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Min Quantity" prop="reorder_level">
            <el-input-number
              v-model="form.reorder_level"
              :min="0"
              placeholder="Enter minimum quantity"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24" class="text-right">
          <el-button @click="resetForm">Reset</el-button>
          <el-button type="primary" @click="submitForm">
            {{ crudOption === 'create' ? 'Create' : 'Update' }} Inventory
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<style scoped>
.inventory-form {
  padding: 20px;
}
</style>

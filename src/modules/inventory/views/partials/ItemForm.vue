<script setup>
import { onMounted, ref, watch } from 'vue'
import { useItem } from '@/modules/inventory/composables/useItem.js'
import { useCategory } from '@/modules/inventory/composables/useCategory.js'
import { useItemType } from '@/modules/reference-data/composables/useItemType.js'
import { useSupplier } from '@/modules/supplier/composables/useSupplier.js'
import { useCountry } from '@/modules/reference-data/composables/useCountry.js'
import { useAgeGroup } from '@/modules/reference-data/composables/useAgeGroup.js'

// #------------- Props / Emits -------------#
const emit = defineEmits(['completeItemCreate'])
const props = defineProps({
  itemDetails: {
    type: Object,
    default: () => ({}),
  },
})

// #------------- Reactive & Refs State -------------#
const { saveItemDetails, updateItemDetails, success } = useItem()
const { allCategories, getNonPaginatedCategories } = useCategory()
const { allItemTypes, getAllItemTypesList } = useItemType()
const { allSuppliers, getNonPaginatedSuppliersList } = useSupplier()
const { allCountries, getAllCountriesList } = useCountry()
const { allAgeGroups, getAllAgeGroupsList } = useAgeGroup()
const itemForm = ref(null)
const crudOption = ref('create')
const itemId = ref(null)

const form = ref({
  barcode: '',
  item_image: '',
  description: '',
  buying_price: 0,
  selling_price: 0,
  category_id: '',
  type_id: '',
  supplier_id: '',
  country_id: '',
  gender: '',
  age_id: '',
  active: true,
})

const rules = {
  buying_price: [
    { required: true, message: 'Buying price is required', trigger: 'blur' },
    { type: 'number', min: 1, message: 'Buying price must be greater than 0', trigger: 'blur',  transform: (value) => Number(value) },
  ],
  selling_price: [
    { required: true, message: 'Selling price is required', trigger: 'blur' },
    { type: 'number', min: 1, message: 'Selling price must be greater than 0', trigger: 'blur',  transform: (value) => Number(value) }
  ],
  category_id: [{ required: true, message: 'Item category is required', trigger: 'change' }],
  type_id: [{ required: true, message: 'Item type is required', trigger: 'change' }],
  supplier_id: [{ required: true, message: 'Item supplier is required', trigger: 'change' }],
  country_id: [{ required: true, message: 'Item country is required', trigger: 'change' }],
  gender: [{ required: true, message: 'Item gender is required', trigger: 'change' }],
  age_id: [{ required: true, message: 'Item age group is required', trigger: 'change' }],
}

// #------------- Watchers -------------#
watch(
  () => props.itemDetails,
  (newVal) => {
    if (newVal && Object.keys(newVal).length > 0) {
      form.value = { ...newVal }
      itemId.value = newVal.id
      crudOption.value = 'update'
    } else {
      crudOption.value = 'create'
      form.value = {
        barcode: '',
        item_image: '',
        description: '',
        buying_price: 0,
        selling_price: 0,
        category_id: '',
        type_id: '',
        supplier_id: '',
        country_id: '',
        gender: '',
        age_id: '',
        active: true,
      }
      itemId.value = null
    }
  },
  { immediate: true },
)

watch(success, (value) => {
  if (value) {
    emit('completeItemCreate')
  }
})

onMounted(() => {
  getNonPaginatedCategories()
  getAllItemTypesList()
  getAllAgeGroupsList()
  getAllCountriesList()
  getNonPaginatedSuppliersList()
})

// #------------- Methods -------------#
const submitForm = async () => {
  if (!itemForm.value) return

  await itemForm.value.validate(async (valid) => {
    if (valid) {
      if (crudOption.value === 'create') {
        await saveItemDetails(form.value)
      } else {
        await updateItemDetails({ ...form.value, id: itemId.value })
      }
    }
  })
}

const resetForm = () => {
  itemForm.value?.resetFields()
  form.value = {
    barcode: '',
    item_image: '',
    description: '',
    buying_price: 0,
    selling_price: 0,
    category_id: '',
    type_id: '',
    supplier_id: '',
    country_id: '',
    gender: '',
    age_id: '',
    active: true,
  }
  crudOption.value = 'create'
  itemId.value = null
}
</script>

<template>
  <div class="item-form">
    <el-form ref="itemForm" :model="form" :rules="rules" label-width="120px" label-position="left">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Barcode" prop="barcode">
            <el-input v-model="form.barcode" placeholder="Enter barcode if exist" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Item Image" prop="item_image">
            <el-input v-model="form.item_image" placeholder="Upload Image" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Buying Price" prop="buying_price">
            <el-input v-model="form.buying_price" type="number" placeholder="Enter buying price" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Selling Price" prop="selling_price">
            <el-input v-model="form.selling_price" type="number" placeholder="Enter selling price" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Item Category" prop="category_id">
            <el-select
              v-model="form.category_id"
              placeholder="Select category"
              filterable
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="(item, i) in allCategories" :key="i"
                :label="item.name" :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Item Type" prop="type_id">
            <el-select
              v-model="form.type_id"
              placeholder="Select item type"
              filterable
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="(item, i) in allItemTypes" :key="i"
                :label="item.name" :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Item Supplier" prop="supplier_id">
            <el-select
              v-model="form.supplier_id"
              placeholder="Select supplier"
              filterable
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="(item, i) in allSuppliers" :key="i"
                :label="item.name" :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Item Country" prop="country_id">
            <el-select
              v-model="form.country_id"
              placeholder="Select item type"
              filterable
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="(item, i) in allCountries" :key="i"
                :label="item.name" :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Item Gender" prop="gender">
            <el-select
              v-model="form.gender"
              placeholder="Select gender"
              filterable
              clearable
              style="width: 100%"
            >
              <el-option label="Male" value="male" />
              <el-option label="Female" value="female" />
              <el-option label="Unisex" value="unisex" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Age Group" prop="age_id">
            <el-select
              v-model="form.age_id"
              placeholder="Select age group"
              filterable
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="(item, i) in allAgeGroups" :key="i"
                :label="`${item.code}${item.from} - ${item.to}`" :value="item.id"
              />
            </el-select>
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
        <el-col :span="24">
          <el-form-item label="Description">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
              placeholder="Enter description (optional)"
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
            {{ crudOption === 'create' ? 'Create' : 'Update' }} Item
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<style scoped>
.item-form {
  padding: 20px;
}
</style>

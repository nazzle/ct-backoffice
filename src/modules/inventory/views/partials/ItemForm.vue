<script setup>
import { onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useItem } from '@/modules/inventory/composables/useItem.js'
import { useCategory } from '@/modules/inventory/composables/useCategory.js'
import { useItemType } from '@/modules/reference-data/composables/useItemType.js'
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
const { allAgeGroups, getAllAgeGroupsList } = useAgeGroup()
const itemForm = ref(null)
const crudOption = ref('create')
const itemId = ref(null)
const imagePreview = ref('')

const form = ref({
  barcode: '',
  item_image: '',
  description: '',
  buying_price: 0,
  selling_price: 0,
  category_id: '',
  type_id: '',
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
      imagePreview.value = newVal.item_image || ''
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
        gender: '',
        age_id: '',
        active: true,
      }
      itemId.value = null
      imagePreview.value = ''
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
    gender: '',
    age_id: '',
    active: true,
  }
  crudOption.value = 'create'
  itemId.value = null
  imagePreview.value = ''
}

/**
 * Compress image file to a JPEG data URL.
 * Limits the maximum dimension to 800px and applies quality compression.
 */
const compressImage = (file, quality = 0.7, maxDimension = 800) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img

        // Maintain aspect ratio while limiting max dimension
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width
          width = maxDimension
        } else if (height > width && height > maxDimension) {
          width = (width * maxDimension) / height
          height = maxDimension
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }
        ctx.drawImage(img, 0, 0, width, height)

        const dataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(dataUrl)
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = e.target?.result
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

const handleImageChange = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    ElMessage.error('Please select an image file')
    return
  }

  const isLt2M = file.size / 1024 / 1024 <= 2
  if (!isLt2M) {
    ElMessage.error('Image size must not exceed 2MB')
    return
  }

  try {
    const compressedDataUrl = await compressImage(file, 0.7)
    form.value.item_image = compressedDataUrl
    imagePreview.value = compressedDataUrl
  } catch (error) {
    console.error(error)
    ElMessage.error('Failed to process image')
  } finally {
    // Reset the file input so selecting the same file again still triggers change
    event.target.value = ''
  }
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
            <input
              type="file"
              accept="image/*"
              @change="handleImageChange"
            />
            <div v-if="imagePreview" class="mt-2">
              <img :src="imagePreview" alt="Item preview" class="item-image-preview" />
            </div>
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

.item-image-preview {
  max-width: 120px;
  max-height: 120px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  object-fit: cover;
}
</style>

<script setup>
import PageTitle from '@/components/globals/PageTitle.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useDiscount } from '@/modules/configuration/composables/useDiscount.js'
import { useDiscountDefinition } from '@/modules/configuration/composables/useDiscountDefinition.js'
import { useItem } from '@/modules/inventory/composables/useItem.js'

// #------------- Props / Emits ---------------------#
const props = defineProps({
  crudOption: { type: String, required: true, default: 'create' },
  discountObject: { type: Object },
})
const emits = defineEmits(['completeDiscountAction'])

// #------------- Reactive & Refs State -------------#
const discountFormRef = ref(null)
const form = ref({
  active: true,
  definition_id: null,
  item_id: null,
  valid_from: '',
  valid_to: '',
})

const { saveDiscountDetails, success, updateDiscountDetails } = useDiscount()
const { getNonPaginatedDiscountDefinitions, allDiscountDefinitions } = useDiscountDefinition()
const { getAllItemsList, allItems } = useItem()

// #------------- Lifecycle ---------------------------#
onMounted(() => {
  getNonPaginatedDiscountDefinitions()
  getAllItemsList()
})

// #------------- Computed Properties ---------------#
const pageTitle = computed(() => {
  return props.crudOption === 'create' ? 'CREATE NEW DISCOUNT' : 'UPDATE DISCOUNT'
})

// #------------- Watchers --------------------------#
watch(
  () => props.discountObject,
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
  discountFormRef.value.validate(async (valid) => {
    if (valid) {
      await saveDiscountDetails(form.value)
      if (success.value) {
        discountFormRef.value.resetFields()
        emits('completeDiscountAction')
      }
    }
  })
}

const onUpdate = () => {
  discountFormRef.value.validate(async (valid) => {
    if (valid) {
      await updateDiscountDetails(form.value)
      if (success.value) {
        discountFormRef.value.resetFields()
        emits('completeDiscountAction')
      }
    }
  })
}

const cancelForm = () => {
  discountFormRef.value.resetFields()
  emits('completeDiscountAction')
}
</script>

<template>
  <div class="page-container">
    <PageTitle :title="pageTitle" />
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form :model="form" ref="discountFormRef" label-position="top">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Discount Definition" prop="definition_id" required>
                <el-select
                  v-model="form.definition_id"
                  placeholder="Select discount definition"
                  style="width: 100%"
                  filterable
                >
                  <el-option
                    v-for="definition in allDiscountDefinitions"
                    :key="definition.id"
                    :label="definition.name"
                    :value="definition.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Item" prop="item_id" required>
                <el-select
                  v-model="form.item_id"
                  placeholder="Select item"
                  style="width: 100%"
                  filterable
                >
                  <el-option
                    v-for="item in allItems"
                    :key="item.id"
                    :label="`${item.description} (${item.barcode})`"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Valid From" prop="valid_from" required>
                <el-date-picker
                  v-model="form.valid_from"
                  type="datetime"
                  placeholder="Select start date and time"
                  style="width: 100%"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Valid To (Optional)" prop="valid_to">
                <el-date-picker
                  v-model="form.valid_to"
                  type="datetime"
                  placeholder="Select end date and time"
                  style="width: 100%"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                />
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
              Create Discount
            </el-button>
            <el-button
              v-if="crudOption === 'update'"
              type="primary"
              plain
              size="small"
              @click="onUpdate"
            >
              Update Discount
            </el-button>
            <el-button plain size="small" @click="cancelForm">Cancel</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped></style>

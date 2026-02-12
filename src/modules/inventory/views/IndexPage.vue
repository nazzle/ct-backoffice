<script setup>
import PageTitle from '@/components/globals/PageTitle.vue'
import { hasPermission } from '@/utils/permissions.js'
import CategoriesManagement from '@/modules/inventory/views/partials/CategoriesManagement.vue'
import LocationsManagement from '@/modules/inventory/views/partials/LocationsManagement.vue'
import ItemManagement from '@/modules/inventory/views/partials/ItemManagement.vue'
import InventoryManagement from '@/modules/inventory/views/partials/InventoryManagement.vue'
import InventoryMovementManagement from '@/modules/inventory/views/partials/InventoryMovementManagement.vue'
import InventoryRecordManagement from '@/modules/inventory/views/partials/InventoryRecordManagement.vue'
import ItemForm from '@/modules/inventory/views/partials/ItemForm.vue'
import InventoryForm from '@/modules/inventory/views/partials/InventoryForm.vue'
import InventoryMovementForm from '@/modules/inventory/views/partials/InventoryMovementForm.vue'
import InventoryRecordForm from '@/modules/inventory/views/partials/InventoryRecordForm.vue'
import { ref } from 'vue'

// #------------- Props / Emits ---------------------#

// #------------- Reactive & Refs State -------------#
const pageTitle = 'Items & Inventories Management'

// Modal states
const dialogVisible = ref(false)
const dialogTitle = ref('')
const modalType = ref('')
const formData = ref(null)

// child refs
const itemsRef = ref(null)
const inventoryRef = ref(null)
const inventoryMovementsRef = ref(null)
const inventoryRecordsRef = ref(null)

// #------------- Watchers ---------------------------#

// #------------- Methods ---------------------------#
const openItemModal = (data) => {
  modalType.value = 'item'
  dialogTitle.value = data.type === 'create' ? 'Add New Item' : 'Edit Item'
  formData.value = data.data
  dialogVisible.value = true
}

const openInventoryModal = (data) => {
  modalType.value = 'inventory'
  dialogTitle.value = data.type === 'create' ? 'Add New Inventory' : 'Edit Inventory'
  formData.value = data.data
  dialogVisible.value = true
}

const openInventoryMovementModal = (data) => {
  modalType.value = 'inventoryMovement'
  dialogTitle.value = data.type === 'create' ? 'Add New Movement' : 'Edit Movement'
  formData.value = data.data
  dialogVisible.value = true
}

const openInventoryRecordModal = (data) => {
  modalType.value = 'inventoryRecord'
  dialogTitle.value = data.type === 'create' ? 'Add New Inventory Record' : 'Edit Inventory Record'
  formData.value = data.data
  dialogVisible.value = true
}

const closeModal = () => {
  dialogVisible.value = false
  modalType.value = ''
  formData.value = null
}

const onItemCompleted = () => {
  closeModal()
  itemsRef.value?.reload && itemsRef.value.reload()
}

const onInventoryCompleted = () => {
  closeModal()
  inventoryRef.value?.reload && inventoryRef.value.reload()
}

const onInventoryMovementCompleted = () => {
  closeModal()
  inventoryMovementsRef.value?.reload && inventoryMovementsRef.value.reload()
}

const onInventoryRecordCompleted = () => {
  closeModal()
  inventoryRecordsRef.value?.reload && inventoryRecordsRef.value.reload()
}
</script>

<template>
  <div class="page-container">
    <PageTitle :title="pageTitle" />
    <el-row :gutter="20">
      <el-col :span="24">
        <el-tabs type="border-card">
          <!--   CATEGORIES LIST TAB   -->
<!--          <el-tab-pane v-if="hasPermission('VIEW_CATEGORIES')" label="Categories Management">-->
<!--            <CategoriesManagement />-->
<!--          </el-tab-pane>-->

          <!--   ITEMS LIST TAB   -->
          <el-tab-pane v-if="hasPermission('VIEW_ITEMS')" label="Items Management">
            <ItemManagement ref="itemsRef" @openItemModal="openItemModal" />
          </el-tab-pane>

          <!--   LOCATIONS LIST TAB   -->
          <el-tab-pane v-if="hasPermission('VIEW_LOCATIONS')" label="Locations Management">
            <LocationsManagement />
          </el-tab-pane>

          <!--   INVENTORIES LIST TAB   -->
          <el-tab-pane v-if="hasPermission('VIEW_INVENTORY')" label="Inventory Management">
            <InventoryManagement ref="inventoryRef" @openInventoryModal="openInventoryModal" />
          </el-tab-pane>

          <!--   INVENTORY RECORDS LIST TAB   -->
          <el-tab-pane v-if="hasPermission('VIEW_INVENTORY')" label="Inventory Records">
            <InventoryRecordManagement ref="inventoryRecordsRef" @openInventoryRecordModal="openInventoryRecordModal" />
          </el-tab-pane>

          <!--   INVENTORY MOVEMENTS LIST TAB   -->
          <el-tab-pane v-if="hasPermission('VIEW_MOVEMENTS')" label="Inventory-Movements Management">
            <InventoryMovementManagement ref="inventoryMovementsRef" @openInventoryMovementModal="openInventoryMovementModal" />
          </el-tab-pane>

        </el-tabs>
      </el-col>

      <!--   FORMS DIALOG   -->
      <el-dialog v-model="dialogVisible" :title="dialogTitle" width="60%" @close="closeModal">
        <div class="content">
          <div class="form-components">
            <ItemForm
              v-if="modalType === 'item'"
              :itemDetails="formData"
              @completeItemCreate="onItemCompleted"
            />
            <InventoryForm
              v-if="modalType === 'inventory'"
              :inventoryDetails="formData"
              @completeInventoryCreate="onInventoryCompleted"
            />
            <InventoryMovementForm
              v-if="modalType === 'inventoryMovement'"
              :movementDetails="formData"
              @completeInventoryMovementCreate="onInventoryMovementCompleted"
            />
            <InventoryRecordForm
              v-if="modalType === 'inventoryRecord'"
              :recordDetails="formData"
              @completeInventoryRecordCreate="onInventoryRecordCompleted"
            />
          </div>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>

<style scoped>
.content {
  padding: 20px;
}
</style>

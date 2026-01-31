<script setup>
import PageTitle from '@/components/globals/PageTitle.vue'
import { hasPermission } from '@/utils/permissions.js'
import ItemsTypesManagement from '@/modules/reference-data/views/partials/ItemsTypesManagement.vue'
import ItemGendersManagements from '@/modules/reference-data/views/partials/ItemGendersManagements.vue'
import CountriesManagement from '@/modules/reference-data/views/partials/CountriesManagement.vue'
import AgeGroupsManagement from '@/modules/reference-data/views/partials/AgeGroupsManagement.vue'
import CustomersManagement from '@/modules/reference-data/views/partials/CustomersManagement.vue'
import ItemTypeForm from '@/modules/reference-data/views/partials/ItemTypeForm.vue'
import ItemGenderForm from '@/modules/reference-data/views/partials/ItemGenderForm.vue'
import CountryForm from '@/modules/reference-data/views/partials/CountryForm.vue'
import AgeGroupForm from '@/modules/reference-data/views/partials/AgeGroupForm.vue'
import { ref } from 'vue'
import CategoriesManagement from '@/modules/inventory/views/partials/CategoriesManagement.vue'

// #------------- Props / Emits ---------------------#

// #------------- Reactive & Refs State -------------#
const pageTitle = 'Reference Data Management'

// Modal states
const dialogVisible = ref(false)
const dialogTitle = ref('')
const modalType = ref('')
const formData = ref(null)

// child refs
const itemTypesRef = ref(null)
const itemGendersRef = ref(null)
const countriesRef = ref(null)
const ageGroupsRef = ref(null)

// #------------- Watchers ---------------------------#

// #------------- Methods ---------------------------#
const openItemTypeModal = (data) => {
  modalType.value = 'itemType'
  dialogTitle.value = data.type === 'create' ? 'Add New Item Type' : 'Edit Item Type'
  formData.value = data.data
  dialogVisible.value = true
}

const openItemGenderModal = (data) => {
  modalType.value = 'itemGender'
  dialogTitle.value = data.type === 'create' ? 'Add New Item Gender' : 'Edit Item Gender'
  formData.value = data.data
  dialogVisible.value = true
}

const openCountryModal = (data) => {
  modalType.value = 'country'
  dialogTitle.value = data.type === 'create' ? 'Add New Country' : 'Edit Country'
  formData.value = data.data
  dialogVisible.value = true
}

const openAgeGroupModal = (data) => {
  modalType.value = 'ageGroup'
  dialogTitle.value = data.type === 'create' ? 'Add New Age Group' : 'Edit Age Group'
  formData.value = data.data
  dialogVisible.value = true
}

const closeModal = () => {
  dialogVisible.value = false
  modalType.value = ''
  formData.value = null
}

const onItemTypeCompleted = () => {
  closeModal()
  itemTypesRef.value?.reload && itemTypesRef.value.reload()
}

const onItemGenderCompleted = () => {
  closeModal()
  itemGendersRef.value?.reload && itemGendersRef.value.reload()
}

const onCountryCompleted = () => {
  closeModal()
  countriesRef.value?.reload && countriesRef.value.reload()
}

const onAgeGroupCompleted = () => {
  closeModal()
  ageGroupsRef.value?.reload && ageGroupsRef.value.reload()
}
</script>

<template>
  <div class="page-container">
    <PageTitle :title="pageTitle" />
    <el-row :gutter="20">
      <el-col :span="24">
        <el-tabs type="border-card">
          <!--   ITEM CATEGORIES TAB   -->
          <el-tab-pane label="Item Categories" v-if="hasPermission('VIEW_CATEGORIES')">
            <CategoriesManagement />
          </el-tab-pane>

          <!--   ITEM TYPES TAB   -->
          <el-tab-pane label="Item Types" v-if="hasPermission('VIEW_ITEMS')">
            <ItemsTypesManagement ref="itemTypesRef" @openItemTypeModal="openItemTypeModal" />
          </el-tab-pane>

          <!--   ITEM GENDERS TAB   -->
          <el-tab-pane label="Item Genders" v-if="hasPermission('VIEW_ITEMS')">
            <ItemGendersManagements
              ref="itemGendersRef"
              @openItemGenderModal="openItemGenderModal"
            />
          </el-tab-pane>

          <!--   AGE GROUPS TAB   -->
          <el-tab-pane label="Age Groups" v-if="hasPermission('VIEW_ITEMS')">
            <AgeGroupsManagement ref="ageGroupsRef" @openAgeGroupModal="openAgeGroupModal" />
          </el-tab-pane>

          <!--   COUNTRIES TAB   -->
          <el-tab-pane label="Countries" v-if="hasPermission('VIEW_ITEMS')">
            <CountriesManagement ref="countriesRef" @openCountryModal="openCountryModal" />
          </el-tab-pane>

          <!--   CUSTOMERS TAB   -->
          <el-tab-pane label="Customers" v-if="hasPermission('VIEW_CUSTOMERS')">
            <CustomersManagement />
          </el-tab-pane>
        </el-tabs>
      </el-col>

      <!--   FORMS DIALOG   -->
      <el-dialog v-model="dialogVisible" :title="dialogTitle" width="50%" @close="closeModal">
        <div class="content">
          <div class="form-components">
            <ItemTypeForm
              v-if="modalType === 'itemType'"
              :itemTypeDetails="formData"
              @completeItemTypeCreate="onItemTypeCompleted"
            />
            <ItemGenderForm
              v-if="modalType === 'itemGender'"
              :itemGenderDetails="formData"
              @completeItemGenderCreate="onItemGenderCompleted"
            />
            <CountryForm
              v-if="modalType === 'country'"
              :countryDetails="formData"
              @completeCountryCreate="onCountryCompleted"
            />
            <AgeGroupForm
              v-if="modalType === 'ageGroup'"
              :ageGroupDetails="formData"
              @completeAgeGroupCreate="onAgeGroupCompleted"
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

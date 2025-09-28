<script setup>
import PageTitle from '@/components/globals/PageTitle.vue'
import { hasPermission } from '@/utils/permissions.js'
import ItemsTypesManagement from '@/modules/reference-data/views/partials/ItemsTypesManagement.vue'
import ItemGendersManagements from '@/modules/reference-data/views/partials/ItemGendersManagements.vue'
import CountriesManagement from '@/modules/reference-data/views/partials/CountriesManagement.vue'
import ItemTypeForm from '@/modules/reference-data/views/partials/ItemTypeForm.vue'
import ItemGenderForm from '@/modules/reference-data/views/partials/ItemGenderForm.vue'
import CountryForm from '@/modules/reference-data/views/partials/CountryForm.vue'
import { ref } from 'vue'

// #------------- Props / Emits ---------------------#

// #------------- Reactive & Refs State -------------#
const pageTitle = 'Reference Data Management'

// Modal states
const dialogVisible = ref(false)
const dialogTitle = ref('')
const modalType = ref('')
const formData = ref(null)

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

const closeModal = () => {
  dialogVisible.value = false
  modalType.value = ''
  formData.value = null
}
</script>

<template>
  <div class="page-container">
    <PageTitle :title="pageTitle" />
    <el-row :gutter="20">
      <el-col :span="24">
        <el-tabs type="border-card">
          <!--   ITEM TYPES TAB   -->
          <el-tab-pane label="Item Types">
            <ItemsTypesManagement @openItemTypeModal="openItemTypeModal" />
          </el-tab-pane>

          <!--   ITEM GENDERS TAB   -->
          <el-tab-pane label="Item Genders">
            <ItemGendersManagements @openItemGenderModal="openItemGenderModal" />
          </el-tab-pane>

          <!--   COUNTRIES TAB   -->
          <el-tab-pane label="Countries">
            <CountriesManagement @openCountryModal="openCountryModal" />
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
              @completeItemTypeCreate="closeModal"
            />
            <ItemGenderForm
              v-if="modalType === 'itemGender'"
              :itemGenderDetails="formData"
              @completeItemGenderCreate="closeModal"
            />
            <CountryForm
              v-if="modalType === 'country'"
              :countryDetails="formData"
              @completeCountryCreate="closeModal"
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

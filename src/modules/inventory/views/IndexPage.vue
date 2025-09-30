<script setup>
import PageTitle from '@/components/globals/PageTitle.vue'
import { hasPermission } from '@/utils/permissions.js'
import CategoriesManagement from '@/modules/inventory/views/partials/CategoriesManagement.vue'
import LocationsManagement from '@/modules/inventory/views/partials/LocationsManagement.vue'
import ItemManagement from '@/modules/inventory/views/partials/ItemManagement.vue'

// #------------- Props / Emits ---------------------#

// #------------- Reactive & Refs State -------------#
const pageTitle = 'Items & Inventories Management'

// #------------- Watchers ---------------------------#


// #------------- Methods ---------------------------#


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
            <ItemManagement />
          </el-tab-pane>

          <!--   LOCATION LIST TAB   -->
          <el-tab-pane v-if="hasPermission('VIEW_LOCATIONS')" label="Locations Management">
            <LocationsManagement />
          </el-tab-pane>

          <!--   INVENTORIES LIST TAB   -->
          <el-tab-pane v-if="hasPermission('VIEW_INVENTORY')" label="Inventory Management">
          </el-tab-pane>

          <!--   INVENTORY MOVEMENTS LIST TAB   -->
          <el-tab-pane v-if="hasPermission('VIEW_MOVEMENTS')" label="Inventory-Movements Management">
          </el-tab-pane>

        </el-tabs>
      </el-col>
    </el-row>
  </div>

</template>

<style scoped>

</style>

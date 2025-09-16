<script setup>
import PageTitle from '@/components/globals/PageTitle.vue'
import { hasPermission } from '@/utils/permissions.js'
import CategoriesManagement from '@/modules/inventory/views/partials/CategoriesManagement.vue'

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
          <el-tab-pane v-if="hasPermission('VIEW_EMPLOYEES_LIST')" label="Categories Management">
            <CategoriesManagement />
          </el-tab-pane>

          <!--   LOCATION LIST TAB   -->
          <el-tab-pane v-if="hasPermission('VIEW_EMPLOYEES_LIST')" label="Locations Management">
          </el-tab-pane>

          <!--   ITEMS LIST TAB   -->
          <el-tab-pane v-if="hasPermission('VIEW_EMPLOYEES_LIST')" label="Items Management">
          </el-tab-pane>

          <!--   INVENTORIES LIST TAB   -->
          <el-tab-pane v-if="hasPermission('VIEW_EMPLOYEES_LIST')" label="Inventory Management">
          </el-tab-pane>

          <!--   INVENTORY MOVEMENTS LIST TAB   -->
          <el-tab-pane v-if="hasPermission('VIEW_EMPLOYEES_LIST')" label="Inventory-Movements Management">
          </el-tab-pane>

        </el-tabs>
      </el-col>
    </el-row>
  </div>

</template>

<style scoped>

</style>

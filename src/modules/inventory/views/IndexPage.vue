<script setup>
import PageTitle from '@/components/globals/PageTitle.vue'
import { hasPermission } from '@/utils/permissions.js'
import BaseTable from '@/components/globals/BaseTable.vue'

// #------------- Props / Emits -------------#

// #------------- Reactive & Refs State -------------#
const pageTitle = 'Items & Inventories Management'
const columns = []

</script>

<template>
  <div class="page-container">
    <PageTitle :title="pageTitle" />
    <el-row :gutter="20">
      <el-col :span="24">
        <el-tabs type="border-card">

          <!--   CATEGORIES LIST TAB   -->
          <el-tab-pane v-if="hasPermission('VIEW_EMPLOYEES_LIST')" label="Categories Management">
            <el-row :gutter="20" class="pb-2">
              <el-col :span="24" class="text-right">
                <el-button v-if="hasPermission('SAVE_EMPLOYEE_DETAILS')" type="primary" size="small" plain>
                  <Icon icon="mdi-light:plus-circle" width="14" height="14" /> Add New Category
                </el-button>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="pb-2">
              <el-col :span="24" class="text-right">
                <base-table
                  pagination=""
                  rows=""
                  :columns="[
                    { key: 'name', label: 'Name' },
                    { key: 'email', label: 'Email' },
                    { key: 'role', label: 'Role' }
                  ]"
                />
              </el-col>
            </el-row>
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

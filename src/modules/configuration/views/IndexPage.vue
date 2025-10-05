<script setup>
import PageTitle from '@/components/globals/PageTitle.vue'
import { hasPermission } from '@/utils/permissions.js'
import ConfigurationsManagement from '@/modules/configuration/views/partials/ConfigurationsManagement.vue'
import PaymentOptionsManagement from '@/modules/configuration/views/partials/PaymentOptionsManagement.vue'
import { ref } from 'vue'
</script>

<template>
  <div class="page-container">
    <PageTitle title="System Configurations" />
    <el-row :gutter="20">
      <el-col :span="24">
        <el-tabs type="border-card">
          <el-tab-pane label="Configurations" v-if="hasPermission('VIEW_CONFIGURATIONS')">
            <ConfigurationsManagement />
          </el-tab-pane>
          <el-tab-pane label="Payment Options" v-if="hasPermission('VIEW_PAYMENT_OPTIONS')">
            <PaymentOptionsManagement />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped></style>

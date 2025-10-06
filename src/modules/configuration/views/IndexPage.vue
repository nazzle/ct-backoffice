<script setup>
import PageTitle from '@/components/globals/PageTitle.vue'
import { hasPermission } from '@/utils/permissions.js'
import ConfigurationsManagement from '@/modules/configuration/views/partials/ConfigurationsManagement.vue'
import PaymentOptionsManagement from '@/modules/configuration/views/partials/PaymentOptionsManagement.vue'
import TaxesManagement from '@/modules/configuration/views/partials/TaxesManagement.vue'
import DiscountDefinitionsManagement from '@/modules/configuration/views/partials/DiscountDefinitionsManagement.vue'
import DiscountsManagement from '@/modules/configuration/views/partials/DiscountsManagement.vue'
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
          <el-tab-pane label="Payment Options" v-if="hasPermission('VIEW_CONFIGURATIONS')">
            <PaymentOptionsManagement />
          </el-tab-pane>
          <el-tab-pane label="Taxes" v-if="hasPermission('VIEW_CONFIGURATIONS')">
            <TaxesManagement />
          </el-tab-pane>
          <el-tab-pane
            label="Discount Definitions"
            v-if="hasPermission('VIEW_CONFIGURATIONS')"
          >
            <DiscountDefinitionsManagement />
          </el-tab-pane>
          <el-tab-pane label="Discounts" v-if="hasPermission('VIEW_CONFIGURATIONS')">
            <DiscountsManagement />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped></style>

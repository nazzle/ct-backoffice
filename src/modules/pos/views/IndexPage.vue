<script setup>
import { ref } from 'vue'
import { hasPermission } from '@/utils/permissions.js'
import POSInterface from '@/modules/pos/views/POSInterface.vue'
import SalesPerLoggedInLocation from '@/modules/pos/views/SalesPerLoggedInLocation.vue'

const activeTab = ref('pos')
</script>

<template>
  <div class="pos-module">
    <el-tabs v-model="activeTab" type="border-card" class="pos-tabs">
      <el-tab-pane label="Point of Sale" name="pos" v-if="hasPermission('VIEW_SALES')">
        <POSInterface />
      </el-tab-pane>

      <el-tab-pane label="Pending Sales" name="pending-sales" v-if="hasPermission('VIEW_SALES')">

      </el-tab-pane>

      <el-tab-pane label="Sales History" name="sales" v-if="hasPermission('VIEW_SALES')">
        <SalesPerLoggedInLocation />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.pos-module {
  height: calc(100vh - 60px);
  overflow: hidden;
}

.pos-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.pos-tabs :deep(.el-tabs__content) {
  flex: 1;
  overflow: hidden;
}

.pos-tabs :deep(.el-tab-pane) {
  height: 100%;
  overflow: auto;
}
</style>

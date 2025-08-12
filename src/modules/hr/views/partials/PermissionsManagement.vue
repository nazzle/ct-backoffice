<script setup>
import { useRole } from '@/modules/hr/composables/useRole.js'
import { onMounted } from 'vue'
import { removeUnderscore } from '@/components/globals/constants.js'

// #------------- Reactive & Refs State -------------#
const { fetchPermissions, permissionsList, success } = useRole()

// #------------- Watchers -------------#
onMounted(() => {
  fetchPermissions()
})

</script>

<template>
  <div class="bg-white py-10 sm:py-12">
    <div class="mx-auto px-6 lg:px-8">
      <h2 class="text-3xl font-semibold tracking-tight text-gray-700 flex items-center gap-1">
        <Icon icon="mdi-light:lock" width="28" height="28" /> List of Permissions
      </h2>
      <el-divider/>
      <dl class="grid grid-cols-1 gap-x-4 gap-y-7 text-center lg:grid-cols-4">
        <div
          class="mx-auto flex max-w-xs flex-col gap-y-4 border border-gray-300"
          v-for="(item, index) in permissionsList" :key="index"
        >
          <dt class="text-base/7 text-gray-600">{{ removeUnderscore(item?.name) }}</dt>
        </div>
      </dl>
    </div>
  </div>

</template>

<style scoped>

</style>

<script setup>
import logo from '@/assets/logo.png'
import { useAuthStore } from '@/stores/authStore.js'
import { hasPermission } from '@/utils/permissions.js'

// #------------- Reactive & Refs State -------------#
const authStore = useAuthStore()

// #------------- Functions/Methods -------------#
const logout = () => {
  authStore.logout()
}
</script>

<template>
  <div class="bg-white text-gray-800 min-h-152">
    <!-- Header -->
    <header class="ct-secondary-bg border-b border-slate-700 px-4 py-3">
      <div class="pb-1 flex items-center justify-between">
        <!-- Left section -->
        <div class="flex items-center gap-2">
          <button id="sidebarToggle" class="lg:hidden text-white hover:bg-slate-700 p-2 rounded">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>

          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <img class="mr-2" :src="logo" alt="logo">
            </div>
            <span class="text-white font-semibold text-lg hidden sm:block">ChekiiToto - POS</span>
          </div>
        </div>

        <!-- Right section -->
        <div class="flex items-center gap-3">
          <RouterLink to="/my-profile" class="text-white hover:bg-pink-500 p-2 rounded hidden sm:flex items-center gap-1">
            <Icon icon="mdi-light:account" width="24" height="24" />
            <span class="text-sm">My Profile</span>
          </RouterLink>

          <button
            class="text-white hover:cursor-pointer hover:bg-pink-500 p-2 rounded
            relative flex items-center justify-center gap-1"
            @click="logout"
          >
            <Icon icon="mdi-light:logout" width="24" height="24" />
            <span class="ml-2 hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <!-- Secondary Navigation -->
      <nav class="mt-3 pt-3 border-t border-gray-200">
        <div class="flex gap-4 text-sm overflow-x-hidden">
          <RouterLink to="/home" class="text-gray-300 hover:text-white transition-colors duration-200 flex gap-1 items-center"><Icon icon="mdi-light:home" width="17" height="17" /> Home</RouterLink>
          <a v-if="hasPermission('VIEW_SALES_MODULE')" href="#" class="text-gray-300 hover:text-white transition-colors duration-200">Sales</a>
          <RouterLink to="/inventory/index" v-if="hasPermission('VIEW_INVENTORY_MODULE')" href="#" class="text-gray-300 hover:text-white transition-colors duration-200">Inventory</RouterLink>
          <RouterLink to="/suppliers/index" v-if="hasPermission('VIEW_SUPPLIERS_MODULE')" href="#" class="text-gray-300 hover:text-white transition-colors duration-200">Suppliers</RouterLink>
          <RouterLink to="/human-resources/index" v-if="hasPermission('VIEW_HR_MODULE')" href="#" class="text-gray-300 hover:text-white transition-colors duration-200">Employees</RouterLink>
          <a v-if="hasPermission('VIEW_REPORTS_MODULE')" href="#" class="text-gray-300 hover:text-white transition-colors duration-200">Reports</a>
          <RouterLink to="/configurations/index" v-if="hasPermission('VIEW_CONFIGURATIONS_MODULE')" href="#" class="text-gray-300 hover:text-white transition-colors duration-200">Configurations</RouterLink>
        </div>
      </nav>
    </header>

    <!-- Main Layout -->
    <router-view />
  </div>
  <footer class="p-4 md:p-8 lg:p-10 bg-gray-800">
    <div class="mx-auto text-center">
      <a href="#" class="flex justify-center items-center text-2xl font-semibold text-gray-900 dark:text-white">
        Chekii Toto
      </a>
      <p class="my-6 text-gray-500 dark:text-gray-400">Kids and Maternity Store.</p>
      <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2021-2022 <a href="#" class="hover:underline">NazzleSpace™</a>. All Rights Reserved.</span>
    </div>
  </footer>
</template>

<style scoped>
.ct-primary-bg {
  background: var(--ct-primary-color);
}
.ct-secondary-bg {
  background: var(--ct-secondary-color);
}
.ct-primary-color {
  color: var(--ct-primary-color);
}
.ct-secondary-color {
  color: var(--ct-secondary-color);
}
</style>

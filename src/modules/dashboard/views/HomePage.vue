<script setup>
import salesSvg from '@/assets/images/sales.svg'
import inventorySvg from '@/assets/images/inventory.svg'
import configurationsSvg from '@/assets/images/configurations.svg'
import employeeSvg from '@/assets/images/employee.svg'
import reportsSvg from '@/assets/images/reports.svg'
import suppliersSvg from '@/assets/images/suppliers.svg'
import cashUpSvg from '@/assets/images/cashup.svg'
import expensesSvg from '@/assets/images/expenses.svg'
import giftCardsSvg from '@/assets/images/giftcard.svg'
import notificationsSvg from '@/assets/images/notifications.svg'
import restockingSvg from '@/assets/images/restocking.svg'
import { hasPermission } from '@/utils/permissions.js'

const modules = [
  {
    name: 'Sales',
    logo: salesSvg,
    path: '/',
    permissions: 'VIEW_SALES_MODULE',
  },
  {
    name: 'Inventory',
    logo: inventorySvg,
    path: '/',
    permissions: 'VIEW_INVENTORY_MODULE',
  },
  {
    name: 'Suppliers',
    logo: suppliersSvg,
    path: '/',
    permissions: 'VIEW_SUPPLIERS_MODULE',
  },
  {
    name: 'Restocking',
    logo: restockingSvg,
    path: '/',
    permissions: 'VIEW_RESTOCKING_MODULE',
  },
  {
    name: 'Expenses',
    logo: expensesSvg,
    path: '/',
    permissions: 'VIEW_EXPENSES_MODULE',
  },
  {
    name: 'Gift Cards',
    logo: giftCardsSvg,
    path: '/',
    permissions: 'VIEW_GIFT_CARDS_MODULE',
  },
  {
    name: 'Cash-Up',
    logo: cashUpSvg,
    path: '/',
    permissions: 'VIEW_CASH_UP_MODULE',
  },
  {
    name: 'Human Resource',
    logo: employeeSvg,
    path: '/human-resources/index',
    permissions: 'VIEW_HR_MODULE',
  },
  {
    name: 'Notifications',
    logo: notificationsSvg,
    path: '/',
    permissions: 'VIEW_NOTIFICATIONS_MODULE',
  },
  {
    name: 'Reports',
    logo: reportsSvg,
    path: '/',
    permissions: 'VIEW_REPORTS_MODULE',
  },
  {
    name: 'Configurations',
    logo: configurationsSvg,
    path: '/',
    permissions: 'VIEW_CONFIGURATIONS_MODULE',
  },
]

const allowedModules = modules.filter(module => hasPermission(module.permissions))

</script>

<template>
  <div class="flex">
    <!-- Overlay for mobile -->
    <div id="overlay" class="fixed inset-0 bg-black bg-opacity-50 z-30 hidden lg:hidden"></div>

    <!-- Main Content -->
    <main class="flex-1 lg:ml-0">
      <div class="p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-10">
          <!-- Content Cards -->
          <RouterLink
            v-for="(item, index) in allowedModules" :key="index"
            :to="item.path"
            class="bg-white hover:shadow-md shadow-xl/30 transition-colors duration-200 min-h-[200px] flex items-center justify-center group cursor-pointer rounded-lg"
          >
            <div class="p-6 text-center">
              <div class="ct-primary-color group-hover:text-gray-400 transition-colors duration-200 flex flex-col items-center">
                <div class="w-17 h-17 border-gray-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <img :src="item.logo" alt="logo">
                </div>
                <p class="pt-1 text-xl">{{item.name}}</p>
              </div>
            </div>
          </RouterLink>
        </div>
        <div class="no-module" v-if="!allowedModules.length">
          <div class="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
            <div aria-hidden="true" class="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl">
              <div style="clip-path: polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)" class="aspect-577/310 w-144.25 bg-linear-to-r from-[#ff80b5] to-[#9089fc] opacity-30"></div>
            </div>
            <div aria-hidden="true" class="absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl">
              <div style="clip-path: polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)" class="aspect-577/310 w-144.25 bg-linear-to-r from-[#ff80b5] to-[#9089fc] opacity-30"></div>
            </div>
            <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p class="text-sm/6 text-gray-900">
                You currently do not have privilege to view any module.
              </p>
              <el-button type="primary" size="small" plain>Contact Administrator</el-button>
            </div>
            <div class="flex flex-1 justify-end"></div>
          </div>

        </div>
      </div>
    </main>
  </div>
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

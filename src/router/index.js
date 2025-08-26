import { createRouter, createWebHistory } from 'vue-router'
import { authRoutes } from '@/modules/authentication/router/index.js'
import { dashboardRoutes } from '@/modules/dashboard/router/index.js'
import { authGuard } from '@/router/authGuard.js'
import { hrRoutes } from '@/modules/hr/router/index.js'
import { inventoryRoutes } from '@/modules/inventory/router/index.js'
import { supplierRoutes } from '@/modules/supplier/router/index.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../modules/authentication/views/LoginPage.vue'),
      meta: { title: 'Login' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue'),
    },
    ...authRoutes,
    ...dashboardRoutes,
    ...hrRoutes,
    ...inventoryRoutes,
    ...supplierRoutes
  ],
})

router.beforeEach(authGuard)

export default router

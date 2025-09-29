export const inventoryRoutes = [
  {
    path: '/inventory',
    name: 'inventory',
    meta: {
      layout: 'admin',
      requiresAuth: true,
      permissions: ['VIEW_INVENTORY_MODULE'],
    },
    children: [
      {
        path: '/inventory/index',
        name: 'inventory.index',
        component:() => import('../views/IndexPage.vue'),
        meta: {
          requiresAuth: true,
          permissions: ['VIEW_INVENTORY_MODULE'],
        }
      }
    ]
  }
]

export const supplierRoutes = [
  {
    path: '/suppliers',
    name: 'suppliers',
    meta: {
      layout: 'admin',
      requiresAuth: true,
      permissions: ['VIEW_SUPPLIERS_MODULE'],
    },
    children: [
      {
        path: '/suppliers/index',
        name: 'suppliers.index',
        component:() => import('../views/IndexPage.vue'),
        meta: {
          requiresAuth: true,
          permissions: ['VIEW_SUPPLIERS_MODULE'],
        }
      }
    ]
  }
]

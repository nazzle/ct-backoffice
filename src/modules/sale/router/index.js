export const saleRoutes = [
  {
    path: '/sales',
    name: 'sales',
    meta: {
      layout: 'admin',
      requiresAuth: true,
      permissions: ['VIEW_SALES_MODULE'],
    },
    children: [
      {
        path: '/sales/index',
        name: 'sales.index',
        component:() => import('../views/IndexPage.vue'),
        meta: {
          requiresAuth: true,
          permissions: ['VIEW_SALES_MODULE'],
        }
      }
    ]
  }
]

export const referenceDataRoutes = [
  {
    path: '/reference-data',
    name: 'Reference Data',
    meta: {
      layout: 'admin',
      requiresAuth: true,
      permissions: ['CREATE_PRODUCTS'],
    },
    children: [
      {
        path: '/reference-data/index',
        name: 'reference-data.index',
        component:() => import('../views/IndexPage.vue'),
        meta: {
          requiresAuth: true,
          permissions: ['CREATE_PRODUCTS'],
        }
      }
    ]
  }
]

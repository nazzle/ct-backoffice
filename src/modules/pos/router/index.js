export const posRoutes = [
  {
    path: '/pos',
    name: 'POS',
    meta: {
      layout: 'admin',
      requiresAuth: true,
      permissions: ['VIEW_SALES'],
    },
    children: [
      {
        path: '/pos/index',
        name: 'pos.index',
        component: () => import('../views/IndexPage.vue'),
        meta: {
          title: 'Point of Sale',
          requiresAuth: true,
          permissions: ['VIEW_SALES'],
        },
      },
    ],
  },
]

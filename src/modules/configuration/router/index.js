export const configurationsRoutes = [
  {
    path: '/configurations',
    name: 'Configurations',
    meta: {
      layout: 'admin',
      requiresAuth: true,
      permissions: ['VIEW_CONFIGURATIONS'],
    },
    children: [
      {
        path: '/configurations/index',
        name: 'configurations.index',
        component: () => import('../views/IndexPage.vue'),
        meta: {
          title: 'Configurations',
          requiresAuth: true,
          permissions: ['VIEW_CONFIGURATIONS'],
        },
      },
    ],
  },
]

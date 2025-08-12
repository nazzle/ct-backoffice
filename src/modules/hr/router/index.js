export const hrRoutes = [
  {
    path: '/hr',
    name: 'hr',
    meta: {
      layout: 'admin',
      requiresAuth: true,
      permissions: ['VIEW_HR_MODULE'],
    },
    children: [
      {
        path: '/human-resources/index',
        name: 'human-resources.index',
        component:() => import('../views/IndexPage.vue'),
        meta: {
          requiresAuth: true,
          permissions: ['VIEW_HR_MODULE'],
        }
      }
    ]
  }
]

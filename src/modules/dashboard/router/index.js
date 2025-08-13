export const dashboardRoutes = [
  {
    path: '/home-routes',
    meta: {
      title: 'Home Routes',
      requiresAuth: true,
      permissions: ['VIEW_DASHBOARD'],
      layout: 'admin',
    },
    children: [
      {
        path: '/home',
        component: () => import('../views/HomePage.vue'),
        meta: {
          title: 'Home',
          requiresAuth: true,
          permissions: ['VIEW_DASHBOARD'],
        },
      },
      {
        path: '/my-profile',
        component: () => import('../views/MyProfile.vue'),
        meta: {
          title: 'My Profile',
          requiresAuth: true,
        },
      }
    ]
  }
]

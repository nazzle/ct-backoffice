

export const authRoutes = [
  {
    path: '/login',
    component: () => import('../views/LoginPage.vue'),
    meta: { title: 'Login' , layout: 'default' },
  }
]

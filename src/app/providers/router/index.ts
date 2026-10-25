import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/entities/session/model/session.store.ts'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
    layout?: 'default' | 'auth'
  }
}

const APP_TITLE = 'Vue Lottery'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/home/ui/HomeView.vue'),
    meta: { title: 'Home' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/pages/about/ui/AboutView.vue'),
    meta: { title: 'About author' },
  },
  {
    path: '/users',
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'users',
        component: () => import('@/pages/users/ui/UsersView.vue'),
        meta: { title: 'Users' },
      },
      {
        path: ':id(\\d+)',
        name: 'user-details',
        component: () => import('@/pages/user-details/ui/UserDetailsView.vue'),
        props: true,
        meta: { title: 'Types details' },
        children: [
          {
            path: 'edit',
            name: 'user-edit',
            component: () => import('@/pages/user-details/ui/UserEditView.vue'),
            props: true,
            meta: { title: 'Edit user' },
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login/ui/LoginView.vue'),
    meta: { title: 'Login', layout: 'auth' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/not-found/ui/NotFoundView.vue'),
    meta: { title: 'Page not found' },
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'users' }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | ${APP_TITLE}` : APP_TITLE
})

export default router

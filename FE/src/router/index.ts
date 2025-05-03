import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
} from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'
import ForgotPWView from '@/views/ForgotPWView.vue'
import ResetPWView from '@/views/ResetPWView.vue'
import { RouterName } from '@/enums/router'

const routes = [
  { path: '/', name: RouterName.Home, component: HomeView },
  { path: '/login', name: RouterName.Login, component: LoginView },
  { path: '/register', name: RouterName.Register, component: RegisterView },
  { path: '/forgot-password', name: RouterName.ForgotPW, component: ForgotPWView },
  { path: '/account/reset-password', name: RouterName.ResetPW, component: ResetPWView },
  {
    path: '/account/reset-password',
    name: RouterName.ResetPW,
    component: ResetPWView,
    beforeEnter: (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext,
    ) => {
      const token = to.query.token
      if (!token) {
        next({ name: RouterName.Login })
      } else {
        next()
      }
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

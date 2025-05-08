import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
} from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import RegisterView from '@/views/auth/register/FormView.vue'
import LoginView from '@/views/auth/login/FormView.vue'
import ForgotPWView from '@/views/auth/forgot-password/FormView.vue'
import ResetPWView from '@/views/auth/reset-password/FormView.vue'
import { AuthRouterName, RouterName, } from '@/enums/router'

const routes = [
  {
    path: '/',
    name: RouterName.Home,
    component: HomeView,
  },
  {
    path: '/user',
    children: [
      {
        path: 'login',
        name: AuthRouterName.Login,
        component: LoginView,
      },
      {
        path: 'register',
        name: AuthRouterName.Register,
        component: RegisterView,
      },
      {
        path: 'forgot-password',
        name: AuthRouterName.ForgotPW,
        component: ForgotPWView,
      },
      {
        path: 'reset-password/:token',
        name: AuthRouterName.ResetPW,
        component: ResetPWView,
        beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
          const token = to.params.token;
          if (!token) {
            next({ name: AuthRouterName.Login });
          } else {
            next();
          }
        }
      }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

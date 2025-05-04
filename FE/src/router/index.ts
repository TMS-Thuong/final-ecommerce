import {
  createRouter,
  createWebHistory,
} from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'
import { RouterName } from '@/enums/router'

const routes = [
  { path: '/', name: RouterName.Home, component: HomeView },
  { path: '/login', name: RouterName.Login, component: LoginView },
  { path: '/register', name: RouterName.Register, component: RegisterView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

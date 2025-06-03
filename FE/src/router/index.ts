import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
} from 'vue-router'
import HomeView from '@/views/home/HomeView.vue'
import RegisterView from '@/views/auth/register/FormView.vue'
import LoginView from '@/views/auth/login/FormView.vue'
import ForgotPWView from '@/views/auth/forgot-password/FormView.vue'
import ResetPWView from '@/views/auth/reset-password/FormView.vue'
import ProductListView from '@/views/products/ProductListView.vue'
import ProductDetailView from '@/views/products/ProductDetailView.vue'
import CartView from '@/views/cart/CartView.vue'
import CheckoutView from '@/views/checkout/CheckoutView.vue'
import OrderCompleteView from '@/views/checkout/OrderCompleteView.vue'
import PaymentCallbackView from '@/views/checkout/PaymentCallbackView.vue'
import MyOrdersView from '@/views/account/MyOrdersView.vue'
import AddressListView from '@/views/address/AddressListView.vue'
import AddAddressView from '@/views/address/AddAddressView.vue'
import EditAddressView from '@/views/address/EditAddressView.vue'
import ProfileView from '@/views/account/ProfileView.vue'
import WishlistView from '@/views/wishlist/WishlistView.vue'
import MyPurchasedProductsView from '@/views/account/MyPurchasedProductsView.vue'
import ContactView from '@/views/home/ContactView.vue'
import AboutView from '@/views/about/AboutView.vue'
import { AuthRouterEnum, RouterEnum, } from '@/enums/router'

const routes = [

  {
    path: '/',
    name: RouterEnum.Home,
    component: HomeView,
  },
  {
    path: '/contact',
    name: RouterEnum.Contact,
    component: ContactView,
  },
  {
    path: '/products',
    name: RouterEnum.ProductList,
    component: ProductListView,
  },
  {
    path: '/products/:id',
    name: RouterEnum.ProductDetail,
    component: ProductDetailView,
  },
  {
    path: '/cart',
    name: RouterEnum.Cart,
    component: CartView,
  },
  {
    path: '/checkout',
    name: RouterEnum.Checkout,
    component: CheckoutView,
    meta: { requiresAuth: true }
  },
  {
    path: '/order-complete/:orderId',
    name: RouterEnum.OrderComplete,
    component: OrderCompleteView,
    meta: { requiresAuth: true }
  },
  {
    path: '/payment/vnpay_return',
    name: RouterEnum.PaymentCallback,
    component: PaymentCallbackView,
  },
  {
    path: '/account/orders',
    name: RouterEnum.MyOrders,
    component: MyOrdersView,
    meta: { requiresAuth: true }
  },
  {
    path: '/account/addresses',
    name: RouterEnum.AddressList,
    component: AddressListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/account/addresses/add',
    name: RouterEnum.AddAddress,
    component: AddAddressView,
    meta: { requiresAuth: true }
  },
  {
    path: '/account/addresses/edit/:id',
    name: RouterEnum.EditAddress,
    component: EditAddressView,
    meta: { requiresAuth: true }
  },
  {
    path: '/account/profile',
    name: RouterEnum.Profile,
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/account/purchased-products',
    name: 'MyPurchasedProducts',
    component: MyPurchasedProductsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/wishlist',
    name: 'Wishlist',
    component: WishlistView,
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: RouterEnum.About,
    component: AboutView
  },
  {
    path: '/user',
    children: [
      {
        path: 'login',
        name: AuthRouterEnum.Login,
        component: LoginView,
      },
      {
        path: 'register',
        name: AuthRouterEnum.Register,
        component: RegisterView,
      },
      {
        path: 'forgot-password',
        name: AuthRouterEnum.ForgotPW,
        component: ForgotPWView,
      },
      {
        path: 'reset-password/:token',
        name: AuthRouterEnum.ResetPW,
        component: ResetPWView,
        beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
          const token = to.params.token;
          if (!token) {
            next({ name: AuthRouterEnum.Login });
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

  scrollBehavior(to, from, savedPosition) {
    return { left: 0, top: 0 };
  },

})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const token = localStorage.getItem('accessToken');

  if (requiresAuth && !token) {
    next({
      name: AuthRouterEnum.Login,
      query: { redirect: to.fullPath }
    });
  } else {
    next();
  }
});

export default router

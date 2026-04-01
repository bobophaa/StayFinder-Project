import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import HomePage from '@/views/HomePage.vue'
import AllRooms from '@/views/User/AllRooms.vue'
import RoomDetails from '@/views/User/RoomDetails.vue'
import LoginView from '@/views/Auth/LoginView.vue'
import RegisterView from '@/views/Auth/RegisterView.vue'
import ForgotPassword from '@/views/Auth/ForgotPasswordView.vue'
import VerifyOTP from '@/views/Auth/VerifyOTPView.vue'
import ResetPassword from '@/views/Auth/ResetPasswordView.vue'
import ProfileInfo from '@/views/User/ProfileInfo.vue'
import Wishlist from '@/views/User/Wishlist.vue'
import MyBookings from '@/views/User/MyBookings.vue'
import MyRented from '@/views/User/MyRented.vue'
import FAQView from '@/views/User/FAQView.vue'
import PromotionCard from '@/components/ui/PromotionCard.vue'
import InformationPage from '@/views/User/InformationPage.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/rooms', name: 'allRooms', component: AllRooms },
    { path: '/room-details/:id', name: 'roomDetails', component: RoomDetails },
    { path: '/faq', name: 'faq', component: FAQView },

    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { hideNavbar: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { hideNavbar: true },
    },
    {
      path: '/forgot-password',
      name: 'forgotPassword',
      component: ForgotPassword,
      meta: { hideNavbar: true },
    },
    {
      path: '/verify-otp',
      name: 'verifyOtp',
      component: VerifyOTP,
      meta: { hideNavbar: true },
    },
    {
      path: '/reset-password',
      name: 'resetPassword',
      component: ResetPassword,
      meta: { hideNavbar: true },
    },

    { path: '/profile', name: 'profile', component: ProfileInfo, meta: { require: true } },
    { path: '/wishlist', name: 'wishlist', component: Wishlist, meta: { require: true } },
    { path: '/my-bookings', name: 'myBookings', component: MyBookings, meta: { require: true } },
    { path: '/my-rented', name: 'myRented', component: MyRented, meta: { require: true } },
    { path: '/Info', name: 'Infomation', component: InformationPage, meta: { require: true } },

    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { hideNavbar: true },
    },
  ],
})
export default router
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (!to.name) {
    return next({ name: 'NotFound' })
  }

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return next('/login')
  }

  next()
})

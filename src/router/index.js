import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// --- Import Views  ---
// import LandingPage from '@/views/LandingPage.vue'
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
    // Public Routes
    { path: '/', name: 'home', component: HomePage },
    { path: '/rooms', name: 'allRooms', component: AllRooms },
    { path: '/room-details/:id', name: 'roomDetails', component: RoomDetails },

    // Auth Routes
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/forgot-password', name: 'forgotPassword', component: ForgotPassword },
    { path: '/verify-otp', name: 'verifyOtp', component: VerifyOTP },
    { path: '/reset-password', name: 'resetPassword', component: ResetPassword },

    // --- User Protected Routes (Need to Login) ---
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/User/ProfileInfo.vue'),
      meta: { require: true },
    },
    {
      path: '/wishlist',
      name: 'wishlist',
      component: () => import('@/views/User/Wishlist.vue'),
      meta: { require: true },
    },
    {
      path: '/my-bookings',
      name: 'myBookings',
      component: () => import('@/views/User/MyBookings.vue'),
      meta: { require: true },
    },
    {
      path: '/my-rented',
      name: 'myRented',
      component: () => import('@/views/User/MyRented.vue'),
      meta: { require: true },
    },
    {
      path: '/info',
      name: 'info',
      component: () => import('@/views/User/InformationPage.vue'),
      meta: { require: true },
    },
    {
      path: '/ChangePassword',
      name: 'changePassword',
      component: () => import('@/views/User/ChangePassword.vue'),
      meta: { require: true },
    },

    {
      path: '/faq',
      name: 'faq',

      component: FAQView,
    },

    // Provider Routes

    // System
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: LoginView },
  ],
})

router.beforeEach((to, from) => {
  const auth = useAuthStore()

  if (!auth.isLoggedIn && to.meta.require) {
    return { name: 'login' }
  }

  return true
})

export default router

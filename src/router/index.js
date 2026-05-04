import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Import views
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
import InformationPage from '@/views/User/InformationPage.vue'
import AboutUs from '@/views/User/AboutUs.vue'
import ChangePassword from '@/views/User/ChangePassword.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // --- Public Routes ---
    { path: '/', name: 'home', component: HomePage },
    { path: '/rooms', name: 'allRooms', component: AllRooms },
    { path: '/rooms/:id', name: 'roomDetails', component: RoomDetails },
    { path: '/faq', name: 'faq', component: FAQView },
    { path: '/about', name: 'about', component: AboutUs },

    { path: '/login', name: 'login', component: LoginView, meta: { hideNavbar: true } },
    { path: '/register', name: 'register', component: RegisterView, meta: { hideNavbar: true } },
    {
      path: '/forgot-password',
      name: 'forgotPassword',
      component: ForgotPassword,
      meta: { hideNavbar: true },
    },
    { path: '/verify-otp', name: 'verifyOtp', component: VerifyOTP, meta: { hideNavbar: true } },
    {
      path: '/reset-password',
      name: 'resetPassword',
      component: ResetPassword,
      meta: { hideNavbar: true },
    },

    // --- User Protected Routes ---
    { path: '/profile', name: 'profile', component: ProfileInfo, meta: { requiresAuth: true } },
        { path: '/ChangePassword', name: 'hangePassword', component: ChangePassword, meta: { requiresAuth: true } },

     { path: '/about', name: 'about', component:AboutUs, meta: { requiresAuth: true } },
    { path: '/wishlist', name: 'wishlist', component: Wishlist, meta: { requiresAuth: true } },
    {
      path: '/my-bookings',
      name: 'myBookings',
      component: MyBookings,
      meta: { requiresAuth: true },
    },
    { path: '/my-rented', name: 'myRented', component: MyRented, meta: { requiresAuth: true } },
    {
      path: '/info',
      name: 'information',
      component: InformationPage,
      meta: { requiresAuth: true },
    },

    // --- 404 Not Found ---
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { hideNavbar: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const token = localStorage.getItem('token')

  // Protected route
  if (to.meta.requiresAuth && !token) {
    return next({ name: 'login' }) // redirect to login if not logged in
  }

  if ((to.name === 'login' || to.name === 'register') && token) {
    return next({ name: 'home' })
  }

  next()
})

export default router

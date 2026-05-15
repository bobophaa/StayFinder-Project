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
    { path: '/',        name: 'home',       component: HomePage,   meta: { title: 'Home' } },
    { path: '/rooms',   name: 'allRooms',   component: AllRooms,   meta: { title: 'All Rooms' } },
    { path: '/rooms/:id', name: 'roomDetails', component: RoomDetails, meta: { title: 'Room Details' } },
    { path: '/faq',     name: 'faq',        component: FAQView,    meta: { title: 'FAQ' } },
    { path: '/about',   name: 'about',      component: AboutUs,    meta: { title: 'About Us' } },

    // --- Auth Routes ---
    { path: '/login',   name: 'login',      component: LoginView,      meta: { title: 'Login',           hideNavbar: true } },
    { path: '/register', name: 'register',  component: RegisterView,   meta: { title: 'Register',        hideNavbar: true } },
    { path: '/forgot-password', name: 'forgotPassword', component: ForgotPassword, meta: { title: 'Forgot Password', hideNavbar: true } },
    { path: '/verify-otp',      name: 'verifyOtp',      component: VerifyOTP,      meta: { title: 'Verify OTP',      hideNavbar: true } },
    { path: '/reset-password',  name: 'resetPassword',  component: ResetPassword,  meta: { title: 'Reset Password',  hideNavbar: true } },

    // --- User Protected Routes ---
    { path: '/profile',          name: 'profile',        component: ProfileInfo,    meta: { title: 'My Profile',   requiresAuth: true } },
    { path: '/ChangePassword',  name: 'changePassword', component: ChangePassword, meta: { title: 'Change Password', requiresAuth: true } },
    { path: '/wishlist',         name: 'wishlist',       component: Wishlist,       meta: { title: 'My Wishlist',  requiresAuth: true } },
    { path: '/my-bookings',      name: 'myBookings',     component: MyBookings,     meta: { title: 'My Bookings',  requiresAuth: true } },
    { path: '/my-rented',        name: 'myRented',       component: MyRented,       meta: { title: 'My Rented',    requiresAuth: true } },
    { path: '/info',             name: 'information',    component: InformationPage, meta: { title: 'Information', requiresAuth: true } },

    // --- 404 Not Found ---
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Page Not Found', hideNavbar: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} | Room Rental` : 'Room Rental App'
  const authStore = useAuthStore()
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    return next({ name: 'login' })
  }

  if ((to.name === 'login' || to.name === 'register') && token) {
    return next({ name: 'home' })
  }

  next()
})

export default router
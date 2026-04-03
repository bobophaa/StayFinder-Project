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
 
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // --- Public Routes ---
    { path: '/', name: 'home', component: HomePage },
    { path: '/rooms', name: 'allRooms', component: AllRooms },
    { path: '/rooms/:id', name: 'roomDetails', component: RoomDetails },
    { path: '/faq', name: 'faq', component: FAQView },


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
      path: '/faq',
      name: 'faq',

      component: FAQView,
    },

    // Provider Routes

    // System
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: LoginView },
  ],
})

// --- Global Guard ---
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const token = localStorage.getItem('token')

  // Protected route
  if (to.meta.requiresAuth && !token) {
    return next({ name: 'login' }) // redirect to login if not logged in
  }

  // Optional: redirect logged-in user away from login/register
  if ((to.name === 'login' || to.name === 'register') && token) {
    return next({ name: 'home' })
  }

  next()
})

export default router;

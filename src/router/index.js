import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth"; 

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // --- Public Routes ---
        { path: '/', name: 'home', component: () => import('@/views/User/AllRooms.vue') },
        { path: '/room-details/:id', name: 'roomDetails', component: () => import('@/views/User/RoomDetails.vue') },
        
        // --- Auth Routes ---
        { path: '/login', name: 'login', component: () => import('@/views/Auth/LoginView.vue') },
        { path: '/register', name: 'register', component: () => import('@/views/Auth/RegisterView.vue') },
        { path: '/forgot-password', name: 'forgotPassword', component: () => import('@/views/Auth/ForgotPasswordView.vue') },
        { path: '/verify-otp', name: 'verifyOtp', component: () => import('@/views/Auth/VerifyOTPView.vue') },
        { path: '/reset-password', name: 'resetPassword', component: () => import('@/views/Auth/ResetPasswordView.vue') },

        // --- User Protected Routes (Need to Login) ---
        { path: '/profile', name: 'profile', component: () => import('@/views/User/ProfileInfo.vue'), meta: { require: true } },
        { path: '/changepw', name: 'changepw', component: () => import('@/views/User/ChangePassword.vue'), meta: { require: true } },
        { path: '/wishlist', name: 'wishlist', component: () => import('@/views/User/Wishlist.vue'), meta: { require: true } },
        { path: '/my-bookings', name: 'myBookings', component: () => import('@/views/User/MyBookings.vue'), meta: { require: true } },
        { path: '/my-rented', name: 'myRented', component: () => import('@/views/User/MyRented.vue'), meta: { require: true } },

        // --- Provider Routes  ---
        { path: '/provider/dashboard', name: 'providerDashboard', component: () => import('@/views/Provider/ProviderDashboard.vue'), meta: { require: true } },
        { path: '/provider/my-rooms', name: 'myRooms', component: () => import('@/views/Provider/MyRoomsView.vue'), meta: { require: true } },
        { path: '/provider/add-room', name: 'addRoom', component: () => import('@/views/Provider/AddRoom.vue'), meta: { require: true } },
        { path: '/provider/manage-rooms', name: 'manageRooms', component: () => import('@/views/Provider/ManageRooms.vue'), meta: { require: true } },
        { path: '/provider/booking-requests', name: 'bookingRequests', component: () => import('@/views/Provider/BookingRequests.vue'), meta: { require: true } },
        { path: '/provider/rent-management', name: 'rentManagement', component: () => import('@/views/Provider/RentManagementView.vue'), meta: { require: true } },

        // --- Admin Routes  ---
        { path: '/admin/dashboard', name: 'adminDashboard', component: () => import('@/views/Admin/AdminDashboard.vue'), meta: { require: true } },
        { path: '/admin/districts', name: 'districtManagement', component: () => import('@/views/Admin/DistrictManagement.vue'), meta: { require: true } },
        { path: '/admin/room-options', name: 'roomOptionManagement', component: () => import('@/views/Admin/RoomOptionManagement.vue'), meta: { require: true } },

        // --- UI/System Routes ---
        { path: '/components/table', name: 'baseTable', component: () => import('@/components/ui/BaseTable.vue') },
        { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/Auth/LoginView.vue') } 
    ],
});

router.beforeEach((to) => {
  const token = localStorage.getItem('token');
  
  if (to.meta.require && !token) {
    return { name: 'login' };
  }
});

export default router;
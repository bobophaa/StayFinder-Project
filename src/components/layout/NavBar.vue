<template>
  <nav
    class="navbar navbar-expand-lg fixed-top transition-all"
    :class="{
      'bg-navy shadow-sm py-2': isScrolled || !isHeroPage,
      'bg-transparent py-4': !isScrolled && isHeroPage,
    }"
  >
    <div class="container">
      <router-link class="navbar-brand d-flex align-items-center" :to="{ name: 'home' }">
        <img src="@/assets/images/image.png" alt="Logo" height="60" class="me-3" />
      </router-link>

      <button
        class="navbar-toggler border-white"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav mx-auto">
          <li class="nav-item">
            <router-link class="nav-link text-white px-3" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white px-3" to="/rooms">Explore Rooms</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white px-3" to="/about">About Us</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-white px-3" to="/faq">FAQ</router-link>
          </li>
        </ul>

        <div class="d-flex align-items-center gap-3">
          <template v-if="!authStore.isLoggedIn">
            <router-link to="/login" class="btn-outline-main border-0">Log In</router-link>
            <router-link to="/register" class="btn-main">Register</router-link>
          </template>

          <template v-else>
<router-link to="/wishlist" class="icon-circle shadow-sm mx-2">
  <i class="bi bi-heart-fill"></i>
  <span v-if="wishlistStore.items.length > 0" class="wishlist-badge">
    {{ wishlistStore.items.length }}
  </span>
</router-link>
            <router-link to="/profile" class="profile-circle shadow-sm">
              <img :src="authStore.user?.image || 'https://i.pinimg.com/736x/1d/ec/e2/1dece2c8357bdd7cee3b15036344faf5.jpg'" alt="User" />
            </router-link>

            <router-link to="/info" class="btn-main px-3">
           List Your Property
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useWishlistStore } from '@/stores/WishlistStore';
const wishlistStore = useWishlistStore();
const route = useRoute()
const authStore = useAuthStore()
const isScrolled = ref(false)

const isHeroPage = computed(() => route.name === 'home' || route.path === '/')

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.transition-all {
  transition: all 0.4s ease-in-out;
}
.navbar {
  z-index: 1000;
}

.profile-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f8f9fa;
  border: 2px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
} .icon-circle {
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  color: red; 
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: 0.3s;
}

.wishlist-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background-color: #ff4d4d; 
  color: white;
  font-size: 10px;
  font-weight: bold;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--bs-main); 
}
</style>

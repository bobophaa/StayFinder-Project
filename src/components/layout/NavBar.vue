<template>
  <nav
    class="navbar navbar-expand-lg fixed-top transition-all"
    :class="{
      'bg-navy shadow-sm py-2': isScrolled || !isHeroPage,
      'bg-transparent py-4': !isScrolled && isHeroPage,
    }"
  >
    <div class="container">
      <!-- Logo -->
      <router-link class="navbar-brand d-flex align-items-center" to="/">
        <img src="@/assets/images/image.png" height="60" class="me-2" />
      </router-link>

      <!-- Mobile Toggle -->
      <button
        class="navbar-toggler border-white"
        type="button"
        @click="navOpen = !navOpen"
        :aria-expanded="navOpen"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Menu -->
      <div
        class="navbar-collapse"
        :class="navOpen ? 'd-block' : 'd-none d-lg-flex'"
        id="navbarNav"
      >
        <ul class="navbar-nav mx-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link px-3" active-class="active-link">ទំព័រដើម</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/rooms" class="nav-link px-3" active-class="active-link"
              >ស្វែងរកបបន្ទប់</router-link
            >
          </li>
          <li class="nav-item">
            <router-link to="/About" class="nav-link px-3" active-class="active-link"
              >អំពីពួកយើង</router-link
            >
          </li>
          <li class="nav-item">
            <router-link to="/faq" class="nav-link px-3" active-class="active-link"
              >សំណួរដែលសួរញឹកញាប់</router-link
            >
          </li>
        </ul>

        <div class="d-flex align-items-center gap-3 flex-wrap mt-2 mt-lg-0">
          <!-- Not logged in -->
          <template v-if="!authStore.isLoggedIn">
            <router-link to="/login" class="btn-outline-main text-white text-decoration-none">
              ចូលគណនី
            </router-link>
            <router-link to="/register" class="btn-main text-decoration-none">
              ចុះឈ្មោះ
            </router-link>
          </template>

          <!-- Logged in -->
          <template v-else>
            <router-link to="/wishlist" class="icon-circle shadow-sm" @click="navOpen = false">
              <i class="bi bi-heart-fill"></i>
              <span v-if="wishlistStore.items?.length" class="wishlist-badge">
                {{ wishlistStore.items.length }}
              </span>
            </router-link>

            <router-link to="/profile" class="profile-circle shadow-sm" @click="navOpen = false">
              <img
                v-if="authStore.user"
                :src="avatarUrl"
                :key="authStore.user.avatar"
                alt="avatar"
                @error="onAvatarError"
              />
            </router-link>

            <router-link to="/info" class="btn-main px-3" @click="navOpen = false">
              ក្លាយជាម្ចាស់ផ្ទះជួល
            </router-link>

            <button @click="handleLogout" class="logout-btn" title="Log out">
              <i class="bi bi-box-arrow-right"></i>
            </button>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useWishlistStore } from '@/stores/WishlistStore'
import { alertSuccess, confirmDelete } from '@/Utils/alert'

const authStore = useAuthStore()
const wishlistStore = useWishlistStore()
const route = useRoute()
const router = useRouter()

const isScrolled = ref(false)
const navOpen = ref(false)
const defaultAvatar = 'https://i.pinimg.com/736x/1d/ec/e2/1dece2c8357bdd7cee3b15036344faf5.jpg'

const isHeroPage = computed(() => route.name === 'home' || route.path === '/')

const avatarUrl = computed(() => {
  if (!authStore.user?.avatar) return defaultAvatar
  const url = authStore.user.avatar.startsWith('http')
    ? authStore.user.avatar
    : `http://127.0.0.1:8000/${authStore.user.avatar}`
  return url + '?t=' + Date.now()
})

const onAvatarError = (e: Event) => {
  ;(e.target as HTMLImageElement).src = defaultAvatar
}

// Close nav on route change
watch(() => route.path, () => {
  navOpen.value = false
})

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const handleLogout = async () => {
  const confirmed = await confirmDelete('Log out?')
  if (confirmed) {
    navOpen.value = false
    await authStore.logout()
    alertSuccess('ការចាកចេញជោគជ័យ!')
    router.push('/login')
  }
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.transition-all {
  transition: all 0.4s ease-in-out;
}
.navbar {
  z-index: 10000;
}
.bg-navy {
  background-color: #031c36 !important;
}

.btn-main {
  background-color: #ff5f00;
  color: white;
  border-radius: 10px;
  padding: 8px 18px;
  font-weight: 600;
  transition: 0.3s;
}
.btn-main:hover {
  background-color: #e65600;
  transform: translateY(-2px);
  color: white;
}

.btn-outline-main {
  border: 1px solid transparent;
  padding: 6px 10px;
  transition: 0.3s;
}
.btn-outline-main:hover {
  color: #ff5f00 !important;
}

.profile-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #fff;
  display: block;
  flex-shrink: 0;
}
.profile-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.icon-circle {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff4d4d;
  position: relative;
  transition: 0.2s;
}
.icon-circle:hover {
  transform: scale(1.1);
  background-color: rgba(255, 255, 255, 0.25);
}

.wishlist-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: red;
  color: white;
  font-size: 9px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.logout-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 20px;
  transition: 0.3s;
  cursor: pointer;
}
.logout-btn:hover {
  color: #ff5f00;
  transform: scale(1.1);
}

.nav-link {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  transition: 0.3s;
}
.nav-link:hover {
  color: #ff5f00;
}

.active-link {
  color: #ff5f00 !important;
  font-weight: 700;
  position: relative;
}
.active-link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 3px;
  background: #ff5f00;
  border-radius: 10px;
}
</style>
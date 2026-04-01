<template>
  <div class="profile-wrapper">
    <!-- Banner -->
    <div class="profile-banner">
      <div class="glow glow-1"></div>
      <div class="glow glow-2"></div>
      <div class="banner-overlay"></div>
    </div>

    <div class="container content-container">
      <!-- HEADER -->
      <header class="profile-card header-card animate-slide-up">
        <div class="profile-main-info">

          <!-- Avatar -->
          <div class="avatar-section">
            <div class="avatar-squircle">
              <img
                :src="user.avatar || defaultAvatar"
                class="avatar-img"
                alt="User"
                @error="onImageError"
              />

              <label for="imageUpload" class="camera-btn">
                <i v-if="uploading" class="spinner-border spinner-border-sm"></i>
                <i v-else class="bi bi-camera-fill"></i>
                <input
                  type="file"
                  id="imageUpload"
                  hidden
                  accept="image/*"
                  @change="handleImageUpload"
                />
              </label>
            </div>
          </div>

          <!-- User Info -->
          <div class="user-details">
            <div class="identity-row">
              <h1 class="display-name">
                {{ user.name || 'Loading...' }}
              </h1>
              <div v-if="user.name" class="verified-badge">
                <i class="bi bi-patch-check-fill"></i>
              </div>
            </div>

            <p class="job-tag">
              <i class="bi bi-briefcase"></i>
              {{ user.current_job || 'Professional' }}
            </p>

            <div class="stats-group">
              <div class="stat">
                <span class="count">1.2k</span>
                <span class="label">Followers</span>
              </div>
              <div class="stat-sep"></div>
              <div class="stat">
                <span class="count">455</span>
                <span class="label">Following</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <nav class="custom-tabs">
          <router-link to="/profile" class="tab-item" exact-active-class="active-tab">Profile</router-link>
          <router-link to="/my-bookings" class="tab-item" exact-active-class="active-tab">Bookings</router-link>
          <router-link to="/my-rented" class="tab-item" exact-active-class="active-tab">Room Rent</router-link>
          <router-link to="/wishlist" class="tab-item" exact-active-class="active-tab">Wishlist</router-link>
          <router-link to="/changepw" class="tab-item" exact-active-class="active-tab">Security</router-link>
        </nav>
      </header>

      <!-- CONTENT -->
      <main class="profile-card content-card animate-slide-up-delay">
        <router-view v-slot="{ Component }">
          <transition name="fade-slide" mode="out-in">
            <component
              :is="Component"
              :user="user"
              @refresh="fetchUser"
            />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'

const user = reactive({
  name: '',
  current_job: '',
  avatar: '',
  email: '',
  phone: ''
})

const uploading = ref(false)

const defaultAvatar =
  'https://ui-avatars.com/api/?name=User&background=FF5F00&color=fff'

// Fetch user
const fetchUser = async () => {
  try {
    const res = await axios.get('/api/me')
    const data = res?.data?.data || res?.data

    if (!data) return

    user.name = data.name ?? ''
    user.current_job = data.current_job ?? ''
    user.avatar = data.avatar ?? ''
    user.email = data.email ?? ''
    user.phone = data.phone ?? ''
  } catch (err) {
    console.error('Fetch Error:', err)
  }
}

// Upload image
const handleImageUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  const fd = new FormData()
  fd.append('image', file)

  uploading.value = true

  try {
    const res = await axios.post('/api/profile/image', fd, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    const newPath = res?.data?.avatar || res?.data?.path

    if (newPath) {
      // force reload image (avoid cache)
      user.avatar = newPath + '?t=' + Date.now()
    }

    await fetchUser()
  } catch (err) {
    console.error(err)
    alert('Upload failed')
  } finally {
    uploading.value = false
    e.target.value = ''
  }
}

// fallback image
const onImageError = (e) => {
  e.target.src = defaultAvatar
}

onMounted(fetchUser)
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css");
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap');

.profile-wrapper {
  background-color: #f8fafc;
  min-height: 100vh;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.profile-banner {
  height: 260px;
  background: #ffffff;
  position: relative;
  overflow: hidden;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.4));
}

.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
}

.glow-1 {
  width: 400px;
  height: 400px;
  background: rgba(255, 95, 0, 0.12);
  top: -150px;
  left: -100px;
}

.glow-2 {
  width: 350px;
  height: 350px;
  background: rgba(0, 149, 255, 0.08);
  bottom: -100px;
  right: 5%;
}

.content-container {
  margin-top: -100px;
  max-width: 1000px;
  padding: 0 20px;
  position: relative;
  z-index: 10;
}

.profile-card {
  background: #ffffff;
  border-radius: 32px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  padding: 40px;
}

.header-card {
  padding-bottom: 0;
}

.profile-main-info {
  display: flex;
  gap: 30px;
  align-items: center;
}

.avatar-squircle {
  width: 140px;
  height: 140px;
  border-radius: 40px;
  background: #fff;
  padding: 6px;
  box-shadow: 0 12px 24px rgba(255, 95, 0, 0.15);
  position: relative;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 34px;
}

.camera-btn {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background: #ff5f00;
  color: white;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #fff;
  cursor: pointer;
}

.identity-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.display-name {
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.verified-badge {
  color: #0ea5e9;
  font-size: 24px;
}

.job-tag {
  color: #64748b;
  margin: 10px 0;
}

.stats-group {
  display: flex;
  gap: 20px;
  margin-top: 15px;
}

.stat-sep {
  width: 1px;
  background: #e2e8f0;
}

.custom-tabs {
  display: flex;
  gap: 30px;
  margin-top: 35px;
  border-top: 1px solid #f1f5f9;
}

.tab-item {
  text-decoration: none;
  padding: 20px 0;
  font-weight: 700;
  color: #94a3b8;
  position: relative;
}

.active-tab {
  color: #ff5f00;
}

.active-tab::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 4px;
  background: #ff5f00;
  border-radius: 10px 10px 0 0;
}

/* animation */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slideUp 0.6s ease forwards;
}

.animate-slide-up-delay {
  animation: slideUp 0.8s ease backwards;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
<template>
  <div class="profile-page">
    <div v-if="!user" class="text-center mt-5 pt-5">
      <div class="spinner-border text-orange"></div>
      <p class="mt-2 text-muted">Loading profile...</p>
    </div>

    <div v-else>
      <div class="header-banner"></div>

      <div class="container">
        <div class="profile-card shadow-sm">
          <div class="profile-main-content d-flex align-items-center">

            <div class="avatar-wrapper position-relative" v-click-outside="closeMenu">
              <div class="avatar-box">
                <img v-if="avatarPreview || user.avatar" :src="avatarPreview || user.avatar" alt="Profile" />
                <span v-else>{{ user.name?.charAt(0) || 'U' }}</span>
              </div>

              <div class="avatar-overlay d-flex align-items-center justify-content-center" @click="toggleMenu">
                <i class="bi bi-camera-fill text-white fs-4"></i>
              </div>

              <div v-if="showActionsMenu" class="avatar-actions-menu shadow-lg">
                <button class="menu-item" @click="triggerUpload">
                  <i class="bi bi-cloud-arrow-up me-2"></i> Update image
                </button>
                <button v-if="avatarPreview || user.avatar" class="menu-item text-danger" @click="removeImage">
                  <i class="bi bi-trash3 me-2"></i> Delete image
                </button>
              </div>
            </div>

            <input ref="fileInput" type="file" hidden accept="image/*" @change="handleFileUpload" />

            <div class="ms-4">
              <h3 class="fw-bold mb-0 d-flex align-items-center">
                {{ user.name }}
                <i class="bi bi-patch-check-fill text-primary ms-2 fs-4"></i>
              </h3>
            </div>
          </div>

          <div class="tabs-container mt-4">
            <router-link v-for="tab in tabLinks" :key="tab.path" :to="tab.path" class="tab-link" active-class="active">
              {{ tab.name }}
            </router-link>
          </div>
        </div>
      </div>

      <div class="container mt-4 pb-5">
        <div class="form-card shadow-sm">

          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 class="fw-bold mb-0">Profile Information</h5>
              <small class="text-muted">ID: #{{ user.id || '---' }} · Joined N/A</small>
            </div>

            <router-link to="/profile/security" class="btn btn-security rounded-pill px-3">
              <i class="bi bi-shield-lock-fill me-2"></i> Security
            </router-link>
          </div>

          <form @submit.prevent="updateProfile">
            <div class="row g-4">
              <div class="col-md-6">
                <label :class="{ 'text-danger': errors.name }">FULL NAME</label>
                <input v-model="form.name" class="form-control-custom" :class="{ 'is-invalid-custom': errors.name }"
                  placeholder="Enter your full name">
                <div v-if="errors.name" class="error-msg">{{ errors.name }}</div>
              </div>

              <div class="col-md-6">
                <label :class="{ 'text-danger': errors.email }">EMAIL</label>
                <input v-model="form.email" class="form-control-custom" :class="{ 'is-invalid-custom': errors.email }"
                  placeholder="email@example.com">
                <div v-if="errors.email" class="error-msg">{{ errors.email }}</div>
              </div>

              <div class="col-md-6">
                <label :class="{ 'text-danger': errors.phone }">PHONE</label>
                <input v-model="form.phone" class="form-control-custom" :class="{ 'is-invalid-custom': errors.phone }"
                  placeholder="Phone number">
                <div v-if="errors.phone" class="error-msg">{{ errors.phone }}</div>
              </div>

              <div class="col-md-6">
                <label>GENDER</label>
                <select v-model="form.gender" class="form-control-custom">
                  <option :value="1">Male</option>
                  <option :value="2">Female</option>
                </select>
              </div>

              <div class="col-12">
                <label>CURRENT JOB</label>
                <input v-model="form.current_job" class="form-control-custom" placeholder="e.g. Software Engineer">
              </div>
            </div>

            <button class="btn-save mt-4" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/api/http'

// --- STATE ---
const user = ref(null)
const loading = ref(false)
const fileInput = ref(null)
const avatarPreview = ref(null)
const showActionsMenu = ref(false)

const tabLinks = [
  { name: 'Profile Information', path: '/profile' },
  { name: 'Bookings', path: '/profile/bookings' },
  { name: 'Checklist', path: '/profile/checklist' },
  { name: 'Rented Rooms', path: '/profile/rented-rooms' },
  { name: 'Rent Checklist', path: '/profile/rent-checklist' }
]

const form = reactive({
  name: '',
  email: '',
  phone: '',
  gender: 1,
  current_job: ''
})

const errors = reactive({
  name: '',
  email: '',
  phone: ''
})

// --- VALIDATION LOGIC ---
const validateForm = () => {
  let isValid = true
  errors.name = ''
  errors.email = ''
  errors.phone = ''

  if (!form.name || form.name.trim() === '') {
    errors.name = 'Full name is required'
    isValid = false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email) {
    errors.email = 'Email address is required'
    isValid = false
  } else if (!emailRegex.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  const phoneRegex = /^[0-9]{8,15}$/
  if (form.phone && !phoneRegex.test(form.phone)) {
    errors.phone = 'Phone must be between 8 and 15 digits'
    isValid = false
  }

  return isValid
}

// --- API ACTIONS ---
const fetchUserData = async () => {
  try {
    const res = await api.get('/me')
    user.value = res.data.data
    Object.assign(form, user.value)
  } catch (err) {
    console.error("Fetch error:", err)
  }
}

const updateProfile = async () => {
  if (!validateForm()) return 

  loading.value = true
  try {
    await api.post('/profile/info', form)
    Object.assign(user.value, form)
    alert('Profile updated successfully!')
  } catch (err) {
    alert('Update failed. Please check your connection.')
  } finally {
    loading.value = false
  }
}

// --- IMAGE HANDLERS ---
const toggleMenu = () => (showActionsMenu.value = !showActionsMenu.value)
const closeMenu = () => (showActionsMenu.value = false)
const triggerUpload = () => {
  fileInput.value.click()
  closeMenu()
}

const handleFileUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  avatarPreview.value = URL.createObjectURL(file)
  const fd = new FormData()
  fd.append('image', file)

  try {
    await api.post('/profile/image', fd)
    await fetchUserData()
  } catch (err) {
    alert("Image upload failed")
  }
}

const removeImage = async () => {
  if (!confirm('Delete profile picture?')) return
  try {
    await api.delete('/profile/image')
    avatarPreview.value = null
    user.value.avatar = null
    closeMenu()
  } catch (err) {
    alert("Delete failed")
  }
}

// --- DIRECTIVE: Click Outside ---
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

onMounted(fetchUserData)
</script>

<style scoped>
.profile-page {
  background: #f9fafb;
  min-height: 100vh;
}

.header-banner {
  height: 140px;
  background: linear-gradient(to bottom, #ffebd9 0%, #ffffff 100%);
}

.profile-card {
  background: white;
  border-radius: 24px;
  padding: 0 30px;
  margin-top: -50px;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

/* AVATAR HOVER STYLE */
.avatar-wrapper {
  margin-top: -55px;
  width: 115px;
  z-index: 5;
}

.avatar-box {
  width: 115px;
  height: 115px;
  background: #ff5f00;
  border-radius: 50%;
  border: 5px solid white;
  color: white;
  font-size: 45px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.avatar-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  top: 5px;
  left: 5px;
  width: 105px;
  height: 105px;
  background: rgba(0, 0, 0, 0.45);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
}

.avatar-wrapper:hover .avatar-overlay {
  opacity: 1;
}

.avatar-actions-menu {
  position: absolute;
  top: 115%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 12px;
  width: 190px;
  padding: 8px 0;
  z-index: 20;
  border: 1px solid #eee;
}

.menu-item {
  width: 100%;
  text-align: left;
  border: none;
  background: none;
  padding: 10px 18px;
  font-size: 14px;
}

.menu-item:hover {
  background-color: #f8f9fa;
}

/* TABS */
.tabs-container {
  display: flex;
  gap: 25px;
  border-top: 1px solid #f1f1f1;
  overflow-x: auto;
}

.tab-link {
  text-decoration: none;
  padding: 18px 0;
  font-weight: 600;
  color: #888;
  white-space: nowrap;
  position: relative;
}

.tab-link.active {
  color: #ff5f00;
}

.tab-link.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: #ff5f00;
  border-radius: 10px 10px 0 0;
}

/* FORM STYLING */
.form-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
}

.btn-security {
  background-color: #f8f9fa;
  border: 1px solid #eee;
  color: #555;
  font-weight: 600;
  text-decoration: none;
}

.btn-security:hover {
  border-color: #ff5f00;
  color: #ff5f00;
}

label {
  font-size: 11px;
  font-weight: 800;
  color: #bbb;
  text-transform: uppercase;
  display: block;
  margin-bottom: 8px;
}

.form-control-custom {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #eef0f2;
  background-color: #fafafa;
  transition: 0.2s;
}

.form-control-custom:focus {
  outline: none;
  border-color: #ff5f00;
  background-color: #fff;
}

/* VALIDATION UI */
.is-invalid-custom {
  border-color: #dc3545 !important;
  background-color: #fff8f8 !important;
}

.error-msg {
  color: #dc3545;
  font-size: 12px;
  font-weight: 500;
  margin-top: 5px;
}

.btn-save {
  background: #ff5f00;
  color: white;
  padding: 12px 35px;
  border-radius: 12px;
  border: none;
  font-weight: 700;
}

.btn-save:hover:not(:disabled) {
  background: #e65600;
  transform: translateY(-1px);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
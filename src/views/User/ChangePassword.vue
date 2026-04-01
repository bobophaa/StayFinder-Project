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

            <div class="ms-4">
              <h3 class="fw-bold mb-0">{{ user.name }}</h3>
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
          <h5 class="fw-bold mb-4">Change Password</h5>
          <p class="text-muted mb-4">Update your password to keep your account secure.</p>

          <form @submit.prevent="updatePassword">
            <div class="row g-4">
              <div class="col-12">
                <label :class="{ 'text-danger': errors.current_password }">Current Password</label>
                <div class="input-password-wrapper">
                  <input :type="show.current_password ? 'text' : 'password'" v-model="form.current_password"
                    class="form-control-custom" :class="{ 'is-invalid-custom': errors.current_password }"
                    placeholder="••••••••" />
                  <i class="bi" :class="show.current_password ? 'bi-eye-slash' : 'bi-eye'"
                    @click="toggleShow('current_password')"></i>
                </div>
                <div v-if="errors.current_password" class="error-msg">{{ errors.current_password }}</div>
              </div>

              <div class="col-md-6">
                <label :class="{ 'text-danger': errors.new_password }">New Password</label>
                <div class="input-password-wrapper">
                  <input :type="show.new_password ? 'text' : 'password'" v-model="form.new_password"
                    class="form-control-custom" :class="{ 'is-invalid-custom': errors.new_password }"
                    placeholder="••••••••" />
                  <i class="bi" :class="show.new_password ? 'bi-eye-slash' : 'bi-eye'"
                    @click="toggleShow('new_password')"></i>
                </div>
                <div v-if="errors.new_password" class="error-msg">{{ errors.new_password }}</div>
              </div>

              <div class="col-md-6">
                <label :class="{ 'text-danger': errors.confirm_password }">Confirm New Password</label>
                <div class="input-password-wrapper">
                  <input :type="show.confirm_password ? 'text' : 'password'" v-model="form.confirm_password"
                    class="form-control-custom" :class="{ 'is-invalid-custom': errors.confirm_password }"
                    placeholder="••••••••" />
                  <i class="bi" :class="show.confirm_password ? 'bi-eye-slash' : 'bi-eye'"
                    @click="toggleShow('confirm_password')"></i>
                </div>
                <div v-if="errors.confirm_password" class="error-msg">{{ errors.confirm_password }}</div>
              </div>
            </div>

            <button class="btn-save mt-4" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="toast.show" class="toast-message" :class="toast.type">{{ toast.message }}</div>
    </transition>

    <input ref="fileInput" type="file" hidden accept="image/*" @change="handleFileUpload" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/api/http'

// --- STATE ---
const user = ref(null)
const loading = ref(false)
const avatarPreview = ref(null)
const showActionsMenu = ref(false)
const fileInput = ref(null)

// --- TABS ---
const tabLinks = [
  { name: 'Profile Information', path: '/profile' },
  { name: 'Bookings', path: '/profile/bookings' },
  { name: 'Checklist', path: '/profile/checklist' },
  { name: 'Rented Rooms', path: '/profile/rented-rooms' },
  { name: 'Rent Checklist', path: '/profile/rent-checklist' },
  { name: 'Security', path: '/ChangePassword' }
]

// --- FORM + VALIDATION ---
const form = reactive({ current_password: '', new_password: '', confirm_password: '' })
const errors = reactive({ current_password: '', new_password: '', confirm_password: '' })
const show = reactive({ current_password: false, new_password: false, confirm_password: false })
const toggleShow = (field) => (show[field] = !show[field])

// --- TOAST ---
const toast = reactive({ show: false, message: '', type: 'success' })
const showToast = (msg, type = 'success') => {
  toast.message = msg
  toast.type = type
  toast.show = true
  setTimeout(() => (toast.show = false), 3000)
}

// --- FETCH USER ---
const fetchUserData = async () => {
  try {
    const res = await api.get('/me')
    user.value = res.data.data
  } catch (err) {
    console.error(err)
  }
}

// --- VALIDATION (FRONTEND) ---
const validateForm = () => {
  let isValid = true
  errors.current_password = errors.new_password = errors.confirm_password = ''

  if (!form.current_password) {
    errors.current_password = 'Current password is required'
    isValid = false
  }
  if (!form.new_password) {
    errors.new_password = 'New password is required'
    isValid = false
  } else if (form.new_password.length < 6) {
    errors.new_password = 'Password must be at least 6 characters'
    isValid = false
  }
  if (!form.confirm_password) {
    errors.confirm_password = 'Please confirm new password'
    isValid = false
  } else if (form.confirm_password !== form.new_password) {
    errors.confirm_password = 'Passwords do not match'
    isValid = false
  }
  return isValid
}

// --- CHANGE PASSWORD (FIXED SECTION) ---
const updatePassword = async () => {
  if (!validateForm()) return
  loading.value = true

  try {
    // ប្តូរ Keys ឱ្យត្រូវជាមួយ Backend (old_pass, new_pass, new_pass_confirmation)
    await api.put('/profile/pass', {
      old_pass: form.current_password,
      new_pass: form.new_password,
      new_pass_confirmation: form.confirm_password
    })

    showToast('Password updated successfully!', 'success')
    // Reset inputs
    form.current_password = form.new_password = form.confirm_password = ''
    errors.current_password = errors.new_password = errors.confirm_password = ''
  } catch (err) {
    // ចាប់ error ពី Backend មកដាក់ចូល Reactive errors វិញឱ្យត្រូវ field
    const backendErrors = err.response?.data?.errors || {}
    errors.current_password = backendErrors.old_pass?.[0] || ''
    errors.new_password = backendErrors.new_pass?.[0] || ''
    errors.confirm_password = backendErrors.new_pass_confirmation?.[0] || ''

    if (err.response?.data?.message) {
      showToast(err.response.data.message, 'error')
    } else if (!backendErrors.old_pass && !backendErrors.new_pass && !backendErrors.new_pass_confirmation) {
      showToast('Failed to change password', 'error')
    }
  } finally {
    loading.value = false
  }
}

// --- AVATAR HANDLERS ---
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
    showToast('Profile image updated!', 'success')
    await fetchUserData()
  } catch {
    showToast('Image upload failed', 'error')
  }
}
const removeImage = async () => {
  if (!confirm('Delete profile picture?')) return
  try {
    await api.delete('/profile/image')
    avatarPreview.value = null
    user.value.avatar = null
    showToast('Profile image deleted', 'success')
    closeMenu()
  } catch {
    showToast('Delete failed', 'error')
  }
}

// --- CLICK OUTSIDE DIRECTIVE ---
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) binding.value()
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

.form-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
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

label {
  font-size: 11px;
  font-weight: 800;
  color: #bbb;
  text-transform: uppercase;
  display: block;
  margin-bottom: 8px;
}

.input-password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-password-wrapper input {
  width: 100%;
  padding-right: 40px;
}

.input-password-wrapper i {
  position: absolute;
  right: 12px;
  cursor: pointer;
  font-size: 16px;
  color: #888;
}

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

.toast-message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  z-index: 9999;
}

.toast-message.success {
  background-color: #28a745;
}

.toast-message.error {
  background-color: #dc3545;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
<template>
  <div class="profile-page">
    <!-- LOADING -->
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

                <div v-if="loading && uploadingAvatar" class="avatar-loading">
                  <div class="spinner-border text-white"></div>
                </div>
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

          <!-- TABS -->
          <div class="tabs-container mt-4">
            <router-link v-for="tab in tabLinks" :key="tab.path" :to="tab.path" class="tab-link" active-class="active">
              {{ tab.name }}
            </router-link>
          </div>
        </div>
      </div>

      <!-- PROFILE FORM -->
      <div class="container mt-4 pb-5">
        <div class="form-card shadow-sm">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 class="fw-bold mb-0">Profile Information</h5>
              <small class="text-muted">ID: {{ user.id || '---' }}</small>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-save" v-if="!isEditing" @click="enableEdit">Update Information</button>
              <router-link v-if="isEditing" to="/ChangePassword" class="btn btn-security rounded-pill px-3">
                <i class="bi bi-shield-lock-fill me-2"></i> Security
              </router-link>
            </div>
          </div>

          <form @submit.prevent="updateProfile">
            <div class="row g-4">
              <div class="col-md-6">
                <label :class="{ 'text-danger': errors.name }">FULL NAME</label>
                <input v-model="form.name" class="form-control-custom" :class="{ 'is-invalid-custom': errors.name }"
                  placeholder="Enter your full name" :readonly="!isEditing" />
                <div v-if="errors.name" class="error-msg">{{ errors.name }}</div>
              </div>

              <div class="col-md-6">
                <label :class="{ 'text-danger': errors.email }">EMAIL</label>
                <input v-model="form.email" class="form-control-custom" :class="{ 'is-invalid-custom': errors.email }"
                  placeholder="email@example.com" :readonly="!isEditing" />
                <div v-if="errors.email" class="error-msg">{{ errors.email }}</div>
              </div>

              <div class="col-md-6">
                <label :class="{ 'text-danger': errors.phone }">PHONE</label>
                <input v-model="form.phone" class="form-control-custom" :class="{ 'is-invalid-custom': errors.phone }"
                  placeholder="Phone number" :readonly="!isEditing" />
                <div v-if="errors.phone" class="error-msg">{{ errors.phone }}</div>
              </div>

              <div class="col-md-6">
                <label>GENDER</label>
                <select v-model="form.gender" class="form-control-custom" :disabled="!isEditing">
                  <option :value="1">Male</option>
                  <option :value="2">Female</option>
                </select>
              </div>

              <div class="col-12">
                <label>CURRENT JOB</label>
                <input v-model="form.current_job" class="form-control-custom" placeholder="e.g. Web Developer"
                  :readonly="!isEditing" />
              </div>
            </div>

            <button v-if="isEditing" class="btn-save mt-4" :disabled="loading" type="submit">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- CONFIRM MODAL -->
    <div v-if="showConfirmModal" class="modal-backdrop">
      <div class="modal-card shadow-lg">
        <h5 class="fw-bold mb-3">Confirm Update</h5>
        <p>Are you sure you want to update your profile information?</p>
        <div class="d-flex justify-content-end gap-2 mt-4">
          <button class="btn btn-secondary" @click="showConfirmModal = false">Cancel</button>
          <button class="btn btn-primary" @click="confirmUpdateProfile" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            Update
          </button>
        </div>
      </div>
    </div>

    <!-- TOAST -->
    <transition name="fade">
      <div v-if="toast.show" class="toast-message" :class="toast.type">{{ toast.message }}</div>
    </transition>
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
const showConfirmModal = ref(false)
const isEditing = ref(false)

// --- FORM DATA ---
const form = reactive({
  name: '',
  email: '',
  phone: '',
  gender: 1,
  current_job: ''
})
const errors = reactive({ name: '', email: '', phone: '' })

// --- TABS ---
const tabLinks = [
  { name: 'Profile Information', path: '/profile' },
  { name: 'Bookings', path: '/my-bookings' },
  { name: 'Checklist', path: '/profile/checklist' },
  { name: 'Rented Rooms', path: '/profile/rented-rooms' },
  { name: 'Rent Checklist', path: '/profile/rent-checklist' }
]

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
    Object.assign(form, {
      name: user.value.name || '',
      email: user.value.email || '',
      phone: user.value.phone || '',
      gender: user.value.gender || 1,
      current_job: user.value.current_job || ''
    })
  } catch (err) {
    console.error("Fetch user error:", err)
  }
}

// --- VALIDATION ---
const validateForm = () => {
  let isValid = true
  errors.name = errors.email = errors.phone = ''
  if (!form.name?.trim()) { errors.name = 'Full name is required'; isValid = false }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email) { errors.email = 'Email required'; isValid = false }
  else if (!emailRegex.test(form.email)) { errors.email = 'Invalid email'; isValid = false }
  return isValid
}

// --- PROFILE UPDATE ---
const enableEdit = () => { isEditing.value = true }
const updateProfile = () => { if (!validateForm()) return; showConfirmModal.value = true }
const confirmUpdateProfile = async () => {
  showConfirmModal.value = false
  loading.value = true
  try {
    await api.post('/profile/info', form)
    Object.assign(user.value, form)
    showToast('Profile updated successfully!', 'success')
    isEditing.value = false
  } catch (err) {
    showToast(err.response?.data?.message || 'Update failed', 'error')
  } finally { loading.value = false }
}

const toggleMenu = () => (showActionsMenu.value = !showActionsMenu.value)
const closeMenu = () => (showActionsMenu.value = false)
const triggerUpload = () => { fileInput.value.click(); closeMenu() }
const uploadingAvatar = ref(false)

const handleFileUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) { showToast('File is too large (Max 2MB)', 'error'); return }

  avatarPreview.value = URL.createObjectURL(file)
  const fd = new FormData(); fd.append('image', file)

  loading.value = true
  uploadingAvatar.value = true
  try {
    await api.post('/profile/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    await fetchUserData()
    avatarPreview.value = null
    showToast('Profile image updated successfully!', 'success')
  } catch (err) {
    avatarPreview.value = null
    showToast(err.response?.data?.message || 'Image upload failed', 'error')
  } finally {
    loading.value = false
    uploadingAvatar.value = false
    e.target.value = ''
  }
}

const removeImage = async () => {
  if (!confirm('Are you sure you want to delete your profile picture?')) return
  loading.value = true
  try {
    await api.delete('/profile/image')
    user.value.avatar = null
    avatarPreview.value = null
    showToast('Profile image deleted successfully!', 'success')
    closeMenu()
  } catch (err) {
    showToast(err.response?.data?.message || 'Delete failed', 'error')
  } finally { loading.value = false }
}

const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => { if (!(el === event.target || el.contains(event.target))) binding.value() }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) { document.removeEventListener('click', el.clickOutsideEvent) }
}

onMounted(fetchUserData)
</script>

<style scoped>
.profile-page {
  background: #f9fafb;
  min-height: 100vh;
}

.avatar-loading {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
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
  border: 1px solid rgba(0, 0, 0, 0.03);
}

/* ===== AVATAR ===== */
.avatar-wrapper {
  margin-top: -55px;
  width: 115px;
  z-index: 5;
  position: relative;
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
  transition: opacity 0.3s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
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
  cursor: pointer;
}

.menu-item:hover {
  background-color: #f8f9fa;
}

/* ===== TABS ===== */
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

/* ===== FORM ===== */
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
  margin-bottom: 8px;
  display: block;
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

/* ===== BUTTONS ===== */
.btn-save {
  background: #ff5f00;
  color: white;
  padding: 12px 35px;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  transition: all 0.25s ease;
  cursor: pointer;
}

.btn-save:hover:not(:disabled) {
  background: #e65600;
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 10px 20px rgba(255, 95, 0, 0.3);
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-security {
  background: #f8f9fa;
  border: 1px solid #eee;
  color: #555;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.25s ease;
}

.btn-security:hover {
  background: #ff5f00;
  color: #fff;
  border-color: #ff5f00;
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(255, 95, 0, 0.25);
}

.btn-secondary:hover {
  background-color: #6c757d;
  color: #fff;
  transform: translateY(-1px);
}

/* ===== MODAL ===== */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-card {
  background: white;
  border-radius: 16px;
  padding: 25px 30px;
  max-width: 400px;
  width: 100%;
}

/* ===== TOAST ===== */
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
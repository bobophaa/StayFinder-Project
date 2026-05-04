<template>
  <div class="profile-page">
    <div v-if="!user" class="d-flex flex-column align-items-center justify-content-center" style="min-height:60vh">
      <div class="spinner-border text-orange mb-3" style="width:3rem;height:3rem"></div>
      <p class="text-muted fw-semibold">Loading security settings...</p>
    </div>

    <div v-else>
      <div class="hero-banner position-relative">
        <div class="container position-relative" style="z-index:2">
          <div class="d-flex align-items-end gap-4 pb-0" style="padding-top:48px">

            <div class="avatar-wrapper" v-click-outside="closeMenu">
              <div class="avatar-ring">
                <div class="avatar-box">
                  <img v-if="avatarPreview || user.avatar" :src="avatarPreview || user.avatar" alt="avatar" />
                  <span v-else>{{ user.name?.charAt(0)?.toUpperCase() || 'U' }}</span>
                  <div v-if="uploadingAvatar" class="avatar-loading">
                    <div class="spinner-border spinner-border-sm text-white"></div>
                  </div>
                </div>
              </div>
              <div class="avatar-cam" @click.stop="toggleMenu">
                <i class="bi bi-camera-fill"></i>
              </div>

              <transition name="menu-fade">
                <div v-if="showActionsMenu" class="avatar-menu shadow" @click.stop>
                  <button type="button" class="avatar-menu-item" @click="triggerUpload">
                    <i class="bi bi-cloud-arrow-up-fill me-2 text-orange"></i> Upload photo
                  </button>
                  <button type="button" v-if="user.avatar" class="avatar-menu-item text-danger" @click="removeImage">
                    <i class="bi bi-trash3-fill me-2"></i> Remove photo
                  </button>
                </div>
              </transition>
              <input type="file" ref="fileInput" class="d-none" accept="image/*" @change="handleFileUpload" />
            </div>

            <div class="pb-3 text-white">
              <div class="d-flex align-items-center gap-2 mb-1">
                <h3 class="fw-bold mb-0">{{ user.name }}</h3>
                <i class="bi bi-patch-check-fill text-orange fs-5"></i>
              </div>
              <span class="user-role-badge">{{ user.current_job || 'StayFinder Member' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="tab-bar-wrap">
        <div class="container">
          <div class="tab-bar">
            <router-link to="/profile" class="tab-item">
              <i class="bi bi-person-fill me-2"></i>Profile
            </router-link>
            <router-link to="/my-bookings" class="tab-item">
              <i class="bi bi-calendar-check-fill me-2"></i>Bookings
            </router-link>
            <router-link to="/my-rented" class="tab-item">
              <i class="bi bi-house-check-fill me-2"></i>Rented
            </router-link>
            <router-link to="/ChangePassword" class="tab-item tab-active">
              <i class="bi bi-shield-lock-fill me-2"></i>Security
            </router-link>
          </div>
        </div>
      </div>

      <div class="container py-5">
        <div class="row g-4">
          <div class="col-lg-8">
            <div class="form-card">
              <h4 class="text-navy fw-bold mb-4">Change Password</h4>
              <form @submit.prevent="updatePassword" novalidate>
                <div class="row g-4">
                  <div class="col-12">
                    <label class="field-label" :class="{ 'text-danger': errors.current_password }">Current
                      Password</label>
                    <div class="input-wrap" :class="{ 'input-err': errors.current_password }">
                      <i class="bi bi-lock input-icon"></i>
                      <input :type="show.current_password ? 'text' : 'password'" v-model="form.current_password"
                        placeholder="Enter current password" @input="errors.current_password = ''" />
                      <i class="bi cursor-pointer px-3" :class="show.current_password ? 'bi-eye-slash' : 'bi-eye'"
                        @click="toggleShow('current_password')"></i>
                    </div>
                    <div v-if="errors.current_password" class="err-msg">
                      <i class="bi bi-exclamation-circle me-1"></i> {{ errors.current_password }}
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label class="field-label" :class="{ 'text-danger': errors.new_password }">New Password</label>
                    <div class="input-wrap" :class="{ 'input-err': errors.new_password }">
                      <i class="bi bi-shield-lock input-icon"></i>
                      <input :type="show.new_password ? 'text' : 'password'" v-model="form.new_password"
                        placeholder="New password" @input="errors.new_password = ''" />
                      <i class="bi cursor-pointer px-3" :class="show.new_password ? 'bi-eye-slash' : 'bi-eye'"
                        @click="toggleShow('new_password')"></i>
                    </div>
                    <div v-if="errors.new_password" class="err-msg">{{ errors.new_password }}</div>
                  </div>

                  <div class="col-md-6">
                    <label class="field-label" :class="{ 'text-danger': errors.confirm_password }">Confirm
                      Password</label>
                    <div class="input-wrap" :class="{ 'input-err': errors.confirm_password }">
                      <i class="bi bi-shield-check input-icon"></i>
                      <input :type="show.confirm_password ? 'text' : 'password'" v-model="form.confirm_password"
                        placeholder="Confirm password" @input="errors.confirm_password = ''" />
                      <i class="bi cursor-pointer px-3" :class="show.confirm_password ? 'bi-eye-slash' : 'bi-eye'"
                        @click="toggleShow('confirm_password')"></i>
                    </div>
                    <div v-if="errors.confirm_password" class="err-msg">{{ errors.confirm_password }}</div>
                  </div>
                </div>

                <div class="mt-5">
                  <button type="submit" class="btn-save-main" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ loading ? 'Updating...' : 'Save New Password' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="side-card">
              <div class="side-card-header">Security Status</div>
              <div class="side-card-body p-4">
                <div class="d-flex align-items-start gap-3 mb-4">
                  <div class="status-icon success">
                    <i class="bi bi-check2-circle"></i>
                  </div>
                  <div>
                    <h6 class="fw-bold text-navy mb-1">Account Protected</h6>
                    <p class="text-muted small mb-0">Your password protects your room bookings and personal data.</p>
                  </div>
                </div>
                <div class="p-3 rounded-3 bg-light border">
                  <p class="small text-muted mb-0"><i class="bi bi-info-circle me-1"></i> Use at least 8 characters with
                    a mix of letters and numbers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <transition name="slide-toast">
      <div v-if="toast.show" class="toast-pill" :class="toast.type">
        <i class="bi me-2" :class="toast.type === 'success' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/api/http'

const user = ref(null)
const loading = ref(false)
const uploadingAvatar = ref(false)
const fileInput = ref(null)
const avatarPreview = ref(null)
const showActionsMenu = ref(false)

const form = reactive({ current_password: '', new_password: '', confirm_password: '' })
const errors = reactive({ current_password: '', new_password: '', confirm_password: '' })
const show = reactive({ current_password: false, new_password: false, confirm_password: false })
const toast = reactive({ show: false, message: '', type: 'success' })

const toggleShow = (field) => (show[field] = !show[field])
const closeMenu = () => (showActionsMenu.value = false)
const toggleMenu = () => (showActionsMenu.value = !showActionsMenu.value)

const showToast = (msg, type = 'success') => {
  toast.message = msg; toast.type = type; toast.show = true
  setTimeout(() => (toast.show = false), 3200)
}

const fetchUserData = async () => {
  try {
    const res = await api.get('/me')
    user.value = res.data.data
  } catch (err) { console.error(err) }
}

const updatePassword = async () => {
  errors.current_password = errors.new_password = errors.confirm_password = ''
  if (!form.current_password) { errors.current_password = 'Current password is required'; return; }
  if (form.new_password.length < 8) { errors.new_password = 'Minimum 8 characters required'; return; }
  if (form.new_password !== form.confirm_password) { errors.confirm_password = 'Passwords do not match'; return; }

  loading.value = true
  try {
    await api.put('/profile/pass', {
      old_pass: form.current_password,
      new_pass: form.new_password,
      new_pass_confirmation: form.confirm_password
    })
    showToast('Password updated successfully!', 'success')
    form.current_password = form.new_password = form.confirm_password = ''
  } catch (err) {
    const res = err.response?.data
    if (res?.errors) {
      errors.current_password = res.errors.old_pass?.[0] || res.errors.current_password?.[0] || ''
      errors.new_password = res.errors.new_pass?.[0] || res.errors.new_password?.[0] || ''
      errors.confirm_password = res.errors.new_pass_confirmation?.[0] || res.errors.password_confirmation?.[0] || ''
    } else {
      errors.current_password = res?.message || 'Update failed'
    }
    showToast('Update failed', 'error')
  } finally {
    loading.value = false
  }
}

const triggerUpload = () => { fileInput.value.click(); closeMenu(); }
const handleFileUpload = async (e) => {
  const file = e.target.files[0]; if (!file) return
  uploadingAvatar.value = true
  avatarPreview.value = URL.createObjectURL(file)
  const fd = new FormData(); fd.append('image', file)
  try {
    await api.post('/profile/image', fd)
    showToast('Image updated!', 'success'); fetchUserData()
  } catch { showToast('Upload failed', 'error') }
  finally { uploadingAvatar.value = false; avatarPreview.value = null; }
}

const removeImage = async () => {
  if (!confirm('Delete photo?')) return
  try {
    await api.delete('/profile/image')
    user.value.avatar = null; showToast('Image deleted', 'success'); closeMenu()
  } catch { showToast('Delete failed', 'error') }
}

const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (e) => { if (!(el === e.target || el.contains(e.target))) binding.value() }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) { document.removeEventListener('click', el.clickOutsideEvent) }
}

onMounted(fetchUserData)
</script>

<style scoped>
/* Page & Hero Sync (Rented Rooms Style) */
.profile-page {
  background: #f4f6f9;
  min-height: 100vh;
  margin-top: 80px;
  font-family: 'Inter', sans-serif;
}

.text-navy {
  color: #031c36;
}

.text-orange {
  color: #ff5f00 !important;
}

.cursor-pointer {
  cursor: pointer;
}

.hero-banner {
  background: linear-gradient(135deg, #031c36 0%, #0d3a6e 60%, #1a5fa8 100%);
  padding-bottom: 60px;
  position: relative;
}

.hero-banner::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ff5f00' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.avatar-wrapper {
  position: relative;
  margin-bottom: -30px;
  z-index: 10;
}

.avatar-ring {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  padding: 4px;
  background: linear-gradient(135deg, #ff5f00, #ffb347);
}

.avatar-box {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #031c36;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  font-weight: 800;
}

.avatar-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-cam {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 30px;
  height: 30px;
  background: #ff5f00;
  color: #fff;
  border-radius: 50%;
  border: 2px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.avatar-menu {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  background: #fff;
  border-radius: 14px;
  width: 210px;
  padding: 8px 0;
  z-index: 999;
  border: 1px solid #eee;
}

.avatar-menu-item {
  width: 100%;
  border: none;
  background: none;
  padding: 11px 18px;
  font-size: .85rem;
  text-align: left;
  display: flex;
  align-items: center;
  font-weight: 600;
}

.user-role-badge {
  background: rgba(255, 95, 0, .2);
  color: #ff9a5c;
  border: 1px solid rgba(255, 95, 0, .3);
  font-size: .75rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
}

/* Tab Bar Sync (Rented Rooms Style) */
.tab-bar-wrap {
  background: #fff;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 100;
}

.tab-bar {
  display: flex;
  overflow-x: auto;
}

.tab-item {
  padding: 14px 20px;
  color: #888;
  text-decoration: none;
  font-weight: 600;
  font-size: .85rem;
  border-bottom: 3px solid transparent;
  white-space: nowrap;
}

.tab-active {
  color: #ff5f00 !important;
  border-bottom-color: #ff5f00 !important;
}

/* OLD CARD STYLE: Restored for the Form */
.form-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.side-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
  overflow: hidden;
}

.side-card-header {
  background: #f8f9fa;
  padding: 15px 20px;
  font-weight: 700;
  color: #031c36;
  border-bottom: 1px solid #eee;
}

.field-label {
  font-size: .75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 8px;
  display: block;
}

.input-wrap {
  display: flex;
  align-items: center;
  border: 1.5px solid #eef0f2;
  border-radius: 12px;
  background: #fafbfc;
  transition: 0.2s;
}

.input-wrap:focus-within {
  border-color: #ff5f00;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(255, 95, 0, .1);
}

.input-wrap.input-err {
  border-color: #dc3545;
  background: #fff8f8;
}

.input-icon {
  padding: 0 15px;
  color: #bbb;
}

.input-wrap input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 12px 0;
  outline: none;
  font-size: .9rem;
}

/* Old Orange Button */
.btn-save-main {
  background: #ff5f00;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 12px 35px;
  font-weight: 700;
  transition: 0.3s;
  width: 100%;
  max-width: 250px;
}

.btn-save-main:hover:not(:disabled) {
  background: #e65600;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(255, 95, 0, 0.3);
}

/* Feedback & Misc */
.status-icon.success {
  background: #e8f5e9;
  color: #2e7d32;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.err-msg {
  color: #dc3545;
  font-size: .78rem;
  margin-top: 6px;
  font-weight: 600;
}

.toast-pill {
  position: fixed;
  top: 30px;
  right: 30px;
  z-index: 10000;
  padding: 12px 25px;
  border-radius: 50px;
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.toast-pill.success {
  background: #198754;
}

.toast-pill.error {
  background: #dc3545;
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity .15s, transform .15s;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.slide-toast-enter-active,
.slide-toast-leave-active {
  transition: all .4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.slide-toast-enter-from {
  transform: translateX(100px);
  opacity: 0;
}

.slide-toast-leave-to {
  transform: scale(0.8);
  opacity: 0;
}
</style>
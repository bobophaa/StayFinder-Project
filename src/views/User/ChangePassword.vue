<template>
  <div class="profile-page font-kh">
    <div
      v-if="!user"
      class="d-flex flex-column align-items-center justify-content-center"
      style="min-height: 60vh"
    >
      <div class="spinner-border text-orange mb-3" style="width: 3rem; height: 3rem"></div>
      <p class="text-muted fw-semibold">កំពុងផ្ទុកការកំណត់សុវត្ថិភាព...</p>
    </div>

    <div v-else>
      <div class="hero-banner position-relative">
        <div class="container position-relative" style="z-index: 2">
          <div class="d-flex align-items-end gap-4 pb-0" style="padding-top: 48px">
            <div class="avatar-wrapper">
              <div class="avatar-ring">
                <div class="avatar-box">
                  <img
                    v-if="avatarPreview || user.avatar"
                    :src="avatarPreview || user.avatar"
                    alt="avatar"
                  />
                  <span v-else>{{ user.name?.charAt(0)?.toUpperCase() || 'U' }}</span>

                  <div v-if="uploadingAvatar" class="avatar-loading">
                    <div class="spinner-border spinner-border-sm text-white"></div>
                  </div>
                </div>
              </div>

              <div class="avatar-cam" @click.stop="toggleMenu" title="Change photo">
                <i class="bi bi-camera-fill"></i>
              </div>

              <transition name="menu-fade">
                <div v-if="showActionsMenu" class="avatar-menu shadow" @click.stop>
                  <button class="avatar-menu-item" @click="triggerUpload">
                    <i class="bi bi-cloud-arrow-up-fill me-2 text-orange"></i>Upload new photo
                  </button>
                  <button
                    v-if="user.avatar"
                    class="avatar-menu-item text-danger"
                    @click="removeImage"
                  >
                    <i class="bi bi-trash3-fill me-2"></i>Remove photo
                  </button>
                </div>
              </transition>

              <input
                ref="fileInput"
                type="file"
                hidden
                accept="image/*"
                @change="handleFileUpload"
              />
            </div>

            <div class="pb-3">
              <div class="d-flex align-items-center gap-2 mb-1">
                <h3 class="fw-bold text-white mb-0">{{ user.name }}</h3>
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
            <router-link to="/profile" class="tab-item"
              ><i class="bi bi-person-fill me-2"></i>ប្រវត្តិរូប</router-link
            >
            <router-link to="/my-bookings" class="tab-item"
              ><i class="bi bi-calendar-check-fill me-2"></i>ការកក់</router-link
            >
            <router-link to="/my-rented" class="tab-item"
              ><i class="bi bi-house-check-fill me-2"></i>បន្ទប់ជួល</router-link
            >
            <router-link to="/ChangePassword" class="tab-item tab-active"
              ><i class="bi bi-shield-lock-fill me-2"></i>សុវត្ថិភាព</router-link
            >
          </div>
        </div>
      </div>

      <div class="container py-4 pb-5">
        <div class="row g-4">
          <div class="col-lg-4">
            <div class="side-card mb-4">
              <div class="side-card-header">
                <i class="bi bi-shield-check me-2"></i>សុវត្ថិភាពគណនី
              </div>
              <div class="side-card-body p-4">
                <div class="d-flex align-items-start gap-3 mb-4">
                  <div class="status-icon success">
                    <i class="bi bi-check2-circle"></i>
                  </div>
                  <div>
                    <h6 class="fw-bold text-navy mb-1">គណនីត្រូវបានការពារ</h6>
                    <p class="text-muted small mb-0">
                      ពាក្យសម្ងាត់របស់អ្នកជួយការពារការកក់បន្ទប់ និងទិន្នន័យផ្ទាល់ខ្លួន។
                    </p>
                  </div>
                </div>
                <div class="p-3 rounded-3 bg-light border">
                  <p class="small text-muted mb-0">
                    <i class="bi bi-info-circle me-1"></i> ប្រើពាក្យសម្ងាត់តែមួយគត់ ដើម្បីការពារគណនីរបស់អ្នក។
                  </p>
                </div>
              </div>
            </div>

            <div class="id-card">
              <div class="d-flex justify-content-between align-items-center">
            <span class="small opacity-75">លេខសម្គាល់សមាជិក</span>
                <span class="id-badge">#{{ user.id }}</span>
              </div>
              <div class="mt-3 small opacity-60">ប្រវត្តិរូបសុវត្ថិភាពដែលបានផ្ទៀងផ្ទាត់</div>
              <div class="id-dots"></div>
            </div>
          </div>

          <div class="col-lg-8">
            <div class="form-card">
              <div class="mb-4">
             <h5 class="fw-bold text-navy mb-1">ផ្លាស់ប្តូរពាក្យសម្ងាត់</h5>
               <p class="text-muted small">ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់ ដើម្បីរក្សាគណនីរបស់អ្នកឱ្យមានសុវត្ថិភាព។</p>
              </div>

              <form @submit.prevent="updatePassword">
                <div class="row g-4">
                  <div class="col-12">
                    <label
                      class="field-label"
                      :class="{ 'field-label-err': errors.current_password }"
                      >ពាក្យសម្ងាត់បច្ចុប្បន្ន</label
                    >
                    <div class="input-wrap" :class="{ 'input-err': errors.current_password }">
                      <i class="bi bi-lock input-icon"></i>
                      <input
                        type="password"
                        v-model="form.current_password"
                        placeholder="បញ្ចូលពាក្យសម្ងាត់បច្ចុប្បន្ន"
                      />
                    </div>
                    <div v-if="errors.current_password" class="err-msg">
                      {{ errors.current_password }}
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label class="field-label" :class="{ 'field-label-err': errors.new_password }"
                      >ពាក្យសម្ងាត់ថ្មី</label
                    >
                    <div class="input-wrap" :class="{ 'input-err': errors.new_password }">
                      <i class="bi bi-key input-icon"></i>
                      <input
                        type="password"
                        v-model="form.new_password"
                        placeholder="យ៉ាងតិច ៨ តួអក្សរ"
                      />
                    </div>
                    <div v-if="errors.new_password" class="err-msg">{{ errors.new_password }}</div>
                  </div>

                  <div class="col-md-6">
                    <label
                      class="field-label"
                      :class="{ 'field-label-err': errors.confirm_password }"
                      >បញ្ជាក់ពាក្យសម្ងាត់</label
                    >
                    <div class="input-wrap" :class="{ 'input-err': errors.confirm_password }">
                      <i class="bi bi-key-fill input-icon"></i>
                      <input
                        type="password"
                        v-model="form.confirm_password"
                        placeholder="បញ្ជាក់ពាក្យសម្ងាត់ថ្មី"
                      />
                    </div>
                    <div v-if="errors.confirm_password" class="err-msg">
                      {{ errors.confirm_password }}
                    </div>
                  </div>
                </div>

                <div class="d-flex justify-content-end mt-5">
                  <button type="submit" class="btn btn-save-main" :disabled="loading">
                    <span
                      v-if="loading && !uploadingAvatar"
                      class="spinner-border spinner-border-sm me-2"
                    ></span>
                    <i v-else class="bi bi-shield-lock me-2"></i>
             កំណត់សុវត្ថិភាព
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <transition name="slide-toast">
      <div v-if="toast.show" class="toast-pill" :class="toast.type">
        <i
          class="bi me-2"
          :class="toast.type === 'success' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"
        ></i>
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import api from '@/api/http'

const user = ref(null)
const loading = ref(false)
const uploadingAvatar = ref(false)
const fileInput = ref(null)
const avatarPreview = ref(null)
const showActionsMenu = ref(false)

const form = reactive({ current_password: '', new_password: '', confirm_password: '' })
const errors = reactive({ current_password: '', new_password: '', confirm_password: '' })
const toast = reactive({ show: false, message: '', type: 'success' })

const showToast = (msg, type = 'success') => {
  toast.message = msg
  toast.type = type
  toast.show = true
  setTimeout(() => (toast.show = false), 3200)
}

const fetchUserData = async () => {
  try {
    const res = await api.get('/me')
    user.value = res.data.data
  } catch (err) {
    console.error(err)
  }
}

// ── AVATAR LOGIC (Same as Profile) ──
const toggleMenu = () => (showActionsMenu.value = !showActionsMenu.value)
const handleOutsideClick = () => (showActionsMenu.value = false)

const triggerUpload = () => {
  fileInput.value.click()
  showActionsMenu.value = false
}

const handleFileUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  avatarPreview.value = URL.createObjectURL(file)
  const fd = new FormData()
  fd.append('image', file)

  uploadingAvatar.value = true
  try {
    await api.post('/profile/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    await fetchUserData()
    avatarPreview.value = null
    showToast('Photo updated!', 'success')
  } catch (err) {
    avatarPreview.value = null
    showToast('Upload failed', 'error')
  } finally {
    uploadingAvatar.value = false
    e.target.value = ''
  }
}

const removeImage = async () => {
  showActionsMenu.value = false
  if (!confirm('Remove profile photo?')) return
  try {
    await api.delete('/profile/image')
    user.value.avatar = null
    showToast('Photo removed', 'success')
  } catch (err) {
    showToast('Delete failed', 'error')
  }
}

const updatePassword = async () => {
  errors.current_password = errors.new_password = errors.confirm_password = ''
  let ok = true
  if (!form.current_password) {
    errors.current_password = 'ត្រូវបញ្ចូលពាក្យសម្ងាត់បច្ចុប្បន្ន'
    ok = false
  }
  if (form.new_password.length < 8) {
    errors.new_password = 'យ៉ាងតិច ៨ តួអក្សរ'
    ok = false
  }
  if (form.new_password !== form.confirm_password) {
    errors.confirm_password = 'ពាក្យសម្ងាត់មិនត្រូវគ្នា'
    ok = false
  }

  if (!ok) return
  loading.value = true
  try {
    await api.put('/profile/pass', {
      old_pass: form.current_password,
      new_pass: form.new_password,
      new_pass_confirmation: form.confirm_password,
    })
    showToast('Password updated!', 'success')
    form.current_password = form.new_password = form.confirm_password = ''
  } catch (err) {
    showToast(err.response?.data?.message || 'Update failed', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUserData()
  document.addEventListener('click', handleOutsideClick)
})
onUnmounted(() => document.removeEventListener('click', handleOutsideClick))
</script>

<style scoped>
.profile-page {
  background: #f4f6f9;
  min-height: 100vh;
  margin-top: 80px;
}

.text-navy {
  color: #031c36;
}

.text-orange {
  color: #ff5f00;
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

.user-role-badge {
  background: rgba(255, 95, 0, 0.2);
  color: #ff9a5c;
  border: 1px solid rgba(255, 95, 0, 0.3);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
}

/* Avatar & Menu */
.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
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
  color: #fff;
  font-size: 2.5rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.avatar-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-loading {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
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
  z-index: 11;
}

.avatar-menu {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border-radius: 14px;
  width: 210px;
  padding: 8px 0;
  z-index: 999;
  border: 1px solid #eee;
}

.avatar-menu-item {
  width: 100%;
  text-align: left;
  border: none;
  background: none;
  padding: 11px 18px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
}

.avatar-menu-item:hover {
  background: #f8f9fa;
}

/* Tabs */
.tab-bar-wrap {
  background: #fff;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 100;
}

.tab-bar {
  display: flex;
  gap: 0;
  overflow-x: auto;
}

.tab-item {
  padding: 14px 20px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #888;
  text-decoration: none;
  border-bottom: 3px solid transparent;
  white-space: nowrap;
}

.tab-active {
  color: #ff5f00 !important;
  border-bottom-color: #ff5f00 !important;
}

/* Layout Cards */
.side-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
}

.side-card-header {
  background: #031c36;
  color: #fff;
  padding: 14px 20px;
  font-weight: 700;
  border-bottom: 3px solid #ff5f00;
}

.status-icon.success {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(25, 135, 84, 0.1);
  color: #198754;
  display: flex;
  align-items: center;
  justify-content: center;
}

.id-card {
  background: linear-gradient(135deg, #031c36 0%, #0d3a6e 100%);
  border-radius: 16px;
  padding: 20px;
  color: #fff;
  position: relative;
  overflow: hidden;
}

.id-badge {
  background: rgba(255, 95, 0, 0.2);
  color: #ff9a5c;
  padding: 3px 10px;
  border-radius: 20px;
  font-weight: 800;
  font-size: 0.75rem;
}

.id-dots {
  position: absolute;
  bottom: -20px;
  right: -20px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 20px solid rgba(255, 255, 255, 0.05);
}

.form-card {
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  border: 1px solid #f0f0f0;
}

.field-label {
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #999;
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
  box-shadow: 0 0 0 3px rgba(255, 95, 0, 0.1);
}

.input-wrap.input-err {
  border-color: #dc3545;
  background: #fff8f8;
}

.input-icon {
  padding: 0 12px;
  color: #bbb;
}

.input-wrap input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 11px 14px 11px 0;
  font-size: 0.88rem;
  outline: none;
}

.err-msg {
  color: #dc3545;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 5px;
}

.btn-save-main {
  background: #ff5f00;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 12px 32px;
  font-weight: 700;
  transition: 0.2s;
}

.btn-save-main:hover {
  background: #e65600;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 95, 0, 0.3);
}

/* Animations */
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition:
    opacity 0.15s,
    transform 0.15s;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-6px);
}

.toast-pill {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-radius: 50px;
  color: #fff;
  font-weight: 700;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.toast-pill.success {
  background: #198754;
}

.toast-pill.error {
  background: #dc3545;
}

.slide-toast-enter-active,
.slide-toast-leave-active {
  transition: all 0.35s;
}

.slide-toast-enter-from,
.slide-toast-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
</style>

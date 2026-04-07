<template>
  <div class="profile-page">

    <!-- Loading -->
    <div v-if="!user" class="d-flex flex-column align-items-center justify-content-center" style="min-height:60vh">
      <div class="spinner-border text-orange mb-3" style="width:3rem;height:3rem"></div>
      <p class="text-muted fw-semibold">Loading your profile...</p>
    </div>

    <div v-else>
      <!-- ── Hero Banner ── -->
      <div class="hero-banner position-relative">
        <div class="container position-relative" style="z-index:2">
          <div class="d-flex align-items-end gap-4 pb-0" style="padding-top:48px">

            <!-- Avatar -->
            <div class="avatar-wrapper">
              <div class="avatar-ring">
                <div class="avatar-box">
                  <img v-if="avatarPreview || user.avatar" :src="avatarPreview || user.avatar" alt="avatar" />
                  <span v-else>{{ user.name?.charAt(0)?.toUpperCase() || 'U' }}</span>
                  <div v-if="loading && uploadingAvatar" class="avatar-loading">
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
                    v-if="avatarPreview || user.avatar"
                    class="avatar-menu-item text-danger"
                    @click="removeImage"
                  >
                    <i class="bi bi-trash3-fill me-2"></i>Remove photo
                  </button>
                </div>
              </transition>

              <input ref="fileInput" type="file" hidden accept="image/*" @change="handleFileUpload" />
            </div>

            <!-- Name block -->
            <div class="pb-3">
              <div class="d-flex align-items-center gap-2 mb-1">
                <h3 class="fw-bold text-white mb-0">{{ user.name }}</h3>
                <!-- <i class="bi bi-patch-check-fill text-orange fs-5"></i> -->
              </div>
              <span class="user-role-badge">{{ user.current_job || 'StayFinder Member' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Tab Bar ── -->
      <div class="tab-bar-wrap">
        <div class="container">
          <div class="tab-bar">
            <router-link
              v-for="tab in tabLinks" :key="tab.path"
              :to="tab.path" class="tab-item" active-class="tab-active"
            >
              <i :class="['bi', tab.icon, 'me-2']"></i>{{ tab.name }}
            </router-link>
          </div>
        </div>
      </div>

      <!-- ── Page Body ── -->
      <div class="container py-4 pb-5">
        <div class="row g-4">

          <!-- LEFT: Info card -->
          <div class="col-lg-4">
            <div class="side-card mb-4">
              <div class="side-card-header">
                <i class="bi bi-person-lines-fill me-2"></i>Account Info
              </div>
              <div class="side-card-body">
                <div class="info-row">
                  <span class="info-label"><i class="bi bi-envelope me-2 text-orange"></i>Email</span>
                  <span class="info-value">{{ user.email || '–' }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label"><i class="bi bi-telephone me-2 text-orange"></i>Phone</span>
                  <span class="info-value">{{ user.phone || 'Not set' }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label"><i class="bi bi-gender-ambiguous me-2 text-orange"></i>Gender</span>
                  <span class="info-value">{{ user.gender == 1 ? 'Male' : user.gender == 2 ? 'Female' : 'Not set' }}</span>
                </div>
                <div class="info-row border-0">
                  <span class="info-label"><i class="bi bi-briefcase me-2 text-orange"></i>Job</span>
                  <span class="info-value">{{ user.current_job || 'Not set' }}</span>
                </div>
              </div>
            </div>

            <!-- ID card -->
            <div class="id-card">
              <div class="d-flex justify-content-between align-items-center">
                <span class="small opacity-75">Member ID</span>
                <span class="id-badge">#{{ user.id }}</span>
              </div>
              <div class="mt-3 small opacity-60">StayFinder verified member</div>
              <div class="id-dots"></div>
            </div>
          </div>

          <!-- RIGHT: Edit form -->
          <div class="col-lg-8">
            <div class="form-card">

              <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                  <h5 class="fw-bold text-navy mb-1">Profile Information</h5>
                  <small class="text-muted">Keep your details up to date</small>
                </div>
                <div class="d-flex gap-2">
                  <router-link to="/ChangePassword" class="btn btn-security">
                    <i class="bi bi-shield-lock-fill me-2"></i>Change Password
                  </router-link>
                  <button v-if="!isEditing" class="btn btn-edit-toggle" @click="enableEdit">
                    <i class="bi bi-pencil-fill me-2"></i>Edit Profile
                  </button>
                  <button v-else class="btn btn-cancel" @click="cancelEdit">
                    <i class="bi bi-x-lg me-1"></i>Cancel
                  </button>
                </div>
              </div>

              <!-- Edit banner -->
              <div v-if="isEditing" class="edit-banner mb-4">
                <i class="bi bi-info-circle-fill me-2"></i>
                You are now editing your profile. Click <strong>Save Changes</strong> when done.
              </div>

              <form @submit.prevent="updateProfile">
                <div class="row g-3">

                  <div class="col-md-6">
                    <label class="field-label" :class="{ 'field-label-err': errors.name }">Full Name</label>
                    <div class="input-wrap" :class="{ 'input-err': errors.name, 'input-readonly': !isEditing }">
                      <i class="bi bi-person input-icon"></i>
                      <input v-model="form.name" placeholder="Your full name" :readonly="!isEditing" />
                    </div>
                    <div v-if="errors.name" class="err-msg">{{ errors.name }}</div>
                  </div>

                  <div class="col-md-6">
                    <label class="field-label" :class="{ 'field-label-err': errors.email }">Email</label>
                    <div class="input-wrap" :class="{ 'input-err': errors.email, 'input-readonly': !isEditing }">
                      <i class="bi bi-envelope input-icon"></i>
                      <input v-model="form.email" type="email" placeholder="email@example.com" :readonly="!isEditing" />
                    </div>
                    <div v-if="errors.email" class="err-msg">{{ errors.email }}</div>
                  </div>

                  <div class="col-md-6">
                    <label class="field-label" :class="{ 'field-label-err': errors.phone }">Phone</label>
                    <div class="input-wrap" :class="{ 'input-err': errors.phone, 'input-readonly': !isEditing }">
                      <i class="bi bi-telephone input-icon"></i>
                      <input v-model="form.phone" placeholder="Phone number" :readonly="!isEditing" />
                    </div>
                    <div v-if="errors.phone" class="err-msg">{{ errors.phone }}</div>
                  </div>

                  <div class="col-md-6">
                    <label class="field-label">Gender</label>
                    <div class="input-wrap" :class="{ 'input-readonly': !isEditing }">
                      <i class="bi bi-gender-ambiguous input-icon"></i>
                      <select v-model="form.gender" :disabled="!isEditing">
                        <option :value="1">Male</option>
                        <option :value="2">Female</option>
                      </select>
                    </div>
                  </div>

                  <div class="col-12">
                    <label class="field-label">Current Job</label>
                    <div class="input-wrap" :class="{ 'input-readonly': !isEditing }">
                      <i class="bi bi-briefcase input-icon"></i>
                      <input v-model="form.current_job" placeholder="e.g. Web Developer" :readonly="!isEditing" />
                    </div>
                  </div>

                </div>

                <div v-if="isEditing" class="d-flex justify-content-end mt-4">
                  <button type="submit" class="btn btn-save-main" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-check-circle-fill me-2"></i>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- ── Confirm Modal ── -->
    <div v-if="showConfirmModal" class="modal-overlay">
      <div class="confirm-modal shadow-lg">
        <div class="confirm-modal-header">
          <i class="bi bi-person-check-fill me-2"></i>Confirm Update
        </div>
        <div class="confirm-modal-body">
          <p class="text-muted mb-0">Are you sure you want to save these profile changes?</p>
        </div>
        <div class="confirm-modal-footer">
          <button class="btn btn-light rounded-3 px-4" @click="showConfirmModal = false">Cancel</button>
          <button class="btn btn-save-main px-4" @click="confirmUpdateProfile" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-check2 me-1"></i>Confirm
          </button>
        </div>
      </div>
    </div>

    <!-- ── Toast ── -->
    <transition name="slide-toast">
      <div v-if="toast.show" class="toast-pill" :class="toast.type">
        <i class="bi me-2" :class="toast.type === 'success' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
        {{ toast.message }}
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import api from '@/api/http'

const user            = ref(null)
const loading         = ref(false)
const uploadingAvatar = ref(false)
const fileInput       = ref(null)
const avatarPreview   = ref(null)
const showActionsMenu  = ref(false)
const showConfirmModal = ref(false)
const isEditing       = ref(false)

const form   = reactive({ name: '', email: '', phone: '', gender: 1, current_job: '' })
const errors = reactive({ name: '', email: '', phone: '' })

const tabLinks = [
  { name: 'Profile',        path: '/profile',                icon: 'bi-person-fill'         },
  { name: 'Bookings',       path: '/my-bookings',            icon: 'bi-calendar-check-fill'  },
  { name: 'Checklist',      path: '/profile/checklist',      icon: 'bi-list-check'           },
  { name: 'Rented Rooms',   path: '/my-rented',   icon: 'bi-house-check-fill'     },
  { name: 'Rent Checklist', path: '/profile/rent-checklist', icon: 'bi-ui-checks-grid'       },
]

const toast = reactive({ show: false, message: '', type: 'success' })
const showToast = (msg, type = 'success') => {
  toast.message = msg
  toast.type    = type
  toast.show    = true
  setTimeout(() => (toast.show = false), 3200)
}

const fetchUserData = async () => {
  try {
    const res  = await api.get('/me')
    user.value = res.data.data
    Object.assign(form, {
      name:        user.value.name        || '',
      email:       user.value.email       || '',
      phone:       user.value.phone       || '',
      gender:      user.value.gender      || 1,
      current_job: user.value.current_job || '',
    })
  } catch (err) {
    console.error('Fetch user error:', err)
  }
}

// ── Avatar menu ────────────────────────────────────────────
const toggleMenu = () => {
  showActionsMenu.value = !showActionsMenu.value
}

// Close menu when clicking anywhere outside
const handleOutsideClick = () => {
  showActionsMenu.value = false
}

const triggerUpload = () => {
  fileInput.value.click()
  showActionsMenu.value = false
}

// ── Upload avatar ──────────────────────────────────────────
const handleFileUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    showToast('File too large (max 2MB)', 'error')
    return
  }

  avatarPreview.value = URL.createObjectURL(file)

  const fd = new FormData()
  fd.append('image', file)

  loading.value         = true
  uploadingAvatar.value = true
  try {
    await api.post('/profile/image', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    await fetchUserData()
    avatarPreview.value = null
    showToast('Profile photo updated!', 'success')
  } catch (err) {
    avatarPreview.value = null
    showToast(err.response?.data?.message || 'Upload failed', 'error')
  } finally {
    loading.value         = false
    uploadingAvatar.value = false
    e.target.value        = ''
  }
}

// ── Remove avatar ──────────────────────────────────────────
const removeImage = async () => {
  showActionsMenu.value = false
  if (!confirm('Remove your profile photo?')) return
  loading.value = true
  try {
    await api.delete('/profile/image')
    user.value.avatar   = null
    avatarPreview.value = null
    showToast('Profile photo removed', 'success')
  } catch (err) {
    showToast(err.response?.data?.message || 'Delete failed', 'error')
  } finally {
    loading.value = false
  }
}

// ── Profile update ─────────────────────────────────────────
const validateForm = () => {
  errors.name = errors.email = errors.phone = ''
  let ok = true
  if (!form.name?.trim()) { errors.name = 'Full name is required'; ok = false }
  if (!form.email)        { errors.email = 'Email is required'; ok = false }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errors.email = 'Invalid email format'; ok = false }
  return ok
}

const enableEdit  = () => { isEditing.value = true }
const cancelEdit  = () => {
  isEditing.value = false
  Object.assign(form, {
    name:        user.value.name        || '',
    email:       user.value.email       || '',
    phone:       user.value.phone       || '',
    gender:      user.value.gender      || 1,
    current_job: user.value.current_job || '',
  })
}

const updateProfile = () => {
  if (!validateForm()) return
  showConfirmModal.value = true
}

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
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUserData()
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})
</script>

<style scoped>
/* ── Base ── */
.profile-page { background:#f4f6f9; min-height:100vh; margin-top: 80px;}
.text-navy    { color:#031c36; }
.text-orange  { color:#ff5f00; }

/* ── Hero ── */
.hero-banner {  z-index: 200;
  background: linear-gradient(135deg, #031c36 0%, #0d3a6e 60%, #1a5fa8 100%);
  padding-bottom: 60px;
  position: relative;
  overflow: visible;
}
.hero-banner::before {
  content: '';
  position: absolute; inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ff5f00' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.user-role-badge {
  background: rgba(255,95,0,.2);
  color: #ff9a5c;
  border: 1px solid rgba(255,95,0,.3);
  font-size: .75rem; font-weight: 700;
  padding: 4px 12px; border-radius: 20px;
}

/* ── Avatar ── */
.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
  margin-bottom: -30px;
  z-index: 10;
}
.avatar-ring {
  width: 110px; height: 110px;
  border-radius: 50%;
  padding: 4px;
  background: linear-gradient(135deg, #ff5f00, #ffb347);
}
.avatar-box {
  width: 100%; height: 100%;
  border-radius: 50%;
  background: #031c36;
  color: #fff;
  font-size: 2.5rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; position: relative;
}
.avatar-box img  { width:100%; height:100%; object-fit:cover; }
.avatar-loading  { position:absolute; inset:0; background:rgba(0,0,0,.5); border-radius:50%; display:flex; align-items:center; justify-content:center; }

.avatar-cam {
  position: absolute; bottom: 2px; right: 2px;
  width: 30px; height: 30px;
  background: #ff5f00; color: #fff;
  border-radius: 50%; border: 2px solid #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: .8rem; cursor: pointer;
  transition: background .2s, transform .2s;
  z-index: 11;
}
.avatar-cam:hover { background: #e65600; transform: scale(1.1); }

.avatar-menu {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border-radius: 14px;
  width: 210px;
  padding: 8px 0;
  z-index: 9999;
  border: 1px solid #eee;
}
.avatar-menu-item {
  width: 100%; text-align: left; border: none; background: none;
  padding: 11px 18px; font-size: .85rem; cursor: pointer;
  transition: background .15s; display: flex; align-items: center;
}
.avatar-menu-item:hover { background: #f8f9fa; }

/* Menu fade transition */
.menu-fade-enter-active, .menu-fade-leave-active { transition: opacity .15s, transform .15s; }
.menu-fade-enter-from, .menu-fade-leave-to       { opacity: 0; transform: translateX(-50%) translateY(-6px); }
.menu-fade-enter-to, .menu-fade-leave-from       { opacity: 1; transform: translateX(-50%) translateY(0); }

/* ── Tab bar ── */
.tab-bar-wrap { background:#fff; border-bottom:1px solid #eee; box-shadow:0 2px 8px rgba(0,0,0,.04); position:sticky; top:0; z-index:100; }
.tab-bar      { display:flex; gap:0; overflow-x:auto; padding-top:10px; }
.tab-bar::-webkit-scrollbar { display:none; }
.tab-item {
  display: flex; align-items: center;
  padding: 14px 20px;
  font-size: .85rem; font-weight: 600;
  color: #888; text-decoration: none;
  border-bottom: 3px solid transparent;
  white-space: nowrap;
  transition: color .2s, border-color .2s;
}
.tab-item:hover { color:#ff5f00; }
.tab-active { color:#ff5f00 !important; border-bottom-color:#ff5f00 !important; }

/* ── Side card ── */
.side-card          { background:#fff; border-radius:16px; overflow:hidden; border:1px solid #f0f0f0; }
.side-card-header   { background:#031c36; color:#fff; padding:14px 20px; font-weight:700; font-size:.9rem; border-bottom:3px solid #ff5f00; }
.side-card-body     { padding:8px 0; }
.info-row           { display:flex; flex-direction:column; padding:12px 20px; border-bottom:1px solid #f8f8f8; }
.info-label         { font-size:.72rem; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:#999; margin-bottom:4px; }
.info-value         { font-size:.88rem; font-weight:600; color:#031c36; word-break:break-word; }

/* ── ID card ── */
.id-card {
  background: linear-gradient(135deg, #031c36 0%, #0d3a6e 100%);
  border-radius:16px; padding:20px; color:#fff; position:relative; overflow:hidden;
}
.id-badge { background:rgba(255,95,0,.2); color:#ff9a5c; border:1px solid rgba(255,95,0,.3); font-size:.78rem; font-weight:800; padding:3px 10px; border-radius:20px; }
.id-dots  { position:absolute; bottom:-20px; right:-20px; width:80px; height:80px; border-radius:50%; border:20px solid rgba(255,255,255,.05); }

/* ── Form card ── */
.form-card { background:#fff; border-radius:16px; padding:28px; border:1px solid #f0f0f0; }

.field-label      { font-size:.72rem; font-weight:800; text-transform:uppercase; letter-spacing:.06em; color:#999; margin-bottom:8px; display:block; }
.field-label-err  { color:#dc3545 !important; }

.input-wrap {
  display:flex; align-items:center;
  border:1.5px solid #eef0f2; border-radius:12px;
  background:#fafbfc; overflow:hidden;
  transition:border-color .2s, box-shadow .2s;
}
.input-wrap:focus-within           { border-color:#ff5f00; box-shadow:0 0 0 3px rgba(255,95,0,.1); background:#fff; }
.input-wrap.input-readonly         { background:#f8f9fa; border-color:#f0f0f0; }
.input-wrap.input-err              { border-color:#dc3545; background:#fff8f8; }
.input-wrap:focus-within .input-icon { color:#ff5f00; }

.input-icon { padding:0 12px; color:#bbb; font-size:1rem; flex-shrink:0; }

.input-wrap input,
.input-wrap select {
  flex:1; border:none; background:transparent;
  padding:11px 14px 11px 0;
  font-size:.88rem; color:#031c36; outline:none;
}
.input-wrap select        { cursor:pointer; }
.input-wrap input:read-only { cursor:default; color:#555; }

.err-msg { color:#dc3545; font-size:.75rem; font-weight:600; margin-top:5px; }

.edit-banner {
  background:rgba(255,95,0,.07);
  border:1px solid rgba(255,95,0,.2);
  border-left:4px solid #ff5f00;
  border-radius:10px; padding:10px 16px;
  font-size:.83rem; color:#c04800; font-weight:500;
}

/* ── Buttons ── */
.btn-edit-toggle {
  background:#ff5f00; color:#fff; border:none;
  border-radius:10px; padding:9px 18px;
  font-weight:700; font-size:.83rem;
  transition:background .2s, transform .15s;
}
.btn-edit-toggle:hover { background:#e65600; transform:translateY(-1px); }

.btn-cancel {
  background:#f8f9fa; color:#555;
  border:1.5px solid #e9ecef; border-radius:10px;
  padding:9px 18px; font-weight:600; font-size:.83rem;
  transition:all .2s;
}
.btn-cancel:hover { background:#e9ecef; }

.btn-security {
  background:transparent; color:#031c36;
  border:1.5px solid #e9ecef; border-radius:10px;
  padding:9px 18px; font-weight:600; font-size:.83rem;
  text-decoration:none; transition:all .2s;
  display:inline-flex; align-items:center;
}
.btn-security:hover { background:#031c36; color:#fff; border-color:#031c36; }

.btn-save-main {
  background:#ff5f00; color:#fff; border:none;
  border-radius:12px; padding:12px 32px;
  font-weight:700; font-size:.9rem;
  display:inline-flex; align-items:center;
  transition:background .2s, transform .15s, box-shadow .2s;
}
.btn-save-main:hover:not(:disabled) { background:#e65600; transform:translateY(-2px); box-shadow:0 8px 20px rgba(255,95,0,.3); }
.btn-save-main:disabled             { opacity:.7; cursor:not-allowed; }

.spinner-border.text-orange { color:#ff5f00 !important; }

/* ── Confirm modal ── */
.modal-overlay    { position:fixed; inset:0; background:rgba(0,0,0,.5); display:flex; align-items:center; justify-content:center; z-index:9000; }
.confirm-modal    { background:#fff; border-radius:20px; overflow:hidden; width:100%; max-width:420px; }
.confirm-modal-header { background:#031c36; color:#F4A25A; padding:18px 24px; font-weight:700; font-size:1rem; border-bottom:3px solid #ff5f00; display:flex; align-items:center; }
.confirm-modal-body   { padding:24px; }
.confirm-modal-footer { padding:0 24px 24px; display:flex; justify-content:flex-end; gap:10px; }

/* ── Toast ── */
.toast-pill {
  position:fixed; top:24px; right:24px; z-index:9999;
  display:flex; align-items:center;
  padding:12px 20px; border-radius:50px;
  font-weight:700; font-size:.85rem;
  color:#fff; box-shadow:0 8px 24px rgba(0,0,0,.2);
}
.toast-pill.success { background:#198754; }
.toast-pill.error   { background:#dc3545; }

.slide-toast-enter-active, .slide-toast-leave-active { transition:all .35s cubic-bezier(.4,0,.2,1); }
.slide-toast-enter-from, .slide-toast-leave-to       { opacity:0; transform:translateX(40px); }
</style>

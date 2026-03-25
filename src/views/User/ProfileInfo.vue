<template>
  <div class="profile-page">
    <div class="profile-banner">
      <div class="banner-gradient"></div>
      <div class="banner-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
      </div>
    </div>

    <div class="container main-content">
      <header class="profile-header-card shadow-sm mb-4">
        <div class="header-inner px-4 pb-4">
          <div class="d-flex align-items-end flex-wrap">
            <div class="avatar-wrapper position-relative">
              <img :src="form.avatar || defaultAvatar" class="avatar-img shadow-sm" alt="Profile">

              <div class="avatar-actions">
                <label for="imageUpload" class="action-btn upload" :class="{ 'disabled': uploading }"
                  title="Update Image">
                  <i v-if="uploading" class="spinner-border spinner-border-sm"></i>
                  <i v-else class="bi bi-camera-fill"></i>
                  <input type="file" id="imageUpload" hidden @change="handleImageUpload" accept="image/*"
                    :disabled="uploading">
                </label>
                <button v-if="form.avatar && !form.avatar.includes('no_photo.jpg')" @click="handleImageDelete"
                  class="action-btn delete" title="Delete Image">
                  <i class="bi bi-trash-fill"></i>
                </button>
              </div>
            </div>

            <div class="stats-container d-flex gap-4 ms-md-4 mb-2">
              <div class="stat-box">
                <span class="count">1.25k</span>
                <span class="label">Followers</span>
              </div>
              <div class="stat-box">
                <span class="count">455</span>
                <span class="label">Following</span>
              </div>
            </div>
          </div>

          <div class="mt-3">
            <h1 class="display-name fw-bold">
              {{ form.name || 'User Name' }}
              <span class="verify-badge"><i class="bi bi-patch-check-fill"></i></span>
            </h1>
            <p class="text-muted mb-0"><i class="bi bi-briefcase me-1"></i> {{ form.current_job || 'No job specified' }}
            </p>
          </div>
        </div>

        <nav class="custom-nav-tabs px-4">
          <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
            :class="['nav-item-btn', { active: activeTab === tab.key }]">
            {{ tab.label }}
          </button>
        </nav>
      </header>

      <main class="content-body card border-0 shadow-sm p-4 p-md-5">

        <div v-if="activeTab === 'profile'">
          <div class="section-header mb-4 d-flex justify-content-between align-items-center">
            <div>
              <h4 class="fw-bold">Profile Information</h4>
              <p class="text-muted small">ID: #{{ form.id }} | Joined: {{ formatDate(form.created_at) }}</p>
            </div>
            <button @click="activeTab = 'password'" class="btn btn-outline-brand btn-sm rounded-pill">
              <i class="bi bi-key me-1"></i> Security
            </button>
          </div>

          <div class="row g-4">
            <div class="col-md-6">
              <label class="field-label">Full Name</label>
              <input v-model="form.name" type="text" class="form-control minimal-input">
            </div>
            <div class="col-md-6">
              <label class="field-label">Email Address</label>
              <input v-model="form.email" type="email" class="form-control minimal-input">
            </div>
            <div class="col-md-6">
              <label class="field-label">Phone Number</label>
              <input v-model="form.phone" type="text" class="form-control minimal-input">
            </div>
            <div class="col-md-6">
              <label class="field-label">Current Job</label>
              <input v-model="form.current_job" type="text" class="form-control minimal-input">
            </div>
            <div class="col-md-6">
              <label class="field-label">Gender</label>
              <select v-model="form.gender" class="form-select minimal-input">
                <option :value="0">Unknown</option>
                <option :value="1">Male</option>
                <option :value="2">Female</option>
              </select>
            </div>
          </div>

          <div class="actions-row d-flex gap-3 mt-5">
            <button @click="handleUpdateInfo" class="btn btn-brand-action px-5" :disabled="loading">
              {{ loading ? 'Saving...' : 'Update Profile' }}
            </button>
          </div>
        </div>

        <div v-else-if="activeTab === 'password'">
          <h4 class="fw-bold mb-4">Security</h4>
          <div class="row g-4">
            <div class="col-md-6">
              <label class="field-label">New Password</label>
              <input v-model="passwordForm.new" type="password" class="form-control minimal-input">
            </div>
            <div class="col-md-6">
              <label class="field-label">Confirm Password</label>
              <input v-model="passwordForm.confirm" type="password" class="form-control minimal-input">
            </div>
          </div>
          <button @click="handleChangePassword" class="btn btn-brand-action mt-4">Update Password</button>
        </div>

        <div v-else>
          <div class="d-flex justify-content-between mb-4">
            <h4 class="fw-bold">{{ getTabLabel(activeTab) }}</h4>
            <span class="badge-count">{{ listData.length }} Items</span>
          </div>

          <div v-if="listData.length > 0" class="list-group list-group-flush">
            <div v-for="(item, idx) in listData" :key="idx" class="list-item-custom p-3 mb-2 rounded-3 border">
              {{ item.name || 'Untitled Entry' }}
            </div>
          </div>
          <div v-else class="text-center py-5">
            <p class="text-muted">No records found for {{ getTabLabel(activeTab) }}.</p>
          </div>
        </div>

      </main>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue'
import axios from 'axios'

const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=FF5F00&color=fff&size=200'
const activeTab = ref('profile')
const loading = ref(false)
const uploading = ref(false)
const listData = ref([])

const tabs = [
  { key: 'profile', label: 'Profile Information' },
  { key: 'booking', label: 'Bookings', endpoint: '/api/my-booking-service' },
  { key: 'checklist', label: 'Checklist', endpoint: '/api/my-book-checking-list' },
  { key: 'rentals', label: 'Rented Rooms', endpoint: '/api/my-rented-room' },
  { key: 'rent-check', label: 'Rent Checklist', endpoint: '/api/my-rent-checking-list' }
]

// Updated reactive form to match your JSON data exactly
const form = reactive({
  id: null,
  name: '',
  current_job: '',
  gender: 0,
  phone: '',
  email: '',
  avatar: '',
  created_at: ''
})

const passwordForm = reactive({ new: '', confirm: '' })

// 1. Fetch data on load
const fetchUserData = async () => {
  try {
    const res = await axios.get('/api/profile/info')
    const d = res.data.data
    // Mapping JSON keys to form state
    form.id = d.id
    form.name = d.name
    form.current_job = d.current_job
    form.gender = d.gender
    form.phone = d.phone
    form.email = d.email
    form.avatar = d.avatar
    form.created_at = d.created_at
  } catch (err) {
    console.error("Failed to fetch user data", err)
  }
}

// 2. Update Profile Info
const handleUpdateInfo = async () => {
  loading.value = true
  try {
    await axios.post('/api/profile/info', {
      name: form.name,
      current_job: form.current_job,
      gender: form.gender,
      phone: form.phone,
      email: form.email
    })
    alert('Profile updated successfully!')
  } catch (err) {
    alert('Update failed.')
  } finally {
    loading.value = false
  }
}

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('image', file)

  uploading.value = true
  try {
    const res = await axios.post('/api/profile/image', formData)
    form.avatar = res.data.avatar || res.data.path
    alert('Photo updated!')
  } catch (err) {
    alert('Upload failed. Check file size.')
  } finally {
    uploading.value = false
  }
}

const handleImageDelete = async () => {
  if (!confirm("Remove profile photo?")) return
  try {
    await axios.delete('/api/profile/image')
    form.avatar = '' // Server usually reverts to no_photo.jpg
    fetchUserData() // Refresh to get default path
  } catch (err) {
    alert('Delete failed.')
  }
}

const handleChangePassword = async () => {
  if (passwordForm.new !== passwordForm.confirm) { alert("Passwords don match"); return }
  try {
    await axios.put('/api/change-password', { password: passwordForm.new })
    alert('Password updated!'); passwordForm.new = ''; passwordForm.confirm = ''
  } catch (e) { alert('Failed to change password') }
}

const getTabLabel = (key) => tabs.find(t => t.key === key)?.label
const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString() : ''

watch(activeTab, async (newTab) => {
  const tab = tabs.find(t => t.key === newTab)
  if (tab && tab.endpoint) {
    try {
      const res = await axios.get(tab.endpoint)
      listData.value = res.data.data || []
    } catch (e) { listData.value = [] }
  }
})

onMounted(fetchUserData)
</script>

<style scoped>
/* (All previous styles remain the same, adding slight tweaks for the new fields) */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

.profile-page {
  background: #fff;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

.profile-banner {
  height: 240px;
  position: relative;
  overflow: hidden;
  background: #fdfdfd;
}

.banner-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #fff5f0 0%, #ffffff 100%);
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.4;
}

.shape-1 {
  width: 400px;
  height: 400px;
  background: #FF5F00;
  top: -100px;
  left: 5%;
}

.shape-2 {
  width: 300px;
  height: 300px;
  background: #ffd1b3;
  bottom: -50px;
  right: 15%;
}

.main-content {
  margin-top: -80px;
  position: relative;
  max-width: 1000px;
}

.profile-header-card {
  background: #fff;
  border-radius: 28px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.avatar-wrapper {
  width: 150px;
  height: 150px;
  padding: 6px;
  background: #fff;
  border-radius: 50%;
  margin-top: -40px;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #fff;
}

.avatar-actions {
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: flex;
  gap: 5px;
}

.action-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.action-btn.upload {
  background: #FF5F00;
  color: #fff;
}

.action-btn.delete {
  background: #fff;
  color: #ff4d4d;
  border: 1px solid #eee;
}

.custom-nav-tabs {
  display: flex;
  gap: 25px;
  border-top: 1px solid #f0f0f0;
  overflow-x: auto;
}

.nav-item-btn {
  background: none;
  border: none;
  padding: 18px 0;
  font-weight: 600;
  color: #8a8a8a;
  white-space: nowrap;
  position: relative;
}

.nav-item-btn.active {
  color: #FF5F00;
}

.nav-item-btn.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: #FF5F00;
  border-radius: 3px 3px 0 0;
}

.content-body {
  border-radius: 28px;
  background: #fafafa;
  border: 1px solid #f1f1f1 !important;
}

.field-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #bbb;
  margin-bottom: 8px;
  letter-spacing: 0.8px;
}

.minimal-input {
  border: 1px solid #e2e2e2;
  border-radius: 14px;
  padding: 12px 18px;
  background: #fff;
  transition: 0.2s;
}

.minimal-input:focus {
  border-color: #FF5F00;
  box-shadow: 0 0 0 4px rgba(255, 95, 0, 0.1);
  outline: none;
}

.btn-brand-action {
  background: #FF5F00;
  color: #fff;
  border-radius: 14px;
  padding: 12px 30px;
  font-weight: 700;
  border: none;
  transition: 0.2s;
}

.btn-brand-action:hover {
  background: #e65600;
  transform: translateY(-1px);
}

.btn-outline-brand {
  border: 1px solid #FF5F00;
  color: #FF5F00;
  background: transparent;
  transition: 0.2s;
  border-radius: 20px;
}

.badge-count {
  background: #FF5F00;
  color: #fff;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
}

.list-item-custom {
  background: #fff;
  border: 1px solid #eee !important;
  transition: 0.2s;
}

.display-name {
  font-size: 2rem;
  letter-spacing: -1px;
}

.verify-badge {
  color: #1d9bf0;
  margin-left: 5px;
}

.stat-box .count {
  font-weight: 800;
  display: block;
  color: #000;
}

.stat-box .label {
  font-size: 0.8rem;
  color: #888;
}
</style>
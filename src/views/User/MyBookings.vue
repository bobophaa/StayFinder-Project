<template>
  <div class="profile-page">
    <div v-if="!user" class="loading-container">
      <div class="spinner-modern"></div>
      <p class="mt-3 fw-bold text-navy">Tailoring your experience...</p>
    </div>

    <div v-else>
      <div class="hero-banner">
        <div class="container position-relative">
          <div class="row align-items-center pt-5 pb-4">
            <div class="col-md-auto text-center text-md-start">
              <div class="avatar-wrapper">
                <div class="avatar-inner" :class="{ 'uploading': uploadingAvatar }">
                  <img v-if="avatarPreview || user.avatar" :src="avatarPreview || user.avatar" alt="User" />
                  <span v-else class="initials">{{ user.name?.charAt(0)?.toUpperCase() || 'U' }}</span>
                  <div class="avatar-edit-overlay" @click.stop="toggleMenu">
                    <i class="bi bi-camera-fill"></i>
                  </div>
                </div>

                <transition name="menu-pop">
                  <div v-if="showActionsMenu" class="avatar-dropdown shadow-lg" @click.stop>
                    <button class="dropdown-item" @click="triggerUpload">
                      <i class="bi bi-cloud-arrow-up text-orange me-2"></i> Upload Photo
                    </button>
                    <button v-if="user.avatar" class="dropdown-item text-danger" @click="removeImage">
                      <i class="bi bi-trash3 me-2"></i> Remove Photo
                    </button>
                  </div>
                </transition>
                <input ref="fileInput" type="file" hidden accept="image/*" @change="handleFileUpload" />
              </div>
            </div>

            <div class="col-md text-center text-md-start mt-4 mt-md-0">
              <div class="d-inline-flex align-items-center gap-2 mb-2">
                <h1 class="display-6 fw-bold text-white mb-0">{{ user.name }}</h1>
                <i class="bi bi-patch-check-fill text-orange fs-4"></i>
              </div>
              <div class="d-flex flex-wrap justify-content-center justify-content-md-start gap-3">
                <span class="badge-glass">
                  <i class="bi bi-briefcase me-2"></i>{{ user.current_job || 'Member' }}
                </span>
                <span class="badge-glass">
                  <i class="bi bi-shield-check me-2"></i>Verified Identity
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav class="tab-nav sticky-top">
        <div class="container">
          <div class="d-flex overflow-auto no-scrollbar">
            <router-link v-for="tab in tabLinks" :key="tab.path" :to="tab.path" class="nav-tab-link"
              active-class="active">
              <i :class="['bi', tab.icon]"></i>
              <span>{{ tab.name }}</span>
            </router-link>
          </div>
        </div>
      </nav>

      <div class="container py-5">
        <header class="section-header d-flex justify-content-between align-items-end mb-5">
          <div>
            <h2 class="fw-bold text-navy mb-1">My Bookings</h2>
            <p class="text-muted mb-0">Total of <strong>{{ pagination.total }}</strong> reservations</p>
          </div>
          <router-link to="/rooms" class="btn btn-orange-outline rounded-pill d-none d-md-block">
            Find New Stay <i class="bi bi-arrow-right ms-2"></i>
          </router-link>
        </header>

        <div v-if="loadingBookings" class="py-5 text-center">
          <div class="spinner-grow text-orange" role="status"></div>
        </div>

        <div v-else-if="bookings.length > 0" class="row g-4">
          <div v-for="item in bookings" :key="item.id" class="col-xl-6">
            <div class="modern-booking-card">
              <div class="card-image">
                <img :src="item.room?.image" :alt="item.room?.title">
                <div class="status-chip" :class="getStatusStyle(item.status).class">
                  {{ getStatusStyle(item.status).label }}
                </div>
              </div>

              <div class="card-content">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div class="pe-2 overflow-hidden">
                    <h4 class="card-title text-navy text-truncate">{{ item.room?.title }}</h4>
                    <p class="card-location text-muted small mb-0"><i class="bi bi-geo-alt-fill text-orange"></i> {{
                      item.room?.district?.name }}</p>
                  </div>
                  <div class="price-tag text-end">
                    <small class="text-muted d-block" style="font-size: 0.7rem;">Monthly</small>
                    <span class="text-navy fw-bold fs-5">${{ item.room?.price }}</span>
                  </div>
                </div>

                <div class="info-grid-compact my-3">
                  <div class="info-box">
                    <label>Check-in</label>
                    <span>{{ formatDate(item.checkin_date) }}</span>
                  </div>
                  <div class="info-box">
                    <label>Room Size</label>
                    <span>{{ item.room?.size_room }} m²</span>
                  </div>
                </div>

                <div class="seller-info-compact d-flex align-items-center gap-2 mt-auto pt-3 border-top">
                  <img :src="item.seller?.avatar" class="seller-avatar-sm" alt="Host">
                  <div class="overflow-hidden">
                    <span class="d-block text-muted x-small-label">Property Host</span>
                    <h6 class="mb-0 text-navy fw-bold text-truncate" style="font-size: 0.85rem;">
                      {{ item.seller?.name }}
                    </h6>
                  </div>
                  <div class="ms-auto">
                    <a :href="'mailto:' + item.seller?.email" class="btn-contact-sm">
                      <i class="bi bi-envelope"></i>
                    </a>
                  </div>
                </div>

                <div class="card-actions mt-3">
                  <button @click="openBookingDetail(item)" class="btn btn-modern-primary w-100 py-2">
                    Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-state text-center py-5 bg-white rounded-5 shadow-sm">
          <div class="empty-icon-box mb-3">
            <i class="bi bi-calendar-x text-muted opacity-25" style="font-size: 4rem;"></i>
          </div>
          <h3 class="fw-bold text-navy">No bookings found</h3>
          <p class="text-muted mx-auto" style="max-width: 300px;">It looks like you haven't reserved any rooms yet.</p>
          <router-link to="/rooms" class="btn btn-orange btn-lg rounded-pill px-5 mt-3">Find a Room</router-link>
        </div>
      </div>
    </div>

    <transition name="modal-zoom">
      <div v-if="showModal" class="custom-modal-overlay" @click="closeModal">
        <div class="modern-modal-container" @click.stop>
          <button class="modal-close-btn" @click="closeModal">
            <i class="bi bi-x-lg"></i>
          </button>

          <div class="modal-visual-header">
            <img :src="selectedBooking?.room?.image" alt="Room Cover">
            <div class="visual-overlay"></div>
            <div class="visual-content">
              <span class="modal-status-pill shadow-sm" :class="getStatusStyle(selectedBooking?.status).class">
                {{ getStatusStyle(selectedBooking?.status).label }}
              </span>
              <h2 class="text-white fw-bold mb-0">{{ selectedBooking?.room?.title }}</h2>
            </div>
          </div>

          <div class="modal-body p-4 p-md-5">
            <div class="row g-4">
              <div class="col-lg-7">
                <h5 class="fw-bold text-navy mb-4">Stay Overview</h5>
                <div class="detail-grid-modern">
                  <div class="detail-card">
                    <i class="bi bi-calendar3"></i>
                    <div>
                      <label>Check-in Date</label>
                      <p>{{ formatDate(selectedBooking?.checkin_date) }}</p>
                    </div>
                  </div>
                  <div class="detail-card">
                    <i class="bi bi-hash"></i>
                    <div>
                      <label>Booking ID</label>
                      <p>#RSV-{{ selectedBooking?.id }}</p>
                    </div>
                  </div>
                  <div class="detail-card">
                    <i class="bi bi-aspect-ratio"></i>
                    <div>
                      <label>Floor Area</label>
                      <p>{{ selectedBooking?.room?.size_room }} m²</p>
                    </div>
                  </div>
                  <div class="detail-card accent">
                    <i class="bi bi-wallet2"></i>
                    <div>
                      <label>Monthly Rate</label>
                      <p>${{ selectedBooking?.room?.price }}</p>
                    </div>
                  </div>
                </div>

                <div class="location-mention mt-4 p-3 rounded-4 bg-light d-flex align-items-center gap-3">
                  <div
                    class="icon-circle bg-white text-orange shadow-sm d-flex align-items-center justify-content-center"
                    style="width:40px; height:40px; border-radius:50%">
                    <i class="bi bi-geo-alt"></i>
                  </div>
                  <div>
                    <span class="d-block small text-muted">Property Location</span>
                    <span class="fw-semibold">{{ selectedBooking?.room?.district?.name }}</span>
                  </div>
                </div>
              </div>

              <div class="col-lg-5">
                <div class="action-sidebar p-4 rounded-4" style="background: #f8fafc; border: 1px solid #e2e8f0;">
                  <h5 class="fw-bold text-navy mb-3">Management</h5>
                  <p class="small text-muted mb-4">Manage this stay or contact support for help.</p>

                  <router-link :to="`/booking/${selectedBooking?.id}`"
                    class="btn btn-orange w-100 py-3 rounded-pill mb-3 fw-bold">
                    Manage My Stay
                  </router-link>
                  <button class="btn btn-outline-secondary w-100 py-3 rounded-pill fw-bold" @click="closeModal">
                    Close Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="toast-slide">
      <div v-if="toast.show" class="modern-toast" :class="toast.type">
        <i :class="toast.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'"></i>
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import api from '@/api/http'

// --- State ---
const user = ref(null)
const bookings = ref([])
const loadingBookings = ref(false)
const uploadingAvatar = ref(false)
const fileInput = ref(null)
const avatarPreview = ref(null)
const showActionsMenu = ref(false)
const pagination = ref({ total: 0 })

// --- Modal & UI State ---
const selectedBooking = ref(null)
const showModal = ref(false)
const toast = reactive({ show: false, message: '', type: 'success' })

const tabLinks = [
  { name: 'Profile', path: '/profile', icon: 'bi-person' },
  { name: 'My Bookings', path: '/my-bookings', icon: 'bi-calendar-check' },
  { name: 'Checklist', path: '/profile/checklist', icon: 'bi-list-check' },
  { name: 'Rented Rooms', path: '/my-rented', icon: 'bi-house' },
  { name: 'Rent Checklist', path: '/profile/rent-checklist', icon: 'bi-ui-checks' },
]

// --- Utils ---
const showToast = (msg, type = 'success') => {
  toast.message = msg; toast.type = type; toast.show = true
  setTimeout(() => (toast.show = false), 3000)
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const getStatusStyle = (status) => {
  switch (status) {
    case 1: return { label: 'Pending', class: 'bg-warning-subtle text-warning' }
    case 2: return { label: 'Approved', class: 'bg-success-subtle text-success' }
    case 3: return { label: 'Rejected', class: 'bg-danger-subtle text-danger' }
    default: return { label: 'Unknown', class: 'bg-secondary-subtle text-secondary' }
  }
}

const fetchUserData = async () => {
  try {
    const res = await api.get('/me')
    user.value = res.data.data
  } catch (err) { console.error(err) }
}

const fetchBookings = async () => {
  loadingBookings.value = true
  try {
    const res = await api.get('/profile/booking?page=1&per_page=20')
    bookings.value = res.data.data || []
    pagination.value = res.data.paginate || { total: 0 }
  } catch (err) {
    showToast('Failed to load bookings', 'error')
  } finally {
    loadingBookings.value = false
  }
}

const toggleMenu = () => { showActionsMenu.value = !showActionsMenu.value }
const handleOutsideClick = (e) => {
  if (!e.target.closest('.avatar-wrapper')) showActionsMenu.value = false
}
const triggerUpload = () => { fileInput.value.click(); showActionsMenu.value = false }

const handleFileUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  avatarPreview.value = URL.createObjectURL(file)
  const fd = new FormData(); fd.append('image', file)
  uploadingAvatar.value = true
  try {
    await api.post('/profile/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    await fetchUserData()
    showToast('Profile photo updated!')
  } catch (err) {
    showToast('Upload failed', 'error')
    avatarPreview.value = null
  } finally {
    uploadingAvatar.value = false
  }
}

const removeImage = async () => {
  if (!confirm('Remove photo?')) return
  try {
    await api.delete('/profile/image')
    user.value.avatar = null
    avatarPreview.value = null
    showToast('Photo removed')
  } catch (err) { showToast('Action failed', 'error') }
}

const openBookingDetail = (item) => {
  selectedBooking.value = item
  showModal.value = true
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  showModal.value = false
  document.body.style.overflow = 'auto'
}

onMounted(() => {
  fetchUserData(); fetchBookings()
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})
</script>

<style scoped>
.profile-page {
  --primary-navy: #031c36;
  --accent-orange: #ff5f00;
  --bg-soft: #f8fafc;
  --glass: rgba(255, 255, 255, 0.1);
  background: var(--bg-soft);
  min-height: 100vh;
  margin-top: 60px;
  font-family: 'Inter', sans-serif;
}

/* Loading Spinner */
.loading-container {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.spinner-modern {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid var(--accent-orange);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* Hero Banner & Avatar */
.hero-banner {
  background: radial-gradient(circle at top right, #0d4a8d, #031c36);
  padding: 60px 0 100px;
  clip-path: ellipse(160% 100% at 50% 0%);
}

.avatar-wrapper {
  position: relative;
  width: 140px;
  margin: 0 auto;
}

.avatar-inner {
  width: 140px;
  height: 140px;
  border-radius: 40px;
  background: var(--primary-navy);
  border: 4px solid var(--glass);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
}

.avatar-inner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-inner .initials {
  font-size: 3rem;
  font-weight: 800;
  color: white;
}

.avatar-edit-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: 0.3s;
  cursor: pointer;
  color: white;
  font-size: 1.5rem;
}

.avatar-inner:hover .avatar-edit-overlay {
  opacity: 1;
}

.avatar-dropdown {
  position: absolute;
  top: 110%;
  left: 0;
  width: 200px;
  background: white;
  border-radius: 18px;
  padding: 10px;
  z-index: 1000;
  border: 1px solid #e2e8f0;
}

.dropdown-item {
  width: 100%;
  text-align: left;
  padding: 12px 15px;
  border-radius: 12px;
  border: none;
  background: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: 0.2s;
}

.dropdown-item:hover {
  background: #f1f5f9;
}

.badge-glass {
  background: var(--glass);
  backdrop-filter: blur(10px);
  color: white;
  padding: 8px 18px;
  border-radius: 50px;
  font-size: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Tabs */
.tab-nav {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  z-index: 90;
  margin-top: -40px;
  border-radius: 30px 30px 0 0;
}

.nav-tab-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 25px;
  text-decoration: none;
  color: #64748b;
  font-weight: 600;
  font-size: 0.95rem;
  border-bottom: 3px solid transparent;
  transition: 0.3s;
  white-space: nowrap;
}

.nav-tab-link.active {
  color: var(--accent-orange);
  border-bottom-color: var(--accent-orange);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Modern Booking Card */
.modern-booking-card {
  display: flex;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #f1f5f9;
  height: 100%;
}

.modern-booking-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.card-image {
  width: 35%;
  position: relative;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-chip {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
}

.card-content {
  width: 65%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.info-grid-compact {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.info-box {
  background: #f8fafc;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
}

.info-box label {
  display: block;
  font-size: 0.6rem;
  text-transform: uppercase;
  color: #94a3b8;
  font-weight: 700;
  margin-bottom: 2px;
}

.info-box span {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--primary-navy);
}

/* Seller Section Styles */
.seller-info-compact {
  border-top: 1px solid #f1f5f9;
}

.seller-avatar-sm {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid #e2e8f0;
}

.x-small-label {
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-contact-sm {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  color: #64748b;
  text-decoration: none;
  transition: 0.2s;
}

.btn-contact-sm:hover {
  background: var(--accent-orange);
  color: white;
}

/* Modal Styles */
.custom-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(3, 28, 54, 0.85);
  backdrop-filter: blur(8px);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modern-modal-container {
  background: white;
  width: 100%;
  max-width: 900px;
  border-radius: 32px;
  overflow: hidden;
  position: relative;
  animation: modalPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes modalPop {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-visual-header {
  height: 200px;
  position: relative;
}

.modal-visual-header img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.visual-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
}

.visual-content {
  position: absolute;
  bottom: 25px;
  left: 30px;
}

.modal-status-pill {
  padding: 6px 14px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 10px;
  display: inline-block;
}

.detail-grid-modern {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.detail-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background: #f8fafc;
  border-radius: 18px;
}

.detail-card i {
  font-size: 1.4rem;
  color: #94a3b8;
}

.detail-card label {
  display: block;
  font-size: 0.7rem;
  color: #64748b;
  font-weight: 600;
}

.detail-card p {
  margin: 0;
  font-weight: 700;
  color: var(--primary-navy);
}

.detail-card.accent {
  background: #fff7ed;
  color: var(--accent-orange);
}

.detail-card.accent p {
  color: var(--accent-orange);
}

.modal-close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* UI Helpers */
.btn-modern-primary {
  background: var(--primary-navy);
  color: white;
  border-radius: 12px;
  font-weight: 700;
  border: none;
  transition: 0.2s;
}

.btn-orange {
  background: var(--accent-orange);
  color: white;
  border: none;
  font-weight: 700;
}

.btn-orange:hover {
  opacity: 0.9;
  color: white;
}

.btn-orange-outline {
  border: 2px solid var(--accent-orange);
  color: var(--accent-orange);
  font-weight: 700;
  text-decoration: none;
}

.text-orange {
  color: var(--accent-orange) !important;
}

.text-navy {
  color: var(--primary-navy) !important;
}

.bg-success-subtle {
  background: #dcfce7 !important;
  color: #166534 !important;
}

.bg-warning-subtle {
  background: #fef9c3 !important;
  color: #854d0e !important;
}

.bg-danger-subtle {
  background: #fee2e2 !important;
  color: #991b1b !important;
}

/* Toast Animation */
.modern-toast {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  padding: 14px 28px;
  border-radius: 20px;
  color: white;
  z-index: 4000;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.modern-toast.success {
  background: #10b981;
}

.modern-toast.error {
  background: #ef4444;
}

/* Tablet/Mobile Adjustments */
@media (max-width: 768px) {
  .modern-booking-card {
    flex-direction: column;
  }

  .card-image,
  .card-content {
    width: 100%;
  }

  .card-image {
    height: 180px;
  }

  .detail-grid-modern {
    grid-template-columns: 1fr;
  }
}
</style>
<template>
  <div class="profile-page">
    <div v-if="!user" class="loading-container">
      <div class="spinner-modern"></div>
      <p class="mt-3 fw-bold text-navy">Loading your bookings...</p>
    </div>

    <div v-else>
      <div class="hero-banner">
        <div class="container hero-content">
          <div class="d-flex align-items-center gap-4">
            <div class="avatar-wrapper">
              <div class="avatar">
                <img v-if="avatarPreview || user.avatar" :src="avatarPreview || user.avatar" />
                <span v-else>{{ user.name?.charAt(0)?.toUpperCase() }}</span>
              </div>
              <div class="camera-btn" @click.stop="toggleMenu">
                <i class="bi bi-camera-fill"></i>
              </div>

              <transition name="fade">
                <div v-if="showActionsMenu" class="avatar-menu">
                  <button @click="triggerUpload">
                    <i class="bi bi-upload me-2 text-orange"></i>
                    Upload new photo
                  </button>
                  <button class="text-danger" @click="removeImage">
                    <i class="bi bi-trash me-2"></i>
                    Remove photo
                  </button>
                </div>
              </transition>
              <input ref="fileInput" type="file" hidden @change="handleFileUpload" />
            </div>

            <div>
              <div class="d-flex align-items-center gap-2">
                <h2 class="user-name">{{ user.name }}</h2>
                <i class="bi bi-patch-check-fill verify-icon"></i>
              </div>
              <span class="role-badge">{{ user.current_job || 'student' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="tab-container">
        <div class="container">
          <div class="tabs">
            <router-link v-for="tab in tabLinks" :key="tab.path" :to="tab.path" class="tab" active-class="active">
              <i :class="['bi', tab.icon]"></i>
              {{ tab.name }}
            </router-link>
          </div>
        </div>
      </div>

      <div class="container py-5">
        <header class="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 class="fw-bold text-navy">My Bookings</h2>
            <p class="text-muted">Total {{ pagination.total }} properties found</p>
          </div>
        </header>

        <div v-if="loadingBookings" class="text-center py-5">
          <div class="spinner-border text-orange"></div>
        </div>

        <div v-else-if="bookings.length" class="row g-4">
          <div v-for="item in bookings" :key="item.id" class="col-lg-4 col-md-6">
            <div class="modern-booking-card" @click="openBookingDetail(item)">
              <div class="image-area">
                <img :src="item.room?.image" class="room-img" />
                <div class="price-pill">${{ item.room?.price }}<span>/mo</span></div>
                <div :class="['status-glass', getStatus(item.status).toLowerCase()]">
                  <span class="status-dot"></span> {{ getStatus(item.status) }}
                </div>
              </div>

              <div class="content-area">
                <div class="location-tag">
                  <i class="bi bi-geo-alt-fill"></i> {{ item.room?.district?.name }}
                </div>
                <h5 class="room-title-card">{{ item.room?.title }}</h5>

                <div class="amenities-summary">
                  <div class="amenity">
                    <i class="bi bi-arrows-fullscreen"></i> {{ item.room?.size_room }}m²
                  </div>
                  <div class="amenity">
                    <i class="bi bi-door-open"></i> {{ item.room?.bed }} Beds
                  </div>
                </div>

                <div class="card-footer-action">
                  <span>Manage Booking</span>
                  <div class="arrow-circle">
                    <i class="bi bi-arrow-right"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" id="bookingDetailModal" tabindex="-1" ref="modalRef">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content modern-detail-modal border-0">
            <div class="modal-body p-0">

              <div class="p-4 p-md-5 pb-4">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <span :class="['status-pill-lg', getStatus(selectedBooking?.status).toLowerCase()]">
                    <i class="bi bi-circle-fill me-2"></i> {{ getStatus(selectedBooking?.status) }}
                  </span>
                  <button @click="closeModal" class="btn-close-modern">
                    <i class="bi bi-x"></i>
                  </button>
                </div>

                <h2 class="modal-title-main">{{ selectedBooking?.room?.title }}</h2>
                <p class="text-muted mb-0">
                  <i class="bi bi-geo-alt-fill text-orange me-1"></i>
                  {{ selectedBooking?.room?.district?.name }}, Phnom Penh
                </p>
              </div>

              <div class="info-ribbon">
                <div class="ribbon-item">
                  <span class="label">BOOKING ID</span>
                  <span class="value">#{{ selectedBooking?.id }}</span>
                </div>
                <div class="ribbon-item">
                  <span class="label">CHECK-IN</span>
                  <span class="value">{{ selectedBooking?.checkin_date }}</span>
                </div>
                <div class="ribbon-item">
                  <span class="label">ROOM SIZE</span>
                  <span class="value">{{ selectedBooking?.room?.size_room }} m²</span>
                </div>
                <div class="ribbon-item">
                  <span class="label">CAPACITY</span>
                  <span class="value">{{ selectedBooking?.room?.bed }} Beds</span>
                </div>
              </div>

              <div class="p-4 p-md-5 pt-4">
                <div class="row g-4">
                  <div class="col-md-7">
                    <h6 class="detail-subtitle">Monthly Investment</h6>
                    <div class="pricing-card-modern">
                      <div class="main-rent">
                        <div class="d-flex justify-content-between align-items-center">
                          <span class="fw-bold"><i class="bi bi-house-door me-2"></i> Room Rent</span>
                          <span class="price-big">${{ selectedBooking?.room?.price }}</span>
                        </div>
                      </div>
                      <div class="extra-fees">
                        <div class="fee-row">
                          <span><i class="bi bi-droplet me-2"></i> Water Utility</span>
                          <span>$12.00</span>
                        </div>
                        <div class="fee-row">
                          <span><i class="bi bi-lightning-charge me-2"></i> Electricity</span>
                          <span>$12.00</span>
                        </div>
                      </div>
                    </div>

                    <h6 class="detail-subtitle mt-4">Included Amenities</h6>
                    <div class="d-flex flex-wrap gap-2">
                      <div v-for="opt in selectedBooking?.room?.options" :key="opt.id" class="modern-tag">
                        <i class="bi bi-check2 text-success me-1"></i> {{ opt.name }}
                      </div>
                    </div>
                  </div>

                  <div class="col-md-5">
                    <h6 class="detail-subtitle">Involved Parties</h6>
                    <div class="user-contact-card mb-3">
                      <div class="contact-icon tenant"><i class="bi bi-person"></i></div>
                      <div class="contact-info">
                        <span class="role">Tenant</span>
                        <span class="name">{{ user.name }}</span>
                      </div>
                    </div>
                    <div class="user-contact-card mb-4">
                      <div class="contact-icon landlord"><i class="bi bi-building"></i></div>
                      <div class="contact-info">
                        <span class="role">Landlord</span>
                        <span class="name">{{ selectedBooking?.seller?.name || 'Owner' }}</span>
                      </div>
                    </div>

                    <a v-if="selectedBooking?.room?.map_url" :href="selectedBooking.room.map_url" target="_blank"
                      class="btn-modern-map">
                      <i class="bi bi-geo-alt me-2"></i> View on Google Maps
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/http'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle'

const user = ref(null)
const bookings = ref([])
const loadingBookings = ref(false)
const avatarPreview = ref(null)
const showActionsMenu = ref(false)
const pagination = ref({ total: 0 })
const selectedBooking = ref(null)
const modalRef = ref(null)
const fileInput = ref(null)

const tabLinks = [
  { name: 'Profile', path: '/profile', icon: 'bi-person-fill' },
  { name: 'Bookings', path: '/my-bookings', icon: 'bi-calendar-check-fill' },
  { name: 'Rented', path: '/my-rented', icon: 'bi-house' }
]

const fetchUser = async () => {
  const res = await api.get('/me')
  user.value = res.data.data
}

const fetchBookings = async () => {
  loadingBookings.value = true
  const res = await api.get('/profile/booking?page=1')
  bookings.value = res.data.data
  pagination.value = res.data.paginate || { total: 0 }
  loadingBookings.value = false
}

const getStatus = (s) => s === 1 ? 'Pending' : s === 2 ? 'Approved' : 'Rejected'

const openBookingDetail = (item) => {
  selectedBooking.value = item
  const modal = new bootstrap.Modal(modalRef.value)
  modal.show()
}

const closeModal = () => {
  const modal = bootstrap.Modal.getInstance(modalRef.value)
  if (modal) modal.hide()
}

const toggleMenu = () => showActionsMenu.value = !showActionsMenu.value
const triggerUpload = () => fileInput.value.click()
const handleFileUpload = async (e) => {
  const file = e.target.files[0]; if (!file) return
  avatarPreview.value = URL.createObjectURL(file)
  const fd = new FormData(); fd.append('image', file)
  await api.post('/profile/image', fd)
  await fetchUser()
}
const removeImage = async () => {
  await api.delete('/profile/image')
  user.value.avatar = null
  avatarPreview.value = null
}

onMounted(() => {
  fetchUser()
  fetchBookings()
})
</script>

<style scoped>
.profile-page {
  background: #f4f6f9;
  min-height: 100vh;
  margin-top: 70px;
  font-family: 'Inter', sans-serif;
}

/* --- OLD HEADER STYLE (RETAINED) --- */
.hero-banner {
  background: linear-gradient(135deg, #031c36, #1a5fa8);
  padding: 60px 0 80px;
  position: relative;
}

.hero-banner::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 25px 25px;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.avatar-wrapper {
  position: relative;
}

.avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 5px solid #ff5f00;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #031c36;
  color: white;
  font-size: 2rem;
  font-weight: bold;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 32px;
  height: 32px;
  background: #ff5f00;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: 3px solid white;
  cursor: pointer;
}

.avatar-menu {
  position: absolute;
  top: 120%;
  left: 0;
  width: 220px;
  background: white;
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 100;
}

.avatar-menu button {
  width: 100%;
  padding: 10px 14px;
  border: none;
  background: none;
  text-align: left;
  border-radius: 10px;
  font-weight: 600;
  color: #333;
}

.user-name {
  color: white;
  font-weight: 700;
  margin: 0;
}

.verify-icon {
  color: #ff5f00;
}

.role-badge {
  background: rgba(255, 95, 0, .2);
  color: #ff9a5c;
  border: 1px solid rgba(255, 95, 0, .3);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
}

/* --- OLD TAB STYLE (RETAINED) --- */
.tab-container {
  background: #ffffff;
  border-bottom: 1px solid #ddd;
}

.tabs {
  display: flex;
  gap: 30px;
  padding: 0;
}

.tab {
  color: #777;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 20px 0;
  border-bottom: 3px solid transparent;
}

.tab.active {
  color: #ff5f00;
  border-bottom: 3px solid #ff5f00;
}

/* --- BOOKING CARDS --- */
.modern-booking-card {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.4s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.modern-booking-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.image-area {
  position: relative;
  height: 210px;
  margin: 10px;
  overflow: hidden;
  border-radius: 18px;
}

.room-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.price-pill {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: #031c36;
  color: white;
  padding: 6px 14px;
  border-radius: 12px;
  font-weight: 800;
}

.price-pill span {
  font-size: 0.7rem;
  opacity: 0.8;
}

.status-glass {
  position: absolute;
  top: 12px;
  left: 12px;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.85);
  padding: 5px 12px;
  border-radius: 30px;
  font-size: 0.7rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 5px;
  color: #031c36;
  text-transform: uppercase;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.pending {
  color: #f59e0b;
}

.approved {
  color: #10b981;
}

.rejected {
  color: #ef4444;
}

.content-area {
  padding: 8px 20px 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.location-tag {
  color: #ff5f00;
  font-weight: 700;
  font-size: 0.75rem;
  margin-bottom: 5px;
}

.room-title-card {
  font-size: 1.15rem;
  color: #031c36;
  font-weight: 700;
  margin-bottom: 12px;
}

.amenities-summary {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.amenity {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}

.card-footer-action {
  border-top: 1px solid #f1f5f9;
  padding-top: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #031c36;
  font-weight: 800;
  font-size: 0.85rem;
  margin-top: auto;
}

.arrow-circle {
  width: 32px;
  height: 32px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
}

.modern-booking-card:hover .arrow-circle {
  background: #ff5f00;
  color: white;
}

/* --- CLEAN MODERN MODAL STYLE --- */
.modern-detail-modal {
  background: #ffffff;
  border-radius: 32px;
  overflow: hidden;
}

.status-pill-lg {
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
}

.status-pill-lg.pending {
  background: #fff7ed;
  color: #f59e0b;
}

.status-pill-lg.approved {
  background: #f0fdf4;
  color: #10b981;
}

.status-pill-lg.rejected {
  background: #fef2f2;
  color: #ef4444;
}

.btn-close-modern {
  background: #f8fafc;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: #64748b;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
}

.btn-close-modern:hover {
  background: #f1f5f9;
  color: #031c36;
}

.modal-title-main {
  font-weight: 800;
  color: #031c36;
  font-size: 1.75rem;
  margin-bottom: 5px;
}

.info-ribbon {
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 20px 40px;
}

.ribbon-item .label {
  display: block;
  font-size: 0.65rem;
  color: #94a3b8;
  font-weight: 800;
  margin-bottom: 4px;
}

.ribbon-item .value {
  font-weight: 700;
  color: #031c36;
  font-size: 0.95rem;
}

.detail-subtitle {
  font-size: 0.8rem;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: 15px;
  letter-spacing: 0.5px;
}

.pricing-card-modern {
  background: #f8fafc;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #f1f5f9;
}

.main-rent {
  padding: 20px;
  background: #ffffff;
  border-bottom: 1px solid #f1f5f9;
}

.price-big {
  font-size: 1.5rem;
  font-weight: 800;
  color: #ff5f00;
}

.extra-fees {
  padding: 15px 20px;
}

.fee-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 8px;
}

.modern-tag {
  background: #ffffff;
  border: 1px solid #f1f5f9;
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
}

.user-contact-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #ffffff;
  border: 1px solid #f1f5f9;
  border-radius: 16px;
}

.contact-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.contact-icon.tenant {
  background: #eff6ff;
  color: #3b82f6;
}

.contact-icon.landlord {
  background: #fef2f2;
  color: #ef4444;
}

.contact-info .role {
  display: block;
  font-size: 0.65rem;
  font-weight: 700;
  color: #94a3b8;
}

.contact-info .name {
  font-weight: 700;
  color: #031c36;
  font-size: 0.95rem;
}

.btn-modern-map {
  display: block;
  width: 100%;
  text-align: center;
  background: #031c36;
  color: white;
  padding: 14px;
  border-radius: 16px;
  text-decoration: none;
  font-weight: 700;
  transition: 0.3s;
}

.btn-modern-map:hover {
  background: #1a5fa8;
  color: white;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .info-ribbon {
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    padding: 20px;
  }
}
</style>
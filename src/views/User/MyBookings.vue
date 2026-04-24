<template>
  <div class="profile-page">

    <div v-if="!user" class="d-flex flex-column align-items-center justify-content-center" style="min-height:60vh">
      <div class="spinner-border text-orange mb-3" style="width:3rem;height:3rem"></div>
      <p class="text-muted fw-semibold">Loading your bookings...</p>
    </div>

    <div v-else>
      <div class="hero-banner position-relative">
        <div class="container position-relative" style="z-index:2">
          <div class="d-flex align-items-end gap-4 pb-0" style="padding-top:48px">

            <div class="avatar-wrapper">
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
                  <button class="avatar-menu-item" @click="triggerUpload">
                    <i class="bi bi-cloud-arrow-up-fill me-2 text-orange"></i>Upload photo
                  </button>
                  <button v-if="user.avatar" class="avatar-menu-item text-danger" @click="removeImage">
                    <i class="bi bi-trash3-fill me-2"></i>Remove photo
                  </button>
                </div>
              </transition>
              <input ref="fileInput" type="file" hidden accept="image/*" @change="handleFileUpload" />
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
            <router-link to="/my-bookings" class="tab-item tab-active">
              <i class="bi bi-calendar-check-fill me-2"></i>Bookings
            </router-link>
            <router-link to="/my-rented" class="tab-item">
              <i class="bi bi-house-check-fill me-2"></i>Rented Rooms
            </router-link>
           
          </div>
        </div>
      </div>

      <div class="container py-4 pb-5">
        <header class="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 class="fw-bold text-navy">My Bookings</h2>
            <p class="text-muted">Total {{ pagination.total || 0 }} properties found</p>
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
                <div class="location-tag"><i class="bi bi-geo-alt-fill"></i> {{ item.room?.district?.name }}</div>
                <h5 class="room-title-card">{{ item.room?.title }}</h5>
                <div class="amenities-summary">
                  <div class="amenity"><i class="bi bi-arrows-fullscreen"></i> {{ item.room?.size_room }}m²</div>
                  <div class="amenity"><i class="bi bi-door-open"></i> {{ item.room?.bed }} Beds</div>
                </div>
                <div class="card-footer-action">
                  <span>Manage Booking</span>
                  <div class="arrow-circle"><i class="bi bi-arrow-right"></i></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-5">
          <i class="bi bi-calendar-x text-muted mb-3" style="font-size: 3rem;"></i>
          <p class="text-muted">No bookings found yet.</p>
        </div>
      </div>

      <div class="modal fade" id="bookingDetailModal" tabindex="-1" ref="modalRef">
        <div class="modal-dialog modal-xl modal-dialog-centered">
          <div class="modal-content border-0 overflow-hidden shadow-lg" style="border-radius: 30px;">
            <div class="modal-body p-0 bg-light">
              <div class="row g-0">

                <div class="col-lg-5 position-relative d-none d-lg-block">
                  <img :src="selectedBooking?.room?.image" class="h-100 w-100 object-fit-cover" />
                  <div class="modal-image-overlay"></div>
                  <div class="position-absolute top-0 start-0 w-100 h-100 p-5 d-flex flex-column">
                    <div class="mb-auto">
                      <div class="glass-tag mb-3">
                        <span class="status-dot-lg" :class="getStatus(selectedBooking?.status).toLowerCase()"></span>
                        {{ getStatus(selectedBooking?.status) }}
                      </div>
                      <h1 class="display-6 fw-bold text-white mb-2">{{ selectedBooking?.room?.title }}</h1>
                      <p class="text-white-50"><i class="bi bi-geo-alt me-2"></i>{{
                        selectedBooking?.room?.district?.name }}</p>
                    </div>
                    <div class="id-pill-white">REF ID: #{{ selectedBooking?.id }}</div>
                  </div>
                </div>

                <div class="col-lg-7 bg-white p-4 p-md-5">
                  <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h4 class="fw-bold text-navy mb-0">Booking Details</h4>
                      <div class="title-underline"></div>
                    </div>
                    <button type="button" class="btn-close-custom" @click="closeModal"><i class="bi bi-x"></i></button>
                  </div>

                  <div class="row g-3 mb-4">
                    <div class="col-sm-6">
                      <div class="bento-item">
                        <div class="bento-icon"><i class="bi bi-calendar-check-fill"></i></div>
                        <div><small>Check-in</small>
                          <h6>{{ selectedBooking?.checkin_date }}</h6>
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-6">
                      <div class="bento-item">
                        <div class="bento-icon"><i class="bi bi-rulers"></i></div>
                        <div><small>Space</small>
                          <h6>{{ selectedBooking?.room?.size_room }}m² Total</h6>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="mb-4">
                    <p class="section-label">ROOM AMENITIES</p>
                    <div class="d-flex flex-wrap gap-2">
                      <span v-for="opt in selectedBooking?.room?.options" :key="opt.id" class="amenity-chip">
                        <i class="bi bi-check2-circle text-orange me-1"></i> {{ opt.name }}
                      </span>
                    </div>
                  </div>

                  <div class="row g-4 mb-4">
                    <div class="col-md-7">
                      <p class="section-label">ESTIMATED PAYMENT</p>
                      <div class="payment-card-premium">
                        <div class="d-flex justify-content-between mb-2">
                          <span class="text-muted small">Base Rent</span>
                          <span class="fw-bold text-navy">${{ selectedBooking?.room?.price }}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2 small">
                          <span class="text-muted">Fixed Utilities</span>
                          <span class="text-navy fw-semibold">$24.00</span>
                        </div>
                        <div class="total-box mt-3">
                          <span class="text-white-50 small fw-bold">TOTAL PER MONTH</span>
                          <h3 class="text-white mb-0">${{ (parseFloat(selectedBooking?.room?.price || 0) +
                            24).toFixed(2) }}</h3>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-5">
                      <p class="section-label">PROPERTY OWNER</p>
                      <div class="owner-card-mini">
                        <div class="landlord-avatar-lg">{{ selectedBooking?.seller?.name?.charAt(0) || 'O' }}</div>
                        <h6 class="fw-bold text-navy mb-1">{{ selectedBooking?.seller?.name || 'Owner' }}</h6>
                        <span
                          class="badge bg-success-subtle text-success rounded-pill px-3 py-2 border border-success-subtle">
                          <i class="bi bi-shield-check me-1"></i>Verified
                        </span>
                        <a v-if="selectedBooking?.room?.map_url" :href="selectedBooking.room.map_url" target="_blank"
                          class="btn btn-map-link mt-3">
                          <i class="bi bi-geo-fill me-2"></i>Map View
                        </a>
                      </div>
                    </div>
                  </div>

                  <div class="d-grid">
                    <button class="btn btn-navy-action py-3 rounded-4 fw-bold" @click="closeModal">Close
                      Overview</button>
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
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import api from '@/api/http'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle'

const user = ref(null)
const bookings = ref([])
const loadingBookings = ref(false)
const uploadingAvatar = ref(false)
const avatarPreview = ref(null)
const showActionsMenu = ref(false)
const pagination = ref({ total: 0 })
const selectedBooking = ref(null)
const modalRef = ref(null)
const fileInput = ref(null)

const fetchUser = async () => {
  try {
    const res = await api.get('/me')
    user.value = res.data.data
  } catch (err) { console.error(err) }
}

const fetchBookings = async () => {
  loadingBookings.value = true
  try {
    const res = await api.get('/profile/booking?page=1')
    bookings.value = res.data.data
    pagination.value = res.data.paginate || { total: 0 }
  } finally {
    loadingBookings.value = false
  }
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
const handleOutsideClick = () => showActionsMenu.value = false
const triggerUpload = () => { fileInput.value.click(); showActionsMenu.value = false }

const handleFileUpload = async (e) => {
  const file = e.target.files[0]; if (!file) return
  avatarPreview.value = URL.createObjectURL(file)
  const fd = new FormData(); fd.append('image', file)
  uploadingAvatar.value = true
  try {
    await api.post('/profile/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    await fetchUser()
  } finally {
    uploadingAvatar.value = false; avatarPreview.value = null
  }
}

const removeImage = async () => {
  showActionsMenu.value = false; if (!confirm('Remove profile photo?')) return
  try { await api.delete('/profile/image'); user.value.avatar = null } catch (e) { }
}

onMounted(() => {
  fetchUser(); fetchBookings()
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
  color: #ff5f00 !important;
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
  background: rgba(255, 95, 0, .2);
  color: #ff9a5c;
  border: 1px solid rgba(255, 95, 0, .3);
  font-size: .75rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
}

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
  font-size: .85rem;
  display: flex;
  align-items: center;
}

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
  font-size: .85rem;
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

.modern-booking-card {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: 0.3s;
  cursor: pointer;
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
  font-size: 0.9rem;
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

.status-glass.pending {
  color: #ffbe0b;
}

.status-glass.approved {
  color: #00ca72;
}

.status-glass.rejected {
  color: #ff4d4d;
}

.content-area {
  padding: 8px 20px 20px;
}

.location-tag {
  color: #ff5f00;
  font-weight: 700;
  font-size: 0.75rem;
  margin-bottom: 5px;
}

.room-title-card {
  font-size: 1.1rem;
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

.modal-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(3, 28, 54, 0.95), transparent);
}

.glass-tag {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 8px 20px;
  border-radius: 50px;
  display: inline-flex;
  align-items: center;
  color: white;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
}

.status-dot-lg {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 10px;
}

.status-dot-lg.pending {
  background: #ffbe0b;
  box-shadow: 0 0 10px #ffbe0b;
}

.status-dot-lg.approved {
  background: #00ca72;
  box-shadow: 0 0 10px #00ca72;
}

.id-pill-white {
  background: white;
  padding: 6px 16px;
  border-radius: 10px;
  color: #031c36;
  font-weight: 800;
  font-size: 0.8rem;
  display: inline-block;
}

.title-underline {
  width: 40px;
  height: 4px;
  background: #ff5f00;
  border-radius: 10px;
  margin-top: 5px;
}

.section-label {
  font-size: 0.7rem;
  font-weight: 800;
  color: #adb5bd;
  letter-spacing: 1.5px;
  margin-bottom: 15px;
  text-transform: uppercase;
}

.bento-item {
  background: #f8fafd;
  border: 1px solid #e9ecef;
  padding: 20px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.bento-icon {
  width: 45px;
  height: 45px;
  background: white;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff5f00;
  font-size: 1.2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.bento-item h6 {
  margin: 0;
  font-weight: 700;
  color: #031c36;
}

.amenity-chip {
  background: white;
  border: 1px solid #dee2e6;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.payment-card-premium {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 24px;
  padding: 20px;
}

.total-box {
  background: #031c36;
  border-radius: 18px;
  padding: 20px;
}

.owner-card-mini {
  background: #f8fafd;
  border: 1px solid #e9ecef;
  border-radius: 24px;
  padding: 20px;
  text-align: center;
}

.landlord-avatar-lg {
  width: 60px;
  height: 60px;
  background: #031c36;
  color: white;
  border-radius: 20px;
  font-size: 1.5rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}

.btn-map-link {
  background: #ff5f00;
  color: white;
  width: 100%;
  border-radius: 12px;
  font-weight: 700;
  padding: 10px;
  transition: 0.3s;
}

.btn-map-link:hover {
  background: #031c36;
  color: white;
}

.btn-close-custom {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #f1f3f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: 0.2s;
}

.btn-close-custom:hover {
  background: #ff5f00;
  color: white;
  transform: rotate(90deg);
}

.btn-navy-action {
  background: #031c36;
  color: white;
  transition: 0.3s;
}

.btn-navy-action:hover {
  background: #0d3a6e;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(3, 28, 54, 0.3);
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity .15s, transform .15s;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-6px);
}
</style>
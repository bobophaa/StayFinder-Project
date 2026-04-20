<template>
  <div class="profile-page">

    <div v-if="loading" class="loading-container">
      <div class="spinner-modern"></div>
      <p class="mt-3 fw-bold text-navy">Loading your stays...</p>
    </div>

    <div v-else>
      <div class="hero-banner">
        <div class="container hero-content">
          <div class="d-flex align-items-center gap-4">
            <div class="avatar-wrapper">
              <div class="avatar">
                <img v-if="avatarPreview || user?.avatar" :src="avatarPreview || user.avatar" />
                <span v-else>{{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}</span>
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

              <input ref="fileInput" type="file" hidden @change="handleFileUpload" accept="image/*" />
            </div>

            <div>
              <div class="d-flex align-items-center gap-2">
                <h2 class="user-name text-white">{{ user?.name }}</h2>
                <i class="bi bi-patch-check-fill verify-icon"></i>
              </div>
              <span class="role-badge">{{ user?.current_job || 'Verified Tenant' }}</span>
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
            <h2 class="fw-bold text-navy">My Rented Rooms</h2>
            <p class="text-muted">Total {{ pagination.total }} active rentals found</p>
          </div>
        </header>

        <div v-if="rentals.length" class="row g-4">
          <div v-for="item in rentals" :key="item.id" class="col-lg-4 col-md-6">
            <div class="modern-booking-card" @click="openDetail(item)">
              <div class="image-area">
                <img :src="item.room?.image" class="room-img" />
                <div class="price-pill">${{ item.room?.price }}<span>/mo</span></div>
                <div class="status-glass active-stay">
                  <span class="status-dot"></span> Active Stay
                </div>
              </div>

              <div class="content-area">
                <div class="location-tag">
                  <i class="bi bi-geo-alt-fill"></i> {{ item.room?.district?.name }}
                </div>
                <h5 class="room-title-card">{{ item.room?.title }}</h5>

                <div class="amenities-summary">
                  <div class="amenity">
                    <i class="bi bi-calendar3"></i> In: {{ formatDate(item.checkin_date) }}
                  </div>
                  <div class="amenity">
                    <i class="bi bi-arrows-fullscreen"></i> {{ item.room?.size_room }}m²
                  </div>
                </div>

                <div class="card-footer-action">
                  <span>View Rental Details</span>
                  <div class="arrow-circle">
                    <i class="bi bi-arrow-right"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-5">
          <h4 class="text-muted">No active rentals found.</h4>
        </div>
      </div>
    </div>

    <div class="modal fade" id="rentalDetailModal" tabindex="-1" ref="modalRef">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content modern-detail-modal border-0">
          <div class="modal-body p-0" v-if="selectedItem">

            <div class="p-4 p-md-5 pb-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <span class="status-pill-lg approved">
                  <i class="bi bi-check-circle-fill me-2"></i> Currently Active
                </span>
                <button @click="closeModal" class="btn-close-modern">
                  <i class="bi bi-x"></i>
                </button>
              </div>
              <h2 class="modal-title-main">{{ selectedItem.room?.title }}</h2>
              <p class="text-muted mb-0">
                <i class="bi bi-geo-alt-fill text-orange me-1"></i>
                {{ selectedItem.room?.district?.name }}, Phnom Penh
              </p>
            </div>

            <div class="info-ribbon">
              <div class="ribbon-item">
                <span class="label">RENTAL ID</span>
                <span class="value">#RN-{{ selectedItem.id }}</span>
              </div>
              <div class="ribbon-item">
                <span class="label">CHECK-IN</span>
                <span class="value">{{ formatDate(selectedItem.checkin_date) }}</span>
              </div>
              <div class="ribbon-item">
                <span class="label">ROOM SIZE</span>
                <span class="value">{{ selectedItem.room?.size_room }} m²</span>
              </div>
              <div class="ribbon-item">
                <span class="label">BEDS</span>
                <span class="value">{{ selectedItem.room?.bed }} Beds</span>
              </div>
            </div>

            <div class="p-4 p-md-5 pt-4">
              <div class="row g-4">
                <div class="col-md-7">
                  <h6 class="detail-subtitle">Billing Summary</h6>
                  <div class="pricing-card-modern">
                    <div class="main-rent">
                      <div class="d-flex justify-content-between align-items-center">
                        <span class="fw-bold"><i class="bi bi-cash-stack me-2"></i> Monthly Rent</span>
                        <span class="price-big">${{ selectedItem.room?.price }}</span>
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
                </div>

                <div class="col-md-5">
                  <h6 class="detail-subtitle">Support Contact</h6>
                  <div class="user-contact-card mb-3">
                    <div class="contact-icon landlord"><i class="bi bi-shield-check"></i></div>
                    <div class="contact-info">
                      <span class="role">Property Owner</span>
                      <span class="name">{{ selectedItem.seller?.name || 'Owner' }}</span>
                    </div>
                  </div>
                  <a v-if="selectedItem.room?.map_url" :href="selectedItem.room.map_url" target="_blank"
                    class="btn-modern-map">
                    <i class="bi bi-geo-alt me-2"></i> Direction
                  </a>
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
const rentals = ref([])
const loading = ref(true)
const pagination = ref({ total: 0 })
const selectedItem = ref(null)
const modalRef = ref(null)

const fileInput = ref(null)
const avatarPreview = ref(null)
const showActionsMenu = ref(false)

const tabLinks = [
  { name: 'Profile', path: '/profile', icon: 'bi-person-fill' },
  { name: 'Bookings', path: '/my-bookings', icon: 'bi-calendar-check-fill' },
  { name: 'Rented', path: '/my-rented', icon: 'bi-house-heart-fill' }
]

const fetchData = async () => {
  loading.value = true
  try {
    const [u, r] = await Promise.all([
      api.get('/me'),
      api.get('/profile/rent?page=1&per_page=20')
    ])
    user.value = u.data.data
    rentals.value = r.data.data || []
    pagination.value = r.data.paginate || { total: rentals.value.length }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const toggleMenu = () => { showActionsMenu.value = !showActionsMenu.value }
const triggerUpload = () => { fileInput.value.click(); showActionsMenu.value = false; }

const handleFileUpload = async (e) => {
  const file = e.target.files[0]; if (!file) return
  avatarPreview.value = URL.createObjectURL(file)
  const fd = new FormData(); fd.append('image', file)
  try {
    await api.post('/profile/image', fd)
    await fetchData()
  } catch (err) { console.error(err) }
}

const removeImage = async () => {
  try {
    await api.delete('/profile/image')
    if (user.value) user.value.avatar = null
    avatarPreview.value = null
    showActionsMenu.value = false
  } catch (err) { console.error(err) }
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString() : '-'

const openDetail = (item) => {
  selectedItem.value = item
  const modal = new bootstrap.Modal(modalRef.value)
  modal.show()
}

const closeModal = () => {
  const modal = bootstrap.Modal.getInstance(modalRef.value)
  if (modal) modal.hide()
}

onMounted(fetchData)
</script>

<style scoped>
.profile-page {
  background: #f4f6f9;
  min-height: 100vh;
  margin-top: 70px;
  font-family: 'Inter', sans-serif;
}

/* HEADER */
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
  width: fit-content;
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
  z-index: 5;
}

.avatar-menu {
  position: absolute;
  top: 115%;
  left: 0;
  width: 200px;
  background: white;
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.avatar-menu button {
  width: 100%;
  padding: 10px;
  border: none;
  background: none;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 8px;
}

.avatar-menu button:hover {
  background: #f8fafc;
}

.user-name {
  font-weight: 700;
  margin: 0;
}

.verify-icon {
  color: #ff5f00;
}

.role-badge {
  background: rgba(255, 95, 0, .2);
  color: #ff9a5c;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
}

/* TABS */
.tab-container {
  background: #ffffff;
  border-bottom: 1px solid #ddd;
}

.tabs {
  display: flex;
  gap: 30px;
}

.tab {
  color: #777;
  font-weight: 600;
  text-decoration: none;
  padding: 20px 0;
  border-bottom: 3px solid transparent;
  display: flex;
  gap: 8px;
  align-items: center;
}

.tab.active {
  color: #ff5f00;
  border-bottom: 3px solid #ff5f00;
}

/* CARDS */
.modern-booking-card {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: 0.3s;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.modern-booking-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

.image-area {
  position: relative;
  height: 210px;
  margin: 10px;
  border-radius: 18px;
  overflow: hidden;
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
}

.active-stay {
  color: #10b981;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
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
  flex-wrap: wrap;
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

/* MODAL */
.modern-detail-modal {
  border-radius: 32px;
  overflow: hidden;
}

.status-pill-lg {
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
}

.status-pill-lg.approved {
  background: #f0fdf4;
  color: #10b981;
}

.btn-close-modern {
  background: #f8fafc;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-title-main {
  font-weight: 800;
  color: #031c36;
  font-size: 1.75rem;
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
}

.ribbon-item .value {
  font-weight: 700;
  color: #031c36;
}

.pricing-card-modern {
  background: #f8fafc;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #f1f5f9;
}

.main-rent {
  padding: 20px;
  background: white;
  border-bottom: 1px solid #f1f5f9;
}

.price-big {
  font-size: 1.5rem;
  font-weight: 800;
  color: #ff5f00;
}

.user-contact-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
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
  background: #fef2f2;
  color: #ef4444;
}

.btn-modern-map {
  display: block;
  width: 100%;
  text-align: center;
  background: #031c36;
  color: white;
  padding: 12px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  margin-top: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .info-ribbon {
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    padding: 20px;
  }
}
</style>
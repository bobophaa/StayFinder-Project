<template>
  <div class="room-detail-page bg-light min-vh-100 pb-5">
    <!-- Loading skeleton -->
    <div v-if="roomStore.loading" class="container py-4">
      <div class="skel-line mb-3" style="width: 50%; height: 32px; border-radius: 8px"></div>
      <div class="skel-line mb-5" style="width: 30%; height: 16px; border-radius: 6px"></div>
      <div class="skel-img mb-5 rounded-4"></div>
      <div class="row g-4">
        <div class="col-lg-8">
          <div class="skel-line mb-3" style="height: 200px; border-radius: 16px"></div>
        </div>
        <div class="col-lg-4">
          <div class="skel-line" style="height: 300px; border-radius: 16px"></div>
        </div>
      </div>
    </div>

    <div v-else-if="roomStore.room" class="container py-4">
      <!-- ── Title row ── -->
      <div class="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div>
          <h2 class="fw-bold text-navy mb-1">{{ roomStore.room.title }}</h2>
          <div class="small text-muted">
            <i class="bi bi-star-fill text-warning me-1"></i>4.8 (New)
            <span class="mx-2">•</span>
            <i class="bi bi-geo-alt me-1"></i>{{ roomStore.room.district?.name }}, Phnom Penh
          </div>
        </div>
      </div>

      <!-- ── Gallery ── -->
      <div class="gallery-container mb-5">
        <div class="main-image-wrapper shadow-sm position-relative">
          <img
            :src="roomStore.room.image"
            class="img-fluid rounded-4 main-gallery-img"
            alt="Room"
          />
          <div
            @click.stop.prevent="handleToggle"
            class="heart-container position-absolute top-0 end-0 m-3"
            :class="{ 'is-active': wishlistStore.isWishlisted(roomStore.room.id) }"
          >
            <i
              :class="
                wishlistStore.isWishlisted(roomStore.room.id)
                  ? 'bi bi-heart-fill text-danger'
                  : 'bi bi-heart text-muted'
              "
            ></i>
          </div>
          <div class="promo-tag" v-if="roomStore.room.percent_promotion > 0">
            -{{ roomStore.room.percent_promotion }}% Off
          </div>
        </div>
      </div>

      <div class="row g-4">
        <!-- ── Left column ── -->
        <div class="col-lg-8">
          <!-- Host card -->
          <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <div class="d-flex align-items-center mb-4">
              <img
                :src="roomStore.room.creator?.avatar"
                class="rounded-circle me-3 border"
                width="56"
                height="56"
                style="object-fit: cover"
              />
              <div>
                <h6 class="fw-bold mb-0 text-navy">Hosted by {{ roomStore.room.creator?.name }}</h6>
                <span class="small text-muted">{{
                  roomStore.room.creator?.current_job || 'Property Owner'
                }}</span>
              </div>
            </div>
            <div class="row text-center border-top border-bottom py-3 g-0 mb-4">
              <div class="col-4 border-end">
                <i class="bi bi-door-open d-block text-navy fs-5"></i>
                <span class="small text-muted">{{ roomStore.room.bed || 1 }} Bed</span>
              </div>
              <div class="col-4 border-end">
                <i class="bi bi-droplet d-block text-navy fs-5"></i>
                <span class="small text-muted">1 Bath</span>
              </div>
              <div class="col-4">
                <i class="bi bi-arrows-fullscreen d-block text-navy fs-5"></i>
                <span class="small text-muted">{{ roomStore.room.size_room }}</span>
              </div>
            </div>
            <p class="text-secondary lh-lg mb-0">{{ roomStore.room.description }}</p>
          </div>

          <!-- Amenities -->
          <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 class="fw-bold text-navy mb-4">Amenities & Features</h5>
            <div class="row g-4">
              <div v-for="opt in roomStore.room.options" :key="opt.id" class="col-6 col-md-4">
                <div class="amenity-item d-flex align-items-center gap-3">
                  <div class="icon-box-rounded shadow-sm">
                    <i
                      v-if="opt.name.toLowerCase().includes('wifi')"
                      class="bi bi-wifi text-orange"
                    ></i>
                    <i
                      v-else-if="opt.name.toLowerCase().includes('bathroom')"
                      class="bi bi-droplet text-primary"
                    ></i>
                    <i
                      v-else-if="opt.name.toLowerCase().includes('parking')"
                      class="bi bi-p-circle text-navy"
                    ></i>
                    <i
                      v-else-if="opt.name.toLowerCase().includes('kitchen')"
                      class="bi bi-egg-fried text-success"
                    ></i>
                    <i
                      v-else-if="opt.name.toLowerCase().includes('ac')"
                      class="bi bi-snow text-info"
                    ></i>
                    <i v-else class="bi bi-check-lg text-orange"></i>
                  </div>
                  <div>
                    <span class="fw-semibold text-navy d-block">{{ opt.name }}</span>
                    <span class="small text-muted">Included</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Location -->
          <div class="card border-0 shadow-sm rounded-4 p-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="fw-bold text-navy mb-0">Location</h5>
              <span class="badge bg-light text-navy rounded-pill px-3 border">
                {{ roomStore.room.district?.name }}
              </span>
            </div>
            <div class="map-container rounded-4 overflow-hidden mb-3 shadow-inner">
              <iframe
                width="100%"
                height="350"
                style="border: 0"
                loading="lazy"
                allowfullscreen
                referrerpolicy="no-referrer-when-downgrade"
                :src="`https://www.google.com/maps?q=${roomStore.room.district?.name},Phnom+Penh&output=embed`"
              >
              </iframe>
            </div>
            <div class="d-flex align-items-start gap-2">
              <i class="bi bi-geo-alt-fill text-orange mt-1"></i>
              <div>
                <p class="text-navy fw-bold mb-0">Address in {{ roomStore.room.district?.name }}</p>
                <p class="text-muted small mb-3">Phnom Penh, Cambodia</p>
                <a
                  :href="roomStore.room.map_url"
                  target="_blank"
                  class="btn btn-outline-navy rounded-pill px-4 fw-bold"
                >
                  <i class="bi bi-cursor-fill me-2"></i>Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Right column: Booking card ── -->
        <div class="col-lg-4">
          <div class="card border-0 shadow-lg rounded-4 p-4 sticky-top" style="top: 100px">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <div>
                <span class="h3 fw-bold text-orange">${{ roomStore.room.price }}</span>
                <span class="text-navy"> /month</span>
              </div>
              <span
                v-if="roomStore.room.percent_promotion > 0"
                class="badge bg-orange-light text-orange px-3 py-2 fw-bold"
              >
                -{{ roomStore.room.percent_promotion }}% OFF
              </span>
            </div>

            <!-- Bills breakdown -->
            <div
              class="price-breakdown mb-4 rounded-3 p-3"
              style="background: #f8f9fa; border: 1.5px solid #eee"
            >
              <p class="fw-bold text-navy small mb-2">
                <i class="bi bi-receipt me-2 text-orange"></i>Monthly Bills
              </p>
              <div class="d-flex justify-content-between mb-1 small">
                <span class="text-muted"
                  ><i class="bi bi-lightning-fill text-warning me-1"></i>Electric</span
                >
                <span class="fw-bold text-navy">${{ roomStore.room.pay_electric || 0 }}</span>
              </div>
              <div class="d-flex justify-content-between mb-1 small">
                <span class="text-muted"
                  ><i class="bi bi-droplet-fill text-info me-1"></i>Water</span
                >
                <span class="fw-bold text-navy">${{ roomStore.room.pay_water || 0 }}</span>
              </div>
              <div class="d-flex justify-content-between mb-1 small">
                <span class="text-muted"
                  ><i class="bi bi-trash3-fill text-success me-1"></i>Trash</span
                >
                <span class="fw-bold text-navy">${{ roomStore.room.pay_trash || 0 }}</span>
              </div>
              <div class="d-flex justify-content-between small" v-if="roomStore.room.pay_parking">
                <span class="text-muted"
                  ><i class="bi bi-car-front-fill text-secondary me-1"></i>Parking</span
                >
                <span class="fw-bold text-navy">${{ roomStore.room.pay_parking }}</span>
              </div>
            </div>

            <button
              class="btn btn-orange w-100 py-3 fw-bold rounded-3 mb-3 shadow-sm"
              @click="openBookingModal"
            >
              <i class="bi bi-calendar-check-fill me-2"></i>Request Booking
            </button>

            <button class="btn btn-navy w-100 py-3 fw-bold rounded-3" @click="openRentModal">
              <i class="bi bi-house-check-fill me-2"></i>Rent Now
            </button>

            <p class="text-muted text-center small mt-3 mb-0">
              <i class="bi bi-shield-check me-1 text-success"></i>
              Secure & verified listing
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════
       BOOKING MODAL
  ══════════════════════════════════════ -->
  <transition name="modal-fade">
    <div v-if="showBookingModal" class="bj-modal-overlay" @click.self="showBookingModal = false">
      <div class="bj-modal">
        <!-- Header -->
        <div class="bj-modal-header">
          <div>
            <h5 class="fw-bold mb-0 text-white">
              <i class="bi bi-calendar-check-fill me-2"></i>Request Booking
            </h5>
            <small class="opacity-75">{{ roomStore.room?.title }}</small>
          </div>
          <button class="bj-modal-close" @click="showBookingModal = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="bj-modal-body">
          <!-- Room summary strip -->
          <div class="room-summary-strip mb-4">
            <div class="d-flex align-items-center gap-3">
              <div class="room-thumb">
                <img v-if="roomStore.room?.image" :src="roomStore.room.image" alt="room" />
                <i v-else class="bi bi-building text-muted"></i>
              </div>
              <div class="flex-fill">
                <div class="fw-bold text-navy small text-truncate">{{ roomStore.room?.title }}</div>
                <div class="text-muted" style="font-size: 0.75rem">
                  <i class="bi bi-geo-alt me-1 text-orange"></i
                  >{{ roomStore.room?.district?.name }}, Phnom Penh
                </div>
              </div>
              <div class="text-end">
                <div class="fw-bold text-orange">${{ roomStore.room?.price }}</div>
                <div class="text-muted" style="font-size: 0.72rem">/month</div>
              </div>
            </div>
          </div>

          <!-- Success / Error alert -->
          <transition name="alert-fade">
            <div v-if="bookingStatus" class="bj-alert mb-3" :class="bookingStatus">
              <i
                class="bi me-2"
                :class="bookingStatus === 'success' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"
              ></i>
              {{ bookingMessage }}
            </div>
          </transition>

          <!-- Check-in date -->
          <div class="bj-field mb-3">
            <label class="bj-label">Check-in Date</label>
            <div class="bj-input-wrap" :class="{ 'bj-input-err': fieldErrors.checkin }">
              <i class="bi bi-calendar-event bj-input-icon"></i>
              <input type="date" v-model="checkin_date" />
            </div>
            <div v-if="fieldErrors.checkin" class="bj-err-msg">{{ fieldErrors.checkin }}</div>
          </div>

          <!-- Payment proof -->
          <div class="bj-field mb-1">
            <label class="bj-label">Payment Proof</label>
            <label
              class="bj-upload"
              :class="{ 'bj-upload-filled': !!fileName, 'bj-upload-err': fieldErrors.file }"
            >
              <div class="bj-upload-inner">
                <i
                  class="bi"
                  :class="
                    fileName
                      ? 'bi-file-earmark-check-fill text-success'
                      : 'bi-cloud-arrow-up-fill text-orange'
                  "
                ></i>
                <span>{{ fileName || 'Click to upload payment screenshot' }}</span>
                <small v-if="!fileName" class="text-muted"
                  >ABA, Wing, or any transfer receipt</small
                >
              </div>
              <input
                type="file"
                @change="handleFileChange"
                hidden
                accept="image/*,application/pdf"
              />
            </label>
            <div v-if="fieldErrors.file" class="bj-err-msg">{{ fieldErrors.file }}</div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bj-modal-footer">
          <button class="btn-bj-reset" @click="resetBooking">
            <i class="bi bi-arrow-counterclockwise me-1"></i>Reset
          </button>
          <button class="btn-bj-submit" @click="handleBooking" :disabled="bookingLoading">
            <span v-if="bookingLoading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-check-circle-fill me-2"></i>
            {{ bookingLoading ? 'Submitting...' : 'Confirm Booking' }}
          </button>
        </div>
      </div>
    </div>
  </transition>

  <!-- ══════════════════════════════════════
       RENT MODAL
  ══════════════════════════════════════ -->
  <transition name="modal-fade">
    <div v-if="showRentModal" class="bj-modal-overlay" @click.self="showRentModal = false">
      <div class="bj-modal">
        <div class="bj-modal-header">
          <div>
            <h5 class="fw-bold mb-0 text-white">
              <i class="bi bi-house-check-fill me-2"></i>Rent This Room
            </h5>
            <small class="opacity-75">{{ roomStore.room?.title }}</small>
          </div>
          <button class="bj-modal-close" @click="showRentModal = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="bj-modal-body">
          <!-- Room summary -->
          <div class="room-summary-strip mb-4">
            <div class="d-flex align-items-center gap-3">
              <div class="room-thumb">
                <img v-if="roomStore.room?.image" :src="roomStore.room.image" alt="room" />
                <i v-else class="bi bi-building text-muted"></i>
              </div>
              <div class="flex-fill">
                <div class="fw-bold text-navy small text-truncate">{{ roomStore.room?.title }}</div>
                <div class="text-muted" style="font-size: 0.75rem">
                  <i class="bi bi-geo-alt me-1 text-orange"></i
                  >{{ roomStore.room?.district?.name }}, Phnom Penh
                </div>
              </div>
              <div class="text-end">
                <div class="fw-bold text-orange">${{ roomStore.room?.price }}</div>
                <div class="text-muted" style="font-size: 0.72rem">/month</div>
              </div>
            </div>
          </div>

          <!-- Info box -->
          <div class="rent-info-box mb-4">
            <i class="bi bi-info-circle-fill me-2 text-orange"></i>
            By clicking <strong>Confirm Rent</strong>, your request will be sent to the property
            owner for approval. Upload your payment receipt as proof.
          </div>

          <!-- Success / Error -->
          <transition name="alert-fade">
            <div v-if="rentStatus" class="bj-alert mb-3" :class="rentStatus">
              <i
                class="bi me-2"
                :class="rentStatus === 'success' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"
              ></i>
              {{ rentMessage }}
            </div>
          </transition>

          <!-- Payment proof -->
          <div class="bj-field mb-1">
            <label class="bj-label">Payment Proof</label>
            <label
              class="bj-upload"
              :class="{ 'bj-upload-filled': !!rentFileName, 'bj-upload-err': rentFieldErrors.file }"
            >
              <div class="bj-upload-inner">
                <i
                  class="bi"
                  :class="
                    rentFileName
                      ? 'bi-file-earmark-check-fill text-success'
                      : 'bi-cloud-arrow-up-fill text-orange'
                  "
                ></i>
                <span>{{ rentFileName || 'Click to upload payment screenshot' }}</span>
                <small v-if="!rentFileName" class="text-muted"
                  >ABA, Wing, or any transfer receipt</small
                >
              </div>
              <input
                type="file"
                @change="handleRentFileChange"
                hidden
                accept="image/*,application/pdf"
              />
            </label>
            <div v-if="rentFieldErrors.file" class="bj-err-msg">{{ rentFieldErrors.file }}</div>
          </div>
        </div>

        <div class="bj-modal-footer">
          <button class="btn-bj-reset" @click="resetRent">
            <i class="bi bi-arrow-counterclockwise me-1"></i>Reset
          </button>
          <button class="btn-bj-submit" @click="handleRent" :disabled="rentLoading">
            <span v-if="rentLoading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-house-check-fill me-2"></i>
            {{ rentLoading ? 'Submitting...' : 'Confirm Rent' }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRoomStore } from '@/stores/RoomStore'
import { useWishlistStore } from '@/stores/WishlistStore'
import api from '@/api/http'
import { useRouter } from 'vue-router'

const router = useRouter()

const isLoggedIn = () => {
  const user = localStorage.getItem('user')
  return !!user
}

const route = useRoute()
const roomStore = useRoomStore()
const wishlistStore = useWishlistStore()

function handleToggle() {
  if (!isLoggedIn()) {
    router.push('/login')
    return
  }

  wishlistStore.toggleWishlist(roomStore.room)
}
// ── Modal visibility ───────────────────────────────────────
const showBookingModal = ref(false)
const showRentModal = ref(false)

const openBookingModal = () => {
  if (!isLoggedIn()) {
    router.push('/login')
    return
  }

  resetBooking()
  showBookingModal.value = true
}
const openRentModal = () => {
  if (!isLoggedIn()) {
    router.push('/login')
    return
  }

  resetRent()
  showRentModal.value = true
}

// ── Booking state ──────────────────────────────────────────
const checkin_date = ref('')
const file = ref(null)
const fileName = ref(null)
const bookingStatus = ref(null)
const bookingMessage = ref('')
const bookingLoading = ref(false)
const fieldErrors = reactive({ checkin: '', file: '' })

const handleFileChange = (e) => {
  const f = e.target.files[0]
  file.value = f
  fileName.value = f?.name ?? null
  fieldErrors.file = ''
}

const validateBooking = () => {
  fieldErrors.checkin = ''
  fieldErrors.file = ''
  let ok = true
  if (!checkin_date.value) {
    fieldErrors.checkin = 'Please select a check-in date.'
    ok = false
  }
  if (!file.value) {
    fieldErrors.file = 'Please upload your payment receipt.'
    ok = false
  }
  return ok
}

const handleBooking = async () => {
  if (!validateBooking()) return
  bookingLoading.value = true
  bookingStatus.value = null
  try {
    const fd = new FormData()
    fd.append('room_id', roomStore.room.id)
    fd.append('checkin_date', checkin_date.value + ' 00:00:00')
    fd.append('transaction_file', file.value)
    const res = await api.post('/books', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    bookingStatus.value = 'success'
    bookingMessage.value = res.data?.message ?? 'Booking submitted successfully!'

    setTimeout(() => {
      showBookingModal.value = false
    }, 1500)
  } catch (err) {
    bookingStatus.value = 'error'
    bookingMessage.value = err?.response?.data?.message ?? 'Booking failed. Please try again.'
  } finally {
    bookingLoading.value = false
  }
}

const resetBooking = () => {
  checkin_date.value = ''
  file.value = null
  fileName.value = null
  bookingStatus.value = null
  bookingMessage.value = ''
  fieldErrors.checkin = ''
  fieldErrors.file = ''
}

// ── Rent state ─────────────────────────────────────────────
const rentFile = ref(null)
const rentFileName = ref(null)
const rentStatus = ref(null)
const rentMessage = ref('')
const rentLoading = ref(false)
const rentFieldErrors = reactive({ file: '' })

const handleRentFileChange = (e) => {
  const f = e.target.files[0]
  rentFile.value = f
  rentFileName.value = f?.name ?? null
  rentFieldErrors.file = ''
}

const handleRent = async () => {
  rentFieldErrors.file = ''
  if (!rentFile.value) {
    rentFieldErrors.file = 'Please upload your payment receipt.'
    return
  }
  rentLoading.value = true
  rentStatus.value = null
  try {
    const fd = new FormData()
    fd.append('room_id', roomStore.room.id)
    fd.append('transaction_file', rentFile.value)
    const res = await api.post('/rents', fd, { headers: { 'Content-Type': 'multipart/form-data' } })

    console.log(1);
    
    rentStatus.value = 'success'
    rentMessage.value = res.data?.message ?? 'Rent request submitted successfully!'
  } catch (err) {
    rentStatus.value = 'error'
    rentMessage.value = err?.response?.data?.message ?? 'Rent request failed. Please try again.'
  } finally {
    rentLoading.value = false
  }
}

const resetRent = () => {
  rentFile.value = null
  rentFileName.value = null
  rentStatus.value = null
  rentMessage.value = ''
  rentFieldErrors.file = ''
}

onMounted(async () => {
  await roomStore.fetchRoomById(route.params.id)
})
</script>

<style scoped>
/* ── Base ── */
.room-detail-page {
  margin-top: 100px;
}
.text-navy {
  color: #032142;
}
.text-orange {
  color: #ff5f00;
}
.bg-orange-light {
  background: rgba(255, 95, 0, 0.1);
}

/* ── Buttons ── */
.btn-orange {
  background-color: #ff5f00;
  color: white;
  border: none;
  transition: 0.3s;
}
.btn-orange:hover {
  background-color: #e65600;
  transform: translateY(-2px);
  color: white;
}

.btn-navy {
  background-color: #031c36;
  color: white;
  border: none;
  transition: 0.3s;
}
.btn-navy:hover {
  background-color: #0d3a6e;
  transform: translateY(-2px);
  color: white;
}

.btn-outline-navy {
  border: 2px solid #032142;
  color: #032142;
  font-weight: 600;
}
.btn-outline-navy:hover {
  background: #032142;
  color: #fff;
}

/* ── Gallery ── */
.main-gallery-img {
  width: 100%;
  height: 700px;
  object-fit: cover;
}
.promo-tag {
  position: absolute;
  top: 20px;
  left: 20px;
  background: #ff5f00;
  color: white;
  padding: 5px 15px;
  border-radius: 5px;
  font-weight: bold;
}
.heart-container {
  position: absolute;
  top: 15px;
  right: 15px;
  background: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: 0.2s;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.heart-container:hover {
  transform: scale(1.1);
}

/* ── Amenities ── */
.icon-box-rounded {
  width: 48px;
  height: 48px;
  background-color: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  transition: all 0.3s;
}
.amenity-item:hover .icon-box-rounded {
  border-color: #ff5f00;
  transform: translateY(-3px);
  background-color: rgba(255, 95, 0, 0.05);
}

/* ── Map ── */
.map-container {
  height: 300px;
  background-color: #e9ecef;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.05);
}
.map-container iframe {
  filter: grayscale(0.2) contrast(1.1);
  transition: filter 0.3s;
}
.map-container:hover iframe {
  filter: grayscale(0);
}
.shadow-inner {
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
}

/* ── Skeleton ── */
.skel-img {
  height: 500px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e4e4e4 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
.skel-line {
  display: block;
  background: linear-gradient(90deg, #f0f0f0 25%, #e4e4e4 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* ══════════════════════════════════════
   BOOKING / RENT MODAL
══════════════════════════════════════ */
.bj-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(3, 28, 54, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
}

.bj-modal {
  width: 100%;
  max-width: 480px;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(3, 28, 54, 0.3);
  animation: modalPop 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes modalPop {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(12px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Modal header */
.bj-modal-header {
  background: #031c36;
  border-bottom: 3px solid #ff5f00;
  padding: 18px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.bj-modal-close {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  border: none;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.2s;
}
.bj-modal-close:hover {
  background: rgba(255, 255, 255, 0.22);
}

/* Modal body */
.bj-modal-body {
  padding: 24px;
}

/* Room summary strip */
.room-summary-strip {
  background: #f8f9fa;
  border: 1.5px solid #eef0f2;
  border-radius: 12px;
  padding: 12px 16px;
}
.room-thumb {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  overflow: hidden;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.room-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Rent info box */
.rent-info-box {
  background: rgba(255, 95, 0, 0.06);
  border: 1px solid rgba(255, 95, 0, 0.2);
  border-left: 4px solid #ff5f00;
  border-radius: 0 10px 10px 0;
  padding: 10px 14px;
  font-size: 0.82rem;
  color: #7a3500;
}

/* Field label */
.bj-label {
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #999;
  margin-bottom: 8px;
  display: block;
}

/* Input wrap */
.bj-input-wrap {
  display: flex;
  align-items: center;
  border: 1.5px solid #eef0f2;
  border-radius: 10px;
  background: #fafbfc;
  overflow: hidden;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
.bj-input-wrap:focus-within {
  border-color: #ff5f00;
  box-shadow: 0 0 0 3px rgba(255, 95, 0, 0.1);
  background: #fff;
}
.bj-input-wrap.bj-input-err {
  border-color: #dc3545;
  background: #fff8f8;
}
.bj-input-wrap:focus-within .bj-input-icon {
  color: #ff5f00;
}

.bj-input-icon {
  padding: 0 12px;
  color: #bbb;
  font-size: 0.95rem;
  flex-shrink: 0;
}
.bj-input-wrap input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 11px 14px 11px 0;
  font-size: 0.88rem;
  color: #031c36;
  outline: none;
}

/* Upload zone */
.bj-upload {
  display: block;
  cursor: pointer;
  border: 2px dashed #d9dde2;
  border-radius: 12px;
  padding: 20px 16px;
  transition:
    border-color 0.2s,
    background 0.2s;
}
.bj-upload:hover {
  border-color: #ff5f00;
  background: rgba(255, 95, 0, 0.03);
}
.bj-upload-filled {
  border-color: #198754;
  background: #f0fff4;
  border-style: solid;
}
.bj-upload-err {
  border-color: #dc3545;
}
.bj-upload-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
}
.bj-upload-inner i {
  font-size: 1.6rem;
}
.bj-upload-inner span {
  font-size: 0.85rem;
  font-weight: 600;
  color: #031c36;
}
.bj-upload-inner small {
  font-size: 0.74rem;
}

/* Alert */
.bj-alert {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
}
.bj-alert.success {
  background: #e9faf1;
  color: #198754;
}
.bj-alert.error {
  background: #ffebee;
  color: #dc3545;
}

/* Error msg */
.bj-err-msg {
  color: #dc3545;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 5px;
}

/* Modal footer */
.bj-modal-footer {
  padding: 16px 24px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f0f0f0;
  background: #fafbfc;
}

.btn-bj-reset {
  background: transparent;
  color: #666;
  border: 1.5px solid #e9ecef;
  border-radius: 10px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-bj-reset:hover {
  background: #f0f0f0;
}

.btn-bj-submit {
  background: #ff5f00;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 24px;
  font-weight: 700;
  font-size: 0.88rem;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.15s;
}
.btn-bj-submit:hover:not(:disabled) {
  background: #e65600;
  transform: translateY(-1px);
}
.btn-bj-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Modal transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: all 0.25s;
}
.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>

<template>
  <div class="room-detail-page bg-light min-vh-100 pb-5">
    <div v-if="roomStore.loading" class="text-center py-5">
      <div class="spinner-border text-orange" role="status"></div>
    </div>

    <div v-else-if="roomStore.room" class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="fw-bold text-navy mb-1">{{ roomStore.room.title }}</h2>
          <div class="small text-muted">
            <i class="bi bi-star-fill text-warning me-1"></i> 4.8 (New)
            <span class="mx-2">•</span>
            <i class="bi bi-geo-alt me-1"></i> {{ roomStore.room.district?.name }}, Phnom Penh
          </div>
        </div>
      </div>

      <div class="gallery-container mb-5">
        <div class="main-image-wrapper shadow-sm">
          <img
            :src="roomStore.room.image"
            class="img-fluid rounded-4 main-gallery-img"
            alt="Room"
          />
          <div class="promo-tag" v-if="roomStore.room.percent_promotion > 0">
            -{{ roomStore.room.percent_promotion }}% Off
          </div>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-lg-8">
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
                <span class="small text-muted">1 Bed</span>
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

            <p class="text-secondary lh-lg mb-0">
              {{ roomStore.room.description }}
            </p>
          </div>
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

        <div class="col-lg-4">
          <div class="card border-0 shadow-lg rounded-4 p-4 sticky-top" style="top: 100px">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <div>
                <span class="h3 fw-bold text-orange">${{ roomStore.room.price }}</span>
                <span class="text-navy"> /month</span>
              </div>
            </div>

            <div class="price-breakdown mb-4 bg-light rounded-3 p-3">
              <div class="d-flex justify-content-between mb-2 small">
                <span>Electric</span>
                <span class="fw-bold text-success ">${{ roomStore.room.pay_electric }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2 small">
                <span>Water</span>
                <span class="fw-bold text-success ">${{ roomStore.room.pay_water }}</span>
              </div>
               <div class="d-flex justify-content-between mb-2 small">
                <span>Trash</span>
                <span class="fw-bold text-success ">${{ roomStore.room.pay_trash }}</span>
              </div>
            </div>

            <router-link
              to="/"
              class="btn btn-orange w-100 py-3 fw-bold rounded-3 mb-3 shadow-sm text-decoration-none"
            >
              Request Booking
            </router-link>

            <router-link
              to="/"
              class="btn btn-outline-secondary  w-100 py-3 fw-bold rounded-3 text-decoration-none text-navy"
            >
              Rent Now
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.text-navy {
  color: #032142;
}
.text-orange {
  color: #ff6600;
}
.btn-orange {
  background-color: #ff6600;
  color: white;
  border: none;
  transition: 0.3s;
}
.btn-orange:hover {
  background-color: #e65c00;
  transform: translateY(-2px);
  color: white;
}
.btn-outline-navy {
  border: 2px solid #032142;
  color: #032142;
  font-weight: 600;
}
.btn-orange,
.btn-outline-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.main-gallery-img {
  width: 100%;
  height: 500px;
  object-fit: cover;
}
.promo-tag {
  position: absolute;
  top: 20px;
  left: 20px;
  background: #ff6600;
  color: white;
  padding: 5px 15px;
  border-radius: 5px;
  font-weight: bold;
}

.map-placeholder {
  background-color: #f0f2f5;
  height: 250px;
  border: 1px dashed #ced4da;
}


.card {
  transition: box-shadow 0.3s ease;
}
.rounded-4 {
  border-radius: 16px !important;
}
.bg-light {
  background-color: #f8f9fa !important;
}
.map-container {
  height: 300px;
  background-color: #e9ecef;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.map-container iframe {
  filter: grayscale(0.2) contrast(1.1);
  transition: filter 0.3s ease;
}

.map-container:hover iframe {
  filter: grayscale(0);
}

.shadow-inner {
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
}
.icon-box-rounded {
  width: 48px;
  height: 48px;
  background-color: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  transition: all 0.3s ease;
}

.amenity-item:hover .icon-box-rounded {
  border-color: #ff6600;
  transform: translateY(-3px);
  background-color: rgba(255, 102, 0, 0.05);
}

.amenity-item span {
  font-size: 0.95rem;
}

.bi-wifi {
  color: #5dade2;
}
.bi-droplet {
  color: #3498db;
}
.bi-snow {
  color: #aed6f1;
}
.bi-egg-fried {
  color: #58d68d;
}
</style>
<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRoomStore } from '@/stores/RoomStore'

const route = useRoute()
const roomStore = useRoomStore()

onMounted(() => {
  roomStore.fetchRoomById(route.params.id)
})
</script>

<script setup>
import { reactive, onMounted, computed } from 'vue'
import { useDistrictStore } from '@/stores/DistrictStore'
import { useRoomStore } from '@/stores/RoomStore'
import RoomCard from '@/components/ui/RoomCard.vue'
import Foooter from '@/components/layout/Foooter.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import PromotionCard from '@/components/ui/PromotionCard.vue'
const districtStore = useDistrictStore()
const roomStore = useRoomStore()

const filters = reactive({
  search: '',
  district_id: '',
  price_range: '',
})
const promoRooms = computed(() => {
  return roomStore.rooms ? roomStore.rooms.filter((room) => room.percent_promotion > 0) : []
})

onMounted(async () => {
  await Promise.all([districtStore.fetchDistricts(), roomStore.fetchRooms()])
})

const featuredRooms = computed(() => {
  return roomStore.rooms ? roomStore.rooms.slice(15, 21) : []
})
</script>

<template>
  <div class="landing-page">
    <section class="hero-swiper-wrapper">
      <swiper
        :modules="[Autoplay, EffectFade, Pagination]"
        :effect="'fade'"
        :autoplay="{ delay: 5000, disableOnInteraction: false }"
        :pagination="{ clickable: true }"
        :loop="true"
        class="hero-swiper"
      >
        <swiper-slide class="hero-slide slide-2">
          <div class="hero-overlay"></div>
          <div class="container position-relative z-index-2 text-center text-white">
            <h1 class="display-3 fw-bold mb-3 animate-pop">Find Your Perfect Room Today</h1>
            <p class="fs-5 mb-5 opacity-75 mx-auto animate-pop-delay" style="width: 700px">
              Quality rooms for rent at affordable prices in the heart of Phnom Penh.
            </p>
            <div class="d-flex justify-content-center gap-3">
              <router-link to="/rooms" class="btn-banner-main px-5 py-3 shadow">
                View All Rooms
              </router-link>
            </div>
          </div>
        </swiper-slide>
        <swiper-slide class="hero-slide slide-1">
          <div class="hero-overlay"></div>
          <div class="container position-relative z-index-2 text-center text-white">
            <h1 class="display-3 fw-bold mb-3 animate-pop">Start Business with StayFinder</h1>
            <p class="fs-5 mb-5 opacity-75 mx-auto animate-pop-delay" style="max-width: 700px">
              Turn your spare space into a steady income stream. Join our trusted community today.
            </p>
            <div class="d-flex justify-content-center gap-3">
              <a
                href="https://t.me/your_admin_username"
                target="_blank"
                class="btn-main px-4 py-2 d-inline-flex align-items-center"
              >
                <i class="bi bi-telegram me-2 fs-5"></i> Contact Admin Now
              </a>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </section>
    <section class="search-container position-relative">
      <div class="container d-flex justify-content-center">
        <div class="search-card bg-white p-4 shadow-lg rounded-4 border-0">
          <div class="row g-3">
            <div class="col-12 mb-2">
              <div class="input-group modern-input shadow-sm">
                <span class="input-group-text bg-white border-0">
                  <i class="bi bi-search text-muted"></i>
                </span>
                <input
                  v-model="filters.search"
                  type="text"
                  class="form-control border-0 py-2"
                  placeholder="Search by title..."
                />
              </div>
            </div>
            <div class="col-md-4">
              <select
                v-model="filters.district_id"
                class="form-select border-1 py-2 custom-select shadow-sm"
              >
                <option value="">Select District</option>
                <option v-for="dist in districtStore.districts" :key="dist.id" :value="dist.id">
                  {{ dist.name }}
                </option>
              </select>
            </div>
            <div class="col-md-4">
              <select
                v-model="filters.price_range"
                class="form-select border-1 py-2 custom-select shadow-sm"
              >
                <option value="">Price Range</option>
                <option value="0-100">$0 - $100</option>
                <option value="100-200">$100 - $200</option>
              </select>
            </div>
            <div class="col-md-4">
              <button class="btn-main w-100 py-2 fw-bold">Search Now</button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section v-if="promoRooms.length > 0" class="promo-section py-5 px-3">
      <div class="container py-4">
        <h2 class="promo-title text-navy fs-bolder">Promotions HOT DEALS</h2>
        <p class="promo-subtitle">Rooms featured by top guests — grab them before they’re gone!</p>

        <div class="promo-scroll d-flex flex-nowrap gap-3 py-3">
          <div v-for="room in promoRooms" :key="room.id" class="promo-card-wrapper">
            <PromotionCard :item="room" />
          </div>
        </div>
      </div>
    </section>
    <section class="all-rooms-section py-5 px-3">
      <div class="container text-start">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="fw-bold text-navy mb-0">Featured Rooms</h3>

          <router-link to="/rooms" class="btn btn-outline-navy rounded-pill px-4 d-none d-md-block">
            View All Rooms
          </router-link>
        </div>

        <div class="row g-4">
          <div v-for="room in roomStore.rooms.slice(17, 23)" :key="room.id" class="col-md-4">
            <RoomCard :item="room" />
          </div>
        </div>

        <div class="text-center mt-5">
          <router-link to="/rooms" class="btn-banner-main px-5 py-3 shadow">
            View All Rooms<i class="bi bi-arrow-right ms-2"></i>
          </router-link>
        </div>
      </div>
    </section>
    <section class="location-section py-5 bg-white">
      <div class="container text-center mb-5">
        <h2 class="display-5 fw-bold text-navy">Special Location in Phnom Penh</h2>
        <p class="text-muted">Find your next home in the most popular districts of the capital.</p>
      </div>
      <div class="container">
        <div class="row g-4">
          <div class="col-12 col-lg-6">
            <div
              class="location-card"
              style="
                background-image: url('https://i.pinimg.com/1200x/57/d9/01/57d901d7266e7e546805e06b58959891.jpg');
              "
            >
              <div class="location-badge shadow-sm">
                <i class="bi bi-geo-alt-fill me-2"></i> Chamkar Mon
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-6">
            <div
              class="location-card"
              style="
                background-image: url('https://i.pinimg.com/1200x/71/ba/05/71ba0546a488a62a10a4a11b5ebdce31.jpg');
              "
            >
              <div class="location-badge shadow-sm">
                <i class="bi bi-geo-alt-fill me-2"></i> Chroy Changvar
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-4">
            <div
              class="location-card small-card"
              style="
                background-image: url('https://i.pinimg.com/736x/1e/60/59/1e6059202a9315e48005cfa5d9792667.jpg');
              "
            >
              <div class="location-badge shadow-sm">
                <i class="bi bi-geo-alt-fill me-2"></i> Dangkao
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-4">
            <div
              class="location-card small-card"
              style="
                background-image: url('https://i.pinimg.com/1200x/22/07/e4/2207e4a68f3881f1277f6e01351fa5f1.jpg');
              "
            >
              <div class="location-badge shadow-sm">
                <i class="bi bi-geo-alt-fill me-2"></i> Boeng Keng Kang
              </div>
            </div>
          </div>
          <div class="col-12 col-md-12 col-lg-4">
            <div
              class="location-card small-card"
              style="
                background-image: url('https://i.pinimg.com/1200x/c5/d0/f1/c5d0f14654b0437e5b5a4750637e6f88.jpg');
              "
            >
              <div class="location-badge shadow-sm">
                <i class="bi bi-geo-alt-fill me-2"></i> Doun Penh
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="features-section py-5 bg-light">
      <div class="container text-center">
        <h2 class="fw-bold text-navy display-6 mb-2">Why Choose RoomRent?</h2>
        <p class="text-muted mb-5">
          We make finding and renting rooms simple, safe, and stress-free
        </p>
        <div class="row g-4">
          <div class="col-md-6 col-lg-3">
            <div class="feature-card h-100 p-4 bg-white rounded-4 shadow-sm border-0">
              <div class="icon-circle mb-4 mx-auto bg-soft-navy text-navy">
                <i class="bi bi-shield-check fs-2"></i>
              </div>
              <h5 class="fw-bold text-navy">Verified Listings</h5>
              <p class="small text-muted mb-0">
                All rooms are verified for authenticity and safety
              </p>
            </div>
          </div>

          <div class="col-md-6 col-lg-3">
            <div class="feature-card h-100 p-4 bg-white rounded-4 shadow-sm border-0">
              <div class="icon-circle mb-4 mx-auto bg-soft-navy text-navy">
                <i class="bi bi-search fs-2"></i>
              </div>
              <h5 class="fw-bold text-navy">No Hidden Fees</h5>
              <p class="small text-muted mb-0">
                Transparent pricing with no unexpected costs during booking
              </p>
            </div>
          </div>

          <div class="col-md-6 col-lg-3">
            <div class="feature-card h-100 p-4 bg-white rounded-4 shadow-sm border-0">
              <div class="icon-circle mb-4 mx-auto bg-soft-navy text-navy">
                <i class="bi bi-currency-dollar fs-2"></i>
              </div>
              <h5 class="fw-bold text-navy">Secure Payments</h5>
              <p class="small text-muted mb-0">
                Safe transaction systems for both tenants and landlords
              </p>
            </div>
          </div>

          <div class="col-md-6 col-lg-3">
            <div class="feature-card h-100 p-4 bg-white rounded-4 shadow-sm border-0">
              <div class="icon-circle mb-4 mx-auto bg-soft-navy text-navy">
                <i class="bi bi-lightning-charge fs-2"></i>
              </div>
              <h5 class="fw-bold text-navy">Easy Management</h5>
              <p class="small text-muted mb-0">
                Tools to manage your listings and bookings from one place
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="provider-info py-5 mt-5">
        <div class="container">
          <div class="row align-items-center bg-white shadow-sm rounded-5 overflow-hidden">
            <div class="col-lg-5 p-0 d-none d-lg-block">
              <img
                src="https://agentplus-s3.s3.eu-west-2.amazonaws.com/bluestoneproperties/articles/2024/11/18/eef9f9bc-3889-44c2-919f-ccc71a656444.jpg"
                class="img-fluid h-100"
                style="object-fit: cover; min-height: 500px"
              />
            </div>

            <div class="col-lg-7 p-5">
              <h2 class="fw-bold text-navy mb-3">Start your rental business with StayFinder</h2>
              <p class="text-muted mb-4">
                Earn extra income by renting out your spare room. Our team will help you set up your
                account and verify your first listing to ensure the best quality for our students.
              </p>

              <div class="benefits-list mb-5">
                <div class="d-flex mb-3">
                  <i class="bi bi-check-circle-fill text-orange me-3 fs-4"></i>
                  <span>Free listing for the first 3 months.</span>
                </div>
                <div class="d-flex mb-3">
                  <i class="bi bi-check-circle-fill text-orange me-3 fs-4"></i>
                  <span>Direct dashboard to manage your rooms.</span>
                </div>
                <div class="d-flex mb-3">
                  <i class="bi bi-check-circle-fill text-orange me-3 fs-4"></i>
                  <span>24/7 support for all providers.</span>
                </div>
              </div>
              <div class="contact-box p-4 rounded-4 bg-light border">
                <h6 class="fw-bold text-navy mb-2">Ready to start?</h6>
                <p class="small text-muted mb-3">
                  Contact our Admin on Telegram to verify your identity and get your Provider
                  access.
                </p>
                <a
                  href="https://t.me/your_admin_username"
                  target="_blank"
                  class="btn-main px-4 py-2 d-inline-flex align-items-center"
                >
                  <i class="bi bi-telegram me-2 fs-5"></i> Contact Admin Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <Foooter />
</template>

<style scoped>
.promo-scroll {
  overflow-x: auto;
  display: flex;
  gap: 12px;

  padding-right: 20px;
}

.promo-scroll::-webkit-scrollbar {
  height: 6px;
}

.promo-scroll::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}

.text-navy {
  color: #032142;
}
.text-orange {
  color: #ff5f00;
}

.promo-section {
  background: linear-gradient(180deg, #ffffff 0%, #f5f9ff 40%, #032142 100%);
}
.hero-swiper-wrapper {
  height: 85vh;
  width: 100%;
  overflow: hidden;
}
.hero-swiper {
  height: 100%;
}
.hero-slide {
  position: relative;
  display: flex;
  align-items: center;
  background-size: cover;
  background-position: center;
}
.promo-card-wrapper {
  min-width: 320px;
  flex: 0 0 auto;
}

.slide-1 {
  background-image: url('https://onemoneyway.com/wp-content/uploads/2024/08/00a85462f7845258ad247cbb395cf0e5-1024x576.jpg');
}
.slide-2 {
  background-image: url('https://www.omnihotels.com/blog/wp-content/uploads/2015/03/nyc-new-york-city-skyline-sunset.jpg');
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(3, 33, 66, 0.55);
  z-index: 1;
}
.z-index-2 {
  z-index: 2;
}

.animate-pop {
  animation: fadeInUp 0.8s ease-out forwards;
}
.animate-pop-delay {
  animation: fadeInUp 0.8s ease-out 0.3s forwards;
  opacity: 0;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.pulse-orange {
  background-color: var(--bs-sub-main) !important;
  animation: pulse-ring 2s infinite;
}
@keyframes pulse-ring {
  0% {
    transform: scale(0.98);
    box-shadow: 0 0 0 0 rgba(255, 102, 0, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 12px rgba(255, 102, 0, 0);
  }
  100% {
    transform: scale(0.98);
    box-shadow: 0 0 0 0 rgba(255, 102, 0, 0);
  }
}

.text-navy {
  color: var(--bs-main);
}
.btn-main {
  background-color: var(--bs-sub-main);
  color: white;
  border: none;
}
.search-container {
  background-color: var(--bs-main);
  min-height: 150px;
}
.search-card {
  margin-top: -60px;
  position: relative;
  z-index: 10;
}

.text-navy {
  color: var(--bs-main);
}
.btn-main {
  background-color: var(--bs-sub-main);
  color: white;
  border: none;
}

.hero-card {
  background-color: #f9fbff;
  border: 1px solid #eef2f8;
}

.feature-card {
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
}

.icon-circle {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e9ecef;
}

.bg-soft-navy {
  background-color: rgba(3, 33, 66, 0.1);
}
.text-navy {
  color: var(--bs-main);
}
.landing-page {
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.hero-banner {
  min-height: 85vh;
  background:
    linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)),
    url('https://www.omnihotels.com/blog/wp-content/uploads/2015/03/nyc-new-york-city-skyline-sunset.jpg')
      center/cover;
}

.search-container {
  background-color: var(--bs-main);
  min-height: 180px;
}

.search-card {
  max-width: 950px;
  width: 100%;
  margin-top: -70px;
  z-index: 50;
  position: relative;
}

.modern-input {
  border: 1px solid #dee2e6;
  border-radius: 12px;
}
.custom-select {
  border-radius: 12px;
  color: #6c757d;
}

.location-card {
  position: relative;
  height: 320px;
  background-size: cover;
  background-position: center;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  cursor: pointer;
}

.location-card:hover {
  transform: scale(1.03);
}
.location-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  transition: background 0.3s ease;
}

.location-badge {
  position: relative;
  z-index: 2;
  background-color: white;
  color: var(--bs-main);
  padding: 10px 24px;
  border-radius: 50px;
  font-weight: 700;
  display: flex;
  align-items: center;
}
.promo-title {
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 800;
}

@media (max-width: 768px) {
  .search-card {
    margin-top: -40px;
    margin-inline: 15px;
  }
}
</style>

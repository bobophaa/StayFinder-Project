<template>
  <div class="room-card border-0 bg-white overflow-hidden shadow-sm">
    <router-link :to="'/rooms/' + item.id" class="text-decoration-none text-dark">
      <div class="position-relative overflow-hidden">
        <img :src="item.image" class="room-img w-100" :alt="item.title" />

        <div
          @click.stop.prevent="handleToggle"
          class="heart-container position-absolute top-0 end-0 m-3 d-flex align-items-center justify-content-center shadow-sm"
          :class="{ 'is-active': wishlistStore.isWishlisted(item.id) }"
        >
          <i :class="wishlistStore.isWishlisted(item.id) ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
        </div>
      </div>

      <div class="card-content p-4 text-start">
        <h5 class="fw-bold mb-2 room-title text-navy">{{ item.title }}</h5>

        <div class="location-box d-flex align-items-center m text-muted">
          <i class="bi bi-geo-alt-fill text-orange me-1"></i>
          <span class="small">{{ item.district?.name || 'Phnom Penh' }}</span>
        </div>
        <p class="description-text mb-2 text-muted">
          {{ item.description || 'No description available for this apartment.' }}
        </p>
        <div class="d-flex justify-content-between align-items-center pt-2">
          <div class="price-container">
            <span class="price-value text-orange fw-bold fs-3">${{ item.price }}</span>
            <span class="text-muted small">/month</span>
          </div>

          <router-link
            :to="'/rooms/' + item.id"
            class="btn btn-outline-navy btn-sm rounded-pill px-3"
          >
            View Details
          </router-link>
        </div>
      </div></router-link
    >
  </div>
</template>
<script setup>
import { useWishlistStore } from '@/stores/WishlistStore'
import { RouterLink, useRouter } from 'vue-router'

const props = defineProps({
  item: { type: Object, required: true },
})

const wishlistStore = useWishlistStore()
const router = useRouter()

const handleToggle = () => {
  const token = localStorage.getItem('token')

  if (!token) {
    router.push('/login')
    return
  }

  wishlistStore.toggleWishlist(props.item)
}
</script>

<style scoped>
.text-navy {
  color: #032142 !important;
}
.text-orange {
  color: #ff5f00 !important;
}

.room-card {
  border-radius: 24px;
  transition: transform 0.3s ease;
  border: 1px solid #f0f0f0 !important;
}

.room-card:hover {
  transform: translateY(-5px);
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
  transition: 0.2s;
  z-index: 10;
}

.heart-container.is-active {
  color: #dc3545;
}

.heart-container:hover {
  transform: scale(1.1);
  background: #fffafa;
}

.room-img {
  height: 240px;
  object-fit: cover;
}
.btn-outline-navy {
  border-color: #032142;
  color: #032142;
}
.btn-outline-navy:hover {
  background-color: #032142;
  color: white;
}
.description-text {
  display: -webkit-box;

  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 3em;
  margin-bottom: 1rem;
  color: #6c757d;
}
</style>

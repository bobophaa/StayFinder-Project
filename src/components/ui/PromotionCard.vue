<template>
  <div class="promo-card-v3 position-relative shadow-lg overflow-hidden">
    <div class="gold-shine"></div>
    <router-link :to="'/rooms/' + item.id" class="stretched-link text-decoration-none">
      <div class="image-container position-relative">
        <img :src="item.image" class="promo-img w-100" :alt="item.title" />

        <div class="discount-circle">
          <span class="fw-bold">{{ item.percent_promotion }}%</span>
          <span class="d-block small">OFF</span>
        </div>
      </div>

      <div class="card-body-v3 p-4 bg-navy text-white">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h5 class="fw-bold mb-1">{{ item.title }}</h5>

          <div
            @click.stop.prevent="handleToggle"
            class="promo-wishlist"
            :class="{ active: wishlistStore.isWishlisted(item.id) }"
          >
            <i
              :class="wishlistStore.isWishlisted(item.id) ? 'bi bi-heart-fill' : 'bi bi-heart'"
            ></i>
          </div>
        </div>

        <p class="small opacity-75 mb-3">
          <i class="bi bi-geo-alt-fill text-orange"></i> {{ item.district?.name || 'Phnom Penh' }}
        </p>

        <div class="price-box-v3 d-flex align-items-end gap-2 mb-3">
          <div class="d-flex flex-column">
            <span class="text-decoration-line-through text-white-50 fs-5">${{ item.price }}</span>
            <span class="text-orange fw-bold fs-2">${{ discountedPrice }}</span>
          </div>
          <span class="text-white-50 small mb-2">/month</span>
        </div>

        <router-link :to="'/rooms/' + item.id" class="btn btn-grab shadow-sm w-100 py-2 fw-bold">
          BOOK NOW
        </router-link>
      </div>
    </router-link>
  </div>
</template>

<style scoped>
.promo-card-v3 {
  border-radius: 28px;
  background: #031c36;
  border: 2px solid #ff5f00;
  transition: 0.4s ease;
}

.promo-card-v3:hover {
  transform: translateY(-12px);
  box-shadow: 0 20px 40px rgba(255, 95, 0, 0.3) !important;
}

.promo-img {
  height: 250px;
  object-fit: cover;
  border-radius: 26px 26px 0 0;
}

.discount-circle {
  position: absolute;
  top: 15px;
  left: 15px;
  width: 65px;
  height: 65px;
  background: #ff5f00;
  color: white;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  line-height: 1.1;
  border: 3px solid white;
  box-shadow: 0 5px 15px rgba(255, 95, 0, 0.4);
}

.exclusive-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(3, 28, 54, 0.8);
  backdrop-filter: blur(5px);
  color: #ffc107;
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 1px;
}

.limited-tag {
  color: #ff5f00;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 1px;
}

.btn-grab {
  background: linear-gradient(45deg, #ff5f00, #ff8c00);
  color: white;
  border: none;
  border-radius: 15px;
  transition: 0.3s;
}

.btn-grab:hover {
  background: white;
  color: #ff5f00;
}

.promo-wishlist {
  font-size: 1.2rem;
  cursor: pointer;
  transition: 0.2s;
}

.promo-wishlist.active {
  color: #dc3545;
}
</style>
<script setup>
import { computed } from 'vue'

import { useWishlistStore } from '@/stores/WishlistStore'

import { RouterLink, useRouter } from 'vue-router'

const props = defineProps({
  item: { type: Object, required: true },
})

const wishlistStore = useWishlistStore()

const router = useRouter()

const discountedPrice = computed(() => {
  const discount = (props.item.price * props.item.percent_promotion) / 100

  return (props.item.price - discount).toFixed(2)
})

const handleToggle = () => {
  const token = localStorage.getItem('token')

  if (!token) {
    router.push('/login')

    return
  }

  wishlistStore.toggleWishlist(props.item)
}
</script>

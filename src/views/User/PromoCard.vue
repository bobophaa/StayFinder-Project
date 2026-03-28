<template>
  <div class="promo-card shadow-lg h-100">
    <div class="image-wrapper">
      <img :src="item.image" class="w-100 h-100 object-fit-cover" :alt="item.title" />
      
      <div class="promo-ribbon">
        <span class="small">SAVE</span>
        <span class="fw-black fs-4">{{ item.percent_promotion }}%</span>
      </div>

      <div class="glass-price-tag">
        <span class="old-price text-decoration-line-through">${{ calculateOriginal(item.price, item.percent_promotion) }}</span>
        <span class="new-price">${{ item.price }}<small>/mo</small></span>
      </div>
    </div>

    <div class="promo-content p-4">
      <h5 class="fw-bold text-white mb-2 text-truncate">{{ item.title }}</h5>
      
      <div class="d-flex align-items-center mb-3">
        <i class="bi bi-geo-alt-fill text-orange me-2"></i>
        <span class="text-light-muted small">{{ item.district?.name || 'Phnom Penh' }}</span>
      </div>

      <router-link :to="'/room-details/' + item.id" class="btn btn-orange-glow w-100 py-2 fw-bold">
        GRAB THIS DEAL
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps(['item']);

const calculateOriginal = (price, percent) => {
  return (price / (1 - percent / 100)).toFixed(0);
};
</script>

<style scoped>
.promo-card {
  background: #032142; /* Navy Background */
  border-radius: 30px;
  overflow: hidden;
  border: 2px solid rgba(255, 95, 0, 0.3);
  transition: 0.4s ease;
}

.promo-card:hover {
  transform: translateY(-12px);
  border-color: #ff5f00;
  box-shadow: 0 20px 40px rgba(255, 95, 0, 0.25) !important;
}

.image-wrapper {
  position: relative;
  height: 200px;
}

.promo-ribbon {
  position: absolute;
  top: 0;
  left: 20px;
  background: #ff5f00;
  color: white;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0 0 10px 10px;
  font-weight: 800;
  z-index: 2;
}

.glass-price-tag {
  position: absolute;
  bottom: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  padding: 8px 15px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  text-align: center;
}

.old-price { font-size: 0.75rem; color: #ffab7d; display: block; }
.new-price { font-size: 1.4rem; font-weight: 800; }

.text-light-muted { color: #a0aec0; }
.btn-orange-glow {
  background: #ff5f00;
  color: white;
  border: none;
  border-radius: 12px;
  transition: 0.3s;
}

.btn-orange-glow:hover {
  background: white;
  color: #ff5f00;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.4);
}
</style>
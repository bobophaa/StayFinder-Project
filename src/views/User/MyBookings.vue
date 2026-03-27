<template>
  <div class="fade-in">
    <div class="list-header d-flex justify-content-between align-items-center mb-4">
      <h4 class="section-heading">My Bookings</h4>
      <span class="count-pill">{{ data.length }} records</span>
    </div>

    <div v-if="data.length > 0" class="custom-list">
      <div v-for="item in data" :key="item.id" class="list-card">
        <div class="list-card-content">
          <div class="list-icon"><i class="bi bi-calendar-event"></i></div>
          <span class="list-title">{{ item.name || item.title || 'Untitled Booking' }}</span>
        </div>
        <i class="bi bi-chevron-right arrow"></i>
      </div>
    </div>
    
    <div v-else class="empty-state text-center py-5">
      <i class="bi bi-calendar-x fs-1 text-muted"></i>
      <p class="text-muted mt-2">No data found in this category</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: { type: Array, default: () => [] }
})
</script>
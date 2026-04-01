<template>
  <div class="fade-in">
    <div class="list-header d-flex justify-content-between align-items-center mb-4">
      <h4 class="section-heading">My Bookings</h4>
      <span v-if="!loading" class="count-pill">{{ bookings.length }} records</span>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="text-muted mt-2">Loading...</p>
    </div>

    <div v-else-if="bookings.length > 0" class="custom-list">
      <div v-for="item in bookings" :key="item.id" class="list-card">
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
      <button @click="fetchBookings" class="btn btn-sm btn-link">Try Refreshing</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios'; // Ensure axios is installed

const bookings = ref([]);
const loading = ref(true);

const fetchBookings = async () => {
  try {
    loading.value = true;
    // Calling your specific API endpoint
    const response = await axios.get('/api/profile/booking?page=1&per_page=20');
    
    /**
     * FIX: 
     * Based on your JSON image, the list is likely inside 'response.data.data'.
     * 'response.data' contains the 'paginate' object shown in your screenshot.
     */
    bookings.value = response.data.data || [];
    
  } catch (error) {
    console.error("API Error:", error);
    bookings.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchBookings();
});
</script>

<style scoped>
.list-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #fff;
  border-radius: 12px;
  margin-bottom: 12px;
  border: 1px solid #eee;
  transition: all 0.2s ease;
}
.list-card:hover {
  background: #f8f9fa;
  transform: translateX(5px);
}
.list-card-content {
  display: flex;
  align-items: center;
  gap: 12px;
}
.list-icon {
  width: 40px;
  height: 40px;
  background: #e7f1ff;
  color: #0d6efd;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}
.count-pill {
  background: #000;
  color: #fff;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 12px;
}
.arrow {
  color: #ccc;
}
</style>
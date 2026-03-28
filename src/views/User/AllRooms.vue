<template>
  <div class="container py-5 mt-5">
    <div class="d-flex justify-content-between align-items-end mb-5 pt-4">
      <div>
        <h2 class="fw-bold display-6 text-navy mb-0">Explore Rooms</h2>
        <p class="text-muted mb-0">Find the perfect living space in Phnom Penh</p>
      </div>
      <span class="badge bg-navy px-4 py-2 rounded-pill fs-6">
        {{ roomStore.rooms.length }} Rooms Found
      </span>
    </div>

    <div v-if="roomStore.isLoading" class="text-center py-5">
      <div class="spinner-border text-orange" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else class="row g-4">
      <div 
        class="col-12 col-md-6 col-lg-4 col-xl-3" 
        v-for="room in roomStore.rooms" 
        :key="room.id"
      >
        <RoomCard :item="room" />
      </div>

      <div v-if="roomStore.rooms.length === 0" class="text-center py-5">
        <i class="bi bi-house-door text-muted display-1"></i>
        <h4 class="text-muted mt-3">No rooms matching your search.</h4>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoomStore } from "@/stores/RoomStore";
import RoomCard from "@/components/ui/RoomCard.vue";

const roomStore = useRoomStore();

onMounted(async () => {
  await roomStore.fetchRooms(); // This ensures the store gets the newest data from the DB
});
</script>

<style scoped>
.text-navy { color: #032142; }
.bg-navy { background-color: #032142; }
.text-orange { color: #FF5F00; }
</style>
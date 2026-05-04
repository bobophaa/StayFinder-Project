<template>
  <div class="wishlist">
    <NavBar />

    <div class="wishlist-wrapper py-5 mt-5">
      <div class="container mt-4">

        <div class="d-flex justify-content-between align-items-end mb-5">
          <div>
            <h1 class="fw-bold text-navy mb-1">My Wishlist</h1>
            <p class="text-muted mb-0">
              You have {{ wishlistItems.length }} saved properties
            </p>
          </div>

          <button 
            v-if="wishlistItems.length > 0"
            @click="clearAll"
            class="btn btn-link text-danger text-decoration-none small fw-bold"
          >
            <i class="bi bi-trash3 me-1"></i> Clear All
          </button>
        </div>

        <!-- EMPTY STATE -->
        <div v-if="wishlistItems.length === 0" class="text-center py-5">
          <div class="empty-icon-container mb-4">
            <i class="bi bi-heart text-light-gray display-1"></i>
          </div>

          <h3 class="fw-bold text-navy">Your wishlist is empty</h3>
          <p class="text-muted mb-4">
            Explore rooms and click the heart icon to save them here.
          </p>

          <router-link to="/rooms" class="btn-main px-5 py-3">
            Explore Rooms
          </router-link>
        </div>

      
        <div v-else class="row g-4">
          <div 
            v-for="room in wishlistItems" 
            :key="room.id"
            class="col-md-6 col-lg-4 col-xl-3"
          >
            <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100 wishlist-card">

           
              <div class="position-relative">
                <img 
                  :src="room.image" 
                  class="card-img-top"
                  :alt="room.title"
                  style="height: 220px; object-fit: cover;"
                />

             
                <button 
                  @click="removeFromWishlist(room.id)"
                  class="btn-remove-heart shadow-sm"
                  title="Remove from wishlist"
                >
                  <i class="bi bi-heart-fill text-orange"></i>
                </button>

           
                <div class="price-badge">
                  ${{ room.price }}<small>/month</small>
                </div>
              </div>

            
              <div class="card-body p-3">
                <div class="d-flex align-items-center mb-1 text-orange small fw-bold">
                  <i class="bi bi-geo-alt-fill me-1"></i>
                  {{ room.district?.name || 'Phnom Penh' }}
                </div>

                <h5 class="card-title fw-bold text-navy text-truncate mb-3">
                  {{ room.title }}
                </h5>

                <div class="d-flex justify-content-between align-items-center">
                  <div class="room-specs small text-muted">
                    <span class="me-2">
                      <i class="bi bi-door-open me-1"></i>{{ room.bed }}
                    </span>
                    <span>
                      <i class="bi bi-aspect-ratio me-1"></i>{{ room.size_room }}
                    </span>
                  </div>

                  <router-link 
                    :to="`/rooms/${room.id}`"
                    class="btn-outline-main btn-sm px-3"
                    style="font-size: 12px; padding: 5px 15px !important;"
                  >
                    View Details
                  </router-link>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useWishlistStore } from '@/stores/WishlistStore';
import NavBar from '@/components/layout/NavBar.vue';
import { confirmDelete, showToast } from '@/Utils/alert'

const wishlistStore = useWishlistStore();
const wishlistItems = computed(() => wishlistStore.items);


const removeFromWishlist = async (id: number) => {
  const confirmed = await confirmDelete("Remove this room from Favorite?");

  if (confirmed) {
    wishlistStore.removeFromWishlist(id);
    showToast('success', 'Removed from wishlist');
  }
};
const clearAll = async () => {
  const confirmed = await confirmDelete("Clear all wishlist?");

  if (confirmed) {
    wishlistStore.clearWishlist();
    showToast('success', 'Wishlist cleared');
  }
};

</script>

<style scoped>
.text-navy { color: var(--bs-main); }
.text-orange { color: var(--bs-sub-main); }

.wishlist-wrapper {
  background-color: var(--bs-bg-soft);
  min-height: 100vh;
}


.wishlist-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #f0f0f0 !important;
}
.wishlist-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 25px rgba(3, 33, 66, 0.1) !important;
}

.btn-remove-heart {
  position: absolute;
  top: 15px;
  right: 15px;
  background: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: 0.2s;
  z-index: 10;
}
.btn-remove-heart:hover {
  transform: scale(1.1);
}


.price-badge {
  position: absolute;
  bottom: 15px;
  left: 15px;
  background: var(--bs-main);
  color: white;
  padding: 5px 15px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 14px;
}

.text-light-gray { color: #dee2e6; }
</style>

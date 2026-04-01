<template>
  <div class="profile-container py-5 px-3">
    <div class="container max-width-1200">

      <header class="header-card p-4 mb-4 d-flex align-items-center">
        <div class="profile-img-container me-4 position-relative rounded-circle overflow-hidden border border-4 border-white shadow-sm">
          <img :src="user.profileImage || defaultAvatar" alt="Profile" class="main-profile-img">
        </div>

        <div class="flex-grow-1">
          <h1 class="h4 fw-bold mb-1 brand-color">{{ user.name }}</h1>
          <div class="text-muted small">
            <i class="bi bi-envelope me-1"></i> {{ user.email }}
          </div>
        </div>
      </header>

      <div class="row g-4">
        <Sidebar :items="menuItems" />

        <main class="col-lg-9 col-md-8">
          <div class="form-card p-4 p-md-5 mx-auto">
            
            <div class="d-flex align-items-center mb-5">
              <div class="security-icon-box me-3">
                <i class="bi bi-shield-lock text-white fs-4"></i>
              </div>
              <div>
                <h2 class="h5 fw-bold mb-1">Security Settings</h2>
                <p class="text-muted small mb-0">Update your password to keep your account secure</p>
              </div>
            </div>

            <form @submit.prevent="handleSubmit" class="row g-4">
              <div class="col-12">
                <label class="form-label fw-semibold text-secondary">Current Password</label>
                <input 
                  type="password" 
                  class="form-control custom-input" 
                  v-model="form.currentPassword" 
                  placeholder="Enter current password"
                >
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold text-secondary">New Password</label>
                <input 
                  type="password" 
                  class="form-control custom-input" 
                  v-model="form.newPassword" 
                  placeholder="Minimum 8 characters"
                >
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold text-secondary">Confirm New Password</label>
                <input 
                  type="password" 
                  class="form-control custom-input" 
                  v-model="form.confirmPassword" 
                  placeholder="Repeat new password"
                >
              </div>

              <div v-if="error" class="col-12">
                <div class="alert alert-danger py-2 small border-0 shadow-sm d-flex align-items-center">
                  <i class="bi bi-exclamation-circle-fill me-2"></i>
                  {{ error }}
                </div>
              </div>

              <div class="col-md-6 mt-5">
                <button type="submit" class="btn btn-save w-100 fw-bold shadow-sm">
                  Update Password
                </button>
              </div>

              <div class="col-md-6 mt-md-5">
                <button type="button" @click="resetForm" class="btn btn-cancel w-100 fw-bold">
                  Cancel
                </button>
              </div>
            </form>

          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import Sidebar from "@/components/ui/Sidebar.vue";

const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=FF5F00&color=fff';

// Mock User Data (In a real app, get this from a Pinia/Vuex store)
const user = reactive({
  name: "John Doe",
  email: "john.doe@example.com",
  profileImage: "" 
});

// Full menu items list to keep sidebar consistent across pages
const menuItems = [
  { label: 'Security', icon: 'bi-lock', path: '/security' },
  { label: 'Booking', icon: 'bi-journal-bookmark', path: '/booking' },
  { label: 'Checklist', icon: 'bi-list-check', path: '/checklist' },
  { label: 'My Rentals', icon: 'bi-house', path: '/rentals' },
  { label: 'Payment', icon: 'bi-credit-card', path: '/payment' },
];

const form = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: ""
});

const error = ref("");

const handleSubmit = () => {
  error.value = "";

  if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
    error.value = "All fields are required.";
    return;
  }

  if (form.newPassword !== form.confirmPassword) {
    error.value = "The new password confirmation does not match.";
    return;
  }

  // logic for API call would go here
  alert("Password successfully updated!");
  resetForm();
};

const resetForm = () => {
  form.currentPassword = "";
  form.newPassword = "";
  form.confirmPassword = "";
  error.value = "";
};
</script>

<style scoped>
/* layout & background */
.profile-container {
  min-height: 100vh;
  background-color: #f4f7fa;
}

.max-width-1200 {
  max-width: 1200px;
}

/* cards */
.header-card, .form-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #eef0f2;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.brand-color { color: #ff5f00; }

/* header profile image */
.profile-img-container {
  width: 90px;
  height: 90px;
  background: #eee;
}

.main-profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* security specific styles */
.security-icon-box {
  width: 50px;
  height: 50px;
  background: #ff5f00;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(255, 95, 0, 0.2);
}

/* input styling */
.custom-input {
  border-radius: 10px;
  padding: 12px 15px;
  border: 1px solid #dee2e6;
  background-color: #f9fbff;
  transition: all 0.2s ease;
}

.custom-input:focus {
  border-color: #ff5f00;
  box-shadow: 0 0 0 0.25rem rgba(255, 95, 0, 0.1);
  background-color: #fff;
}

/* button styling */
.btn-save {
  background: #ff5f00;
  color: white;
  padding: 12px;
  border-radius: 10px;
  border: none;
  transition: 0.3s;
}

.btn-save:hover {
  background: #e65500;
  transform: translateY(-1px);
}

.btn-cancel {
  background: #f1f3f5;
  color: #495057;
  padding: 12px;
  border-radius: 10px;
  border: none;
}

.btn-cancel:hover {
  background: #e9ecef;
}
</style>
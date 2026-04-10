<template>
  <div class="auth-page-wrapper">
    <div class="login-split-card">

      <!-- FORM SIDE -->
      <div class="form-container p-4 p-md-5">
        <div class="mb-5">
          <div class="logo-badge mb-4">
            <i class="bi bi-house-heart-fill me-2"></i>StayFinder
          </div>
          <h1 class="fw-bold text-navy mb-1">Welcome Back</h1>
          <p class="text-muted small">Please sign in to your account</p>
        </div>

        <form @submit.prevent="handleLogin">

          <transition name="alert-fade">
            <div v-if="authStore.error" class="alert alert-soft-orange mb-4">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ authStore.error }}
            </div>
          </transition>

          <!-- Email -->
          <div class="mb-4">
            <label class="form-label small fw-bold text-navy">Email or Phone</label>
            <div class="input-group custom-group" :class="{ 'group-invalid': submitted && !authStore.emailOrPhone }">
              <span class="input-group-text"><i class="bi bi-envelope"></i></span>
              <input
                v-model="authStore.emailOrPhone"
                type="text"
                class="form-control stay-input"
                placeholder="user@example.com"
              />
            </div>
            <small v-if="submitted && !authStore.emailOrPhone" class="text-danger mt-1 d-block">Email is required.</small>
          </div>

          <!-- Password -->
          <div class="mb-4">
            <div class="d-flex justify-content-between">
              <label class="form-label small fw-bold text-navy">Password</label>
              <RouterLink to="/forgot-password" class="text-orange small text-decoration-none fw-semibold">
                Forgot password?
              </RouterLink>
            </div>
            <div class="input-group custom-group" :class="{ 'group-invalid': submitted && !authStore.password }">
              <span class="input-group-text"><i class="bi bi-lock"></i></span>
              <input
                v-model="authStore.password"
                :type="showPass ? 'text' : 'password'"
                class="form-control stay-input"
                placeholder="••••••••"
              />
              <span class="input-group-text toggle-eye" @click="showPass = !showPass">
                <i :class="showPass ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </span>
            </div>
            <small v-if="submitted && !authStore.password" class="text-danger mt-1 d-block">Password is required.</small>
          </div>

          <button type="submit" class="btn btn-main w-100 py-3 rounded-4 fw-bold mb-4" :disabled="authStore.loading">
            <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ authStore.loading ? 'Signing in...' : 'Sign In' }}
          </button>

          <div class="text-center">
            <p class="fs-6 text-muted mb-0">
              Don't have an account?
              <RouterLink to="/register" class="text-orange fw-bold text-decoration-none">Sign up</RouterLink>
            </p>
          </div>

        </form>
      </div>

      <!-- VISUAL SIDE -->
      <div class="brand-visual d-none d-lg-flex">
        <div class="orange-glow"></div>
        <div class="visual-content text-center">
          <img src="@/assets/images/ho.svg" alt="House" class="house-illustration" />
          <h2 class="text-white fw-bold mt-3">Find Your Perfect Room</h2>
          <p class="text-white-50 px-4">Discover the best rooms with trusted landlords and great prices.</p>
          <div class="floating-badge badge-left">
            <i class="bi bi-geo-alt-fill text-orange me-1"></i> Phnom Penh
          </div>
          <div class="floating-badge badge-right">
            <i class="bi bi-star-fill text-warning me-1"></i> Top Rated
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { alertSuccess } from '@/Utils/alert'

const authStore = useAuthStore()
const router = useRouter()
const submitted = ref(false)
const showPass = ref(false)

const handleLogin = async () => {
  submitted.value = true
  const success = await authStore.login()
  if (success) {
    alertSuccess('Login Successful!')
    router.push({ name: 'home' })
  }
}
</script>

<style scoped>
.auth-page-wrapper {
  min-height: 100vh;
  position: relative;
background: linear-gradient(
  120deg,
  var(--bs-main),
  #052d5a,
  #0a3d62
);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  overflow: hidden;
}
.auth-page-wrapper::before {
  background: rgba(255, 95, 0, 0.08);
}
.auth-page-wrapper::after {
  background: rgba(255,255,255,0.05);
}

/* Glow Background */
/* .auth-page-wrapper::before,
.auth-page-wrapper::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  z-index: 0;
  pointer-events: none;
} */
.auth-page-wrapper::before {
  width: 350px; height: 350px;
  background: var(--bs-sub-main);
  top: 5%; left: 10%;
}
.auth-page-wrapper::after {
  width: 350px; height: 350px;
  background: #ffffff20;
  bottom: 5%; right: 10%;
}

/* Card */
.login-split-card {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 950px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-radius: 30px;
  overflow: hidden;
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255,255,255,0.15);
  box-shadow: 0 25px 60px rgba(0,0,0,0.4);
}

@media (max-width: 992px) {
  .login-split-card { grid-template-columns: 1fr; max-width: 500px; }
}

/* Form */
.form-container {
  background: #ffffff;
}

.logo-badge {
  display: inline-flex;
  align-items: center;
  background: var(--bs-sub-main);
  color: white;
  padding: 7px 18px;
  border-radius: 50px;
  font-size: 0.82rem;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(255, 95, 0, 0.3);
}

.text-navy { color: var(--bs-main); }
.text-orange { color: var(--bs-sub-main); }

/* Input */
.custom-group {
  border-radius: 14px;
  overflow: hidden;
  border: 1.5px solid #e5e7eb;
  background: #f9fafb;
  transition: 0.2s;
}

.custom-group:focus-within {
  border-color: var(--bs-sub-main);
  box-shadow: 0 0 0 3px rgba(var(--bs-sub-main-rgb), 0.2);
}

.group-invalid {
  border-color: var(--bs-bor-danger) !important;
}

.input-group-text {
  background: transparent;
  border: none;
  color: var(--bs-main);
}

.toggle-eye { cursor: pointer; }

.stay-input {
  height: 55px;
  border: none;
  background: transparent;
  color: var(--bs-color-dark);
}

.stay-input:focus {
  outline: none;
  box-shadow: none;
}

/* Button */
.btn-main {
  background-color: var(--bs-sub-main);
  border: none;
  color: white;
  font-size: 0.95rem;
  border-radius: 50px;
  box-shadow: 0 8px 20px rgba(255, 95, 0, 0.4);
  transition: 0.3s;
}

.btn-main:hover {
  background-color: var(--bs-sub-main-hover);
  transform: translateY(-2px);
}

/* Alert */
.alert-soft-orange {
  background: var(--bs-cus-danger);
  color: var(--bs-bor-danger);
  border-radius: 12px;
  font-size: 0.875rem;
}

/* RIGHT SIDE */
.brand-visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, var(--bs-main), #052d5a);
}

.orange-glow {
  position: absolute;
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(255,95,0,0.6), transparent);
  filter: blur(80px);
}

.visual-content { position: relative; z-index: 1; }

.house-illustration {
  width: 80%;
  max-width: 280px;
  animation: float 6s ease-in-out infinite;
}

/* Floating badges */
.floating-badge {
  position: absolute;
  background: white;
  padding: 8px 14px;
  border-radius: 50px;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--bs-main);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.badge-left { top: 20%; left: 5%; }
.badge-right { bottom: 22%; right: 5%; }

/* Animations */
@keyframes float {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
}
</style>
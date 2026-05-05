<template>
  <div class="auth-page-wrapper">
    <div class="login-split-card">

      <!-- FORM SIDE -->
      <div class="form-container p-4 p-md-5">
        <div class="mb-5">
          <div class="logo-badge mb-4">
            <i class="bi bi-house-heart-fill me-2"></i>StayFinder
          </div>
          <h1 class="fw-bold text-navy mb-1">ភ្លេចពាក្យសម្ងាត់?</h1>
          <p class="text-muted small">បញ្ចូលអ៊ីមែលរបស់អ្នកដើម្បីទទួលបានកូដ 6 តួអក្សរ។</p>
        </div>

        <form @submit.prevent="handleForgotPassword">

          <transition name="alert-fade">
            <div v-if="authStore.successMessage" class="alert alert-soft-green mb-4">
              <i class="bi bi-check-circle-fill me-2"></i> {{ authStore.successMessage }}
            </div>
          </transition>
          <transition name="alert-fade">
            <div v-if="authStore.error" class="alert alert-soft-orange mb-4">
              <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ authStore.error }}
            </div>
          </transition>

          <div class="mb-4">
            <label class="form-label small fw-bold text-navy">អ៊ីមែល</label>
            <div class="input-group custom-group" :class="{ 'group-invalid': submitted && !authStore.forgotEmail }">
              <span class="input-group-text"><i class="bi bi-envelope"></i></span>
              <input
                v-model="authStore.forgotEmail"
                type="email"
                class="form-control stay-input"
                placeholder="example@gmail.com"
              />
            </div>
            <small v-if="submitted && !authStore.forgotEmail" class="text-danger mt-1 d-block">អ៊ីមែលត្រូវបានទាមទារ</small>
          </div>

          <button type="submit" class="btn btn-main w-100 py-3 rounded-4 fw-bold mb-4" :disabled="authStore.loading">
            <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ authStore.loading ? 'Sending Code...' : 'ផ្ញើរកូដOTP' }}
          </button>

          <div class="text-center">
            <RouterLink to="/login" class="text-decoration-none text-muted small fw-bold">
              <i class="bi bi-arrow-left me-1"></i> ត្រលប់កទៅកាន់គណនី
            </RouterLink>
          </div>
        </form>
      </div>

      <!-- VISUAL SIDE -->
      <div class="brand-visual d-none d-lg-flex">
        <div class="orange-glow"></div>
        <div class="visual-content text-center">
          <img src="@/assets/images/ho.svg" alt="House" class="house-illustration" />
          <h2 class="text-white fw-bold mt-3">ផ្ទៀងផ្តាត់អ៊ីមែល</h2>
          <p class="text-white-50 px-4 small">យើងប្រើការផ្ទៀងផ្ទាត់ OTP ដើម្បីរក្សាសុវត្ថិភាពគណនី StayFinder របស់អ្នក។</p>
          <div class="floating-badge">
            <i class="bi bi-shield-check-fill me-1" style="color:#ff5f00"></i> ការផ្ទៀងផ្ទាត់សុវត្ថិភាព
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

const authStore = useAuthStore()
const router = useRouter()
const submitted = ref(false)

const handleForgotPassword = async () => {
  submitted.value = true
  authStore.error = ''
  authStore.successMessage = ''

  // ✅ Validate BEFORE calling API (old code had this AFTER)
  if (!authStore.forgotEmail) {
    authStore.error = 'Email is required.'
    return
  }

  const success = await authStore.forgotPassword(authStore.forgotEmail)
  if (success) {
    router.push({ name: 'verifyOtp' })
  }
}
</script>

<style scoped>
.auth-page-wrapper {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(120deg, var(--bs-main), rgba(var(--bs-main-rgb),0.6), var(--bs-sub-main));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  overflow: hidden;
}

.auth-page-wrapper::before,
.auth-page-wrapper::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  z-index: 0;
  pointer-events: none;
}
.auth-page-wrapper::before { width: 350px; height: 350px; background: var(--bs-main); top: 5%; left: 10%; }
.auth-page-wrapper::after { width: 350px; height: 350px; background: var(--bs-sub-main); bottom: 5%; right: 10%; }

.login-split-card {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 950px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-radius: var(--border-radius-main);
  overflow: hidden;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255,255,255,0.35);
  box-shadow: 0 25px 60px rgba(0,0,0,0.2);
  animation: fadeUp 0.6s ease;
}

@media (max-width: 992px) {
  .login-split-card { grid-template-columns: 1fr; max-width: 500px; }
}

.form-container {
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(10px);
}

.logo-badge {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, var(--bs-main), var(--bs-sub-main));
  color: var(--bs-color-light);
  padding: 7px 18px;
  border-radius: 50px;
  font-size: 0.82rem;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(var(--bs-main-rgb),0.3);
}

.text-navy { color: var(--bs-main); }

.custom-group {
  border-radius: 14px;
  overflow: hidden;
  border: 1.5px solid rgba(255,255,255,0.5);
  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(10px);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.custom-group:focus-within { border-color: var(--bs-main); box-shadow: 0 0 0 3px rgba(var(--bs-main-rgb),0.15); }
.group-invalid { border-color: var(--bs-bor-danger) !important; }

.input-group-text { background: transparent; border: none; color: var(--bs-sub-main); }
.stay-input { height: 55px; border: none; background: transparent; color: var(--bs-color-dark); }
.stay-input::placeholder { color: #aaa; }
.stay-input:focus { outline: none; box-shadow: none; background: transparent; }

.btn-main {
  background-color: var(--bs-sub-main) !important;
  border: none;
  color: var(--bs-color-light);
  border-radius: 50px;
  box-shadow: 0 10px 25px rgba(var(--bs-sub-main-rgb),0.45);
  transition: all var(--transition-fast);
}
.btn-main:hover:not(:disabled) {
  background-color: var(--bs-sub-main-hover);
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(var(--bs-sub-main-rgb),0.55);
}
.btn-main:active {
  transform: translateY(0);
  background-color: var(--bs-sub-main-active);
}

.alert-soft-orange {
  background: var(--bs-cus-danger);
  color: var(--bs-bor-danger);
  border: 1px solid rgba(var(--bs-sub-main-rgb),0.25);
  border-radius: var(--border-radius-main);
  font-size: 0.875rem;
  backdrop-filter: blur(10px);
}
.alert-soft-green {
  background: var(--bs-cus-success);
  color: var(--bs-bor-success);
  border: 1px solid rgba(var(--bs-bor-success),0.25);
  border-radius: var(--border-radius-main);
  font-size: 0.875rem;
  backdrop-filter: blur(10px);
}

.brand-visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, rgba(var(--bs-main-rgb),0.5), rgba(var(--bs-sub-main-rgb),0.2));
  overflow: hidden;
}

.orange-glow {
  position: absolute;
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(var(--bs-sub-main-rgb),0.5), transparent);
  filter: blur(80px); opacity: 0.6;
}

.visual-content { position: relative; z-index: 1; }

.house-illustration {
  width: 80%; max-width: 280px;
  animation: float 6s ease-in-out infinite;
  filter: drop-shadow(0 20px 40px rgba(0,0,0,0.15));
}

.floating-badge {
  display: inline-block;
  background: var(--bs-color-light);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--bs-main);
  margin-top: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

@keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(35px); } to { opacity: 1; transform: translateY(0); } }

.alert-fade-enter-active, .alert-fade-leave-active { transition: opacity 0.3s; }
.alert-fade-enter-from, .alert-fade-leave-to { opacity: 0; }

</style>
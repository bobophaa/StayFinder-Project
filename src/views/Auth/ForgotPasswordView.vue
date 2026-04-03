<template>
  <div class="auth-page-wrapper">
    <div class="login-split-card">

      <!-- FORM SIDE -->
      <div class="form-container p-4 p-md-5">
        <div class="mb-5">
          <div class="logo-badge mb-4">
            <i class="bi bi-house-heart-fill me-2"></i>StayFinder
          </div>
          <h1 class="fw-bold text-navy mb-1">Forgot Password</h1>
          <p class="text-muted small">Enter your email to receive a 6-character code.</p>
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
            <label class="form-label small fw-bold text-navy">Email Address</label>
            <div class="input-group custom-group" :class="{ 'group-invalid': submitted && !authStore.forgotEmail }">
              <span class="input-group-text"><i class="bi bi-envelope"></i></span>
              <input
                v-model="authStore.forgotEmail"
                type="email"
                class="form-control stay-input"
                placeholder="example@gmail.com"
              />
            </div>
            <small v-if="submitted && !authStore.forgotEmail" class="text-danger mt-1 d-block">Email is required.</small>
          </div>

          <button type="submit" class="btn btn-main w-100 py-3 rounded-4 fw-bold mb-4" :disabled="authStore.loading">
            <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ authStore.loading ? 'Sending Code...' : 'Send OTP Code' }}
          </button>

          <div class="text-center">
            <RouterLink to="/login" class="text-decoration-none text-muted small fw-bold">
              <i class="bi bi-arrow-left me-1"></i> Back to Sign In
            </RouterLink>
          </div>
        </form>
      </div>

      <!-- VISUAL SIDE -->
      <div class="brand-visual d-none d-lg-flex">
        <div class="orange-glow"></div>
        <div class="visual-content text-center">
          <img src="@/assets/images/ho.svg" alt="House" class="house-illustration" />
          <h2 class="text-white fw-bold mt-3">Verify Email</h2>
          <p class="text-white-50 px-4 small">We use OTP verification to keep your StayFinder account safe.</p>
          <div class="floating-badge">
            <i class="bi bi-shield-check-fill me-1" style="color:#ff5f00"></i> Secure Verification
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
  background: linear-gradient(120deg, #6a7cff, #8fd3f4, #fbc2eb);
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
.auth-page-wrapper::before { width: 350px; height: 350px; background: #6a7cff; top: 5%; left: 10%; }
.auth-page-wrapper::after { width: 350px; height: 350px; background: #ff9a9e; bottom: 5%; right: 10%; }

.login-split-card {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 950px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-radius: 30px;
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

.form-container { background: rgba(255,255,255,0.85); backdrop-filter: blur(10px); }

.logo-badge {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #6a7cff, #ff5f00);
  color: white;
  padding: 7px 18px;
  border-radius: 50px;
  font-size: 0.82rem;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(106,124,255,0.3);
}

.text-navy { color: #031c36; }

.custom-group {
  border-radius: 14px;
  overflow: hidden;
  border: 1.5px solid rgba(255,255,255,0.5);
  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(10px);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.custom-group:focus-within { border-color: #6a7cff; box-shadow: 0 0 0 3px rgba(106,124,255,0.15); }
.group-invalid { border-color: #dc3545 !important; }

.input-group-text { background: transparent; border: none; color: #6a7cff; }
.stay-input { height: 55px; border: none; background: transparent; color: #031c36; }
.stay-input::placeholder { color: #aaa; }
.stay-input:focus { outline: none; box-shadow: none; background: transparent; }

.btn-main {
  background: linear-gradient(135deg, #6a7cff, #7b61ff);
  border: none;
  color: white;
  box-shadow: 0 10px 25px rgba(106,124,255,0.45);
  transition: all 0.3s;
}
.btn-main:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 15px 35px rgba(106,124,255,0.55); }

.alert-soft-orange {
  background: rgba(255,95,0,0.1); color: #cc4400;
  border: 1px solid rgba(255,95,0,0.25); border-radius: 12px;
  font-size: 0.875rem; backdrop-filter: blur(10px);
}
.alert-soft-green {
  background: rgba(25,135,84,0.1); color: #0f6848;
  border: 1px solid rgba(25,135,84,0.25); border-radius: 12px;
  font-size: 0.875rem; backdrop-filter: blur(10px);
}

.brand-visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, rgba(106,124,255,0.5), rgba(255,95,0,0.2));
  overflow: hidden;
}

.orange-glow {
  position: absolute;
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(255,95,0,0.5), transparent);
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
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #031c36;
  margin-top: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

@keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(35px); } to { opacity: 1; transform: translateY(0); } }

.alert-fade-enter-active, .alert-fade-leave-active { transition: opacity 0.3s; }
.alert-fade-enter-from, .alert-fade-leave-to { opacity: 0; }
</style>
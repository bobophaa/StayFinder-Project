<template>
  <div class="auth-page-wrapper">
    <div class="login-split-card">

      <!-- FORM SIDE -->
      <div class="form-container p-4 p-md-5">
        <div class="mb-5">
          <div class="logo-badge mb-4">
            <i class="bi bi-house-heart-fill me-2"></i>StayFinder
          </div>
          <h1 class="fw-bold text-navy mb-1">ពាក្យសម្ងាត់ថ្មី</h1>
          <p class="text-muted small">កំណត់ពាក្យសម្ងាត់ខ្លាំងមួយ ដើម្បីការពារគណនីរបស់អ្នក។</p>
        </div>

        <form @submit.prevent="handleResetPassword">

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

          <!-- New Password -->
          <div class="mb-4">
            <label class="form-label small fw-bold text-navy">ពាក្យសម្ងាត់ថ្មី</label>
            <div class="input-group custom-group" :class="{ 'group-invalid': submitted && !authStore.newPassword }">
              <span class="input-group-text"><i class="bi bi-shield-lock"></i></span>
              <input
                v-model="authStore.newPassword"
                :type="showNewPass ? 'text' : 'password'"
                class="form-control stay-input"
                placeholder="••••••••"
              />
              <span class="input-group-text toggle-eye" @click="showNewPass = !showNewPass">
                <i :class="showNewPass ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </span>
            </div>
            <small v-if="submitted && !authStore.newPassword" class="text-danger mt-1 d-block">ពាក្យសម្ងាត់ថ្មីត្រូវបានទាមទារ។</small>
          </div>

          <!-- Confirm Password -->
          <div class="mb-5">
            <label class="form-label small fw-bold text-navy">បញ្ជាក់ពាក្យសម្ងាត់</label>
            <div class="input-group custom-group" :class="{ 'group-invalid': submitted && authStore.newPassword !== authStore.resetConfirmPassword }">
              <span class="input-group-text"><i class="bi bi-shield-check"></i></span>
              <input
                v-model="authStore.resetConfirmPassword"
                :type="showConfirmPass ? 'text' : 'password'"
                class="form-control stay-input"
                placeholder="••••••••"
              />
              <span class="input-group-text toggle-eye" @click="showConfirmPass = !showConfirmPass">
                <i :class="showConfirmPass ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </span>
            </div>
            <small v-if="submitted && authStore.newPassword !== authStore.resetConfirmPassword" class="text-danger mt-1 d-block">
              ពាក្យសម្ងាត់មិនត្រូវគ្នា
            </small>
          </div>

          <button type="submit" class="btn btn-main w-100 py-3 rounded-4 fw-bold mb-4" :disabled="authStore.loading">
            <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ authStore.loading ? 'Saving...' : 'រក្សាទុកពាក្យសម្ងាត់' }}
          </button>

          <div class="text-center">
            <RouterLink to="/login" class="text-decoration-none text-muted small fw-bold">
              <i class="bi bi-arrow-left me-1"></i> ត្រលប់ទៅកាន់គណនី
            </RouterLink>
          </div>
        </form>
      </div>

      <!-- VISUAL SIDE -->
      <div class="brand-visual d-none d-lg-flex">
        <div class="orange-glow"></div>
        <div class="visual-content text-center">
          <img src="@/assets/images/ho.svg" alt="Secure" class="house-illustration" />
          <h2 class="text-white fw-bold mt-3">ជំហានចុងក្រោយ</h2>
          <p class="text-white-50 px-4 small">បានធ្វើរួចហើយ! អ្នកអាចចូលគណនីបាននៅពេលដែលពាក្យសម្ងាត់របស់អ្នកត្រូវបានរក្សាទុក។</p>
          <div class="floating-badge">
            <i class="bi bi-lock-fill me-1" style="color:#ff5f00"></i> សុវត្ថិភាពជាអាទិភាព
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { alertSuccess } from '@/Utils/alert'

const authStore = useAuthStore()
const router = useRouter()
const submitted = ref(false)
const showNewPass = ref(false)
const showConfirmPass = ref(false)

const handleResetPassword = async () => {
  submitted.value = true
  if (!authStore.newPassword || authStore.newPassword !== authStore.resetConfirmPassword) return

  const success = await authStore.resetPassword()
  if (success) {
    alertSuccess('Password reset successfully!')
    setTimeout(() => {
      router.push({ name: 'login' })
    }, 1500)
  }
}

onMounted(() => {
  if (!authStore.forgotEmail || !authStore.verificationCode) {
    router.push({ name: 'forgot-password' })
  }
})
</script>

<style scoped>
.auth-page-wrapper {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(
    120deg,
    var(--bs-main),
    rgba(var(--bs-main-rgb), 0.6),
    var(--bs-sub-main)
  );
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

.auth-page-wrapper::before {
  width: 350px;
  height: 350px;
  background: var(--bs-main);
  top: 5%;
  left: 10%;
}

.auth-page-wrapper::after {
  width: 350px;
  height: 350px;
  background: var(--bs-sub-main);
  bottom: 5%;
  right: 10%;
}

.login-split-card {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 950px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-radius: var(--border-radius-main);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
  animation: fadeUp 0.6s ease;
}

@media (max-width: 992px) {
  .login-split-card {
    grid-template-columns: 1fr;
    max-width: 500px;
  }
}

.form-container {
  background: rgba(255, 255, 255, 0.85);
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
  box-shadow: 0 4px 15px rgba(var(--bs-main-rgb), 0.3);
}

.text-navy {
  color: var(--bs-color-dark);
}

.custom-group {
  border-radius: 14px;
  overflow: hidden;
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.custom-group:focus-within {
  border-color: var(--bs-main);
  box-shadow: 0 0 0 3px rgba(var(--bs-main-rgb), 0.15);
}

.group-invalid {
  border-color: var(--bs-danger) !important;
}

.input-group-text {
  background: transparent;
  border: none;
  color: var(--bs-main);
}

.toggle-eye {
  cursor: pointer;
  color: #888 !important;
}

.toggle-eye:hover {
  color: var(--bs-main) !important;
}

.stay-input {
  height: 55px;
  border: none;
  background: transparent;
  color: var(--bs-color-dark);
}

.stay-input::placeholder {
  color: var(--bs-muted);
}

.stay-input:focus {
  outline: none;
  box-shadow: none;
  background: transparent;
}

.btn-main {
  background: linear-gradient(135deg, var(--bs-main), var(--bs-sub-main));
  border: none;
  color: var(--bs-color-light);
  box-shadow: 0 10px 25px rgba(var(--bs-main-rgb), 0.45);
  transition: all 0.3s;
}

.btn-main:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(var(--bs-main-rgb), 0.55);
}

.alert-soft-orange {
  background: rgba(var(--bs-sub-main-rgb), 0.1);
  color: var(--bs-danger);
  border: 1px solid rgba(var(--bs-sub-main-rgb), 0.25);
  border-radius: 12px;
  font-size: 0.875rem;
  backdrop-filter: blur(10px);
}

.alert-soft-green {
  background: rgba(var(--bs-success-rgb), 0.1);
  color: var(--bs-success);
  border: 1px solid rgba(var(--bs-success-rgb), 0.25);
  border-radius: 12px;
  font-size: 0.875rem;
  backdrop-filter: blur(10px);
}

.brand-visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    145deg,
    rgba(var(--bs-main-rgb), 0.5),
    rgba(var(--bs-sub-main-rgb), 0.2)
  );
  overflow: hidden;
}

.orange-glow {
  position: absolute;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(var(--bs-sub-main-rgb), 0.5), transparent);
  filter: blur(80px);
  opacity: 0.6;
}

.visual-content {
  position: relative;
  z-index: 1;
}

.house-illustration {
  width: 80%;
  max-width: 280px;
  animation: float 6s ease-in-out infinite;
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.15));
}

.floating-badge {
  display: inline-block;
  background: var(--bs-color-light);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--bs-color-dark);
  margin-top: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-14px);
  }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(35px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: opacity 0.3s;
}
.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
}

</style>
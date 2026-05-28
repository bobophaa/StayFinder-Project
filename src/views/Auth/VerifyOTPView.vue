<template>
  <div class="auth-page-wrapper">
    <div class="login-split-card">

      <!-- FORM SIDE -->
      <div class="form-container p-4 p-md-5">
        <div class="mb-4">
          <div class="logo-badge mb-4">
            <i class="bi bi-house-heart-fill me-2"></i>StayFinder
          </div>
          <h1 class="fw-bold text-navy mb-1">ផ្ទៀងផ្ទាត់ OTP</h1>
          <p class="text-muted small">
            យើងបានផ្ញើកូដ ៦ តួអក្សរ ទៅកាន់អ៊ីមែលរបស់អ្នក<br />
            <span class="text-orange fw-bold">{{ authStore.forgotEmail || 'អ៊ីមែលរបស់អ្នក' }}</span>
          </p>
        </div>

        <form @submit.prevent="handleVerify">

          <transition name="alert-fade">
            <div v-if="authStore.error" class="alert alert-soft-orange mb-4">
              <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ authStore.error }}
            </div>
          </transition>
          <transition name="alert-fade">
            <div v-if="authStore.successMessage" class="alert alert-soft-green mb-4">
              <i class="bi bi-check-circle-fill me-2"></i> {{ authStore.successMessage }}
            </div>
          </transition>

          <!-- OTP Boxes -->
          <div class="d-flex justify-content-between mb-5">
           <input
  v-for="(digit, index) in code"
  :key="index"
  type="text"
  inputmode="numeric"
  maxlength="1"
  class="otp-input-glass"
  v-model="code[index]"
  @input="handleInput(index, $event)"
  @keydown="handleDelete(index, $event)"
  @paste="handlePaste($event)"
  ref="otpInputs"
/>
          </div>

          <button type="submit" class="btn btn-main w-100 py-3 rounded-4 fw-bold mb-4" :disabled="authStore.loading">
            <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ authStore.loading ? 'Verifying...' : 'ផ្ទៀងផ្ទាត់កូដ' }}
          </button>

          <div class="text-center mb-3">
            <p class="small text-muted mb-1">មិនទទួលបានកូដមែនទេ?</p>
            <button
              type="button"
              @click="handleResend"
              class="btn btn-link text-orange fw-bold text-decoration-none small p-0"
              :disabled="authStore.loading || resendCooldown > 0"
            >
              {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'ផ្ញើកូដថ្មីម្តងទៀត' }}
            </button>
          </div>

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
          <img src="@/assets/images/ho.svg" alt="House" class="house-illustration" />
          <h2 class="text-white fw-bold mt-3">ស្ទើរតែរួចរាល់ហើយ!</h2>
          <p class="text-white-50 px-4 small">សូមពិនិត្យមើលប្រអប់អ៊ីមែលរបស់អ្នក (និងថត spam) ដើម្បីរកមើលកូដផ្ទៀងផ្ទាត់។</p>
          <div class="floating-badge">
            <i class="bi bi-envelope-check-fill me-1" style="color:#ff5f00"></i> កូដផ្ទៀងផ្ទាត់ត្រូវបានផ្ញើរួចហើយ
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
const code = ref(['', '', '', '', '', ''])
const otpInputs = ref([])
const resendCooldown = ref(0)

const handleInput = (index, event) => {
  const raw = event.target.value.replace(/\D/g, '')
  const char = raw.slice(-1)

  // update state
  code.value[index] = char

  // sync displayed value
  event.target.value = char

  // move focus
  if (char && index < 5) {
    otpInputs.value[index + 1]?.focus()
  }
}


// ✅ Fix: clear current cell first, then go back if already empty
const handleDelete = (index, event) => {
  if (event.key === 'Backspace') {
    if (code.value[index]) {
      code.value[index] = ''
      event.target.value = ''
    } else if (index > 0) {
      code.value[index - 1] = ''
      otpInputs.value[index - 1].value = ''
      otpInputs.value[index - 1]?.focus()
    }
  }

  // Allow arrow key navigation
  if (event.key === 'ArrowLeft' && index > 0) {
    otpInputs.value[index - 1]?.focus()
  }
  if (event.key === 'ArrowRight' && index < 5) {
    otpInputs.value[index + 1]?.focus()
  }
}

// ✅ Bonus: handle paste (e.g. paste "123456" and fill all boxes)
const handlePaste = (event) => {
  event.preventDefault()
  const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
  pasted.split('').forEach((char, i) => {
    code.value[i] = char
    if (otpInputs.value[i]) {
      otpInputs.value[i].value = char
    }
  })
  // Focus last filled box or last box
  const lastIndex = Math.min(pasted.length, 5)
  otpInputs.value[lastIndex]?.focus()
}

const startCooldown = () => {
  resendCooldown.value = 60
  const timer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) clearInterval(timer)
  }, 1000)
}

const handleResend = async () => {
  const success = await authStore.resendCode()
  if (success) {
    alertSuccess('New code sent!')
    code.value = ['', '', '', '', '', '']
    otpInputs.value.forEach(input => { if (input) input.value = '' })
    otpInputs.value[0]?.focus()
    startCooldown()
  }
}

const handleVerify = async () => {
  const fullCode = code.value.join('')
  if (fullCode.length < 6) {
    authStore.error = 'Please enter all 6 digits.'
    return
  }
  authStore.verificationCode = fullCode
  const success = await authStore.verifyCode()
  if (success) {
    alertSuccess('Code Verified!')
    router.push({ name: 'resetPassword' })
  }
}

onMounted(() => {
  if (!authStore.forgotEmail) {
    router.push({ name: 'forgot-password' })
  }
  otpInputs.value[0]?.focus()
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
  .otp-input-glass {
    height: 52px;
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
  color: var(--bs-main);
}

.text-orange {
  color: var(--bs-sub-main);
}

.otp-input-glass {
  width: 14%;
  height: 62px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--bs-color-dark);
  background: rgba(255, 255, 255, 0.5);
  border: 1.5px solid rgba(255, 255, 255, 0.6);
  border-radius: var(--border-radius-main);
  transition: all 0.25s ease;
  backdrop-filter: blur(10px);
  /* Prevent unwanted browser behaviors */
  -webkit-appearance: none;
  appearance: none;
}

.otp-input-glass:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.8);
  border-color: var(--bs-sub-main);
  box-shadow: 0 0 0 3px rgba(var(--bs-sub-main-rgb), 0.2);
  transform: translateY(-4px) scale(1.05);
}

.btn-main {
  background: var(--bs-sub-main);
  border: none;
  color: var(--bs-color-light);
  border-radius: 50px;
  box-shadow: 0 10px 25px rgba(var(--bs-sub-main-rgb), 0.45);
  transition: all var(--transition-fast);
}
.btn-main:hover:not(:disabled) {
  background-color: var(--bs-sub-main-hover);
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(var(--bs-sub-main-rgb), 0.55);
}

.alert-soft-orange {
  background: var(--bs-cus-danger);
  color: var(--bs-bor-danger);
  border: 1px solid rgba(var(--bs-sub-main-rgb), 0.25);
  border-radius: var(--border-radius-main);
  font-size: 0.875rem;
  backdrop-filter: blur(10px);
}

.alert-soft-green {
  background: var(--bs-cus-success);
  color: var(--bs-bor-success);
  border: 1px solid rgba(var(--bs-bor-success), 0.25);
  border-radius: var(--border-radius-main);
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
  color: var(--bs-main);
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
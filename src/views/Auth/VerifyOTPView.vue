<template>
  <div class="auth-page-wrapper">
    <div class="login-split-card">

      <!-- FORM SIDE -->
      <div class="form-container p-4 p-md-5">
        <div class="mb-4">
          <div class="logo-badge mb-4">
            <i class="bi bi-house-heart-fill me-2"></i>StayFinder
          </div>
          <h1 class="fw-bold text-navy mb-1">Verify OTP</h1>
          <p class="text-muted small">
            We've sent a 6-character code to<br />
            <!-- ✅ Fixed: use forgotEmail not emailOrPhone -->
            <span class="text-orange fw-bold">{{ authStore.forgotEmail || 'your email' }}</span>
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
              maxlength="1"
              class="otp-input-glass"
              v-model="code[index]"
              @input="handleInput(index, $event)"
              @keydown.delete="handleDelete(index, $event)"
              ref="otpInputs"
            />
          </div>

          <button type="submit" class="btn btn-main w-100 py-3 rounded-4 fw-bold mb-4" :disabled="authStore.loading">
            <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ authStore.loading ? 'Verifying...' : 'Verify Code' }}
          </button>

          <div class="text-center mb-3">
            <p class="small text-muted mb-1">Didn't receive the code?</p>
            <!-- ✅ Fixed: calls resendCode() not forgotPassword() -->
            <button
              type="button"
              @click="handleResend"
              class="btn btn-link text-orange fw-bold text-decoration-none small p-0"
              :disabled="authStore.loading || resendCooldown > 0"
            >
              {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend New Code' }}
            </button>
          </div>

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
          <h2 class="text-white fw-bold mt-3">Almost There!</h2>
          <p class="text-white-50 px-4 small">Check your inbox (and spam folder) for the verification code.</p>
          <div class="floating-badge">
            <i class="bi bi-envelope-check-fill me-1" style="color:#ff5f00"></i> Check Your Email
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
  const val = event.target.value
  if (val && index < 5) {
    otpInputs.value[index + 1].focus()
  }
}

const handleDelete = (index, event) => {
  if (event.key === 'Backspace' && !code.value[index] && index > 0) {
    otpInputs.value[index - 1].focus()
  }
}

const startCooldown = () => {
  resendCooldown.value = 60
  const timer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) clearInterval(timer)
  }, 1000)
}

const handleResend = async () => {
  // ✅ Fixed: use resendCode() which reads forgotEmail from store internally
  const success = await authStore.resendCode()
  if (success) {
    alertSuccess('New code sent!')
    code.value = ['', '', '', '', '', '']
    otpInputs.value[0]?.focus()
    startCooldown()
  }
}

const handleVerify = async () => {
  const fullCode = code.value.join('')
  if (fullCode.length < 6) {
    authStore.error = 'Please enter all 6 characters.'
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
  // ✅ Fixed: guard checks forgotEmail not emailOrPhone
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
  .otp-input-glass { height: 52px; }
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
.text-orange { color: #ff5f00; }

.otp-input-glass {
  width: 14%;
  height: 62px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #031c36;
  background: rgba(255,255,255,0.5);
  border: 1.5px solid rgba(255,255,255,0.6);
  border-radius: 14px;
  transition: all 0.25s ease;
  backdrop-filter: blur(10px);
}

.otp-input-glass:focus {
  outline: none;
  background: rgba(255,255,255,0.8);
  border-color: #ff5f00;
  box-shadow: 0 0 0 3px rgba(255,95,0,0.2);
  transform: translateY(-4px) scale(1.05);
}

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
  display: flex; align-items: center; justify-content: center;
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
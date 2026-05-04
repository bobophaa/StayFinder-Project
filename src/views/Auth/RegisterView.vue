<template>
  <div class="auth-page-wrapper">
    <div class="register-card">

      <!-- FORM SIDE -->
      <div class="form-container p-4 p-md-5">
        <div class="mb-4 text-center">
          <div class="logo-badge mb-3">
            <i class="bi bi-house-heart-fill me-2"></i>StayFinder
          </div>
          <h1 class="fw-bold text-purple mb-1">Join StayFinder</h1>
          <p class="text-muted small">Create your account and explore amazing stays worldwide</p>
        </div>

        <form @submit.prevent="handleRegister">

          <transition name="alert-fade">
            <div v-if="authStore.error" class="alert alert-soft-purple mb-4">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ authStore.error }}
            </div>
          </transition>

          <!-- Full Name -->
          <div class="mb-3">
            <label class="form-label small fw-bold text-purple">Full Name</label>
            <div class="input-group custom-group" :class="{ 'group-invalid': submitted && !form.name }">
              <span class="input-group-text"><i class="bi bi-person"></i></span>
              <input v-model="form.name" type="text" class="form-control stay-input" placeholder="John Doe" />
            </div>
            <small v-if="submitted && !form.name" class="text-danger mt-1 d-block">Name is required.</small>
          </div>

          <!-- Current Job -->
          <div class="mb-3">
            <label class="form-label small fw-bold text-purple">Current Job</label>
            <div class="input-group custom-group">
              <span class="input-group-text"><i class="bi bi-briefcase"></i></span>
              <input v-model="form.current_job" type="text" class="form-control stay-input" placeholder="e.g. Web Developer" />
            </div>
          </div>

          <!-- Email -->
          <div class="mb-3">
            <label class="form-label small fw-bold text-purple">Email</label>
            <div class="input-group custom-group" :class="{ 'group-invalid': submitted && !form.email }">
              <span class="input-group-text"><i class="bi bi-envelope"></i></span>
              <input v-model="form.email" type="email" class="form-control stay-input" placeholder="user@example.com" />
            </div>
            <small v-if="submitted && !form.email" class="text-danger mt-1 d-block">Email is required.</small>
          </div>

          <!-- Password -->
          <div class="mb-3">
            <label class="form-label small fw-bold text-purple">Password</label>
            <div class="input-group custom-group" :class="{ 'group-invalid': submitted && !form.password }">
              <span class="input-group-text"><i class="bi bi-lock"></i></span>
              <input v-model="form.password" :type="showPass ? 'text' : 'password'" class="form-control stay-input" placeholder="••••••••" />
              <span class="input-group-text toggle-eye" @click="showPass = !showPass">
                <i :class="showPass ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </span>
            </div>
            <small v-if="submitted && !form.password" class="text-danger mt-1 d-block">Password is required.</small>
          </div>

          <!-- Confirm Password -->
          <div class="mb-4">
            <label class="form-label small fw-bold text-purple">Confirm Password</label>
            <div class="input-group custom-group" :class="{ 'group-invalid': submitted && form.password !== form.password_confirmation }">
              <span class="input-group-text"><i class="bi bi-shield-check"></i></span>
              <input v-model="form.password_confirmation" :type="showConfirm ? 'text' : 'password'" class="form-control stay-input" placeholder="••••••••" />
              <span class="input-group-text toggle-eye" @click="showConfirm = !showConfirm">
                <i :class="showConfirm ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </span>
            </div>
            <small v-if="submitted && form.password !== form.password_confirmation" class="text-danger mt-1 d-block">Passwords do not match.</small>
          </div>

          <button type="submit" class="btn btn-gradient w-100 py-3 rounded-4 fw-bold mb-3" :disabled="authStore.loading">
            <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ authStore.loading ? 'Creating account...' : 'Sign Up' }}
          </button>

          <div class="text-center">
            <p class="small text-muted mb-0">
              Already have an account?
              <RouterLink to="/login" class="text-purple fw-bold text-decoration-none">Sign in</RouterLink>
            </p>
          </div>

        </form>
      </div>
<!-- VISUAL SIDE -->
<div class="brand-visual d-none d-lg-flex">
  <div class="purple-glow"></div>
  <div class="visual-content text-center">
    <div class="illustration-shapes">
      <div class="shape circle"></div>
      <div class="shape square"></div>
      <div class="shape dot"></div>
      <div class="shape ring"></div>
    </div>
    <h2 class="text-white fw-bold mt-3">Start Your Adventure</h2>
    <p class="text-white-50 px-4">
      Sign up and get access to thousands of rooms &amp; exclusive offers
    </p>
    <div class="floating-badge">
      <i class="bi bi-people-fill me-1" style="color:#7b61ff"></i> 10,000+ Users
    </div>
  </div>
</div>


    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { alertSuccess } from '@/Utils/alert'

const authStore = useAuthStore()
const router = useRouter()
const submitted = ref(false)
const showPass = ref(false)
const showConfirm = ref(false)

const form = reactive({
  name: '',
  current_job: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const handleRegister = async () => {
  submitted.value = true
  if (!form.name || !form.email || !form.password) return
  if (form.password !== form.password_confirmation) return

  const success = await authStore.register(form)
  if (success) {
    alertSuccess('Account created successfully!')
    router.push('/login')
  }
}
</script>

<style scoped>
.auth-page-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(
    120deg,
    var(--bs-main),
    #052d5a,
    #0a3d62
  );
  padding: 60px 20px;
  overflow: hidden;
  position: relative;
}

/* REMOVE PURPLE GLOW */
.auth-page-wrapper::before {
  display: none;
}

/* CARD */
.register-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 980px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-radius: 30px;
  overflow: hidden;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255,255,255,0.3);
  box-shadow: 0 25px 60px rgba(0,0,0,0.25);
}

@media (max-width: 992px) {
  .register-card { grid-template-columns: 1fr; max-width: 500px; }
}

/* FORM */
.form-container {
  background: rgba(255,255,255,0.9);
}

/* LOGO */
.logo-badge {
  display: inline-flex;
  align-items: center;
  background: var(--bs-sub-main);
  color: white;
  padding: 7px 18px;
  border-radius: 50px;
  font-size: 0.82rem;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(255,95,0,0.3);
}

/* TEXT */
.text-purple {
  color: var(--bs-main); /* navy instead of purple */
}

/* INPUT */
.custom-group {
  border-radius: 14px;
  overflow: hidden;
  border: 1.5px solid #e5e7eb;
  background: #f9fafb;
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

.toggle-eye {
  cursor: pointer;
  color: #888 !important;
}

.toggle-eye:hover {
  color: var(--bs-sub-main) !important;
}

.stay-input {
  height: 50px;
  border: none;
  background: transparent;
  color: var(--bs-color-dark);
}

.stay-input:focus {
  outline: none;
  box-shadow: none;
}

/* BUTTON */
.btn-gradient {
  background: var(--bs-sub-main);
  border: none;
  color: white;
  border-radius: 50px;
  box-shadow: 0 8px 20px rgba(255,95,0,0.4);
  transition: 0.3s;
}

.btn-gradient:hover:not(:disabled) {
  background: var(--bs-sub-main-hover);
  transform: translateY(-2px);
}

/* ALERT */
.alert-soft-purple {
  background: var(--bs-cus-danger);
  color: var(--bs-bor-danger);
  border-radius: 12px;
}

/* RIGHT SIDE */
.brand-visual {
  background: linear-gradient(
    145deg,
    var(--bs-main),
    #052d5a
  );
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}


.purple-glow {
  display: none;
}


.shape {
  background: rgba(255,255,255,0.15);
}

.floating-badge {
  background: rgba(255,255,255,0.9);
  color: var(--bs-main);
}


.floating-badge i {
  color: var(--bs-sub-main) !important;
}


.brand-visual {
  background: linear-gradient(145deg, #6a11cb, #2575fc);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.purple-glow {
  position: absolute;
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(255,255,255,0.15), transparent);
  border-radius: 50%;
}
.brand-visual {
  background: var(--bs-main);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.purple-glow {
  position: absolute;
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(255,255,255,0.15), transparent);
  border-radius: 50%;
}

.shape {
  position: absolute;
  background: rgba(255, 95, 0, 0.2);
}

.circle { width: 60px; height: 60px; border-radius: 50%; top: 5%; left: 15%; animation: floatShape 6s ease-in-out infinite; }
.square { width: 45px; height: 45px; border-radius: 10px; top: 45%; left: 60%; animation: floatShape 7s ease-in-out infinite reverse; }
.dot { width: 20px; height: 20px; border-radius: 50%; top: 70%; left: 15%; animation: floatShape 5s ease-in-out infinite; }
.ring { width: 50px; height: 50px; border-radius: 50%; border: 4px solid rgba(255,95,0,0.3); background: transparent; top: 10%; left: 65%; animation: floatShape 8s ease-in-out infinite reverse; }

.floating-badge {
  display: inline-block;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--bs-main);
  margin-top: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}
@keyframes floatShape { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-16px) rotate(8deg); } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(35px); } to { opacity: 1; transform: translateY(0); } }

.alert-fade-enter-active, .alert-fade-leave-active { transition: opacity 0.3s; }
.alert-fade-enter-from, .alert-fade-leave-to { opacity: 0; }
</style>
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
          <p class="text-white-50 px-4">Sign up and get access to thousands of rooms &amp; exclusive offers</p>
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
  background: linear-gradient(120deg, #6a11cb, #2575fc, #8fd3f4);
  padding: 60px 20px;
  overflow: hidden;
  position: relative;
}

.auth-page-wrapper::before {
  content: '';
  position: absolute;
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(106,17,203,0.4), transparent);
  top: -80px; right: -80px;
  border-radius: 50%;
  filter: blur(80px);
}

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
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255,255,255,0.3);
  box-shadow: 0 25px 60px rgba(0,0,0,0.25);
  animation: fadeUp 0.6s ease;
}

@media (max-width: 992px) {
  .register-card { grid-template-columns: 1fr; max-width: 500px; }
}

.form-container { background: rgba(255,255,255,0.88); backdrop-filter: blur(10px); }

.logo-badge {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: white;
  padding: 7px 18px;
  border-radius: 50px;
  font-size: 0.82rem;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(106,17,203,0.3);
}

.text-purple { color: #6a11cb; }

.custom-group {
  border-radius: 14px;
  overflow: hidden;
  border: 1.5px solid rgba(255,255,255,0.5);
  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(10px);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.custom-group:focus-within {
  border-color: #6a11cb;
  box-shadow: 0 0 0 3px rgba(106,17,203,0.12);
}
.group-invalid { border-color: #dc3545 !important; }

.input-group-text { background: transparent; border: none; color: #6a11cb; }
.toggle-eye { cursor: pointer; color: #999 !important; }
.toggle-eye:hover { color: #6a11cb !important; }

.stay-input { height: 50px; border: none; background: transparent; color: #1a1f36; }
.stay-input::placeholder { color: #aaa; }
.stay-input:focus { outline: none; box-shadow: none; background: transparent; }

.btn-gradient {
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  border: none;
  color: white;
  box-shadow: 0 10px 25px rgba(106,17,203,0.35);
  transition: all 0.3s;
}
.btn-gradient:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(106,17,203,0.5);
}

.alert-soft-purple {
  background: rgba(106,17,203,0.08);
  color: #5a0ab0;
  border: 1px solid rgba(106,17,203,0.2);
  border-radius: 12px;
  font-size: 0.875rem;
}

/* VISUAL SIDE */
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

.visual-content { position: relative; z-index: 1; }

.illustration-shapes {
  position: relative;
  width: 200px; height: 200px;
  margin: 0 auto 10px;
}

.shape {
  position: absolute;
  background: rgba(255,255,255,0.2);
}

.circle { width: 60px; height: 60px; border-radius: 50%; top: 5%; left: 15%; animation: floatShape 6s ease-in-out infinite; }
.square { width: 45px; height: 45px; border-radius: 10px; top: 45%; left: 60%; animation: floatShape 7s ease-in-out infinite reverse; }
.dot { width: 20px; height: 20px; border-radius: 50%; top: 70%; left: 15%; animation: floatShape 5s ease-in-out infinite; }
.ring { width: 50px; height: 50px; border-radius: 50%; border: 4px solid rgba(255,255,255,0.3); background: transparent; top: 10%; left: 65%; animation: floatShape 8s ease-in-out infinite reverse; }

.floating-badge {
  display: inline-block;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #1a1f36;
  margin-top: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

@keyframes floatShape { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-16px) rotate(8deg); } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(35px); } to { opacity: 1; transform: translateY(0); } }

.alert-fade-enter-active, .alert-fade-leave-active { transition: opacity 0.3s; }
.alert-fade-enter-from, .alert-fade-leave-to { opacity: 0; }
</style>
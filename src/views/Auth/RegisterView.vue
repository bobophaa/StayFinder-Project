<template>
  <div class="auth-page-wrapper">
    <div class="register-card">
      <!-- FORM SIDE -->
      <div class="form-container p-4 p-md-5">
        <div class="mb-4 text-center">
          <div class="logo-badge mb-3"><i class="bi bi-house-heart-fill me-2"></i>StayFinder</div>
          <h1 class="fw-bold text-purple mb-1">ចូលរួមជាមួយ StayFinder</h1>
          <p class="text-muted small">បង្កើតគណនី និងស្វែងរកបន្ទប់ដ៏ល្អបំផុតសម្រាប់អ្នក</p>
        </div>

        <form @submit.prevent="handleRegister">
          <transition name="alert-fade">
            <div v-if="authStore.error" class="alert alert-soft-purple mb-4">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              {{ authStore.error }}
            </div>
          </transition>

         
      
          <!-- Full Name -->
          <div class="mb-3">
            <label class="form-label small fw-bold text-purple">
              ឈ្មោះពេញ <span class="text-danger">*</span>
            </label>
            <div
              class="input-group custom-group"
              :class="{ 'group-invalid': submitted && nameError }"
            >
              <span class="input-group-text"><i class="bi bi-person"></i></span>
              <input
                v-model="form.name"
                type="text"
                class="form-control stay-input"
                placeholder="វិចិត្រ សុភា"
                maxlength="50"
              />
            </div>
            <small v-if="submitted && !form.name" class="text-danger mt-1 d-block">
              <i class="bi bi-x-circle me-1"></i>សូមបញ្ចូលឈ្មោះរបស់អ្នក។
            </small>
            <small v-else-if="submitted && nameError" class="text-danger mt-1 d-block">
              <i class="bi bi-x-circle me-1"></i>{{ nameError }}
            </small>
            <small
              v-if="submitted && !nameError"
              class="text-muted mt-1 d-block"
              style="font-size: 0.72rem"
            >
              អក្សរខ្មែរ ឬអក្សរឡាតាំង ២–៥០ តួអក្សរ (មិនអនុញ្ញាតឱ្យប្រើលេខ)
            </small>
          </div>

          <!-- Current Job — OPTIONAL -->
          <div class="mb-3">
            <label class="form-label small fw-bold text-purple">
              មុខរបរ <span class="text-muted fw-normal"></span>
            </label>
            <div class="input-group custom-group">
              <span class="input-group-text"><i class="bi bi-briefcase"></i></span>
              <input
                v-model="form.current_job"
                type="text"
                class="form-control stay-input"
                placeholder="ឧ. អ្នកអភិវឌ្ឍន៍គេហទំព័រ"
              />
            </div>
          </div>

          <!-- Email -->
          <div class="mb-3">
            <label class="form-label small fw-bold text-purple">
              អ៊ីមែល <span class="text-danger">*</span>
            </label>

            <div
              class="input-group custom-group"
              :class="{ 'group-invalid': submitted && (emailError || emailTakenError) }"
            >
              <span class="input-group-text">
                <i class="bi bi-envelope"></i>
              </span>

              <input
                v-model="form.email"
                type="text"
                class="form-control stay-input"
                placeholder="example@gmail.com"
              />
            </div>

            <!-- validation error -->
            <small v-if="submitted && emailError" class="text-danger mt-1 d-block">
              {{ emailError }}
            </small>

            <!-- backend email already used -->
            <small v-else-if="emailTakenError" class="text-danger mt-1 d-block">
              {{ emailTakenError }}
            </small>
          </div>

          <!-- Password -->
          <div class="mb-3">
            <label class="form-label small fw-bold text-purple">
              ពាក្យសម្ងាត់ <span class="text-danger">*</span>
            </label>
            <div
              class="input-group custom-group"
              :class="{ 'group-invalid': submitted && passwordError }"
            >
              <span class="input-group-text"><i class="bi bi-lock"></i></span>
              <input
                v-model="form.password"
                :type="showPass ? 'text' : 'password'"
                class="form-control stay-input"
                placeholder="••••••••"
              />
              <span class="input-group-text toggle-eye" @click="showPass = !showPass">
                <i :class="showPass ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </span>
            </div>
            <small v-if="submitted && passwordError" class="text-danger mt-1 d-block">
              <i class="bi bi-x-circle me-1"></i>{{ passwordError }}
            </small>
            <small
              v-if="submitted && !passwordError"
              class="text-muted mt-1 d-block"
              style="font-size: 0.72rem"
            >
              យ៉ាងតិច ៨ តួអក្សរ មានអក្សរធំ អក្សរតូច និងលេខ
            </small>
          </div>

          <!-- Confirm Password -->
          <div class="mb-4">
            <label class="form-label small fw-bold text-purple">
              បញ្ជាក់ពាក្យសម្ងាត់ <span class="text-danger">*</span>
            </label>
            <div
              class="input-group custom-group"
              :class="{ 'group-invalid': submitted && confirmError }"
            >
              <span class="input-group-text"><i class="bi bi-shield-check"></i></span>
              <input
                v-model="form.password_confirmation"
                :type="showConfirm ? 'text' : 'password'"
                class="form-control stay-input"
                placeholder="••••••••"
              />
              <span class="input-group-text toggle-eye" @click="showConfirm = !showConfirm">
                <i :class="showConfirm ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </span>
            </div>
            <small v-if="submitted && confirmError" class="text-danger mt-1 d-block">
              <i class="bi bi-x-circle me-1"></i>{{ confirmError }}
            </small>
          </div>

          <button
            type="submit"
            class="btn btn-gradient w-100 py-3 rounded-4 fw-bold mb-3"
            :disabled="authStore.loading"
          >
            <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ authStore.loading ? 'កំពុងបង្កើតគណនី...' : 'បង្កើតគណនី' }}
          </button>

          <div class="text-center">
            <p class="small text-muted mb-0">
              មានគណនីរួចហើយ?
              <RouterLink to="/login" class="text-purple fw-bold text-decoration-none"
                >ចូលគណនី</RouterLink
              >
            </p>
          </div>
        </form>
      </div>

      <!-- VISUAL SIDE -->
      <div class="brand-visual d-none d-lg-flex">
        <div class="purple-glow"></div>
        <div class="visual-content text-center px-4">
          <div class="illustration-shapes">
            <div class="shape circle"></div>
            <div class="shape square"></div>
            <div class="shape dot"></div>
            <div class="shape ring"></div>
          </div>

          <h2 class="text-white fw-bold mt-3">ហេតុអ្វីគួរជ្រើសរើស StayFinder?</h2>
          <p class="text-white-50 px-2">
          បម្លែងបន្ទប់ទំនេររបស់អ្នកទៅជាចំណូលបន្ថែមប្រចាំខែ។
StayFinder ជួយអ្នកភ្ជាប់ជាមួយអ្នកជួលដែលអាចទុកចិត្តបានក្នុងរាជធានីភ្នំពេញ ដោយមានសុវត្ថិភាព ងាយស្រួល និងមានប្រសិទ្ធភាព។
          </p>

          <div class="features-list text-start mt-3 mb-3">
            <div class="feature-item">
              <i class="bi bi-check-circle-fill me-2"></i>មិនគិតថ្លៃសេវាបន្ថែម
            </div>
            <div class="feature-item">
              <i class="bi bi-check-circle-fill me-2"></i>បង្ហោះការផ្សព្វផ្សាយបានលឿន
            </div>
            <div class="feature-item">
              <i class="bi bi-check-circle-fill me-2"></i>អ្នកជួលផ្ទៀងផ្ទាត់អត្តសញ្ញាណ
            </div>
          </div>

          <div class="visual-links mb-3">
            <RouterLink to="/contact" class="visual-link">
              <i class="bi bi-telephone-fill me-1"></i>ទំនាក់ទំនង
            </RouterLink>
            <RouterLink to="/listings" class="visual-link">
              <i class="bi bi-house-fill me-1"></i>កន្លែងស្នាក់នៅ
            </RouterLink>
          </div>

          <div class="floating-badge">
            <i class="bi bi-people-fill me-1"></i> អ្នកប្រើប្រាស់ជាង ១០,០០០+ នាក់
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { alertSuccess } from '@/Utils/alert'

const authStore = useAuthStore()
const router = useRouter()
const submitted = ref(false)
const showPass = ref(false)
const showConfirm = ref(false)
const emailTakenError = ref(false)

const form = reactive({
  name: '',
  current_job: '',
  email: '',
  password: '',
  password_confirmation: '',
})

// ── Validation rules ──────────────────────────────────────────────

// Name: Khmer letters (\u1780-\u17FF) OR Latin letters + spaces, 2–50 chars, NO digits
const nameError = computed(() => {
  if (!form.name) return ''
  if (form.name.length < 2) return 'ឈ្មោះត្រូវមានយ៉ាងតិច ២ តួអក្សរ។'
  if (form.name.length > 50) return 'ឈ្មោះមិនអាចលើសពី ៥០ តួអក្សរ។'
  const validName = /^[\u1780-\u17FFa-zA-Z\s]+$/
  if (!validName.test(form.name)) return 'ឈ្មោះមិនអនុញ្ញាតឱ្យប្រើលេខ ឬសញ្ញាពិសេស។'
  return ''
})

// Email: standard format
const emailError = computed(() => {
  if (!form.email) return 'សូមបញ្ចូលអ៊ីមែលរបស់អ្នក។'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) return 'ទម្រង់អ៊ីមែលមិនត្រឹមត្រូវ។'
  return ''
})

// Password: min 8 chars, at least 1 uppercase, 1 lowercase, 1 digit
const passwordError = computed(() => {
  if (!form.password) return 'សូមបញ្ចូលពាក្យសម្ងាត់របស់អ្នក។'
  if (form.password.length < 8) return 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៨ តួអក្សរ។'
  if (!/[A-Z]/.test(form.password)) return 'ពាក្យសម្ងាត់ត្រូវមានអក្សរធំ (A–Z) យ៉ាងតិច ១។'
  if (!/[a-z]/.test(form.password)) return 'ពាក្យសម្ងាត់ត្រូវមានអក្សរតូច (a–z) យ៉ាងតិច ១។'
  if (!/[0-9]/.test(form.password)) return 'ពាក្យសម្ងាត់ត្រូវមានលេខ (0–9) យ៉ាងតិច ១។'
  return ''
})

// Confirm password
const confirmError = computed(() => {
  if (!form.password_confirmation) return 'សូមបញ្ជាក់ពាក្យសម្ងាត់របស់អ្នក។'
  if (form.password && form.password !== form.password_confirmation)
    return 'ពាក្យសម្ងាត់មិនត្រូវគ្នា។'
  return ''
})

const handleRegister = async () => {
  submitted.value = true
  emailTakenError.value = false
  authStore.error = null

  // Frontend validation
  if (nameError.value || emailError.value || passwordError.value || confirmError.value) {
    return
  }

  try {
    const success = await authStore.register(form)

    if (success) {
      alertSuccess('បានបង្កើតគណនីដោយជោគជ័យ!')
      router.push('/login')
    }
  } catch (err) {
    const apiErrors = err.response?.data?.data

    if (apiErrors?.email) {
      emailTakenError.value = apiErrors.email[0]
    } else {
      authStore.error = err.response?.data?.message || 'ការចុះឈ្មោះបរាជ័យ'
    }

    return false
  }
}
</script>

<style scoped>
.auth-page-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(120deg, var(--bs-main), #052d5a, #0a3d62);
  padding: 60px 20px;
  overflow: hidden;
  position: relative;
}

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
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
}

@media (max-width: 992px) {
  .register-card {
    grid-template-columns: 1fr;
    max-width: 500px;
  }
}

/* FORM */
.form-container {
  background: rgba(255, 255, 255, 0.9);
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
  box-shadow: 0 4px 15px rgba(255, 95, 0, 0.3);
}

.text-purple {
  color: var(--bs-main);
}

/* INPUT */
.custom-group {
  border-radius: 14px;
  overflow: hidden;
  border: 1.5px solid #e5e7eb;
  background: #f9fafb;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
.custom-group:focus-within {
  border-color: var(--bs-sub-main);
  box-shadow: 0 0 0 3px rgba(255, 95, 0, 0.15);
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
  box-shadow: 0 8px 20px rgba(255, 95, 0, 0.4);
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
  background: var(--bs-main);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.purple-glow {
  position: absolute;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1), transparent);
  border-radius: 50%;
}

.shape {
  position: absolute;
  background: rgba(255, 95, 0, 0.2);
}
.circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  top: 5%;
  left: 15%;
  animation: floatShape 6s ease-in-out infinite;
}
.square {
  width: 45px;
  height: 45px;
  border-radius: 10px;
  top: 45%;
  left: 60%;
  animation: floatShape 7s ease-in-out infinite reverse;
}
.dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  top: 70%;
  left: 15%;
  animation: floatShape 5s ease-in-out infinite;
}
.ring {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 4px solid rgba(255, 95, 0, 0.3);
  background: transparent;
  top: 10%;
  left: 65%;
  animation: floatShape 8s ease-in-out infinite reverse;
}

/* Feature list on visual side */
.features-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.feature-item {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.85rem;
  display: flex;
  align-items: center;
}
.feature-item i {
  color: var(--bs-sub-main);
}

/* Visual links */
.visual-links {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}
.visual-link {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  color: white;
  padding: 6px 14px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.25);
  transition:
    background 0.2s,
    transform 0.2s;
}
.visual-link:hover {
  background: rgba(255, 255, 255, 0.25);
  color: white;
  transform: translateY(-2px);
}

.floating-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--bs-main);
  margin-top: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

@keyframes floatShape {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-16px) rotate(8deg);
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

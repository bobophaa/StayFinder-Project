<template>
  <div>
    <div class="content-header d-flex justify-content-between align-items-center mb-4">
      <div class="title-meta">
        <h3 class="fw-bold">Profile Information</h3>
        <p class="text-muted small">ID: #{{ user.id || '---' }} • Joined {{ formatDate(user.created_at) }}</p>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-md-6">
        <label class="small fw-bold text-uppercase text-secondary mb-2 d-block">Full Name</label>
        <input v-model="form.name" type="text" class="form-control custom-input" placeholder="Name">
      </div>
      <div class="col-md-6">
        <label class="small fw-bold text-uppercase text-secondary mb-2 d-block">Email Address</label>
        <input v-model="form.email" type="email" class="form-control custom-input" placeholder="Email">
      </div>
      <div class="col-md-6">
        <label class="small fw-bold text-uppercase text-secondary mb-2 d-block">Phone Number</label>
        <input v-model="form.phone" type="text" class="form-control custom-input" placeholder="Phone">
      </div>
      <div class="col-md-6">
        <label class="small fw-bold text-uppercase text-secondary mb-2 d-block">Gender</label>
        <select v-model="form.gender" class="form-select custom-input">
          <option :value="1">Male</option>
          <option :value="2">Female</option>
        </select>
      </div>
      <div class="col-12">
        <label class="small fw-bold text-uppercase text-secondary mb-2 d-block">Current Job</label>
        <input v-model="form.current_job" type="text" class="form-control custom-input" placeholder="Occupation">
      </div>
    </div>

    <div class="mt-5 pt-4 border-top text-end">
      <button class="btn btn-dark fw-bold px-5 py-3 rounded-4" @click="submit" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        Save Changes
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import axios from 'axios'

const props = defineProps(['user'])
const emit = defineEmits(['refresh'])
const loading = ref(false)
const form = reactive({ ...props.user })

watch(() => props.user, (newVal) => Object.assign(form, newVal), { deep: true })

const submit = async () => {
  loading.value = true
  try {
    await axios.post('/api/profile/update', form)
    emit('refresh')
    alert("Updated!")
  } finally { loading.value = false }
}

const formatDate = (date) => date ? new Date(date).toLocaleDateString() : 'N/A'
</script>

<style scoped>
.custom-input {
  padding: 16px 20px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  background: #fdfdfd;
  font-weight: 600;
}

.custom-input:focus {
  border-color: #ff5f00;
  box-shadow: 0 0 0 4px rgba(255, 95, 0, 0.08);
  background: #fff;
  outline: none;
}
</style>
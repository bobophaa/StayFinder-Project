<script setup lang="ts">
import Foooter from '@/components/layout/Foooter.vue'
</script>

<template>
  <div class="onboarding-page font-kh">

    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="container hero-content">
        <h1 class="fw-bold mb-3 display-5">
          ក្លាយជាម្ចាស់ផ្ទះជាមួយ <span class="text-orange">StayFinder</span>
        </h1>
        <p class="lead opacity-75 max-width-600 mx-auto">
          ប្រែបន្ទប់ទំនេររបស់អ្នកទៅជាប្រភពចំណូលអកម្ម។
          ភ្ជាប់ជាមួយអ្នកជួលដែលបានផ្ទៀងផ្ទាត់នៅភ្នំពេញ ដោយសុវត្ថិភាព និងងាយស្រួល។
        </p>
        <a
          href="https://t.me/stayfinder_admin"
          target="_blank"
          class="btn btn-orange px-5 py-3 fw-bold rounded-pill shadow-lg"
        >
          <i class="bi bi-telegram me-2"></i> ទំនាក់ទំនងអ្នកគ្រប់គ្រងតាម Telegram
        </a>
      </div>
    </section>

    <section class="benefits-section py-5">
      <div class="container">
        <h3 class="fw-bold text-center mb-5">ហេតុអ្វីបានជាក្លាយជាម្ចាស់ផ្ទះជាមួយយើង?</h3>
        <div class="row g-4">
          <div class="col-md-4">
            <div class="card border-0 shadow-sm rounded-4 p-4 h-100 text-center">
              <div class="icon-box mb-3 mx-auto">
                <i class="bi bi-cash-stack fs-1 text-orange"></i>
              </div>
              <h5 class="fw-bold text-navy">ប្រាក់ចំណូលអតិបរមា</h5>
              <p class="small text-muted mb-0">
                ចុះបញ្ជីបន្ទប់របស់អ្នកក្នុងតម្លៃដែលអ្នកចង់បាន និងរក្សាទុក ១០០% នៃតម្លៃដែលបានចុះបញ្ជី។ គ្មានថ្លៃលាក់។
              </p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card border-0 shadow-sm rounded-4 p-4 h-100 text-center">
              <div class="icon-box mb-3 mx-auto">
                <i class="bi bi-shield-check fs-1 text-orange"></i>
              </div>
              <h5 class="fw-bold text-navy">សុវត្ថិភាព និងគួរជឿទុកចិត្ត</h5>
              <p class="small text-muted mb-0">
                យើងផ្ទៀងផ្ទាត់ប្រវត្តិរូបអ្នកជួលទាំងអស់ ដើម្បីធានាថាអ្នកទទួលបានអ្នកជួលដែលអាចទុកចិត្តបាន។
              </p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card border-0 shadow-sm rounded-4 p-4 h-100 text-center">
              <div class="icon-box mb-3 mx-auto">
                <i class="bi bi-magic fs-1 text-orange"></i>
              </div>
              <h5 class="fw-bold text-navy">ការគ្រប់គ្រងដោយស្រួល</h5>
              <p class="small text-muted mb-0">
                គ្រប់គ្រងការកក់ សំណើ និងស្ថានភាពអចលនទ្រព្យរបស់អ្នកដោយផ្ទាល់ពីផ្ទាំងគ្រប់គ្រងម្ចាស់។
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="steps-section py-5 bg-light">
      <div class="container">
        <h3 class="fw-bold text-center mb-5">ចាប់ផ្តើមក្នុង ៣ ជំហានងាយស្រួល</h3>
        <div class="row g-4">
          <div class="col-md-4 text-center">
            <div class="step-num bg-orange text-white rounded-pill mb-3 mx-auto">១</div>
            <h6 class="fw-bold">ចុះឈ្មោះនៅក្នុងផ្ទាំងគ្រប់គ្រង</h6>
            <p class="small text-muted">
              ចុះឈ្មោះជាម្ចាស់ផ្ទះ និងផ្តល់ព័ត៌មានគណនីជាមូលដ្ឋាន ដើម្បីចូលប្រើប្រាស់ឧបករណ៍ម្ចាស់ផ្ទះ។
            </p>
          </div>
          <div class="col-md-4 text-center">
            <div class="step-num bg-orange text-white rounded-pill mb-3 mx-auto">២</div>
            <h6 class="fw-bold">ចុះបញ្ជីបន្ទប់របស់អ្នក</h6>
            <p class="small text-muted">
              បង្ហោះរូបថតដែលមានគុណភាពខ្ពស់ កំណត់សេវាកម្ម និងកំណត់តម្លៃរបស់អ្នកដោយប្រើទម្រង់ងាយស្រួល។
            </p>
          </div>
          <div class="col-md-4 text-center">
            <div class="step-num bg-orange text-white rounded-pill mb-3 mx-auto">៣</div>
            <h6 class="fw-bold">ផ្ទៀងផ្ទាត់ជាមួយអ្នកគ្រប់គ្រង</h6>
            <p class="small text-muted">
              ទំនាក់ទំនងជាមួយក្រុមអ្នកគ្រប់គ្រងរបស់យើងនៅ Telegram ដើម្បីបញ្ជាក់ព័ត៌មានរបស់អ្នក និងចាប់ផ្តើម។
            </p>
          </div>
        </div>
      </div>
    </section>

  </div>
  <Foooter></Foooter>
</template>

<style scoped>
.onboarding-page { margin-top: 30px; }
.bg-navy { background: #031c36; }
.text-orange { color: #ff5f00; }
.btn-orange {
  background: #ff5f00;
  color: white;
  border: none;
  transition: 0.2s;
}
.btn-orange:hover {
  background: #e65600;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 95, 0, 0.3);
  color: white;
}
.text-navy { color: #031c36; }
.max-width-600 { max-width: 600px; }

.hero-section {
  position: relative;
  height: 550px;
  background-image: url('https://cdn.pixabay.com/photo/2023/08/04/22/59/sunset-8170058_1280.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 5px solid #ff5f00;
}
.hero-overlay {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(3, 28, 54, 0.6);
  z-index: 1;
}
.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
}

.step-num {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 800;
}
.icon-box {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 95, 0, 0.1);
}
</style>
<script setup lang="ts">
import Foooter from '@/components/layout/Foooter.vue'
</script>

<template>
  <div class="onboarding-page">
    <Navbar />

    <section class="hero-section">
      <div class="hero-overlay"></div>

      <div class="container hero-content">
        <h1 class="fw-bold mb-3 display-5">
          Become a Host with <span class="text-orange">StayFinder</span>
        </h1>
        <p class="lead opacity-75 max-width-600 mx-auto">
          Turn your spare room into a passive income stream. Connect with verified renters in Phnom
          Penh safely and easily.
        </p>     <a
          href="https://t.me/stayfinder_admin"
          target="_blank"
          class="btn btn-orange px-5 py-3 fw-bold rounded-pill shadow-lg"
        >
          <i class="bi bi-telegram me-2"></i> Contact Admin via Telegram
        </a>
      </div>
    </section>


    <section class="benefits-section py-5">
      <div class="container">
        <h3 class="fw-bold text-center mb-5">Why Host with Us?</h3>
        <div class="row g-4">
          <div class="col-md-4">
            <div class="card border-0 shadow-sm rounded-4 p-4 h-100 text-center">
              <div class="icon-box mb-3 mx-auto">
                <i class="bi bi-cash-stack fs-1 text-orange"></i>
              </div>
              <h5 class="fw-bold text-navy">Maximized Earnings</h5>
              <p class="small text-muted mb-0">
                List your room at your preferred price and keep 100% of your listed value. No hidden
                fees.
              </p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card border-0 shadow-sm rounded-4 p-4 h-100 text-center">
              <div class="icon-box mb-3 mx-auto">
                <i class="bi bi-shield-check fs-1 text-orange"></i>
              </div>
              <h5 class="fw-bold text-navy">Secure & Trusted</h5>
              <p class="small text-muted mb-0">
                We verify all renter profiles to ensure you get reliable and trustworthy tenants.
              </p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card border-0 shadow-sm rounded-4 p-4 h-100 text-center">
              <div class="icon-box mb-3 mx-auto">
                <i class="bi bi-magic fs-1 text-orange"></i>
              </div>
              <h5 class="fw-bold text-navy">Effortless Management</h5>
              <p class="small text-muted mb-0">
                Manage bookings, requests, and your property status directly from your provider
                dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="steps-section py-5 bg-light">
      <div class="container">
        <h3 class="fw-bold text-center mb-5">Getting Started in 3 Simple Steps</h3>
        <div class="row g-4">
          <div class="col-md-4 text-center">
            <div class="step-num bg-orange text-white rounded-pill mb-3 mx-auto">1</div>
            <h6 class="fw-bold">Register on Dashboard</h6>
            <p class="small text-muted">
              Sign up as a provider and provide basic account details to get access to your hosting
              toolkit.
            </p>
          </div>
          <div class="col-md-4 text-center">
            <div class="step-num bg-orange text-white rounded-pill mb-3 mx-auto">2</div>
            <h6 class="fw-bold">List Your Room</h6>
            <p class="small text-muted">
              Upload high-quality photos, define amenities, and set your price using our simple
              form.
            </p>
          </div>
          <div class="col-md-4 text-center">
            <div class="step-num bg-orange text-white rounded-pill mb-3 mx-auto">3</div>
            <h6 class="fw-bold">Verify with Admin</h6>
            <p class="small text-muted">
              Connect with our admin team on Telegram to confirm your details and go live.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
  <Foooter></Foooter>
</template>

<style scoped>
.onboarding-page{
  margin-top: 30px; 
}
.bg-navy {
  background: #031c36;
}
.text-orange {
  color: #ff5f00;
}
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
}
.text-navy {
  color: #031c36;
}
.max-width-600 {
  max-width: 600px;
}
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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

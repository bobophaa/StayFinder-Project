<template>
  <div>

    <!-- HERO -->
    <section class="position-relative">
      <img 
        src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2" 
        class="w-100" 
        style="height: 400px; object-fit: cover;"
      />

      <!-- Overlay -->
      <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>

      <!-- Text -->
      <div class="position-absolute top-50 start-50 translate-middle text-center text-white hero-text">
        <h1 class="fw-bold">StayFinder</h1>
        <p class="lead">Find your perfect place to stay, anytime, anywhere</p>
      </div>
    </section>

    <!-- ABOUT -->
    <section class="container py-5 text-center">
      <h2 class="fw-bold mb-3">About Us</h2>
      <p class="text-muted mx-auto" style="max-width: 700px;">
        StayFinder is a modern platform designed to help people easily find
        rooms, apartments, and shared spaces. Whether you're a student,
        professional, or traveler — we make your search simple, fast, and enjoyable.
      </p>
    </section>

    <!-- MISSION & VISION -->
    <section class="container py-4">
      <div class="row g-4 justify-content-center">
        
        <div class="col-md-5">
          <div class="card shadow-sm border-0 h-100 text-center p-4">
            <h4 class="fw-bold">🎯 Our Mission</h4>
            <p class="text-muted mt-2">
              To make room renting fast, reliable, and stress-free for everyone.
            </p>
          </div>
        </div>

        <div class="col-md-5">
          <div class="card shadow-sm border-0 h-100 text-center p-4">
            <h4 class="fw-bold">❤️ Our Vision</h4>
            <p class="text-muted mt-2">
              We believe everyone deserves a comfortable place to call home.
            </p>
          </div>
        </div>

      </div>
    </section>

    <!-- FEATURES -->
    <section class="bg-light py-5">
      <div class="container text-center">
        <h2 class="fw-bold mb-4">What We Offer</h2>

        <div class="row g-4">
          <div class="col-6 col-md-3">
            <div class="p-3 bg-white shadow-sm rounded feature-box">
              🔍 Easy Search
            </div>
          </div>

          <div class="col-6 col-md-3">
            <div class="p-3 bg-white shadow-sm rounded feature-box">
              🏢 Many Listings
            </div>
          </div>

          <div class="col-6 col-md-3">
            <div class="p-3 bg-white shadow-sm rounded feature-box">
              📱 User Friendly
            </div>
          </div>

          <div class="col-6 col-md-3">
            <div class="p-3 bg-white shadow-sm rounded feature-box">
              🔐 Secure Platform
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-5 text-center text-white" style="background:#0d1b2a;">
      <div class="container">
        <h2 class="fw-bold mb-3">Start Your Journey with StayFinder</h2>

        <button class="btn btn-orange px-4 py-2 fw-bold">
          Explore Rooms
        </button>

      </div>
    </section>

  </div>
</template>

<script setup>
</script>

<style scoped>

/* ===== MAIN COLOR ===== */
:root {
  --main-orange: #fd7e14 !important;  
  /* --main-orange-dark: #e96b0c !important; */
}

/* ===== HERO TEXT ===== */
.hero-text {
  z-index: 2;
}

/* ===== CARD (Mission & Vision) ===== */
.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

/* ===== FEATURES (ORANGE HOVER) ===== */
.feature-box {
  transition: all 0.3s ease;
  font-weight: 500;
}

.feature-box:hover {
  background-color:  #fd7e14 !important;
  color: white;
  transform: translateY(-6px);
  box-shadow: 0 10px 25px rgba(253, 126, 20, 0.3);
}

/* ===== BUTTON ===== */
.btn-orange {
  background-color:  #fd7e14 !important;
  color: white;
  border: none;
  transition: all 0.3s ease;
}

.btn-orange:hover {
  background-color: #e96b0c !important;
  color: white;
}

</style>
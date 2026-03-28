<template><footer class="footer-section pt-5 pb-3">
  <div class="container">
    <div class="row g-4">
      <div class="col-lg-4 col-md-6">
        <img src="@/assets/images/image.png" alt="StayFinder Logo" height="50" class="mb-3" />
        <p class="text-light-muted pe-lg-5">
          Find your perfect room with ease. Quality rooms for rent at affordable prices in the heart of Phnom Penh.
        </p>
      </div>

      <div class="col-lg-2 col-md-6">
        <h5 class="fw-bold text-white mb-4">Quick Links</h5>
        <ul class="list-unstyled footer-links">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/rooms">All Rooms</router-link></li>
          <li><router-link to="/about">About Us</router-link></li>
          <li><router-link to="/contact">Contact</router-link></li>
        </ul>
      </div>

      <div class="col-lg-3 col-md-6">
        <h5 class="fw-bold text-white mb-4">Contact Us</h5>
        <ul class="list-unstyled contact-info">
          <li class="mb-3">
            <i class="bi bi-telephone-fill me-2 text-orange"></i> +990 344 378
          </li>
          <li class="mb-3">
            <i class="bi bi-envelope-fill me-2 text-orange"></i> Stayfinder123@gmail.com
          </li>
          <li class="mb-3">
            <i class="bi bi-geo-alt-fill me-2 text-orange"></i> 123 Main Street, Phnom Penh
          </li>
        </ul>
      </div>

      <div class="col-lg-3 col-md-6 text-lg-end">
        <h5 class="fw-bold text-white mb-4 text-lg-end">Follow Us</h5>
        <div class="d-flex gap-3 justify-content-lg-end">
          <a href="#" class="social-circle"><i class="bi bi-facebook"></i></a>
          <a href="#" class="social-circle"><i class="bi bi-instagram"></i></a>
          <a href="#" class="social-circle"><i class="bi bi-telegram"></i></a>
        </div>
      </div>
    </div>

    <hr class="mt-5 mb-4 border-secondary opacity-25">
    
    <div class="row">
      <div class="col-md-6 text-center text-md-start">
        <p class="small text-light-muted mb-0">© 2026 StayFinder. All rights reserved.</p>
      </div>
      <!-- <div class="col-md-6 text-center text-md-end">
        <p class="small text-light-muted mb-0">Developed by </p>
      </div> -->
    </div>
  </div>
</footer></template>
<style scoped>
.footer-section {
  background-color: var(--bs-main); 
  color: #ffffff;
}

.text-light-muted {
  color: #b0c4de;
  font-size: 0.95rem;
  line-height: 1.6;
}

.text-orange {
  color: var(--bs-sub-main); 
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: #b0c4de;
  text-decoration: none;
  transition: 0.3s;
}

.footer-links a:hover {
  color: var(--bs-sub-main);
  padding-left: 5px;
}

.social-circle {
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: 0.3s;
}

.social-circle:hover {
  background-color: white;
  color: var(--bs-main);
  transform: translateY(-3px);
}</style>
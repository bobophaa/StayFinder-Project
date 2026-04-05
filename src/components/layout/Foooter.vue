<template>
  <footer class="footer-section pt-5 pb-3">
    <div class="container">
      <div class="row g-4">
        <div class="col-lg-4 col-md-6">
          <img src="@/assets/images/image.png" alt="StayFinder Logo" height="60" class="mb-3" />
          <p class="text-light-muted pe-lg-5">
            Find your perfect room with ease. Quality rooms for rent at affordable prices in the
            heart of Phnom Penh.
          </p>
        </div>

        <!-- QUICK LINKS -->
        <div class="col-lg-2 col-md-6">
          <h5 class="fw-bold text-white mb-4">Quick Links</h5>
          <ul class="list-unstyled footer-links">
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/rooms">All Rooms</router-link></li>
            <li><router-link to="/about">About Us</router-link></li>
            <li><router-link to="/contact">Contact</router-link></li>
          </ul>
        </div>

        <!-- CONTACT -->
        <div class="col-lg-3 col-md-6">
          <h5 class="fw-bold text-white mb-4">Contact Us</h5>
          <ul class="list-unstyled contact-info">
            <!-- PHONE -->
            <li class="mb-3">
              <a :href="`tel:${contact.phone}`" class="text-decoration-none text-light-muted">
                <i class="bi bi-telephone-fill me-2 text-orange"></i>
                {{ contact.phone }}
              </a>
            </li>

            <!-- EMAIL -->
            <li class="mb-3">
              <a :href="`mailto:${contact.email}`" class="text-decoration-none text-light-muted">
                <i class="bi bi-envelope-fill me-2 text-orange"></i>
                {{ contact.email }}
              </a>
            </li>

            <!-- LOCATION -->
            <li class="mb-3">
              <a
                :href="contact.mapLink"
                target="_blank"
                class="text-decoration-none text-light-muted"
              >
                <i class="bi bi-geo-alt-fill me-2 text-orange"></i>
                {{ contact.address }}
              </a>
            </li>
          </ul>
        </div>
        <!-- SOCIAL -->
        <div class="col-lg-3 col-md-6 text-center">
          <h5 class="fw-bold text-white mb-4">Follow Us</h5>

          <div class="d-flex gap-3 justify-content-center">
            <a :href="social.facebook" target="_blank" class="social-circle">
              <i class="bi bi-facebook"></i>
            </a>

            <a :href="social.instagram" target="_blank" class="social-circle">
              <i class="bi bi-instagram"></i>
            </a>

            <a :href="social.telegram" target="_blank" class="social-circle">
              <i class="bi bi-telegram"></i>
            </a>
          </div>
        </div>
      </div>

      <hr class="mt-5 mb-4 border-secondary opacity-25" />

      <div class="row">
        <div class="col-md-6 text-center text-md-start">
          <p class="small text-light-muted mb-0">© 2026 StayFinder. All rights reserved.</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  data() {
    return {
      contact: {
        phone: '+990344378',
        email: 'Stayfinder123@gmail.com',
        address: '123 Main Street, Phnom Penh',
        mapLink: 'https://www.google.com/maps?q=123+Main+Street+Phnom+Penh',
      },
      social: {
        facebook: 'https://www.facebook.com/wbclog',
        instagram: 'https://instagram.com/yourpage',
        telegram: 'https://t.me/yourchannel',
      },
    }
  },
}
</script>

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
}
</style>

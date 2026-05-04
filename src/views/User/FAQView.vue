<script setup lang="ts">
import Foooter from '@/components/layout/Foooter.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleGetStarted = () => {
  const token = localStorage.getItem('token')

  if (!token) {
    router.push({ path: '/login' })


  } else {
    router.push({ path: '/info' })
  }
}
</script>

<template>
  <div class="faq-page bg-light min-vh-100 py-5">
    <section class="faq-hero-pro text-white position-relative overflow-hidden">
      <div class="hero-bg-overlay"></div>
      <div class="container py-5 z-index-2 position-relative text-center">
        <div class="animate-pop py-5">
          <span class="badge-glass mb-3">Help Center</span>
          <h1 class="display-3 fw-bold mb-3 mt-2">How can we help?</h1>
          <p class="fs-5 opacity-75 mb-0 mx-auto w-75">
            Everything you need to know about renting, listing, and growing your business on
            StayFinder.
          </p>
        </div>
      </div>
    </section>

    <div class="container py-5 mt-n5 position-relative z-index-3">
      <div class="row g-4">
        <aside class="col-lg-4">
          <div class="sticky-top" style="top: 100px">
            <div class="glass-card p-4 rounded-4  border-0 mb-4">
              <h5 class="fw-bold text-navy mb-4">
                <i class="bi bi-grid-fill text-orange me-2"></i> Categories
              </h5>
              <div class="nav flex-column gap-3">
                <a href="#tenants" class="nav-btn active-nav w-100 text-decoration-none">
                  <i class="bi bi-people-fill"></i> For Tenants
                </a>
                <a href="#landlords" class="nav-btn w-100 text-decoration-none text-secondary">
                  <i class="bi bi-briefcase-fill"></i> For Landlords
                </a>
              </div>
            </div>

            <div class="business-cta shadow-lg p-4 rounded-4 text-white">
              <h5 class="fw-bold mb-2">Join our Community</h5>
              <p class="small opacity-75 mb-4">
                Register as a property owner and start reaching thousands of students today.
              </p>
              <button
                @click="handleGetStarted"
                class="btn btn-light w-100 py-2 fw-bold text-navy rounded-3 border-0"
              >
                Get Started
              </button>
            </div>
          </div>
        </aside>

        <main class="col-lg-8">
          <div class="faq-content-card glass-card p-3 rounded-4 ">
            <div id="tenants" class="section-padding">
              <h4 class="fw-bold text-navy mb-4 px-3">
                <i class="bi bi-person-check-fill text-orange me-2"></i> For Tenants
              </h4>
              <div class="accordion accordion-flush" id="faqTenants">
                <div class="accordion-item bg-transparent">
                  <h2 class="accordion-header">
                    <button
                      class="accordion-button fw-bold py-4 bg-transparent"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#t1"
                    >
                      How do I book a room?
                    </button>
                  </h2>
                  <div
                    id="t1"
                    class="accordion-collapse collapse show"
                    data-bs-parent="#faqTenants"
                  >
                    <div class="accordion-body text-secondary lh-lg py-4 border-top">
                      StayFinder is a discovery platform. Once you find a room, click **"View
                      Details"** to get the owner's contact info. You can message them on Telegram
                      or call them directly to arrange a visit and finalize the booking.
                    </div>
                  </div>
                </div>

                <div class="accordion-item bg-transparent">
                  <h2 class="accordion-header">
                    <button
                      class="accordion-button collapsed fw-bold py-4 bg-transparent"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#t2"
                    >
                      Are utility bills (Water/Electric) included in the price?
                    </button>
                  </h2>
                  <div id="t2" class="accordion-collapse collapse" data-bs-parent="#faqTenants">
                    <div class="accordion-body text-secondary lh-lg py-4 border-top">
                      This varies by owner. Some include utilities in the monthly rent, while others
                      charge separately based on usage. Always check the **"Room Details"** section
                      or ask the owner during your visit.
                    </div>
                  </div>
                </div>

                <div class="accordion-item bg-transparent">
                  <h2 class="accordion-header">
                    <button
                      class="accordion-button collapsed fw-bold py-4 bg-transparent"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#t3"
                    >
                      Is there a security deposit required?
                    </button>
                  </h2>
                  <div id="t3" class="accordion-collapse collapse" data-bs-parent="#faqTenants">
                    <div class="accordion-body text-secondary lh-lg py-4 border-top">
                      Most landlords in Phnom Penh require a deposit (usually 1 month's rent). This
                      is held by the owner and returned to you when you move out, provided there is
                      no damage to the property.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div id="landlords" class="section-padding mt-5">
              <h4 class="fw-bold text-navy mb-4 px-3">
                <i class="bi bi-building-up text-orange me-2"></i> For Landlords
              </h4>
              <div class="accordion accordion-flush" id="faqLandlords">
                <div class="accordion-item bg-transparent">
                  <h2 class="accordion-header">
                    <button
                      class="accordion-button collapsed fw-bold py-4 bg-transparent"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#l1"
                    >
                      How do I list my property?
                    </button>
                  </h2>
                  <div id="l1" class="accordion-collapse collapse" data-bs-parent="#faqLandlords">
                    <div class="accordion-body text-secondary lh-lg py-4 border-top">
                      Click the **"List Your Property"** button in the navbar. You'll be guided to
                      contact our Admin via Telegram. Simply provide your room details and photos,
                      and we will set up the listing for you!
                    </div>
                  </div>
                </div>

                <div class="accordion-item bg-transparent">
                  <h2 class="accordion-header">
                    <button
                      class="accordion-button collapsed fw-bold py-4 bg-transparent"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#l2"
                    >
                      What is a "Featured Listing"?
                    </button>
                  </h2>
                  <div id="l2" class="accordion-collapse collapse" data-bs-parent="#faqLandlords">
                    <div class="accordion-body text-secondary lh-lg py-4 border-top">
                      Featured listings appear at the very top of search results and have a special
                      badge. This is a paid service that helps your property get 5x more views from
                      potential tenants.
                    </div>
                  </div>
                </div>

                <div class="accordion-item bg-transparent">
                  <h2 class="accordion-header">
                    <button
                      class="accordion-button collapsed fw-bold py-4 bg-transparent"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#l3"
                    >
                      How can I update my room's availability?
                    </button>
                  </h2>
                  <div id="l3" class="accordion-collapse collapse" data-bs-parent="#faqLandlords">
                    <div class="accordion-body text-secondary lh-lg py-4 border-top">
                      Whenever your room is rented out or becomes available again, just send a quick
                      message to our Admin team. We update listings within 24 hours to ensure users
                      see accurate info.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-4 text-center mt-3 border-top bg-light-soft rounded-bottom-4">
              <span class="text-muted d-block mb-3 small"
                >Still have specific questions? Our team is ready to help.</span
              >
              <a
                href="https://t.me/your_admin"
                target="_blank"
                class="btn btn-navy px-5 rounded-pill shadow-sm py-2"
              >
                <i class="bi bi-telegram me-2"></i> Contact Support
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
  <Foooter></Foooter>
</template>

<style scoped>
.text-navy {
  color: #032142;
}
.text-orange {
  color: #ff6600;
}
.bg-navy {
  background-color: #032142;
}

.faq-hero-pro {
  height: 45vh;
  background-image: url('https://www.geckoroutes.com/wp-content/uploads/2020/06/phnom-penh-cambodia.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
}
.hero-bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(3, 33, 66, 0.95), rgba(3, 33, 66, 0.8));
}

.badge-glass {
  background: rgba(255, 255, 255, 0.15);
  padding: 8px 20px;
  border-radius: 50px;
  backdrop-filter: blur(10px);
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: inline-block;
}

.glass-card {
  box-shadow: 4px 4px 4px rgba(3, 33, 66, 0.397);
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.business-cta {
  background: linear-gradient(135deg, #032142, #063970);
  border-left: 6px solid #ff6600;
}

.nav-btn {
  padding: 14px 20px;
  border-radius: 12px;
  display: block;
  transition: 0.3s;
  font-weight: 600;
}
.nav-btn i {
  margin-right: 12px;
}
.active-nav {
  background: rgba(255, 102, 0, 0.1);
  color: #ff6600 !important;
}

.accordion-button:not(.collapsed) {
  color: #ff6600;
  box-shadow: none;
}
.accordion-button:focus {
  box-shadow: none;
}
.btn-navy {
  background: #032142;
  color: white;
  border: none;
}
.btn-navy:hover {
  background: #063970;
  color: white;
}

.animate-pop {
  animation: fadeInUp 0.8s ease-out forwards;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.z-index-2 {
  z-index: 2;
}
.z-index-3 {
  z-index: 3;
}
.mt-n5 {

  /* margin-top: -100px !important; */
}
</style>

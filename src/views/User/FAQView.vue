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
  <div class="faq-page bg-light min-vh-100 py-5 font-kh">
    <section class="faq-hero-pro text-white position-relative overflow-hidden">
      <div class="hero-bg-overlay"></div>
      <div class="container py-5 z-index-2 position-relative text-center">
        <div class="animate-pop py-5">
          <span class="badge-glass mb-3">មជ្ឈមណ្ឌលជំនួយ</span>
          <h1 class="display-3 fw-bold mb-3 mt-2">យើងអាចជួយអ្នកដោយរបៀបណា?</h1>
          <p class="fs-5 opacity-75 mb-0 mx-auto w-75">
            អ្វីៗទាំងអស់ដែលអ្នកត្រូវដឹងអំពីការជួល ការចុះបញ្ជី និងការពង្រីកអាជីវកម្មរបស់អ្នកនៅ StayFinder។
          </p>
        </div>
      </div>
    </section>

    <div class="container py-5 mt-n5 position-relative z-index-3">
      <div class="row g-4">
        <aside class="col-lg-4">
          <div class="sticky-top" style="top: 100px">
            <div class="glass-card p-4 rounded-4 border-0 mb-4">
              <h5 class="fw-bold text-navy mb-4">
                <i class="bi bi-grid-fill text-orange me-2"></i> ប្រភេទ
              </h5>
              <div class="nav flex-column gap-3">
                <a href="#tenants" class="nav-btn active-nav w-100 text-decoration-none">
                  <i class="bi bi-people-fill"></i> សម្រាប់អ្នកជួល
                </a>
                <a href="#landlords" class="nav-btn w-100 text-decoration-none text-secondary">
                  <i class="bi bi-briefcase-fill"></i> សម្រាប់ម្ចាស់អចលនទ្រព្យ
                </a>
              </div>
            </div>

            <div class="business-cta shadow-lg p-4 rounded-4 text-white">
              <h5 class="fw-bold mb-2">ចូលរួមជាមួយសហគមន៍យើង</h5>
              <p class="small opacity-75 mb-4">
                ចុះឈ្មោះជាម្ចាស់អចលនទ្រព្យ ហើយចាប់ផ្តើមទៅដល់និស្សិតរាប់ពាន់នាក់នៅថ្ងៃនេះ។
              </p>
              <button
                @click="handleGetStarted"
                class="btn btn-light w-100 py-2 fw-bold text-navy rounded-3 border-0"
              >
                ចាប់ផ្តើម
              </button>
            </div>
          </div>
        </aside>

        <main class="col-lg-8">
          <div class="faq-content-card glass-card p-3 rounded-4">

            <!-- For Tenants -->
            <div id="tenants" class="section-padding">
              <h4 class="fw-bold text-navy mb-4 px-3">
                <i class="bi bi-person-check-fill text-orange me-2"></i> សម្រាប់អ្នកជួល
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
                      តើខ្ញុំកក់បន្ទប់ដោយរបៀបណា?
                    </button>
                  </h2>
                  <div id="t1" class="accordion-collapse collapse show" data-bs-parent="#faqTenants">
                    <div class="accordion-body text-secondary lh-lg py-4 border-top">
                      StayFinder គឺជាវេទិកាស្វែងរក។ នៅពេលអ្នករកឃើញបន្ទប់ ចុច <strong>"មើលព័ត៌មានលម្អិត"</strong>
                      ដើម្បីទទួលបានព័ត៌មានទំនាក់ទំនងរបស់ម្ចាស់។ អ្នកអាចផ្ញើសារតាម Telegram ឬហៅទូរស័ព្ទផ្ទាល់
                      ដើម្បីរៀបចំការទស្សនា និងបញ្ចប់ការកក់។
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
                      តើថ្លៃទឹក/អគ្គិសនីត្រូវបានរួមបញ្ចូលក្នុងតម្លៃជួលទេ?
                    </button>
                  </h2>
                  <div id="t2" class="accordion-collapse collapse" data-bs-parent="#faqTenants">
                    <div class="accordion-body text-secondary lh-lg py-4 border-top">
                      វាអាស្រ័យលើម្ចាស់បន្ទប់។ ខ្លះរួមបញ្ចូលសេវាកម្មនៅក្នុងថ្លៃជួលប្រចាំខែ ខណៈពេលដែលខ្លះទៀត
                      គិតថ្លៃដាច់ដោយឡែកតាមការប្រើប្រាស់។ សូមពិនិត្យផ្នែក <strong>"ព័ត៌មានបន្ទប់"</strong>
                      ឬសួរម្ចាស់ក្នុងអំឡុងពេលទស្សនា។
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
                      តើត្រូវការប្រាក់តម្កល់សុវត្ថិភាពទេ?
                    </button>
                  </h2>
                  <div id="t3" class="accordion-collapse collapse" data-bs-parent="#faqTenants">
                    <div class="accordion-body text-secondary lh-lg py-4 border-top">
                      ម្ចាស់ដីភាគច្រើននៅភ្នំពេញតម្រូវឱ្យមានប្រាក់តម្កល់ (ជាធម្មតា ១ ខែ)។
                      ប្រាក់នេះត្រូវបានរក្សាទុកដោយម្ចាស់ ហើយប្រគល់ជូនអ្នកវិញនៅពេលអ្នកចេញ
                      ប្រសិនបើគ្មានការខូចខាតណាមួយ។
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <!-- For Landlords -->
            <div id="landlords" class="section-padding mt-5">
              <h4 class="fw-bold text-navy mb-4 px-3">
                <i class="bi bi-building-up text-orange me-2"></i> សម្រាប់ម្ចាស់អចលនទ្រព្យ
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
                      តើខ្ញុំចុះបញ្ជីអចលនទ្រព្យរបស់ខ្ញុំដោយរបៀបណា?
                    </button>
                  </h2>
                  <div id="l1" class="accordion-collapse collapse" data-bs-parent="#faqLandlords">
                    <div class="accordion-body text-secondary lh-lg py-4 border-top">
                      ចុចប៊ូតុង <strong>"ចុះបញ្ជីអចលនទ្រព្យ"</strong> នៅក្នុងរបាររុករក។ អ្នកនឹងត្រូវបានណែនាំ
                      ឱ្យទំនាក់ទំនងអ្នកគ្រប់គ្រងរបស់យើងតាម Telegram។ គ្រាន់តែផ្តល់ព័ត៌មានលម្អិតបន្ទប់
                      និងរូបភាព ហើយយើងនឹងរៀបចំការចុះបញ្ជីសម្រាប់អ្នក!
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
                      តើ "បញ្ជីពិសេស" គឺជាអ្វី?
                    </button>
                  </h2>
                  <div id="l2" class="accordion-collapse collapse" data-bs-parent="#faqLandlords">
                    <div class="accordion-body text-secondary lh-lg py-4 border-top">
                      បញ្ជីពិសេសលេចឡើងនៅផ្នែកខាងលើបំផុតនៃលទ្ធផលស្វែងរក ហើយមានស្លាកពិសេស។
                      នេះជាសេវាកម្មដែលបង់ប្រាក់ ដែលជួយឱ្យអចលនទ្រព្យរបស់អ្នកទទួលបានការមើល ៥ ដង
                      ច្រើនជាងពីអ្នកជួលសក្តានុពល។
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
                      តើខ្ញុំអាចធ្វើបច្ចុប្បន្នភាពភាពអាចរកបាននៃបន្ទប់របស់ខ្ញុំដោយរបៀបណា?
                    </button>
                  </h2>
                  <div id="l3" class="accordion-collapse collapse" data-bs-parent="#faqLandlords">
                    <div class="accordion-body text-secondary lh-lg py-4 border-top">
                      នៅពេលណាដែលបន្ទប់របស់អ្នកត្រូវបានជួល ឬអាចរកបានម្តងទៀត គ្រាន់តែផ្ញើសារ
                      ទៅក្រុមការងារអ្នកគ្រប់គ្រងរបស់យើង។ យើងធ្វើបច្ចុប្បន្នភាពបញ្ជីក្នុងរយៈពេល ២៤ ម៉ោង
                      ដើម្បីធានាថាអ្នកប្រើប្រាស់ឃើញព័ត៌មានត្រឹមត្រូវ។
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div class="p-4 text-center mt-3 border-top bg-light-soft rounded-bottom-4">
              <span class="text-muted d-block mb-3 small">
                នៅតែមានសំណួរជាក់លាក់? ក្រុមការងាររបស់យើងរួចរាល់ជួយ។
              </span>
              <a
                href="https://t.me/your_admin"
                target="_blank"
                class="btn btn-navy px-5 rounded-pill shadow-sm py-2"
              >
                <i class="bi bi-telegram me-2"></i> ទំនាក់ទំនងការគាំទ្រ
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
.text-navy { color: #032142; }
.text-orange { color: #ff6600; }
.bg-navy { background-color: #032142; }

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
.nav-btn i { margin-right: 12px; }
.active-nav {
  background: rgba(255, 102, 0, 0.1);
  color: #ff6600 !important;
}

.accordion-button:not(.collapsed) { color: #ff6600; box-shadow: none; }
.accordion-button:focus { box-shadow: none; }

.btn-navy { background: #032142; color: white; border: none; }
.btn-navy:hover { background: #063970; color: white; }

.animate-pop { animation: fadeInUp 0.8s ease-out forwards; }
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}

.z-index-2 { z-index: 2; }
.z-index-3 { z-index: 3; }
</style>
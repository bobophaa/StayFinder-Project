<template>
  <div class="about-page">
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="container position-relative" style="z-index: 2">
        <div class="row justify-content-center text-center py-5">
          <div class="col-lg-8">
            <span class="hero-label mb-3 d-inline-block">About StayFinder</span>
            <h1 class="hero-title mb-4">Find Your Perfect Home Away From Home</h1>
            <p class="hero-subtitle">
              We connect people with their ideal living spaces across Phnom Penh. Transparent,
              trusted, and built for the modern renter.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="stats-bar py-4">
      <div class="container">
        <div class="row g-0 text-center">
          <div class="col-6 col-md-3 stat-item" v-for="s in stats" :key="s.label">
            <div class="stat-number">{{ s.value }}</div>
            <div class="stat-label">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5 my-2">
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-lg-6">
            <div class="mission-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700&q=80"
                alt="Our mission"
                class="mission-img"
              />
              <div class="mission-badge">
                <i class="bi bi-award-fill text-orange fs-3 mb-2 d-block"></i>
                <div class="fw-bold text-navy small">Trusted Platform</div>
                <div class="text-muted" style="font-size: 0.72rem">Since 2024</div>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <span class="section-label">Our Mission</span>
            <h2 class="section-title mb-4">Making Room Rental Simple & Transparent</h2>
            <p class="text-muted lh-lg mb-4">
              StayFinder was born from a simple frustration — finding a good room in Phnom Penh was
              too complicated, too slow, and too risky. We built a platform where renters can browse
              verified listings with real photos, clear pricing, and honest reviews.
            </p>
            <p class="text-muted lh-lg mb-4">
              For property owners, we provide the tools to list, manage, and grow their rental
              business without the hassle of traditional methods.
            </p>
            <div class="d-flex flex-wrap gap-3">
              <div class="value-pill" v-for="v in values" :key="v">
                <i class="bi bi-check-circle-fill text-orange me-2"></i>{{ v }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5 how-section">
      <div class="container">
        <div class="text-center mb-5">
          <span class="section-label">How It Works</span>
          <h2 class="section-title">Simple Steps to Your New Home</h2>
        </div>
        <div class="row g-4 justify-content-center">
          <div class="col-md-4" v-for="(step, i) in steps" :key="i">
            <div class="step-card text-center p-4">
              <div class="step-number">{{ String(i + 1).padStart(2, '0') }}</div>
              <div class="step-icon-wrap mb-3">
                <i :class="['bi', step.icon]"></i>
              </div>
              <h5 class="fw-bold text-navy mb-2">{{ step.title }}</h5>
              <p class="text-muted small mb-0">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5 my-2">
      <div class="container">
        <div class="text-center mb-5">
          <span class="section-label">Our Team</span>
          <h2 class="section-title">The People Behind StayFinder</h2>
          <p class="text-muted">
            A passionate team of developers and designers building the future of room rental in
            Cambodia.
          </p>
        </div>

        <div class="row g-4 justify-content-center">
          <div class="col-sm-6 col-lg-3" v-for="member in team" :key="member.name">
            <div class="team-card">
              <div class="team-avatar-wrap">
                <div class="team-avatar" :style="{ background: member.bg }">
                  <span class="avatar-initial">{{ member.name.charAt(0) }}</span>
                </div>
                <div class="team-avatar-ring"></div>
              </div>

              <div class="team-info p-4 text-center">
                <h5 class="fw-bold text-navy mb-1">{{ member.name }}</h5>
                <span class="team-role-badge mb-3 d-inline-block">{{ member.role }}</span>
                <p class="text-muted small mb-3 bio-text">{{ member.bio }}</p>

                <div class="d-flex flex-wrap gap-1 justify-content-center mb-3">
                  <span class="skill-tag" v-for="skill in member.skills" :key="skill">{{
                    skill
                  }}</span>
                </div>

                <div class="d-flex justify-content-center gap-3">
                  <a
                    v-if="member.github"
                    :href="member.github"
                    target="_blank"
                    class="social-link"
                    title="GitHub"
                  >
                    <i class="bi bi-github"></i>
                  </a>
                  <a
                    v-if="member.linkedin"
                    :href="member.linkedin"
                    target="_blank"
                    class="social-link"
                    title="LinkedIn"
                  >
                    <i class="bi bi-linkedin"></i>
                  </a>
                  <a
                    v-if="member.email"
                    :href="'mailto:' + member.email"
                    class="social-link"
                    title="Email"
                  >
                    <i class="bi bi-envelope-fill"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Why Choose Us ── -->
    <section class="py-5 why-section">
      <div class="container">
        <div class="text-center mb-5">
          <span class="section-label">Why StayFinder</span>
          <h2 class="section-title">Built Different, Built Better</h2>
        </div>
        <div class="row g-4">
          <div class="col-md-6 col-lg-4" v-for="reason in reasons" :key="reason.title">
            <div class="reason-card p-4 h-100">
              <div class="reason-icon mb-3">
                <i :class="['bi', reason.icon]"></i>
              </div>
              <h5 class="fw-bold text-navy mb-2">{{ reason.title }}</h5>
              <p class="text-muted small mb-0">{{ reason.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section py-5 my-2">
      <div class="container">
        <div class="cta-card text-center p-5">
          <div class="cta-pattern"></div>
          <div class="position-relative" style="z-index: 2">
            <h2 class="fw-bold text-white mb-3">Ready to Find Your Perfect Room?</h2>
            <p class="text-white opacity-75 mb-4">
              Join thousands of happy renters who found their home through StayFinder.
            </p>
            <div class="d-flex gap-3 justify-content-center flex-wrap">
              <router-link to="/rooms" class="btn btn-cta-primary px-5 py-3 fw-bold">
                <i class="bi bi-search me-2"></i>Browse Rooms
              </router-link>
              <router-link to="/register" class="btn btn-cta-secondary px-5 py-3 fw-bold">
                <i class="bi bi-person-plus-fill me-2"></i>Join Free
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <Foooter />
</template>

<script setup>
import Foooter from '@/components/layout/Foooter.vue'
const stats = [
  { value: '500+', label: 'Rooms Listed' },
  { value: '1,200+', label: 'Happy Renters' },
  { value: '25+', label: 'Districts Covered' },
  { value: '98%', label: 'Satisfaction Rate' },
]

const values = ['Transparency', 'Verified Listings', 'Secure Payments', 'Fast Support']

const steps = [
  {
    icon: 'bi-search',
    title: 'Search & Filter',
    desc: 'Browse hundreds of rooms by district, price, size, and amenities to find your perfect match.',
  },
  {
    icon: 'bi-calendar-check',
    title: 'Book or Rent',
    desc: 'Submit a booking request or rent directly with a secure payment proof upload.',
  },
  {
    icon: 'bi-house-check-fill',
    title: 'Move In',
    desc: 'Once approved by the provider, get the keys and start living in your new space.',
  },
]

const team = [
  {
    name: 'Tha Siei',
    role: 'SETEC',
    bio: 'Leads the team and Handles booking and renting workflow of the platform. He ensures users can easily request bookings or rent rooms.',
    // skills: ['Vue 3', 'Node.js', 'Project Management'],
    bg: 'linear-gradient(135deg, #031c36, #0d3a6e)',
    github: '#',
    linkedin: '#',
    email: 'member1@example.com',
  },
  {
    name: 'Hing Chanbopha',
    role: 'RUPP',
    bio: 'Handle for building the user interface of StayFinder and responsible room listing,create room, and filtering features. ',
    // skills: ['Vue 3', 'Bootstrap 5', 'Pinia'],
    bg: 'linear-gradient(135deg, #ff5f00, #ff8c00)',
    github: '#',
    linkedin: '#',
    email: 'member2@example.com',
  },
  {
    name: 'Leav Phichsang',
    role: 'Norton',
    bio: 'responsible for building the authentication system of StayFinder and ensuring secure user access management.',
    // skills: ['Figma', 'CSS', 'Design Systems'],
    bg: 'linear-gradient(135deg, #198754, #2dc08c)',
    github: '#',
    linkedin: '#',
    email: 'member3@example.com',
  },
  {
    name: 'Meng Minea',
    role: 'RUPP',
    bio: 'Responsible for user profiles and activity tracking and ensures users can view and manage their booking history, reviews.',
    // skills: ['Vue 3', 'Laravel', 'Docker'],
    bg: 'linear-gradient(135deg, #6f42c1, #9d6fe8)',
    github: '#',
    linkedin: '#',
    email: 'member4@example.com',
  },
]

const reasons = [
  {
    icon: 'bi-patch-check-fill',
    title: 'Verified Listings',
    desc: 'Every room is reviewed before going live. No fake photos, no hidden surprises.',
  },
  {
    icon: 'bi-currency-dollar',
    title: 'Transparent Pricing',
    desc: 'See all costs upfront — rent, water, electric, parking, and trash. No hidden fees.',
  },
  {
    icon: 'bi-phone-fill',
    title: 'Mobile Friendly',
    desc: 'Browse, book, and manage your rental from any device, anywhere, anytime.',
  },
  {
    icon: 'bi-headset',
    title: 'Fast Support',
    desc: 'Our team responds quickly to disputes, questions, and technical issues.',
  },
  {
    icon: 'bi-geo-alt-fill',
    title: 'All Districts',
    desc: 'Coverage across all major districts in Phnom Penh with detailed location maps.',
  },
  {
    icon: 'bi-lock-fill',
    title: 'Secure Transactions',
    desc: 'Payment proofs are uploaded securely and reviewed by property owners directly.',
  },
]
</script>

<style scoped>
/* ── Base ── */
.about-page {
  background: #f8f9fa;
}
.text-navy {
  color: #031c36;
}
.text-orange {
  color: #ff5f00;
}

/* ── Hero ── */
.hero-section {
  background: linear-gradient(135deg, #031c36 0%, #0d3a6e 60%, #1a5fa8 100%);
  min-height: 420px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  margin-top: 76px;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ff5f00' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
.hero-label {
  background: rgba(255, 95, 0, 0.2);
  color: #ff9a5c;
  border: 1px solid rgba(255, 95, 0, 0.3);
  font-size: 0.78rem;
  font-weight: 700;
  padding: 6px 16px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.hero-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
}
.hero-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.7;
  max-width: 560px;
  margin: 0 auto;
}

.bio-text {
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* limit to 3 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.stats-bar {
  background: #031c36;
}
.stat-item {
  padding: 20px 12px;
}
.stat-item + .stat-item {
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}
.stat-number {
  font-size: 1.8rem;
  font-weight: 800;
  color: #ff5f00;
  line-height: 1;
}
.stat-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-top: 4px;
}

/* ── Section labels ── */
.section-label {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #ff5f00;
  margin-bottom: 12px;
}
.section-title {
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 800;
  color: #031c36;
  line-height: 1.25;
}

/* ── Mission image ── */
.mission-img-wrap {
  position: relative;
  display: inline-block;
  width: 100%;
}
.mission-img {
  width: 100%;
  height: 420px;
  object-fit: cover;
  border-radius: 20px;
}
.mission-badge {
  position: absolute;
  bottom: 24px;
  left: 24px;
  background: #fff;
  border-radius: 16px;
  padding: 16px 20px;
  box-shadow: 0 8px 24px rgba(3, 28, 54, 0.15);
  text-align: center;
}

.value-pill {
  background: rgba(255, 95, 0, 0.08);
  border: 1px solid rgba(255, 95, 0, 0.2);
  color: #ff5f00;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
}

.how-section {
  background: #fff;
}
.step-card {
  background: #f8f9fa;
  border-radius: 20px;
  border: 1px solid #eee;
  position: relative;
  transition:
    transform 0.25s,
    box-shadow 0.25s;
}
.step-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(3, 28, 54, 0.1);
}
.step-number {
  position: absolute;
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  background: #ff5f00;
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 800;
}
.step-icon-wrap {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #031c36, #0d3a6e);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #ff5f00;
  margin: 0 auto;
}

.team-card {
  background: #fff;
  border-radius: 20px;
  border: 1px solid #eee;
  overflow: hidden;
  transition:
    transform 0.25s,
    box-shadow 0.25s;
}
.team-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 48px rgba(3, 28, 54, 0.12);
}

.team-avatar-wrap {
  position: relative;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8f9fa, #fff);
}
.team-avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
.avatar-initial {
  font-size: 2.2rem;
  font-weight: 800;
  color: #fff;
  text-transform: uppercase;
  line-height: 1;
}
.team-avatar-ring {
  position: absolute;
  width: 104px;
  height: 104px;
  border-radius: 50%;
  border: 3px solid #ff5f00;
  opacity: 0.3;
  z-index: 1;
}

.team-role-badge {
  background: rgba(255, 95, 0, 0.1);
  color: #ff5f00;
  border: 1px solid rgba(255, 95, 0, 0.2);
  font-size: 0.7rem;
  font-weight: 800;
  padding: 3px 12px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.skill-tag {
  background: rgba(3, 28, 54, 0.06);
  color: #031c36;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 20px;
}

.social-link {
  width: 34px;
  height: 34px;
  background: #f8f9fa;
  border: 1px solid #eee;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #031c36;
  font-size: 0.9rem;
  text-decoration: none;
  transition:
    background 0.2s,
    color 0.2s,
    transform 0.2s;
}
.social-link:hover {
  background: #031c36;
  color: #fff;
  transform: scale(1.1);
}

.why-section {
  background: #fff;
}
.reason-card {
  background: #f8f9fa;
  border-radius: 16px;
  border: 1px solid #eee;
  transition:
    transform 0.2s,
    border-color 0.2s;
}
.reason-card:hover {
  transform: translateY(-4px);
  border-color: #ff5f00;
}
.reason-icon {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, #031c36, #0d3a6e);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  color: #ff5f00;
}

.cta-card {
  background: linear-gradient(135deg, #031c36 0%, #0d3a6e 100%);
  border-radius: 24px;
  position: relative;
  overflow: hidden;
}
.cta-pattern {
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ff5f00' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
.btn-cta-primary {
  background: #ff5f00;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  transition:
    background 0.2s,
    transform 0.15s;
}
.btn-cta-primary:hover {
  background: #e65600;
  color: #fff;
  transform: translateY(-2px);
}
.btn-cta-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  font-weight: 700;
  transition:
    background 0.2s,
    transform 0.15s;
  backdrop-filter: blur(4px);
}
.btn-cta-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  transform: translateY(-2px);
}

/* ── Responsive ── */
@media (max-width: 576px) {
  .mission-img {
    height: 260px;
  }
  .hero-title {
    font-size: 1.8rem;
  }
}
</style>

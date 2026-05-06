<template>
  <div class="about-page">
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="container position-relative" style="z-index: 2">
        <div class="row justify-content-center text-center py-5">
          <div class="col-lg-8">
            <span class="hero-label mb-3 d-inline-block">អំពី StayFinder</span>
            <h1 class="hero-title mb-4">រកផ្ទះស្នាក់នៅដ៏ល្អឥតខ្ចោះរបស់អ្នក</h1>
            <p class="hero-subtitle">
              យើងភ្ជាប់អ្នករកស្នាក់នៅជាមួយបន្ទប់ល្អៗនៅទូទាំងភ្នំពេញ។
              មានតម្លាភាព គួរឱ្យទុកចិត្ត និងត្រូវបានបង្កើតសម្រាប់អ្នកជួលទំនើប។
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
                alt="បេសកម្មរបស់យើង"
                class="mission-img"
              />
              <div class="mission-badge">
                <i class="bi bi-award-fill text-orange fs-3 mb-2 d-block"></i>
                <div class="fw-bold text-navy small">វេទិកាគួរជឿទុកចិត្ត</div>
                <div class="text-muted" style="font-size: 0.72rem">ចាប់តាំងពីឆ្នាំ ២០២៤</div>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <span class="section-label">បេសកម្មរបស់យើង</span>
            <h2 class="section-title mb-4">ធ្វើឱ្យការជួលបន្ទប់មានភាពងាយស្រួល និងមានតម្លាភាព</h2>
            <p class="text-muted lh-lg mb-4">
              StayFinder បានកើតឡើងពីការខកចិត្តដ៏សាមញ្ញ — ការស្វែងរកបន្ទប់ល្អនៅភ្នំពេញ
              មានភាពស្មុគស្មាញ យឺតយ៉ាវ និងមានហានិភ័យ។ យើងបានបង្កើតវេទិកាមួយ
              ដែលអ្នកជួលអាចរុករករាយការណ៍ដែលបានផ្ទៀងផ្ទាត់ ជាមួយរូបភាពពិត
              តម្លៃច្បាស់លាស់ និងការវាយតម្លៃស្មោះត្រង់។
            </p>
            <p class="text-muted lh-lg mb-4">
              សម្រាប់ម្ចាស់អចលនទ្រព្យ យើងផ្តល់ឧបករណ៍សម្រាប់ចុះបញ្ជី គ្រប់គ្រង
              និងពង្រីកអាជីវកម្មជួលរបស់ពួកគេ ដោយគ្មានការខំប្រឹងប្រែង។
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
          <span class="section-label">របៀបដំណើរការ</span>
          <h2 class="section-title">ជំហានងាយស្រួលទៅកាន់ផ្ទះថ្មីរបស់អ្នក</h2>
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
          <span class="section-label">ក្រុមការងាររបស់យើង</span>
          <h2 class="section-title">មនុស្សនៅពីក្រោយ StayFinder</h2>
          <p class="text-muted">
            ក្រុមអ្នកអភិវឌ្ឍន៍ និងអ្នករចនា ដែលមានចិត្តស្រឡាញ់ កំពុងកសាងអនាគតនៃការជួលបន្ទប់នៅកម្ពុជា។
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
                <p class="text-muted small mb-3" style="line-height: 1.6">{{ member.bio }}</p>
                <div class="d-flex justify-content-center gap-3">
                  <a v-if="member.github" :href="member.github" target="_blank" class="social-link" title="GitHub">
                    <i class="bi bi-github"></i>
                  </a>
                  <a v-if="member.linkedin" :href="member.linkedin" target="_blank" class="social-link" title="LinkedIn">
                    <i class="bi bi-linkedin"></i>
                  </a>
                  <a v-if="member.email" :href="'mailto:' + member.email" class="social-link" title="Email">
                    <i class="bi bi-envelope-fill"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5 why-section">
      <div class="container">
        <div class="text-center mb-5">
          <span class="section-label">ហេតុអ្វីបានជាជ្រើស StayFinder</span>
          <h2 class="section-title">បង្កើតខុសគ្នា បង្កើតឱ្យប្រសើរជាងមុន</h2>
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
            <h2 class="fw-bold text-white mb-3">រួចរាល់ហើយដើម្បីស្វែងរកបន្ទប់ល្អឥតខ្ចោះ?</h2>
            <p class="text-white opacity-75 mb-4">
              ចូលរួមជាមួយអ្នកជួលរាប់ពាន់នាក់ ដែលបានរកផ្ទះស្នាក់នៅតាមរយៈ StayFinder។
            </p>
            <div class="d-flex gap-3 justify-content-center flex-wrap">
              <router-link to="/rooms" class="btn btn-cta-primary px-5 py-3 fw-bold">
                <i class="bi bi-search me-2"></i>រុករកបន្ទប់
              </router-link>
              <router-link to="/register" class="btn btn-cta-secondary px-5 py-3 fw-bold">
                <i class="bi bi-person-plus-fill me-2"></i>ចុះឈ្មោះឥតគិតថ្លៃ
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
  { value: '500+', label: 'បន្ទប់ដែលបានចុះបញ្ជី' },
  { value: '1,200+', label: 'អ្នកជួលពេញចិត្ត' },
  { value: '25+', label: 'ខណ្ឌដែលបានគ្រប់ដណ្តប់' },
  { value: '98%', label: 'អត្រាពេញចិត្ត' },
]

const values = ['តម្លាភាព', 'បញ្ជីដែលបានផ្ទៀងផ្ទាត់', 'ការទូទាត់ប្រកបដោយសុវត្ថិភាព', 'ការគាំទ្ររហ័ស']

const steps = [
  {
    icon: 'bi-search',
    title: 'ស្វែងរក និងច្រោះ',
    desc: 'រុករកបន្ទប់រាប់រយ តាមខណ្ឌ តម្លៃ ទំហំ និងសេវាកម្ម ដើម្បីស្វែងរកបន្ទប់ដ៏ល្អបំផុត។',
  },
  {
    icon: 'bi-calendar-check',
    title: 'កក់ ឬ ជួល',
    desc: 'ដាក់ស្នើសំណើកក់ ឬ ជួលផ្ទាល់ ជាមួយការបង្ហោះភស្តុតាងការទូទាត់ប្រកបដោយសុវត្ថិភាព។',
  },
  {
    icon: 'bi-house-check-fill',
    title: 'ចូលរស់នៅ',
    desc: 'នៅពេលម្ចាស់អចលនទ្រព្យអនុម័ត ទទួលបានគន្លឹះ ហើយចាប់ផ្តើមរស់នៅក្នុងទីតាំងថ្មីរបស់អ្នក។',
  },
]

const team = [
  {
    name: 'Tha Siei',
    role: 'SETEC',
    bio: 'ជាអ្នកដឹកនាំក្រុមទាំងមូល សម្របសម្រួលក្រុម និងគ្រប់គ្រងដំណើរការកក់ និងជួល ដើម្បីឱ្យអ្នកប្រើប្រាស់អាចស្នើសុំបន្ទប់បានយ៉ាងងាយស្រួល។',
    bg: 'linear-gradient(135deg, #031c36, #0d3a6e)',
    github: '#',
    linkedin: '#',
    email: 'member1@example.com',
  },
  {
    name: 'Hing Chanbopha',
    role: 'RUPP',
    bio: 'ទទួលខុសត្រូវក្នុងការបង្កើតបន្ទប់ ទំព័រដើម អ្នកប្រើ និងមុខងារចុះបញ្ជីបន្ទប់',
    bg: 'linear-gradient(135deg, #ff5f00, #ff8c00)',
    github: '#',
    linkedin: '#',
    email: 'member2@example.com',
  },
  {
    name: 'Leav Phichsang',
    role: 'Norton',
    bio: 'ទទួលខុសត្រូវក្នុងការបង្កើតប្រព័ន្ធផ្ទៀងផ្ទាត់អត្តសញ្ញាណ និងធានាការចូលប្រើប្រកបដោយសុវត្ថិភាព។',
    bg: 'linear-gradient(135deg, #198754, #2dc08c)',
    github: '#',
    linkedin: '#',
    email: 'member3@example.com',
  },
  {
    name: 'Meng Minea',
    role: 'RUPP',
    bio: 'ទទួលខុសត្រូវក្នុងការគ្រប់គ្រងប្រវត្តិរូប អ្នកប្រើ ប្រវត្តិកក់ និងការពិនិត្យឡើងវិញ។',
    bg: 'linear-gradient(135deg, #6f42c1, #9d6fe8)',
    github: '#',
    linkedin: '#',
    email: 'member4@example.com',
  },
]

const reasons = [
  {
    icon: 'bi-patch-check-fill',
    title: 'បញ្ជីដែលបានផ្ទៀងផ្ទាត់',
    desc: 'រាល់បន្ទប់ត្រូវបានពិនិត្យមុនពេលចេញផ្សាយ។ គ្មានរូបភាពក្លែងក្លាយ ឬ ព័ត៌មានមិនត្រឹមត្រូវទេ។',
  },
  {
    icon: 'bi-currency-dollar',
    title: 'តម្លៃមានតម្លាភាព',
    desc: 'មើលឃើញចំណាយទាំងអស់ជាមុន — ជួល ទឹក អគ្គិសនី ចំណតរថយន្ត និងសំរាម។',
  },
  {
    icon: 'bi-phone-fill',
    title: 'ប្រើបានលើទូរស័ព្ទ',
    desc: 'រុករក កក់ និងគ្រប់គ្រងការជួលរបស់អ្នកពីឧបករណ៍ណាក៏បាន គ្រប់ពេលវេលា។',
  },
  {
    icon: 'bi-headset',
    title: 'ការគាំទ្ររហ័ស',
    desc: 'ក្រុមការងាររបស់យើងឆ្លើយតបយ៉ាងរហ័សចំពោះសំណួរ និងបញ្ហាបច្ចេកទេស។',
  },
  {
    icon: 'bi-geo-alt-fill',
    title: 'គ្រប់ខណ្ឌ',
    desc: 'ការគ្របដណ្តប់នៅទូទាំងខណ្ឌធំៗទាំងអស់នៅភ្នំពេញ ជាមួយផែនទីទីតាំងលម្អិត។',
  },
  {
    icon: 'bi-lock-fill',
    title: 'ប្រតិបត្តិការប្រកបដោយសុវត្ថិភាព',
    desc: 'ភស្តុតាងការទូទាត់ត្រូវបានបង្ហោះប្រកបដោយសុវត្ថិភាព និងត្រូវបានពិនិត្យដោយម្ចាស់អចលនទ្រព្យ។',
  },
]
</script>

<style scoped>
/* ── Khmer Font ── */
.about-page,
.about-page * {
  font-family: 'KantumruyPro', 'Kantumruy Pro', sans-serif;
}

/* ── Base ── */
.about-page {
  background: #f8f9fa;
}
.text-navy { color: #031c36; }
.text-orange { color: #ff5f00; }

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
  font-size: 0.85rem;
  font-weight: 700;
  padding: 6px 16px;
  border-radius: 20px;
  letter-spacing: 0.04em;
}
.hero-title {
  font-size: clamp(1.8rem, 5vw, 2.8rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.4;
}
.hero-subtitle {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.9;
  max-width: 560px;
  margin: 0 auto;
}

/* ── Stats ── */
.stats-bar { background: #031c36; }
.stat-item { padding: 20px 12px; }
.stat-item + .stat-item { border-left: 1px solid rgba(255,255,255,0.1); }
.stat-number {
  font-size: 1.8rem;
  font-weight: 800;
  color: #ff5f00;
  line-height: 1;
}
.stat-label {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.6);
  letter-spacing: 0.03em;
  margin-top: 4px;
}

/* ── Section labels ── */
.section-label {
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #ff5f00;
  margin-bottom: 12px;
}
.section-title {
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 800;
  color: #031c36;
  line-height: 1.4;
}

/* ── Mission ── */
.mission-img-wrap { position: relative; display: inline-block; width: 100%; }
.mission-img { width: 100%; height: 420px; object-fit: cover; border-radius: 20px; }
.mission-badge {
  position: absolute;
  bottom: 24px;
  left: 24px;
  background: #fff;
  border-radius: 16px;
  padding: 16px 20px;
  box-shadow: 0 8px 24px rgba(3,28,54,0.15);
  text-align: center;
}

/* ── Values ── */
.value-pill {
  background: rgba(255,95,0,0.08);
  border: 1px solid rgba(255,95,0,0.2);
  color: #ff5f00;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
}

/* ── How section ── */
.how-section { background: #fff; }
.step-card {
  background: #f8f9fa;
  border-radius: 20px;
  border: 1px solid #eee;
  position: relative;
  transition: transform 0.25s, box-shadow 0.25s;
}
.step-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(3,28,54,0.1); }
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

/* ── Team ── */
.team-card {
  background: #fff;
  border-radius: 20px;
  border: 1px solid #eee;
  overflow: hidden;
  transition: transform 0.25s, box-shadow 0.25s;
}
.team-card:hover { transform: translateY(-8px); box-shadow: 0 20px 48px rgba(3,28,54,0.12); }
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
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
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
  background: rgba(255,95,0,0.1);
  color: #ff5f00;
  border: 1px solid rgba(255,95,0,0.2);
  font-size: 0.7rem;
  font-weight: 800;
  padding: 3px 12px;
  border-radius: 20px;
  letter-spacing: 0.03em;
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
  transition: background 0.2s, color 0.2s, transform 0.2s;
}
.social-link:hover { background: #031c36; color: #fff; transform: scale(1.1); }

/* ── Why section ── */
.why-section { background: #fff; }
.reason-card {
  background: #f8f9fa;
  border-radius: 16px;
  border: 1px solid #eee;
  transition: transform 0.2s, border-color 0.2s;
}
.reason-card:hover { transform: translateY(-4px); border-color: #ff5f00; }
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

/* ── CTA ── */
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
  transition: background 0.2s, transform 0.15s;
}
.btn-cta-primary:hover { background: #e65600; color: #fff; transform: translateY(-2px); }
.btn-cta-secondary {
  background: rgba(255,255,255,0.1);
  color: #fff;
  border: 1.5px solid rgba(255,255,255,0.3);
  border-radius: 12px;
  font-weight: 700;
  transition: background 0.2s, transform 0.15s;
  backdrop-filter: blur(4px);
}
.btn-cta-secondary:hover { background: rgba(255,255,255,0.2); color: #fff; transform: translateY(-2px); }

/* ── Responsive ── */
@media (max-width: 576px) {
  .mission-img { height: 260px; }
  .hero-title { font-size: 1.6rem; }
}
</style>
<template>
  <div class="container-fluid py-3 px-md-4">

    <!-- ── Header ── -->
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
      <div class="card-header-navy p-3 text-white d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h4 class="fw-bold mb-0">Browse Rooms</h4>
          <small class="opacity-75">{{ totalRooms }} room{{ totalRooms !== 1 ? 's' : '' }} found</small>
        </div>
        <div class="d-flex gap-2 align-items-center">
          <span class="badge bg-orange px-3 py-2">
            <i class="bi bi-buildings me-1"></i>Listings
          </span>
          <button class="btn btn-sm btn-outline-light d-lg-none" @click="showMobileFilter = !showMobileFilter">
            <i class="bi bi-funnel-fill me-1"></i>Filters
            <span v-if="activeFilterCount > 0" class="badge bg-orange ms-1">{{ activeFilterCount }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="row g-4">

      <!-- ── Filter Sidebar ── -->
      <div class="col-lg-3" :class="{ 'd-none d-lg-block': !showMobileFilter }">
        <div class="card border-0 shadow-sm rounded-4 sticky-top " style="top: 80px;">
          <div class="card-header-navy px-4 py-3 d-flex justify-content-between align-items-center rounded-4">
            <span class="fw-bold text-white">
              <i class="bi bi-funnel-fill me-2"></i>Filters
            </span>
            <button v-if="activeFilterCount > 0" class="btn btn-sm btn-outline-light" @click="clearFilters">
              Clear All
            </button>
          </div>
          <div class="card-body p-4">

            <div class="mb-4">
              <label class="filter-label">Search</label>
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0">
                  <i class="bi bi-search text-muted"></i>
                </span>
                <input v-model="filters.search" type="text"
                  class="form-control custom-input border-start-0 ps-0"
                  placeholder="Room title..." @input="debouncedFetch" />
              </div>
            </div>

            <div class="mb-4">
              <label class="filter-label">District</label>
              <select v-model="filters.district" class="form-select custom-input" @change="applyFilters">
                <option value="">All Districts</option>
                <option v-for="d in districtStore.districts" :key="d.id" :value="d.id">{{ d.name }}</option>
              </select>
            </div>

            <div class="mb-4">
              <label class="filter-label">Price Range ($/month)</label>
              <div class="row g-2">
                <div class="col-6">
                  <input v-model="filters.price_start" type="number" class="form-control custom-input"
                    placeholder="Min" min="0" @change="applyFilters" />
                </div>
                <div class="col-6">
                  <input v-model="filters.price_end" type="number" class="form-control custom-input"
                    placeholder="Max" min="0" @change="applyFilters" />
                </div>
              </div>
              <div class="d-flex flex-wrap gap-1 mt-2">
                <button v-for="range in priceRanges" :key="range.label" class="btn btn-xs"
                  :class="filters.price_start == range.min && filters.price_end == range.max ? 'btn-orange' : 'btn-outline-secondary'"
                  @click="setQuickPrice(range)">{{ range.label }}</button>
              </div>
            </div>

            <div class="mb-4">
              <label class="filter-label">Sort By</label>
              <select v-model="filters.sort_col" class="form-select custom-input" @change="applyFilters">
                <option value="id">Newest First</option>
                <option value="price">Price</option>
                <option value="title">Title (A–Z)</option>
              </select>
              <div class="d-flex gap-2 mt-2">
                <button class="btn btn-sm flex-fill rounded-2"
                  :class="filters.sort_dir === 'asc' ? 'btn-orange' : 'btn-outline-secondary'"
                  @click="filters.sort_dir = 'asc'; applyFilters()">
                  <i class="bi bi-sort-up me-1"></i>Asc
                </button>
                <button class="btn btn-sm flex-fill rounded-2"
                  :class="filters.sort_dir === 'desc' ? 'btn-orange' : 'btn-outline-secondary'"
                  @click="filters.sort_dir = 'desc'; applyFilters()">
                  <i class="bi bi-sort-down me-1"></i>Desc
                </button>
              </div>
            </div>

            <div class="mb-4">
              <label class="filter-label">Beds</label>
              <div class="d-flex flex-wrap gap-2">
                <button v-for="b in bedOptions" :key="b" class="btn btn-sm"
                  :class="filters.bed === b ? 'btn-orange' : 'btn-outline-secondary'"
                  @click="toggleBed(b)">{{ b }}</button>
              </div>
            </div>

            <div class="mb-4">
              <label class="filter-label">Room Size</label>
              <div class="d-flex flex-wrap gap-2">
                <button v-for="s in sizeOptions" :key="s" class="btn btn-sm"
                  :class="filters.size === s ? 'btn-orange' : 'btn-outline-secondary'"
                  @click="toggleSize(s)">{{ s }}</button>
              </div>
            </div>

            <div class="mb-2">
              <label class="filter-label">Amenities</label>
              <div class="amenity-filter-grid">
                <div v-for="opt in roomOptionStore.options" :key="opt.id"
                  class="amenity-check-item" :class="{ active: filters.options.includes(opt.id) }"
                  @click="toggleAmenity(opt.id)">
                  <i class="bi bi-check-circle-fill check-icon"></i>
                  <span>{{ opt.name }}</span>
                </div>
              </div>
            </div>

          </div>
          <div class="card-footer bg-white border-0 px-4 pb-4 d-lg-none">
            <button class="btn btn-orange w-100 fw-bold" @click="showMobileFilter = false">
              <i class="bi bi-check-circle me-2"></i>Apply Filters
            </button>
          </div>
        </div>
      </div>

      <!-- ── Room Grid ── -->
      <div class="col-lg-9">

        <!-- Active filter tags -->
        <div v-if="activeFilterCount > 0" class="d-flex flex-wrap gap-2 mb-3">
          <span v-if="filters.search" class="filter-tag">
            <i class="bi bi-search me-1"></i>{{ filters.search }}
            <i class="bi bi-x ms-2" @click="filters.search = ''; applyFilters()"></i>
          </span>
          <span v-if="filters.district" class="filter-tag">
            <i class="bi bi-geo-alt me-1"></i>{{ districtName(filters.district) }}
            <i class="bi bi-x ms-2" @click="filters.district = ''; applyFilters()"></i>
          </span>
          <span v-if="filters.price_start || filters.price_end" class="filter-tag">
            <i class="bi bi-currency-dollar me-1"></i>
            {{ filters.price_start || '0' }} – {{ filters.price_end || '∞' }}
            <i class="bi bi-x ms-2" @click="filters.price_start = ''; filters.price_end = ''; applyFilters()"></i>
          </span>
          <span v-if="filters.bed" class="filter-tag">
            <i class="bi bi-person me-1"></i>{{ filters.bed }} bed
            <i class="bi bi-x ms-2" @click="filters.bed = ''; applyFilters()"></i>
          </span>
          <span v-if="filters.size" class="filter-tag">
            <i class="bi bi-aspect-ratio me-1"></i>{{ filters.size }}
            <i class="bi bi-x ms-2" @click="filters.size = ''; applyFilters()"></i>
          </span>
          <span v-for="oid in filters.options" :key="oid" class="filter-tag">
            <i class="bi bi-check me-1"></i>{{ optionName(oid) }}
            <i class="bi bi-x ms-2" @click="toggleAmenity(oid)"></i>
          </span>
        </div>

      
        <div v-if="roomStore.loading" class="row g-3">
          <div v-for="i in 9" :key="i" class="col-md-6 col-xl-4">
            <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100">

              <!-- Image skeleton -->
              <div class="skel-img"></div>

              <div class="card-body p-3">
                <!-- Price + badge row -->
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <div class="skel-line" style="width:80px;height:22px;border-radius:6px"></div>
                  <div class="skel-line" style="width:70px;height:18px;border-radius:20px"></div>
                </div>
                <!-- Title lines -->
                <div class="skel-line mb-2" style="width:100%;height:15px;border-radius:4px"></div>
                <div class="skel-line mb-3" style="width:65%;height:15px;border-radius:4px"></div>
                <!-- Spec chips -->
                <div class="d-flex gap-2 mb-2">
                  <div class="skel-line" style="width:58px;height:24px;border-radius:20px"></div>
                  <div class="skel-line" style="width:72px;height:24px;border-radius:20px"></div>
                </div>
                <!-- Amenity tags -->
                <div class="d-flex gap-1">
                  <div class="skel-line" style="width:52px;height:20px;border-radius:20px"></div>
                  <div class="skel-line" style="width:64px;height:20px;border-radius:20px"></div>
                  <div class="skel-line" style="width:48px;height:20px;border-radius:20px"></div>
                </div>
              </div>

              <!-- Footer skeleton -->
              <div class="card-footer bg-light border-0 px-3 py-2">
                <div class="d-flex gap-3">
                  <div class="skel-line" style="width:44px;height:13px;border-radius:4px"></div>
                  <div class="skel-line" style="width:44px;height:13px;border-radius:4px"></div>
                  <div class="skel-line" style="width:44px;height:13px;border-radius:4px"></div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- ── Empty state ── -->
        <div v-else-if="filteredRooms.length === 0" class="empty-state text-center py-5">
          <div class="empty-icon mb-3">
            <i class="bi bi-building-slash"></i>
          </div>
          <h5 class="fw-bold text-navy">No rooms found</h5>
          <p class="text-muted">Try adjusting your filters to see more results.</p>
          <button class="btn btn-orange px-4" @click="clearFilters">
            <i class="bi bi-arrow-counterclockwise me-2"></i>Reset Filters
          </button>
        </div>

        <!-- ── Room Cards ── -->
        <div v-else class="row g-3">
          <div v-for="room in paginatedRooms" :key="room.id" class="col-md-6 col-xl-4">
            <div class="room-card card border-0 shadow-sm rounded-4 overflow-hidden h-100"
              @click="$router.push(`/rooms/${room.id}`)">

              <div class="room-img-wrap position-relative">
                <img v-if="room.image" :src="room.image" :alt="room.title" class="room-img" />
                <div v-else class="room-img-placeholder d-flex align-items-center justify-content-center">
                  <i class="bi bi-building text-muted" style="font-size:2.5rem"></i>
                </div>
                <span v-if="room.percent_promotion > 0"
                  class="badge bg-orange position-absolute top-0 start-0 m-2 px-2 py-1">
                  <i class="bi bi-tag-fill me-1"></i>-{{ room.percent_promotion }}%
                </span>
              <button
  class="wishlist-btn position-absolute top-0 end-0 m-2"
  @click.stop="handleToggle(room)"
  :class="{ 'active': wishlistStore.isWishlisted(room.id) }"
>
  <i :class="wishlistStore.isWishlisted(room.id) ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
</button>



              </div>

              <div class="card-body p-3">
                <div class="d-flex justify-content-between align-items-start mb-1">
                  <div class="room-price">${{ room.price }}<small class="text-muted fw-normal">/months</small></div>
                  <span v-if="room.district" class="badge district-badge">
                    <i class="bi bi-geo-alt-fill me-1"></i>{{ room.district.name }}
                  </span>
                </div>
                <h6 class="fw-bold text-navy mb-2 room-title">{{ room.title }}</h6>
                <div class="d-flex flex-wrap gap-2 mb-2">
                  <span v-if="room.bed" class="spec-chip"><i class="bi bi-person-fill me-1"></i>{{ room.bed }}</span>
                  <span v-if="room.size_room" class="spec-chip"><i class="bi bi-aspect-ratio me-1"></i>{{ room.size_room }}</span>
                </div>
                <div class="d-flex flex-wrap gap-1">
                  <span v-for="opt in (room.room_options || []).slice(0,3)" :key="opt.id" class="amenity-tag">
                    {{ opt.name }}
                  </span>
                  <span v-if="(room.room_options || []).length > 3" class="amenity-tag text-muted">
                    +{{ room.room_options.length - 3 }} more
                  </span>
                </div>
              </div>

              <div class="card-footer bg-light border-0 px-3 py-2">
                <div class="d-flex gap-3 small text-muted">
                  <span v-if="room.pay_water"><i class="bi bi-droplet-fill text-info me-1"></i>${{ room.pay_water }}</span>
                  <span v-if="room.pay_electric"><i class="bi bi-lightning-fill text-warning me-1"></i>${{ room.pay_electric }}</span>
                  <span v-if="room.pay_parking"><i class="bi bi-car-front-fill text-secondary me-1"></i>${{ room.pay_parking }}</span>
                  <span v-if="room.pay_trash"><i class="bi bi-trash3-fill text-success me-1"></i>${{ room.pay_trash }}</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- ── Pagination ── -->
        <nav v-if="totalPages > 1" class="mt-4">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="changePage(currentPage - 1)">
                <i class="bi bi-chevron-left"></i>
              </button>
            </li>
            <li v-for="p in pageNumbers" :key="p" class="page-item"
              :class="{ active: p === currentPage, disabled: p === '...' }">
              <button class="page-link" @click="p !== '...' && changePage(p)">{{ p }}</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="changePage(currentPage + 1)">
                <i class="bi bi-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>

      </div><!-- end col-lg-9 -->
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, watch } from 'vue'
import { useRoomStore } from '@/stores/RoomStore'
import { useDistrictStore } from '@/stores/DistrictStore'
import { useRoomOptionStore } from '@/stores/RoomOptionStore'
import { useRoute } from 'vue-router'
import { useWishlistStore } from '@/stores/WishlistStore'
import { useRouter } from 'vue-router'

const roomStore       = useRoomStore()
const districtStore   = useDistrictStore()
const roomOptionStore = useRoomOptionStore()
const route           = useRoute()
const wishlistStore   = useWishlistStore()
const router          = useRouter()

const showMobileFilter = ref(false)
const currentPage      = ref(1)
const perPage          = 12

/* ── Wishlist toggle ── */
const handleToggle = (room) => {
  const token = localStorage.getItem('token')
  if (!token) { router.push('/login'); return }
  wishlistStore.toggleWishlist(room)
}

/* ── Filter state ── */
const filters = reactive({
  search: '', district: '', price_start: '', price_end: '',
  sort_col: 'id', sort_dir: 'desc', bed: '', size: '', options: [],
})

const priceRanges = [
  { label: '<$50',    min: 0,   max: 50  },
  { label: '$50-100', min: 50,  max: 100 },
  { label: '$100-200',min: 100, max: 200 },
  { label: '>$200',   min: 200, max: ''  },
]
const bedOptions  = ['1', '2', '3', '4', '5+']
const sizeOptions = ['Small', 'Medium', 'Big', 'Extra Large']

/* ── Debounce helper ── */
let debounceTimer = null
const debouncedFetch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => applyFilters(), 400)
}

/* ── Active filter count ── */
const activeFilterCount = computed(() => {
  let c = 0
  if (filters.search) c++
  if (filters.district) c++
  if (filters.price_start || filters.price_end) c++
  if (filters.bed) c++
  if (filters.size) c++
  c += filters.options.length
  return c
})

/* ── Helpers ── */
const districtName = (id) => districtStore.districts.find(d => d.id == id)?.name || id
const optionName   = (id) => roomOptionStore.options.find(o => o.id === id)?.name || id

/* ── Filter toggle actions ── */
function toggleAmenity(id) {
  const idx = filters.options.indexOf(id)
  if (idx === -1) filters.options.push(id)
  else filters.options.splice(idx, 1)
  applyFilters()
}
function toggleBed(b)  { filters.bed  = filters.bed  === b ? '' : b; applyFilters() }
function toggleSize(s) { filters.size = filters.size === s ? '' : s; applyFilters() }
function setQuickPrice(range) {
  filters.price_start = range.min
  filters.price_end   = range.max
  applyFilters()
}
function clearFilters() {
  Object.assign(filters, {
    search: '', district: '', price_start: '', price_end: '',
    sort_col: 'id', sort_dir: 'desc', bed: '', size: '', options: []
  })
  currentPage.value = 1
  applyFilters()
}

/* ──────────────────────────────────────────────────────────
   Build query string from ALL server-supported filters
   and send to the API.  Filters the API does NOT support
   (search, bed, size) are applied client-side afterwards.
   ────────────────────────────────────────────────────────── */
async function applyFilters() {
  currentPage.value = 1

  const params = new URLSearchParams()
  /* We fetch a large page so the client-side post-filters
     (search / bed / size) still have a complete dataset.   */
  params.set('page', 1)
  params.set('per_page', 200)

  /* Server-supported filters */
  params.set('sort_col', filters.sort_col)
  params.set('sort_dir', filters.sort_dir)
  if (filters.district)       params.set('district', filters.district)
  if (filters.price_start !== '' && filters.price_start !== null)
    params.set('price_start', filters.price_start)
  if (filters.price_end !== '' && filters.price_end !== null)
    params.set('price_end', filters.price_end)
  if (filters.options.length)
    params.set('options', JSON.stringify(filters.options))

  await roomStore.fetchRooms(params.toString())
}

/* ──────────────────────────────────────────────────────────
   Client-side post-filtering for search / bed / size
   (the API ignores these params so we handle them here)
   ────────────────────────────────────────────────────────── */
const filteredRooms = computed(() => {
  let list = roomStore.rooms || []

  /* Search by title */
  if (filters.search) {
    const q = filters.search.toLowerCase()
    list = list.filter(r => r.title?.toLowerCase().includes(q))
  }

  /* Bed count */
  if (filters.bed) {
    if (filters.bed === '5+') {
      list = list.filter(r => parseInt(r.bed) >= 5)
    } else {
      list = list.filter(r => String(r.bed) === filters.bed)
    }
  }

  /* Room size */
  if (filters.size) {
    const sz = filters.size.toLowerCase()
    list = list.filter(r => r.size_room?.toLowerCase().includes(sz))
  }

  return list
})

/* ── Pagination (client-side over the filtered results) ── */
const totalRooms     = computed(() => filteredRooms.value.length)
const totalPages     = computed(() => Math.ceil(totalRooms.value / perPage))
const paginatedRooms = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredRooms.value.slice(start, start + perPage)
})

const pageNumbers = computed(() => {
  const total = totalPages.value
  const cur   = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = [1]
  if (cur > 3) pages.push('...')
  for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i)
  if (cur < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

function changePage(p) {
  if (p < 1 || p > totalPages.value) return
  currentPage.value = p
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/* ── Lifecycle ── */
onMounted(async () => {
  // Pre-fill filters from homepage search query params
  if (route.query.search)      filters.search      = route.query.search
  if (route.query.district)    filters.district    = route.query.district
  if (route.query.price_start) filters.price_start = route.query.price_start
  if (route.query.price_end)   filters.price_end   = route.query.price_end
  if (route.query.bed)         filters.bed         = route.query.bed
  if (route.query.size)        filters.size        = route.query.size

  await Promise.all([
    districtStore.fetchDistricts(),
    roomOptionStore.fetchOptions(),
  ])
  await applyFilters()
})

/* Reset to page 1 whenever the filtered result count changes */
watch(totalRooms, () => { currentPage.value = 1 })
defineEmits(['wishlist'])
</script>

<style scoped>
.container-fluid { margin-top: 100px; }
.card-header-navy { background: #031c36; border-bottom: 4px solid #ff5f00; }
.text-navy { color: #031c36; }
.wishlist-btn.active {
  color: #dc3545;
}

/* ── Skeleton ─────────────────────────────────────────── */
.skel-img {
  height: 190px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e4e4e4 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}
.skel-line {
  display: block;
  background: linear-gradient(90deg, #f0f0f0 25%, #e4e4e4 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}
/* Stagger the skeleton cards slightly so they feel alive */
.row > div:nth-child(2) .skel-img,
.row > div:nth-child(2) .skel-line { animation-delay: 0.1s; }
.row > div:nth-child(3) .skel-img,
.row > div:nth-child(3) .skel-line { animation-delay: 0.2s; }
.row > div:nth-child(4) .skel-img,
.row > div:nth-child(4) .skel-line { animation-delay: 0.15s; }
.row > div:nth-child(5) .skel-img,
.row > div:nth-child(5) .skel-line { animation-delay: 0.25s; }
.row > div:nth-child(6) .skel-img,
.row > div:nth-child(6) .skel-line { animation-delay: 0.1s; }

@keyframes shimmer {
  0%   { background-position:  200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Inputs ── */
.custom-input { border-radius: 10px; border: 1.5px solid #e9ecef; padding: 9px 14px; background-color: #fbfcfd; font-size: 0.88rem; }
.custom-input:focus { border-color: #ff5f00; box-shadow: 0 0 0 0.2rem rgba(255,95,0,0.12); }

.filter-label { display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #031c36; margin-bottom: 8px; }

.filter-tag { display: inline-flex; align-items: center; background: rgba(255,95,0,0.1); border: 1px solid rgba(255,95,0,0.3); color: #ff5f00; font-size: 0.78rem; font-weight: 600; padding: 4px 10px; border-radius: 20px; cursor: default; }
.filter-tag i:last-child { cursor: pointer; opacity: 0.7; transition: opacity .15s; }
.filter-tag i:last-child:hover { opacity: 1; }

.amenity-filter-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px,1fr)); gap: 8px; }
.amenity-check-item { display: flex; align-items: center; gap: 6px; padding: 7px 10px; border-radius: 8px; border: 1.5px solid #e9ecef; font-size: 0.8rem; font-weight: 500; cursor: pointer; background: #fbfcfd; transition: all .18s; user-select: none; }
.amenity-check-item:hover { border-color: #ff5f00; background: rgba(255,95,0,0.05); }
.amenity-check-item.active { border-color: #ff5f00; background: rgba(255,95,0,0.1); color: #ff5f00; font-weight: 700; }
.check-icon { font-size: 0.85rem; color: #ddd; transition: color .18s; }
.amenity-check-item.active .check-icon { color: #ff5f00; }

/* ── Room card ── */
.room-card { cursor: pointer; transition: box-shadow .22s, transform .22s; border: 1.5px solid #f0f0f0 !important; }
.room-card:hover { box-shadow: 0 10px 30px rgba(3,28,54,0.13) !important; transform: translateY(-4px); }

.room-img-wrap { height: 190px; overflow: hidden; background: #f3f4f6; }
.room-img { width: 100%; height: 190px; object-fit: cover; transition: transform .35s; }
.room-card:hover .room-img { transform: scale(1.04); }
.room-img-placeholder { width: 100%; height: 190px; background: linear-gradient(135deg,#e8edf2,#f5f8fb); }

.room-price { font-size: 1.3rem; font-weight: 800; color: #ff5f00; }
.room-title { font-size: 0.92rem; color: #031c36; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.district-badge { background: rgba(3,28,54,0.08); color: #031c36; font-size: 0.7rem; font-weight: 600; }
.spec-chip { background: #f0f3f6; color: #031c36; font-size: 0.74rem; font-weight: 600; padding: 3px 9px; border-radius: 20px; }
.amenity-tag { background: rgba(255,95,0,0.08); color: #ff5f00; font-size: 0.7rem; font-weight: 600; padding: 2px 8px; border-radius: 20px; border: 1px solid rgba(255,95,0,0.2); }

.wishlist-btn { background: rgba(255,255,255,0.9); border: none; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); cursor: pointer; transition: background .18s, color .18s; color: #031c36; }
.wishlist-btn:hover { background: #ff5f00; color: #fff; }

/* ── Buttons ── */
.btn-orange { background: #ff5f00; color: white; border: none; border-radius: 10px; font-size: 0.82rem; font-weight: 600; }
.btn-orange:hover { background: #e65600; color: white; }
.bg-orange { background-color: #ff5f00 !important; }
.btn-xs { font-size: 0.72rem; padding: 3px 9px; border-radius: 20px; }
.text-orange { color: #ff5f00 !important; }

/* ── Pagination ── */
.page-link { color: #031c36; border-color: #e9ecef; font-weight: 600; border-radius: 8px !important; margin: 0 2px; }
.page-item.active .page-link { background: #ff5f00; border-color: #ff5f00; color: #fff; }
.page-link:hover { border-color: #ff5f00; color: #ff5f00; }

/* ── Empty state ── */
.empty-state .empty-icon { font-size: 4rem; color: #031c36; opacity: 0.15; }
</style>
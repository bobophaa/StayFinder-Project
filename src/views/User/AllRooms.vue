<template>
  <div class="container-fluid py-3 px-md-4 ">
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
        
          <button
            class="btn btn-sm btn-outline-light d-lg-none"
            @click="showMobileFilter = !showMobileFilter"
          >
            <i class="bi bi-funnel-fill me-1"></i>Filters
            <span v-if="activeFilterCount > 0" class="badge bg-orange ms-1">{{ activeFilterCount }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="row g-4">
   
      <div class="col-lg-3" :class="{ 'd-none d-lg-block': !showMobileFilter }">
        <div class="card border-0 shadow-sm rounded-4 sticky-top" style="top: 80px;">
          <div class="card-header-navy px-4 py-3 d-flex justify-content-between align-items-center">
            <span class="fw-bold text-white">
              <i class="bi bi-funnel-fill me-2"></i>Filters
            </span>
            <button
              v-if="activeFilterCount > 0"
              class="btn btn-sm btn-outline-light"
              @click="clearFilters"
            >
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
                <input
                  v-model="filters.search"
                  type="text"
                  class="form-control custom-input border-start-0 ps-0"
                  placeholder="Room title..."
                  @input="debouncedFetch"
                />
              </div>
            </div>

          
            <div class="mb-4">
              <label class="filter-label">District</label>
<select 
      v-model="filters.district" 
      @change="applyFilters" 
      class="form-select-custom"
    >
      <option value="">All Districts</option>
      <option v-for="d in districtStore.districts" :key="d.id" :value="d.id">
        {{ d.name }}
      </option>
    </select>

            </div>

            <div class="mb-4">
              <label class="filter-label">Price Range ($/month)</label>
              <div class="row g-2">
                <div class="col-6">
                  <input
                    v-model="filters.price_start"
                    type="number"
                    class="form-control custom-input"
                    placeholder="Min"
                    min="0"
                    @change="applyFilters"
                  />
                </div>
                <div class="col-6">
                  <input
                    v-model="filters.price_end"
                    type="number"
                    class="form-control custom-input"
                    placeholder="Max"
                    min="0"
                    @change="applyFilters"
                  />
                </div>
              </div>
              <div class="d-flex flex-wrap gap-1 mt-2">
                <button
                  v-for="range in priceRanges"
                  :key="range.label"
                  class="btn btn-xs"
                  :class="filters.price_start == range.min && filters.price_end == range.max
                    ? 'btn-orange' : 'btn-outline-secondary'"
                  @click="setQuickPrice(range)"
                >{{ range.label }}</button>
              </div>
            </div>

          
            <div class="mb-4">
              <label class="filter-label">Sort By</label>
              <select
                v-model="filters.sort_col"
                class="form-select custom-input"
                @change="applyFilters"
              >
                <option value="id">Newest First</option>
                <option value="price">Price</option>
                <option value="title">Title (A-Z)</option>
              </select>
              <div class="d-flex gap-2 mt-2">
                <button
                  class="btn btn-sm flex-fill"
                  :class="filters.sort_dir === 'asc' ? 'btn-orange' : 'btn-outline-secondary'"
                  @click="filters.sort_dir = 'asc'; applyFilters()"
                >
                  <i class="bi bi-sort-up me-1"></i>Asc
                </button>
                <button
                  class="btn btn-sm flex-fill"
                  :class="filters.sort_dir === 'desc' ? 'btn-orange' : 'btn-outline-secondary'"
                  @click="filters.sort_dir = 'desc'; applyFilters()"
                >
                  <i class="bi bi-sort-down me-1"></i>Desc
                </button>
              </div>
            </div>

            <!-- Bed Count -->
            <div class="mb-4">
              <label class="filter-label">Beds</label>
              <div class="d-flex flex-wrap gap-2">
                <button
                  v-for="b in bedOptions"
                  :key="b"
                  class="btn btn-sm"
                  :class="filters.bed === b ? 'btn-orange' : 'btn-outline-secondary'"
                  @click="toggleBed(b)"
                >{{ b }}</button>
              </div>
            </div>

         

          </div>

          <!-- Apply button (mobile) -->
          <div class="card-footer bg-white border-0 px-4 pb-4 d-lg-none">
            <button class="btn btn-orange w-100 fw-bold" @click="showMobileFilter = false">
              <i class="bi bi-check-circle me-2"></i>Apply Filters
            </button>
          </div>
        </div>
      </div>

   
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

        <!-- Loading state -->
        <div v-if="roomStore.loading" class="text-center py-5">
          <div class="spinner-border text-orange" role="status" style="width:3rem;height:3rem;"></div>
          <p class="mt-3 text-muted fw-bold">Loading rooms...</p>
        </div>

        <!-- Empty state -->
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

        <div v-else class="row g-3">
       <div v-for="room in paginatedRooms" :key="room.id" class="col-md-6 col-xl-4">
<router-link :to="`/room-details/${room.id}`" class="text-decoration-none">
    <div class="room-card card border-0 shadow-sm rounded-4 overflow-hidden h-100">

      <div class="room-img-wrap position-relative">
        <img
          v-if="room.image"
          :src="room.image"
          :alt="room.title"
          class="room-img"
        />
        <div v-else class="room-img-placeholder d-flex align-items-center justify-content-center">
          <i class="bi bi-building text-muted" style="font-size:2.5rem"></i>
        </div>

        <span v-if="room.percent_promotion > 0" class="badge bg-orange position-absolute top-0 start-0 m-2 px-2 py-1">
          <i class="bi bi-tag-fill me-1"></i>-{{ room.percent_promotion }}%
        </span>
      </div>

      <div class="card-body p-3">
        <div class="d-flex justify-content-between align-items-start mb-1">
          <div class="room-price">${{ room.price }}<small class="text-muted fw-normal">/month</small></div>
          <span v-if="room.district" class="badge district-badge">
            <i class="bi bi-geo-alt-fill me-1"></i>{{ room.district.name }}
          </span>
        </div>
        <h6 class="fw-bold text-navy mb-2 room-title">{{ room.title }}</h6>
      </div>

    </div>
  </router-link>
</div>

        </div>

        <!-- Pagination -->
        <nav v-if="totalPages > 1" class="mt-4">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="changePage(currentPage - 1)">
                <i class="bi bi-chevron-left"></i>
              </button>
            </li>
            <li
              v-for="p in pageNumbers"
              :key="p"
              class="page-item"
              :class="{ active: p === currentPage, disabled: p === '...' }"
            >
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
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoomStore } from '@/stores/RoomStore'
import { useDistrictStore } from '@/stores/DistrictStore'
import { useRoomOptionStore } from '@/stores/RoomOptionStore'

const roomStore = useRoomStore()
const districtStore = useDistrictStore()
const roomOptionStore = useRoomOptionStore()

const showMobileFilter = ref(false)
const currentPage = ref(1)
const perPage = 12

const filters = reactive({
  search: '',
  district: '',      
  price_start: '',
  price_end: '',
  sort_col: 'id',
  sort_dir: 'desc',
  bed: '',
  size: '',
  options: [],     
})

const priceRanges = [
  { label: '<$50', min: 0, max: 50 },
  { label: '$50-100', min: 50, max: 100 },
  { label: '$100-200', min: 100, max: 200 },
  { label: '>$200', min: 200, max: Infinity },
]
const bedOptions = ['1', '2', '3', '4', '5+']
const sizeOptions = ['Small', 'Medium', 'Big', 'Extra Large']

onMounted(async () => {
  if (!districtStore.districts.length) {
    await districtStore.fetchDistricts()
  }
  applyFilters()  
  if (!roomStore.rooms.length) {
    await roomStore.fetchRooms()
  }
})

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

const districtName = (id) =>
  districtStore.districts.find(d => d.id == id)?.name || id

const optionName = (id) =>
  roomOptionStore.options.find(o => o.id === id)?.name || id

function toggleAmenity(id) {
  const idx = filters.options.indexOf(id)
  if (idx === -1) filters.options.push(id)
  else filters.options.splice(idx, 1)
  applyFilters()
}

function toggleBed(b) {
  filters.bed = filters.bed === b ? '' : b
  applyFilters()
}

function toggleSize(s) {
  filters.size = filters.size === s ? '' : s
  applyFilters()
}

function setQuickPrice(range) {
  filters.price_start = range.min
  filters.price_end = range.max
  applyFilters()
}

function clearFilters() {
  filters.search = ''
  filters.district = ''
  filters.price_start = ''
  filters.price_end = ''
  filters.sort_col = 'id'
  filters.sort_dir = 'desc'
  filters.bed = ''
  filters.size = ''
  filters.options = []
  currentPage.value = 1
  applyFilters()
}

const filteredRooms = computed(() => {
  let list = roomStore.rooms || []

 
  if (filters.search) {
    const q = filters.search.toLowerCase()
    list = list.filter(r => r.title?.toLowerCase().includes(q))
  }

  if (filters.district) {
    list = list.filter(r => String(r.district?.id) === String(filters.district))
  }

 
  if (filters.price_start !== '' || filters.price_end !== '') {
    list = list.filter(r => {
      const price = Number(r.price)
      const start = filters.price_start ? Number(filters.price_start) : 0
      const end = filters.price_end ? Number(filters.price_end) : Infinity
      return price >= start && price <= end
    })
  }


  if (filters.bed) {
    if (filters.bed === '5+') list = list.filter(r => Number(r.bed) >= 5)
    else list = list.filter(r => String(r.bed) === filters.bed)
  }

 
  if (filters.size) {
    list = list.filter(r => r.size_room?.toLowerCase().includes(filters.size.toLowerCase()))
  }


  if (filters.options.length) {
    list = list.filter(r => {
      const roomOptionIds = (r.room_options || []).map(o => o.id)
      return filters.options.every(optId => roomOptionIds.includes(optId))
    })
  }

  // sort
  list.sort((a, b) => {
    const col = filters.sort_col
    const dir = filters.sort_dir === 'asc' ? 1 : -1
    if (a[col] > b[col]) return dir
    if (a[col] < b[col]) return -dir
    return 0
  })

  return list
})

const totalRooms = computed(() => filteredRooms.value.length)
const totalPages = computed(() => Math.ceil(totalRooms.value / perPage))
const paginatedRooms = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredRooms.value.slice(start, start + perPage)
})
function changePage(p) {
  if (p < 1 || p > totalPages.value) return
  currentPage.value = p
}
const pageNumbers = computed(() => {
  const pages = []
  for (let i = 1; i <= totalPages.value; i++) pages.push(i)
  return pages
})

function applyFilters() {
  currentPage.value = 1
}
</script>


<style scoped>
.container-fluid{
  margin-top: 100px;
}

.card-header-navy {
  background: #031c36;
  border-bottom: 4px solid #ff5f00;
}

.text-navy { color: #031c36; }

/* ── Inputs ── */
.custom-input {
  border-radius: 10px;
  border: 1.5px solid #e9ecef;
  padding: 9px 14px;
  background-color: #fbfcfd;
  font-size: 0.88rem;
}
.custom-input:focus {
  border-color: #ff5f00;
  box-shadow: 0 0 0 0.2rem rgba(255, 95, 0, 0.12);
}

/* ── Filter sidebar labels ── */
.filter-label {
  display: block;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #031c36;
  margin-bottom: 8px;
}

/* ── Filter tag badges (active filters) ── */
.filter-tag {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 95, 0, 0.1);
  border: 1px solid rgba(255, 95, 0, 0.3);
  color: #ff5f00;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  cursor: default;
}
.filter-tag i:last-child {
  cursor: pointer;
  opacity: 0.7;
  transition: opacity .15s;
}
.filter-tag i:last-child:hover { opacity: 1; }

/* ── Amenity toggle grid in sidebar ── */
.amenity-filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 8px;
}
.amenity-check-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  border-radius: 8px;
  border: 1.5px solid #e9ecef;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  background: #fbfcfd;
  transition: all .18s;
  user-select: none;
}
.amenity-check-item:hover {
  border-color: #ff5f00;
  background: rgba(255, 95, 0, 0.05);
}
.amenity-check-item.active {
  border-color: #ff5f00;
  background: rgba(255, 95, 0, 0.1);
  color: #ff5f00;
  font-weight: 700;
}
.check-icon {
  font-size: 0.85rem;
  color: #ddd;
  transition: color .18s;
}
.amenity-check-item.active .check-icon { color: #ff5f00; }

/* ── Room Card ── */
.room-card {
  cursor: pointer;
  transition: box-shadow .22s, transform .22s;
  border: 1.5px solid #f0f0f0 !important;
}
.room-card:hover {
  box-shadow: 0 10px 30px rgba(3, 28, 54, 0.13) !important;
  transform: translateY(-4px);
}

.room-img-wrap { height: 290px; overflow: hidden; background: #f3f4f6; }
.room-img {
  width: 100%; height: 290px;
  object-fit: cover;
  transition: transform .35s;
}
.room-card:hover .room-img { transform: scale(1.04); }
.room-img-placeholder {
  width: 100%; height: 190px;
  background: linear-gradient(135deg, #e8edf2, #f5f8fb);
}

.room-price {
  font-size: 1.3rem;
  font-weight: 800;
  color: #ff5f00;
}

.room-title {
  font-size: 0.92rem;
  color: #031c36;
  overflow: hidden;
  display: -webkit-box;
  /* -webkit-line-clamp: 2; */
  -webkit-box-orient: vertical;
}

.district-badge {
  background: rgba(3, 28, 54, 0.08);
  color: #031c36;
  font-size: 0.7rem;
  font-weight: 600;
}

.spec-chip {
  background: #f0f3f6;
  color: #031c36;
  font-size: 0.74rem;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 20px;
}

.amenity-tag {
  background: rgba(255, 95, 0, 0.08);
  color: #ff5f00;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  border: 1px solid rgba(255, 95, 0, 0.2);
}


.wishlist-btn {
  background: rgba(255,255,255,0.9);
  border: none;
  border-radius: 50%;
  width: 34px; height: 34px;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px);
  cursor: pointer;
  transition: background .18s, color .18s;
  color: #031c36;
}
.wishlist-btn:hover { background: #ff5f00; color: #fff; }


.btn-orange {
  background: #ff5f00;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 600;
}
.btn-orange:hover { background: #e65600; color: white; }
.bg-orange { background-color: #ff5f00 !important; }
.btn-xs { font-size: 0.72rem; padding: 3px 9px; border-radius: 20px; }
.text-orange { color: #ff5f00 !important; }


.page-link {
  color: #031c36;
  border-color: #e9ecef;
  font-weight: 600;
  border-radius: 8px !important;
  margin: 0 2px;
}
.page-item.active .page-link {
  background: #ff5f00;
  border-color: #ff5f00;
  color: #fff;
}
.page-link:hover { border-color: #ff5f00; color: #ff5f00; }


.spinner-border.text-orange { color: #ff5f00 !important; }


.empty-state .empty-icon {
  font-size: 4rem;
  color: #031c36;
  opacity: 0.15;
}


.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #031c36;
  border-left: 5px solid #ff5f00;
  padding-left: 12px;
}.form-select-custom {
    width: 100%;
    padding: 10px 15px 10px 40px; 
    font-size: 0.95rem;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    background-color: #ffffff;
    color: #031c36; 
    cursor: pointer;
    transition: all 0.3s ease;
    appearance: none; 
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke=' %23031c36' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 15px center;
    background-size: 12px;
}

.form-select-custom:focus {
    outline: none;
    border-color: #ff5f00;
    box-shadow: 0 0 0 4px rgba(255, 95, 0, 0.1);
}

.form-select-custom:hover {
    border-color: #cbd5e1;
    background-color: #f8fafc;
}
</style>
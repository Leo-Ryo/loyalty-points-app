<template>
  <div class="kiosk-ad-panel">

    <!-- Search + Sort controls -->
    <div class="ad-controls">
      <div class="ad-search-bar">
        <span class="search-icon">🔍</span>
        <input v-model="searchQ" class="search-input" placeholder="Search wines & offers…" />
        <button v-if="searchQ" class="clear-btn" @click="searchQ = ''">✕</button>
      </div>
      <div class="ad-filters">
        <select v-model="adSort" class="filter-select">
          <option value="trending">Featured & Trending</option>
          <option value="name">Name (A-Z)</option>
          <option value="price_asc">Points (Low→High)</option>
          <option value="price_desc">Points (High→Low)</option>
        </select>
      </div>
    </div>

    <!-- Promotions carousel banner -->
    <div v-if="promos.length" class="promo-carousel">
      <transition name="fade" mode="out-in">
        <div :key="promoIndex" class="promo-banner" @click="promoIndex = (promoIndex + 1) % promos.length">
          <img
            v-if="promos[promoIndex]?.imageUrl"
            :src="`${baseUrl}/${promos[promoIndex].imageUrl}`"
            class="promo-img"
            :alt="promos[promoIndex].title"
          />
          <div v-else class="promo-placeholder">
            <span>📢</span>
            <p>{{ promos[promoIndex]?.title }}</p>
          </div>
          <div class="promo-overlay">
            <p class="promo-title">{{ promos[promoIndex]?.title }}</p>
          </div>
          <div class="promo-dots">
            <span v-for="(_,i) in promos" :key="i" class="dot" :class="{ active: i === promoIndex }" />
          </div>
        </div>
      </transition>
    </div>

    <!-- Section label -->
    <div class="section-label">
      <span class="label-badge">AVAILABLE NOW</span>
      <span class="label-count" v-if="filteredItems.length">{{ filteredItems.length }} items</span>
    </div>

    <!-- No results -->
    <p v-if="filteredItems.length === 0 && searchQ" class="no-results">
      No results for "{{ searchQ }}"
    </p>

    <!-- Item cards — rich product cards -->
    <div class="items-grid">
      <div
        v-for="item in displayedItems"
        :key="item.id"
        class="item-card"
        :class="{ 'item-card--promoted': item.isPromoted }"
      >
        <!-- Full image area -->
        <div class="item-img-area">
          <img
            v-if="item.imageUrl"
            :src="`${baseUrl}/${item.imageUrl}`"
            :alt="item.name"
            class="item-img"
          />
          <div v-else class="item-img-fallback">
            <span>🍾</span>
          </div>

          <!-- Promoted badge -->
          <div v-if="item.isPromoted" class="promoted-badge">⭐ Featured</div>

          <!-- Stock pill -->
          <div class="stock-pill" :class="{ 'stock-pill--low': item.stockQuantity <= 5 }">
            {{ item.stockQuantity <= 5 ? `⚠ ${item.stockQuantity} left` : `${item.stockQuantity} in stock` }}
          </div>
        </div>

        <!-- Card body -->
        <div class="item-body">
          <div class="item-top">
            <p class="item-name">{{ item.name }}</p>
            <div class="item-pts-badge">
              <span class="pts-icon">⭐</span>
              <span class="pts-val">{{ item.price ? Math.round(Number(item.price)).toLocaleString() : '—' }}</span>
              <span class="pts-label">pts</span>
            </div>
          </div>

          <p v-if="item.description" class="item-desc">{{ item.description }}</p>

          <div class="item-footer">
            <span class="item-cat" v-if="item.category">{{ item.category }}</span>
            <span class="item-vol" v-if="item.volume">{{ item.volume }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { promotionApi } from '@/api/promotion.api'
import { inventoryApi } from '@/api/inventory.api'

const baseUrl = (import.meta as any).env.VITE_API_BASE_URL?.replace('/api','') || 'http://localhost:3000'
const promos = ref<any[]>([])
const items = ref<any[]>([])
const searchQ = ref('')
const adSort = ref('trending')
const promoIndex = ref(0)

const filteredItems = computed(() => {
  let list = items.value
  if (searchQ.value) {
    const q = searchQ.value.toLowerCase()
    list = list.filter(i => i.name?.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q))
  }
  list = [...list].sort((a: any, b: any) => {
    if (adSort.value === 'trending') {
      if (a.isPromoted && !b.isPromoted) return -1
      if (!a.isPromoted && b.isPromoted) return 1
      return b.stockQuantity - a.stockQuantity
    } else if (adSort.value === 'name') {
      return (a.name || '').localeCompare(b.name || '')
    } else if (adSort.value === 'price_asc') {
      return (Number(a.price) || 0) - (Number(b.price) || 0)
    } else if (adSort.value === 'price_desc') {
      return (Number(b.price) || 0) - (Number(a.price) || 0)
    }
    return 0
  })
  return list
})

const displayedItems = computed(() => filteredItems.value.slice(0, 12))

let timer: ReturnType<typeof setInterval>

onMounted(async () => {
  try {
    promos.value = await promotionApi.getAll(true) || []
    const all = await inventoryApi.getAll() || []
    items.value = all.sort((a: any, b: any) => {
      if (a.isPromoted && !b.isPromoted) return -1
      if (!a.isPromoted && b.isPromoted) return 1
      return b.stockQuantity - a.stockQuantity
    })
  } catch {}

  timer = setInterval(() => {
    if (promos.value.length > 1)
      promoIndex.value = (promoIndex.value + 1) % promos.value.length
  }, 5000)
})
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.kiosk-ad-panel {
  display: flex;
  flex-direction: column;
  gap: clamp(10px, 1.5vh, 14px);
  height: 100%;
  overflow: hidden;
}

/* ── Controls ── */
.ad-controls { display: flex; flex-direction: column; gap: 8px; flex-shrink: 0; }
.ad-search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #FFFFFF;
  border: 1px solid rgba(0,0,0,0.10);
  border-radius: 12px;
  padding: 8px 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04), inset 0 1px 2px rgba(0,0,0,0.03);
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}
.ad-search-bar:focus-within {
  border-color: #111111;
  box-shadow: 0 0 0 3px rgba(17,17,17,0.07);
}
.search-icon { font-size: 14px; flex-shrink: 0; }
.search-input { flex: 1; border: none; outline: none; font-family: inherit; font-size: 13px; color: #111111; background: transparent; min-width: 0; }
.search-input::placeholder { color: #A3A3A3; }
.clear-btn { border: none; background: transparent; cursor: pointer; color: #A3A3A3; font-size: 14px; padding: 2px 4px; line-height: 1; }

.ad-filters { display: flex; justify-content: flex-end; }
.filter-select {
  padding: 5px 10px;
  border: 1px solid rgba(0,0,0,0.10);
  border-radius: 8px;
  font-family: inherit; font-size: 11px; font-weight: 600;
  outline: none; cursor: pointer;
  background: #FFFFFF; color: #111111;
}

/* ── Promo carousel ── */
.promo-carousel { flex-shrink: 0; }
.promo-banner {
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  aspect-ratio: 16/8;
  background: #111111;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0,0,0,0.18);
}
.promo-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; display: block; }
.promo-banner:hover .promo-img { transform: scale(1.03); }
.promo-placeholder { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: #FFFFFF; }
.promo-placeholder span { font-size: 2.5rem; }
.promo-placeholder p { font-size: 14px; font-weight: 600; margin: 0; }
.promo-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 14px 14px 10px; background: linear-gradient(transparent, rgba(0,0,0,0.70)); }
.promo-title { color: #FFFFFF; font-size: 14px; font-weight: 700; margin: 0; letter-spacing: -0.01em; }
.promo-dots { position: absolute; bottom: 10px; right: 12px; display: flex; gap: 4px; }
.dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.4); transition: all 0.25s ease; }
.dot.active { background: #FFFFFF; width: 16px; border-radius: 3px; }

/* ── Section label ── */
.section-label { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.label-badge {
  font-size: 10px; font-weight: 800;
  letter-spacing: 0.08em;
  color: #FFFFFF;
  background: #111111;
  padding: 4px 10px; border-radius: 6px;
}
.label-count { font-size: 12px; color: #A3A3A3; }

.no-results { font-size: 13px; color: #A3A3A3; text-align: center; padding: 1rem; flex-shrink: 0; }

/* ── Item cards grid ── */
.items-grid {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 1.2vh, 12px);
  /* hide scrollbar but keep scroll */
  scrollbar-width: none;
}
.items-grid::-webkit-scrollbar { display: none; }

/* Card */
.item-card {
  background: #FFFFFF;
  border-radius: 18px;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow:
    0 2px 8px rgba(0,0,0,0.06),
    0 1px 3px rgba(0,0,0,0.04),
    inset 0 1px 0 rgba(255,255,255,0.9);
  overflow: hidden;
  flex-shrink: 0;
  transition: transform 0.30s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.30s ease;
}
.item-card:hover {
  transform: translateY(-5px) perspective(600px) rotateX(1.5deg);
  box-shadow:
    0 12px 32px rgba(0,0,0,0.10),
    0 4px 10px rgba(0,0,0,0.06);
}

/* Promoted card gets a golden accent top */
.item-card--promoted {
  border-color: rgba(234,179,8,0.30);
  box-shadow:
    0 2px 8px rgba(234,179,8,0.10),
    0 1px 3px rgba(0,0,0,0.04),
    inset 0 1px 0 rgba(255,255,255,0.9);
}

/* ── Image area ── */
.item-img-area {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
  background: #F2F2F7;
}
.item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.35s ease;
}
.item-card:hover .item-img { transform: scale(1.04); }

.item-img-fallback {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #F2F2F7 0%, #E8E8EE 100%);
  font-size: clamp(2rem, 4vw, 3.5rem);
}

/* Badges over the image */
.promoted-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(234,179,8,0.95);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #FFFFFF;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 99px;
  letter-spacing: 0.02em;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.stock-pill {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(17,17,17,0.75);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #FFFFFF;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 99px;
  letter-spacing: 0.01em;
}
.stock-pill--low {
  background: rgba(220,38,38,0.85);
}

/* ── Card body ── */
.item-body {
  padding: clamp(10px, 1.5vw, 14px);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.item-name {
  font-size: clamp(13px, 1.5vw, 15px);
  font-weight: 700;
  color: #111111;
  margin: 0;
  letter-spacing: -0.01em;
  line-height: 1.3;
  flex: 1;
  min-width: 0;
}

/* Points badge — pill */
.item-pts-badge {
  display: flex;
  align-items: center;
  gap: 3px;
  background: #111111;
  color: #FFFFFF;
  border-radius: 99px;
  padding: 5px 10px;
  flex-shrink: 0;
  box-shadow: 0 2px 5px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.10);
}
.pts-icon { font-size: 11px; }
.pts-val { font-size: 13px; font-weight: 800; letter-spacing: -0.01em; line-height: 1; }
.pts-label { font-size: 9px; font-weight: 600; opacity: 0.7; letter-spacing: 0.04em; }

.item-desc {
  font-size: clamp(11px, 1.1vw, 12px);
  color: #525252;
  margin: 0;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-footer {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.item-cat, .item-vol {
  font-size: 10px;
  font-weight: 600;
  color: #A3A3A3;
  background: rgba(0,0,0,0.04);
  padding: 3px 8px;
  border-radius: 6px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

/* ── Transition ── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

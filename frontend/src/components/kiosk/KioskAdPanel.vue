<template>
  <div class="kiosk-ad-panel">
    <!-- Search bar & filters -->
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
          <option value="price_asc">Price (Low-High)</option>
          <option value="price_desc">Price (High-Low)</option>
        </select>
      </div>
    </div>

    <!-- ADS header -->
    <div class="ads-header">
      <div class="ads-badge">ADS</div>
      <p class="ads-sub">Showing trending, hot & available</p>
    </div>

    <!-- Promotion banner carousel -->
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
          <!-- Dots -->
          <div class="promo-dots">
            <span v-for="(_,i) in promos" :key="i" class="dot" :class="{ active: i === promoIndex }" />
          </div>
        </div>
      </transition>
    </div>

    <!-- Trending inventory items -->
    <div class="items-section">
      <p v-if="filteredItems.length === 0 && searchQ" class="no-results">No results for "{{ searchQ }}"</p>
      <div
        v-for="item in displayedItems" :key="item.id"
        class="item-card ad-card"
      >
        <div class="item-img-wrap">
          <img v-if="item.imageUrl" :src="`${baseUrl}/${item.imageUrl}`" :alt="item.name" class="item-img" />
          <div v-else class="item-img-placeholder">🍾</div>
        </div>
        <div class="item-info">
          <p class="item-name">{{ item.name }}</p>
          <p class="item-desc" v-if="item.description">{{ item.description }}</p>
          <div class="item-meta">
            <span class="item-price" v-if="item.price">⭐ {{ Math.round(Number(item.price)) }}</span>
            <span class="item-stock">{{ item.stockQuantity }} in stock</span>
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
  
  // Create a copy so we don't mutate the array
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
    // Sort: promoted first, then by stockQuantity (well-stocked)
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
  gap: clamp(10px, 1.5vh, 16px);
  height: 100%;
}

/* Controls */
.ad-controls { display: flex; flex-direction: column; gap: 8px; flex-shrink: 0; }
.ad-search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #FFFFFF;
  border: 2px solid #E5E5E5;
  border-radius: 12px;
  padding: 8px 12px;
  transition: border-color 0.15s;
}
.ad-search-bar:focus-within { border-color: #111111; }
.search-icon { font-size: 15px; flex-shrink: 0; }
.search-input { flex: 1; border: none; outline: none; font-family: inherit; font-size: 13px; color: #111111; background: transparent; min-width: 0; }
.search-input::placeholder { color: #A3A3A3; }
.clear-btn { border: none; background: transparent; cursor: pointer; color: #A3A3A3; font-size: 14px; padding: 2px 4px; line-height: 1; }

.ad-filters { display: flex; justify-content: flex-end; }
.filter-select { padding: 6px 10px; border: 1px solid #E5E5E5; border-radius: 8px; font-family: inherit; font-size: 11px; font-weight: 600; outline: none; cursor: pointer; background: #FFF; color: #111111; }

/* ADS Header */
.ads-header { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.ads-badge { background: #111111; color: #FFFFFF; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 6px; letter-spacing: 0.08em; flex-shrink: 0; }
.ads-sub { font-size: 12px; color: #525252; margin: 0; }

/* Promo banner */
.promo-carousel { flex-shrink: 0; }
.promo-banner {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 16/9;
  background: #111111;
  cursor: pointer;
}
.promo-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
.promo-banner:hover .promo-img { transform: scale(1.04); }
.promo-placeholder { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: #FFFFFF; }
.promo-placeholder span { font-size: 2.5rem; }
.promo-placeholder p { font-size: 14px; font-weight: 600; margin: 0; }
.promo-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 12px; background: linear-gradient(transparent, rgba(0,0,0,0.65)); }
.promo-title { color: #FFFFFF; font-size: 14px; font-weight: 700; margin: 0; }
.promo-dots { position: absolute; bottom: 8px; right: 10px; display: flex; gap: 4px; }
.dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.4); transition: all 0.2s; }
.dot.active { background: #FFFFFF; width: 14px; border-radius: 3px; }

/* Items list */
.items-section { flex: 1; display: flex; flex-direction: column; gap: 8px; overflow-y: auto; }
.no-results { font-size: 13px; color: #A3A3A3; text-align: center; padding: 1rem; }
.item-card {
  display: flex;
  gap: 12px;
  background: #FFFFFF;
  border-radius: 14px;
  padding: 12px;
  border: 1px solid #E5E5E5;
  align-items: center;
  flex-shrink: 0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.item-card:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.08); }
.item-img-wrap { width: 56px; height: 56px; border-radius: 10px; overflow: hidden; background: #F5F5F5; flex-shrink: 0; }
.item-img { width: 100%; height: 100%; object-fit: cover; }
.item-img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; }
.item-info { flex: 1; min-width: 0; }
.item-name { font-size: 13px; font-weight: 700; color: #111111; margin: 0 0 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.item-desc { font-size: 11px; color: #525252; margin: 0 0 4px; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
.item-meta { display: flex; gap: 10px; align-items: center; }
.item-price { font-size: 13px; font-weight: 700; color: #111111; }
.item-stock { font-size: 11px; color: #A3A3A3; }
</style>

<template>
  <div class="kiosk-lookup">

    <!-- ── ATTRACT SCREEN ── -->
    <transition name="attract-fade">
      <div v-if="showAttract" class="attract-screen" @click="dismissAttract">
        <img
          src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=2970&auto=format&fit=crop"
          class="attract-bg"
          alt=""
        />
        <div class="attract-gradient" />
        <div class="attract-content">
          <h1 class="attract-title">Experience Excellence</h1>
          <p class="attract-sub">Touch anywhere to begin exploring.</p>
          <div class="attract-ring">
            <img src="@/assets/Outline Icons/Play.png" class="attract-icon" alt="" />
          </div>
        </div>
      </div>
    </transition>

    <!-- ── GUEST BROWSE ── -->
    <div class="browse-page no-scrollbar">

      <!-- Header -->
      <header class="browse-header">
        <div>
          <h1 class="browse-title">Welcome, Guest</h1>
          <p class="browse-sub">Browse our collection · Login to trade points</p>
        </div>
        <div class="header-avatar" @click="openNumpad()" title="Log in">
          <img src="@/assets/Outline Icons/User.png" class="header-avatar-icon" alt="" />
        </div>
      </header>

      <!-- Hero promo banner -->
      <section class="hero-banner">
        <div class="hero-text">
          <h2 class="hero-title">{{ settings.businessName }} Rewards</h2>
          <p class="hero-sub">Check in to earn and trade points on your favourite bottles.</p>
          <button class="hero-btn" @click="openNumpad">Check In Now</button>
        </div>
        <img src="@/assets/Outline Icons/Star.png" class="hero-icon" alt="" />
      </section>

      <!-- Curated selection -->
      <section class="browse-section">
        <h2 class="section-title">
          <img src="@/assets/Outline Icons/Star.png" class="section-icon" alt="" />
          Curated Selection
        </h2>

        <div v-if="loading" class="loading-grid">
          <div v-for="i in 4" :key="i" class="skeleton-card" />
        </div>

        <div v-else-if="inventory.length === 0" class="empty-state">
          <span>🍾</span><p>No items available right now</p>
        </div>

        <div v-else class="cards-grid">
          <div
            v-for="item in inventory"
            :key="item.id"
            class="product-card"
            :class="{ 'card--out': item.stockQuantity <= 0 }"
          >
            <!-- Image area -->
            <div class="card-img-wrap">
              <img
                v-if="item.imageUrl"
                :src="`${baseUrl}/${item.imageUrl}`"
                :alt="item.name"
                class="card-img"
                :class="{ 'card-img--greyed': item.stockQuantity <= 0 }"
              />
              <div v-else class="card-img-placeholder">🍾</div>
              <!-- Low stock badge -->
              <span v-if="item.stockQuantity > 0 && item.stockQuantity <= 3" class="badge badge--low">Low Stock</span>
              <span v-if="item.stockQuantity <= 0" class="badge badge--out">Out of Stock</span>
            </div>

            <!-- Info -->
            <h3 class="card-name">{{ item.name }}</h3>
            <p class="card-desc">{{ item.description || 'A premium selection.' }}</p>

            <!-- Stock + Price row -->
            <div class="card-meta">
              <span v-if="item.stockQuantity > 0" class="stock-pill stock-pill--in">
                <img src="@/assets/Outline Icons/Check circle.png" class="stock-icon" alt="" />
                In Stock ({{ item.stockQuantity }})
              </span>
              <span v-else class="stock-pill stock-pill--out">
                <img src="@/assets/Outline Icons/Close circle.png" class="stock-icon" alt="" />
                Out of Stock
              </span>
              <span class="card-price">${{ Number(item.price || 0).toFixed(0) }}</span>
            </div>

            <!-- Trade button -->
            <button
              class="trade-btn"
              :disabled="item.stockQuantity <= 0"
              @click="item.stockQuantity > 0 && openNumpad()"
            >
              <span class="trade-pts">{{ Math.round(Number(item.price || 0)) }} pts</span>
              <span class="trade-divider">|</span>
              <span class="trade-label">{{ item.stockQuantity > 0 ? 'Trade Now' : 'Unavailable' }}</span>
            </button>
          </div>
        </div>
      </section>

      <!-- bottom padding for floating nav -->
      <div style="height: 40px" />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useSettingsStore } from '@/stores/settings.store'
import { useKioskStore } from '@/stores/kiosk.store'
import { inventoryApi } from '@/api/inventory.api'

const settings = useSettingsStore()
const kiosk = useKioskStore()
settings.loadSettings()

const baseUrl = (import.meta as any).env.VITE_API_BASE_URL?.replace('/api','') || 'http://localhost:3000'

// Attract screen
const showAttract = ref(true)
function dismissAttract() { showAttract.value = false; resetIdle() }

// Idle timer — reload page after 3 min to reset attract screen
let idleTimer: ReturnType<typeof setTimeout>
function resetIdle() {
  clearTimeout(idleTimer)
  idleTimer = setTimeout(() => { location.reload() }, 180_000)
}
onMounted(() => {
  document.addEventListener('click', resetIdle)
  document.addEventListener('touchstart', resetIdle)
  resetIdle()
})
onUnmounted(() => {
  clearTimeout(idleTimer)
  document.removeEventListener('click', resetIdle)
  document.removeEventListener('touchstart', resetIdle)
})

// Inventory
const inventory = ref<any[]>([])
const loading = ref(true)
onMounted(async () => {
  try { inventory.value = await inventoryApi.getAll() } catch {}
  finally { loading.value = false }
})

// Open numpad via kiosk store (parent CustomerLayout watches this)
const emit = defineEmits(['open-numpad'])
function openNumpad() { kiosk.openNumpad() }
</script>

<style scoped>
.kiosk-lookup {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

/* ── Attract Screen ── */
.attract-screen {
  position: absolute;
  inset: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 80px;
  cursor: pointer;
}
.attract-bg {
  position: absolute; inset: 0;
  width: 100%; height: 100%; object-fit: cover; opacity: 0.8;
}
.attract-gradient {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.15) 50%, transparent 100%);
}
.attract-content {
  position: relative; z-index: 10;
  text-align: center; color: #FFFFFF;
}
.attract-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800; margin: 0 0 10px;
  letter-spacing: -0.03em;
}
.attract-sub {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  opacity: 0.8; margin: 0 0 24px;
}
.attract-ring {
  width: 56px; height: 56px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.5);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto;
  animation: pulse 2s ease-in-out infinite;
}
.attract-icon {
  width: 24px; height: 24px;
  filter: brightness(0) invert(1) opacity(0.8);
}
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.08); opacity: 1; }
}

/* Attract fade transition */
.attract-fade-enter-active { transition: opacity 0.4s ease; }
.attract-fade-leave-active  { transition: opacity 0.5s ease; }
.attract-fade-enter-from, .attract-fade-leave-to { opacity: 0; }

/* ── Browse Page ── */
.browse-page {
  height: 100%;
  overflow-y: auto;
  padding: clamp(1rem, 2vw, 2rem) clamp(1rem, 3vw, 2rem);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* hide scrollbar */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Header */
.browse-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.browse-title {
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 800; color: #19213D;
  margin: 0 0 4px; letter-spacing: -0.02em;
}
.browse-sub { font-size: 14px; color: #A1A7BB; margin: 0; }
.header-avatar {
  width: 48px; height: 48px;
  background: #C3DDFF; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1), background 0.15s ease;
}
.header-avatar:hover { background: #8DC1FF; transform: scale(1.08); }
.header-avatar-icon {
  width: 22px; height: 22px;
  filter: brightness(0) saturate(100%) invert(62%) sepia(60%) saturate(400%) hue-rotate(190deg);
}

/* Hero promo */
.hero-banner {
  background: linear-gradient(135deg, #8DC1FF 0%, #C3DDFF 100%);
  border-radius: 28px;
  padding: clamp(1.5rem, 3vw, 2.5rem);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(141,193,255,0.35);
}
.hero-text { position: relative; z-index: 2; flex: 1; }
.hero-title {
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 800; color: #FFFFFF;
  margin: 0 0 8px; letter-spacing: -0.02em;
}
.hero-sub {
  font-size: clamp(0.9rem, 1.5vw, 1.1rem);
  color: rgba(255,255,255,0.85); margin: 0 0 20px;
}
.hero-btn {
  background: #FFFFFF; color: #8DC1FF;
  font-weight: 800; font-size: 15px;
  padding: 12px 28px; border-radius: 99px; border: none;
  cursor: pointer; font-family: inherit;
  transition: background 0.18s ease, transform 0.18s cubic-bezier(0.34,1.56,0.64,1);
}
.hero-btn:hover { background: #F8FAFF; transform: translateY(-2px); }
.hero-icon {
  width: clamp(60px, 10vw, 100px); height: clamp(60px, 10vw, 100px);
  filter: brightness(0) invert(1) opacity(0.2);
  flex-shrink: 0;
  position: absolute; right: 24px; top: 50%; transform: translateY(-50%);
}

/* Section */
.section-title {
  display: flex; align-items: center; gap: 8px;
  font-size: 1.2rem; font-weight: 700; color: #19213D;
  margin: 0 0 1rem;
}
.section-icon {
  width: 20px; height: 20px;
  filter: brightness(0) saturate(100%) invert(62%) sepia(60%) saturate(400%) hue-rotate(190deg);
}

/* Card grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.2rem;
}

/* Product card */
.product-card {
  background: #FFFFFF;
  border-radius: 24px;
  padding: 1.1rem;
  border: 1px solid #EDEFF5;
  box-shadow: 0 2px 12px rgba(25,33,61,0.06);
  display: flex;
  flex-direction: column;
  transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease;
}
.product-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(25,33,61,0.12); }
.card--out { opacity: 0.72; }

/* Card image */
.card-img-wrap {
  height: clamp(160px, 22vw, 220px);
  background: #F8FAFF;
  border-radius: 16px;
  margin-bottom: 1rem;
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
}
.card-img { height: 100%; width: 100%; object-fit: contain; mix-blend-mode: multiply; }
.card-img--greyed { filter: grayscale(1); }
.card-img-placeholder { font-size: 4rem; }

/* Badges */
.badge {
  position: absolute; top: 10px; right: 10px;
  font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 99px;
}
.badge--low { background: #FFF7ED; color: #EA580C; }
.badge--out { background: #FEF2F2; color: #DC2626; }

/* Card text */
.card-name {
  font-size: 15px; font-weight: 700; color: #19213D;
  margin: 0 0 4px; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
}
.card-desc {
  font-size: 12px; color: #A1A7BB;
  margin: 0 0 1rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  line-height: 1.5;
}

/* Meta row */
.card-meta {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 12px;
}
.stock-pill {
  display: flex; align-items: center; gap: 5px;
  font-size: 11px; font-weight: 600;
  padding: 5px 10px; border-radius: 99px;
}
.stock-icon { width: 13px; height: 13px; object-fit: contain; }
.stock-pill--in { background: #F0FDF4; color: #16A34A; }
.stock-pill--in .stock-icon { filter: brightness(0) saturate(100%) invert(35%) sepia(80%) saturate(400%) hue-rotate(100deg); }
.stock-pill--out { background: #FEF2F2; color: #DC2626; }
.stock-pill--out .stock-icon { filter: brightness(0) saturate(100%) invert(30%) sepia(80%) saturate(500%) hue-rotate(330deg); }
.card-price { font-size: 16px; font-weight: 800; color: #19213D; }

/* Trade button */
.trade-btn {
  width: 100%; background: #8DC1FF;
  border: none; border-radius: 16px;
  padding: 14px;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  cursor: pointer; font-family: inherit;
  transition: background 0.18s ease, transform 0.18s cubic-bezier(0.34,1.56,0.64,1);
  box-shadow: 0 4px 14px rgba(141,193,255,0.35);
  margin-top: auto;
}
.trade-btn:hover:not(:disabled) { background: #4E9FFF; transform: translateY(-2px); }
.trade-btn:active:not(:disabled) { transform: scale(0.97); }
.trade-btn:disabled { background: #D7DBE7; box-shadow: none; cursor: not-allowed; }
.trade-pts   { font-size: 17px; font-weight: 800; color: #19213D; }
.trade-divider { color: rgba(25,33,61,0.3); font-size: 16px; }
.trade-label { font-size: 14px; font-weight: 600; color: #19213D; }
.trade-btn:disabled .trade-pts,
.trade-btn:disabled .trade-label,
.trade-btn:disabled .trade-divider { color: #FFFFFF; }

/* Loading skeletons */
.loading-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.2rem; }
.skeleton-card {
  height: 380px; border-radius: 24px;
  background: linear-gradient(90deg, #EDEFF5 25%, #D7DBE7 50%, #EDEFF5 75%);
  background-size: 800px 100%;
  animation: shimmer 1.5s infinite linear;
}

/* Empty */
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 4rem 1rem; text-align: center; }
.empty-state span { font-size: 3rem; }
.empty-state p { font-size: 14px; color: #A1A7BB; margin: 0; }

@keyframes shimmer {
  from { background-position: -400px 0; }
  to   { background-position:  400px 0; }
}
</style>

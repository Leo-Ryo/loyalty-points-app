<template>
  <div class="dashboard-page no-scrollbar">

    <!-- Profile card -->
    <div class="profile-card">
      <div class="profile-avatar">{{ c?.name?.[0]?.toUpperCase() ?? '?' }}</div>
      <div class="profile-info">
        <div class="profile-top">
          <h1 class="profile-name">{{ c?.name }}</h1>
          <div class="points-badge points-pulse">
            <span class="pts-num">{{ c?.points?.toLocaleString() }}</span>
            <span class="pts-label">pts ⭐</span>
          </div>
        </div>
        <div class="profile-chips">
          <span v-if="c?.phone" class="chip">📞 {{ c.phone }}</span>
          <span v-if="c?.email" class="chip">✉ {{ c.email }}</span>
        </div>
      </div>
    </div>

    <!-- Hero promo banner -->
    <section class="hero-banner">
      <div class="hero-text">
        <h2 class="hero-title">Ready to Trade?</h2>
        <p class="hero-sub">You have <strong>{{ c?.points?.toLocaleString() }} pts</strong> — browse below and pick your bottles.</p>
      </div>
      <img src="@/assets/Outline Icons/Star.png" class="hero-icon" alt="" />
    </section>

    <!-- Inventory grid -->
    <section>
      <div class="section-header">
        <h2 class="section-title">
          <img src="@/assets/Outline Icons/Box.png" class="section-icon" alt="" />
          Curated Selection
        </h2>
        <!-- Search + sort -->
        <div class="controls">
          <div class="search-bar">
            <img src="@/assets/Outline Icons/Filter.png" class="search-icon-img" alt="" />
            <input v-model="invSearch" class="search-input" placeholder="Search bottles…" />
            <button v-if="invSearch" class="clear-btn" @click="invSearch = ''">✕</button>
          </div>
          <select v-model="invSort" class="sort-select">
            <option value="name">Name (A-Z)</option>
            <option value="price_asc">Points (Low→High)</option>
            <option value="price_desc">Points (High→Low)</option>
          </select>
        </div>
      </div>

      <div v-if="loadingInv" class="loading-grid">
        <div v-for="i in 4" :key="i" class="skeleton-card" />
      </div>

      <div v-else-if="filteredInventory.length === 0" class="empty-state">
        <span>🍾</span><p>No items found</p>
      </div>

      <div v-else class="cards-grid">
        <div
          v-for="item in filteredInventory"
          :key="item.id"
          class="product-card"
          :class="{ 'card--out': item.stockQuantity <= 0 }"
        >
          <!-- Image -->
          <div class="card-img-wrap">
            <img
              v-if="item.imageUrl"
              :src="`${baseUrl}/${item.imageUrl}`"
              :alt="item.name"
              class="card-img"
              :class="{ 'card-img--greyed': item.stockQuantity <= 0 }"
            />
            <div v-else class="card-img-placeholder">🍾</div>
            <span v-if="item.stockQuantity > 0 && item.stockQuantity <= 3" class="badge badge--low">Low Stock</span>
            <span v-if="item.stockQuantity <= 0" class="badge badge--out">Out of Stock</span>
          </div>

          <!-- Info -->
          <h3 class="card-name">{{ item.name }}</h3>
          <p class="card-desc">{{ item.description || 'A premium selection.' }}</p>

          <div class="card-meta">
            <span v-if="item.stockQuantity > 0" class="stock-pill stock-pill--in">
              <img src="@/assets/Outline Icons/Check circle.png" class="stock-icon" alt="" />
              {{ item.stockQuantity }} left
            </span>
            <span v-else class="stock-pill stock-pill--out">
              <img src="@/assets/Outline Icons/Close circle.png" class="stock-icon" alt="" />
              Out of Stock
            </span>
            <span class="card-price">${{ Number(item.price || 0).toFixed(0) }}</span>
          </div>

          <!-- Trade button — executes immediately when logged in -->
          <button
            class="trade-btn"
            :class="{ 'trade-btn--cant': (c?.points || 0) < Math.round(Number(item.price)) }"
            :disabled="item.stockQuantity <= 0"
            @click="item.stockQuantity > 0 && tradeItem(item)"
          >
            <span class="trade-pts">{{ Math.round(Number(item.price || 0)) }} pts</span>
            <span class="trade-divider">|</span>
            <span class="trade-label">
              {{ item.stockQuantity <= 0 ? 'Unavailable' : (c?.points || 0) < Math.round(Number(item.price)) ? 'Not Enough Pts' : 'Trade Now' }}
            </span>
          </button>
        </div>
      </div>
    </section>

    <!-- Bottom padding for floating nav -->
    <div style="height: 40px" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCustomerStore } from '@/stores/customer.store'
import { useNotificationStore } from '@/stores/notification.store'
import { transactionApi } from '@/api/transaction.api'
import { inventoryApi } from '@/api/inventory.api'

const customer = useCustomerStore()
const notify = useNotificationStore()
const c = computed(() => customer.activeCustomer)
const baseUrl = (import.meta as any).env.VITE_API_BASE_URL?.replace('/api','') || 'http://localhost:3000'

const inventory = ref<any[]>([])
const loadingInv = ref(true)
const invSearch  = ref('')
const invSort    = ref('name')

const filteredInventory = computed(() => {
  let list = inventory.value
  if (invSearch.value) {
    const q = invSearch.value.toLowerCase()
    list = list.filter(i => i.name?.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q))
  }
  return [...list].sort((a, b) => {
    if (invSort.value === 'name')       return (a.name || '').localeCompare(b.name || '')
    if (invSort.value === 'price_asc')  return (Number(a.price) || 0) - (Number(b.price) || 0)
    if (invSort.value === 'price_desc') return (Number(b.price) || 0) - (Number(a.price) || 0)
    return 0
  })
})

async function tradeItem(item: any) {
  if (!c.value) return
  const pts = Math.round(Number(item.price || 0)) || 10
  if ((c.value.points || 0) < pts) { notify.error(`Not enough points — you need ${pts} pts`); return }
  try {
    await transactionApi.redeem({ customerId: c.value.id, inventoryId: item.id, points: pts, description: `Traded for: ${item.name}` })
    customer.updatePoints((c.value.points || 0) - pts)
    notify.success(`🍾 Traded ${pts} pts for ${item.name}!`)
    inventory.value = await inventoryApi.getAll()
  } catch (e: any) { notify.error(e.message) }
}

onMounted(async () => {
  try { inventory.value = await inventoryApi.getAll() } catch {}
  finally { loadingInv.value = false }
})
</script>

<style scoped>
.dashboard-page {
  height: 100%;
  overflow-y: auto;
  padding: clamp(1rem, 2vw, 1.5rem) clamp(1rem, 3vw, 2rem);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: #F8FAFF;
}
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Profile card */
.profile-card {
  display: flex; align-items: center; gap: clamp(10px,2vw,16px);
  background: #FFFFFF; border-radius: 20px;
  padding: clamp(12px,2vw,18px) clamp(14px,2vw,20px);
  border: 1px solid #EDEFF5;
  box-shadow: 0 2px 12px rgba(25,33,61,0.07);
  flex-shrink: 0;
}
.profile-avatar {
  width: clamp(50px,6vw,66px); height: clamp(50px,6vw,66px);
  border-radius: 50%; background: #19213D;
  color: #FFFFFF; font-size: clamp(20px,2.5vw,28px); font-weight: 800;
  display:flex; align-items:center; justify-content:center; flex-shrink:0;
  box-shadow: 0 3px 10px rgba(25,33,61,0.25);
}
.profile-info { flex: 1; min-width: 0; }
.profile-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 8px; }
.profile-name { font-size: clamp(16px,2.5vw,24px); font-weight: 800; margin: 0; color: #19213D; letter-spacing: -0.02em; }
.points-badge {
  display: flex; align-items: center; gap: 6px;
  background: #8DC1FF; color: #19213D;
  padding: clamp(6px,1vw,10px) clamp(12px,1.5vw,18px);
  border-radius: 99px; flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(141,193,255,0.40);
}
.pts-num { font-size: clamp(15px,2vw,22px); font-weight: 900; letter-spacing: -0.02em; }
.pts-label { font-size: clamp(11px,1.2vw,14px); opacity: 0.75; }
.profile-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.chip { font-size: clamp(11px,1.2vw,13px); color: #6D758F; background: #F8FAFF; padding: 4px 10px; border-radius: 8px; white-space: nowrap; border: 1px solid #EDEFF5; }

/* Hero */
.hero-banner {
  background: linear-gradient(135deg, #8DC1FF 0%, #C3DDFF 100%);
  border-radius: 24px; padding: clamp(1.2rem,2.5vw,2rem);
  display: flex; align-items: center; justify-content: space-between;
  position: relative; overflow: hidden;
  box-shadow: 0 6px 24px rgba(141,193,255,0.30);
  flex-shrink: 0;
}
.hero-text { position: relative; z-index: 2; }
.hero-title { font-size: clamp(1.2rem,2.5vw,1.8rem); font-weight: 800; color: #FFFFFF; margin: 0 0 6px; letter-spacing:-0.02em; }
.hero-sub { font-size: clamp(0.85rem,1.4vw,1rem); color: rgba(255,255,255,0.88); margin: 0; }
.hero-icon { width: clamp(60px,10vw,90px); height: clamp(60px,10vw,90px); filter: brightness(0) invert(1) opacity(0.18); position:absolute; right:24px; top:50%; transform:translateY(-50%); }

/* Section */
.section-header { display: flex; flex-direction: column; gap: 12px; margin-bottom: 1rem; }
.section-title { display: flex; align-items: center; gap: 8px; font-size: 1.1rem; font-weight: 700; color: #19213D; margin: 0; }
.section-icon { width: 18px; height: 18px; object-fit: contain; filter: brightness(0) saturate(100%) invert(10%) sepia(30%) saturate(800%) hue-rotate(195deg); }
.controls { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.search-bar { display: flex; align-items: center; gap: 8px; background: #FFFFFF; border: 1px solid #D7DBE7; border-radius: 12px; padding: 8px 12px; flex: 1; min-width: 180px; box-shadow: 0 1px 4px rgba(25,33,61,0.04); }
.search-bar:focus-within { border-color: #8DC1FF; box-shadow: 0 0 0 3px rgba(195,221,255,0.40); }
.search-icon-img { width: 15px; height: 15px; object-fit: contain; filter: brightness(0) saturate(100%) invert(65%) sepia(5%) saturate(600%) hue-rotate(195deg); }
.search-input { flex: 1; border: none; outline: none; font-family: inherit; font-size: 14px; background: transparent; color: #19213D; min-width: 0; }
.search-input::placeholder { color: #A1A7BB; }
.clear-btn { border: none; background: transparent; cursor: pointer; color: #A1A7BB; font-size: 14px; }
.sort-select { padding: 8px 12px; border: 1px solid #D7DBE7; border-radius: 12px; font-family: inherit; font-size: 13px; font-weight: 600; outline: none; cursor: pointer; background: #FFFFFF; color: #19213D; }

/* Grid */
.cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
.product-card { background: #FFFFFF; border-radius: 22px; padding: 1rem; border: 1px solid #EDEFF5; box-shadow: 0 2px 10px rgba(25,33,61,0.06); display: flex; flex-direction: column; transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease; }
.product-card:hover { transform: translateY(-4px); box-shadow: 0 10px 28px rgba(25,33,61,0.11); }
.card--out { opacity: 0.70; }
.card-img-wrap { height: clamp(140px,18vw,190px); background: #F8FAFF; border-radius: 14px; margin-bottom: 0.8rem; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; }
.card-img { height: 100%; width: 100%; object-fit: contain; mix-blend-mode: multiply; }
.card-img--greyed { filter: grayscale(1); }
.card-img-placeholder { font-size: 3.5rem; }
.badge { position: absolute; top: 8px; right: 8px; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 99px; }
.badge--low { background: #FFF7ED; color: #EA580C; }
.badge--out { background: #FEF2F2; color: #DC2626; }
.card-name { font-size: 14px; font-weight: 700; color: #19213D; margin: 0 0 3px; display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical; overflow:hidden; }
.card-desc { font-size: 11px; color: #A1A7BB; margin: 0 0 10px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; line-height:1.5; }
.card-meta { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
.stock-pill { display:flex; align-items:center; gap:4px; font-size:10px; font-weight:600; padding:4px 8px; border-radius:99px; }
.stock-icon { width:12px; height:12px; object-fit:contain; }
.stock-pill--in { background:#F0FDF4; color:#16A34A; } .stock-pill--in .stock-icon { filter: brightness(0) saturate(100%) invert(35%) sepia(80%) saturate(400%) hue-rotate(100deg); }
.stock-pill--out { background:#FEF2F2; color:#DC2626; } .stock-pill--out .stock-icon { filter: brightness(0) saturate(100%) invert(30%) sepia(80%) saturate(500%) hue-rotate(330deg); }
.card-price { font-size: 15px; font-weight: 800; color: #19213D; }
.trade-btn { width:100%; background:#8DC1FF; border:none; border-radius:14px; padding:12px; display:flex; align-items:center; justify-content:center; gap:8px; cursor:pointer; font-family:inherit; transition: background 0.18s ease, transform 0.18s cubic-bezier(0.34,1.56,0.64,1); box-shadow:0 4px 12px rgba(141,193,255,0.35); margin-top:auto; }
.trade-btn:hover:not(:disabled) { background:#4E9FFF; transform:translateY(-2px); }
.trade-btn:active:not(:disabled) { transform:scale(0.97); }
.trade-btn:disabled { background:#D7DBE7; box-shadow:none; cursor:not-allowed; }
.trade-btn--cant { background:#EDEFF5; }
.trade-pts { font-size:15px; font-weight:800; color:#19213D; }
.trade-divider { color:rgba(25,33,61,0.30); }
.trade-label { font-size:13px; font-weight:600; color:#19213D; }
.trade-btn:disabled .trade-pts, .trade-btn:disabled .trade-label, .trade-btn:disabled .trade-divider { color:#FFFFFF; }
.trade-btn--cant .trade-pts, .trade-btn--cant .trade-label, .trade-btn--cant .trade-divider { color:#A1A7BB; }

/* Loading */
.loading-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:1rem; }
.skeleton-card { height:340px; border-radius:22px; background:linear-gradient(90deg, #EDEFF5 25%, #D7DBE7 50%, #EDEFF5 75%); background-size:800px 100%; animation:shimmer 1.5s infinite linear; }
.empty-state { display:flex; flex-direction:column; align-items:center; gap:12px; padding:4rem 1rem; text-align:center; }
.empty-state span { font-size:3rem; }
.empty-state p { font-size:14px; color:#A1A7BB; margin:0; }
@keyframes shimmer { from { background-position:-400px 0; } to { background-position:400px 0; } }
</style>

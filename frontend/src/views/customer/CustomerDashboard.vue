<template>
  <div class="kiosk-main-layout">
    <!-- LEFT: customer content -->
    <div class="content-col">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="avatar">
          <span class="avatar-icon">👤</span>
        </div>
        <div class="profile-info">
          <div class="profile-top">
            <h1 class="profile-name">{{ c?.name }}</h1>
            <div class="points-badge points-pulse">
              <span class="pts-num">{{ c?.points?.toLocaleString() }}</span>
              <span class="pts-star">⭐</span>
            </div>
          </div>
          <div class="profile-details">
            <span v-if="c?.phone" class="detail-chip">📞 {{ c.phone }}</span>
            <span v-if="c?.email" class="detail-chip">✉ {{ c.email }}</span>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="kiosk-tabs">
        <button class="kiosk-tab" :class="{ active: tab === 'history' }" @click="tab = 'history'">History</button>
        <button class="kiosk-tab" :class="{ active: tab === 'inventory' }" @click="tab = 'inventory'">Inventory</button>
      </div>

      <!-- HISTORY TAB -->
      <div v-if="tab === 'history'" class="tab-content">
        <div class="tx-list">
          <div v-if="txs.length === 0" class="empty-state">
            <span>📭</span><p>No transactions yet</p>
          </div>
          <div v-for="tx in txs" :key="tx.id" class="tx-item">
            <div class="tx-icon-wrap" :class="`tx--${tx.type}`">
              <span>{{ tx.inventory ? '🍾' : (icons[tx.type] || '📋') }}</span>
            </div>
            <div class="tx-text">
              <p class="tx-desc">{{ tx.description || (tx.reward?.rewardName ? `Redeemed: ${tx.reward.rewardName}` : (tx.inventory?.name ? `Traded: ${tx.inventory.name}` : 'Points earned')) }}</p>
              <p class="tx-date">{{ fmtDate(tx.createdAt) }}</p>
            </div>
            <span class="tx-pts" :class="tx.points > 0 ? 'pos' : 'neg'">
              {{ tx.points > 0 ? '+' : '' }}{{ tx.points }}
            </span>
          </div>
        </div>
      </div>

      <!-- INVENTORY TAB (browse wines + earn points) -->
      <div v-if="tab === 'inventory'" class="tab-content">
        <div class="inv-controls">
          <div class="inv-search-bar">
            <span class="search-icon">🔍</span>
            <input v-model="invSearch" class="inv-search-input" placeholder="Search bottles & offers…" />
            <button v-if="invSearch" class="clear-btn" @click="invSearch = ''">✕</button>
          </div>
          <div class="inv-filters">
            <select v-model="invSort" class="filter-select">
              <option value="name">Name (A-Z)</option>
              <option value="price_asc">Points (Low-High)</option>
              <option value="price_desc">Points (High-Low)</option>
            </select>
          </div>
        </div>

        <div class="inv-list">
          <div v-if="filteredInventory.length === 0" class="empty-state">
            <span>🍾</span><p>No items found</p>
          </div>
          <div v-for="item in filteredInventory" :key="item.id" class="inv-item card-3d">
            <div class="inv-img-wrap">
              <img v-if="item.imageUrl" :src="`${baseUrl}/${item.imageUrl}`" :alt="item.name" class="inv-img" />
              <div v-else class="inv-img-placeholder">🍾</div>
            </div>
            <div class="inv-details">
              <p class="inv-name">{{ item.name }}</p>
              <p class="inv-desc" v-if="item.description">{{ item.description }}</p>
              <div class="inv-meta">
                <span class="inv-price" v-if="item.price">⭐ {{ Math.round(Number(item.price)) }}</span>
                <span class="inv-stock">{{ item.stockQuantity }} available</span>
              </div>
            </div>
            <button class="add-btn" @click="addToCart(item)">
              <span>⭐</span> Trade
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT: Persistent Ad Panel -->
    <div class="ad-col">
      <KioskAdPanel />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCustomerStore } from '@/stores/customer.store'
import { useNotificationStore } from '@/stores/notification.store'
import { transactionApi } from '@/api/transaction.api'
import { inventoryApi } from '@/api/inventory.api'
import KioskAdPanel from '@/components/kiosk/KioskAdPanel.vue'

const customer = useCustomerStore()
const notify = useNotificationStore()
const c = computed(() => customer.activeCustomer)
const baseUrl = (import.meta as any).env.VITE_API_BASE_URL?.replace('/api','') || 'http://localhost:3000'

const tab = ref<'history' | 'inventory'>('history')
const txs = ref<any[]>([])
const inventory = ref<any[]>([])
const invSearch = ref('')
const invSort = ref('name')

const icons: Record<string, string> = { earn: '⭐', redeem: '🎁', manual_adjust: '✏️' }
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const filteredInventory = computed(() => {
  let list = inventory.value

  // Search
  if (invSearch.value) {
    const q = invSearch.value.toLowerCase()
    list = list.filter(i => i.name?.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q))
  }

  // Sort
  list = [...list].sort((a, b) => {
    if (invSort.value === 'name') {
      return (a.name || '').localeCompare(b.name || '')
    } else if (invSort.value === 'price_asc') {
      return (Number(a.price) || 0) - (Number(b.price) || 0)
    } else if (invSort.value === 'price_desc') {
      return (Number(b.price) || 0) - (Number(a.price) || 0)
    }
    return 0
  })

  return list
})

async function addToCart(item: any) {
  if (!c.value) return
  const pts = item.price ? Math.floor(Number(item.price)) : 10
  
  if ((c.value.points || 0) < pts) {
    notify.error(`Not enough points! You need ${pts} pts.`)
    return
  }

  try {
    await transactionApi.redeem({ 
      customerId: c.value.id, 
      inventoryId: item.id,
      points: pts, 
      description: `Traded for: ${item.name}` 
    })
    customer.updatePoints((c.value.points || 0) - pts)
    notify.success(`Traded ${pts} pts for ${item.name}!`)
    // Optionally refresh history
    txs.value = await transactionApi.getByCustomer(c.value.id)
  } catch (e: any) { notify.error(e.message) }
}

onMounted(async () => {
  if (c.value) {
    try {
      txs.value = await transactionApi.getByCustomer(c.value.id)
    } catch (e) { console.error('Failed to load history', e) }
    
    try {
      inventory.value = await inventoryApi.getAll()
    } catch (e) { console.error('Failed to load inventory', e) }
  }
})
</script>

<style scoped>
.kiosk-main-layout {
  display: grid;
  grid-template-columns: 1fr clamp(280px, 35%, 400px);
  height: 100%;
  gap: 0;
  overflow: hidden;
}

/* ── CONTENT COL ── */
.content-col {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: clamp(1rem, 2vw, 1.5rem);
  gap: clamp(10px, 1.5vh, 16px);
  background: #FAFAFA;
}

/* Profile */
.profile-header {
  display: flex;
  align-items: center;
  gap: clamp(10px, 1.5vw, 16px);
  background: #FFFFFF;
  border-radius: 20px;
  padding: clamp(12px, 1.8vw, 18px) clamp(14px, 2vw, 20px);
  border: 1px solid #E5E5E5;
  flex-shrink: 0;
}
.avatar { width: clamp(50px, 6vw, 66px); height: clamp(50px, 6vw, 66px); border-radius: 50%; background: linear-gradient(135deg, #111 0%, #555 100%); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.avatar-icon { font-size: clamp(22px, 3vw, 30px); filter: grayscale(1) brightness(2); }
.profile-info { flex: 1; min-width: 0; }
.profile-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 8px; }
.profile-name { font-size: clamp(17px, 2.5vw, 24px); font-weight: 800; margin: 0; color: #111111; }
.points-badge { display: flex; align-items: center; gap: 6px; background: #111111; color: #FFFFFF; padding: clamp(6px, 1vw, 10px) clamp(12px, 1.5vw, 18px); border-radius: 99px; flex-shrink: 0; }
.pts-num { font-size: clamp(16px, 2.2vw, 22px); font-weight: 900; }
.pts-star { font-size: 16px; }
.profile-details { display: flex; gap: 10px; flex-wrap: wrap; }
.detail-chip { font-size: clamp(11px, 1.2vw, 13px); color: #525252; background: #F5F5F5; padding: 4px 10px; border-radius: 8px; white-space: nowrap; }

/* Tabs */
.kiosk-tabs { display: flex; border-radius: 14px; border: 1px solid #E5E5E5; overflow: hidden; height: clamp(44px, 5.5vh, 54px); background: #FFFFFF; flex-shrink: 0; }
.kiosk-tab { flex: 1; border: none; background: transparent; font-family: inherit; font-size: clamp(14px, 1.6vw, 16px); font-weight: 600; color: #A3A3A3; cursor: pointer; transition: all 0.2s ease; }
.kiosk-tab.active { background: #111111; color: #FFFFFF; }

/* Tab content area */
.tab-content { flex: 1; overflow-y: auto; min-height: 0; }

/* History */
.tx-list { display: flex; flex-direction: column; gap: 8px; }
.tx-item { display: flex; align-items: center; gap: 12px; background: #FFFFFF; border-radius: 14px; padding: clamp(10px, 1.5vw, 14px); border: 1px solid #E5E5E5; }
.tx-icon-wrap { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.tx--earn { background: #F0FDF4; }
.tx--redeem { background: #F0F9FF; }
.tx--manual_adjust { background: #FFFBEB; }
.tx-text { flex: 1; min-width: 0; }
.tx-desc { font-size: clamp(12px, 1.3vw, 14px); font-weight: 600; color: #111111; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tx-date { font-size: 11px; color: #A3A3A3; margin: 2px 0 0; }
.tx-pts { font-size: clamp(14px, 1.8vw, 17px); font-weight: 800; flex-shrink: 0; }
.pos { color: #16A34A; } .neg { color: #DC2626; }

/* Inventory */
.inv-controls { display: flex; flex-direction: column; gap: 10px; margin-bottom: 12px; flex-shrink: 0; }
.inv-search-bar { display: flex; align-items: center; gap: 10px; background: #FFFFFF; border: 2px solid #E5E5E5; border-radius: 14px; padding: 10px 14px; transition: border-color 0.15s; }
.inv-search-bar:focus-within { border-color: #111111; }
.search-icon { font-size: 16px; flex-shrink: 0; }
.inv-search-input { flex: 1; border: none; outline: none; font-family: inherit; font-size: 15px; background: transparent; color: #111111; min-width: 0; }
.inv-search-input::placeholder { color: #A3A3A3; }
.clear-btn { border: none; background: transparent; cursor: pointer; color: #A3A3A3; font-size: 16px; padding: 2px 6px; }

.inv-filters { display: flex; justify-content: flex-end; }
.filter-select { padding: 8px 12px; border: 1px solid #E5E5E5; border-radius: 10px; font-family: inherit; font-size: 13px; font-weight: 600; outline: none; cursor: pointer; background: #FFF; color: #111111; }

.inv-list { display: flex; flex-direction: column; gap: 8px; }
.inv-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #FFFFFF;
  border-radius: 16px;
  padding: clamp(10px, 1.5vw, 14px);
  border: 1px solid #E5E5E5;
  flex-shrink: 0;
}
.inv-img-wrap { width: clamp(50px, 6vw, 66px); height: clamp(50px, 6vw, 66px); border-radius: 12px; overflow: hidden; background: #F5F5F5; flex-shrink: 0; }
.inv-img { width: 100%; height: 100%; object-fit: cover; }
.inv-img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; }
.inv-details { flex: 1; min-width: 0; }
.inv-name { font-size: clamp(13px, 1.5vw, 15px); font-weight: 700; color: #111111; margin: 0 0 2px; }
.inv-desc { font-size: 12px; color: #525252; margin: 0 0 4px; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
.inv-meta { display: flex; gap: 10px; align-items: center; }
.inv-price { font-size: 13px; font-weight: 700; color: #111111; }
.inv-stock { font-size: 11px; color: #A3A3A3; }
.add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: clamp(10px, 1.2vw, 14px) clamp(14px, 1.8vw, 18px);
  background: #111111;
  color: #FFFFFF;
  border: none;
  border-radius: 12px;
  font-family: inherit;
  font-size: clamp(12px, 1.3vw, 14px);
  font-weight: 700;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.15s ease, background 0.15s ease;
  -webkit-tap-highlight-color: transparent;
  min-width: clamp(100px, 10vw, 120px);
  justify-content: center;
}
.add-btn:hover { background: #333333; }
.add-btn:active { transform: scale(0.95); }

/* Empty */
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 3rem 1rem; text-align: center; }
.empty-state span { font-size: 2.5rem; }
.empty-state p { font-size: 14px; color: #A3A3A3; margin: 0; }

/* ── AD COL ── */
.ad-col {
  border-left: 1px solid #E5E5E5;
  background: #F5F5F5;
  padding: clamp(0.75rem, 1.5vw, 1.25rem);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
</style>

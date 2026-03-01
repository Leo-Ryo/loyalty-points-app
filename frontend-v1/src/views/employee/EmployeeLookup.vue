<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Customer Lookup</h1>
        <p class="page-sub">Search for a customer, then add points or process a trade</p>
      </div>
    </div>

    <!-- Search + filter bar -->
    <div class="search-section">
      <div class="search-row">
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input
            v-model="query"
            class="search-input"
            placeholder="Name, phone or email…"
            @keydown.enter.prevent="doSearch"
          />
          <button v-if="query" class="clear-btn" @click="clearSearch">✕</button>
        </div>
        <button class="search-btn" @click="doSearch" :disabled="searching">
          <span v-if="searching" class="spin-sm" />
          <span v-else>Search</span>
        </button>
      </div>

      <div class="filter-row">
        <label class="filter-label">Sort by:</label>
        <select v-model="sortBy" class="filter-select" @change="sortResults">
          <option value="name">Name</option>
          <option value="points">Points</option>
          <option value="createdAt">Joined Date</option>
        </select>
        <button class="sort-dir-btn" @click="toggleDir">
          {{ sortDir === 'asc' ? '↑ Asc' : '↓ Desc' }}
        </button>
      </div>
    </div>

    <!-- No results -->
    <div v-if="searched && !results.length && !searching" class="empty-search">
      <span>🔎</span>
      <p>No customers found for "{{ lastQuery }}"</p>
    </div>

    <!-- Results list -->
    <div v-if="results.length" class="results-list">
      <div
        v-for="c in results"
        :key="c.id"
        class="result-item"
        :class="{ 'result-item--selected': customer?.id === c.id }"
        @click="selectCustomer(c)"
      >
        <div class="result-avatar">{{ (c.name || '?')[0].toUpperCase() }}</div>
        <div class="result-info">
          <p class="result-name">{{ c.name }}</p>
          <p class="result-meta">{{ c.phone || c.email || 'No contact' }}</p>
        </div>
        <div class="result-pts">⭐ {{ c.points?.toLocaleString() ?? 0 }}</div>
      </div>
    </div>

    <!-- Selected Customer Card -->
    <div v-if="customer" class="customer-card">
      <div class="customer-header">
        <div class="avatar-lg">{{ (customer.name || '?')[0].toUpperCase() }}</div>
        <div class="customer-meta">
          <h2 class="customer-name">{{ customer.name }}</h2>
          <div class="customer-chips">
            <span v-if="customer.phone" class="chip">📞 {{ customer.phone }}</span>
            <span v-if="customer.email" class="chip">✉ {{ customer.email }}</span>
          </div>
          <p class="customer-member">Member since {{ fmtDate(customer.createdAt) }}</p>
        </div>
        <div class="points-display">
          <span class="pts-num">{{ customer.points?.toLocaleString() ?? 0 }}</span>
          <span class="pts-label">pts ⭐</span>
        </div>
      </div>

      <!-- Add Points from Bill -->
      <div class="action-section">
        <h3 class="action-title">💰 Add Points from Bill</h3>
        <div class="bill-row">
          <div class="bill-input-wrap">
            <span class="bill-symbol">$</span>
            <input v-model="billAmount" type="number" min="0" step="0.01" class="bill-input" placeholder="0.00" />
          </div>
          <div class="bill-preview" v-if="Number(billAmount) > 0">
            → <strong>{{ pointsPreview }}</strong> pts
            <span class="rate-hint">({{ settings.pointsRatePercent ?? 5 }}% of bill)</span>
          </div>
          <button class="action-btn btn-primary" :disabled="savingBill || !Number(billAmount)" @click="addFromBill">
            <span v-if="savingBill" class="spinner-sm" />
            <span v-else>Add Points</span>
          </button>
        </div>
      </div>

      <!-- Trade (Redeem) at Counter -->
      <div class="action-section">
        <h3 class="action-title">🎁 Process a Trade</h3>
        <div v-if="loadingRewards" class="loading-sm">Loading rewards…</div>
        <div v-else class="rewards-list">
          <div
            v-for="r in rewards"
            :key="r.id"
            class="reward-row"
            :class="{ 'reward--locked': (customer.points ?? 0) < r.pointsRequired }"
          >
            <div class="reward-info">
              <p class="reward-name">{{ r.rewardName }}</p>
              <p class="reward-pts">⭐ {{ r.pointsRequired?.toLocaleString() }}</p>
            </div>
            <button
              class="action-btn btn-outline"
              :disabled="(customer.points ?? 0) < r.pointsRequired || redeeming === r.id"
              @click="redeemForCustomer(r)"
            >
              <span v-if="redeeming === r.id" class="spinner-sm dark" />
              <span v-else>Trade</span>
            </button>
          </div>
          <p v-if="!rewards.length" class="empty-msg">No active rewards configured</p>
        </div>
      </div>

      <!-- Recent history -->
      <div class="action-section">
        <h3 class="action-title">📋 Recent History</h3>
        <div v-if="loadingHistory" class="loading-sm">Loading…</div>
        <div v-else class="history-list">
          <div v-for="tx in history" :key="tx.id" class="history-item">
            <span class="tx-icon">{{ icons[tx.type] || '📋' }}</span>
            <div class="tx-info">
              <p class="tx-desc">{{ tx.description || tx.type }}</p>
              <p class="tx-meta">
                {{ fmtDate(tx.createdAt) }}
                <span v-if="tx.employee"> · {{ tx.employee.name }}</span>
                <span v-if="tx.status && tx.status !== 'completed'" class="tx-status" :class="`status--${tx.status}`"> · {{ tx.status }}</span>
              </p>
            </div>
            <span class="tx-pts" :class="(tx.points ?? 0) >= 0 ? 'pos' : 'neg'">
              {{ (tx.points ?? 0) >= 0 ? '+' : '' }}{{ tx.points }}
            </span>
          </div>
          <p v-if="!history.length" class="empty-msg">No transactions yet</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { customerApi } from '@/api/customer.api'
import { rewardApi } from '@/api/reward.api'
import { transactionApi } from '@/api/transaction.api'
import { employeeApi } from '@/api/employee.api'
import { useSettingsStore } from '@/stores/settings.store'
import { useNotificationStore } from '@/stores/notification.store'

const settings = useSettingsStore()
const notify = useNotificationStore()

// Search state
const query = ref('')
const lastQuery = ref('')
const results = ref<any[]>([])
const searching = ref(false)
const searched = ref(false)
const sortBy = ref<'name' | 'points' | 'createdAt'>('name')
const sortDir = ref<'asc' | 'desc'>('asc')

// Customer detail state
const customer = ref<any>(null)
const history = ref<any[]>([])
const rewards = ref<any[]>([])
const billAmount = ref<string>('')
const savingBill = ref(false)
const redeeming = ref<string | null>(null)
const loadingHistory = ref(false)
const loadingRewards = ref(false)

const icons: Record<string, string> = { earn: '⭐', redeem: '🎁', manual_adjust: '✏️' }
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''

const pointsPreview = computed(() => {
  const amt = Number(billAmount.value)
  if (!amt || amt <= 0) return 0
  return Math.floor(amt * ((settings.pointsRatePercent ?? 5) / 100))
})

function sortResults() {
  results.value = [...results.value].sort((a, b) => {
    let av = a[sortBy.value], bv = b[sortBy.value]
    if (sortBy.value === 'name') { av = av?.toLowerCase(); bv = bv?.toLowerCase() }
    if (sortBy.value === 'createdAt') { av = new Date(av).getTime(); bv = new Date(bv).getTime() }
    const cmp = av < bv ? -1 : av > bv ? 1 : 0
    return sortDir.value === 'asc' ? cmp : -cmp
  })
}

function toggleDir() {
  sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  sortResults()
}

async function doSearch() {
  const q = query.value.trim()
  searching.value = true
  searched.value = true
  lastQuery.value = q
  customer.value = null
  try {
    const data = await customerApi.getAll(q || '')
    results.value = Array.isArray(data) ? data : []
    sortResults()
  } catch (e: any) {
    notify.error('Search failed: ' + (e.message || 'Unknown error'))
    results.value = []
  } finally {
    searching.value = false
  }
}

function clearSearch() {
  query.value = ''
  customer.value = null
  doSearch() // re-fetch all instead of clearing to empty
}

async function selectCustomer(c: any) {
  customer.value = { ...c }
  results.value = results.value  // keep list visible
  loadingHistory.value = true
  loadingRewards.value = true
  try {
    history.value = await transactionApi.getByCustomer(c.id)
  } catch { history.value = [] }
  finally { loadingHistory.value = false }
  try {
    const all = await rewardApi.getAll()
    rewards.value = Array.isArray(all) ? all.filter((r: any) => r.isActive) : []
  } catch { rewards.value = [] }
  finally { loadingRewards.value = false }
}

async function addFromBill() {
  if (!customer.value || !Number(billAmount.value)) return
  savingBill.value = true
  try {
    const tx = await employeeApi.earnFromBill(customer.value.id, Number(billAmount.value))
    customer.value.points = (customer.value.points || 0) + (tx.points ?? 0)
    // update result list too
    const idx = results.value.findIndex((r: any) => r.id === customer.value.id)
    if (idx !== -1) results.value[idx].points = customer.value.points
    history.value = [tx, ...history.value]
    billAmount.value = ''
    notify.success(`+${tx.points} pts added!`)
  } catch (e: any) { notify.error(e.message || 'Failed to add points') }
  finally { savingBill.value = false }
}

async function redeemForCustomer(r: any) {
  redeeming.value = r.id
  try {
    const tx = await employeeApi.employeeRedeem(customer.value.id, r.id)
    customer.value.points = (customer.value.points || 0) - r.pointsRequired
    history.value = [tx, ...history.value]
    notify.success(`Trade complete: ${r.rewardName}`)
  } catch (e: any) { notify.error(e.message || 'Trade failed') }
  finally { redeeming.value = null }
}

onMounted(() => {
  settings.loadSettings()
  doSearch() // Load all customers initially
})
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 1.25rem; max-width: 820px; margin: 0 auto; }
.page-title { font-size: clamp(18px, 2.5vw, 24px); font-weight: 800; margin: 0; letter-spacing: -0.02em; color: #111111; }
.page-sub { font-size: 13px; color: #A3A3A3; margin: 4px 0 0; }

/* Search */
.search-section { display: flex; flex-direction: column; gap: 10px; }
.search-row { display: flex; gap: 10px; }
.search-bar {
  flex: 1; display: flex; align-items: center; gap: 10px;
  background: #FFFFFF; border: 1px solid rgba(0,0,0,0.10);
  border-radius: 14px; padding: 10px 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04), inset 0 1px 2px rgba(0,0,0,0.03);
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}
.search-bar:focus-within {
  border-color: #111111;
  box-shadow: 0 0 0 4px rgba(17,17,17,0.07), inset 0 1px 2px rgba(0,0,0,0.02);
}
.search-icon { font-size: 16px; flex-shrink: 0; }
.search-input { flex: 1; border: none; outline: none; font-family: inherit; font-size: 15px; background: transparent; color: #111111; }
.search-input::placeholder { color: #A3A3A3; }
.clear-btn { border: none; background: transparent; cursor: pointer; color: #A3A3A3; font-size: 16px; padding: 2px 6px; line-height: 1; }
.search-btn {
  padding: 10px 22px; border: none; border-radius: 12px; background: #111111;
  color: #FFFFFF; font-family: inherit; font-size: 14px; font-weight: 700;
  cursor: pointer; display: flex; align-items: center; gap: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.10);
  transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1), background 0.15s ease;
}
.search-btn:hover:not(:disabled) { background: #1a1a1a; transform: translateY(-2px); }
.search-btn:active:not(:disabled) { transform: scale(0.97); }
.search-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.filter-row { display: flex; align-items: center; gap: 10px; }
.filter-label { font-size: 12px; color: #A3A3A3; white-space: nowrap; }
.filter-select {
  padding: 6px 10px; border: 1px solid rgba(0,0,0,0.10); border-radius: 8px;
  font-family: inherit; font-size: 13px; outline: none; cursor: pointer; background: #FFFFFF;
  color: #111111;
}
.sort-dir-btn {
  padding: 6px 12px; border: 1px solid rgba(0,0,0,0.10); border-radius: 8px;
  background: #FFFFFF; font-family: inherit; font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all 0.18s ease;
}
.sort-dir-btn:hover { background: #111111; color: #FFF; border-color: #111111; }

.empty-search { text-align: center; padding: 2rem; color: #A3A3A3; }
.empty-search span { font-size: 2rem; display: block; margin-bottom: 0.5rem; }

/* Results */
.results-list { display: flex; flex-direction: column; gap: 6px; }
.result-item {
  display: flex; align-items: center; gap: 12px;
  background: #FFFFFF; border: 1px solid rgba(0,0,0,0.06);
  border-radius: 14px; padding: 12px 16px; cursor: pointer;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease, border-color 0.18s;
}
.result-item:hover { border-color: rgba(0,0,0,0.15); transform: translateY(-2px); box-shadow: 0 4px 14px rgba(0,0,0,0.08); }
.result-item--selected { border-color: #111111; background: #F9F9F9; box-shadow: 0 0 0 3px rgba(17,17,17,0.08); }
.result-avatar {
  width: 42px; height: 42px; border-radius: 50%; background: #111111;
  color: #FFF; display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 16px; flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.20);
}
.result-info { flex: 1; min-width: 0; }
.result-name { font-weight: 700; font-size: 14px; margin: 0; }
.result-meta { font-size: 12px; color: #A3A3A3; margin: 2px 0 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.result-pts { font-weight: 700; font-size: 13px; color: #111111; white-space: nowrap; }

/* Customer card */
.customer-card {
  background: #FFFFFF;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 20px; padding: 1.5rem;
  display: flex; flex-direction: column; gap: 1.25rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9);
}
.customer-header { display: flex; align-items: center; gap: 1rem; }
.avatar-lg {
  width: 56px; height: 56px; border-radius: 50%; background: #111111;
  color: #FFF; display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 22px; flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(0,0,0,0.25);
}
.customer-meta { flex: 1; }
.customer-name { font-size: 18px; font-weight: 800; margin: 0 0 5px; letter-spacing: -0.02em; }
.customer-chips { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 4px; }
.chip { font-size: 11px; color: #525252; background: rgba(0,0,0,0.04); padding: 3px 8px; border-radius: 6px; }
.customer-member { font-size: 11px; color: #A3A3A3; margin: 0; }
.points-display { display: flex; flex-direction: column; align-items: flex-end; }
.pts-num { font-size: 26px; font-weight: 900; color: #111111; line-height: 1; letter-spacing: -0.02em; }
.pts-label { font-size: 12px; color: #A3A3A3; }

/* Actions */
.action-section { border-top: 1px solid rgba(0,0,0,0.06); padding-top: 1rem; }
.action-title { font-size: 14px; font-weight: 700; color: #111111; margin: 0 0 10px; }
.bill-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.bill-input-wrap {
  display: flex; align-items: center;
  border: 1px solid rgba(0,0,0,0.12); border-radius: 10px; padding: 8px 12px; gap: 4px;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.04);
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}
.bill-input-wrap:focus-within { border-color: #111111; box-shadow: 0 0 0 3px rgba(17,17,17,0.07); }
.bill-symbol { font-size: 15px; font-weight: 700; }
.bill-input { border: none; outline: none; font-family: inherit; font-size: 18px; font-weight: 700; width: 100px; background: transparent; }
.bill-preview { font-size: 14px; color: #525252; flex: 1; }
.rate-hint { font-size: 11px; color: #A3A3A3; }

.rewards-list { display: flex; flex-direction: column; gap: 8px; }
.reward-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 12px;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 10px; gap: 12px;
  background: #FAFAFA;
}
.reward-row.reward--locked { opacity: 0.45; }
.reward-info { flex: 1; }
.reward-name { font-size: 13px; font-weight: 600; margin: 0; }
.reward-pts { font-size: 12px; color: #A3A3A3; margin: 2px 0 0; }

.action-btn {
  padding: 8px 16px; border-radius: 10px; font-family: inherit;
  font-size: 13px; font-weight: 700; cursor: pointer; border: none;
  display: flex; align-items: center; gap: 6px; white-space: nowrap;
  transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1), background 0.15s ease;
}
.action-btn:active:not(:disabled) { transform: scale(0.95); }
.btn-primary {
  background: #111111; color: #FFFFFF;
  box-shadow: 0 2px 6px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.10);
}
.btn-primary:hover:not(:disabled) { background: #1a1a1a; }
.btn-outline {
  background: transparent; border: 1.5px solid rgba(0,0,0,0.20); color: #111111;
  box-shadow: none;
}
.btn-outline:hover:not(:disabled) { background: #111111; color: #FFF; border-color: #111111; }
.action-btn:disabled { opacity: 0.35; cursor: not-allowed; }

.history-list { display: flex; flex-direction: column; gap: 6px; max-height: 260px; overflow-y: auto; }
.history-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px;
  border: 1px solid rgba(0,0,0,0.05);
  border-radius: 10px; background: #FAFAFA;
}
.tx-icon { font-size: 15px; flex-shrink: 0; }
.tx-info { flex: 1; min-width: 0; }
.tx-desc { font-size: 13px; font-weight: 600; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tx-meta { font-size: 11px; color: #A3A3A3; margin: 2px 0 0; }
.tx-status { font-weight: 700; }
.status--pending  { color: #D97706; }
.status--approved { color: #16A34A; }
.status--rejected { color: #DC2626; }
.tx-pts { font-size: 14px; font-weight: 700; flex-shrink: 0; }
.pos { color: #16A34A; } .neg { color: #DC2626; }
.empty-msg { font-size: 13px; color: #A3A3A3; text-align: center; padding: 1rem 0; }
.loading-sm { font-size: 13px; color: #A3A3A3; padding: 8px 0; }

.spin-sm, .spinner-sm {
  display: inline-block; width: 12px; height: 12px;
  border: 2px solid rgba(255,255,255,0.35); border-top-color: #FFF;
  border-radius: 50%; animation: spin 0.65s linear infinite;
}
.spinner-sm.dark { border-color: rgba(0,0,0,0.15); border-top-color: #111; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>

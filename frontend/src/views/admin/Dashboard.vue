<template>
  <div class="dashboard">
    <div class="page-header">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-sub">Welcome back, {{ auth.admin?.firstName }}</p>
      </div>
      <span class="date-badge">{{ today }}</span>
    </div>

    <!-- Clickable stat cards -->
    <div class="stats-grid">
      <StatCard
        icon="👥" label="Total Customers" :value="stats.totalCustomers" sub="All registered"
        clickable @click="router.push('/admin/customers')"
      />
      <StatCard
        icon="📢" label="Active Promotions" :value="stats.activePromos.length" sub="Running now"
        clickable @click="router.push('/admin/promotions')"
      />
      <StatCard
        icon="🎁" label="Most Redeemed" :value="stats.topReward || 'N/A'" sub="This period"
        clickable @click="router.push('/admin/transactions')"
      />
      <StatCard
        icon="🔔" label="Low Stock Items" :value="stats.lowStock"
        :badge="stats.lowStock > 0 ? 'Alert' : undefined" badge-variant="warning"
        clickable @click="router.push('/admin/inventory')"
      />
    </div>

    <!-- Recent activity + promotions summary -->
    <div class="dashboard-body">
      <div class="recent-transactions">
        <div class="section-header">
          <h2 class="section-title">Recent Transactions</h2>
          <router-link to="/admin/transactions" class="view-all">View All →</router-link>
        </div>
        <AppTable :columns="txCols" :rows="recentTx">
          <template #type="{ row }">
            <AppBadge :variant="row.type === 'earn' ? 'success' : row.type === 'redeem' ? 'neutral' : 'warning'">
              {{ row.type }}
            </AppBadge>
          </template>
          <template #points="{ row }">
            <span :style="{ color: row.points > 0 ? '#16A34A' : '#DC2626', fontWeight: '600' }">
              {{ row.points > 0 ? '+' : '' }}{{ row.points }}
            </span>
          </template>
          <template #createdAt="{ row }">{{ fmtDate(row.createdAt) }}</template>
        </AppTable>
      </div>

      <div class="sidebar-widgets">
        <AppCard>
          <div class="widget-header">
            <h3 class="widget-title">Active Promotions</h3>
            <router-link to="/admin/promotions" class="widget-link">Manage →</router-link>
          </div>
          <div v-if="stats.activePromos.length" class="promo-list">
            <div v-for="p in stats.activePromos" :key="p.id" class="promo-item" @click="router.push('/admin/promotions')" style="cursor:pointer">
              <span class="promo-dot" />
              <span class="promo-name">{{ p.title }}</span>
            </div>
          </div>
          <p v-else class="empty-text">No active promotions</p>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { customerApi } from '@/api/customer.api'
import { transactionApi } from '@/api/transaction.api'
import { inventoryApi } from '@/api/inventory.api'
import { promotionApi } from '@/api/promotion.api'
import StatCard from '@/components/ui/StatCard.vue'
import AppTable from '@/components/ui/AppTable.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppCard from '@/components/ui/AppCard.vue'

const router = useRouter()
const auth = useAuthStore()
const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

const stats = ref({ totalCustomers: 0, topReward: '', lowStock: 0, activePromos: [] as any[] })
const recentTx = ref<any[]>([])

const txCols = [
  { key: 'customer', label: 'Customer' },
  { key: 'type',     label: 'Type' },
  { key: 'points',   label: 'Points' },
  { key: 'description', label: 'Note' },
  { key: 'createdAt', label: 'Date' },
]
const fmtDate = (d: string) => new Date(d).toLocaleDateString()

onMounted(async () => {
  try {
    const [customers, txs, lowStock, promos] = await Promise.all([
      customerApi.getAll(),
      transactionApi.getAll({ limit: 8 }),
      inventoryApi.getLowStock(),
      promotionApi.getAll(true),
    ])
    stats.value.totalCustomers = customers.length
    stats.value.lowStock = lowStock.length
    stats.value.activePromos = promos
    recentTx.value = txs.slice(0, 8).map((t: any) => ({ ...t, customer: t.customer?.name }))

    const redeems = txs.filter((t: any) => t.type === 'redeem' && t.reward)
    if (redeems.length) {
      const counts: Record<string, number> = {}
      redeems.forEach((t: any) => { const n = t.reward.rewardName; counts[n] = (counts[n] || 0) + 1 })
      stats.value.topReward = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0]
    }
  } catch {}
})
</script>

<style scoped>
.dashboard { display: flex; flex-direction: column; gap: clamp(1.25rem, 2.5vh, 2rem); }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; }
.page-title  { font-size: clamp(20px, 2.5vw, 28px); font-weight: 800; margin: 0; color: #111111; }
.page-sub    { font-size: 14px; color: #525252; margin: 4px 0 0; }
.date-badge  { font-size: 12px; color: #A3A3A3; background: #F5F5F5; padding: 6px 12px; border-radius: 8px; white-space: nowrap; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(200px, 100%), 1fr));
  gap: clamp(0.75rem, 1.5vw, 1.25rem);
}

.dashboard-body {
  display: grid;
  grid-template-columns: 1fr clamp(240px, 25%, 300px);
  gap: clamp(1rem, 2vw, 1.5rem);
  align-items: start;
}
@media (max-width: 900px) { .dashboard-body { grid-template-columns: 1fr; } }

.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.section-title  { font-size: clamp(14px, 1.5vw, 17px); font-weight: 700; color: #111111; margin: 0; }
.view-all       { font-size: 13px; color: #525252; text-decoration: none; font-weight: 500; }
.view-all:hover { color: #111111; }
.recent-transactions { display: flex; flex-direction: column; }

.widget-header  { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.widget-title   { font-size: 14px; font-weight: 700; color: #111111; margin: 0; }
.widget-link    { font-size: 12px; color: #525252; text-decoration: none; }
.widget-link:hover { color: #111111; }
.promo-list     { display: flex; flex-direction: column; gap: 8px; }
.promo-item     { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #525252; border-radius: 8px; padding: 4px 6px; transition: background 0.15s; }
.promo-item:hover { background: #F5F5F5; }
.promo-dot      { width: 8px; height: 8px; border-radius: 50%; background: #16A34A; flex-shrink: 0; }
.promo-name     { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.empty-text     { font-size: 13px; color: #A3A3A3; }
</style>

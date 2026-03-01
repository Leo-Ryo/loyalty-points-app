<template>
  <div class="kiosk-main-layout">
    <!-- LEFT: transaction history -->
    <div class="content-col">
      <div class="page-header">
        <h1 class="page-title">Points History</h1>
        <div class="points-chip points-pulse">⭐ {{ customer.activeCustomer?.points?.toLocaleString() }} pts</div>
      </div>

      <div class="tx-list">
        <div v-if="txs.length === 0" class="empty-state">
          <span>📭</span>
          <p>No transactions yet</p>
          <p class="empty-hint">Start earning points by browsing our wines!</p>
        </div>
        <div v-for="tx in txs" :key="tx.id" class="tx-item card-3d">
          <div class="tx-icon-wrap" :class="`tx--${tx.type}`">
            <span class="tx-icon">{{ tx.inventory ? '🍾' : (icons[tx.type] || '📋') }}</span>
          </div>
          <div class="tx-info">
            <p class="tx-desc">{{ tx.description || (tx.reward?.rewardName ? `Redeemed: ${tx.reward.rewardName}` : (tx.inventory?.name ? `Traded: ${tx.inventory.name}` : 'Points earned')) }}</p>
            <p class="tx-date">{{ fmtDate(tx.createdAt) }}</p>
          </div>
          <div class="tx-pts" :class="tx.points > 0 ? 'pts--pos' : 'pts--neg'">
            {{ tx.points > 0 ? '+' : '' }}{{ tx.points }}
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
import { ref, onMounted } from 'vue'
import { useCustomerStore } from '@/stores/customer.store'
import { transactionApi } from '@/api/transaction.api'
import KioskAdPanel from '@/components/kiosk/KioskAdPanel.vue'

const customer = useCustomerStore()
const txs = ref<any[]>([])
const icons: Record<string, string> = { earn: '⭐', redeem: '🎁', manual_adjust: '✏️' }
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

onMounted(async () => {
  if (customer.activeCustomer) {
    try { txs.value = await transactionApi.getByCustomer(customer.activeCustomer.id) } catch {}
  }
})
</script>

<style scoped>
.kiosk-main-layout { display: grid; grid-template-columns: 1fr clamp(280px, 35%, 400px); height: 100%; overflow: hidden; }
.content-col { display: flex; flex-direction: column; overflow: hidden; padding: clamp(1rem, 2vw, 1.5rem); gap: clamp(10px, 1.5vh, 16px); background: #F2F2F7; }
.page-header { display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
.page-title { font-size: clamp(18px, 2.5vw, 26px); font-weight: 800; margin: 0; letter-spacing: -0.02em; color: #111111; }
.points-chip {
  background: #111111; color: #FFFFFF;
  padding: 8px 18px; border-radius: 99px;
  font-size: clamp(12px, 1.3vw, 14px); font-weight: 700;
  box-shadow: 0 2px 8px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.10);
}
.tx-list { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; }

.tx-item {
  display: flex;
  align-items: center;
  gap: clamp(10px, 1.5vw, 16px);
  background: #FFFFFF;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 16px;
  padding: clamp(12px, 1.5vw, 16px);
  flex-shrink: 0;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9);
}
.tx-icon-wrap { width: clamp(42px, 5vw, 52px); height: clamp(42px, 5vw, 52px); border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.tx--earn { background: #F0FDF4; }
.tx--redeem { background: #EFF6FF; }
.tx--manual_adjust { background: #FFFBEB; }
.tx-icon { font-size: clamp(18px, 2.2vw, 24px); }
.tx-info { flex: 1; min-width: 0; }
.tx-desc { font-size: clamp(13px, 1.5vw, 15px); font-weight: 600; color: #111111; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tx-date { font-size: clamp(11px, 1.1vw, 12px); color: #A3A3A3; margin: 3px 0 0; }
.tx-pts { font-size: clamp(16px, 2vw, 20px); font-weight: 900; flex-shrink: 0; }
.pts--pos { color: #16A34A; }
.pts--neg { color: #DC2626; }

.empty-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 4rem 1rem; text-align: center; }
.empty-state span { font-size: 3rem; }
.empty-state p { font-size: 14px; color: #A3A3A3; margin: 0; }
.empty-hint { font-size: 12px; color: #D4D4D4; }

.ad-col { border-left: 1px solid rgba(0,0,0,0.06); background: #F2F2F7; padding: clamp(0.75rem, 1.5vw, 1.25rem); overflow-y: auto; }
</style>

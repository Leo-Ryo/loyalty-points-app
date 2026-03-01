<template>
  <div class="kiosk-main-layout">
    <div class="content-col">
      <div class="page-header">
        <h1 class="page-title">Redeem Rewards</h1>
        <div class="points-chip points-pulse">⭐ {{ customer.activeCustomer?.points?.toLocaleString() }} pts</div>
      </div>

      <div class="rewards-list">
        <div
          v-for="r in rewards" :key="r.id"
          class="reward-row"
          :class="{ 'reward--unlocked': canAfford(r), 'reward--locked': !canAfford(r) }"
          @click="canAfford(r) && openRedeem(r)"
        >
          <div class="reward-img-wrap">
            <img v-if="r.imageUrl" :src="`${baseUrl}/${r.imageUrl}`" :alt="r.rewardName" class="reward-img" />
            <div v-else class="reward-img-placeholder">{{ canAfford(r) ? '🎁' : '🔒' }}</div>
          </div>
          <div class="reward-info">
            <p class="reward-name">{{ r.rewardName }}</p>
            <p class="reward-desc">{{ r.rewardDescription || 'No description' }}</p>
          </div>
          <div class="reward-right">
            <div class="reward-pts">⭐ {{ r.pointsRequired?.toLocaleString() }}</div>
            <button v-if="canAfford(r)" class="redeem-btn" @click.stop="openRedeem(r)">Redeem</button>
            <div v-else class="need-pts">Need {{ (r.pointsRequired - (customer.activeCustomer?.points || 0)).toLocaleString() }} more</div>
          </div>
        </div>
        <div v-if="!rewards.length" class="empty-state">
          <span>🎁</span><p>No active rewards</p>
        </div>
      </div>
    </div>

    <div class="ad-col">
      <KioskAdPanel />
    </div>

    <!-- Confirm Modal -->
    <AppModal v-model="showConfirm" :title="`Redeem: ${selected?.rewardName}`">
      <div class="confirm-body">
        <p>You'll use <strong>{{ selected?.pointsRequired?.toLocaleString() }}</strong> points.</p>
        <p>Remaining: <strong>{{ ((customer.activeCustomer?.points || 0) - (selected?.pointsRequired || 0)).toLocaleString() }}</strong> pts</p>
      </div>
      <template #footer>
        <AppButton variant="secondary" @click="showConfirm = false">Cancel</AppButton>
        <AppButton variant="primary" :loading="redeeming" @click="redeem">Confirm Redeem</AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { rewardApi } from '@/api/reward.api'
import { transactionApi } from '@/api/transaction.api'
import { useCustomerStore } from '@/stores/customer.store'
import { useNotificationStore } from '@/stores/notification.store'
import KioskAdPanel from '@/components/kiosk/KioskAdPanel.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppButton from '@/components/ui/AppButton.vue'

const customer = useCustomerStore(); const notify = useNotificationStore()
const baseUrl = (import.meta as any).env.VITE_API_BASE_URL?.replace('/api','') || 'http://localhost:3000'
const rewards = ref<any[]>([]); const selected = ref<any>(null)
const showConfirm = ref(false); const redeeming = ref(false)

const canAfford = (r: any) => (customer.activeCustomer?.points || 0) >= r.pointsRequired
function openRedeem(r: any) { selected.value = r; showConfirm.value = true }

async function redeem() {
  if (!selected.value || !customer.activeCustomer) return
  redeeming.value = true
  try {
    await transactionApi.redeem({ customerId: customer.activeCustomer.id, rewardId: selected.value.id })
    customer.updatePoints((customer.activeCustomer.points || 0) - selected.value.pointsRequired)
    notify.success(`🎉 ${selected.value.rewardName} redeemed!`)
    showConfirm.value = false
  } catch (e: any) { notify.error(e.message) }
  finally { redeeming.value = false }
}
onMounted(async () => { try { rewards.value = await rewardApi.getAll() } catch {} })
</script>

<style scoped>
.kiosk-main-layout { display: grid; grid-template-columns: 1fr clamp(280px, 35%, 400px); height: 100%; overflow: hidden; }
.content-col { display: flex; flex-direction: column; overflow: hidden; padding: clamp(1rem, 2vw, 1.5rem); gap: clamp(10px, 1.5vh, 16px); background: #F2F2F7; }
.page-header { display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
.page-title { font-size: clamp(18px, 2.5vw, 26px); font-weight: 800; margin: 0; letter-spacing: -0.02em; color: #111111; }
.points-chip {
  background: #111111; color: #FFFFFF;
  padding: 8px 18px; border-radius: 99px;
  font-size: clamp(12px, 1.3vw, 14px); font-weight: 700; flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.10);
}
.rewards-list { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }

.reward-row {
  display: flex; align-items: center; gap: 14px;
  background: #FFFFFF; border-radius: 18px;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 1px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9);
  padding: clamp(10px, 1.5vw, 14px);
  transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease;
  flex-shrink: 0;
}
.reward--unlocked { cursor: pointer; }
.reward--unlocked:hover {
  transform: translateY(-4px) perspective(700px) rotateX(1.5deg);
  box-shadow: 0 12px 32px rgba(0,0,0,0.10);
}
.reward--locked { opacity: 0.5; cursor: not-allowed; }

.reward-img-wrap { width: clamp(56px, 7vw, 80px); height: clamp(56px, 7vw, 80px); border-radius: 14px; overflow: hidden; background: rgba(0,0,0,0.04); flex-shrink: 0; }
.reward-img { width: 100%; height: 100%; object-fit: cover; }
.reward-img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: clamp(1.6rem, 3vw, 2.2rem); }
.reward-info { flex: 1; min-width: 0; }
.reward-name { font-size: clamp(14px, 1.6vw, 17px); font-weight: 700; color: #111111; margin: 0 0 4px; }
.reward-desc { font-size: clamp(11px, 1.2vw, 13px); color: #525252; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.reward-right { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; flex-shrink: 0; }
.reward-pts { font-size: clamp(14px, 1.6vw, 17px); font-weight: 800; color: #111111; white-space: nowrap; }
.redeem-btn {
  padding: clamp(8px, 1.2vw, 12px) clamp(14px, 2vw, 20px);
  background: #111111; color: #FFFFFF;
  border: none; border-radius: 12px;
  font-family: inherit; font-size: clamp(12px, 1.3vw, 14px); font-weight: 700;
  cursor: pointer; white-space: nowrap;
  transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1), background 0.15s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.10);
}
.redeem-btn:hover { background: #1a1a1a; transform: translateY(-2px); }
.redeem-btn:active { transform: scale(0.95); }
.need-pts { font-size: 11px; color: #A3A3A3; text-align: right; white-space: nowrap; }

.empty-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 4rem 1rem; text-align: center; }
.empty-state span { font-size: 2.5rem; }
.empty-state p { font-size: 14px; color: #A3A3A3; margin: 0; }

.confirm-body { display: flex; flex-direction: column; gap: 10px; font-size: 14px; color: #525252; }
.ad-col { border-left: 1px solid rgba(0,0,0,0.06); background: #F2F2F7; padding: clamp(0.75rem, 1.5vw, 1.25rem); overflow-y: auto; }
</style>

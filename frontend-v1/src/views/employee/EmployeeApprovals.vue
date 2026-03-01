<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Pending Approvals</h1>
        <p class="page-sub">Kiosk trade requests waiting for your approval</p>
      </div>
      <button class="refresh-btn" @click="load">↻ Refresh</button>
    </div>

    <div v-if="loading" class="loading-state">Loading…</div>

    <div v-else-if="!pending.length" class="empty-state">
      <span>✅</span>
      <p>All clear — no pending approvals</p>
    </div>

    <div v-else class="approvals-list">
      <div v-for="tx in pending" :key="tx.id" class="approval-card card-3d">
        <div class="approval-header">
          <div class="approval-avatar">{{ tx.customer?.name?.[0]?.toUpperCase() }}</div>
          <div class="approval-info">
            <p class="approval-customer">{{ tx.customer?.name }}</p>
            <p class="approval-meta">{{ tx.customer?.phone || tx.customer?.email }}</p>
          </div>
          <div class="approval-time">{{ fmtTime(tx.createdAt) }}</div>
        </div>

        <div class="approval-body">
          <div class="reward-detail">
            <span class="reward-icon">{{ tx.inventory ? '🍾' : '🎁' }}</span>
            <div>
              <p class="reward-name">{{ tx.inventory?.name || tx.reward?.rewardName || 'Unknown Trade' }}</p>
              <p class="reward-cost">{{ Math.abs(tx.points) }} pts</p>
            </div>
          </div>
          <div class="customer-pts">
            Customer balance <strong>{{ tx.customer?.points?.toLocaleString() }} pts</strong>
          </div>
        </div>

        <div class="approval-actions">
          <button class="action-btn btn-reject" :disabled="processing === tx.id" @click="reject(tx)">
            <span v-if="processing === tx.id" class="spinner dark" />
            <span v-else>✕ Reject</span>
          </button>
          <button class="action-btn btn-approve" :disabled="processing === tx.id" @click="approve(tx)">
            <span v-if="processing === tx.id" class="spinner" />
            <span v-else>✓ Approve</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { employeeApi } from '@/api/employee.api'
import { useNotificationStore } from '@/stores/notification.store'

const notify = useNotificationStore()
const pending = ref<any[]>([])
const loading = ref(false)
const processing = ref<string | null>(null)
const fmtTime = (d: string) => new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

async function load() {
  loading.value = true
  try { pending.value = await employeeApi.getPending() } catch {}
  finally { loading.value = false }
}

async function approve(tx: any) {
  processing.value = tx.id
  try {
    await employeeApi.approve(tx.id)
    pending.value = pending.value.filter(t => t.id !== tx.id)
    notify.success(`Approved: ${tx.inventory?.name || tx.reward?.rewardName || 'Trade'}`)
  } catch (e: any) { notify.error(e.message) }
  finally { processing.value = null }
}

async function reject(tx: any) {
  processing.value = tx.id
  try {
    await employeeApi.reject(tx.id)
    pending.value = pending.value.filter(t => t.id !== tx.id)
    notify.success(`Rejected: ${tx.inventory?.name || tx.reward?.rewardName || 'Trade'}`)
  } catch (e: any) { notify.error(e.message) }
  finally { processing.value = null }
}

onMounted(load)
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 1.5rem; max-width: 680px; margin: 0 auto; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; }
.page-title { font-size: clamp(18px, 2.5vw, 24px); font-weight: 800; margin: 0; letter-spacing: -0.02em; color: #111111; }
.page-sub { font-size: 13px; color: #A3A3A3; margin: 4px 0 0; }
.refresh-btn {
  padding: 7px 16px; border: 1px solid rgba(0,0,0,0.10);
  border-radius: 10px; background: rgba(255,255,255,0.8);
  font-size: 13px; font-weight: 600; cursor: pointer;
  font-family: inherit;
  transition: all 0.18s ease;
  backdrop-filter: blur(8px);
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.refresh-btn:hover { background: #FFFFFF; box-shadow: 0 2px 8px rgba(0,0,0,0.10); }
.loading-state, .empty-state { text-align: center; padding: 3rem; color: #A3A3A3; }
.empty-state span { font-size: 3rem; display: block; margin-bottom: 0.75rem; }

.approvals-list { display: flex; flex-direction: column; gap: 12px; }
.approval-card {
  background: #FFFFFF;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
  transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease;
}
.approval-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.10), 0 3px 8px rgba(0,0,0,0.06);
}
.approval-header { display: flex; align-items: center; gap: 12px; padding: 16px; border-bottom: 1px solid rgba(0,0,0,0.04); background: rgba(0,0,0,0.01); }
.approval-avatar { width: 44px; height: 44px; border-radius: 50%; background: #111111; color: #FFF; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px; flex-shrink: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.20); }
.approval-info { flex: 1; }
.approval-customer { font-weight: 700; font-size: 15px; margin: 0; letter-spacing: -0.01em; }
.approval-meta { font-size: 12px; color: #A3A3A3; margin: 2px 0 0; }
.approval-time { font-size: 12px; color: #A3A3A3; white-space: nowrap; }
.approval-body { padding: 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.reward-detail { display: flex; align-items: center; gap: 12px; }
.reward-icon { font-size: 2rem; }
.reward-name { font-weight: 700; font-size: 15px; margin: 0; }
.reward-cost { font-size: 13px; color: #525252; margin: 2px 0 0; }
.customer-pts {
  font-size: 13px; color: #525252;
  background: rgba(0,0,0,0.04);
  padding: 6px 12px; border-radius: 10px;
}
.approval-actions { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid rgba(0,0,0,0.04); }
.action-btn {
  padding: 14px; border: none; font-family: inherit;
  font-size: 14px; font-weight: 700;
  cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
  transition: background 0.15s ease, transform 0.18s cubic-bezier(0.34,1.56,0.64,1);
}
.action-btn:active:not(:disabled) { transform: scale(0.97); }
.btn-reject { background: rgba(220,38,38,0.04); color: #DC2626; border-right: 1px solid rgba(0,0,0,0.04); }
.btn-reject:hover:not(:disabled) { background: #FEF2F2; }
.btn-approve { background: #111111; color: #FFFFFF; }
.btn-approve:hover:not(:disabled) { background: #1a1a1a; }
.action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #FFF; border-radius: 50%; animation: spin 0.65s linear infinite; }
.spinner.dark { border-color: rgba(220,38,38,0.2); border-top-color: #DC2626; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>

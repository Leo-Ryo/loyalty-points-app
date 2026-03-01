<template>
  <div class="page">
    <div class="page-header">
      <div><h1 class="page-title">Transactions</h1><p class="page-sub">{{ txs.length }} records</p></div>
      <div class="header-actions">
        <select v-model="filterType" class="select">
          <option value="">All types</option>
          <option value="earn">Earn</option>
          <option value="redeem">Redeem</option>
          <option value="manual_adjust">Manual Adjust</option>
        </select>
        <AppButton variant="secondary" @click="exportCsv">⬇ Export CSV</AppButton>
        <AppButton variant="primary" @click="showEarnModal = true">+ Earn Points</AppButton>
      </div>
    </div>

    <AppTable :columns="cols" :rows="txs">
      <template #customer="{ row }">{{ row.customer?.name || '—' }}</template>
      <template #type="{ row }">
        <AppBadge :variant="row.type === 'earn' ? 'success' : row.type === 'redeem' ? 'neutral' : 'warning'">{{ row.type }}</AppBadge>
      </template>
      <template #points="{ row }">
        <span :style="{ color: row.points > 0 ? '#16A34A' : '#DC2626', fontWeight: '600' }">
          {{ row.points > 0 ? '+' : '' }}{{ row.points }}
        </span>
      </template>
      <template #reward="{ row }">{{ row.reward?.rewardName || '—' }}</template>
      <template #createdAt="{ row }">{{ fmtDate(row.createdAt) }}</template>
    </AppTable>

    <!-- Earn Points Modal -->
    <AppModal v-model="showEarnModal" title="Award Points">
      <form class="form">
        <AppInput v-model="earnForm.customerId" label="Customer ID" placeholder="Paste customer ID" />
        <AppInput v-model="earnForm.points"     label="Points"      type="number" placeholder="100" />
        <AppInput v-model="earnForm.description" label="Note"       placeholder="In-store purchase" />
      </form>
      <template #footer>
        <AppButton variant="secondary" @click="showEarnModal = false">Cancel</AppButton>
        <AppButton variant="primary" :loading="saving" @click="earnPoints">Award</AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, reactive } from 'vue'
import { transactionApi } from '@/api/transaction.api'
import { useNotificationStore } from '@/stores/notification.store'
import AppTable from '@/components/ui/AppTable.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppInput from '@/components/ui/AppInput.vue'

const notify = useNotificationStore()
const txs = ref<any[]>([]); const filterType = ref(''); const saving = ref(false)
const showEarnModal = ref(false)
const earnForm = reactive({ customerId: '', points: '', description: '' })

const cols = [
  { key: 'customer', label: 'Customer' }, { key: 'type', label: 'Type' },
  { key: 'points', label: 'Points' }, { key: 'reward', label: 'Reward' },
  { key: 'description', label: 'Note' }, { key: 'createdAt', label: 'Date' },
]
const fmtDate = (d: string) => new Date(d).toLocaleDateString()

async function load() {
  try { txs.value = await transactionApi.getAll({ type: filterType.value || undefined }) } catch {}
}
watch(filterType, load)

async function earnPoints() {
  saving.value = true
  try {
    await transactionApi.earn({ customerId: earnForm.customerId, points: parseInt(earnForm.points), description: earnForm.description })
    notify.success('Points awarded'); showEarnModal.value = false; await load()
  } catch (e: any) { notify.error(e.message) }
  finally { saving.value = false }
}
async function exportCsv() {
  try {
    const blob = await transactionApi.exportCsv({ type: filterType.value || undefined })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'transactions.csv'; a.click()
    URL.revokeObjectURL(url)
  } catch (e: any) { notify.error(e.message) }
}
onMounted(load)
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: clamp(1rem, 2vh, 1.5rem); }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
.page-title { font-size: clamp(18px, 2.5vw, 26px); font-weight: 800; margin: 0; }
.page-sub { font-size: 13px; color: #525252; margin: 4px 0 0; }
.header-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.select { padding: 10px 14px; border: 1px solid #D4D4D4; border-radius: 10px; font-family: inherit; font-size: 13px; background: #FFFFFF; outline: none; cursor: pointer; }
.form { display: flex; flex-direction: column; gap: 1rem; }
</style>

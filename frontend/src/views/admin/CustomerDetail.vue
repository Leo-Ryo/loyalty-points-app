<template>
  <div class="page">
    <div class="page-header">
      <div class="back-link">
        <router-link to="/admin/customers" class="back-btn">← Back</router-link>
      </div>
      <h1 class="page-title">{{ customer?.name }}</h1>
      <AppBadge variant="dark">{{ customer?.points?.toLocaleString() }} pts</AppBadge>
    </div>

    <div class="detail-grid">
      <!-- Customer Info -->
      <AppCard>
        <h2 class="section-title">Customer Info</h2>
        <div class="info-rows">
          <div class="info-row"><span class="info-lbl">Email</span><span>{{ customer?.email || '—' }}</span></div>
          <div class="info-row"><span class="info-lbl">Phone</span><span>{{ customer?.phone || '—' }}</span></div>
          <div class="info-row"><span class="info-lbl">Points</span><strong>{{ customer?.points?.toLocaleString() }}</strong></div>
          <div class="info-row"><span class="info-lbl">Joined</span><span>{{ customer ? fmtDate(customer.createdAt) : '—' }}</span></div>
        </div>
        <div class="card-actions" style="position: relative; z-index: 50;">
          <button 
            type="button" 
            class="app-btn btn--primary btn--sm" 
            style="cursor: pointer; position: relative; z-index: 50;" 
            @click="openAdjust"
          >
            Adjust Points
          </button>
        </div>
      </AppCard>

      <!-- Transaction History -->
      <div class="tx-col">
        <h2 class="section-title">Transaction History</h2>
        <AppTable :columns="cols" :rows="txs">
          <template #type="{ row }">
            <AppBadge :variant="row.type === 'earn' ? 'success' : row.type === 'redeem' ? 'neutral' : 'warning'">{{ row.type }}</AppBadge>
          </template>
          <template #points="{ row }">
            <span :style="{ color: row.points > 0 ? '#16A34A' : '#DC2626', fontWeight: '600' }">
              {{ row.points > 0 ? '+' : '' }}{{ row.points }}
            </span>
          </template>
          <template #createdAt="{ row }">{{ fmtDate(row.createdAt) }}</template>
        </AppTable>
      </div>
    </div>

    <AppModal v-model="showAdjust" :title="`Adjust Points — ${customer?.name}`">
      <form @submit.prevent="adjustPoints" class="form">
        <AppInput v-model="adjustForm.points" label="Points (+/-)" type="number" placeholder="+100 or -50" />
        <AppInput v-model="adjustForm.description" label="Note" placeholder="Reason" />
      </form>
      <template #footer>
        <AppButton variant="secondary" @click="showAdjust = false">Cancel</AppButton>
        <AppButton variant="primary" :loading="saving" @click="adjustPoints">Apply</AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { customerApi } from '@/api/customer.api'
import { transactionApi } from '@/api/transaction.api'
import { useNotificationStore } from '@/stores/notification.store'
import AppCard from '@/components/ui/AppCard.vue'
import AppTable from '@/components/ui/AppTable.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppInput from '@/components/ui/AppInput.vue'

const route = useRoute(); const notify = useNotificationStore()
const customer = ref<any>(null); const txs = ref<any[]>([])
const showAdjust = ref(false); const saving = ref(false)
const adjustForm = reactive({ points: '', description: '' })
const id = route.params.id as string

const cols = [
  { key: 'type', label: 'Type' }, { key: 'points', label: 'Points' },
  { key: 'description', label: 'Note' }, { key: 'createdAt', label: 'Date' },
]
const fmtDate = (d: string) => new Date(d).toLocaleDateString()

async function load() {
  try {
    [customer.value, txs.value] = await Promise.all([customerApi.getById(id), transactionApi.getByCustomer(id)])
  } catch {}
}

function openAdjust() {
  notify.success('Button clicked! Opening modal...')
  adjustForm.points = ''
  adjustForm.description = ''
  showAdjust.value = true
}

async function adjustPoints() {
  saving.value = true
  try {
    await customerApi.adjustPoints(id, parseInt(adjustForm.points), adjustForm.description)
    notify.success('Points adjusted'); showAdjust.value = false; await load()
  } catch (e: any) { notify.error(e.message) }
  finally { saving.value = false }
}
onMounted(load)
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: clamp(1rem, 2vh, 1.5rem); }
.page-header { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
.back-btn { font-size: 13px; color: #525252; text-decoration: none; padding: 6px 12px; border: 1px solid #E5E5E5; border-radius: 8px; transition: all 0.15s ease; }
.back-btn:hover { background: #F5F5F5; }
.page-title { font-size: clamp(18px, 2.5vw, 26px); font-weight: 800; margin: 0; flex: 1; }
.detail-grid { display: grid; grid-template-columns: clamp(260px, 28%, 320px) 1fr; gap: clamp(1rem, 2vw, 1.5rem); align-items: start; }
@media (max-width: 800px) { .detail-grid { grid-template-columns: 1fr; } }
.section-title { font-size: 15px; font-weight: 700; margin: 0 0 1rem; }
.info-rows { display: flex; flex-direction: column; gap: 10px; margin-bottom: 1.5rem; }
.info-row { display: flex; justify-content: space-between; font-size: 14px; }
.info-lbl { color: #525252; font-weight: 500; }
.card-actions { display: flex; gap: 8px; }
.tx-col { display: flex; flex-direction: column; gap: 0.75rem; }
.form { display: flex; flex-direction: column; gap: 1rem; }
</style>

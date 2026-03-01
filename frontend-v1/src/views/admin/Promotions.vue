<template>
  <div class="page">
    <div class="page-header">
      <div><h1 class="page-title">Promotions</h1><p class="page-sub">Ad banners & campaigns</p></div>
      <AppButton variant="primary" @click="openCreate">+ Add Promotion</AppButton>
    </div>

    <div class="promos-grid">
      <div v-for="p in promos" :key="p.id" class="promo-card card-3d" :class="{ 'promo--inactive': !p.isActive }">
        <div class="promo-image-wrap">
          <img v-if="p.imageUrl" :src="`${baseUrl}/${p.imageUrl}`" :alt="p.title" class="promo-image" />
          <div v-else class="promo-placeholder">📢</div>
        </div>
        <div class="promo-body">
          <div class="promo-top">
            <p class="promo-title">{{ p.title }}</p>
            <AppBadge :variant="p.isActive ? 'success' : 'neutral'">{{ p.isActive ? 'Live' : 'Paused' }}</AppBadge>
          </div>
          <p class="promo-section" v-if="p.targetSection">Target: {{ p.targetSection }}</p>
          <p class="promo-dates" v-if="p.startDate || p.endDate">
            {{ p.startDate ? fmtDate(p.startDate) : 'Now' }} → {{ p.endDate ? fmtDate(p.endDate) : 'Ongoing' }}
          </p>
          <div class="promo-actions">
            <AppButton variant="ghost" size="sm" @click="openEdit(p)">Edit</AppButton>
            <AppButton variant="secondary" size="sm" @click="toggle(p)">{{ p.isActive ? 'Pause' : 'Go Live' }}</AppButton>
            <AppButton variant="danger" size="sm" @click="deletePromo(p.id)">Delete</AppButton>
          </div>
        </div>
      </div>
    </div>

    <AppModal v-model="showModal" :title="editing ? 'Edit Promotion' : 'New Promotion'">
      <form class="form">
        <AppInput v-model="form.title" label="Title" placeholder="Summer Wine Sale" />
        <div class="form-row">
          <AppInput v-model="form.startDate" label="Start Date" type="date" />
          <AppInput v-model="form.endDate"   label="End Date"   type="date" />
        </div>
        <div class="field">
          <label class="field-label">Target Section</label>
          <select v-model="form.targetSection" class="select">
            <option value="">All sections</option>
            <option value="dashboard">Dashboard</option>
            <option value="rewards">Rewards</option>
            <option value="global">Global</option>
          </select>
        </div>
      </form>
      <template #footer>
        <AppButton variant="secondary" @click="showModal = false">Cancel</AppButton>
        <AppButton variant="primary" :loading="saving" @click="savePromo">{{ editing ? 'Update' : 'Create' }}</AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { promotionApi } from '@/api/promotion.api'
import { useNotificationStore } from '@/stores/notification.store'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppInput from '@/components/ui/AppInput.vue'

const notify = useNotificationStore()
const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3000'
const promos = ref<any[]>([]); const showModal = ref(false); const saving = ref(false); const editing = ref<any>(null)
const form = reactive({ title: '', startDate: '', endDate: '', targetSection: '' })
const fmtDate = (d: string) => new Date(d).toLocaleDateString()
async function load() { try { promos.value = await promotionApi.getAll() } catch {} }
function openCreate() { editing.value = null; Object.assign(form, { title: '', startDate: '', endDate: '', targetSection: '' }); showModal.value = true }
function openEdit(p: any) { editing.value = p; Object.assign(form, { title: p.title, startDate: p.startDate?.split('T')[0] || '', endDate: p.endDate?.split('T')[0] || '', targetSection: p.targetSection || '' }); showModal.value = true }
async function savePromo() {
  saving.value = true
  try {
    const data = { ...form, startDate: form.startDate || undefined, endDate: form.endDate || undefined }
    if (editing.value) { await promotionApi.update(editing.value.id, data); notify.success('Updated') }
    else { await promotionApi.create(data); notify.success('Created') }
    showModal.value = false; await load()
  } catch (e: any) { notify.error(e.message) }
  finally { saving.value = false }
}
async function toggle(p: any) { try { await promotionApi.toggle(p.id); await load() } catch (e: any) { notify.error(e.message) } }
async function deletePromo(id: string) {
  if (!confirm('Delete this promotion?')) return
  try { await promotionApi.delete(id); notify.success('Deleted'); await load() } catch (e: any) { notify.error(e.message) }
}
onMounted(load)
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: clamp(1rem, 2vh, 1.5rem); }
.page-header { display: flex; align-items: center; justify-content: space-between; }
.page-title { font-size: clamp(18px, 2.5vw, 26px); font-weight: 800; margin: 0; }
.page-sub { font-size: 13px; color: #525252; margin: 4px 0 0; }
.promos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr)); gap: clamp(0.75rem, 1.5vw, 1.25rem); }
.promo-card { background: #FFFFFF; border: 1px solid #E5E5E5; border-radius: 16px; overflow: hidden; }
.promo--inactive { opacity: 0.6; }
.promo-image-wrap { aspect-ratio: 16/9; background: #F5F5F5; overflow: hidden; }
.promo-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s ease; }
.promo-card:hover .promo-image { transform: scale(1.05); }
.promo-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; }
.promo-body { padding: 12px; display: flex; flex-direction: column; gap: 6px; }
.promo-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
.promo-title { font-size: 14px; font-weight: 700; margin: 0; color: #111111; }
.promo-section, .promo-dates { font-size: 12px; color: #A3A3A3; margin: 0; }
.promo-actions { display: flex; gap: 4px; }
.form { display: flex; flex-direction: column; gap: 1rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 13px; font-weight: 500; }
.select { padding: 10px 14px; border: 1px solid #D4D4D4; border-radius: 10px; font-family: inherit; font-size: 14px; background: #FFFFFF; outline: none; }
.select:focus { border-color: #111111; }
</style>

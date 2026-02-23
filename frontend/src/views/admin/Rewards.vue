<template>
  <div class="page">
    <div class="page-header">
      <div><h1 class="page-title">Rewards</h1><p class="page-sub">{{ rewards.length }} total</p></div>
      <AppButton variant="primary" @click="openCreate">+ Add Reward</AppButton>
    </div>

    <!-- Rewards grid — auto-fill responsive -->
    <div class="rewards-grid">
      <div
        v-for="r in rewards" :key="r.id"
        class="reward-card card-3d"
        :class="{ 'reward--inactive': !r.isActive }"
      >
        <div class="reward-image-wrap">
          <img v-if="r.imageUrl" :src="`${baseUrl}/${r.imageUrl}`" :alt="r.rewardName" class="reward-image" />
          <div v-else class="reward-placeholder">🎁</div>
        </div>
        <div class="reward-body">
          <div class="reward-top">
            <p class="reward-name">{{ r.rewardName }}</p>
            <AppBadge :variant="r.isActive ? 'success' : 'neutral'">{{ r.isActive ? 'Active' : 'Inactive' }}</AppBadge>
          </div>
          <p class="reward-desc">{{ r.rewardDescription || 'No description' }}</p>
          <div class="reward-footer">
            <span class="reward-pts">⭐ {{ r.pointsRequired }} pts</span>
            <div class="reward-actions">
              <AppButton variant="ghost" size="sm" @click="openEdit(r)">Edit</AppButton>
              <AppButton variant="secondary" size="sm" @click="toggleReward(r)">{{ r.isActive ? 'Deactivate' : 'Activate' }}</AppButton>
              <AppButton variant="danger" size="sm" @click="deleteReward(r.id)">Delete</AppButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <AppModal v-model="showModal" :title="editing ? 'Edit Reward' : 'New Reward'">
      <form class="form" @submit.prevent="saveReward">
        <AppInput v-model="form.rewardName" label="Reward Name" placeholder="Free Wine Glass" />
        <AppInput v-model="form.rewardDescription" label="Description" placeholder="Description (optional)" />
        <AppInput v-model="form.pointsRequired" label="Points Required" type="number" placeholder="200" />
      </form>
      <template #footer>
        <AppButton variant="secondary" @click="showModal = false">Cancel</AppButton>
        <AppButton variant="primary" :loading="saving" @click="saveReward">{{ editing ? 'Update' : 'Create' }}</AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { rewardApi } from '@/api/reward.api'
import { useNotificationStore } from '@/stores/notification.store'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppInput from '@/components/ui/AppInput.vue'

const notify = useNotificationStore()
const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3000'
const rewards = ref<any[]>([])
const showModal = ref(false); const saving = ref(false); const editing = ref<any>(null)
const form = reactive({ rewardName: '', rewardDescription: '', pointsRequired: '' })

async function load() {
  try { rewards.value = await rewardApi.getAll(true) } catch {}
}
function openCreate() { editing.value = null; form.rewardName = ''; form.rewardDescription = ''; form.pointsRequired = ''; showModal.value = true }
function openEdit(r: any) { editing.value = r; form.rewardName = r.rewardName; form.rewardDescription = r.rewardDescription || ''; form.pointsRequired = r.pointsRequired; showModal.value = true }

async function saveReward() {
  saving.value = true
  try {
    const data = { ...form, pointsRequired: parseInt(form.pointsRequired as any) }
    if (editing.value) { await rewardApi.update(editing.value.id, data); notify.success('Reward updated') }
    else { await rewardApi.create(data); notify.success('Reward created') }
    showModal.value = false; await load()
  } catch (e: any) { notify.error(e.message) }
  finally { saving.value = false }
}
async function toggleReward(r: any) {
  try { await rewardApi.toggle(r.id); await load() } catch (e: any) { notify.error(e.message) }
}
async function deleteReward(id: string) {
  if (!confirm('Delete this reward?')) return
  try { await rewardApi.delete(id); notify.success('Deleted'); await load() }
  catch (e: any) { notify.error(e.message) }
}
onMounted(load)
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: clamp(1rem, 2vh, 1.5rem); }
.page-header { display: flex; align-items: center; justify-content: space-between; }
.page-title { font-size: clamp(18px, 2.5vw, 26px); font-weight: 800; margin: 0; color: #111111; }
.page-sub { font-size: 13px; color: #525252; margin: 4px 0 0; }
.rewards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(260px, 100%), 1fr));
  gap: clamp(0.75rem, 1.5vw, 1.25rem);
}
.reward-card {
  background: #FFFFFF;
  border: 1px solid #E5E5E5;
  border-radius: 16px;
  overflow: hidden;
}
.reward--inactive { opacity: 0.6; }
.reward-image-wrap { aspect-ratio: 16/9; overflow: hidden; background: #F5F5F5; }
.reward-image { width: 100%; height: 100%; object-fit: cover; }
.reward-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; }
.reward-body { padding: clamp(10px, 1.5vw, 14px); display: flex; flex-direction: column; gap: 6px; }
.reward-top  { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
.reward-name { font-size: clamp(13px, 1.3vw, 15px); font-weight: 700; color: #111111; margin: 0; }
.reward-desc { font-size: 12px; color: #525252; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.reward-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px; }
.reward-pts  { font-size: 13px; font-weight: 700; color: #111111; }
.reward-actions { display: flex; gap: 4px; }
.form { display: flex; flex-direction: column; gap: 1rem; }
</style>

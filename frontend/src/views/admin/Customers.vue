<template>
  <div class="page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Customers</h1>
        <p class="page-sub">{{ customers.length }} total</p>
      </div>
      <div class="header-actions">
        <AppInput v-model="search" placeholder="Search by name, phone, email…" style="width: clamp(200px, 25vw, 320px)" />
        <AppButton variant="primary" @click="showCreate = true">+ Add Customer</AppButton>
      </div>
    </div>

    <!-- Table -->
    <AppTable :columns="cols" :rows="filtered">
      <template #points="{ row }"><strong>{{ row.points?.toLocaleString() }}</strong></template>
      <template #phone="{ row }">{{ row.phone || '—' }}</template>
      <template #email="{ row }">{{ row.email || '—' }}</template>
      <template #createdAt="{ row }">{{ fmtDate(row.createdAt) }}</template>
      <template #actions="{ row }">
        <div class="row-actions">
          <router-link :to="`/admin/customers/${row.id}`">
            <AppButton variant="ghost" size="sm">View</AppButton>
          </router-link>
          <AppButton variant="ghost" size="sm" @click="startAdjust(row)">Points</AppButton>
          <AppButton variant="danger" size="sm" @click="confirmDelete(row)">Delete</AppButton>
        </div>
      </template>
    </AppTable>

    <!-- Create Customer Modal -->
    <AppModal v-model="showCreate" title="New Customer">
      <form @submit.prevent="createCustomer" class="form">
        <AppInput v-model="form.name"  label="Full Name"    placeholder="Jane Doe" :error="formErrors.name" />
        <AppInput v-model="form.phone" label="Phone"        placeholder="0801234567" />
        <AppInput v-model="form.email" label="Email"        type="email" placeholder="jane@email.com" />
      </form>
      <template #footer>
        <AppButton variant="secondary" @click="showCreate = false">Cancel</AppButton>
        <AppButton variant="primary" :loading="saving" @click="createCustomer">Create</AppButton>
      </template>
    </AppModal>

    <!-- Adjust Points Modal -->
    <AppModal v-model="showAdjust" :title="`Adjust Points — ${selected?.name}`">
      <form @submit.prevent="adjustPoints" class="form">
        <AppInput v-model="adjustForm.points" label="Points (+/-)" type="number" placeholder="+100 or -50" />
        <AppInput v-model="adjustForm.description" label="Note" placeholder="Reason for adjustment" />
      </form>
      <template #footer>
        <AppButton variant="secondary" @click="showAdjust = false">Cancel</AppButton>
        <AppButton variant="primary" :loading="saving" @click="adjustPoints">Apply</AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { customerApi } from '@/api/customer.api'
import { useNotificationStore } from '@/stores/notification.store'
import AppTable from '@/components/ui/AppTable.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppModal from '@/components/ui/AppModal.vue'

const notify = useNotificationStore()
const customers = ref<any[]>([])
const search = ref(''); const saving = ref(false)
const showCreate = ref(false); const showAdjust = ref(false)
const selected = ref<any>(null)
const form = reactive({ name: '', phone: '', email: '' })
const formErrors = reactive({ name: '' })
const adjustForm = reactive({ points: '', description: '' })

const cols = [
  { key: 'name', label: 'Name' }, { key: 'phone', label: 'Phone' },
  { key: 'email', label: 'Email' }, { key: 'points', label: 'Points' },
  { key: 'createdAt', label: 'Joined' },
]
const fmtDate = (d: string) => new Date(d).toLocaleDateString()
const filtered = computed(() =>
  search.value ? customers.value.filter(c =>
    [c.name, c.phone, c.email].some(v => v?.toLowerCase().includes(search.value.toLowerCase()))
  ) : customers.value
)

async function load() {
  try { customers.value = await customerApi.getAll() } catch {}
}
async function createCustomer() {
  if (!form.name) { formErrors.name = 'Name is required'; return }
  saving.value = true
  try {
    await customerApi.create({ ...form })
    notify.success('Customer created'); showCreate.value = false
    form.name = ''; form.phone = ''; form.email = ''
    await load()
  } catch (e: any) { notify.error(e.message) }
  finally { saving.value = false }
}
function startAdjust(row: any) { selected.value = row; adjustForm.points = ''; adjustForm.description = ''; showAdjust.value = true }
async function adjustPoints() {
  saving.value = true
  try {
    await customerApi.adjustPoints(selected.value.id, parseInt(adjustForm.points), adjustForm.description)
    notify.success('Points adjusted'); showAdjust.value = false; await load()
  } catch (e: any) { notify.error(e.message) }
  finally { saving.value = false }
}
async function confirmDelete(row: any) {
  if (!confirm(`Delete ${row.name}?`)) return
  try { await customerApi.delete(row.id); notify.success('Deleted'); await load() }
  catch (e: any) { notify.error(e.message) }
}
onMounted(load)
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: clamp(1rem, 2vh, 1.5rem); }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
.page-title { font-size: clamp(18px, 2.5vw, 26px); font-weight: 800; margin: 0; color: #111111; }
.page-sub { font-size: 13px; color: #525252; margin: 4px 0 0; }
.header-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.row-actions { display: flex; gap: 6px; }
.form { display: flex; flex-direction: column; gap: 1rem; }
</style>

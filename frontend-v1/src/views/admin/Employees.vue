<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Employees</h1>
        <p class="page-sub">{{ employees.length }} staff registered</p>
      </div>
      <AppButton variant="primary" @click="openCreate">+ Add Employee</AppButton>
    </div>

    <div class="emp-list">
      <div v-for="e in employees" :key="e.id" class="emp-row card-3d">
        <div class="emp-avatar">{{ e.name[0].toUpperCase() }}</div>
        <div class="emp-info">
          <p class="emp-name">{{ e.name }}</p>
          <p class="emp-meta">{{ e.phone }}</p>
        </div>
        <AppBadge :variant="e.isActive ? 'success' : 'neutral'">{{ e.isActive ? 'Active' : 'Inactive' }}</AppBadge>
        <div class="emp-actions">
          <AppButton variant="ghost" size="sm" @click="openEdit(e)">Edit</AppButton>
          <AppButton variant="ghost" size="sm" @click="resetPin(e)">Reset PIN</AppButton>
          <AppButton variant="danger" size="sm" @click="toggleActive(e)">{{ e.isActive ? 'Deactivate' : 'Activate' }}</AppButton>
        </div>
      </div>
      <div v-if="!employees.length" class="empty-state">
        <span>👷</span><p>No employees yet — add one to get started</p>
      </div>
    </div>

    <AppModal v-model="showModal" :title="editing ? 'Edit Employee' : 'Add Employee'">
      <form class="form" @submit.prevent="save">
        <AppInput v-model="form.name"  label="Full Name"     placeholder="Jane Smith" :error="errors.name" />
        <AppInput v-model="form.phone" label="Phone Number"  placeholder="0801234567" :error="errors.phone" />
        <AppInput v-if="!editing" v-model="form.pin" label="Starting PIN (default: 1234)" placeholder="1234" type="text" inputmode="numeric" maxlength="8" />
      </form>
      <template #footer>
        <AppButton variant="secondary" @click="showModal = false">Cancel</AppButton>
        <AppButton variant="primary" :loading="saving" @click="save">{{ editing ? 'Update' : 'Create' }}</AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { employeeApi } from '@/api/employee.api'
import { useNotificationStore } from '@/stores/notification.store'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppInput from '@/components/ui/AppInput.vue'

const notify = useNotificationStore()
const employees = ref<any[]>([])
const showModal = ref(false); const saving = ref(false); const editing = ref<any>(null)
const form = reactive({ name: '', phone: '', pin: '' })
const errors = reactive({ name: '', phone: '' })

async function load() { try { employees.value = await employeeApi.getAll() } catch {} }

function openCreate() {
  editing.value = null; Object.assign(form, { name: '', phone: '', pin: '' })
  errors.name = ''; errors.phone = ''; showModal.value = true
}
function openEdit(e: any) {
  editing.value = e; Object.assign(form, { name: e.name, phone: e.phone, pin: '' })
  errors.name = ''; errors.phone = ''; showModal.value = true
}

async function save() {
  errors.name = ''; errors.phone = ''
  if (!form.name) { errors.name = 'Required'; return }
  if (!form.phone) { errors.phone = 'Required'; return }
  saving.value = true
  try {
    if (editing.value) {
      await employeeApi.update(editing.value.id, { name: form.name, phone: form.phone })
      notify.success('Updated')
    } else {
      await employeeApi.create({ name: form.name, phone: form.phone, pin: form.pin || undefined })
      notify.success('Employee created — default PIN: ' + (form.pin || '1234'))
    }
    showModal.value = false; await load()
  } catch (e: any) { notify.error(e.message) }
  finally { saving.value = false }
}

async function resetPin(e: any) {
  if (!confirm(`Reset PIN for ${e.name} to 1234?`)) return
  try { await employeeApi.resetPin(e.id); notify.success(`${e.name}'s PIN reset to 1234`) }
  catch (err: any) { notify.error(err.message) }
}

async function toggleActive(e: any) {
  try { await employeeApi.update(e.id, { isActive: !e.isActive }); await load(); notify.success('Updated') }
  catch (err: any) { notify.error(err.message) }
}

onMounted(load)
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: 1.5rem; }
.page-header { display: flex; align-items: center; justify-content: space-between; }
.page-title { font-size: clamp(18px, 2.5vw, 26px); font-weight: 800; margin: 0; }
.page-sub { font-size: 13px; color: #525252; margin: 4px 0 0; }
.emp-list { display: flex; flex-direction: column; gap: 10px; }
.emp-row { display: flex; align-items: center; gap: 14px; background: #FFFFFF; border: 1px solid #E5E5E5; border-radius: 14px; padding: 14px 16px; }
.emp-avatar { width: 44px; height: 44px; border-radius: 50%; background: #111111; color: #FFF; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px; flex-shrink: 0; }
.emp-info { flex: 1; }
.emp-name { font-weight: 700; font-size: 15px; margin: 0; }
.emp-meta { font-size: 12px; color: #525252; margin: 2px 0 0; }
.emp-actions { display: flex; gap: 6px; }
.empty-state { text-align: center; padding: 3rem; color: #A3A3A3; }
.empty-state span { font-size: 3rem; display: block; margin-bottom: 0.75rem; }
.form { display: flex; flex-direction: column; gap: 1rem; }
</style>

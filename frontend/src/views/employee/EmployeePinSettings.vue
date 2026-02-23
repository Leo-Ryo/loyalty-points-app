<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">My PIN</h1>
        <p class="page-sub">Change your login PIN</p>
      </div>
    </div>
    <div class="pin-card">
      <p class="emp-info">Logged in as <strong>{{ emp.employee?.name }}</strong> — {{ emp.employee?.phone }}</p>
      <div class="form">
        <label class="field-label">Current PIN
          <div class="pin-input-row">
            <input v-model="currentPin" type="password" inputmode="numeric" maxlength="8" placeholder="••••" class="pin-input" />
          </div>
        </label>
        <label class="field-label">New PIN (4–8 digits)
          <div class="pin-input-row">
            <input v-model="newPin" type="password" inputmode="numeric" maxlength="8" placeholder="••••" class="pin-input" />
          </div>
        </label>
        <label class="field-label">Confirm New PIN
          <div class="pin-input-row">
            <input v-model="confirmPin" type="password" inputmode="numeric" maxlength="8" placeholder="••••" class="pin-input" />
          </div>
        </label>
        <p v-if="error" class="form-error">{{ error }}</p>
        <p v-if="success" class="form-success">{{ success }}</p>
        <button class="save-btn" :disabled="saving" @click="changePin">
          <span v-if="saving" class="spinner" />
          <span v-else>Update PIN</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { employeeApi } from '@/api/employee.api'
import { useEmployeeStore } from '@/stores/employee.store'

const emp = useEmployeeStore()
const currentPin = ref(''); const newPin = ref(''); const confirmPin = ref('')
const saving = ref(false); const error = ref(''); const success = ref('')

async function changePin() {
  error.value = ''; success.value = ''
  if (!/^\d{4,8}$/.test(newPin.value)) { error.value = 'New PIN must be 4–8 digits'; return }
  if (newPin.value !== confirmPin.value) { error.value = 'PINs do not match'; return }
  saving.value = true
  try {
    await employeeApi.changePin(emp.employee.id, { currentPin: currentPin.value, newPin: newPin.value })
    success.value = 'PIN updated successfully!'
    currentPin.value = ''; newPin.value = ''; confirmPin.value = ''
  } catch (e: any) { error.value = e.message || 'Failed to update PIN' }
  finally { saving.value = false }
}
</script>

<style scoped>
.page { max-width: 480px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }
.page-header { }
.page-title { font-size: clamp(18px, 2.5vw, 24px); font-weight: 800; margin: 0; }
.page-sub { font-size: 13px; color: #525252; margin: 4px 0 0; }
.pin-card { background: #FFFFFF; border: 1px solid #E5E5E5; border-radius: 20px; padding: 1.5rem; }
.emp-info { font-size: 13px; color: #525252; margin: 0 0 1.5rem; background: #F5F5F5; padding: 10px 14px; border-radius: 10px; }
.form { display: flex; flex-direction: column; gap: 1rem; }
.field-label { font-size: 13px; font-weight: 600; color: #374151; display: flex; flex-direction: column; gap: 6px; }
.pin-input-row { }
.pin-input { width: 100%; padding: 12px 16px; border: 2px solid #E5E5E5; border-radius: 12px; font-size: 18px; font-family: inherit; outline: none; letter-spacing: 0.2em; transition: border-color 0.15s; box-sizing: border-box; }
.pin-input:focus { border-color: #111111; }
.form-error { font-size: 13px; color: #DC2626; background: #FEF2F2; padding: 8px 12px; border-radius: 8px; margin: 0; }
.form-success { font-size: 13px; color: #16A34A; background: #F0FDF4; padding: 8px 12px; border-radius: 8px; margin: 0; }
.save-btn { padding: 14px; border-radius: 12px; border: none; background: #111111; color: #FFFFFF; font-family: inherit; font-size: 15px; font-weight: 700; cursor: pointer; transition: background 0.15s; display: flex; align-items: center; justify-content: center; gap: 8px; }
.save-btn:hover:not(:disabled) { background: #333; }
.save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #FFF; border-radius: 50%; animation: spin 0.6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>

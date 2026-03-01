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
.page-title { font-size: clamp(18px, 2.5vw, 24px); font-weight: 800; margin: 0; letter-spacing: -0.02em; color: #111111; }
.page-sub { font-size: 13px; color: #A3A3A3; margin: 4px 0 0; }
.pin-card {
  background: #FFFFFF;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9);
}
.emp-info {
  font-size: 13px; color: #525252; margin: 0 0 1.5rem;
  background: rgba(0,0,0,0.04); padding: 10px 14px; border-radius: 10px;
}
.form { display: flex; flex-direction: column; gap: 1rem; }
.field-label {
  font-size: 11px;
  font-weight: 600;
  color: #525252;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex; flex-direction: column; gap: 6px;
}
.pin-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid rgba(0,0,0,0.12);
  border-radius: 12px;
  font-size: 18px;
  font-family: inherit;
  outline: none;
  letter-spacing: 0.2em;
  background: #FFFFFF;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
  box-sizing: border-box;
}
.pin-input:focus { border-color: #111111; box-shadow: 0 0 0 4px rgba(17,17,17,0.07); }
.form-error { font-size: 13px; color: #DC2626; background: #FEF2F2; padding: 8px 12px; border-radius: 10px; margin: 0; border: 1px solid rgba(220,38,38,0.15); }
.form-success { font-size: 13px; color: #16A34A; background: #F0FDF4; padding: 8px 12px; border-radius: 10px; margin: 0; border: 1px solid rgba(22,163,74,0.15); }
.save-btn {
  padding: 14px; border-radius: 14px; border: none;
  background: #111111; color: #FFFFFF; font-family: inherit;
  font-size: 15px; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.10);
  transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1), background 0.15s ease;
}
.save-btn:hover:not(:disabled) { background: #1a1a1a; transform: translateY(-2px); }
.save-btn:active:not(:disabled) { transform: scale(0.97); }
.save-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #FFF; border-radius: 50%; animation: spin 0.65s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>

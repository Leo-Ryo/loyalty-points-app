<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <span class="brand-icon">🍷</span>
        <h1 class="login-title">Staff Login</h1>
        <p class="login-sub">Enter your phone number and PIN to continue</p>
      </div>

      <!-- Phone input — native input, not AppInput to keep focus management clean -->
      <div class="phone-field">
        <label class="field-label">Phone Number</label>
        <input
          v-model="phone"
          type="tel"
          placeholder="0801234567"
          class="phone-input"
          :class="{ 'input--error': errors.phone }"
          @keydown.enter.prevent="login"
        />
        <p v-if="errors.phone" class="field-error">{{ errors.phone }}</p>
      </div>

      <!-- PIN numpad -->
      <div class="pin-section">
        <label class="pin-label">4–8 Digit PIN</label>
        <div class="pin-display">
          <span v-for="(_, i) in 8" :key="i" class="pin-dot" :class="{ filled: pin.length > i }" />
        </div>
        <div class="numpad">
          <button
            v-for="key in numpadKeys"
            :key="key"
            type="button"
            class="numpad-key"
            :class="{ 'key--action': key === 'C' || key === '⌫' }"
            @mousedown.prevent="handleKey(key)"
            @touchstart.prevent="handleKey(key)"
          >{{ key }}</button>
        </div>
      </div>

      <p v-if="errors.general" class="login-error">{{ errors.general }}</p>
      <button type="button" class="login-btn" :disabled="loading" @click="login">
        <span v-if="loading" class="spinner" />
        <span v-else>Sign In →</span>
      </button>
      <div class="back-link-wrap">
        <router-link to="/" class="back-link">← Back to main screen</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { employeeApi } from '@/api/employee.api'
import { useEmployeeStore } from '@/stores/employee.store'

const router = useRouter()
const emp = useEmployeeStore()
const phone = ref('')
const pin = ref('')
const loading = ref(false)
const errors = reactive({ phone: '', general: '' })
const numpadKeys = ['1','2','3','4','5','6','7','8','9','C','0','⌫']

// Use mousedown.prevent + touchstart.prevent so we handle the event BEFORE
// the phone input loses / gains focus, ensuring PIN buttons always register.
function handleKey(key: string) {
  errors.general = ''
  if (key === 'C')  { pin.value = ''; return }
  if (key === '⌫') { pin.value = pin.value.slice(0, -1); return }
  if (pin.value.length < 8) pin.value += key
}

async function login() {
  errors.phone = ''; errors.general = ''
  if (!phone.value.trim()) { errors.phone = 'Phone number is required'; return }
  if (pin.value.length < 4) { errors.general = 'PIN must be at least 4 digits'; return }
  loading.value = true
  try {
    const data = await employeeApi.login(phone.value.trim(), pin.value)
    emp.setEmployee(data)
    router.push('/employee/lookup')
  } catch (e: any) {
    errors.general = e.message || 'Invalid phone or PIN'
    pin.value = ''   // clear PIN on failure so they can retry
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a0a0a 0%, #1e1e1e 100%);
  padding: 2rem;
}
.login-card {
  background: #FFFFFF;
  border-radius: 28px;
  padding: clamp(1.75rem, 5vw, 3rem);
  width: 100%;
  max-width: 380px;
  box-shadow: 0 24px 72px rgba(0,0,0,0.35);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.login-header { text-align: center; }
.brand-icon    { font-size: 2.5rem; display: block; margin-bottom: 0.5rem; }
.login-title   { font-size: 22px; font-weight: 800; margin: 0 0 4px; color: #111111; }
.login-sub     { font-size: 13px; color: #525252; margin: 0; }

.phone-field { display: flex; flex-direction: column; gap: 5px; }
.field-label { font-size: 13px; font-weight: 600; color: #374151; }
.phone-input {
  width: 100%;
  padding: 11px 14px;
  border: 2px solid #E5E5E5;
  border-radius: 12px;
  font-size: 16px;
  font-family: inherit;
  outline: none;
  color: #111111;
  transition: border-color 0.15s;
  box-sizing: border-box;
}
.phone-input:focus { border-color: #111111; }
.input--error { border-color: #DC2626 !important; }
.field-error { font-size: 12px; color: #DC2626; margin: 0; }

.pin-section { display: flex; flex-direction: column; gap: 10px; }
.pin-label   { font-size: 13px; font-weight: 600; color: #374151; }
.pin-display { display: flex; gap: 8px; justify-content: center; padding: 4px 0; }
.pin-dot {
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid #D4D4D4; background: transparent;
  transition: all 0.15s;
}
.pin-dot.filled { background: #111111; border-color: #111111; }

.numpad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.numpad-key {
  aspect-ratio: 1;
  border-radius: 14px;
  border: none;
  background: #111111;
  color: #FFFFFF;
  font-size: 22px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  transition: transform 0.08s, background 0.1s;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
.numpad-key:active { transform: scale(0.9); background: #333; }
.key--action { background: #F0F0F0; color: #111111; }
.key--action:active { background: #E0E0E0; }

.login-error {
  font-size: 13px; color: #DC2626; background: #FEF2F2;
  padding: 8px 12px; border-radius: 10px; text-align: center; margin: 0;
}
.login-btn {
  width: 100%; padding: 14px; border-radius: 14px; border: none;
  background: #111111; color: #FFFFFF; font-family: inherit;
  font-size: 15px; font-weight: 700; cursor: pointer;
  transition: background 0.15s; display: flex; align-items: center;
  justify-content: center; gap: 8px;
}
.login-btn:hover:not(:disabled) { background: #333; }
.login-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.spinner {
  width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #FFF; border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.back-link-wrap { text-align: center; }
.back-link { font-size: 12px; color: #A3A3A3; text-decoration: none; }
.back-link:hover { color: #525252; }
</style>

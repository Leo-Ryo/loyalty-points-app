<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <span class="brand-icon">🍷</span>
        <h1 class="login-title">Staff Login</h1>
        <p class="login-sub">Enter your phone number and PIN to continue</p>
      </div>

      <!-- Phone input -->
      <div class="phone-field">
        <label class="field-label">Phone Number</label>
        <div class="phone-input-wrap" :class="{ 'wrap--error': errors.phone }">
          <input
            v-model="phone"
            type="tel"
            placeholder="0801234567"
            class="phone-input"
            @keydown.enter.prevent="login"
          />
        </div>
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
    pin.value = ''
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
  /* same Apple dark bg as Landing */
  background:
    radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.03) 0%, transparent 60%),
    linear-gradient(160deg, #0a0a0a 0%, #141414 50%, #0f0f0f 100%);
  padding: 2rem;
}

.login-card {
  background: #FFFFFF;
  border-radius: 28px;
  padding: clamp(1.75rem, 5vw, 3rem);
  width: 100%;
  max-width: 380px;
  box-shadow:
    0 24px 72px rgba(0,0,0,0.40),
    0 8px 24px rgba(0,0,0,0.20),
    inset 0 1px 0 rgba(255,255,255,0.9);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.login-header { text-align: center; }
.brand-icon   { font-size: 2.5rem; display: block; margin-bottom: 0.5rem; }
.login-title  { font-size: 22px; font-weight: 800; margin: 0 0 4px; color: #111111; letter-spacing: -0.02em; }
.login-sub    { font-size: 13px; color: #A3A3A3; margin: 0; }

.phone-field { display: flex; flex-direction: column; gap: 6px; }
.field-label {
  font-size: 11px;
  font-weight: 600;
  color: #525252;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.phone-input-wrap {
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.12);
  background: #FFFFFF;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
  overflow: hidden;
}
.phone-input-wrap:focus-within {
  border-color: #111111;
  box-shadow: 0 0 0 4px rgba(17,17,17,0.07), inset 0 1px 2px rgba(0,0,0,0.04);
}
.wrap--error { border-color: #DC2626; }
.phone-input {
  width: 100%;
  padding: 10px 14px;
  border: none;
  outline: none;
  font-size: 16px;
  font-family: inherit;
  color: #111111;
  background: transparent;
  display: block;
}
.phone-input::placeholder { color: #A3A3A3; }
.field-error { font-size: 12px; color: #DC2626; margin: 0; }

/* PIN display */
.pin-section { display: flex; flex-direction: column; gap: 10px; }
.pin-label   {
  font-size: 11px;
  font-weight: 600;
  color: #525252;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.pin-display { display: flex; gap: 8px; justify-content: center; padding: 4px 0; }
.pin-dot {
  width: 14px; height: 14px; border-radius: 50%;
  border: 1.5px solid rgba(0,0,0,0.15);
  background: transparent;
  transition: all 0.15s cubic-bezier(0.34,1.56,0.64,1);
}
.pin-dot.filled { background: #111111; border-color: #111111; transform: scale(1.1); }

/* Numpad */
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
  transition: transform 0.10s cubic-bezier(0.34,1.56,0.64,1), background 0.12s ease;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  box-shadow: 0 2px 6px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.10);
}
.numpad-key:active { transform: scale(0.90); background: #2a2a2a; }
.key--action { background: rgba(0,0,0,0.06); color: #111111; box-shadow: none; }
.key--action:active { background: rgba(0,0,0,0.12); }

.login-error {
  font-size: 13px; color: #DC2626;
  background: #FEF2F2; padding: 8px 12px;
  border-radius: 10px; text-align: center; margin: 0;
  border: 1px solid rgba(220,38,38,0.15);
}

.login-btn {
  width: 100%; padding: 14px; border-radius: 14px; border: none;
  background: #111111; color: #FFFFFF; font-family: inherit;
  font-size: 15px; font-weight: 700; cursor: pointer;
  transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1), background 0.15s ease;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.10);
}
.login-btn:hover:not(:disabled) { background: #1a1a1a; transform: translateY(-2px); }
.login-btn:active:not(:disabled) { transform: scale(0.97); }
.login-btn:disabled { opacity: 0.45; cursor: not-allowed; }

.spinner {
  width: 18px; height: 18px;
  border: 2px solid rgba(255,255,255,0.25);
  border-top-color: #FFF; border-radius: 50%;
  animation: spin 0.65s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.back-link-wrap { text-align: center; }
.back-link { font-size: 12px; color: #A3A3A3; text-decoration: none; transition: color 0.15s; }
.back-link:hover { color: #525252; }
</style>

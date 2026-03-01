<template>
  <div class="numpad-modal">
    <div class="modal-header">
      <h2 class="modal-title">Enter Your Phone Number</h2>
      <p class="modal-sub">to check in and trade your points</p>
    </div>

    <!-- Mode tabs -->
    <div class="mode-tabs">
      <button class="mode-tab" :class="{ active: mode === 'phone' }" @click="switchMode('phone')">
        <img src="@/assets/Outline Icons/Mobile.png" class="tab-icon" alt="" /> Phone
      </button>
      <button class="mode-tab" :class="{ active: mode === 'email' }" @click="switchMode('email')">
        <img src="@/assets/Outline Icons/At sign.png" class="tab-icon" alt="" /> Email
      </button>
    </div>

    <!-- Display -->
    <div class="input-display" :class="{ focused: displayValue }">
      <span v-if="mode === 'phone'" class="country-code">+1</span>
      <span class="display-value" :class="{ placeholder: !displayValue }">
        {{ displayValue || (mode === 'phone' ? '000-000-0000' : 'tap or use keyboard…') }}
      </span>
      <button v-if="displayValue" class="clear-btn" @click="clearAll">✕</button>
    </div>

    <!-- Error -->
    <p v-if="error" class="lookup-error">{{ error }}</p>

    <!-- Phone numpad -->
    <div v-if="mode === 'phone'" class="numpad">
      <button
        v-for="key in numpadKeys" :key="key"
        class="numpad-key"
        :class="{ 'key--action': key === 'C' || key === '⌫' }"
        @mousedown.prevent="handleKey(key)"
        @touchstart.prevent="handleKey(key)"
      >
        <span class="key-main">{{ key }}</span>
        <span v-if="numpadLabels[key]" class="key-sub">{{ numpadLabels[key] }}</span>
      </button>
    </div>

    <!-- Email input -->
    <div v-else class="email-wrap">
      <input
        v-model="emailValue"
        type="email"
        placeholder="customer@email.com"
        class="email-input"
        @keyup.enter="lookup"
      />
    </div>

    <!-- Actions -->
    <div class="action-row">
      <button class="action-btn action-btn--secondary" @click="goSignup">✚ New Customer</button>
      <button class="action-btn action-btn--primary" :disabled="loading" @click="lookup">
        <span v-if="loading" class="spinner" />
        <span v-else>🔍</span> Find Me
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '@/api/auth.api'
import { useCustomerStore } from '@/stores/customer.store'

const emit = defineEmits<{ success: []; close: [] }>()
const router = useRouter()
const customer = useCustomerStore()

const mode = ref<'phone' | 'email'>('phone')
const digits = ref('')
const emailValue = ref('')
const loading = ref(false)
const error = ref('')

const numpadKeys = ['1','2','3','4','5','6','7','8','9','C','0','⌫']
const numpadLabels: Record<string, string> = {
  '2':'ABC','3':'DEF','4':'GHI','5':'JKL','6':'MNO','7':'PQRS','8':'TUV','9':'WXYZ'
}

const displayValue = computed(() => {
  if (mode.value === 'email') return emailValue.value
  const d = digits.value
  if (!d) return ''
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0,3)}-${d.slice(3)}`
  return `${d.slice(0,3)}-${d.slice(3,6)}-${d.slice(6,10)}`
})

function switchMode(m: 'phone' | 'email') {
  mode.value = m; digits.value = ''; emailValue.value = ''; error.value = ''
}
function handleKey(key: string) {
  error.value = ''
  if (key === 'C') { digits.value = ''; return }
  if (key === '⌫') { digits.value = digits.value.slice(0, -1); return }
  if (digits.value.length < 10) digits.value += key
}
function clearAll() { digits.value = ''; emailValue.value = '' }

async function lookup() {
  error.value = ''
  const id = mode.value === 'phone' ? digits.value : emailValue.value.trim()
  if (!id) { error.value = mode.value === 'phone' ? 'Enter your phone number' : 'Enter your email'; return }
  if (mode.value === 'phone' && id.length < 10) { error.value = 'Enter a 10-digit number'; return }
  loading.value = true
  try {
    const data = await authApi.customerLookup(id)
    if (data) { customer.setCustomer(data); emit('success') }
    else { error.value = 'No account found — tap New Customer to sign up' }
  } catch { error.value = 'Connection error — please try again' }
  finally { loading.value = false }
}

function goSignup() {
  emit('close')
  router.push('/kiosk/signup')
}
</script>

<style scoped>
.numpad-modal {
  padding: 0 clamp(16px, 4vw, 28px) 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-header { text-align: center; }
.modal-title { font-size: 20px; font-weight: 800; color: #19213D; margin: 0 0 4px; letter-spacing: -0.02em; }
.modal-sub   { font-size: 13px; color: #A1A7BB; margin: 0; }

/* Mode tabs */
.mode-tabs { display: flex; background: #F8FAFF; border-radius: 12px; padding: 3px; gap: 3px; height: 44px; align-items: center; }
.tab-icon  { width: 14px; height: 14px; object-fit: contain; filter: brightness(0) saturate(100%) invert(65%); }
.mode-tab  {
  flex: 1; height: 100%; border: none; background: transparent;
  font-family: inherit; font-size: 13px; font-weight: 600; color: #A1A7BB;
  cursor: pointer; border-radius: 10px; display: flex; align-items: center; justify-content: center; gap: 6px;
  transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
}
.mode-tab.active {
  background: #FFFFFF; color: #19213D;
  box-shadow: 0 2px 8px rgba(25,33,61,0.10);
}
.mode-tab.active .tab-icon { filter: brightness(0) saturate(100%) invert(10%) sepia(30%) saturate(800%) hue-rotate(195deg); }

/* Display */
.input-display {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 16px; border: 1.5px solid #D7DBE7; border-radius: 16px;
  background: #F8FAFF; min-height: 52px;
  box-shadow: inset 0 1px 4px rgba(25,33,61,0.04);
  transition: border-color 0.18s ease;
}
.input-display.focused { border-color: #8DC1FF; box-shadow: 0 0 0 3px rgba(195,221,255,0.40); }
.country-code  { font-size: 16px; font-weight: 700; color: #19213D; flex-shrink: 0; }
.display-value { flex: 1; font-size: 24px; font-weight: 700; color: #19213D; letter-spacing: 0.04em; font-variant-numeric: tabular-nums; }
.display-value.placeholder { color: #D7DBE7; font-weight: 400; font-size: 14px; letter-spacing: 0; }
.clear-btn { background: #EDEFF5; border: none; border-radius: 8px; width: 30px; height: 30px; cursor: pointer; color: #6D758F; font-size: 13px; flex-shrink: 0; }

/* Error */
.lookup-error { font-size: 12px; color: #DC2626; text-align: center; margin: 0; padding: 8px 12px; background: #FEF2F2; border-radius: 10px; border: 1px solid rgba(220,38,38,0.15); }

/* Numpad */
.numpad { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.numpad-key {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  aspect-ratio: 1; min-height: 60px; border-radius: 16px; border: none;
  background: #19213D; color: #FFFFFF; cursor: pointer; font-family: inherit;
  transition: transform 0.10s cubic-bezier(0.34,1.56,0.64,1), background 0.12s ease;
  -webkit-tap-highlight-color: transparent; user-select: none;
  box-shadow: 0 3px 8px rgba(25,33,61,0.25), inset 0 1px 0 rgba(255,255,255,0.10);
}
.numpad-key:active { transform: scale(0.91); background: #353E5C; }
.key--action { background: #EDEFF5; color: #19213D; box-shadow: none; }
.key--action:active { background: #D7DBE7; }
.key-main { font-size: 22px; font-weight: 700; line-height: 1; }
.key-sub  { font-size: 9px; letter-spacing: 0.12em; color: rgba(255,255,255,0.5); margin-top: 2px; }
.key--action .key-sub { color: #A1A7BB; }

/* Email input */
.email-wrap { display: flex; align-items: center; }
.email-input {
  width: 100%; padding: 14px 16px; border: 1.5px solid #D7DBE7; border-radius: 14px;
  font-family: inherit; font-size: 16px; background: #F8FAFF; outline: none;
  transition: border-color 0.18s ease, box-shadow 0.18s ease; color: #19213D;
}
.email-input:focus { border-color: #8DC1FF; box-shadow: 0 0 0 4px rgba(195,221,255,0.40); }
.email-input::placeholder { color: #A1A7BB; }

/* Actions */
.action-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.action-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 14px; border-radius: 16px; border: none; font-family: inherit;
  font-size: 14px; font-weight: 700; cursor: pointer;
  transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s ease;
  -webkit-tap-highlight-color: transparent; min-height: 52px;
}
.action-btn:active:not(:disabled) { transform: scale(0.97); }
.action-btn--secondary { background: #EDEFF5; color: #19213D; }
.action-btn--secondary:hover { background: #D7DBE7; }
.action-btn--primary {
  background: #8DC1FF; color: #19213D;
  box-shadow: 0 4px 14px rgba(141,193,255,0.40), inset 0 1px 0 rgba(255,255,255,0.30);
}
.action-btn--primary:hover:not(:disabled) { background: #4E9FFF; color: #FFFFFF; }
.action-btn:disabled { opacity: 0.45; cursor: not-allowed; }

.spinner { width: 16px; height: 16px; border: 2px solid rgba(25,33,61,0.25); border-top-color: #19213D; border-radius: 50%; animation: spin 0.65s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>

<template>
  <div class="kiosk-lookup">

    <!-- LEFT — lookup form + numpad -->
    <div class="lookup-left">
      <!-- Brand header -->
      <div class="kiosk-brand">
        <span class="brand-icon">🍷</span>
        <div>
          <h1 class="brand-title">{{ settings.businessName }}</h1>
          <p class="brand-sub">Loyalty Rewards</p>
        </div>
      </div>

      <!-- Entry mode tabs -->
      <div class="mode-tabs">
        <button
          class="mode-tab" :class="{ active: mode === 'email' }"
          @click="switchMode('email')"
        >✉ Email</button>
        <button
          class="mode-tab" :class="{ active: mode === 'phone' }"
          @click="switchMode('phone')"
        >📞 Phone Number</button>
      </div>

      <!-- Display value -->
      <div class="input-display">
        <span v-if="mode === 'phone'" class="country-code">+1</span>
        <span class="display-value" :class="{ placeholder: !displayValue }">
          {{ displayValue || (mode === 'phone' ? '000-000-0000' : 'tap or use keyboard…') }}
        </span>
        <button v-if="displayValue" class="clear-all-btn" @click="clearAll">✕</button>
      </div>

      <!-- Error -->
      <p v-if="error" class="lookup-error">{{ error }}</p>

      <!-- PHONE NUMPAD -->
      <div v-if="mode === 'phone'" class="numpad">
        <button
          v-for="key in numpadKeys" :key="key"
          type="button"
          class="numpad-key"
          :class="{ 'key--wide': key === '0', 'key--action': key === 'C' || key === '⌫' }"
          @mousedown.prevent="handleKey(key)"
          @touchstart.prevent="handleKey(key)"
        >
          <span class="key-main">{{ key }}</span>
          <span v-if="numpadLabels[key]" class="key-sub">{{ numpadLabels[key] }}</span>
        </button>
      </div>

      <!-- EMAIL keyboard fallback -->
      <div v-else class="email-input-wrap">
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
        <button class="action-btn action-btn--secondary" @click="router.push('/kiosk/signup')">
          <span>✚</span> New Customer
        </button>
        <button class="action-btn action-btn--primary" :disabled="loading" @click="lookup">
          <span v-if="loading" class="spinner" />
          <span v-else>🔍</span> Find Customer
        </button>
      </div>
    </div>

    <!-- RIGHT — persistent ad panel -->
    <div class="lookup-ad-panel">
      <KioskAdPanel />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '@/api/auth.api'
import { useCustomerStore } from '@/stores/customer.store'
import { useSettingsStore } from '@/stores/settings.store'
import KioskAdPanel from '@/components/kiosk/KioskAdPanel.vue'

const router = useRouter()
const customer = useCustomerStore()
const settings = useSettingsStore()
settings.loadSettings()

const mode = ref<'phone' | 'email'>('phone')
const digits = ref('')
const emailValue = ref('')
const loading = ref(false)
const error = ref('')

const numpadKeys = ['1','2','3','4','5','6','7','8','9','C','0','⌫']
const numpadLabels: Record<string, string> = {
  '2':'ABC','3':'DEF','4':'GHI','5':'JKL','6':'MNO','7':'PQRS','8':'TUV','9':'WXYZ'
}

// Format as 000-000-0000
const displayValue = computed(() => {
  if (mode.value === 'email') return emailValue.value
  const d = digits.value
  if (!d) return ''
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0,3)}-${d.slice(3)}`
  return `${d.slice(0,3)}-${d.slice(3,6)}-${d.slice(6,10)}`
})

function switchMode(m: 'phone' | 'email') { mode.value = m; digits.value = ''; emailValue.value = ''; error.value = '' }

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
  if (!id) { error.value = mode.value === 'phone' ? 'Enter your phone number' : 'Enter your email address'; return }
  if (mode.value === 'phone' && id.length < 10) { error.value = 'Enter a 10-digit phone number'; return }

  loading.value = true
  try {
    const data = await authApi.customerLookup(id)
    if (data) { customer.setCustomer(data); router.push('/kiosk/dashboard') }
    else { error.value = 'No account found — tap New Customer to sign up' }
  } catch { error.value = 'Connection error — please try again' }
  finally { loading.value = false }
}
// Physical keyboard support
function onKeydown(e: KeyboardEvent) {
  // Don't capture if focus is on any native input (like the Ad Panel search or Email field)
  if ((e.target as HTMLElement)?.tagName === 'INPUT') return
  if (e.key >= '0' && e.key <= '9') { e.preventDefault(); handleKey(e.key) }
  else if (e.key === 'Backspace') { e.preventDefault(); handleKey('\u232b') }
  else if (e.key === 'Enter') { e.preventDefault(); lookup() }
  else if (e.key === 'Escape') { e.preventDefault(); clearAll() }
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
.kiosk-lookup {
  display: grid;
  grid-template-columns: clamp(340px, 55%, 600px) 1fr;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: #F5F5F5;
}

/* ── LEFT ── */
.lookup-left {
  display: flex;
  flex-direction: column;
  padding: clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 3vw, 2.5rem);
  background: #FFFFFF;
  overflow-y: auto;
  gap: clamp(12px, 1.8vh, 20px);
}

.kiosk-brand { display: flex; align-items: center; gap: 12px; }
.brand-icon  { font-size: clamp(28px, 4vw, 40px); }
.brand-title { font-size: clamp(16px, 2.2vw, 22px); font-weight: 800; margin: 0; color: #111111; }
.brand-sub   { font-size: 12px; color: #A3A3A3; margin: 0; }

/* Tabs */
.mode-tabs { display: flex; border-radius: 14px; border: 1px solid #E5E5E5; overflow: hidden; height: clamp(44px, 5.5vh, 54px); }
.mode-tab {
  flex: 1;
  border: none;
  background: #FFFFFF;
  font-family: inherit;
  font-size: clamp(13px, 1.5vw, 15px);
  font-weight: 600;
  color: #A3A3A3;
  cursor: pointer;
  transition: all 0.2s ease;
}
.mode-tab.active { background: #111111; color: #FFFFFF; }

/* Display */
.input-display {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: clamp(10px, 1.5vh, 14px) clamp(14px, 2vw, 20px);
  border: 2px solid #E5E5E5;
  border-radius: 14px;
  background: #FAFAFA;
  min-height: clamp(52px, 6.5vh, 64px);
}
.country-code { font-size: clamp(15px, 1.8vw, 18px); font-weight: 700; color: #111111; flex-shrink: 0; }
.display-value { flex: 1; font-size: clamp(20px, 3vw, 28px); font-weight: 700; color: #111111; letter-spacing: 0.04em; font-variant-numeric: tabular-nums; }
.display-value.placeholder { color: #D4D4D4; font-weight: 400; font-size: clamp(14px, 1.8vw, 16px); letter-spacing: 0; }
.clear-all-btn { background: #F5F5F5; border: none; border-radius: 8px; width: 32px; height: 32px; cursor: pointer; color: #525252; font-size: 14px; flex-shrink: 0; transition: all 0.15s; }
.clear-all-btn:hover { background: #E5E5E5; }

/* Error */
.lookup-error { font-size: 13px; color: #DC2626; text-align: center; margin: 0; padding: 8px; background: #FEF2F2; border-radius: 10px; }

/* NUMPAD */
.numpad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(8px, 1.2vw, 14px);
  flex: 1;
}
.numpad-key {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  min-height: clamp(60px, 9vh, 85px);
  border-radius: clamp(14px, 2vw, 20px);
  border: none;
  background: #111111;
  color: #FFFFFF;
  cursor: pointer;
  font-family: inherit;
  transition: transform 0.1s ease, background 0.15s ease;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}
.numpad-key:active { transform: scale(0.93); background: #333333; }
.key--action { background: #E5E5E5; color: #111111; }
.key--action:active { background: #D4D4D4; }
.key-main { font-size: clamp(20px, 2.8vw, 28px); font-weight: 700; line-height: 1; }
.key-sub  { font-size: clamp(8px, 0.9vw, 11px); letter-spacing: 0.12em; color: rgba(255,255,255,0.55); margin-top: 2px; }
.key--action .key-sub { color: #A3A3A3; }

/* EMAIL FALLBACK */
.email-input-wrap { flex: 1; display: flex; align-items: center; }
.email-input {
  width: 100%;
  padding: clamp(12px, 1.8vh, 18px) 16px;
  border: 2px solid #E5E5E5;
  border-radius: 14px;
  font-family: inherit;
  font-size: clamp(16px, 2vw, 20px);
  background: #FAFAFA;
  outline: none;
  transition: border-color 0.15s;
}
.email-input:focus { border-color: #111111; background: #FFFFFF; }

/* ACTION BUTTONS */
.action-row { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(8px, 1vw, 14px); }
.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: clamp(14px, 2vh, 18px);
  border-radius: 16px;
  border: none;
  font-family: inherit;
  font-size: clamp(14px, 1.6vw, 16px);
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  -webkit-tap-highlight-color: transparent;
  min-height: clamp(52px, 6.5vh, 64px);
}
.action-btn:active:not(:disabled) { transform: scale(0.97); }
.action-btn--secondary { background: #F5F5F5; color: #111111; }
.action-btn--secondary:hover { background: #E5E5E5; }
.action-btn--primary  { background: #111111; color: #FFFFFF; box-shadow: 0 4px 16px rgba(0,0,0,0.18); }
.action-btn--primary:hover:not(:disabled) { background: #333333; }
.action-btn:disabled  { opacity: 0.5; cursor: not-allowed; }
.spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #FFFFFF; border-radius: 50%; animation: spin 0.6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── RIGHT ── */
.lookup-ad-panel {
  background: #F5F5F5;
  overflow-y: auto;
  padding: clamp(1rem, 2vw, 1.5rem);
  display: flex;
  flex-direction: column;
}
</style>

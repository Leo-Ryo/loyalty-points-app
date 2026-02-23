<template>
  <div class="page">
    <div class="page-header">
      <h1 class="page-title">App Settings</h1>
    </div>

    <div class="settings-grid">
      <!-- Navigation -->
      <AppCard>
        <h2 class="section-title">Navigation Position</h2>
        <p class="section-desc">Changes take effect immediately across the app.</p>
        <div class="nav-options">
          <button
            v-for="opt in navOptions" :key="opt.value"
            class="nav-option"
            :class="{ active: form.navigationPosition === opt.value }"
            @click="form.navigationPosition = opt.value"
          >
            <span class="nav-opt-icon">{{ opt.icon }}</span>
            <span>{{ opt.label }}</span>
          </button>
        </div>
      </AppCard>

      <!-- Business Info -->
      <AppCard>
        <h2 class="section-title">Business Info</h2>
        <div class="form">
          <AppInput v-model="form.businessName" label="Business Name" placeholder="The Wine Cellar" />
          <AppInput v-model="form.defaultWelcomePoints" label="Welcome Points (new customers)" type="number" placeholder="50" />
          <AppInput v-model="form.tradeExpiryHours" label="Trade Auto-Expiry (Hours)" type="number" placeholder="24" />
        </div>
      </AppCard>

      <!-- Points Rate -->
      <AppCard>
        <h2 class="section-title">Points Rate</h2>
        <p class="section-desc">Percentage of the bill amount awarded as loyalty points.<br>e.g. 5 means $100 bill → 5 pts.</p>
        <div class="rate-row">
          <AppInput v-model="form.pointsRatePercent" label="Rate (%)" type="number" placeholder="5" />
          <span class="rate-suffix">%</span>
        </div>
      </AppCard>

      <!-- Ads Control -->
      <AppCard>
        <h2 class="section-title">Ad Panel</h2>
        <label class="toggle-label">
          <span>Enable Ad Panel</span>
          <div class="toggle" :class="{ 'toggle--on': form.adsEnabled }" @click="form.adsEnabled = !form.adsEnabled">
            <div class="toggle-knob" />
          </div>
        </label>
        <p class="section-desc">When enabled, a promotional ad column appears on the right of the screen.</p>
      </AppCard>
    </div>

    <div class="save-row">
      <AppButton variant="primary" :loading="saving" @click="save">Save Settings</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings.store'
import { useNotificationStore } from '@/stores/notification.store'
import AppCard from '@/components/ui/AppCard.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'

const settings = useSettingsStore()
const notify = useNotificationStore()
const saving = ref(false)
const form = reactive({ navigationPosition: 'left', adsEnabled: true, defaultWelcomePoints: '0', businessName: '', pointsRatePercent: '5', tradeExpiryHours: '24' })

const navOptions = [
  { value: 'left',   icon: '⬅', label: 'Left Sidebar' },
  { value: 'top',    icon: '⬆', label: 'Top Bar' },
  { value: 'bottom', icon: '⬇', label: 'Bottom Bar' },
]

onMounted(() => {
  form.navigationPosition   = settings.navigationPosition
  form.adsEnabled            = settings.adsEnabled
  form.defaultWelcomePoints  = String(settings.defaultWelcomePoints)
  form.businessName          = settings.businessName
  form.pointsRatePercent     = String(settings.pointsRatePercent ?? 5)
  form.tradeExpiryHours      = String(settings.tradeExpiryHours ?? 24)
})

async function save() {
  saving.value = true
  try {
    await settings.saveSettings({
      ...form,
      defaultWelcomePoints: parseInt(form.defaultWelcomePoints as any) || 0,
      pointsRatePercent: parseFloat(form.pointsRatePercent as any) || 5,
      tradeExpiryHours: parseInt(form.tradeExpiryHours as any) || 24,
    })
    notify.success('Settings saved')
  } catch (e: any) { notify.error(e.message) }
  finally { saving.value = false }
}
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: clamp(1rem, 2vh, 1.5rem); }
.page-header { display: flex; align-items: center; justify-content: space-between; }
.page-title { font-size: clamp(18px, 2.5vw, 26px); font-weight: 800; margin: 0; }
.settings-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr)); gap: clamp(0.75rem, 1.5vw, 1.25rem); }
.section-title { font-size: 15px; font-weight: 700; margin: 0 0 6px; }
.section-desc { font-size: 13px; color: #525252; margin: 0 0 1rem; }
.form { display: flex; flex-direction: column; gap: 1rem; }
.nav-options { display: flex; gap: 8px; flex-wrap: wrap; }
.nav-option { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border: 2px solid #E5E5E5; border-radius: 12px; background: #FFFFFF; cursor: pointer; font-size: 13px; font-weight: 500; font-family: inherit; transition: all 0.15s ease; }
.nav-option:hover { border-color: #111111; }
.nav-option.active { border-color: #111111; background: #111111; color: #FFFFFF; }
.nav-opt-icon { font-size: 16px; }
.toggle-label { display: flex; align-items: center; justify-content: space-between; cursor: pointer; margin-bottom: 12px; font-weight: 500; font-size: 14px; }
.toggle { width: 44px; height: 24px; background: #D4D4D4; border-radius: 99px; position: relative; transition: background 0.2s ease; flex-shrink: 0; }
.toggle--on { background: #111111; }
.toggle-knob { width: 20px; height: 20px; background: #FFFFFF; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: transform 0.2s ease; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
.toggle--on .toggle-knob { transform: translateX(20px); }
.rate-row { display: flex; align-items: flex-end; gap: 8px; }
.rate-suffix { font-size: 16px; font-weight: 700; color: #525252; padding-bottom: 10px; }
.save-row { display: flex; justify-content: flex-end; }
</style>

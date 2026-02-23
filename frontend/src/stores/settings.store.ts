import { defineStore } from 'pinia'
import { ref } from 'vue'
import { settingsApi } from '@/api/settings.api'

export const useSettingsStore = defineStore('settings', () => {
    const navigationPosition = ref<'left' | 'top' | 'bottom'>('left')
    const adsEnabled = ref(true)
    const defaultWelcomePoints = ref(0)
    const pointsRatePercent = ref(5.0)
    const tradeExpiryHours = ref(24)
    const businessName = ref('The Wine Cellar')
    const logoUrl = ref<string | null>(null)

    function applySettings(s: any) {
        navigationPosition.value = s.navigationPosition ?? 'left'
        adsEnabled.value = s.adsEnabled ?? true
        defaultWelcomePoints.value = s.defaultWelcomePoints ?? 0
        pointsRatePercent.value = s.pointsRatePercent ?? 5.0
        tradeExpiryHours.value = s.tradeExpiryHours ?? 24
        businessName.value = s.businessName || 'The Wine Cellar'
        logoUrl.value = s.logoUrl ?? null
    }

    async function loadSettings() {
        try {
            const s = await settingsApi.get()
            applySettings(s)
        } catch { /* use defaults */ }
    }

    async function saveSettings(data: Record<string, any>) {
        const s = await settingsApi.update(data)
        applySettings(s)
    }

    return { navigationPosition, adsEnabled, defaultWelcomePoints, pointsRatePercent, tradeExpiryHours, businessName, logoUrl, loadSettings, saveSettings }
})

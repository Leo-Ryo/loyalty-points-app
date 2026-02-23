<template>
  <div class="customer-layout">
    <!-- Compact top bar: nav + exit only (no ad here — each page embeds its own) -->
    <header class="kiosk-header">
      <div class="kiosk-brand">
        <span class="brand-icon">🍷</span>
        <span>{{ settings.businessName }}</span>
      </div>
      <nav class="kiosk-nav">
        <router-link to="/kiosk/dashboard" class="kiosk-nav-item" :class="{ active: route.path.includes('dashboard') }">🏠 Home</router-link>
        <router-link to="/kiosk/rewards"   class="kiosk-nav-item" :class="{ active: route.path.includes('rewards') }">🎁 Rewards</router-link>
      </nav>
      <button class="exit-btn" @click="exitKiosk">Exit ↩</button>
    </header>

    <!-- Full-height content area (no outer ad — each view handles ad column) -->
    <div class="kiosk-body">
      <transition name="slide-up" mode="out-in">
        <router-view :key="$route.path" />
      </transition>
    </div>

    <AppToast />
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useCustomerStore } from '@/stores/customer.store'
import { useSettingsStore } from '@/stores/settings.store'
import AppToast from '@/components/ui/AppToast.vue'

const route = useRoute(); const router = useRouter()
const customer = useCustomerStore(); const settings = useSettingsStore()
function exitKiosk() { customer.clearCustomer(); router.push('/kiosk') }
</script>

<style scoped>
.customer-layout { display: flex; flex-direction: column; height: 100vh; width: 100vw; overflow: hidden; background: #FAFAFA; }
.kiosk-header {
  display: flex;
  align-items: center;
  gap: clamp(1rem, 2vw, 2rem);
  padding: 0 clamp(1rem, 2vw, 1.5rem);
  height: clamp(50px, 6vh, 60px);
  background: #111111;
  flex-shrink: 0;
}
.kiosk-brand { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: clamp(13px, 1.4vw, 15px); color: #FFFFFF; }
.brand-icon { font-size: 18px; }
.kiosk-nav { display: flex; gap: 4px; flex: 1; justify-content: center; }
.kiosk-nav-item {
  padding: 7px clamp(12px, 1.8vw, 18px);
  border-radius: 10px;
  text-decoration: none;
  color: rgba(255,255,255,0.6);
  font-size: clamp(12px, 1.3vw, 14px);
  font-weight: 600;
  transition: all 0.15s ease;
}
.kiosk-nav-item:hover { background: rgba(255,255,255,0.1); color: #FFFFFF; }
.kiosk-nav-item.active { background: rgba(255,255,255,0.15); color: #FFFFFF; }
.exit-btn { padding: 7px 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); background: transparent; color: rgba(255,255,255,0.7); font-size: 12px; cursor: pointer; white-space: nowrap; transition: all 0.15s ease; flex-shrink: 0; }
.exit-btn:hover { background: rgba(220,38,38,0.3); color: #FCA5A5; border-color: transparent; }
.kiosk-body { flex: 1; overflow: hidden; display: flex; flex-direction: column; }
.kiosk-body > * { flex: 1; }
</style>

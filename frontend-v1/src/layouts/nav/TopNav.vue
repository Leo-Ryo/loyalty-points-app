<template>
  <nav class="top-nav">
    <div class="top-nav-brand">
      <span class="brand-icon">🍷</span>
      <span class="brand-name">{{ settings.businessName }}</span>
    </div>
    <div class="top-nav-links">
      <router-link
        v-for="item in navItems" :key="item.to"
        :to="item.to"
        class="top-nav-item"
        :class="{ active: isActive(item.to) }"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </router-link>
    </div>
    <button class="main-menu-btn" @click="router.push('/')">🏠 Menu</button>
    <button class="logout-btn" @click="logout">↩ Logout</button>
  </nav>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useSettingsStore } from '@/stores/settings.store'

const route = useRoute(); const router = useRouter()
const auth = useAuthStore(); const settings = useSettingsStore()

const navItems = [
  { to: '/admin/dashboard',    icon: '📊', label: 'Dashboard' },
  { to: '/admin/customers',    icon: '👥', label: 'Customers' },
  { to: '/admin/rewards',      icon: '🎁', label: 'Rewards' },
  { to: '/admin/inventory',    icon: '🍾', label: 'Inventory' },
  { to: '/admin/promotions',   icon: '📢', label: 'Promotions' },
  { to: '/admin/transactions', icon: '📋', label: 'Transactions' },
  { to: '/admin/settings',     icon: '⚙️', label: 'Settings' },
]
const isActive = (to: string) => route.path.startsWith(to)
function logout() { auth.logout(); router.push('/admin/login') }
</script>

<style scoped>
.top-nav {
  display: flex;
  align-items: center;
  gap: clamp(4px, 1vw, 12px);
  padding: 0 clamp(1rem, 2vw, 2rem);
  height: clamp(52px, 6vh, 64px);
  background: #111111;
  color: #FFFFFF;
  flex-shrink: 0;
}
.top-nav-brand { display: flex; align-items: center; gap: 8px; margin-right: clamp(1rem, 2vw, 2rem); }
.brand-icon { font-size: 20px; }
.brand-name { font-size: clamp(12px, 1.2vw, 14px); font-weight: 700; white-space: nowrap; }
.top-nav-links { display: flex; align-items: center; gap: 2px; flex: 1; overflow-x: auto; }
.top-nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px clamp(8px, 1.2vw, 14px);
  border-radius: 8px;
  text-decoration: none;
  color: rgba(255,255,255,0.65);
  font-size: clamp(11px, 1.05vw, 13px);
  font-weight: 500;
  white-space: nowrap;
  transition: background 0.15s ease, color 0.15s ease;
}
.top-nav-item:hover { background: rgba(255,255,255,0.1); color: #FFFFFF; }
.top-nav-item.active { background: rgba(255,255,255,0.15); color: #FFFFFF; font-weight: 600; }
.nav-icon { font-size: 13px; }
.main-menu-btn {
  margin-left: auto;
  padding: 6px 14px;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  background: transparent;
  color: rgba(255,255,255,0.7);
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
  flex-shrink: 0;
}
.main-menu-btn:hover { background: rgba(255,255,255,0.15); color: #FFFFFF; border-color: transparent; }
.logout-btn {
  padding: 6px 14px;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  background: transparent;
  color: rgba(255,255,255,0.7);
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
  flex-shrink: 0;
}
.logout-btn:hover { background: rgba(220,38,38,0.2); color: #FCA5A5; border-color: transparent; }
</style>

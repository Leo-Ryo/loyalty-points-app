<template>
  <nav class="bottom-nav">
    <router-link
      v-for="item in navItems" :key="item.to"
      :to="item.to"
      class="bottom-nav-item"
      :class="{ active: isActive(item.to) }"
    >
      <span class="nav-icon">{{ item.icon }}</span>
      <span class="nav-label">{{ item.label }}</span>
    </router-link>
    <button class="bottom-nav-item main-menu" @click="router.push('/')">
      <span class="nav-icon">🏠</span>
      <span class="nav-label">Menu</span>
    </button>
    <button class="bottom-nav-item logout" @click="logout">
      <span class="nav-icon">↩</span>
      <span class="nav-label">Logout</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
const route = useRoute(); const router = useRouter(); const auth = useAuthStore()
const navItems = [
  { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/admin/customers', icon: '👥', label: 'Customers' },
  { to: '/admin/rewards', icon: '🎁', label: 'Rewards' },
  { to: '/admin/inventory', icon: '🍾', label: 'Inventory' },
  { to: '/admin/promotions', icon: '📢', label: 'Promos' },
  { to: '/admin/transactions', icon: '📋', label: 'Transactions' },
  { to: '/admin/settings', icon: '⚙️', label: 'Settings' },
]
const isActive = (to: string) => route.path.startsWith(to)
function logout() { auth.logout(); router.push('/admin/login') }
</script>

<style scoped>
.bottom-nav {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: #111111;
  padding: 0 clamp(0.5rem, 2vw, 1.5rem);
  height: clamp(56px, 7vh, 72px);
  flex-shrink: 0;
  overflow-x: auto;
}
.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 6px clamp(6px, 1.5vw, 14px);
  border-radius: 10px;
  text-decoration: none;
  color: rgba(255,255,255,0.55);
  font-size: clamp(9px, 0.9vw, 11px);
  font-weight: 500;
  cursor: pointer;
  background: transparent;
  border: none;
  transition: color 0.15s ease, background 0.15s ease;
  white-space: nowrap;
  flex-shrink: 0;
}
.bottom-nav-item:hover { color: #FFFFFF; background: rgba(255,255,255,0.1); }
.bottom-nav-item.active { color: #FFFFFF; }
.nav-icon { font-size: clamp(16px, 1.8vw, 20px); }
.nav-label { font-size: clamp(9px, 0.9vw, 11px); }
.logout:hover { color: #FCA5A5; }
.main-menu:hover { color: #93C5FD; }

</style>

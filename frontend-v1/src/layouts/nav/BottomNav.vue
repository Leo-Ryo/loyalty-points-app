<template>
  <nav class="bottom-nav">
    <router-link
      v-for="item in navItems" :key="item.to"
      :to="item.to"
      class="bottom-nav-item"
      :class="{ active: isActive(item.to) }"
    >
      <!-- Active dot indicator (iOS tab bar style) -->
      <span class="active-pill" />
      <span class="nav-icon">{{ item.icon }}</span>
      <span class="nav-label">{{ item.label }}</span>
    </router-link>
    <button class="bottom-nav-item" @click="router.push('/')">
      <span class="active-pill" />
      <span class="nav-icon">🏠</span>
      <span class="nav-label">Menu</span>
    </button>
    <button class="bottom-nav-item logout" @click="logout">
      <span class="active-pill" />
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
  { to: '/admin/rewards',   icon: '🎁', label: 'Rewards' },
  { to: '/admin/inventory', icon: '🍾', label: 'Inventory' },
  { to: '/admin/promotions',icon: '📢', label: 'Promos' },
  { to: '/admin/transactions',icon: '📋',label: 'Logs' },
  { to: '/admin/settings',  icon: '⚙️', label: 'Settings' },
]
const isActive = (to: string) => route.path.startsWith(to)
function logout() { auth.logout(); router.push('/admin/login') }
</script>

<style scoped>
.bottom-nav {
  display: flex;
  align-items: center;
  justify-content: space-around;
  /* frosted dock */
  background: rgba(17,17,17,0.90);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255,255,255,0.08);
  padding: 0 clamp(0.5rem, 2vw, 1rem);
  height: clamp(58px, 7vh, 72px);
  flex-shrink: 0;
  overflow-x: auto;
}
.bottom-nav::-webkit-scrollbar { display: none; }

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 8px clamp(6px, 1.5vw, 14px);
  border-radius: 12px;
  text-decoration: none;
  color: rgba(255,255,255,0.45);
  font-size: clamp(9px, 0.9vw, 11px);
  font-weight: 500;
  cursor: pointer;
  background: transparent;
  border: none;
  transition: color 0.18s ease, transform 0.22s cubic-bezier(0.34,1.56,0.64,1);
  white-space: nowrap;
  flex-shrink: 0;
  position: relative;
}
.bottom-nav-item:hover { color: rgba(255,255,255,0.8); transform: translateY(-2px); }
.bottom-nav-item.active { color: #FFFFFF; }

/* iOS-style active pill indicator above icon */
.active-pill {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 3px;
  border-radius: 0 0 3px 3px;
  background: transparent;
  transition: background 0.22s ease, width 0.22s cubic-bezier(0.34,1.56,0.64,1);
}
.bottom-nav-item.active .active-pill {
  background: #FFFFFF;
  width: 32px;
}

.nav-icon { font-size: clamp(18px, 1.8vw, 22px); line-height: 1; }
.nav-label { font-size: clamp(9px, 0.9vw, 11px); letter-spacing: 0.01em; }
.logout:hover { color: #FCA5A5 !important; }
</style>

<template>
  <nav class="sidebar">
    <!-- Logo / Brand -->
    <div class="sidebar-brand">
      <img v-if="settings.logoUrl" :src="`${baseUrl}/${settings.logoUrl}`" class="brand-logo" alt="Logo" />
      <div v-else class="brand-icon">🍷</div>
      <span class="brand-name">{{ settings.businessName }}</span>
    </div>

    <!-- Nav Items -->
    <ul class="nav-list">
      <li v-for="item in navItems" :key="item.to">
        <router-link :to="item.to" class="nav-item" :class="{ active: isActive(item.to) }">
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </router-link>
      </li>
    </ul>

    <!-- Bottom: Main Menu + Logout -->
    <div class="sidebar-footer">
      <button class="nav-item main-menu-btn" @click="router.push('/')">
        <span class="nav-icon">🏠</span>
        <span class="nav-label">Main Menu</span>
      </button>
      <button class="nav-item logout-btn" @click="logout">
        <span class="nav-icon">↩</span>
        <span class="nav-label">Logout</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useSettingsStore } from '@/stores/settings.store'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const settings = useSettingsStore()
const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3000'

const navItems = [
  { to: '/admin/dashboard',    icon: '📊', label: 'Dashboard' },
  { to: '/admin/customers',    icon: '👥', label: 'Customers' },
  { to: '/admin/rewards',      icon: '🎁', label: 'Rewards' },
  { to: '/admin/inventory',    icon: '🍾', label: 'Inventory' },
  { to: '/admin/promotions',   icon: '📢', label: 'Promotions' },
  { to: '/admin/transactions', icon: '📋', label: 'Transactions' },
  { to: '/admin/employees',    icon: '👷', label: 'Employees' },
  { to: '/admin/settings',     icon: '⚙️', label: 'Settings' },
]

const isActive = (to: string) => route.path.startsWith(to)

function logout() {
  auth.logout()
  router.push('/admin/login')
}
</script>

<style scoped>
.sidebar {
  width: clamp(180px, 15vw, 220px);
  background: #111111;
  color: #FFFFFF;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  padding: 0;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: clamp(1rem, 2vw, 1.5rem) clamp(0.75rem, 1.5vw, 1.25rem);
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.brand-logo { width: 32px; height: 32px; border-radius: 8px; object-fit: cover; }
.brand-icon { font-size: 22px; }
.brand-name { font-size: clamp(12px, 1.1vw, 14px); font-weight: 700; color: #FFFFFF; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.nav-list { list-style: none; margin: 0; padding: clamp(0.5rem, 1vw, 1rem) 0; flex: 1; }
.nav-list li { padding: 0 clamp(0.5rem, 1vw, 0.75rem); margin-bottom: 2px; }

.nav-item {
  display: flex;
  align-items: center;
  gap: clamp(8px, 1vw, 12px);
  padding: clamp(8px, 1vw, 10px) clamp(10px, 1.2vw, 14px);
  border-radius: 10px;
  text-decoration: none;
  color: rgba(255,255,255,0.65);
  font-size: clamp(12px, 1.1vw, 13px);
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  border: none;
  background: transparent;
  transition: background 0.15s ease, color 0.15s ease, transform 0.15s ease;
}
.nav-item:hover { background: rgba(255,255,255,0.1); color: #FFFFFF; transform: translateX(3px); }
.nav-item.active { background: rgba(255,255,255,0.15); color: #FFFFFF; font-weight: 600; }

.nav-icon { font-size: clamp(14px, 1.3vw, 16px); flex-shrink: 0; }
.nav-label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.sidebar-footer { padding: clamp(0.5rem, 1vw, 0.75rem); border-top: 1px solid rgba(255,255,255,0.1); }
.logout-btn:hover { background: rgba(220,38,38,0.2); color: #FCA5A5; }
</style>

<template>
  <nav class="sidebar" :class="{ 'sidebar--collapsed': collapsed }">
    <!-- Toggle button -->
    <button class="collapse-toggle" @click="toggle" :title="collapsed ? 'Expand' : 'Collapse'">
      <svg class="toggle-icon" :class="{ rotated: collapsed }" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M9 2L4 7l5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Logo / Brand -->
    <div class="sidebar-brand">
      <img v-if="settings.logoUrl" :src="`${baseUrl}/${settings.logoUrl}`" class="brand-logo" alt="Logo" />
      <div v-else class="brand-icon">🍷</div>
      <transition name="label-fade">
        <span v-if="!collapsed" class="brand-name">{{ settings.businessName }}</span>
      </transition>
    </div>

    <!-- Nav Items -->
    <ul class="nav-list">
      <li v-for="item in navItems" :key="item.to" class="nav-list-item">
        <router-link
          :to="item.to"
          class="nav-item"
          :class="{ active: isActive(item.to) }"
          :title="collapsed ? item.label : ''"
        >
          <img :src="item.icon" class="nav-icon-img" :alt="item.label" />
          <transition name="label-fade">
            <span v-if="!collapsed" class="nav-label">{{ item.label }}</span>
          </transition>
          <!-- Tooltip in collapsed mode -->
          <span v-if="collapsed" class="nav-tooltip">{{ item.label }}</span>
        </router-link>
      </li>
    </ul>

    <!-- Footer -->
    <div class="sidebar-footer">
      <button class="nav-item footer-btn" @click="router.push('/')" :title="collapsed ? 'Main Menu' : ''">
        <img src="@/assets/Outline Icons/Home.png" class="nav-icon-img" alt="" />
        <transition name="label-fade">
          <span v-if="!collapsed" class="nav-label">Main Menu</span>
        </transition>
        <span v-if="collapsed" class="nav-tooltip">Main Menu</span>
      </button>
      <button class="nav-item footer-btn logout-btn" @click="logout" :title="collapsed ? 'Logout' : ''">
        <img src="@/assets/Outline Icons/Log out.png" class="nav-icon-img" alt="" />
        <transition name="label-fade">
          <span v-if="!collapsed" class="nav-label">Logout</span>
        </transition>
        <span v-if="collapsed" class="nav-tooltip">Logout</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useSettingsStore } from '@/stores/settings.store'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const settings = useSettingsStore()
const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3000'

// Persist collapse state in localStorage
const collapsed = ref(localStorage.getItem('sidebarCollapsed') === 'true')
function toggle() {
  collapsed.value = !collapsed.value
  localStorage.setItem('sidebarCollapsed', String(collapsed.value))
}

const navItems = [
  { to: '/admin/dashboard',    icon: new URL('@/assets/Outline Icons/Chart.png', import.meta.url).href,       label: 'Dashboard' },
  { to: '/admin/customers',    icon: new URL('@/assets/Outline Icons/Contacts.png', import.meta.url).href,    label: 'Customers' },
  { to: '/admin/rewards',      icon: new URL('@/assets/Outline Icons/Star.png', import.meta.url).href,        label: 'Rewards' },
  { to: '/admin/inventory',    icon: new URL('@/assets/Outline Icons/Box.png', import.meta.url).href,         label: 'Inventory' },
  { to: '/admin/promotions',   icon: new URL('@/assets/Outline Icons/Announcement.png', import.meta.url).href,label: 'Promotions' },
  { to: '/admin/transactions', icon: new URL('@/assets/Outline Icons/Credit card.png', import.meta.url).href, label: 'Transactions' },
  { to: '/admin/employees',    icon: new URL('@/assets/Outline Icons/User.png', import.meta.url).href,        label: 'Employees' },
  { to: '/admin/settings',     icon: new URL('@/assets/Outline Icons/Settings.png', import.meta.url).href,    label: 'Settings' },
]

const isActive = (to: string) => route.path.startsWith(to)

function logout() {
  auth.logout()
  router.push('/admin/login')
}
</script>

<style scoped>
.sidebar {
  width: 220px;
  background: #19213D;      /* Neutral 800 — brand navy */
  color: #FFFFFF;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  padding: 0;
  transition: width 0.38s cubic-bezier(0.34,1.56,0.64,1);
  overflow: hidden;
  position: relative;
}
.sidebar::after {
  content: '';
  position: absolute;
  top: 0; right: 0; bottom: 0;
  width: 1px;
  background: linear-gradient(180deg, transparent, rgba(141,193,255,0.12) 30%, rgba(141,193,255,0.12) 70%, transparent);
  pointer-events: none;
}

.sidebar--collapsed { width: 62px; }

/* ── Toggle button ── */
.collapse-toggle {
  position: absolute;
  top: 14px;
  right: 10px;
  width: 24px; height: 24px;
  border-radius: 8px;
  border: none;
  background: rgba(255,255,255,0.10);
  color: rgba(255,255,255,0.6);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: background 0.15s ease, color 0.15s ease;
  flex-shrink: 0;
}
.collapse-toggle:hover { background: rgba(255,255,255,0.18); color: #FFFFFF; }
.toggle-icon { transition: transform 0.38s cubic-bezier(0.34,1.56,0.64,1); flex-shrink: 0; }
.toggle-icon.rotated { transform: rotate(180deg); }

/* ── Brand ── */
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 14px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  min-height: 56px;
  overflow: hidden;
  /* leave room for toggle btn */
  padding-right: 44px;
}
.brand-logo { width: 30px; height: 30px; border-radius: 10px; object-fit: cover; flex-shrink: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.4); }
.brand-icon { font-size: 22px; flex-shrink: 0; }
.brand-name { font-size: 13px; font-weight: 700; color: #FFFFFF; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* ── Nav List ── */
.nav-list { list-style: none; margin: 0; padding: 8px 8px; flex: 1; overflow-y: auto; overflow-x: hidden; }
.nav-list::-webkit-scrollbar { display: none; }
.nav-list-item { margin-bottom: 2px; position: relative; }

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 12px;
  text-decoration: none;
  color: rgba(255,255,255,0.55);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  border: none;
  background: transparent;
  transition: background 0.18s ease, color 0.18s ease, transform 0.18s cubic-bezier(0.34,1.56,0.64,1);
  white-space: nowrap;
  overflow: hidden;
  position: relative;
}
.nav-item { background: transparent; color: rgba(255,255,255,0.55); }
.nav-item:hover { background: rgba(141,193,255,0.10); color: rgba(255,255,255,0.9); transform: translateX(2px); }

/* Active: Blue 300 pill */
.nav-item.active {
  background: #8DC1FF;  /* Blue 300 */
  color: #19213D;       /* Navy text for contrast */
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(141,193,255,0.35);
  transform: none;
}
.nav-item.active:hover { transform: none; }

.nav-icon-img { width: 18px; height: 18px; flex-shrink: 0; filter: brightness(0) invert(1) opacity(0.6); object-fit: contain; }
.nav-item.active .nav-icon-img { filter: brightness(0) saturate(100%) invert(10%) sepia(30%) saturate(1000%) hue-rotate(195deg) brightness(60%); opacity: 1; }
.nav-label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; }

/* Collapsed mode: center icons */
.sidebar--collapsed .nav-item { justify-content: center; padding: 9px; gap: 0; }
.sidebar--collapsed .sidebar-brand { justify-content: center; padding: 14px 10px; padding-right: 10px; }

/* Tooltip in collapsed mode */
.nav-tooltip {
  display: none;
  position: absolute;
  left: calc(100% + 10px);
  top: 50%;
  transform: translateY(-50%);
  background: #19213D;       /* navy tooltip */
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 8px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(25,33,61,0.35);
}
.sidebar--collapsed .nav-list-item:hover .nav-tooltip { display: block; }
.sidebar--collapsed .footer-btn:hover .nav-tooltip { display: block; }

/* ── Footer ── */
.sidebar-footer {
  padding: 8px;
  border-top: 1px solid rgba(255,255,255,0.07);
}
.footer-btn { margin-bottom: 2px; }
.logout-btn:hover { background: rgba(220,38,38,0.18) !important; color: #FCA5A5 !important; }

/* ── Label fade transition ── */
.label-fade-enter-active { transition: opacity 0.15s ease 0.1s, transform 0.18s ease 0.08s; }
.label-fade-leave-active  { transition: opacity 0.10s ease, transform 0.10s ease; }
.label-fade-enter-from    { opacity: 0; transform: translateX(-6px); }
.label-fade-leave-to      { opacity: 0; transform: translateX(-4px); }
</style>

<template>
  <div class="emp-layout">
    <!-- Frosted glass white header -->
    <header class="emp-header">
      <div class="emp-brand">
        <div class="brand-mark">🍷</div>
        <div class="brand-text">
          <span class="brand-name">Staff Panel</span>
        </div>
      </div>
      <nav class="emp-nav">
        <router-link to="/employee/lookup"    class="emp-nav-item" :class="{ active: route.path.includes('lookup') }">
          <img src="@/assets/Outline Icons/User.png" class="emp-nav-icon" alt="" /> Customer
        </router-link>
        <router-link to="/employee/approvals" class="emp-nav-item" :class="{ active: route.path.includes('approvals') }">
          <img src="@/assets/Outline Icons/Check circle.png" class="emp-nav-icon" alt="" /> Approvals
          <span v-if="pendingCount > 0" class="pending-badge">{{ pendingCount }}</span>
        </router-link>
        <router-link to="/employee/settings"  class="emp-nav-item" :class="{ active: route.path.includes('settings') }">
          <img src="@/assets/Outline Icons/Lock.png" class="emp-nav-icon" alt="" /> My PIN
        </router-link>
      </nav>
      <div class="emp-user">
        <div class="user-avatar">{{ emp.employee?.name?.[0]?.toUpperCase() ?? '?' }}</div>
        <span class="user-name">{{ emp.employee?.name }}</span>
        <button class="logout-btn" @click="logout">Sign Out</button>
      </div>
    </header>
    <main class="emp-body">
      <router-view :key="$route.path" />
    </main>
    <AppToast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEmployeeStore } from '@/stores/employee.store'
import { employeeApi } from '@/api/employee.api'
import AppToast from '@/components/ui/AppToast.vue'

const route = useRoute(); const router = useRouter()
const emp = useEmployeeStore()
const pendingCount = ref(0)

async function refreshPending() {
  try { const p = await employeeApi.getPending(); pendingCount.value = p.length } catch {}
}
function logout() { emp.clearEmployee(); router.push('/employee/login') }

let interval: ReturnType<typeof setInterval>
onMounted(() => { refreshPending(); interval = setInterval(refreshPending, 15000) })
onUnmounted(() => clearInterval(interval))
</script>

<style scoped>
.emp-layout { display: flex; flex-direction: column; height: 100vh; width: 100vw; background: #F8FAFF; }

.emp-header {
  display: flex;
  align-items: center;
  gap: clamp(1rem, 2vw, 2rem);
  padding: 0 clamp(1rem, 2vw, 1.5rem);
  height: clamp(54px, 6vh, 64px);
  /* frosted white glass */
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0,0,0,0.06);
  flex-shrink: 0;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}

.emp-brand { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.brand-mark { font-size: 22px; }
.brand-name { font-size: 14px; font-weight: 700; color: #19213D; letter-spacing: -0.01em; }

.emp-nav { display: flex; gap: 4px; flex: 1; }
.emp-nav-icon { width: 15px; height: 15px; flex-shrink: 0; object-fit: contain; filter: brightness(0) saturate(100%) invert(45%) sepia(10%) saturate(500%) hue-rotate(195deg); }
.emp-nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 10px;
  text-decoration: none;
  color: #6D758F;   /* Neutral 600 */
  font-size: 13px;
  font-weight: 600;
  transition: all 0.18s ease;
  white-space: nowrap;
}
.emp-nav-item:hover { background: #EDEFF5; color: #19213D; }
.emp-nav-item.active {
  background: #8DC1FF;   /* Blue 300 */
  color: #19213D;
  box-shadow: 0 2px 8px rgba(141,193,255,0.35);
}
.emp-nav-item.active .emp-nav-icon {
  filter: brightness(0) saturate(100%) invert(10%) sepia(30%) saturate(1000%) hue-rotate(195deg) brightness(60%);
}

.pending-badge {
  background: #DC2626;
  color: #FFF;
  font-size: 10px;
  font-weight: 800;
  border-radius: 99px;
  padding: 2px 6px;
  min-width: 18px;
  text-align: center;
}

/* User info area */
.emp-user { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.user-avatar {
  width: 30px; height: 30px;
  border-radius: 50%;
  background: #19213D;   /* navy */
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(25,33,61,0.25);
}
.user-name { font-size: 13px; color: #6D758F; white-space: nowrap; font-weight: 500; }
.logout-btn {
  padding: 6px 14px;
  border: 1px solid rgba(0,0,0,0.10);
  border-radius: 10px;
  background: rgba(255,255,255,0.7);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  color: #525252;
  font-family: inherit;
  transition: all 0.18s ease;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
.logout-btn:hover { background: #FEF2F2; color: #DC2626; border-color: #FECACA; }

.emp-body { flex: 1; overflow-y: auto; padding: clamp(1rem, 2vw, 1.5rem); }
</style>

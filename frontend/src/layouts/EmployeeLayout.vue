<template>
  <div class="emp-layout">
    <header class="emp-header">
      <div class="emp-brand">
        <span class="brand-icon">🍷</span>
        <span class="brand-name">Staff Panel</span>
      </div>
      <nav class="emp-nav">
        <router-link to="/employee/lookup"   class="emp-nav-item" :class="{ active: route.path.includes('lookup') }">🔍 Customer</router-link>
        <router-link to="/employee/approvals" class="emp-nav-item" :class="{ active: route.path.includes('approvals') }">
          ✅ Approvals
          <span v-if="pendingCount > 0" class="pending-badge">{{ pendingCount }}</span>
        </router-link>
        <router-link to="/employee/settings" class="emp-nav-item" :class="{ active: route.path.includes('settings') }">⚙️ My PIN</router-link>
      </nav>
      <div class="emp-user">
        <span class="user-name">👤 {{ emp.employee?.name }}</span>
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
.emp-layout { display: flex; flex-direction: column; height: 100vh; width: 100vw; background: #FAFAFA; }
.emp-header {
  display: flex; align-items: center; gap: clamp(1rem, 2vw, 2rem);
  padding: 0 clamp(1rem, 2vw, 1.5rem);
  height: clamp(52px, 6vh, 62px);
  background: #FFFFFF; border-bottom: 1px solid #E5E5E5; flex-shrink: 0;
}
.emp-brand { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 15px; color: #111111; flex-shrink: 0; }
.brand-icon { font-size: 20px; }
.brand-name { font-size: 14px; color: #525252; font-weight: 600; }
.emp-nav { display: flex; gap: 4px; flex: 1; }
.emp-nav-item { position: relative; display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 10px; text-decoration: none; color: #525252; font-size: 13px; font-weight: 600; transition: all 0.15s; }
.emp-nav-item:hover { background: #F5F5F5; color: #111111; }
.emp-nav-item.active { background: #111111; color: #FFFFFF; }
.pending-badge { background: #DC2626; color: #FFF; font-size: 10px; font-weight: 800; border-radius: 99px; padding: 2px 6px; min-width: 18px; text-align: center; }
.emp-user { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.user-name { font-size: 13px; color: #525252; white-space: nowrap; }
.logout-btn { padding: 6px 14px; border: 1px solid #E5E5E5; border-radius: 8px; background: transparent; font-size: 12px; cursor: pointer; color: #525252; transition: all 0.15s; }
.logout-btn:hover { background: #FEF2F2; color: #DC2626; border-color: #FECACA; }
.emp-body { flex: 1; overflow-y: auto; padding: clamp(1rem, 2vw, 1.5rem); }
</style>

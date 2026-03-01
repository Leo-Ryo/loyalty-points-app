<template>
  <div class="customer-layout">
    <!-- Full-height page content -->
    <div class="kiosk-body">
      <transition name="slide-up" mode="out-in">
        <router-view :key="$route.path" />
      </transition>
    </div>

    <!-- Floating bottom pill nav -->
    <nav class="pill-nav">
      <div class="pill-inner">
        <!-- Home -->
        <router-link to="/kiosk/dashboard" class="pill-btn" :class="{ active: route.path.includes('dashboard') }">
          <div class="pill-btn-inner">
            <img src="@/assets/Outline Icons/Home.png" class="pill-icon" alt="Home" />
            <span class="pill-label">Home</span>
            <span class="active-dot" />
          </div>
        </router-link>

        <!-- History -->
        <router-link to="/kiosk/history" class="pill-btn" :class="{ active: route.path.includes('history') }">
          <div class="pill-btn-inner">
            <img src="@/assets/Outline Icons/Clock.png" class="pill-icon" alt="History" />
            <span class="pill-label">History</span>
            <span class="active-dot" />
          </div>
        </router-link>

        <!-- Center button — Login / Logout -->
        <button class="pill-btn pill-btn--center" @click="onCenterClick">
          <img
            :src="isLoggedIn ? '/src/assets/Outline Icons/Log out.png' : '/src/assets/Outline Icons/User.png'"
            class="pill-icon pill-icon--center"
            :alt="isLoggedIn ? 'Logout' : 'Login'"
          />
        </button>

        <!-- Rewards text label -->
        <router-link to="/kiosk/rewards" class="pill-btn" :class="{ active: route.path.includes('rewards') }">
          <div class="pill-btn-inner">
            <img src="@/assets/Outline Icons/Star.png" class="pill-icon" alt="Rewards" />
            <span class="pill-label">Rewards</span>
            <span class="active-dot" />
          </div>
        </router-link>

        <!-- Profile / Sign Up -->
        <!-- Guest: Sign Up -->
        <router-link
          v-if="!isLoggedIn"
          to="/kiosk/signup"
          class="pill-btn"
          :class="{ active: route.path.includes('signup') }"
        >
          <div class="pill-btn-inner">
            <img src="@/assets/Outline Icons/Avatar.png" class="pill-icon" alt="Sign Up" />
            <span class="pill-label">Sign Up</span>
            <span class="active-dot" />
          </div>
        </router-link>

        <!-- Logged in: Profile -->
        <button
          v-else
          class="pill-btn"
          :class="{ active: route.path.includes('profile') }"
          @click="onProfileClick"
        >
          <div class="pill-btn-inner">
            <div class="pill-avatar">{{ customer.activeCustomer?.name?.[0]?.toUpperCase() ?? '?' }}</div>
            <span class="pill-label">Profile</span>
            <span class="active-dot" />
          </div>
        </button>
      </div>
    </nav>

    <!-- Numpad modal (slide-up) -->
    <transition name="modal-slide">
      <div v-if="kiosk.showNumpad" class="numpad-overlay" @click.self="kiosk.closeNumpad()">
        <div class="numpad-sheet">
          <div class="sheet-handle" />
          <NumpadModal @success="onLoginSuccess" @close="kiosk.closeNumpad()" />
        </div>
      </div>
    </transition>

    <AppToast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCustomerStore } from '@/stores/customer.store'
import { useKioskStore } from '@/stores/kiosk.store'
import AppToast from '@/components/ui/AppToast.vue'
import NumpadModal from '@/components/kiosk/NumpadModal.vue'

const route = useRoute()
const router = useRouter()
const customer = useCustomerStore()
const kiosk = useKioskStore()

const isLoggedIn = computed(() => !!customer.activeCustomer)

function onProfileClick() {
  if (isLoggedIn.value) {
    router.push('/kiosk/profile')
  } else {
    kiosk.openNumpad()
  }
}

function onLoginSuccess() {
  kiosk.closeNumpad()
  router.push('/kiosk/dashboard')
}

function onCenterClick() {
  if (isLoggedIn.value) {
    customer.clearCustomer()
    router.push('/kiosk')
  } else {
    kiosk.openNumpad()
  }
}
</script>

<style scoped>
.customer-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: #F8FAFF;
  position: relative;
}

.kiosk-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-bottom: 100px;
}
.kiosk-body > * { flex: 1; }

/* ── Floating pill nav ── */
.pill-nav {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 40;
  width: 92%;
  max-width: 440px;
}

.pill-inner {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background: rgba(255,255,255,0.94);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 8px 6px;
  border-radius: 2rem;
  box-shadow: 0 8px 32px rgba(25,33,61,0.14), 0 2px 8px rgba(25,33,61,0.06);
  border: 1px solid rgba(215,219,231,0.6);
}

/* Each nav button */
.pill-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 1.2rem;
  text-decoration: none;
  transition:
    background 0.22s cubic-bezier(0.34,1.56,0.64,1),
    transform  0.18s cubic-bezier(0.34,1.56,0.64,1),
    box-shadow 0.22s ease;
  color: #A1A7BB;
  min-width: 56px;
}

/* Press down on tap */
.pill-btn:active { transform: scale(0.88) !important; transition-duration: 0.08s; }

/* Hover lift */
.pill-btn:hover:not(.pill-btn--center) { transform: translateY(-2px); }

/* Active highlight bubble */
.pill-btn.active {
  background: rgba(141,193,255,0.15);
  box-shadow: 0 2px 10px rgba(141,193,255,0.20);
}

/* Inner stack: icon + label + dot */
.pill-btn-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  position: relative;
}

/* Icon */
.pill-icon {
  width: 24px; height: 24px;
  object-fit: contain;
  filter: brightness(0) saturate(100%) invert(65%) sepia(5%) saturate(600%) hue-rotate(195deg);
  transition: filter 0.22s ease, transform 0.22s cubic-bezier(0.34,1.56,0.64,1);
}

/* Hover: icon lifts and brightens */
.pill-btn:hover .pill-icon {
  filter: brightness(0) saturate(100%) invert(55%) sepia(50%) saturate(500%) hue-rotate(190deg) brightness(110%);
  transform: translateY(-1px);
}

/* Active: icon becomes Blue 300 with a glow */
.pill-btn.active .pill-icon {
  filter: brightness(0) saturate(100%) invert(55%) sepia(60%) saturate(500%) hue-rotate(190deg) brightness(115%);
  transform: scale(1.12);
  filter: drop-shadow(0 2px 6px rgba(141,193,255,0.60))
          brightness(0) saturate(100%) invert(55%) sepia(60%) saturate(600%) hue-rotate(190deg) brightness(115%);
}

/* Label text — hidden by default, visible when active */
.pill-label {
  font-size: 10px;
  font-weight: 700;
  color: #A1A7BB;
  letter-spacing: 0.02em;
  line-height: 1;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.34,1.56,0.64,1), color 0.22s ease;
  white-space: nowrap;
}
.pill-btn.active .pill-label {
  opacity: 1;
  transform: translateY(0);
  color: #4E9FFF;
}

/* Active indicator dot */
.active-dot {
  width: 4px; height: 4px;
  border-radius: 50%;
  background: #8DC1FF;
  margin-top: 1px;
  opacity: 0;
  transform: scale(0);
  transition: opacity 0.22s ease, transform 0.30s cubic-bezier(0.34,1.56,0.64,1);
  box-shadow: 0 0 6px rgba(141,193,255,0.70);
}
.pill-btn.active .active-dot {
  opacity: 1;
  transform: scale(1);
}

/* Center featured button */
.pill-btn--center {
  background: #8DC1FF;
  padding: 17px;
  border-radius: 1.4rem;
  margin: 0 2px;
  box-shadow: 0 6px 20px rgba(141,193,255,0.50);
  transition: background 0.20s ease, transform 0.20s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.20s ease;
}
.pill-btn--center:hover {
  background: #4E9FFF;
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 28px rgba(78,159,255,0.50);
}
.pill-btn--center:active {
  transform: scale(0.90) !important;
  box-shadow: 0 3px 10px rgba(141,193,255,0.40);
}
.pill-icon--center {
  width: 28px; height: 28px;
  filter: brightness(0) invert(1);
  transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1);
}
.pill-btn--center:hover .pill-icon--center { transform: rotate(15deg) scale(1.1); }

/* Logged-in avatar bubble */
.pill-avatar {
  width: 26px; height: 26px;
  border-radius: 50%;
  background: #8DC1FF;
  color: #19213D;
  font-size: 11px;
  font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease;
}
.pill-btn.active .pill-avatar {
  transform: scale(1.10);
  box-shadow: 0 0 10px rgba(141,193,255,0.55);
}

/* ── Numpad modal slide-up ── */
.numpad-overlay {
  position: fixed;
  inset: 0;
  background: rgba(25,33,61,0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 200;
  display: flex;
  align-items: flex-end;
}

.numpad-sheet {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  background: #FFFFFF;
  border-radius: 28px 28px 0 0;
  padding: 8px 0 40px;
  box-shadow: 0 -8px 40px rgba(25,33,61,0.18);
}

.sheet-handle {
  width: 40px; height: 4px;
  background: #D7DBE7;
  border-radius: 99px;
  margin: 0 auto 16px;
}

.modal-slide-enter-active { transition: transform 0.34s cubic-bezier(0.34,1.56,0.64,1), opacity 0.22s ease; }
.modal-slide-leave-active  { transition: transform 0.24s ease, opacity 0.18s ease; }
.modal-slide-enter-from    { transform: translateY(100%); opacity: 0; }
.modal-slide-leave-to      { transform: translateY(100%); opacity: 0; }
</style>


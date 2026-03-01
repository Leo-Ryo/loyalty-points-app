<script setup>
import { ref, provide } from 'vue';
import KioskMain from './views/KioskMain.vue';
import InventoryView from './views/InventoryView.vue';
import OffersView from './views/OffersView.vue';
import AccountView from './views/AccountView.vue';
import KioskNavBar from './components/KioskNavBar.vue';
import LoginView from './views/LoginView.vue';

const activeTab = ref('home');

// ── Global auth state ──
const currentUser = ref(null);
const showLogin   = ref(false);

function handleLogin(user) {
  currentUser.value = user; // null = guest
  showLogin.value   = false;
}

function handleLogout() {
  currentUser.value = null;
}

// Navigate to account tab → show login if not signed in
function goToAccount() {
  if (!currentUser.value) {
    showLogin.value = true;
  } else {
    activeTab.value = 'account';
  }
}

// Provide auth state so child views can read/trigger it
provide('currentUser', currentUser);
provide('openLogin', () => { showLogin.value = true; });
provide('logout', handleLogout);
</script>

<template>
  <div class="min-h-screen bg-[#D4D4E0] text-gray-900 selection:bg-pastel-salmon selection:text-white">

    <!-- Login overlay (renders on top of everything) -->
    <Transition name="fade">
      <LoginView
        v-if="showLogin"
        @login="handleLogin"
        @register="handleLogin(null)"
      />
    </Transition>

    <!-- Page views -->
    <Transition name="fade" mode="out-in">
      <KioskMain     v-if="activeTab === 'home'"      key="home" />
      <InventoryView v-else-if="activeTab === 'inventory'" key="inventory" />
      <OffersView    v-else-if="activeTab === 'offers'"    key="offers" />
      <AccountView   v-else-if="activeTab === 'account'"   key="account" />
    </Transition>

    <!-- Nav bar -->
    <KioskNavBar
      :active-tab="activeTab"
      @update:active-tab="(tab) => {
        if (tab === 'account') { goToAccount(); }
        else { activeTab = tab; }
      }"
    />

  </div>
</template>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
</style>

<script setup>
import { ref, provide } from 'vue';
import LoginView from './views/kiosk/LoginView.vue';

// ── Global App State ──
const cart = ref([]);
const currentUser = ref(null);
const showLogin   = ref(false);

function handleLogin(user) {
  currentUser.value = user; // null = guest
  showLogin.value   = false;
}

function handleLogout() {
  currentUser.value = null;
}

// Global login modal flow (can be refactored eventually if Staff needs separate login)

// Provide auth & cart state so child views can read/trigger it
provide('currentUser', currentUser);
provide('openLogin', () => { showLogin.value = true; });
provide('logout', handleLogout);
provide('cart', cart);
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

    <!-- Router controls the full page layout (Kiosk vs Staff) -->
    <router-view />

  </div>
</template>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
</style>

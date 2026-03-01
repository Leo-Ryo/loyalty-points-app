<script setup>
import { computed, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import KioskNavBar from '../components/kiosk/KioskNavBar.vue';
import ShoppingCart from '../components/kiosk/ShoppingCart.vue';

const route = useRoute();
const router = useRouter();

const currentUser = inject('currentUser');
const openLogin = inject('openLogin');

const activeTab = computed(() => {
  if (route.path.includes('/inventory')) return 'inventory';
  if (route.path.includes('/offers')) return 'offers';
  if (route.path.includes('/account')) return 'account';
  return 'home';
});

function handleTabChange(tab) {
  if (tab === 'account' && !currentUser.value) {
    openLogin();
  }
  
  if (tab === 'home') router.push('/');
  else router.push(`/${tab}`);
}
</script>

<template>
  <div class="h-full w-full relative">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <KioskNavBar
      :active-tab="activeTab"
      @update:active-tab="handleTabChange"
    />
    
    <ShoppingCart />
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
</style>

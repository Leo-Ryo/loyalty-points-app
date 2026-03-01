<script setup>
import { useRoute } from 'vue-router';
const route = useRoute();

const menuItems = [
  { name: 'Dashboard', path: '/staff', icon: '📊' },
  { name: 'Trade Requests', path: '/staff/trades', icon: '🔄' },
  { name: 'Customers', path: '/staff/customers', icon: '👥' },
  { name: 'Inventory', path: '/staff/inventory', icon: '🍷' },
  { name: 'Offers', path: '/staff/offers', icon: '🎁' },
  { name: 'Reports', path: '/staff/reports', icon: '📈' },
];

function isMatch(itemPath) {
  if (itemPath === '/staff') return route.path === '/staff';
  return route.path.startsWith(itemPath);
}
</script>

<template>
  <aside class="w-64 bg-white border-r border-gray-100 flex flex-col h-full">
    <!-- Logo area -->
    <div class="h-16 flex items-center px-6 border-b border-gray-100 shrink-0">
      <div class="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center shadow-sm mr-3">
        <span class="text-white text-sm">🍷</span>
      </div>
      <span class="font-black text-gray-900 tracking-tight">Staff Panel</span>
    </div>

    <!-- Nav links -->
    <nav class="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
        :class="isMatch(item.path) ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
      >
        <span class="text-lg mr-3" :class="isMatch(item.path) ? 'opacity-100' : 'opacity-70'">{{ item.icon }}</span>
        {{ item.name }}
      </router-link>
    </nav>
  </aside>
</template>

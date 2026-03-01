<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const pageTitle = computed(() => {
  const path = route.path;
  if (path.includes('/trades')) return 'Trade Requests';
  if (path.includes('/customers')) return 'Customers';
  if (path.includes('/inventory')) return 'Inventory Management';
  if (path.includes('/offers')) return 'Offers Configuration';
  if (path.includes('/reports')) return 'Analytics & Reports';
  return 'Overview';
});
</script>

<template>
  <header class="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 z-10">
    <h2 class="text-xl font-bold text-gray-900 tracking-tight">{{ pageTitle }}</h2>
    
    <div class="flex items-center gap-4">
      <div class="flex flex-col items-end">
        <span class="text-xs font-bold text-gray-900 leading-none">Admin User</span>
        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manager</span>
      </div>
      <div class="h-9 w-9 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center text-sm font-black text-gray-500 shadow-sm">
        AD
      </div>
    </div>
  </header>
</template>

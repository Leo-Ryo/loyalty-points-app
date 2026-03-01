<script setup>
const props = defineProps({
  activeTab: { type: String, default: 'home' }
});

const emit = defineEmits(['update:activeTab']);

const navItems = [
  { id: 'home',      label: 'Home',       icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'inventory', label: 'Inventory',  icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { id: 'offers',    label: 'Offers',     icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'account',   label: 'Account',    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
];
</script>

<template>
  <nav class="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
    <div class="flex items-center px-2 py-1.5 rounded-full bg-[#1C1C2E]/90 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.25)]">

      <button
        v-for="item in navItems"
        :key="item.id"
        @click="emit('update:activeTab', item.id)"
        class="flex flex-col items-center justify-center gap-0.5 w-16 sm:w-20 h-12 rounded-full transition-all duration-200 cursor-pointer"
        :class="activeTab === item.id ? 'text-pastel-salmon' : 'text-white/40 hover:text-white/60'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
        </svg>
        <span class="text-[10px] font-semibold leading-none">{{ item.label }}</span>
      </button>

    </div>
  </nav>
</template>

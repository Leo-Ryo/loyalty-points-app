<script setup>
</script>

<template>
  <div class="p-8 pb-32">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-black text-gray-900 tracking-tight">Analytics & Reports</h1>
        <p class="text-sm font-medium text-gray-400 mt-1">Performance metrics and trade history.</p>
      </div>
      <button class="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-sm px-5 py-2.5 rounded-xl transition active:scale-95 flex items-center gap-2">
        <span>↓</span> Export CSV
      </button>
    </div>

    <div class="grid grid-cols-3 gap-6 mb-8">
      <!-- Metric Cards Placeholder -->
      <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-32" v-for="i in 3" :key="i">
        <div class="w-8 h-2 bg-gray-100 rounded-full mb-auto"></div>
        <div class="w-full h-8 bg-gray-50 rounded-lg mt-4"></div>
      </div>
    </div>
  </div>
</template>

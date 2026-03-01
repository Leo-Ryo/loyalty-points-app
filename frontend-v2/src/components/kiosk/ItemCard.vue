<script setup>
import { computed } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  userPoints: {
    type: Number,
    default: 0,
  }
});

const emit = defineEmits(['view-details', 'quick-redeem']);

import { inject } from 'vue';
const openLogin = inject('openLogin');
const cart = inject('cart');

function addToCart(item) {
  cart.value.push(item);
  emit('quick-redeem', item); // keep the emit just in case
}

const isAvailable = computed(() => props.item.stock > 0);
const isLimited = computed(() => props.item.stock > 0 && props.item.stock <= 5);
const canAfford = computed(() => props.isLoggedIn && props.userPoints >= props.item.pointsCost);

const availabilityConfig = computed(() => {
  if (!isAvailable.value) return { label: 'Out of Stock', bg: 'bg-gray-100', text: 'text-gray-400', dot: 'bg-gray-300' };
  if (isLimited.value)    return { label: `Only ${props.item.stock} left`, bg: 'bg-pastel-pink/40', text: 'text-rose-600', dot: 'bg-rose-400 animate-pulse' };
  return { label: 'Available', bg: 'bg-pastel-mint/60', text: 'text-emerald-700', dot: 'bg-emerald-400' };
});
</script>

<template>
  <!-- ─── Item Card: [ Image ] | [ Info ] | [ Action ] ─── -->
  <div
    class="group flex items-stretch bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-glass-hover hover:-translate-y-0.5 border border-gray-100"
    :class="{ 'opacity-60 grayscale': !isAvailable }"
  >

    <!-- ① IMAGE SECTION -->
    <div class="relative w-28 sm:w-32 flex-shrink-0 bg-gray-50 flex items-center justify-center overflow-hidden">
      <img
        v-if="item.image"
        :src="item.image"
        :alt="item.name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <span v-else class="text-5xl select-none">🍷</span>

      <!-- Limited badge ribbon -->
      <div
        v-if="isLimited && isAvailable"
        class="absolute top-2 left-0 bg-pastel-salmon text-white text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-r-full shadow-sm"
      >
        Limited
      </div>
    </div>

    <!-- ② INFO SECTION -->
    <div class="flex-1 min-w-0 px-4 py-3 flex flex-col justify-between">
      <!-- Name & Description -->
      <div>
        <h3 class="font-bold text-gray-900 text-base leading-tight truncate group-hover:text-pastel-salmon transition-colors">
          {{ item.name }}
        </h3>
        <p class="text-xs text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">{{ item.description }}</p>
      </div>

      <!-- Trade Value + Availability Badge -->
      <div class="flex items-center gap-3 mt-2.5 flex-wrap">
        <!-- Points Cost -->
        <div class="flex items-baseline gap-1">
          <span class="text-xl font-extrabold text-pastel-salmon tracking-tight">{{ item.pointsCost.toLocaleString() }}</span>
          <span class="text-xs font-semibold text-pastel-salmon/60 uppercase tracking-widest">pts</span>
        </div>

        <!-- Availability Badge -->
        <span :class="[availabilityConfig.bg, availabilityConfig.text, 'flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full']">
          <span :class="[availabilityConfig.dot, 'w-1.5 h-1.5 rounded-full inline-block']"></span>
          {{ availabilityConfig.label }}
        </span>
      </div>

      <!-- Logged-in: points progress bar -->
      <div v-if="isLoggedIn && isAvailable" class="mt-2">
        <div class="flex justify-between items-center mb-1">
          <span class="text-[10px] text-gray-400 font-medium">Your points</span>
          <span class="text-[10px] font-bold" :class="canAfford ? 'text-emerald-500' : 'text-gray-400'">
            {{ userPoints.toLocaleString() }} / {{ item.pointsCost.toLocaleString() }}
          </span>
        </div>
        <div class="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-700"
            :class="canAfford ? 'bg-pastel-salmon' : 'bg-pastel-peri'"
            :style="{ width: Math.min((userPoints / item.pointsCost) * 100, 100) + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- ③ ACTION SECTION -->
    <div class="flex-shrink-0 w-[88px] sm:w-24 flex flex-col items-center justify-center gap-2 px-2 py-3 border-l border-gray-100">

      <!-- View Details (always visible) -->
      <button
        @click="emit('view-details', item)"
        class="w-full text-center text-xs font-bold text-gray-500 hover:text-pastel-salmon transition-colors py-1.5 px-1 rounded-lg hover:bg-pastel-pink/10"
      >
        Details
      </button>

      <!-- Can't afford let -->
      <div v-if="isLoggedIn && isAvailable && !canAfford" class="w-full">
        <button disabled class="w-full flex flex-col items-center justify-center bg-gray-100 text-gray-400 font-bold text-[11px] rounded-xl py-2 cursor-not-allowed gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          <span>Need<br/>{{ (item.pointsCost - userPoints).toLocaleString() }} more</span>
        </button>
      </div>

      <!-- Guest / Logged in & can afford -->
      <div v-else-if="isAvailable" class="w-full">
        <button
          @click="addToCart(item)"
          class="w-full flex flex-col items-center justify-center bg-pastel-salmon hover:bg-[#F97B8F] text-white font-bold text-[11px] rounded-xl py-2 shadow-salmon transition-all duration-200 active:scale-95 gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          <span>Add</span>
        </button>
      </div>

    </div>
  </div>
</template>

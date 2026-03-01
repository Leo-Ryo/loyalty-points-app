<script setup>
import { computed } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  }
});

// Determine badge based on stock
const isAvailable = computed(() => props.item.stock > 0);
const isLimited = computed(() => props.item.stock > 0 && props.item.stock <= 5);
</script>

<template>
  <div class="group relative bg-white squircle p-4 transition-all duration-300 hover:shadow-glass-hover hover:-translate-y-1 overflow-hidden cursor-pointer flex flex-col h-full">
    
    <!-- Badges Container -->
    <div class="absolute top-4 left-4 right-4 flex justify-between items-start z-10 pointer-events-none">
      <!-- Availability Badge -->
      <span v-if="isAvailable" class="px-3 py-1 bg-pastel-mint text-emerald-800 text-xs font-semibold rounded-full shadow-sm backdrop-blur-md bg-opacity-90">
        Available
      </span>
      <span v-else class="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-semibold rounded-full shadow-sm backdrop-blur-md bg-opacity-90">
        Out of Stock
      </span>

      <!-- Limited Stock Badge -->
      <span v-if="isLimited" class="px-3 py-1 bg-pastel-pink text-rose-800 text-xs font-bold rounded-full shadow-sm animate-pulse backdrop-blur-md bg-opacity-90">
        Only {{ item.stock }} left!
      </span>
    </div>

    <!-- Image Area -->
    <div class="aspect-square w-full rounded-2xl bg-gray-50 mb-4 overflow-hidden relative flex items-center justify-center">
      <img v-if="item.image" :src="item.image" :alt="item.name" class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
      <div v-else class="text-4xl text-pastel-peri opacity-50 font-weight-bold">🍷</div>
    </div>

    <!-- Content Area -->
    <div class="flex-grow flex flex-col">
      <h3 class="font-bold text-lg leading-tight mb-1 text-gray-900 group-hover:text-pastel-salmon transition-colors">{{ item.name }}</h3>
      <p class="text-sm text-gray-500 line-clamp-2 mb-4">{{ item.description }}</p>

      <div class="mt-auto flex items-end justify-between">
        <div>
          <span class="text-xs text-gray-400 font-medium uppercase tracking-wider block mb-0.5">Trade Value</span>
          <span class="text-xl font-extrabold text-pastel-salmon">{{ item.pointsCost }} <span class="text-sm text-pastel-salmon/70 font-bold">pts</span></span>
        </div>
      </div>
    </div>

    <!-- Hover Reveal Action (View Details / Redeem) -->
    <div class="absolute inset-x-0 bottom-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-20">
      <button class="w-full bg-pastel-salmon hover:bg-[#F97B8F] text-white font-bold py-3 rounded-xl shadow-salmon transform transition hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2">
        <span>View Details</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
    
    <!-- Gradient overlay on hover to make text/button pop -->
    <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"></div>
  </div>
</template>

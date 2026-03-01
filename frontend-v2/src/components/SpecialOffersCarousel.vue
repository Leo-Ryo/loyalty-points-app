<script setup>
const offers = [
  {
    id: 1,
    title: 'Double Points Weekend!',
    subtitle: 'Earn 2x points on all purchases',
    bgColor: 'bg-pastel-peri',
    textColor: 'text-indigo-900',
    icon: '✨'
  },
  {
    id: 2,
    title: 'Limited Time Boost',
    subtitle: 'Trade your points for 1.5x value on select wines',
    bgColor: 'bg-pastel-mint',
    textColor: 'text-emerald-900',
    icon: '⚡'
  },
  {
    id: 3,
    title: 'New Member Bonus',
    subtitle: 'Sign up today and get 500 bonus points',
    bgColor: 'bg-pastel-pink',
    textColor: 'text-rose-900',
    icon: '🎁'
  }
];
</script>

<template>
  <div class="relative w-full overflow-hidden py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
    <!-- Horizontal smooth scroll container -->
    <div class="flex space-x-4 overflow-x-auto hide-scrollbar pb-4 snap-x snap-mandatory">
      
      <div 
        v-for="offer in offers" 
        :key="offer.id" 
        :class="[offer.bgColor, 'min-w-[85vw] sm:min-w-[320px] lg:min-w-[400px] h-40 squircle p-6 flex items-center justify-between snap-center shadow-sm cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden group']"
      >
        <!-- Background decoration -->
        <div class="absolute -right-10 -bottom-10 opacity-20 text-[100px] transform group-hover:scale-110 transition-transform duration-500">
          {{ offer.icon }}
        </div>
        
        <div class="relative z-10 w-2/3">
          <span class="inline-block px-2 py-1 bg-white/40 backdrop-blur-md rounded-lg text-xs font-bold uppercase tracking-wider mb-2" :class="offer.textColor">Special Offer</span>
          <h3 class="text-xl sm:text-2xl font-black mb-1 leading-tight" :class="offer.textColor">{{ offer.title }}</h3>
          <p class="text-sm opacity-90 font-medium" :class="offer.textColor">{{ offer.subtitle }}</p>
        </div>
        
        <div class="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center relative z-10 group-hover:bg-white/50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="offer.textColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      
    </div>
  </div>
</template>

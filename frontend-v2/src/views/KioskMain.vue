<script setup>
import { ref } from 'vue';
import SpecialOffersCarousel from '../components/SpecialOffersCarousel.vue';
import OfferCard from '../components/OfferCard.vue';

// Mock Data for the Offer Grid
const inventory = ref([
  {
    id: 1,
    name: 'Cabernet Sauvignon Reserve',
    description: 'A full-bodied red wine with dark fruit flavors and a hint of oak.',
    pointsCost: 1500,
    stock: 12,
    image: null // We'll just show the placeholder emoji
  },
  {
    id: 2,
    name: 'Chardonnay Estate 1998',
    description: 'Crisp and elegant white wine featuring notes of crisp apple and pear.',
    pointsCost: 2000,
    stock: 3, // Limited stock trigger
    image: null
  },
  {
    id: 3,
    name: 'Merlot Classic',
    description: 'Smooth red wine with plum and cherry aromas. Perfect for dinner.',
    pointsCost: 800,
    stock: 0, // Out of stock trigger
    image: null
  },
  {
    id: 4,
    name: 'Pinot Noir Select',
    description: 'Light-bodied red wine with delicate strawberry and earth notes.',
    pointsCost: 1200,
    stock: 24,
    image: null
  },
  {
    id: 5,
    name: 'Sparkling Rosé',
    description: 'Festive and bubbly with hints of fresh strawberries and cream.',
    pointsCost: 3500,
    stock: 2,
    image: null
  },
  {
    id: 6,
    name: 'Sauvignon Blanc',
    description: 'Zesty and refreshing with bright citrus and herbal characteristics.',
    pointsCost: 900,
    stock: 45,
    image: null
  }
]);
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-28">
    
    <!-- Header Area -->
    <header class="mb-8 flex justify-between items-end">
      <div>
        <h1 class="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-2">Welcome! 👋</h1>
        <p class="text-lg text-gray-500 font-medium">Discover your rewards and special offers.</p>
      </div>
      
      <!-- Login Kiosk Button -->
      <button class="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition hover:scale-105 active:scale-95 flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
        </svg>
        <span>Sign In</span>
      </button>
    </header>

    <!-- Carousel Section -->
    <section class="mb-12">
      <SpecialOffersCarousel />
    </section>

    <!-- Offer Grid Section -->
    <section>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Available Rewards</h2>
        <div class="flex space-x-2">
          <!-- Simple Filter Pills -->
          <button class="px-4 py-1.5 bg-gray-900 text-white text-sm font-bold rounded-full shadow-sm">All</button>
          <button class="px-4 py-1.5 bg-white text-gray-600 border border-gray-200 hover:border-gray-300 text-sm font-bold rounded-full shadow-sm transition-colors">Wines</button>
          <button class="px-4 py-1.5 bg-white text-gray-600 border border-gray-200 hover:border-gray-300 text-sm font-bold rounded-full shadow-sm transition-colors">Merch</button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <OfferCard 
          v-for="item in inventory" 
          :key="item.id" 
          :item="item" 
        />
      </div>
    </section>

  </div>

</template>

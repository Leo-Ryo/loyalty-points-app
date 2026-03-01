<script setup>
import { ref, computed, inject } from 'vue';
import ItemCard from '../../components/kiosk/ItemCard.vue';

// ── Auth State ──
const currentUser = inject('currentUser');
const isLoggedIn = computed(() => !!currentUser.value);
const userPoints = computed(() => currentUser.value ? (currentUser.value.points || 0) : 0);

// ── Inventory mock data ──
const allItems = ref([
  { id: 1, name: 'Cabernet Sauvignon Reserve', description: 'A bold, full-bodied red with dark fruit, cedar, and a long finish.', pointsCost: 1500, stock: 12, category: 'Red', image: null },
  { id: 2, name: 'Chardonnay Estate 1998',     description: 'Crisp apple and pear notes with a hint of vanilla oak. Gold medal winner.', pointsCost: 2000, stock: 3, category: 'White', image: null },
  { id: 3, name: 'Merlot Classic',             description: 'Smooth plum and cherry aromas. Perfect for an easy dinner.', pointsCost: 800,  stock: 0, category: 'Red',   image: null },
  { id: 4, name: 'Pinot Noir Select',          description: 'Light-bodied and elegant, with strawberry and earthy characteristics.', pointsCost: 1200, stock: 24, category: 'Red',   image: null },
  { id: 5, name: 'Sparkling Rosé',             description: 'Festive and bubbly with fresh strawberry and cream on the finish.', pointsCost: 3500, stock: 2, category: 'Rosé',  image: null },
  { id: 6, name: 'Sauvignon Blanc',            description: 'Zesty citrus with bright herbal notes. Ideal for warm evenings.', pointsCost: 900,  stock: 45, category: 'White', image: null },
  { id: 7, name: 'Prosecco DOC',               description: 'Light and refreshing Italian sparkler. Perfect for celebrations.', pointsCost: 1100, stock: 8, category: 'Sparkling', image: null },
  { id: 8, name: 'Shiraz Reserve',             description: 'Rich, peppery, and bold. Australian single estate.', pointsCost: 2200, stock: 6, category: 'Red', image: null },
]);

// ── Filters ──
const searchQuery   = ref('');
const activeCategory = ref('All');
const sortBy        = ref('default');

const categories = computed(() => ['All', ...new Set(allItems.value.map(i => i.category))]);

const filteredItems = computed(() => {
  let items = allItems.value;
  if (activeCategory.value !== 'All')
    items = items.filter(i => i.category === activeCategory.value);
  if (searchQuery.value.trim())
    items = items.filter(i =>
      i.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      i.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  if (sortBy.value === 'points-asc')  return [...items].sort((a, b) => a.pointsCost - b.pointsCost);
  if (sortBy.value === 'points-desc') return [...items].sort((a, b) => b.pointsCost - a.pointsCost);
  if (sortBy.value === 'available')   return [...items].sort((a, b) => b.stock - a.stock);
  return items;
});

const availableCount = computed(() => filteredItems.value.filter(i => i.stock > 0).length);
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-32">

    <!-- ── Page Header ── -->
    <header class="mb-6">
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-3xl font-black text-gray-900 tracking-tight">Inventory</h1>
          <p class="text-sm text-gray-400 mt-1 font-medium">
            {{ availableCount }} item{{ availableCount !== 1 ? 's' : '' }} available to trade
          </p>
        </div>

        <!-- ── User Balance ── -->
        <div class="flex flex-col items-end gap-1">
          <span v-if="isLoggedIn" class="text-sm font-bold bg-white px-4 py-2 rounded-xl shadow-glass border border-gray-100 text-gray-600">
            Balance: <strong class="text-pastel-salmon">{{ userPoints.toLocaleString() }} pts</strong>
          </span>
        </div>
      </div>
    </header>

    <!-- ── Search Bar ── -->
    <div class="relative mb-4">
      <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
      </svg>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search wines, descriptions..."
        class="w-full bg-white border border-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm placeholder-gray-300 text-gray-800 font-medium shadow-glass focus:outline-none focus:ring-2 focus:ring-pastel-peri/40 focus:border-pastel-peri transition"
      />
    </div>

    <!-- ── Category Pills + Sort ── -->
    <div class="flex items-center justify-between mb-6 gap-2">
      <div class="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="activeCategory = cat"
          class="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200"
          :class="activeCategory === cat
            ? 'bg-gray-900 text-white shadow-sm'
            : 'bg-white text-gray-500 border border-gray-100 hover:border-gray-300'"
        >
          {{ cat }}
        </button>
      </div>

      <select
        v-model="sortBy"
        class="flex-shrink-0 text-xs font-bold bg-white border border-gray-100 rounded-xl px-3 py-2 text-gray-600 shadow-glass focus:outline-none focus:ring-2 focus:ring-pastel-peri/40 cursor-pointer"
      >
        <option value="default">Default</option>
        <option value="points-asc">Cheapest first</option>
        <option value="points-desc">Priciest first</option>
        <option value="available">Available first</option>
      </select>
    </div>

    <!-- ── Item List ── -->
    <div class="flex flex-col gap-3">
      <transition-group name="list" tag="div" class="flex flex-col gap-3">
        <ItemCard
          v-for="item in filteredItems"
          :key="item.id"
          :item="item"
          :is-logged-in="isLoggedIn"
          :user-points="userPoints"
          @view-details="(i) => console.log('View details:', i.name)"
          @quick-redeem="(i) => console.log('Redeem:', i.name)"
        />
      </transition-group>

      <!-- Empty state -->
      <div v-if="filteredItems.length === 0" class="text-center py-16 text-gray-300">
        <div class="text-6xl mb-4">🔍</div>
        <p class="font-bold text-gray-400">No items match your search</p>
        <p class="text-sm mt-1">Try a different filter or keyword</p>
      </div>
    </div>

  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.25s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.list-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

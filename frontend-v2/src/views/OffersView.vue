<script setup>
import { ref, computed } from 'vue';

// ── Demo toggle ──
const isLoggedIn = ref(false);
const userTier   = ref('silver'); // 'none' | 'silver' | 'gold'
const isNewUser  = ref(true);

// ── Offer config per type ──
const offerTypeConfig = {
  double_points:    { icon: '⚡', label: 'Double Points',    bg: 'from-pastel-peri to-pastel-blue',         text: 'text-indigo-900', badge: 'bg-indigo-100 text-indigo-700' },
  bonus_points:     { icon: '🎁', label: 'Bonus Points',     bg: 'from-pastel-mint to-pastel-mint-light',   text: 'text-emerald-900', badge: 'bg-emerald-100 text-emerald-700' },
  category_boost:   { icon: '🍷', label: 'Category Boost',   bg: 'from-pastel-pink to-pastel-blue',         text: 'text-rose-900',    badge: 'bg-rose-100 text-rose-700' },
  tier_bonus:       { icon: '👑', label: 'Tier Bonus',       bg: 'from-yellow-100 to-amber-50',             text: 'text-amber-900',   badge: 'bg-amber-100 text-amber-700' },
  inventory_boost:  { icon: '📦', label: 'Inventory Boost',  bg: 'from-pastel-salmon/40 to-pastel-pink/30', text: 'text-rose-900',    badge: 'bg-rose-100 text-rose-700' },
  first_trade:      { icon: '🌟', label: 'First Trade',      bg: 'from-purple-100 to-pastel-peri/40',       text: 'text-purple-900',  badge: 'bg-purple-100 text-purple-700' },
};

// ── Mock data ──
const offers = ref([
  {
    id: 1,
    type: 'double_points',
    title: 'Double Points Weekend',
    subtitle: 'Earn 2× points on every purchase this weekend only.',
    multiplier: 2,
    endDate: '2026-03-03T23:59:00',
    requiresLogin: false,
    requiresTier: null,
    requiresFirstTrade: false,
  },
  {
    id: 2,
    type: 'first_trade',
    title: 'First Trade Bonus',
    subtitle: 'Brand new? Get 500 bonus points on your very first trade.',
    bonusAmount: 500,
    endDate: null,
    requiresLogin: true,
    requiresTier: null,
    requiresFirstTrade: true,
  },
  {
    id: 3,
    type: 'bonus_points',
    title: '+150 Bonus Points',
    subtitle: 'Trade any item today and receive an extra 150 points on top.',
    bonusAmount: 150,
    endDate: '2026-03-05T23:59:00',
    requiresLogin: true,
    requiresTier: null,
    requiresFirstTrade: false,
  },
  {
    id: 4,
    type: 'category_boost',
    title: 'Red Wine Boost',
    subtitle: 'Earn 1.5× points when redeeming anything in the Red wine category.',
    multiplier: 1.5,
    category: 'Red',
    endDate: '2026-03-08T23:59:00',
    requiresLogin: false,
    requiresTier: null,
    requiresFirstTrade: false,
  },
  {
    id: 5,
    type: 'tier_bonus',
    title: 'Gold Member Perk',
    subtitle: 'Gold members earn 25% extra points on all trades this month.',
    multiplier: 1.25,
    endDate: '2026-03-31T23:59:00',
    requiresLogin: true,
    requiresTier: 'gold',
    requiresFirstTrade: false,
  },
  {
    id: 6,
    type: 'inventory_boost',
    title: 'Sparkling Rosé Boost',
    subtitle: 'Trade for the Sparkling Rosé now — earn 200 extra bonus points. Limited to 10 trades.',
    bonusAmount: 200,
    stockLimit: 10,
    stockRemaining: 4,
    endDate: null,
    requiresLogin: true,
    requiresTier: null,
    requiresFirstTrade: false,
  },
]);

// ── Helpers ──
function isUnlocked(offer) {
  if (offer.requiresLogin && !isLoggedIn.value) return false;
  if (offer.requiresTier && userTier.value !== offer.requiresTier) return false;
  if (offer.requiresFirstTrade && !isNewUser.value) return false;
  return true;
}

function timeLeft(endDate) {
  if (!endDate) return null;
  const diff = new Date(endDate) - new Date();
  if (diff <= 0) return 'Expired';
  const days = Math.floor(diff / 86400000);
  const hrs  = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return `${days}d ${hrs}h left`;
  const mins = Math.floor((diff % 3600000) / 60000);
  return `${hrs}h ${mins}m left`;
}

// Sort: unlocked first
const sortedOffers = computed(() =>
  [...offers.value].sort((a, b) => Number(isUnlocked(b)) - Number(isUnlocked(a)))
);
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-32">

    <!-- ── Header ── -->
    <header class="mb-6">
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-3xl font-black text-gray-900 tracking-tight">Offers</h1>
          <p class="text-sm text-gray-400 mt-1 font-medium">Exclusive deals &amp; point boosts</p>
        </div>

        <!-- Demo toggle -->
        <div class="flex flex-col items-end gap-2">
          <div @click="isLoggedIn = !isLoggedIn" class="flex items-center gap-2 cursor-pointer bg-white rounded-xl px-3 py-2 border border-gray-100 shadow-glass transition-all select-none">
            <div class="w-8 h-5 rounded-full transition-all duration-300 flex items-center px-0.5" :class="isLoggedIn ? 'bg-pastel-salmon' : 'bg-gray-200'">
              <div class="w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300" :class="isLoggedIn ? 'translate-x-3' : ''"></div>
            </div>
            <span class="text-xs font-bold" :class="isLoggedIn ? 'text-pastel-salmon' : 'text-gray-400'">{{ isLoggedIn ? 'Logged in' : 'Guest' }}</span>
          </div>
          <div v-if="isLoggedIn" @click="userTier = userTier === 'gold' ? 'silver' : 'gold'" class="text-[11px] text-gray-400 cursor-pointer hover:text-gray-600 select-none">
            Tier: <strong class="text-amber-500">{{ userTier }}</strong> (tap to toggle)
          </div>
        </div>
      </div>
    </header>

    <!-- ── Hero Banner: top active offer ── -->
    <div v-if="sortedOffers.length" class="mb-6">
      <div
        :class="`bg-gradient-to-br ${offerTypeConfig[sortedOffers[0].type].bg} rounded-2xl p-6 relative overflow-hidden shadow-glass`"
      >
        <!-- Background decoration -->
        <div class="absolute -right-6 -bottom-6 text-[90px] opacity-15 select-none pointer-events-none">
          {{ offerTypeConfig[sortedOffers[0].type].icon }}
        </div>
        <div class="relative z-10">
          <span :class="`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full mb-3 ${offerTypeConfig[sortedOffers[0].type].badge}`">
            {{ offerTypeConfig[sortedOffers[0].type].icon }} {{ offerTypeConfig[sortedOffers[0].type].label }}
          </span>
          <h2 :class="`text-2xl font-black mb-1 leading-tight ${offerTypeConfig[sortedOffers[0].type].text}`">
            {{ sortedOffers[0].title }}
          </h2>
          <p :class="`text-sm mb-4 opacity-80 font-medium ${offerTypeConfig[sortedOffers[0].type].text}`">
            {{ sortedOffers[0].subtitle }}
          </p>
          <div class="flex items-center gap-3">
            <button
              v-if="isUnlocked(sortedOffers[0])"
              class="px-5 py-2 bg-gray-900 text-white font-bold text-sm rounded-full shadow-sm hover:bg-gray-800 transition active:scale-95"
            >
              Claim Now
            </button>
            <button
              v-else
              @click="isLoggedIn = true"
              class="px-5 py-2 bg-white/60 backdrop-blur-sm text-gray-700 font-bold text-sm rounded-full hover:bg-white/80 transition active:scale-95"
            >
              Sign in to unlock
            </button>
            <span v-if="timeLeft(sortedOffers[0].endDate)" class="text-xs font-bold opacity-70" :class="offerTypeConfig[sortedOffers[0].type].text">
              ⏳ {{ timeLeft(sortedOffers[0].endDate) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Offer List ── -->
    <div class="flex flex-col gap-3">
      <div
        v-for="offer in sortedOffers.slice(1)"
        :key="offer.id"
        class="bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300"
        :class="isUnlocked(offer) ? 'hover:shadow-glass-hover hover:-translate-y-0.5' : 'opacity-60'"
      >
        <div class="flex items-stretch">

          <!-- Color side bar -->
          <div :class="`w-1.5 flex-shrink-0 bg-gradient-to-b ${offerTypeConfig[offer.type].bg}`"></div>

          <!-- Content -->
          <div class="flex-1 px-4 py-3.5">
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1 min-w-0">
                <!-- Type badge -->
                <span :class="`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5 ${offerTypeConfig[offer.type].badge}`">
                  {{ offerTypeConfig[offer.type].icon }} {{ offerTypeConfig[offer.type].label }}
                </span>
                <h3 class="font-bold text-gray-900 text-sm leading-snug">{{ offer.title }}</h3>
                <p class="text-xs text-gray-400 mt-0.5 leading-relaxed">{{ offer.subtitle }}</p>

                <!-- Meta tags row -->
                <div class="flex flex-wrap gap-2 mt-2">
                  <span v-if="timeLeft(offer.endDate)" class="text-[10px] font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                    ⏳ {{ timeLeft(offer.endDate) }}
                  </span>
                  <span v-if="offer.stockRemaining != null" class="text-[10px] font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                    📦 {{ offer.stockRemaining }} / {{ offer.stockLimit }} remaining
                  </span>
                  <span v-if="offer.requiresTier" class="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    👑 {{ offer.requiresTier.charAt(0).toUpperCase() + offer.requiresTier.slice(1) }} only
                  </span>
                  <span v-if="offer.requiresFirstTrade" class="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                    🌟 New members only
                  </span>
                </div>
              </div>

              <!-- Action -->
              <div class="flex-shrink-0 flex flex-col items-center justify-center pt-1">
                <!-- Value bubble -->
                <div class="text-center mb-2">
                  <span v-if="offer.multiplier" class="text-2xl font-black text-pastel-salmon leading-none">{{ offer.multiplier }}×</span>
                  <span v-else-if="offer.bonusAmount" class="text-xl font-black text-pastel-salmon leading-none">+{{ offer.bonusAmount }}</span>
                  <span v-if="offer.bonusAmount" class="block text-[9px] font-bold text-pastel-salmon/60 uppercase tracking-wider">pts</span>
                </div>

                <button
                  v-if="isUnlocked(offer)"
                  class="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-[11px] rounded-full transition active:scale-95 whitespace-nowrap"
                >
                  Claim
                </button>
                <button
                  v-else-if="!isLoggedIn"
                  @click="isLoggedIn = true"
                  class="px-3 py-1.5 bg-pastel-blue hover:bg-pastel-peri/60 text-indigo-700 font-bold text-[11px] rounded-full transition active:scale-95 whitespace-nowrap"
                >
                  Sign in
                </button>
                <span v-else class="text-[10px] text-gray-300 font-semibold text-center">Locked</span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

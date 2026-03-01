<script setup>
import { ref, computed, inject } from 'vue';

// ── Injected global auth ──
const currentUser = inject('currentUser');
const openLogin   = inject('openLogin');
const logout      = inject('logout');

const isLoggedIn  = computed(() => !!currentUser.value);
const customer    = computed(() => currentUser.value || {});
const isEditing   = ref(false);
const editForm    = ref({ name: '', email: '', phone: '' });

function startEdit() {
  editForm.value = { name: customer.value.name, email: customer.value.email, phone: customer.value.phone || '' };
  isEditing.value = true;
}
function saveEdit() {
  // In real app: call API. For mock, mutate directly.
  currentUser.value.name  = editForm.value.name;
  currentUser.value.email = editForm.value.email;
  currentUser.value.phone = editForm.value.phone;
  isEditing.value = false;
}

// ── Tier config ──
const tierConfig = {
  none:   { label: 'Member',      emoji: '⚪', nextTier: 'Bronze', nextAt: 1000,  color: 'text-gray-500',   bg: 'bg-gray-100',  bar: 'bg-gray-400'   },
  bronze: { label: 'Bronze',      emoji: '🥉', nextTier: 'Silver', nextAt: 3000,  color: 'text-orange-600', bg: 'bg-orange-50', bar: 'bg-orange-400' },
  silver: { label: 'Silver',      emoji: '🥈', nextTier: 'Gold',   nextAt: 8000,  color: 'text-slate-600',  bg: 'bg-slate-100', bar: 'bg-slate-400'  },
  gold:   { label: 'Gold Member', emoji: '🥇', nextTier: null,     nextAt: null,  color: 'text-amber-600',  bg: 'bg-amber-50',  bar: 'bg-amber-400'  },
};
const tier         = computed(() => tierConfig[customer.value.tier || 'none']);
const tierProgress = computed(() => !tier.value.nextAt ? 100 : Math.min(((customer.value.lifetimePoints || 0) / tier.value.nextAt) * 100, 100));
const pointsToNext = computed(() => !tier.value.nextAt ? 0 : Math.max(tier.value.nextAt - (customer.value.lifetimePoints || 0), 0));
const initials     = computed(() => isLoggedIn.value ? customer.value.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?');
const memberSinceFormatted = computed(() =>
  customer.value.memberSince ? new Date(customer.value.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''
);

// ── Trade history (static per user for mock) ──
const history = ref([
  { id: 1, type: 'earn',   label: 'Purchase — Cabernet Reserve',   points: +300,  date: '2026-02-28' },
  { id: 2, type: 'redeem', label: 'Redeemed — Sparkling Rosé',      points: -3500, date: '2026-02-22' },
  { id: 3, type: 'earn',   label: 'Purchase — Chardonnay Estate',   points: +200,  date: '2026-02-15' },
  { id: 4, type: 'bonus',  label: 'Double Points Weekend Bonus',    points: +200,  date: '2026-02-10' },
  { id: 5, type: 'earn',   label: 'Purchase — Merlot Classic',      points: +150,  date: '2026-02-03' },
  { id: 6, type: 'manual', label: 'Welcome Bonus',                  points: +500,  date: '2024-08-14' },
]);
const historyTypeConfig = {
  earn:   { icon: '↑', color: 'text-emerald-500', bg: 'bg-pastel-mint/60'  },
  redeem: { icon: '↓', color: 'text-rose-500',    bg: 'bg-pastel-pink/50'  },
  bonus:  { icon: '★', color: 'text-amber-500',   bg: 'bg-amber-50'        },
  manual: { icon: '●', color: 'text-indigo-500',  bg: 'bg-pastel-blue/60'  },
};
function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-32">

    <!-- ── HEADER ── -->
    <header class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-black text-gray-900 tracking-tight">My Account</h1>
        <p class="text-sm text-gray-400 mt-0.5 font-medium">Your profile &amp; trade history</p>
      </div>
      <!-- Log out button -->
      <button v-if="isLoggedIn" @click="logout" class="text-xs font-bold text-gray-400 hover:text-rose-500 transition-colors px-3 py-1.5 rounded-full hover:bg-rose-50">
        Sign Out
      </button>
    </header>

    <!-- ── GUEST FALLBACK ── -->
    <div v-if="!isLoggedIn" class="flex flex-col items-center justify-center py-24 text-center">
      <div class="text-7xl mb-5">👋</div>
      <h2 class="text-2xl font-black text-gray-700 mb-2">You're not signed in</h2>
      <p class="text-gray-400 mb-8 max-w-xs">Sign in to see your points, tier, and trade history.</p>
      <button @click="openLogin" class="px-8 py-3 bg-gray-900 text-white font-bold rounded-full shadow-sm hover:bg-gray-800 transition active:scale-95">
        Sign In
      </button>
    </div>

    <div v-else class="space-y-5">

      <!-- ── PROFILE SUMMARY CARD ── -->
      <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-glass">

        <div class="flex items-center gap-5">
          <!-- Avatar -->
          <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-pastel-peri to-pastel-salmon flex items-center justify-center flex-shrink-0 shadow-sm">
            <span class="text-2xl font-black text-white tracking-tight">{{ initials }}</span>
          </div>

          <div class="flex-1 min-w-0">
            <!-- Name + edit button -->
            <div class="flex items-center gap-2 mb-1">
              <h2 class="text-xl font-black text-gray-900 truncate">{{ customer.name }}</h2>
              <button @click="startEdit" class="flex-shrink-0 p-1.5 text-gray-300 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                </svg>
              </button>
            </div>
            <p class="text-sm text-gray-400 truncate">{{ customer.email }}</p>
            <p class="text-xs text-gray-300 mt-0.5">Member since {{ memberSinceFormatted }}</p>
          </div>
        </div>

        <!-- Points + Tier row -->
        <div class="mt-5 flex items-stretch gap-3">

          <!-- Points bubble -->
          <div class="flex-1 bg-[#D4D4E0]/40 rounded-2xl px-5 py-4">
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">Points Balance</p>
            <p class="text-4xl font-black text-pastel-salmon leading-none">{{ customer.points.toLocaleString() }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ customer.lifetimePoints.toLocaleString() }} lifetime pts</p>
          </div>

          <!-- Tier bubble -->
          <div :class="`flex-shrink-0 w-36 rounded-2xl px-4 py-4 flex flex-col justify-between ${tier.bg}`">
            <div class="flex items-center gap-1.5 mb-1">
              <span class="text-xl">{{ tier.emoji }}</span>
              <p :class="`text-xs font-black uppercase tracking-wider ${tier.color}`">{{ tier.label }}</p>
            </div>
            <div v-if="tier.nextTier">
              <div class="h-1.5 w-full bg-black/10 rounded-full overflow-hidden mb-1">
                <div :class="`h-full rounded-full transition-all duration-700 ${tier.bar}`" :style="{ width: tierProgress + '%' }"></div>
              </div>
              <p class="text-[10px] font-semibold text-gray-400 leading-tight">{{ pointsToNext.toLocaleString() }} pts to {{ tier.nextTier }}</p>
            </div>
            <p v-else class="text-[10px] font-bold text-amber-500">Top tier! ✨</p>
          </div>

        </div>
      </div>

      <!-- ── QUICK EDIT DRAWER ── -->
      <transition name="slide-down">
        <div v-if="isEditing" class="bg-white rounded-3xl p-5 border border-pastel-peri/30 shadow-glass space-y-3">
          <h3 class="text-sm font-black text-gray-700 mb-3">Edit Profile</h3>
          <div>
            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Name</label>
            <input v-model="editForm.name" class="w-full bg-[#D4D4E0]/30 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-pastel-peri/40 transition" />
          </div>
          <div>
            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Email</label>
            <input v-model="editForm.email" type="email" class="w-full bg-[#D4D4E0]/30 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-pastel-peri/40 transition" />
          </div>
          <div>
            <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Phone</label>
            <input v-model="editForm.phone" type="tel" class="w-full bg-[#D4D4E0]/30 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-pastel-peri/40 transition" />
          </div>
          <div class="flex gap-2 pt-1">
            <button @click="saveEdit" class="flex-1 py-2.5 bg-gray-900 text-white font-bold text-sm rounded-xl transition hover:bg-gray-800 active:scale-95">Save</button>
            <button @click="isEditing = false" class="flex-1 py-2.5 bg-gray-100 text-gray-600 font-bold text-sm rounded-xl transition hover:bg-gray-200 active:scale-95">Cancel</button>
          </div>
        </div>
      </transition>

      <!-- ── STATS ROW ── -->
      <div class="grid grid-cols-3 gap-3">
        <div class="bg-white rounded-2xl px-4 py-4 border border-gray-100 shadow-glass text-center">
          <p class="text-2xl font-black text-gray-900">{{ customer.totalTrades }}</p>
          <p class="text-[11px] font-semibold text-gray-400 mt-0.5 leading-tight">Total<br/>Trades</p>
        </div>
        <div class="bg-white rounded-2xl px-4 py-4 border border-gray-100 shadow-glass text-center">
          <p class="text-2xl font-black text-gray-900">{{ customer.lifetimePoints.toLocaleString() }}</p>
          <p class="text-[11px] font-semibold text-gray-400 mt-0.5 leading-tight">Lifetime<br/>Points</p>
        </div>
        <div class="bg-white rounded-2xl px-4 py-4 border border-gray-100 shadow-glass text-center">
          <p class="text-2xl font-black text-pastel-salmon">{{ customer.points.toLocaleString() }}</p>
          <p class="text-[11px] font-semibold text-gray-400 mt-0.5 leading-tight">Available<br/>to Trade</p>
        </div>
      </div>

      <!-- ── DIVIDER ── -->
      <div class="flex items-center gap-3 pt-1">
        <div class="flex-1 h-px bg-black/8"></div>
        <span class="text-xs font-bold text-gray-300 uppercase tracking-widest">Trade History</span>
        <div class="flex-1 h-px bg-black/8"></div>
      </div>

      <!-- ── TRADE HISTORY ── -->
      <div class="bg-white rounded-3xl border border-gray-100 shadow-glass overflow-hidden">
        <div
          v-for="(tx, idx) in history"
          :key="tx.id"
          :class="['flex items-center gap-4 px-5 py-4 transition-colors hover:bg-gray-50', idx !== history.length - 1 ? 'border-b border-gray-50' : '']"
        >
          <!-- Icon -->
          <div :class="`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base font-black ${historyTypeConfig[tx.type].bg} ${historyTypeConfig[tx.type].color}`">
            {{ historyTypeConfig[tx.type].icon }}
          </div>

          <!-- Label + date -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-800 truncate">{{ tx.label }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ formatDate(tx.date) }}</p>
          </div>

          <!-- Points delta -->
          <div :class="`text-sm font-black flex-shrink-0 ${tx.points > 0 ? 'text-emerald-500' : 'text-rose-500'}`">
            {{ tx.points > 0 ? '+' : '' }}{{ tx.points.toLocaleString() }}
            <span class="text-[10px] font-semibold opacity-60 ml-0.5">pts</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

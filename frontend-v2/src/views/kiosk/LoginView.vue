<script setup>
import { ref } from 'vue';

const emit = defineEmits(['login', 'register']);

const identifier = ref('');
const error = ref('');
const loading = ref(false);

// Mock users — when connected to backend, replace with API call
const mockUsers = [
  { id: '1', name: 'Ryan Johnson',   email: 'ryan@example.com',   phone: '5550123456', points: 1850, tier: 'silver', totalTrades: 14, lifetimePoints: 6200, memberSince: '2024-08-14' },
  { id: '2', name: 'Maria Garcia',   email: 'maria@example.com',  phone: '5559876543', points: 4200, tier: 'gold',   totalTrades: 38, lifetimePoints: 14800, memberSince: '2023-03-21' },
  { id: '3', name: 'James Liu',      email: 'james@example.com',  phone: '5551234567', points: 320,  tier: 'bronze', totalTrades: 3,  lifetimePoints: 1020, memberSince: '2026-01-05' },
];

function handleLookup() {
  const q = identifier.value.trim().toLowerCase().replace(/\D/g, '') || identifier.value.trim().toLowerCase();
  if (!q) { error.value = 'Please enter your phone number or email.'; return; }

  loading.value = true;
  error.value = '';

  // Simulate async lookup
  setTimeout(() => {
    const match = mockUsers.find(u =>
      u.email === identifier.value.trim().toLowerCase() ||
      u.phone.replace(/\D/g, '') === identifier.value.trim().replace(/\D/g, '')
    );

    loading.value = false;

    if (match) {
      emit('login', match);
    } else {
      error.value = 'No account found. Try a different number or email, or register below.';
    }
  }, 800);
}

// Hint mock users for demo
const hint = ref(false);
</script>

<template>
  <!-- Full-screen login overlay -->
  <div class="fixed inset-0 z-40 flex flex-col items-center justify-center px-6 bg-[#D4D4E0]">

    <!-- Brand mark -->
    <div class="mb-10 text-center">
      <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-pastel-peri to-pastel-salmon mx-auto mb-4 flex items-center justify-center shadow-glass-nav">
        <span class="text-3xl">🍷</span>
      </div>
      <h1 class="text-3xl font-black text-gray-900 tracking-tight">Welcome Back</h1>
      <p class="text-sm text-gray-400 mt-1 font-medium">Enter your phone or email to find your account</p>
    </div>

    <!-- Card -->
    <div class="w-full max-w-sm bg-white rounded-3xl p-6 shadow-glass border border-gray-100">

      <!-- Input -->
      <label class="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Phone or Email</label>
      <div class="relative">
        <input
          v-model="identifier"
          @keyup.enter="handleLookup"
          type="text"
          placeholder="e.g. 555-012-3456 or ryan@..."
          class="w-full bg-[#D4D4E0]/40 rounded-xl px-4 py-3.5 text-sm font-medium text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pastel-peri/40 transition pr-12"
          :class="error ? 'ring-2 ring-rose-300' : ''"
        />
        <!-- Clear button -->
        <button v-if="identifier" @click="identifier = ''; error = ''" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>

      <!-- Error -->
      <transition name="fade">
        <p v-if="error" class="text-xs text-rose-500 font-semibold mt-2 px-1">{{ error }}</p>
      </transition>

      <!-- Lookup button -->
      <button
        @click="handleLookup"
        :disabled="loading"
        class="w-full mt-4 py-3.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white font-bold text-sm rounded-xl transition active:scale-95 flex items-center justify-center gap-2"
      >
        <svg v-if="loading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <span>{{ loading ? 'Searching...' : 'Find My Account' }}</span>
      </button>

      <!-- Divider -->
      <div class="flex items-center gap-3 my-4">
        <div class="flex-1 h-px bg-gray-100"></div>
        <span class="text-xs font-semibold text-gray-300">or</span>
        <div class="flex-1 h-px bg-gray-100"></div>
      </div>

      <!-- Register -->
      <button
        @click="emit('register')"
        class="w-full py-3 bg-pastel-blue/60 hover:bg-pastel-peri/40 text-indigo-800 font-bold text-sm rounded-xl transition active:scale-95"
      >
        New here? Create Account
      </button>
    </div>

    <!-- Demo hint -->
    <button @click="hint = !hint" class="mt-6 text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition">
      {{ hint ? 'Hide demo accounts' : 'Show demo accounts' }}
    </button>
    <transition name="fade">
      <div v-if="hint" class="mt-3 bg-white/60 backdrop-blur-sm rounded-2xl px-5 py-4 text-xs text-gray-500 border border-white/60 max-w-sm w-full space-y-2">
        <p class="font-bold text-gray-600 mb-2">Tap to autofill ↓</p>
        <button
          v-for="u in [{ label: 'Ryan (Silver)', val: 'ryan@example.com' }, { label: 'Maria (Gold)', val: 'maria@example.com' }, { label: 'James (Bronze)', val: 'james@example.com' }]"
          :key="u.val"
          @click="identifier = u.val; hint = false"
          class="block w-full text-left px-3 py-2 rounded-xl hover:bg-white transition font-medium"
        >
          {{ u.label }} — <span class="text-gray-400">{{ u.val }}</span>
        </button>
      </div>
    </transition>

    <!-- Continue as guest -->
    <button class="mt-5 text-xs text-gray-400 hover:text-gray-600 transition font-semibold" @click="emit('login', null)">
      Continue as Guest →
    </button>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

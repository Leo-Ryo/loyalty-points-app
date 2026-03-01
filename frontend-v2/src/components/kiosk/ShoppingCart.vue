<script setup>
import { inject, computed, ref } from 'vue';

const cart = inject('cart');
const showCartDialog = ref(false);
const currentUser = inject('currentUser');
const userPoints = computed(() => currentUser.value ? (currentUser.value.points || 0) : 0);

// Cart stats
const cartTotal = computed(() => cart.value.reduce((acc, item) => acc + item.pointsCost, 0));
const canAfford = computed(() => currentUser.value && userPoints.value >= cartTotal.value);

function toggleCart() {
  showCartDialog.value = !showCartDialog.value;
}

function removeFromCart(index) {
  cart.value.splice(index, 1);
}

const openLogin = inject('openLogin');

function checkout() {
  if (!currentUser.value) {
    showCartDialog.value = false;
    openLogin();
    return;
  }
  if (!canAfford.value) return;
  alert('Checkout successful! (Demo only)');
  cart.value = [];
  showCartDialog.value = false;
}
</script>

<template>
  <div class="fixed bottom-24 left-4 z-50">
    <!-- Floating Cart Button -->
    <button
      @click="toggleCart"
      class="relative bg-gray-900 text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition transform hover:scale-105 active:scale-95 flex items-center justify-center"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <!-- Item count badge -->
      <span v-if="cart.length > 0" class="absolute -top-1 -right-1 bg-pastel-salmon text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
        {{ cart.length }}
      </span>
    </button>

    <!-- Cart Dialog Pop-up -->
    <transition name="fade">
      <div v-if="showCartDialog" class="absolute bottom-16 left-0 bg-white rounded-3xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-gray-100 w-80 mb-2 origin-bottom-left">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-black text-gray-900 tracking-tight">Your Trade List</h3>
          <button @click="toggleCart" class="text-gray-400 hover:text-gray-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <div class="space-y-3 max-h-60 overflow-y-auto hide-scrollbar mb-4">
          <div v-if="cart.length === 0" class="flex flex-col items-center justify-center py-6 text-gray-300">
            <span class="text-4xl mb-2">🛒</span>
            <p class="font-bold text-gray-400 text-xs">Your cart is empty</p>
          </div>
          <div v-else v-for="(item, idx) in cart" :key="idx" class="flex gap-3 bg-gray-50 rounded-xl p-2 items-center">
            <div :class="`w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 ${item.isOffer ? 'bg-emerald-100 text-emerald-600' : 'bg-white'}`">
               {{ item.isOffer ? '🎁' : '🍷' }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-bold text-gray-900 truncate">{{ item.name }}</p>
              <p v-if="item.isOffer" class="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Applied</p>
              <p v-else class="text-[10px] font-bold text-pastel-salmon">{{ item.pointsCost.toLocaleString() }} pts</p>
            </div>
            <button @click="removeFromCart(idx)" class="text-gray-300 hover:text-rose-500 p-1 transition flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div class="pt-4 border-t border-gray-100">
          <div class="flex items-end justify-between mb-4">
            <span class="text-xs font-bold text-gray-400">Total</span>
            <span class="text-xl font-black text-pastel-salmon">{{ cartTotal.toLocaleString() }} <span class="text-[10px] font-bold text-gray-400">pts</span></span>
          </div>

          <div v-if="!currentUser" class="text-[10px] text-center text-rose-500 font-bold mb-2">
            Sign in to checkout
          </div>
          <div v-else-if="!canAfford" class="text-[10px] text-center text-rose-500 font-bold mb-2">
            Not enough points (Balance: {{ userPoints.toLocaleString() }})
          </div>

          <button
            @click="checkout"
            :disabled="cart.length === 0 || (currentUser && !canAfford)"
            class="w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95"
            :class="(cart.length === 0 || (currentUser && !canAfford)) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-pastel-salmon hover:bg-[#F97B8F] text-white shadow-salmon'"
          >
            {{ !currentUser ? 'Sign in to Checkout' : 'Confirm Trade' }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: scale(0.95); }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>

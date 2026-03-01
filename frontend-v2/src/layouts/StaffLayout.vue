<script setup>
import StaffSidebar from '../components/staff/StaffSidebar.vue';
import StaffTopBar from '../components/staff/StaffTopBar.vue';
</script>

<template>
  <div class="flex h-screen w-full bg-gray-50 overflow-hidden text-gray-900 font-sans selection:bg-pastel-peri selection:text-indigo-900">
    <!-- Sidebar -->
    <StaffSidebar />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <StaffTopBar />
      
      <main class="flex-1 overflow-auto relative">
        <router-view v-slot="{ Component }">
          <transition name="fade-fast" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-fast-enter-active, .fade-fast-leave-active { transition: opacity 0.15s ease; }
.fade-fast-enter-from, .fade-fast-leave-to { opacity: 0; }
</style>

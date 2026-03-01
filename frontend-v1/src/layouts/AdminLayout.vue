<template>
  <div class="layout-root" :class="layoutClass">
    <!-- Dynamic Nav -->
    <component :is="navComponent" />

    <!-- Main content -->
    <div class="content-area">
      <main class="page-main">
        <transition name="fade" mode="out-in">
          <router-view :key="$route.path" />
        </transition>
      </main>
    </div>

    <!-- Toast notifications -->
    <AppToast />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings.store'
import SidebarNav from './nav/SidebarNav.vue'
import TopNav from './nav/TopNav.vue'
import BottomNav from './nav/BottomNav.vue'
import AppToast from '@/components/ui/AppToast.vue'

const settings = useSettingsStore()

const navComponent = computed(() => ({
  left: SidebarNav,
  top: TopNav,
  bottom: BottomNav,
}[settings.navigationPosition] ?? SidebarNav))

const layoutClass = computed(() => ({
  left:   'layout--left',
  top:    'layout--top',
  bottom: 'layout--bottom',
}[settings.navigationPosition]))
</script>

<style scoped>
.layout-root {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: #F2F2F7;
}

/* LEFT sidebar layout */
.layout--left { flex-direction: row; }
.layout--left .content-area {
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow: hidden;
}

/* TOP nav layout */
.layout--top { flex-direction: column; }
.layout--top .content-area {
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow: hidden;
}

/* BOTTOM nav layout */
.layout--bottom { flex-direction: column-reverse; }
.layout--bottom .content-area {
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow: hidden;
}

.page-main {
  flex: 1;
  overflow-y: auto;
  padding: clamp(1.25rem, 2.5vw, 2rem);
  /* subtle inner shadow to create depth vs sidebar */
  background: #F2F2F7;
}
</style>

<template>
  <div class="app-card card-3d" :class="{ 'card--flat': flat }">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ hoverable?: boolean; flat?: boolean }>()
</script>

<style scoped>
.app-card {
  background: #FFFFFF;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 20px;
  padding: clamp(1rem, 2vw, 1.5rem);
  box-shadow:
    0 2px 8px rgba(0,0,0,0.06),
    0 1px 3px rgba(0,0,0,0.04),
    inset 0 1px 0 rgba(255,255,255,0.9);
  position: relative;
  overflow: hidden;
}
/* subtle top specular shine */
.app-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
  pointer-events: none;
}
.card--flat { box-shadow: none; border-color: #EEEEEE; }
.card--flat::before { display: none; }
</style>

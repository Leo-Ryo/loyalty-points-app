<template>
  <div class="app-card card-3d" :class="{ 'card--hover': hoverable, 'card--flat': flat }">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ hoverable?: boolean; flat?: boolean }>()
</script>

<style scoped>
.app-card {
  background: #FFFFFF;
  border: 1px solid #E5E5E5;
  border-radius: 16px;
  padding: clamp(1rem, 2vw, 1.5rem);
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.card--flat { box-shadow: none; }
</style>

<template>
  <div
    class="stat-card card-3d"
    :class="{ 'stat-card--clickable': clickable }"
    @click="clickable && $emit('click')"
  >
    <div class="stat-header">
      <span class="stat-icon">{{ icon }}</span>
      <AppBadge v-if="badge" :variant="badgeVariant">{{ badge }}</AppBadge>
      <span v-if="clickable" class="stat-arrow">→</span>
    </div>
    <p class="stat-value">{{ value }}</p>
    <p class="stat-label">{{ label }}</p>
    <p v-if="sub" class="stat-sub">{{ sub }}</p>
  </div>
</template>

<script setup lang="ts">
import AppBadge from './AppBadge.vue'
defineProps<{
  icon: string; label: string; value: string | number
  sub?: string; badge?: string; badgeVariant?: 'success' | 'warning' | 'error' | 'neutral'
  clickable?: boolean
}>()
defineEmits(['click'])
</script>

<style scoped>
.stat-card {
  background: #FFFFFF;
  border: 1px solid #E5E5E5;
  border-radius: 16px;
  padding: clamp(1rem, 2vw, 1.5rem);
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  transition: all 0.2s ease;
}
.stat-card--clickable {
  cursor: pointer;
}
.stat-card--clickable:hover {
  border-color: #111111;
  transform: translateY(-4px) perspective(600px) rotateX(2deg);
  box-shadow: 0 12px 32px rgba(0,0,0,0.12);
}
.stat-card--clickable:active { transform: scale(0.98); }
.stat-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; gap: 8px; }
.stat-icon   { font-size: clamp(22px, 2.5vw, 28px); }
.stat-arrow  { font-size: 16px; color: #D4D4D4; transition: all 0.2s ease; margin-left: auto; }
.stat-card--clickable:hover .stat-arrow { color: #111111; transform: translateX(4px); }
.stat-value  { font-size: clamp(24px, 3vw, 32px); font-weight: 800; color: #111111; margin: 0; line-height: 1.1; }
.stat-label  { font-size: clamp(12px, 1.1vw, 13px); color: #525252; font-weight: 500; margin: 0; }
.stat-sub    { font-size: 12px; color: #A3A3A3; margin: 0; }
</style>

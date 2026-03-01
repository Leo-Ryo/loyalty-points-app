<template>
  <div
    class="stat-card"
    :class="{ 'stat-card--clickable': clickable }"
    @click="clickable && $emit('click')"
  >
    <div class="stat-header">
      <div class="stat-icon-wrap">
        <span class="stat-icon">{{ icon }}</span>
      </div>
      <AppBadge v-if="badge" :variant="badgeVariant">{{ badge }}</AppBadge>
    </div>
    <p class="stat-value">{{ value }}</p>
    <p class="stat-label">{{ label }}</p>
    <p v-if="sub" class="stat-sub">{{ sub }}</p>
    <span v-if="clickable" class="stat-arrow">→</span>
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
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 20px;
  padding: clamp(1rem, 2vw, 1.5rem);
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow:
    0 2px 8px rgba(0,0,0,0.06),
    0 1px 3px rgba(0,0,0,0.04),
    inset 0 1px 0 rgba(255,255,255,0.9);
  transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease, border-color 0.28s ease;
  position: relative;
  overflow: hidden;
}
/* specular top edge */
.stat-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
  pointer-events: none;
}

.stat-card--clickable { cursor: pointer; }
.stat-card--clickable:hover {
  border-color: rgba(0,0,0,0.12);
  transform: translateY(-5px) perspective(700px) rotateX(2deg);
  box-shadow:
    0 14px 36px rgba(0,0,0,0.10),
    0 4px 10px rgba(0,0,0,0.06),
    inset 0 1px 0 rgba(255,255,255,0.9);
}
.stat-card--clickable:active { transform: scale(0.97); transition-duration: 0.08s; }

.stat-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 8px; }

.stat-icon-wrap {
  width: 40px; height: 40px;
  border-radius: 12px;
  background: rgba(0,0,0,0.04);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.stat-icon { font-size: 20px; }

.stat-value {
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 800;
  color: #111111;
  margin: 0;
  line-height: 1.1;
  letter-spacing: -0.03em;
}
.stat-label {
  font-size: clamp(11px, 1.1vw, 13px);
  color: #525252;
  font-weight: 500;
  margin: 0;
}
.stat-sub { font-size: 11px; color: #A3A3A3; margin: 0; }
.stat-arrow {
  position: absolute;
  bottom: clamp(1rem, 2vw, 1.5rem);
  right: clamp(1rem, 2vw, 1.5rem);
  font-size: 16px;
  color: #D4D4D4;
  transition: all 0.22s ease;
}
.stat-card--clickable:hover .stat-arrow { color: #111111; transform: translateX(4px); }
</style>

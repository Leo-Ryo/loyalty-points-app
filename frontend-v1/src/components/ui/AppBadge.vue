<template>
  <span class="badge" :class="`badge--${variant ?? 'neutral'}`">
    <span class="badge-dot" />
    <slot />
  </span>
</template>

<script setup lang="ts">
defineProps<{ variant?: 'success' | 'error' | 'warning' | 'neutral' | 'dark' }>()
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px 3px 7px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.01em;
}
.badge-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.badge--success { background: #F0FDF4; color: #15803D; }
.badge--success .badge-dot { background: #16A34A; }
.badge--error   { background: #FEF2F2; color: #B91C1C; }
.badge--error   .badge-dot { background: #DC2626; }
.badge--warning { background: #FFFBEB; color: #B45309; }
.badge--warning .badge-dot { background: #D97706; }
.badge--neutral { background: rgba(0,0,0,0.05); color: #525252; }
.badge--neutral .badge-dot { background: #A3A3A3; }
.badge--dark    { background: #111111; color: #FFFFFF; }
.badge--dark    .badge-dot { background: rgba(255,255,255,0.5); }
</style>

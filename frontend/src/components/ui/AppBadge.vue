<template>
  <span class="badge" :class="`badge--${variant}`"><slot /></span>
</template>

<script setup lang="ts">
defineProps<{ variant?: 'success' | 'error' | 'warning' | 'neutral' | 'dark' }>()
</script>

<style scoped>
.badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 600; }
.badge--success { background: #F0FDF4; color: #16A34A; }
.badge--error   { background: #FEF2F2; color: #DC2626; }
.badge--warning { background: #FFFBEB; color: #D97706; }
.badge--neutral { background: #F5F5F5; color: #525252; }
.badge--dark    { background: #111111; color: #FFFFFF; }
</style>

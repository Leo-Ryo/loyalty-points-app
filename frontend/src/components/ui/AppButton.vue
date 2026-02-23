<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="app-btn btn-3d"
    :class="[`btn--${variant}`, { 'btn--sm': size === 'sm', 'btn--lg': size === 'lg', 'btn--loading': loading }]"
    v-bind="$attrs"
  >
    <span v-if="loading" class="btn-spinner" />
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit'
  disabled?: boolean
  loading?: boolean
}>()
</script>

<style scoped>
.app-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  font-weight: 500;
  border: none;
  cursor: pointer;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 14px;
  line-height: 1;
  position: relative;
  white-space: nowrap;
}
.app-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; box-shadow: none !important; }

.btn--primary   { background: #111111; color: #FFFFFF; }
.btn--primary:hover:not(:disabled)   { background: #333333; }
.btn--secondary { background: #FFFFFF; color: #111111; border: 1px solid #E5E5E5; }
.btn--secondary:hover:not(:disabled) { background: #F5F5F5; }
.btn--danger    { background: #DC2626; color: #FFFFFF; }
.btn--danger:hover:not(:disabled)    { background: #B91C1C; }
.btn--ghost     { background: transparent; color: #525252; }
.btn--ghost:hover:not(:disabled)     { background: #F5F5F5; color: #111111; }

.btn--sm { padding: 7px 14px; font-size: 12px; border-radius: 8px; }
.btn--lg { padding: 14px 28px; font-size: 16px; border-radius: 12px; }

.btn-spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>

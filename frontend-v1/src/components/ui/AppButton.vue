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
  font-weight: 600;
  border: none;
  cursor: pointer;
  border-radius: 12px;
  padding: 10px 20px;
  font-size: 14px;
  letter-spacing: -0.01em;
  line-height: 1;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
}
/* specular top highlight — gives 3D bevel feel */
.app-btn::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: rgba(255,255,255,0.25);
  pointer-events: none;
}
.app-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none !important; box-shadow: none !important; }

.btn--primary {
  background: #8DC1FF;  /* Blue 300 */
  color: #19213D;       /* Navy — good contrast on light blue */
  box-shadow: 0 2px 8px rgba(141,193,255,0.40), inset 0 1px 0 rgba(255,255,255,0.30);
}
.btn--primary:hover:not(:disabled) { background: #4E9FFF; color: #FFFFFF; box-shadow: 0 4px 14px rgba(78,159,255,0.40), inset 0 1px 0 rgba(255,255,255,0.20); }

.btn--secondary {
  background: rgba(255,255,255,0.90);
  color: #19213D;       /* navy */
  border: 1px solid #D7DBE7;
  box-shadow: 0 1px 4px rgba(25,33,61,0.06), inset 0 1px 0 rgba(255,255,255,0.9);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.btn--secondary:hover:not(:disabled) { background: #FFFFFF; border-color: #8DC1FF; color: #19213D; }

.btn--danger {
  background: #DC2626;
  color: #FFFFFF;
  box-shadow: 0 2px 6px rgba(220,38,38,0.30), inset 0 1px 0 rgba(255,255,255,0.12);
}
.btn--danger:hover:not(:disabled) { background: #B91C1C; }

.btn--ghost {
  background: transparent;
  color: #6D758F;   /* Neutral 600 */
  box-shadow: none;
}
.btn--ghost::after { display: none; }
.btn--ghost:hover:not(:disabled) { background: #EDEFF5; color: #19213D; }

.btn--sm { padding: 7px 14px; font-size: 12px; border-radius: 10px; }
.btn--lg { padding: 14px 28px; font-size: 16px; border-radius: 14px; }

.btn-spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.25);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.65s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>

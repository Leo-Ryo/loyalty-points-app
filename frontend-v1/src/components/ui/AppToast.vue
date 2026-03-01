<template>
  <teleport to="body">
    <div class="toast-container">
      <transition-group name="toast-slide">
        <div
          v-for="toast in notifications.toasts"
          :key="toast.id"
          class="toast"
          :class="`toast--${toast.type}`"
          @click="notifications.remove(toast.id)"
        >
          <span class="toast-accent" />
          <span class="toast-icon">{{ icons[toast.type] }}</span>
          <span class="toast-msg">{{ toast.message }}</span>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification.store'
const notifications = useNotificationStore()
const icons: Record<string, string> = { success: '✓', error: '✕', warning: '⚠' }
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: clamp(1rem, 2vw, 1.5rem);
  right: clamp(1rem, 2vw, 1.5rem);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}
.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 500;
  /* Apple glass toast */
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow:
    0 8px 32px rgba(0,0,0,0.14),
    0 2px 8px rgba(0,0,0,0.08),
    inset 0 1px 0 rgba(255,255,255,0.9);
  border: 1px solid rgba(255,255,255,0.6);
  pointer-events: all;
  cursor: pointer;
  max-width: min(340px, 90vw);
  position: relative;
  overflow: hidden;
  transition: transform 0.15s ease, opacity 0.15s ease;
}
.toast:hover { transform: scale(1.02); }
.toast:active { transform: scale(0.98); }

/* Left accent line */
.toast-accent {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  border-radius: 14px 0 0 14px;
}
.toast--success .toast-accent { background: #16A34A; }
.toast--error   .toast-accent { background: #DC2626; }
.toast--warning .toast-accent { background: #D97706; }

.toast--success { color: #14532D; }
.toast--error   { color: #7F1D1D; }
.toast--warning { color: #7C2D12; }

.toast-icon {
  font-size: 15px;
  flex-shrink: 0;
  font-weight: 800;
  width: 20px;
  text-align: center;
  margin-left: 6px; /* offset for accent */
}
.toast-msg { flex: 1; line-height: 1.4; }

/* Slide in from right */
.toast-slide-enter-active { transition: all 0.32s cubic-bezier(0.34,1.56,0.64,1); }
.toast-slide-leave-active  { transition: all 0.22s ease; }
.toast-slide-enter-from    { transform: translateX(100%) scale(0.92); opacity: 0; }
.toast-slide-leave-to      { transform: translateX(100%) scale(0.92); opacity: 0; }
</style>

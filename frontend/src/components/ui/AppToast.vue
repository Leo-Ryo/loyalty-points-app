<template>
  <teleport to="body">
    <div class="toast-container">
      <transition-group name="slide-up">
        <div
          v-for="toast in notifications.toasts"
          :key="toast.id"
          class="toast"
          :class="`toast--${toast.type}`"
          @click="notifications.remove(toast.id)"
        >
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
const icons = { success: '✅', error: '❌', warning: '⚠️' }
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
  padding: 12px 18px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  pointer-events: all;
  cursor: pointer;
  max-width: min(380px, 90vw);
}
.toast--success { background: #FFFFFF; border: 1px solid #BBF7D0; color: #14532D; }
.toast--error   { background: #FFFFFF; border: 1px solid #FECACA; color: #7F1D1D; }
.toast--warning { background: #FFFFFF; border: 1px solid #FED7AA; color: #7C2D12; }
.toast-icon { font-size: 16px; flex-shrink: 0; }
.toast-msg  { flex: 1; line-height: 1.4; }
</style>

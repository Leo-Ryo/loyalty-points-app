<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="modelValue" class="modal-backdrop" @click.self="$emit('update:modelValue', false)">
        <div class="modal-box" :style="{ maxWidth: width }">
          <div class="modal-header">
            <h3 class="modal-title">{{ title }}</h3>
            <button class="modal-close" @click="$emit('update:modelValue', false)">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="modal-body"><slot /></div>
          <div v-if="$slots.footer" class="modal-footer"><slot name="footer" /></div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean; title?: string; width?: string }>()
defineEmits(['update:modelValue'])
</script>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.32);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 1.5rem;
}
.modal-box {
  background: #FFFFFF;
  border-radius: 24px;
  width: 100%;
  max-width: 520px;
  box-shadow:
    0 32px 80px rgba(0,0,0,0.22),
    0 8px 24px rgba(0,0,0,0.10),
    inset 0 1px 0 rgba(255,255,255,0.9);
  overflow: hidden;
  position: relative;
}
/* specular top edge */
.modal-box::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
  pointer-events: none;
  z-index: 1;
}
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(0,0,0,0.06);
}
.modal-title { font-size: 16px; font-weight: 700; color: #111111; margin: 0; letter-spacing: -0.01em; }
.modal-close {
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.05);
  border: none;
  border-radius: 99px;
  color: #525252;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}
.modal-close:hover { background: rgba(0,0,0,0.10); color: #111111; }
.modal-body { padding: 1.5rem; }
.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(0,0,0,0.06);
  display: flex; gap: 8px; justify-content: flex-end;
  background: rgba(0,0,0,0.02);
}
</style>

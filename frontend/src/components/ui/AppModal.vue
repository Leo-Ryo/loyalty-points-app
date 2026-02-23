<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="modelValue" class="modal-backdrop" @click.self="$emit('update:modelValue', false)">
        <div class="modal-box" :style="{ maxWidth: width }">
          <div class="modal-header">
            <h3 class="modal-title">{{ title }}</h3>
            <button class="modal-close" @click="$emit('update:modelValue', false)">✕</button>
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
  background: rgba(0,0,0,0.45);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 1.5rem;
}
.modal-box {
  background: #FFFFFF;
  border-radius: 20px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  overflow: hidden;
}
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid #E5E5E5; }
.modal-title  { font-size: 16px; font-weight: 700; color: #111111; margin: 0; }
.modal-close  { background: none; border: none; font-size: 16px; color: #A3A3A3; cursor: pointer; padding: 4px; border-radius: 6px; transition: all 0.15s; }
.modal-close:hover { background: #F5F5F5; color: #111111; }
.modal-body   { padding: 1.5rem; }
.modal-footer { padding: 1rem 1.5rem; border-top: 1px solid #E5E5E5; display: flex; gap: 8px; justify-content: flex-end; }
</style>

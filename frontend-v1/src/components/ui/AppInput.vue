<template>
  <div class="input-wrap">
    <label v-if="label" class="input-label" :for="inputId">{{ label }}</label>
    <div class="input-inner" :class="{ 'input-inner--error': error, 'input-inner--focused': focused }">
      <input
        :id="inputId"
        v-bind="$attrs"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="app-input"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @focus="focused = true"
        @blur="focused = false"
      />
    </div>
    <p v-if="error" class="input-error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
const uid = Math.random().toString(36).slice(2)
const { label, type = 'text', modelValue, placeholder, disabled, error } = defineProps<{
  label?: string; type?: string; modelValue?: string; placeholder?: string; disabled?: boolean; error?: string
}>()
defineEmits(['update:modelValue'])
const inputId = computed(() => `input-${uid}`)
const focused = ref(false)
</script>

<style scoped>
.input-wrap { display: flex; flex-direction: column; gap: 6px; }
.input-label {
  font-size: 11px;
  font-weight: 600;
  color: #6D758F;   /* Neutral 600 */
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-inner {
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.12);
  background: #FFFFFF;
  box-shadow: var(--shadow-inset, inset 0 1px 3px rgba(0,0,0,0.05));
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
  overflow: hidden;
}
.input-inner--focused {
  border-color: #8DC1FF;   /* Blue 300 */
  box-shadow: 0 0 0 4px rgba(195,221,255,0.50), inset 0 1px 2px rgba(25,33,61,0.04);  /* Blue 200 glow */
}
.input-inner--error { border-color: #DC2626; }
.input-inner--error.input-inner--focused {
  box-shadow: 0 0 0 4px rgba(220,38,38,0.10), inset 0 1px 2px rgba(0,0,0,0.04);
}

.app-input {
  width: 100%;
  padding: 10px 14px;
  border: none;
  outline: none;
  font-size: 14px;
  font-family: inherit;
  color: #111111;
  background: transparent;
  display: block;
}
.app-input::placeholder { color: #A1A7BB; }
.app-input:disabled { color: #A1A7BB; cursor: not-allowed; }
.app-input { color: #19213D; }

.input-error { font-size: 12px; color: #DC2626; margin: 0; }
</style>

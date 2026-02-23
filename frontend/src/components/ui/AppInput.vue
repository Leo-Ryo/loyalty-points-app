<template>
  <div class="input-wrap">
    <label v-if="label" class="input-label" :for="inputId">{{ label }}</label>
    <input
      :id="inputId"
      v-bind="$attrs"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      class="app-input"
      :class="{ 'input--error': error }"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="input-error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const uid = Math.random().toString(36).slice(2)
const { label, type = 'text', modelValue, placeholder, disabled, error } = defineProps<{
  label?: string; type?: string; modelValue?: string; placeholder?: string; disabled?: boolean; error?: string
}>()
defineEmits(['update:modelValue'])
const inputId = computed(() => `input-${uid}`)
</script>

<style scoped>
.input-wrap { display: flex; flex-direction: column; gap: 6px; }
.input-label { font-size: 13px; font-weight: 500; color: #111111; }
.app-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #D4D4D4;
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  color: #111111;
  background: #FFFFFF;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.app-input::placeholder { color: #A3A3A3; }
.app-input:focus { border-color: #111111; box-shadow: 0 0 0 3px rgba(17,17,17,0.08); }
.app-input:disabled { background: #F5F5F5; color: #A3A3A3; cursor: not-allowed; }
.input--error { border-color: #DC2626; }
.input--error:focus { box-shadow: 0 0 0 3px rgba(220,38,38,0.12); }
.input-error { font-size: 12px; color: #DC2626; margin: 0; }
</style>

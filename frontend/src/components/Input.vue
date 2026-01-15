<script setup lang="ts">
defineProps<{
  label?: string;
  modelValue: string | number;
  type?: string;
  placeholder?: string;
  id?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}
</script>

<template>
  <div class="input-field">
    <label v-if="label" :for="id">{{ label }}</label>
    <input
      :type="type || 'text'"
      :placeholder="placeholder"
      :value="modelValue"
      @input="handleInput"
    />
  </div>
</template>

<style scoped>
.input-field {
  display: flex;
  align-self: center;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 0.5rem;
  width: 100%;
}

label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #333;
}

.input-field {
  padding: 0.2rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}
</style>

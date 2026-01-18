<script setup lang="ts">
    import { ref } from 'vue';

    const props = defineProps<{
      label?: string;
      modelValue: string;
      placeholder?: string;
      id?: string;
    }>();

    const emit = defineEmits(['update:modelValue'])

    const isVisible = ref(false);
    function updateValue(event: Event) {
      const target = event.target as HTMLInputElement;
      emit('update:modelValue', target.value);
    }
</script>
<template>
    <div class="input-field">
        <label v-if="props.label" :for="props.id">{{ props.label }}</label>
        <div class="password-wrapper">
            <input
                :type="isVisible ? 'text' : 'password'"
                :placeholder="props.placeholder"
                :value="props.modelValue"
                @input="updateValue"
            />
            <button type="button" class="toggle-visibility" @click="isVisible = !isVisible">
                {{ isVisible ? 'Esconder' : 'Mostrar' }}
            </button>
        </div>
    </div>
</template>
<style scoped>
    .input-field {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
        margin-bottom: 1rem;
        width: 100%;
        }
    label {
        font-weight: 600;
        font-size: 0.9rem;
        color: #333;
    }
    .password-wrapper {
        display: flex;
        align-items: center;
        width: 100%;
    }
    .password-wrapper input {
        flex: 1;
        padding: 0.3rem;
        font-size: 0.8rem;
    }
    .password-wrapper button {
        margin-left: 0.5rem;
        padding: 0.2rem 0.2rem;
        font-size: 0.8rem;
        cursor: pointer;
    }
  

    
</style>

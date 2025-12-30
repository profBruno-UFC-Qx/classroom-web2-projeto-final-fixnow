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
    
</style>

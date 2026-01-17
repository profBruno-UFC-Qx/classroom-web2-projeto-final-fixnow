import { ref } from 'vue';
import { defineStore } from 'pinia';
import { api } from '../services/api';

export const useCategoriesStore = defineStore('categories', () => {
  // Lista padrão inicial (fallback)
  const categories = ref<string[]>([
    'Eletricista',
    'Encanador',
    'Pedreiro',
    'Carpinteiro',
    'Pintor',
    'Mecânico',
    'Soldador',
    'Refrigeração',
    'Gás',
    'Telecomunicações',
    'Outro'
  ]);

  async function fetchCategories() {
    try {
      const { data } = await api.get('/users/categories');
      if (Array.isArray(data)) {
        categories.value = data;
      }
    } catch (error) {
      console.warn('Usando categorias padrão (API offline ou endpoint não existe)');
    }
  }

  return { categories, fetchCategories };
});
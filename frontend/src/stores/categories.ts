import { ref } from 'vue';
import { defineStore } from 'pinia';
import { api } from '../services/api';

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<any[]>([]);

  async function fetchCategories() {
    try {
      const { data } = await api.get('/categories');
      if (Array.isArray(data)) {
        // Mapear para apenas nomes se vier com objeto completo
        categories.value = data.map((cat: any) => typeof cat === 'string' ? cat : cat.name);
      }
    } catch (error) {
      console.warn('Erro ao buscar categorias:', error);
      categories.value = [];
    }
  }

  return { categories, fetchCategories };
});
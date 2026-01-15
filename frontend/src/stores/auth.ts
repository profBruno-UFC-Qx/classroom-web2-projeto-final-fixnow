import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from '../services/api';
import { useRouter } from 'vue-router';
import type { User } from '../types/roles';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const router = useRouter();

  const isLoggedIn = computed(() => !!user.value);

  async function login(email: string, password: string) {
    try {
      const response = await api.post('/login', { email, password });
      user.value = response.data;
      return true;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  }

  function logout() {
    user.value = null;
    router.push('/login');
  }

  async function updateProfile(updatedData: any) {
    if (!user.value) return;
    try {
      // Atualiza no backend (PUT /users/:id)
      const response = await api.put(`/users/${user.value.id}`, updatedData);
      user.value = response.data; // Atualiza o estado local com a resposta
      return true;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  }

  return {
    user,
    isLoggedIn,
    login,
    logout,
    updateProfile
  };
});
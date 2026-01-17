import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from '../services/api';
import { useRouter } from 'vue-router';
import type { User } from '../types/roles';

const TOKEN_KEY = 'fixnow_token';
const USER_KEY = 'fixnow_user';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const router = useRouter();

  const isLoggedIn = computed(() => !!user.value && !!token.value);

  // Inicializar a partir do localStorage
  function initializeFromStorage() {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      try {
        token.value = storedToken;
        user.value = JSON.parse(storedUser);
        // Adicionar token ao header padrão da API
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (error) {
        console.error('Erro ao recuperar dados de autenticação:', error);
        clearStorage();
      }
    }
  }

  function saveToStorage(userData: User, authToken: string) {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    localStorage.setItem(TOKEN_KEY, authToken);
    token.value = authToken;
    user.value = userData;
    // Adicionar token ao header padrão da API
    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  }

  function clearStorage() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    token.value = null;
    user.value = null;
    delete api.defaults.headers.common['Authorization'];
  }

  async function login(email: string, password: string) {
    try {
      const response = await api.post('/login', { email, password });
      const { user: userData, token: authToken } = response.data;
      
      console.log('Login bem-sucedido, token recebido:', authToken.substring(0, 20) + '...');
      
      saveToStorage(userData, authToken);
      return true;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  }

  function logout() {
    clearStorage();
    router.push('/login');
  }

  async function updateProfile(updatedData: any) {
    if (!user.value) return;
    try {
      const response = await api.put(`/users/${user.value.id}`, updatedData);
      user.value = response.data;
      // Atualizar no localStorage também
      localStorage.setItem(USER_KEY, JSON.stringify(response.data));
      return true;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  }

  return {
    user,
    token,
    isLoggedIn,
    login,
    logout,
    updateProfile,
    initializeFromStorage,
    clearStorage
  };
});
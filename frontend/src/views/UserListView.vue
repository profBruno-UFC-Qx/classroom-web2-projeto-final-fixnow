<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { api } from '../services/api';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useCategoriesStore } from '../stores/categories';
import { Trash2 } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const categoriesStore = useCategoriesStore();
const users = ref<any[]>([]);
const searchQuery = ref('');
const selectedCategory = ref('');
const currentPage = ref(1);
const itemsPerPage = 5;
const showDeleteModal = ref(false);
const userToDeleteId = ref<number | null>(null);

// Proteção extra: se não for admin, manda pra home
const checkAdmin = () => {
  if (authStore.user?.role !== 'ADMIN') {
    router.push('/');
  }
};

const filteredUsers = computed(() => {
  return users.value.filter((user: any) => {
    const matchesCategory = selectedCategory.value === '' || user.profession === selectedCategory.value;
    const searchLower = searchQuery.value.toLowerCase();
    const matchesSearch = 
      user.name.toLowerCase().includes(searchLower) || 
      user.email.toLowerCase().includes(searchLower);
    
    return matchesCategory && matchesSearch;
  });
});

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage));

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredUsers.value.slice(start, end);
});

watch([searchQuery, selectedCategory], () => {
  currentPage.value = 1;
});

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

async function fetchUsers() {
  try {
    const response = await api.get('/users');
    users.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
  }
}

function openDeleteModal(id: number) {
  userToDeleteId.value = id;
  showDeleteModal.value = true;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  userToDeleteId.value = null;
}

async function deleteUser() {
  if (userToDeleteId.value === null) return;
  try {
    await api.delete(`/users/${userToDeleteId.value}`);
    users.value = users.value.filter((u: any) => u.id !== userToDeleteId.value);
    // Volta uma página se a atual ficar vazia
    if (paginatedUsers.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    alert('Erro ao excluir usuário.');
  } finally {
    closeDeleteModal();
  }
}

function goBack() {
    router.push('/admin');
}

onMounted(() => {
  checkAdmin();
  fetchUsers();
  categoriesStore.fetchCategories();
});
</script>

<template>
  <Navbar />
  <div class="user-list-container">
    <div class="header">
        <button @click="goBack" class="btn-back">← Voltar</button>
        <h1>Gerenciar Usuários</h1>
    </div>
    
    <div class="search-container">
      <select v-model="selectedCategory" class="category-select">
        <option value="">Todas as Categorias</option>
        <option v-for="category in categoriesStore.categories" :key="category" :value="category">{{ category }}</option>
      </select>
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Pesquisar por nome ou email..." 
        class="search-input"
      />
    </div>

    <div class="table-wrapper">
      <table class="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Tipo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
                <span class="role-badge" :class="user.role.toLowerCase()">{{ user.role }}</span>
            </td>
            <td>
              <button v-if="user.role !== 'ADMIN'" @click="openDeleteModal(user.id)" class="btn-delete" title="Excluir">
                <Trash2 :size="18" />
              </button>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="5" style="text-align: center;">Nenhum usuário encontrado.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button @click="prevPage" :disabled="currentPage === 1" class="btn-page">Anterior</button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="btn-page">Próxima</button>
    </div>

    <!-- Modal de Confirmação -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Confirmar Exclusão</h3>
        <p>Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.</p>
        <div class="modal-actions">
          <button @click="closeDeleteModal" class="btn-cancel">Cancelar</button>
          <button @click="deleteUser" class="btn-confirm">Excluir</button>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.user-list-container { margin-top: 80px; min-height: 70vh; padding: 2rem; max-width: 1000px; margin-left: auto; margin-right: auto; }
.header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
.btn-back { 
    background: #2e7d32; 
    color: white; 
    border: 1px solid #ccc; 
    padding: 0.5rem 1rem; 
    border-radius: 4px; 
    cursor: pointer; 
}
.btn-back:hover { 
    background-color: #1b5e20; 
}
.search-container { 
    margin-bottom: 1rem; 
    display: flex; 
    justify-content: flex-end; 
    gap: 1rem; 
}
.search-input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  max-width: 300px;
}
.category-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  max-width: 200px;
}
.table-wrapper { 
    overflow-x: auto; 
    background: white; 
    border-radius: 8px; 
    box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.user-table { 
    width: 100%; 
    border-collapse: collapse; 
    text-align: left; }
.user-table th, .user-table td { 
    padding: 1rem; 
    border-bottom: 1px solid #eee; 
}
.user-table th { 
    background-color: #f9f9f9; 
    font-weight: 600; 
    color: #333;
 }
.role-badge { 
    padding: 0.25rem 0.5rem;
     border-radius: 4px;
     font-size: 0.85rem; 
     font-weight: bold; }
.role-badge.cliente { 
    background-color: #e8f5e9; 
    color: #2e7d32; }
.role-badge.tecnico { 
    background-color: #e3f2fd; 
    color: #1976d2; }
.role-badge.admin { 
    background-color: #fff3e0; 
    color: #f57c00; }
.btn-delete {
     background: none; 
     border: none; 
     cursor: pointer; 
     font-size: 1.2rem; }
.btn-delete:hover { 
    opacity: 0.7; 
}
.pagination { 
    display: flex; 
    justify-content: center; 
    align-items: center; gap: 1rem; 
    margin-top: 2rem; }
.btn-page { 
    padding: 0.5rem 1rem; 
    background-color: #2e7d32;
    color: white; 
    border: none; 
    border-radius: 4px; 
    cursor: pointer; }
.btn-page:disabled {
    background-color: #ccc; 
    cursor: not-allowed; }
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}
.btn-cancel, .btn-confirm {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.btn-cancel { background-color: #ccc; color: #333; }
.btn-confirm { background-color: #d32f2f; color: white; }
</style>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '../services/api';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import { Trash2 } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const categories = ref<any[]>([]);
const newCategoryName = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const showDeleteModal = ref(false);
const categoryToDeleteId = ref<number | null>(null);

onMounted(() => {
  // Proteção: apenas admin
  if (authStore.user?.role !== 'ADMIN') {
    router.push('/');
    return;
  }
  fetchCategories();
});

async function fetchCategories() {
  try {
    const response = await api.get('/categories');
    categories.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    errorMessage.value = 'Erro ao carregar categorias';
  }
}

async function addCategory() {
  if (!newCategoryName.value.trim()) {
    errorMessage.value = 'Nome da categoria é obrigatório';
    return;
  }

  try {
    await api.post('/categories', {
      name: newCategoryName.value
    });
    successMessage.value = 'Categoria criada com sucesso!';
    newCategoryName.value = '';
    errorMessage.value = '';
    setTimeout(() => successMessage.value = '', 3000);
    await fetchCategories();
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Erro ao criar categoria';
    successMessage.value = '';
  }
}

function openDeleteModal(id: number) {
  categoryToDeleteId.value = id;
  showDeleteModal.value = true;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  categoryToDeleteId.value = null;
}

async function confirmDeleteCategory() {
  if (categoryToDeleteId.value === null) return;
  try {
    await api.delete(`/categories/${categoryToDeleteId.value}`);
    successMessage.value = 'Categoria deletada com sucesso!';
    errorMessage.value = '';
    setTimeout(() => successMessage.value = '', 3000);
    await fetchCategories();
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Erro ao deletar categoria';
    successMessage.value = '';
  } finally {
    closeDeleteModal();
  }
}

function goBack() {
  router.push('/admin');
}
</script>

<template>
  <Navbar />
  <div class="categories-container">
    <div class="header">
      <button @click="goBack" class="btn-back">← Voltar</button>
      <h1>Gerenciar Categorias</h1>
    </div>

    <div class="form-container">
      <div class="add-category-form">
        <h2>Adicionar Nova Categoria</h2>
        <div class="form-group">
          <input
            v-model="newCategoryName"
            type="text"
            placeholder="Digite o nome da categoria"
            @keyup.enter="addCategory"
            class="input-field"
          />
          <button @click="addCategory" class="btn-add">Adicionar</button>
        </div>
      </div>

      <div v-if="errorMessage" class="alert alert-error">{{ errorMessage }}</div>
      <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
    </div>

    <div class="categories-list">
      <h2>Categorias Existentes</h2>
      <div v-if="categories.length === 0" class="empty-state">
        <p>Nenhuma categoria criada ainda.</p>
      </div>
      <div v-else class="list">
        <div v-for="category in categories" :key="category.id" class="category-item">
          <span class="category-name">{{ category.name }}</span>
          <button @click="openDeleteModal(category.id)" class="btn-delete" title="Deletar">
            <Trash2 :size="18" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmação -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Confirmar Exclusão</h3>
        <p>Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.</p>
        <div class="modal-actions">
          <button @click="closeDeleteModal" class="btn-cancel">Cancelar</button>
          <button @click="confirmDeleteCategory" class="btn-confirm">Excluir</button>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.categories-container {
  margin-top: 80px;
  min-height: 70vh;
  padding: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn-back {
  background: #2e7d32;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-back:hover {
  background: #1b5e20;
}

h1 {
  margin: 0;
  color: #333;
}

h2 {
  color: #555;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.form-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.add-category-form {
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  gap: 0.5rem;
}

.input-field {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.input-field:focus {
  outline: none;
  border-color: #2e7d32;
  box-shadow: 0 0 4px rgba(46, 125, 50, 0.2);
}

.btn-add {
  background-color: #2e7d32;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
}

.btn-add:hover {
  background-color: #1b5e20;
}

.alert {
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-weight: 500;
}

.alert-error {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #ef5350;
}

.alert-success {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #4caf50;
}

.categories-list {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.empty-state {
  text-align: center;
  color: #999;
  padding: 2rem;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.category-item:hover {
  background: #f0f0f0;
  border-color: #ddd;
}

.category-name {
  font-weight: 500;
  color: #333;
  font-size: 1.1rem;
}

.btn-delete {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}

.btn-delete:hover {
  opacity: 0.7;
}

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
  z-index: 2000;
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

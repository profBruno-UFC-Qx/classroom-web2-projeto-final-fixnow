<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '../services/api';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';

const router = useRouter();
const authStore = useAuthStore();
const categories = ref<any[]>([]);
const newCategoryName = ref('');
const errorMessage = ref('');
const successMessage = ref('');

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

async function deleteCategory(id: number) {
  if (!confirm('Tem certeza que deseja deletar esta categoria?')) {
    return;
  }

  try {
    await api.delete(`/categories/${id}`);
    successMessage.value = 'Categoria deletada com sucesso!';
    errorMessage.value = '';
    setTimeout(() => successMessage.value = '', 3000);
    await fetchCategories();
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Erro ao deletar categoria';
    successMessage.value = '';
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
          <button @click="deleteCategory(category.id)" class="btn-delete">🗑️ Deletar</button>
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
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.btn-delete:hover {
  background: #ffebee;
}
</style>

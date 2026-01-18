<script setup lang="ts">
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
  // Proteção extra: se não for admin, manda pra home
  if (authStore.user?.role !== 'ADMIN') {
    router.push('/');
  }
});
</script>

<template>
  <Navbar />
  <div class="admin-container">
    <div class="admin-header">
      <h1>Painel Administrativo</h1>
      <p>Bem-vindo, Administrador.</p>
    </div>

    <div class="admin-dashboard">
      <div class="dashboard-card">
        <h3>Gerenciar Usuários</h3>
        <p>Visualize e gerencie clientes e técnicos.</p>
        <button class="btn-admin" @click="router.push('/admin/users')">Acessar</button>
      </div>
      <div class="dashboard-card">
        <h3>Gerenciar Categorias</h3>
        <p>Adicione ou remova categorias de serviço.</p>
        <button class="btn-admin" @click="router.push('/admin/categories')">Acessar</button>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.admin-container {
  margin-top: 80px;
  min-height: 70vh;
  padding: 2rem;
  text-align: center;
}
.admin-dashboard {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}
.dashboard-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  width: 250px;
  transition: all 0.3s ease;
}
.btn-admin {
  background-color: #2e7d32;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}
.dashboard-card.expanded {
  width: 100%;
  max-width: 500px;
}
.user-list-container {
  margin-top: 1.5rem;
  border-top: 1px solid #eee;
  padding-top: 1rem;
  text-align: left;
}
.user-list {
  list-style: none;
  padding: 0;
  max-height: 300px;
  overflow-y: auto;
}
.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}
.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.user-role-badge {
  font-size: 0.75rem;
  color: #666;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  align-self: flex-start;
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
</style>
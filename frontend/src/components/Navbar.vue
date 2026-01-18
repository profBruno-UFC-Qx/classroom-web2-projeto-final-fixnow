<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { ref, onMounted, computed } from 'vue';
import { api } from '../services/api';

const authStore = useAuthStore();
const showDropdown = ref(false);
const appointments = ref<any[]>([]);

const recentAppointments = computed(() => {
  return appointments.value
    .filter(apt => apt.client.id === authStore.user?.id || apt.technician.id === authStore.user?.id)
    .slice(0, 3);
});

onMounted(async () => {
  if (authStore.isLoggedIn) {
    try {
      const response = await api.get('/appointments');
      appointments.value = response.data;
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    }
  }
});

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function closeDropdown() {
  showDropdown.value = false;
}

function formatDate(date: string) {
  const d = new Date(date);
  return `${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
}

function getStatusColor(status: string) {
  const colors: { [key: string]: string } = {
    PENDENTE: '#ff9800',
    CONFIRMADO: '#4caf50',
    CONCLUIDO: '#2196f3',
    CANCELADO: '#f44336'
  };
  return colors[status] || '#999';
}
</script>
<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <RouterLink to="/" class="brand-link">
        <img src="../assets/Logo.png" alt="Logo" />
        <span class="brand-name">FixNow</span>
      </RouterLink>
    </div>
    <div class="navbar-menu">
      <div>
        <template v-if="authStore.isLoggedIn">
          <RouterLink class="navbar-item" to="/perfil">Perfil</RouterLink>
          <div class="dropdown-container">
            <button @click="toggleDropdown" class="navbar-item dropdown-trigger">
              Agendamentos
            </button>
            <div v-if="showDropdown" class="dropdown-menu" @mouseleave="closeDropdown">
              <div v-if="recentAppointments.length === 0" class="dropdown-empty">
                Nenhum agendamento
              </div>
              <template v-else>
                <div v-for="apt in recentAppointments" :key="apt.id" class="dropdown-item">
                  <div class="apt-title">{{ apt.title }}</div>
                  <div class="apt-date">{{ formatDate(apt.scheduledDate) }}</div>
                  <div class="apt-status" :style="{ color: getStatusColor(apt.status) }">
                    {{ apt.status }}
                  </div>
                </div>
                <RouterLink to="/appointments" class="dropdown-footer" @click="closeDropdown">
                  Ver todos →
                </RouterLink>
              </template>
            </div>
          </div>
          <RouterLink v-if="authStore.user?.role === 'ADMIN'" class="navbar-item" to="/admin">Painel Admin</RouterLink>
          <a class="navbar-item" @click="authStore.logout">Sair</a>
        </template>
        <template v-else>
          <RouterLink class="navbar-item" to="/login">Login</RouterLink>
          <RouterLink class="navbar-item" to="/register">Registrar</RouterLink>
        </template>
        <RouterLink class="navbar-item" to="/about">Sobre</RouterLink>
        </div>
      </div>
  </nav>
  </template>
  <style scoped>
    .navbar-brand img {
      max-height: 50px;
      padding: 2px;
    }
    .brand-link {
      display: flex;
      align-items: center;
      text-decoration: none;
    }
    .brand-name {
      font-size: 1.5rem;
      font-weight: bold;
      color: #2e7d32;
      margin-left: 0.5rem;
    }
    .navbar {
      background-color: #ffffff;
      padding: 0.2rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1000;
      box-sizing: border-box;
    }
    .navbar-item {
      color: rgb(48, 48, 48);
      font-weight: bold;
      margin-right: 1rem;
      cursor: pointer;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 2px;
      transition: background-color 0.2s;
    }
    .navbar-item:hover {
      background-color: #3e8e41;
      color: white;
    }
    .dropdown-container {
      position: relative;
      display: inline-block;
    }
    .dropdown-trigger {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem 1rem;
      margin-right: 1rem;
      color: rgb(48, 48, 48);
      font-weight: bold;
      font-size: 1rem;
      transition: background-color 0.2s;
    }
    .dropdown-trigger:hover {
      background-color: #3e8e41;
      color: white;
      border-radius: 2px;
    }
    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      min-width: 280px;
      z-index: 1001;
      margin-top: 0.5rem;
    }
    .dropdown-empty {
      padding: 1rem;
      text-align: center;
      color: #999;
    }
    .dropdown-item {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .dropdown-item:hover {
      background-color: #f9f9f9;
    }
    .apt-title {
      font-weight: bold;
      color: #333;
      font-size: 0.95rem;
    }
    .apt-date {
      font-size: 0.85rem;
      color: #666;
      margin-top: 0.25rem;
    }
    .apt-status {
      font-size: 0.8rem;
      font-weight: bold;
      margin-top: 0.25rem;
    }
    .dropdown-footer {
      display: block;
      padding: 0.75rem 1rem;
      text-align: center;
      background-color: #f5f5f5;
      color: #2e7d32;
      font-weight: bold;
      text-decoration: none;
      border-radius: 0 0 4px 4px;
      transition: background-color 0.2s;
    }
    .dropdown-footer:hover {
      background-color: #2e7d32;
      color: white;
    }
  </style>
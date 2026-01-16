<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

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
        <RouterLink class="navbar-item" to="/about">Sobre</RouterLink>
        <template v-if="authStore.isLoggedIn">
          <RouterLink class="navbar-item" to="/perfil">Perfil</RouterLink>
          <a class="navbar-item" @click="authStore.logout">Sair</a>
        </template>
        <template v-else>
          <RouterLink class="navbar-item" to="/login">Login</RouterLink>
          <RouterLink class="navbar-item" to="/register">Registrar</RouterLink>
        </template>
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
  </style>
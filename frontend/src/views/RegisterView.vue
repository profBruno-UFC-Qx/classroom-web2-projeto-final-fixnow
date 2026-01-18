<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../services/api';
import Input from '../components/Input.vue';
import Password from '../components/Password.vue';

const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');
const role = ref('CLIENTE');
const errorMessage = ref('');

async function register() {
  errorMessage.value = '';
  try {
    if (!name.value || !email.value || !password.value) {
      errorMessage.value = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }
    
    const userData = {
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value,
    };

    await api.post('/users', userData);
    router.push('/login');
  } catch (error) {
    console.error('Erro ao registrar:', error);
    errorMessage.value = 'Erro ao registrar usuário.';
  }
}
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Crie sua conta</h1>
      <form @submit.prevent="register">
        <Input label="Nome" v-model="name" placeholder="Seu nome completo" required />
        <Input label="Email" type="email" v-model="email" placeholder="seu@email.com" required />
        <Password label="Senha" v-model="password" placeholder="Crie uma senha" />

        <div class="form-group">
          <label for="role">Tipo de Conta</label>
          <select id="role" v-model="role" class="form-select">
            <option value="CLIENTE">Cliente</option>
            <option value="TECNICO">Técnico</option>
          </select>
        </div>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <button type="submit" class="btn-register">Cadastrar</button>
      </form>
      <p class="login-link">
        Já tem uma conta? <router-link to="/login">Faça Login</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  margin-top: 80px;
}
.register-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}
h1 {
  margin-bottom: 1.5rem;
  text-align: center;
  color: #2e7d32;
}
.form-group {
  margin-bottom: 1rem;
  text-align: left;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
}
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: white;
}
.btn-register {
  width: 100%;
  padding: 0.75rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
}
.btn-register:hover {
  background-color: #2e7d32;
}
.login-link {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  text-align: center;
}
.login-link a {
  color: #2e7d32;
  text-decoration: none;
}
.error-message {
  color: #d32f2f;
  margin-top: 1rem;
  text-align: center;
}
</style>

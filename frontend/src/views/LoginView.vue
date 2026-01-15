<script setup lang="ts">
import Input from '../components/Input.vue'
import Password from '../components/Password.vue'
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const authStore = useAuthStore()
const router = useRouter()

async function login() {
  errorMessage.value = ''
  if (!email.value || !password.value) {
    errorMessage.value = 'Por favor, preencha todos os campos.'
    return
  }
  try {
    await authStore.login(email.value, password.value)
    router.push('/') 
  } catch (error) {
    errorMessage.value = 'Falha no login. Verifique suas credenciais.'
  }
}
</script>
<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Login</h1>
      <form @submit.prevent="login">
        <Input label="Email" type="email" v-model="email" placeholder="Digite seu email" required />
        <Password label="Senha" v-model="password" placeholder="Digite sua senha" required />
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <button type="submit" class="btn-login">Entrar</button>
      </form>
      <p class="register-link">
        Não tem uma conta? <RouterLink to="/register">Cadastre-se</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}
.login-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}
h1 {
  margin-bottom: 1.5rem;
  color: #333;
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
.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
.btn-login {
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
.btn-login:hover {
  background-color: #2e7d32;
}
.register-link {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  text-align: center;
}
.register-link a {
  color: #2e7d32;
  text-decoration: none;
}
.register-link a:hover {
  text-decoration: underline;
}
.error-message {
  color: #d32f2f;
  margin-top: 1rem;
  text-align: center;
}
</style>
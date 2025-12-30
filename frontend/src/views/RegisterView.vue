<script setup lang="ts">
    import { reactive, ref, computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { api } from '../services/api';
    import { userRole } from '../types/roles';


    import Input from '../components/Input.vue';
    import Password from '../components/Password.vue';

    const router = useRouter();

    const form = reactive({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: userRole.CLIENTE,
    });

    const loading = ref(false);
    const errorMessage = ref('');
    const successMessage = ref('');

    //computeds
    const isCliente = computed(() => form.role === userRole.CLIENTE);
    const isAdmin = computed(() => form.role === userRole.ADMIN);
    const isTecnico = computed(() => form.role === userRole.TECNICO);
    const passwordsMatch = computed(() => form.password === form.confirmPassword);

    async function registerUser(){
      errorMessage.value = '';
      successMessage.value = '';

      if(!form.username || !form.email || !form.password || !form.confirmPassword){
        errorMessage.value = 'Preencha todos os campos.';
        return;
      }
      if(!passwordsMatch.value){
        errorMessage.value = 'As senhas não coincidem.';
        return;
      }

      try {
        loading.value = true;
        await api.post('/auth/register', {
          username: form.username,
          email: form.email,
          password: form.password,
          role: form.role
        });
        successMessage.value = 'Cadastro realizado com sucesso!';
        setTimeout(() => router.push('/login'), 2000);
      } catch (error: any) {
        errorMessage.value = error.response?.data?.message || 'Erro ao realizar cadastro.';
      } finally {
        loading.value = false;
      }
    }

</script>
<template>
  <div class="form-container">
    <h1>Criar conta</h1>
    <UsertypeSelector v-model="form.role" />
    <form @submit.prevent="registerUser">
      <Input label="Nome" v-model="form.username" placeholder="Digite seu nome" required/>
      <Input label="Email" type="email" v-model="form.email" placeholder="Digite seu email" required/>
      <Password label="Senha" v-model="form.password" placeholder="Digite sua senha"/>
      <Password label="Confirmar Senha" v-model="form.confirmPassword" placeholder="Confirme sua senha"/>
      <button type="submit" class="submit-btn" :disabled="loading">
        {{ loading ? 'Cadastrando...' : 'Cadastrar' }}
      </button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>

      <button id="login-button" type="button">
        <router-link to="/login">Já possui uma conta? Faça login</router-link>
      </button>
  
    </form>
      
    
  </div>

</template>
<style scoped>
.form-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

h1 {
  text-align: center;
  color: #2e7d32; /* Verde escuro */
  margin-bottom: 1.5rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.submit-btn {
  background-color: #4CAF50; /* Verde base */
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
}

.submit-btn:hover:not(:disabled) {
  background-color: #45a049; /* Verde um pouco mais escuro */
}

.submit-btn:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
}

.error {
  color: #d32f2f;
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.success {
  color: #2e7d32;
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
}

#login-button {
  background: none;
  border: none;
  padding: 0;
  margin-top: 1.5rem;
  font-family: inter, sans-serif;
  cursor: pointer;
  width: 100%;
}

#login-button a {
  color: #2e7d32; /* Verde escuro */
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: color 0.3s;
}

#login-button a:hover {
  text-decoration: underline;
}
</style>
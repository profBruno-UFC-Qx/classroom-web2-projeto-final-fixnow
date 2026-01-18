<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useCategoriesStore } from '../stores/categories';
import { api } from '../services/api';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import Input from '../components/Input.vue';
import Password from '../components/Password.vue';

const authStore = useAuthStore();
const categoriesStore = useCategoriesStore();
const user = ref(authStore.user);

// Campos do formulário
const name = ref('');
const email = ref('');
const password = ref('');
const profession = ref('');
const phone = ref('');
const profileImage = ref<string | null>(null);
const successMessage = ref('');
const errorMessage = ref('');
const isLoading = ref(false);
const uploadingImage = ref(false);

onMounted(() => {
  categoriesStore.fetchCategories();

  if (user.value) {
    name.value = user.value.name;
    email.value = user.value.email;
    profession.value = user.value.profession || '';
    phone.value = user.value.phone || '';
    profileImage.value = user.value.profileImage || null;
  }
});

// Função para converter arquivo para base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

async function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (!files || files.length === 0) return;

  const file = files[0];

  // Validar tipo de arquivo
  if (!file || !file.type.startsWith('image/')) {
    errorMessage.value = 'Por favor, selecione uma imagem válida';
    // Resetar input
    target.value = '';
    return;
  }

  // Validar tamanho (máx 5MB)
  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = 'A imagem deve ter no máximo 5MB';
    // Resetar input
    target.value = '';
    return;
  }

  try {
    uploadingImage.value = true;
    errorMessage.value = '';

    const base64 = await fileToBase64(file);
    profileImage.value = base64;

    // Enviar para backend
    await api.post(`/users/${user.value?.id}/profile-image`, {
      profileImage: base64
    });

    // Atualizar no store
    if (authStore.user) {
      authStore.user.profileImage = base64;
    }
    user.value = authStore.user;

    successMessage.value = 'Foto de perfil atualizada com sucesso!';
    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
  } catch (error: any) {
    console.error('Erro ao fazer upload da imagem:', error);
    errorMessage.value = error.response?.data?.message || 'Erro ao fazer upload da imagem';
    profileImage.value = null;
  } finally {
    uploadingImage.value = false;
    // Resetar input para permitir selecionar o mesmo arquivo novamente
    target.value = '';
  }
}

async function updateProfile() {
  errorMessage.value = '';
  successMessage.value = '';

  if (!name.value || !email.value) {
    errorMessage.value = 'Nome e email são obrigatórios.';
    return;
  }

  // Se é técnico, profissão é obrigatória
  if (user.value?.role === 'TECNICO' && !profession.value) {
    errorMessage.value = 'Profissão é obrigatória para técnicos.';
    return;
  }

  isLoading.value = true;

  try {
    const updateData: any = {
      name: name.value,
      email: email.value,
      profession: profession.value,
      phone: phone.value
    };

    // Apenas incluir password se foi preenchida
    if (password.value) {
      updateData.password = password.value;
    }

    await authStore.updateProfile(updateData);
    user.value = authStore.user;
    successMessage.value = 'Perfil atualizado com sucesso!';
    password.value = ''; // Limpar campo de senha
  } catch (error: any) {
    console.error('Erro ao atualizar perfil:', error);
    errorMessage.value = error.response?.data?.message || 'Erro ao atualizar perfil. Tente novamente.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <Navbar />
  <div class="profile-container">
    <div class="profile-card">
      <h1>Meu Perfil</h1>

      <div v-if="user" class="profile-info">
        <p class="info-text">
          <strong>Tipo de Conta:</strong>
          <span class="role-badge" :class="user.role.toLowerCase()">
            {{ user.role === 'CLIENTE' ? 'Cliente' : 'Técnico' }}
          </span>
        </p>
      </div>

      <!-- Seção de Foto de Perfil -->
      <div class="profile-photo-section">
        <div class="photo-container">
          <img 
            v-if="profileImage || user?.profileImage"
            :src="profileImage || user?.profileImage" 
            alt="Foto de perfil"
            class="profile-photo"
          />
          <div v-else class="photo-placeholder">
            <span>📷</span>
            <p>Nenhuma foto</p>
          </div>
        </div>

        <div class="photo-upload">
          <label for="photo-input" class="upload-label">
            Selecionar Foto
          </label>
          <input
            id="photo-input"
            type="file"
            accept="image/*"
            @change="handleImageUpload"
            class="photo-input"
            :disabled="uploadingImage"
          />
          <p class="photo-info">
            Máximo 5MB • Formatos: JPG, PNG, WebP
          </p>
        </div>
      </div>

      <form @submit.prevent="updateProfile" class="profile-form">
        <Input
          label="Nome"
          v-model="name"
          placeholder="Seu nome completo"
          required
        />

        <Input
          label="Email"
          type="email"
          v-model="email"
          placeholder="seu@email.com"
          required
        />

        <div v-if="user?.role === 'TECNICO'" class="form-group">
          <label for="profession">Categoria de Profissão *</label>
          <select
            id="profession"
            v-model="profession"
            class="form-select"
            required
          >
            <option value="">Selecione uma profissão</option>
            <option v-for="category in categoriesStore.categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <Input
          label="Celular (para técnicos)"
          type="tel"
          v-model="phone"
          placeholder="(11) 99999-9999"
        />

        <Password
          label="Nova Senha (deixe em branco para não alterar)"
          v-model="password"
          placeholder="Digite uma nova senha (opcional)"
        />

        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <button
          type="submit"
          class="btn-update"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Atualizando...' : 'Atualizar Perfil' }}
        </button>
      </form>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.profile-container {
  margin-top: 80px;
  min-height: 70vh;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.profile-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

h1 {
  margin-bottom: 2rem;
  text-align: center;
  color: #2e7d32;
}

.profile-info {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.info-text {
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.role-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
  color: white;
}

.role-badge.cliente {
  background-color: #2e7d32;
}

.role-badge.tecnico {
  background-color: #1976d2;
}

.profile-photo-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 2px dashed #2e7d32;
  text-align: center;
}

.photo-container {
  margin-bottom: 1.5rem;
}

.profile-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #2e7d32;
  display: inline-block;
}

.photo-placeholder {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #e8f5e9;
  border: 4px solid #2e7d32;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto;
}

.photo-placeholder span {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.photo-placeholder p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.photo-upload {
  margin-top: 1rem;
}

.upload-label {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #2e7d32;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.upload-label:hover {
  background-color: #1b5e20;
}

.photo-input {
  display: none;
}

.photo-info {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
}

.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: white;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-select:focus {
  outline: none;
  border-color: #2e7d32;
  box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.1);
}

.btn-update {
  width: 100%;
  padding: 0.75rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 1rem;
  transition: background-color 0.2s;
}

.btn-update:hover:not(:disabled) {
  background-color: #2e7d32;
}

.btn-update:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-message {
  color: #2e7d32;
  background-color: #e8f5e9;
  padding: 0.75rem;
  border-radius: 4px;
  text-align: center;
  margin: 0;
}

.error-message {
  color: #d32f2f;
  background-color: #ffebee;
  padding: 0.75rem;
  border-radius: 4px;
  text-align: center;
  margin: 0;
}
</style>
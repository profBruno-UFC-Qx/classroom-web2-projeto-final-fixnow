<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '../services/api';
import { useAuthStore } from '../stores/auth';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

interface Technician {
  id: number;
  name: string;
  email: string;
  profession: string;
  phone?: string;
  profileImage: string | null;
  created_at: string;
  role: string;
}

interface Review {
  id: number;
  stars: number;
  comment: string;
  client: {
    name: string;
  };
  created_at: string;
}

const technician = ref<Technician | null>(null);
const reviews = ref<Review[]>([]);
const isLoading = ref(true);
const errorMessage = ref('');
const successMessage = ref('');

// Modal de agendamento
const showScheduleModal = ref(false);
const isSubmittingAppointment = ref(false);
const appointmentForm = ref({
  title: '',
  description: '',
  category: '',
  scheduledDate: '',
  address: '',
  city: '',
  phone: '',
  notes: ''
});

// Form de review
const reviewForm = ref({
  stars: 5,
  comment: ''
});
const isSubmittingReview = ref(false);

// Calcular média de avaliações
const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0;
  const sum = reviews.value.reduce((acc, review) => acc + review.stars, 0);
  return sum / reviews.value.length;
});

// Verificar se o usuário logado é o técnico (não permite self-review)
const isSelfReview = computed(() => {
  return authStore.isLoggedIn && technician.value && authStore.user?.id === technician.value.id;
});

// Função para renderizar estrelas
function renderStars(stars: number) {
  return '⭐'.repeat(stars) + '☆'.repeat(5 - stars);
}

// Formatar data
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

onMounted(async () => {
  try {
    isLoading.value = true;
    const technicianId = route.params.id;

    // Buscar dados do técnico
    const techResponse = await api.get(`/users/${technicianId}`);
    technician.value = techResponse.data;

    // Buscar reviews do técnico
    const reviewsResponse = await api.get(`/reviews/${technicianId}`);
    reviews.value = reviewsResponse.data;
  } catch (error: any) {
    console.error('Erro ao carregar detalhes:', error);
    errorMessage.value = 'Erro ao carregar informações do técnico. Tente novamente.';
  } finally {
    isLoading.value = false;
  }
});

function goBack() {
  router.back();
}

function openScheduleModal() {
  if (!authStore.isLoggedIn) {
    router.push('/login');
    return;
  }
  
  if (authStore.user?.role !== 'CLIENTE') {
    errorMessage.value = 'Apenas clientes podem agendar serviços';
    return;
  }

  showScheduleModal.value = true;
  // Preencher categoria com a profissão do técnico
  appointmentForm.value.category = technician.value?.profession || '';
}

function closeScheduleModal() {
  showScheduleModal.value = false;
  appointmentForm.value = {
    title: '',
    description: '',
    category: '',
    scheduledDate: '',
    address: '',
    city: '',
    phone: '',
    notes: ''
  };
}

async function submitAppointment() {
  if (!appointmentForm.value.title.trim() || !appointmentForm.value.description.trim() || !appointmentForm.value.scheduledDate) {
    errorMessage.value = 'Por favor, preencha os campos obrigatórios';
    return;
  }

  isSubmittingAppointment.value = true;
  
  try {
    await api.post('/appointments', {
      clientId: authStore.user?.id,
      technicianId: technician.value?.id,
      title: appointmentForm.value.title,
      description: appointmentForm.value.description,
      category: appointmentForm.value.category,
      scheduledDate: appointmentForm.value.scheduledDate,
      address: appointmentForm.value.address,
      city: appointmentForm.value.city,
      phone: appointmentForm.value.phone,
      notes: appointmentForm.value.notes
    });

    successMessage.value = 'Agendamento criado com sucesso! Veja seus agendamentos no navbar.';
    closeScheduleModal();
    
    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Erro ao criar agendamento';
  } finally {
    isSubmittingAppointment.value = false;
  }
}

async function submitReview() {
  if (!reviewForm.value.comment.trim()) {
    errorMessage.value = 'Por favor, digite um comentário para a avaliação.';
    return;
  }

  try {
    isSubmittingReview.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    await api.post('/reviews', {
      technicianId: technician.value?.id,
      stars: reviewForm.value.stars,
      comment: reviewForm.value.comment
    });

    successMessage.value = 'Avaliação enviada com sucesso!';
    reviewForm.value.comment = '';
    reviewForm.value.stars = 5;

    // Recarregar reviews
    const reviewsResponse = await api.get(`/reviews/${technician.value?.id}`);
    reviews.value = reviewsResponse.data;
  } catch (error: any) {
    console.error('Erro ao enviar review:', error);
    errorMessage.value = error.response?.data?.message || 'Erro ao enviar avaliação. Tente novamente.';
  } finally {
    isSubmittingReview.value = false;
  }
}
</script>

<template>
  <Navbar />
  <div class="details-container">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading">
      <p>Carregando detalhes...</p>
    </div>

    <!-- Messages -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>

    <!-- Error State -->
    <div v-if="errorMessage && !technician" class="error-page">
      <p>{{ errorMessage }}</p>
      <button @click="goBack" class="btn-back">Voltar</button>
    </div>

    <!-- Main Content -->
    <div v-else-if="technician" class="details-content">
      <!-- Header com foto e informações básicas -->
      <div class="technician-header">
        <div class="photo-section">
          <img
            v-if="technician.profileImage"
            :src="technician.profileImage"
            :alt="technician.name"
            class="technician-photo"
          />
          <div v-else class="photo-placeholder">
            <span>👤</span>
          </div>
        </div>

        <div class="info-section">
          <h1 class="technician-name">{{ technician.name }}</h1>
          <p class="technician-profession">{{ technician.profession }}</p>

          <div class="rating-section">
            <div v-if="reviews.length > 0" class="rating-display">
              <span class="stars">{{ renderStars(Math.round(averageRating)) }}</span>
              <span class="rating-number">{{ averageRating.toFixed(1) }}</span>
              <span class="rating-count">({{ reviews.length }} avaliações)</span>
            </div>
            <div v-else class="no-ratings">
              <p>Sem avaliações ainda</p>
            </div>
          </div>

          <div class="contact-section">
            <p><strong>Email:</strong> {{ technician.email }}</p>
            <p v-if="technician.phone"><strong>Celular:</strong> {{ technician.phone }}</p>
            <p><strong>Membro desde:</strong> {{ formatDate(technician.created_at) }}</p>
          </div>

          <button @click="openScheduleModal" class="btn-schedule">
            Agendar
          </button>
        </div>
      </div>

      <!-- Reviews Section -->
      <div class="reviews-section">
        <h2>Avaliações dos Clientes</h2>

        <div v-if="reviews.length === 0" class="no-reviews">
          <p>Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>
        </div>

        <div v-else class="reviews-list">
          <div v-for="review in reviews" :key="review.id" class="review-card">
            <div class="review-header">
              <div class="review-author">
                <strong>{{ review.client.name }}</strong>
              </div>
              <div class="review-stars">
                {{ renderStars(review.stars) }}
              </div>
            </div>

            <p class="review-comment">{{ review.comment }}</p>

            <p class="review-date">
              {{ formatDate(review.created_at) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Create Review Section -->
      <div class="create-review-section">
        <h2>Deixe sua Avaliação</h2>
        
        <!-- Self Review Block -->
        <div v-if="isSelfReview" class="self-review-block">
          <p> ! Você não pode avaliar a si mesmo. Apenas clientes podem deixar avaliações.</p>
        </div>

        <!-- Review Form -->
        <form v-else @submit.prevent="submitReview" class="review-form">
          <div class="form-group">
            <label for="stars">Classificação:</label>
            <div class="stars-input">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                class="star-button"
                :class="{ active: reviewForm.stars >= star }"
                @click="reviewForm.stars = star"
              >
                ⭐
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="comment">Comentário:</label>
            <textarea
              id="comment"
              v-model="reviewForm.comment"
              placeholder="Compartilhe sua experiência com este técnico..."
              rows="4"
              class="textarea-input"
              maxlength="500"
            ></textarea>
            <span class="char-count">{{ reviewForm.comment.length }}/500</span>
          </div>

          <button
            type="submit"
            class="btn-submit-review"
            :disabled="isSubmittingReview || !reviewForm.comment.trim()"
          >
            {{ isSubmittingReview ? 'Enviando...' : 'Enviar Avaliação' }}
          </button>
        </form>
      </div>

      <!-- Back Button -->
      <div class="button-section">
        <button @click="goBack" class="btn-back">
          ← Voltar
        </button>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="not-found">
      <p>Técnico não encontrado</p>
      <button @click="goBack" class="btn-back">Voltar</button>
    </div>
  </div>
  <Footer />

  <!-- Modal de Agendamento -->
  <div v-if="showScheduleModal" class="modal-overlay" @click="closeScheduleModal">
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="closeScheduleModal">✕</button>
      
      <h2>Agendar Serviço com {{ technician?.name }}</h2>

      <form @submit.prevent="submitAppointment">
        <div class="form-group">
          <label>Título do Serviço *</label>
          <input 
            v-model="appointmentForm.title"
            type="text"
            placeholder="Ex: Reparo na torneira"
            required
          />
        </div>

        <div class="form-group">
          <label>Descrição *</label>
          <textarea
            v-model="appointmentForm.description"
            placeholder="Descreva o problema e o que precisa ser feito"
            rows="4"
            required
          />
        </div>

        <div class="form-group">
          <label>Categoria</label>
          <input 
            v-model="appointmentForm.category"
            type="text"
            placeholder="Categoria do serviço"
            disabled
          />
        </div>

        <div class="form-group">
          <label>Data e Hora *</label>
          <input 
            v-model="appointmentForm.scheduledDate"
            type="datetime-local"
            required
          />
        </div>

        <div class="form-group">
          <label>Endereço</label>
          <input 
            v-model="appointmentForm.address"
            type="text"
            placeholder="Rua, número"
          />
        </div>

        <div class="form-group">
          <label>Cidade</label>
          <input 
            v-model="appointmentForm.city"
            type="text"
            placeholder="Sua cidade"
          />
        </div>

        <div class="form-group">
          <label>Telefone para Contato</label>
          <input 
            v-model="appointmentForm.phone"
            type="tel"
            placeholder="(11) 99999-9999"
          />
        </div>

        <div class="form-group">
          <label>Notas Adicionais</label>
          <textarea
            v-model="appointmentForm.notes"
            placeholder="Qualquer informação adicional"
            rows="3"
          />
        </div>

        <div v-if="errorMessage" class="error-alert">
          {{ errorMessage }}
        </div>

        <div class="form-actions">
          <button type="button" @click="closeScheduleModal" class="btn-cancel">
            Cancelar
          </button>
          <button type="submit" :disabled="isSubmittingAppointment" class="btn-submit">
            {{ isSubmittingAppointment ? 'Criando...' : 'Criar Agendamento' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.details-container {
  min-height: 80vh;
  margin-top: 80px;
  padding: 2rem;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

.loading,
.error-message,
.not-found {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.error-message,
.not-found,
.error-page {
  color: #d32f2f;
}

.success-message {
  background-color: #c8e6c9;
  color: #2e7d32;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border-left: 4px solid #2e7d32;
}

.loading {
  color: #2e7d32;
  font-size: 1.1rem;
}

.details-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Header Section */
.technician-header {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.photo-section {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.technician-photo {
  width: 200px;
  height: 200px;
  border-radius: 8px;
  object-fit: cover;
  border: 4px solid #2e7d32;
}

.photo-placeholder {
  width: 200px;
  height: 200px;
  background-color: #e8f5e9;
  border: 4px solid #2e7d32;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.technician-name {
  margin: 0;
  font-size: 2rem;
  color: #2e7d32;
}

.technician-profession {
  margin: 0;
  font-size: 1.2rem;
  color: #1976d2;
  font-weight: 600;
}

.rating-section {
  margin: 1rem 0;
}

.rating-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stars {
  font-size: 1.3rem;
}

.rating-number {
  font-weight: bold;
  color: #333;
  font-size: 1.1rem;
}

.rating-count {
  color: #666;
  font-size: 0.9rem;
}

.no-ratings {
  color: #999;
  font-style: italic;
}

.contact-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact-section p {
  margin: 0;
  font-size: 0.95rem;
  color: #555;
}

.btn-contact {
  align-self: flex-start;
  padding: 0.75rem 1.5rem;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.2s;
  margin-top: 1rem;
}

.btn-contact:hover {
  background-color: #1565c0;
}

.btn-schedule {
  align-self: flex-start;
  padding: 0.75rem 1.5rem;
  background-color: #2e7d32;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.2s;
  margin-top: 1rem;
}

.btn-schedule:hover {
  background-color: #1b5e20;
}

/* Reviews Section */
.reviews-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.reviews-section h2 {
  color: #2e7d32;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.no-reviews {
  text-align: center;
  color: #999;
  padding: 2rem;
  font-style: italic;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-card {
  border-left: 4px solid #2e7d32;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.review-author {
  font-size: 0.95rem;
  color: #333;
}

.review-stars {
  font-size: 1rem;
  color: #ffc107;
}

.review-comment {
  margin: 0.75rem 0;
  color: #555;
  line-height: 1.5;
}

.review-date {
  margin: 0;
  font-size: 0.85rem;
  color: #999;
}

/* Create Review Section */
.create-review-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-top: 4px solid #1976d2;
}

.create-review-section h2 {
  color: #1976d2;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.stars-input {
  display: flex;
  gap: 0.5rem;
}

.star-button {
  background: none;
  border: 2px solid #ddd;
  font-size: 1.8rem;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.star-button:hover,
.star-button.active {
  border-color: #ffc107;
  background-color: #fff9e6;
  transform: scale(1.1);
}

.textarea-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.95rem;
  resize: vertical;
  transition: border-color 0.2s;
}

.textarea-input:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.char-count {
  font-size: 0.8rem;
  color: #999;
  align-self: flex-end;
}

.btn-submit-review {
  padding: 0.75rem 1.5rem;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.2s;
}

.btn-submit-review:hover:not(:disabled) {
  background-color: #1565c0;
}

.btn-submit-review:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Self Review Block */
.self-review-block {
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  border-left: 4px solid #ffc107;
  padding: 1rem;
  border-radius: 4px;
  color: #856404;
}

.self-review-block p {
  margin: 0;
  font-weight: 500;
}

/* Button Section */
.button-section {
  text-align: center;
  margin-top: 2rem;
}

.btn-back {
  padding: 0.75rem 1.5rem;
  background-color: #2e7d32;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.2s;
}

.btn-back:hover {
  background-color: #1b5e20;
}

/* Responsive */
@media (max-width: 768px) {
  .technician-header {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .photo-section {
    justify-content: center;
  }

  .technician-name {
    font-size: 1.5rem;
  }

  .technician-photo,
  .photo-placeholder {
    width: 150px;
    height: 150px;
  }

  .details-container {
    padding: 1rem;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  transition: color 0.2s;
}

.modal-close:hover {
  color: #333;
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #2e7d32;
  box-shadow: 0 0 4px rgba(46, 125, 50, 0.2);
}

.form-group input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.error-alert {
  background: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border: 1px solid #ef5350;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.btn-cancel,
.btn-submit {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.btn-cancel {
  background: #f5f5f5;
  color: #333;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-submit {
  background: #2e7d32;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: #1b5e20;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
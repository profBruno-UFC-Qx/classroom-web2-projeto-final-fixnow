<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { api } from '../services/api';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';

const router = useRouter();
const authStore = useAuthStore();
const appointments = ref<any[]>([]);
const filterStatus = ref('');
const loading = ref(true);

const filteredAppointments = computed(() => {
  if (!filterStatus.value) {
    return appointments.value;
  }
  return appointments.value.filter(apt => apt.status === filterStatus.value);
});

onMounted(async () => {
  if (!authStore.isLoggedIn) {
    router.push('/login');
    return;
  }

  await fetchAppointments();
});

async function fetchAppointments() {
  try {
    loading.value = true;
    const response = await api.get('/appointments');
    const allAppointments = response.data;
    
    // Filtrar apenas os agendamentos do usuário (como cliente ou técnico)
    const userId = authStore.user?.id;
    appointments.value = allAppointments.filter((apt: any) => 
      apt.client.id === userId || apt.technician.id === userId
    );
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
  } finally {
    loading.value = false;
  }
}

async function updateStatus(appointmentId: number, newStatus: string) {
  try {
    await api.put(`/appointments/${appointmentId}/status`, {
      status: newStatus
    });
    await fetchAppointments();
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
  }
}

async function cancelAppointment(appointmentId: number) {
  if (!confirm('Tem certeza que deseja cancelar este agendamento?')) {
    return;
  }

  try {
    await api.delete(`/appointments/${appointmentId}`);
    await fetchAppointments();
  } catch (error) {
    console.error('Erro ao cancelar agendamento:', error);
  }
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

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function isClientAppointment(appointment: any) {
  return appointment.client.id === authStore.user?.id;
}
</script>

<template>
  <Navbar />
  <div class="appointments-container">
    <div class="header">
      <h1>Meus Agendamentos</h1>
      <button @click="fetchAppointments" class="btn-refresh">Atualizar</button>
    </div>

    <div class="filters">
      <select v-model="filterStatus" class="status-filter">
        <option value="">Todos os Status</option>
        <option value="PENDENTE">Pendente</option>
        <option value="CONFIRMADO">Confirmado</option>
        <option value="CONCLUIDO">Concluído</option>
        <option value="CANCELADO">Cancelado</option>
      </select>
    </div>

    <div v-if="loading" class="loading">
      <p>Carregando agendamentos...</p>
    </div>

    <div v-else-if="filteredAppointments.length === 0" class="empty-state">
      <p>Nenhum agendamento encontrado</p>
    </div>

    <div v-else class="appointments-list">
      <div v-for="appointment in filteredAppointments" :key="appointment.id" class="appointment-card">
        <div class="appointment-header">
          <h3>{{ appointment.title }}</h3>
          <span class="status-badge" :style="{ backgroundColor: getStatusColor(appointment.status) }">
            {{ appointment.status }}
          </span>
        </div>

        <div class="appointment-info">
          <div class="info-row">
            <span class="label">Categoria:</span>
            <span class="value">{{ appointment.category }}</span>
          </div>

          <div class="info-row">
            <span class="label">{{ isClientAppointment(appointment) ? 'Técnico:' : 'Cliente:' }}</span>
            <span class="value">
              {{ isClientAppointment(appointment) ? appointment.technician.name : appointment.client.name }}
            </span>
          </div>

          <div class="info-row">
            <span class="label">Data/Hora:</span>
            <span class="value">{{ formatDate(appointment.scheduledDate) }}</span>
          </div>

          <div v-if="appointment.address" class="info-row">
            <span class="label">Endereço:</span>
            <span class="value">{{ appointment.address }}, {{ appointment.city }}</span>
          </div>

          <div v-if="appointment.phone" class="info-row">
            <span class="label">Telefone:</span>
            <span class="value">{{ appointment.phone }}</span>
          </div>

          <div class="info-row">
            <span class="label">Descrição:</span>
            <span class="value">{{ appointment.description }}</span>
          </div>

          <div v-if="appointment.notes" class="info-row">
            <span class="label">Notas:</span>
            <span class="value">{{ appointment.notes }}</span>
          </div>
        </div>

        <div class="appointment-actions">
          <template v-if="appointment.status === 'PENDENTE'">
            <button 
              v-if="!isClientAppointment(appointment)"
              @click="updateStatus(appointment.id, 'CONFIRMADO')"
              class="btn-action btn-confirm"
            >
              ✓ Confirmar
            </button>
          </template>

          <template v-if="appointment.status === 'CONFIRMADO'">
            <button 
              v-if="!isClientAppointment(appointment)"
              @click="updateStatus(appointment.id, 'CONCLUIDO')"
              class="btn-action btn-complete"
            >
              ✓ Marcar Concluído
            </button>
          </template>

          <button 
            v-if="appointment.status !== 'CANCELADO' && appointment.status !== 'CONCLUIDO'"
            @click="cancelAppointment(appointment.id)"
            class="btn-action btn-cancel"
          >
            ✕ Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.appointments-container {
  margin-top: 80px;
  min-height: 70vh;
  padding: 2rem;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  margin: 0;
  color: #333;
}

.btn-refresh {
  background: #2e7d32;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-refresh:hover {
  background: #1b5e20;
}

.filters {
  margin-bottom: 2rem;
}

.status-filter {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.status-filter:focus {
  outline: none;
  border-color: #2e7d32;
  box-shadow: 0 0 4px rgba(46, 125, 50, 0.2);
}

.loading,
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #999;
}

.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.appointment-card {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.appointment-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.appointment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.appointment-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
}

.status-badge {
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
}

.appointment-info {
  margin-bottom: 1.5rem;
}

.info-row {
  display: flex;
  gap: 1rem;
  padding: 0.5rem 0;
}

.label {
  font-weight: bold;
  color: #666;
  min-width: 120px;
}

.value {
  color: #333;
  flex: 1;
}

.appointment-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-action {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-confirm {
  background: #4caf50;
  color: white;
}

.btn-confirm:hover {
  background: #388e3c;
}

.btn-complete {
  background: #2196f3;
  color: white;
}

.btn-complete:hover {
  background: #1976d2;
}

.btn-cancel {
  background: #f44336;
  color: white;
}

.btn-cancel:hover {
  background: #da190b;
}
</style>

<script setup lang ="ts">
import Navbar from '../components/Navbar.vue'
import Cards from '../components/Cards.vue'
import { ref, onMounted } from 'vue'
import { api } from '../services/api'
import Footer from '../components/Footer.vue'

const services = ref([])

onMounted(async () => {
  try {
    const response = await api.get('/users');
    // Filtra apenas os técnicos e mapeia para o formato do Card
    services.value = response.data
      .filter((user: any) => user.role === 'TECNICO')
      .map((user: any) => ({
        id: user.id,
        title: user.profession || 'Tecnico', //Nao estou conseguindo pegar a profissao que foi cadastrada no backend
        description: user.serviceDescription || 'Entre em contato para mais detalhes.',
        image: user.serviceImage || 'https://placehold.co/600x400/EEE/31343C?text=Serviço',
        provider: user.name,
        price: user.servicePrice || 'A combinar'
      }));
  } catch (error) {
    console.error('Erro ao carregar serviços:', error);
  }
});
</script>
<template>
  <Navbar />
  <div class="main-content">
    <div class="banner">
      <h1>Bem-vindo ao Fixnow!</h1>
      <p>Encontre soluções rápidas para seus problemas técnicos.</p>
    </div>
    <div>
      <h2>Técnicos Disponíveis</h2>
      <p>Escolha entre nossos profissionais qualificados:</p>
    </div>
  </div>
  <Cards :items="services" />
  <Footer/>
</template>
<style scoped>
.main-content {
  margin-top: 70px; /* Compensa a altura da Navbar fixa */
  text-align: center;
}
.banner {
  background-color: #14972a;
  padding: 3rem;
  margin-bottom: 2rem;
  color: white;
  border-radius: 8px;
  text-align: left;
}
.banner h1, .banner p {
  margin-left: 30px;
}
</style>
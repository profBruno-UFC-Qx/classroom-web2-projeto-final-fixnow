<script setup lang ="ts">
import Navbar from '../components/Navbar.vue'
import Cards from '../components/Cards.vue'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'
import Footer from '../components/Footer.vue'
import { useCategoriesStore } from '../stores/categories'

const router = useRouter()
const services = ref([])
const searchQuery = ref('')
const selectedCategory = ref('')
const categoriesStore = useCategoriesStore()

const filteredServices = computed(() => {
  return services.value.filter((service: any) => {
    const searchLower = searchQuery.value.toLowerCase()
    const matchesSearch = 
      service.title.toLowerCase().includes(searchLower) || 
      service.provider.toLowerCase().includes(searchLower) ||
      service.description.toLowerCase().includes(searchLower)
    
    const matchesCategory = selectedCategory.value === '' || service.title === selectedCategory.value
    
    return matchesSearch && matchesCategory
  })
})

const topRatedServices = computed(() => {
  return [...services.value]
    .sort((a: any, b: any) => b.rating - a.rating)
    .slice(0, 3)
})

function goToDetails(id: number) {
  router.push(`/details/${id}`)
}

onMounted(async () => {
  // Busca as categorias atualizadas 
  categoriesStore.fetchCategories();

  try {
    const response = await api.get('/users');
    // Filtra apenas os técnicos e mapeia para o formato do Card
    const technicians = response.data.filter((user: any) => user.role === 'TECNICO');
    
    // Buscar reviews para cada técnico
    const servicesWithRatings = await Promise.all(
      technicians.map(async (user: any) => {
        try {
          const reviewsResponse = await api.get(`/reviews/${user.id}`);
          const reviews = reviewsResponse.data;
          const averageRating = reviews.length > 0
            ? reviews.reduce((acc: number, review: any) => acc + review.stars, 0) / reviews.length
            : 0;
          
          return {
            id: user.id,
            title: user.profession || 'Técnico',
            description: user.serviceDescription || 'Entre em contato para mais detalhes.',
            image: user.profileImage || 'https://placehold.co/600x400/EEE/31343C?text=Técnico',
            provider: user.name,
            price: user.servicePrice || 'A combinar',
            rating: averageRating,
            reviewCount: reviews.length
          };
        } catch (error) {
          console.error(`Erro ao carregar reviews do técnico ${user.id}:`, error);
          return {
            id: user.id,
            title: user.profession || 'Técnico',
            description: user.serviceDescription || 'Entre em contato para mais detalhes.',
            image: user.profileImage || 'https://placehold.co/600x400/EEE/31343C?text=Técnico',
            provider: user.name,
            price: user.servicePrice || 'A combinar',
            rating: 0,
            reviewCount: 0
          };
        }
      })
    );
    
    services.value = servicesWithRatings;
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
    <div class="search-section">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Pesquisar por nome ou especialidade..." 
        class="search-input"
      />
      <select v-model="selectedCategory" class="category-select">
        <option value="">Todas as Categorias</option>
        <option v-for="category in categoriesStore.categories" :key="category" :value="category">{{ category }}</option>
      </select>
    </div>
    <div>
      <h2>Técnicos Disponíveis</h2>
      <p>Escolha entre nossos profissionais qualificados:</p>
    </div>
  </div>
  <Cards :items="filteredServices" />
  <div v-if="topRatedServices.length > 0" class="top-rated-section">
    <h3>⭐ Top 3 Melhores Avaliados</h3>
    <div class="top-rated-grid">
      <div 
        v-for="service in topRatedServices" 
        :key="service.id" 
        class="top-rated-card"
        @click="goToDetails(service.id)"
      >
        <img :src="service.image" :alt="service.title" class="top-rated-img" />
        <div class="top-rated-info">
          <p class="provider-name">{{ service.provider }}</p>
          <p class="rating">⭐ {{ service.rating.toFixed(1) }}</p>
        </div>
      </div>
    </div>
  </div>
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
.search-section {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
  padding: 0 1rem;
  flex-wrap: wrap;
}
.search-input, .category-select {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
  max-width: 300px;
}
.search-input:focus, .category-select:focus {
  outline: none;
  border-color: #14972a;
  box-shadow: 0 0 0 2px rgba(20, 151, 42, 0.2);
}
.top-rated-section {
  padding: 2rem;
  text-align: center;
  margin-top: 2rem;
}
.top-rated-grid {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}
.top-rated-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s;
}
.top-rated-card:hover {
  transform: translateY(-2px);
}
.top-rated-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #2e7d32;
}
.top-rated-info {
  text-align: left;
}
.provider-name {
  font-weight: bold;
  margin: 0;
  font-size: 0.9rem;
  color: #333;
}
.rating {
  margin: 0;
  font-size: 0.8rem;
  color: #666;
}
</style>
<script setup lang="ts">
import { useRouter } from 'vue-router';

interface CardItem {
  id: number;
  title: string;
  description: string;
  image: string;
  provider?: string;
  price?: string;
}

defineProps<{
  items: CardItem[];
}>();

const router = useRouter();

function goToDetails(id: number) {
  router.push('/details');
}
</script>
<template>
  <div class="card-container">
    <div v-for="item in items" :key="item.id" class="card">
      <img :src="item.image" :alt="item.title" class="card-image" />
      <div class="card-content">
        <h3 class="card-title">{{ item.title }}</h3>
        <p v-if="item.provider" class="card-provider"><strong>Prestador:</strong> {{ item.provider }}</p>
        <p class="card-description">{{ item.description }}</p>
        <p v-if="item.price" class="card-price"><strong>Valor:</strong> {{ item.price }}</p>
        <button class="card-button" @click="goToDetails(item.id)">Ver Detalhes</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  padding: 2rem;
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 300px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-title {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #2e7d32;
}

.card-provider {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 0.5rem;
}

.card-description {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 1rem;
  flex-grow: 1;
}

.card-price {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
}

.card-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
  margin-top: auto;
}

.card-button:hover {
  background-color: #45a049;
}
</style>
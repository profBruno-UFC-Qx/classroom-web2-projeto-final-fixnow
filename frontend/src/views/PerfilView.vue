<script setup lang="ts">
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';


</script>
<template>
    <Navbar/>
    <div class="profile-container">
        <h1>Meu Perfil</h1>
      
    </div>
    <Footer/>
</template>
<style scoped>
.profile-container {
    margin-top: 80px; 
    min-height: 70vh; 
    padding: 2rem;
}
</style>
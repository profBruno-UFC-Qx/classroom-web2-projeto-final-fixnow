<script setup lang="ts">
    import Navbar from '../components/Navbar.vue';
    import Footer from '../components/Footer.vue';
</script>
<template>
    <Navbar/>
    <div class="about-container">
        <h1>Sobre</h1>
    </div>
    <Footer/>
</template>
<style scoped>
    .about-container{
    margin-top: 80px; 
    min-height: 70vh; 
    padding: 2rem;
}
</style>
<script setup lang="ts">
    import Navbar from '../components/Navbar.vue';
    import Footer from '../components/Footer.vue';
    import { Lightbulb, Users, Star } from 'lucide-vue-next';
</script>
<template>
    <Navbar/>
    <div class="about-container">
        <div class="content-wrapper">
            <section class="hero-section">
                <h1>Sobre o FixNow </h1>
                <p class="lead">
                    O FixNow é uma aplicação web que facilita o agendamento de serviços de manutenção e reparo,
                    conectando clientes a prestadores de serviço qualificados.
                </p>
            </section>

            <div class="info-grid">
                <div class="info-card">
                    <div class="icon">
                        <Lightbulb :size="48" color="#f39c12" />
                    </div>
                    <h3>Objetivo</h3>
                    <p>
                        Desenvolver uma plataforma moderna, segura e eficiente para o agendamento e gerenciamento
                        de serviços técnicos, agilizando a interação entre clientes e prestadores.
                    </p>
                </div>

                <div class="info-card">
                    <div class="icon">
                        <Users :size="48" color="#3498db" />
                    </div>
                    <h3>Público-Alvo</h3>
                    <p>
                        Clientes que buscam facilidade na contratação de serviços e prestadores de serviço
                        (eletricistas, encanadores, etc.) que desejam maior visibilidade e organização.
                    </p>
                </div>

                <div class="info-card">
                    <div class="icon">
                        <Star :size="48" color="#f1c40f" />
                    </div>
                    <h3>Impacto</h3>
                    <p>
                        Otimizar processos de solicitação, melhorar a comunicação e promover visibilidade
                        para profissionais autônomos no mercado.
                    </p>
                </div>
            </div>

            <section class="team-section">
                <h2> Nossa Equipe</h2>
                <div class="team-grid">
                    <div class="team-member">
                        <div class="avatar">FN</div>
                        <div class="details">
                            <h4>Francisca Tatiely de Lima Nobre</h4>
                            <span>Fullstack Developer</span>
                        </div>
                    </div>
                    <div class="team-member">
                        <div class="avatar">KS</div>
                        <div class="details">
                            <h4>Kaio Davidson Santos Sampaio</h4>
                            <span>Fullstack Developer</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
    <Footer/>
</template>
<style scoped>
    .about-container{
        margin-top: 80px; 
        min-height: 70vh; 
        padding: 2rem;
        display: flex;
        justify-content: center;
    }
    
    .content-wrapper {
        max-width: 1200px;
        width: 100%;
    }
    .hero-section {
        text-align: center;
    }
    .hero-section h1 {
        font-size: 2.5rem;
        color: #2e7d32;
        margin-bottom: 1rem;
    }
    .lead {
        font-size: 1.2rem;
        color: #6c757d;
        max-width: 800px;
        margin: 0 auto;
    }
    .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-bottom: 4rem;
    }
    .info-card {
        background: white;
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        text-align: center;
        transition: transform 0.3s ease;
    }
    .info-card:hover {
        transform: translateY(-5px);
    }
    .icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }
    .info-card h3 {
        color: #2c3e50;
        margin-bottom: 1rem;
    }
    .info-card p {
        color: #6c757d;
        line-height: 1.6;
    }
    .team-section {
        text-align: center;
    }
    .team-section h2 {
        color: #2c3e50;
        margin-bottom: 2rem;
    }
    .team-grid {
        display: flex;
        justify-content: center;
        gap: 2rem;
        flex-wrap: wrap;
    }
    .team-member {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        display: flex;
        align-items: center;
        gap: 1rem;
        min-width: 300px;
    }
    .avatar {
        width: 50px;
        height: 50px;
        background-color: #3498db;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 1.2rem;
    }
    .details {
        text-align: left;
    }
    .details h4 {
        margin: 0;
        color: #2c3e50;
    }
    .details span {
        font-size: 0.9rem;
        color: #6c757d;
    }
    @media (max-width: 768px) {
        .hero-section h1 {
            font-size: 2rem;
        }
        .info-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
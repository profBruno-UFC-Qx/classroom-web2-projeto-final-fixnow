import {createRouter, createWebHistory} from 'vue-router';
import RegisterView from '../views/RegisterView.vue';
import LoginView from '../views/LoginView.vue';
import HomeView from '../views/HomeView.vue';
import PerfilView from '../views/PerfilView.vue';
import AboutView from '../views/AboutView.vue';

const routes = [
  
    {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
    {
    path: '/register',
    name: 'Register',
    component: RegisterView,
  },
  {
    path: '/Perfil',
    name: 'Perfil',
    component: PerfilView,
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
  }
];


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;



import {createRouter, createWebHistory} from 'vue-router';
import RegisterView from '../views/RegisterView.vue';
import LoginView from '../views/LoginView.vue';
import HomeView from '../views/HomeView.vue';
import PerfilView from '../views/PerfilView.vue';
import AboutView from '../views/AboutView.vue';
import DetailsView from '../views/DetailsView.vue';
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { requiresAuth: false }
  },
  {
    path: '/perfil',
    name: 'Perfil',
    component: PerfilView,
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: { requiresAuth: false }
  },
  {
    path: '/details/:id',
    name: 'Details',
    component: DetailsView,
    meta: { requiresAuth: false }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/AdminView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('../views/UserListView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/categories',
    name: 'AdminCategories',
    component: () => import('../views/CategoriesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/appointments',
    name: 'Appointments',
    component: () => import('../views/AppointmentsView.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});


// Guard de proteção de rotas
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.meta.requiresAuth;

  if (requiresAuth && !authStore.isLoggedIn) {
    // Rota protegida e usuário não autenticado
    console.warn(`Acesso negado a ${to.path}. Redirecionando para login.`);
    next('/login');
  } else if ((to.name === 'Login' || to.name === 'Register') && authStore.isLoggedIn) {
    // Usuário já logado tentando acessar login/register
    next('/');
  } else if (to.name === 'Admin' || to.name === 'AdminUsers' || to.name === 'AdminCategories') {
    // Validar se é admin
    if (authStore.user?.role !== 'ADMIN') {
      console.warn(`Acesso negado a ${to.path}. Apenas admins podem acessar.`);
      next('/');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;



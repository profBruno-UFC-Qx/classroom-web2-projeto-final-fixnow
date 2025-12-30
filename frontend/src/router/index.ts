import {createRouter, createWebHistory} from 'vue-router';
import RegisterView from '../views/RegisterView.vue';
import LoginView from '../views/LoginView.vue';
import UserListView from '../views/UserListView.vue';

const routes = [
    /*
    {
    path: '/',
    name: 'List',
    component: UserListView,
  },*/
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
    {
    path: '/',
    name: 'Register',
    component: RegisterView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;



import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Landing from '../views/Landing.vue';
import Admin from '../views/Admin.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin
    },
    {
      path: '/propuesta',
      name: 'propuesta',
      component: Landing
    }
  ]
});

export default router;

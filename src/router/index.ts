import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Home from '../pages/Home.vue';
import Payments from '../pages/Payments.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/payments',
    name: 'Payments',
    component: Payments
  },
  // Redirect any unknown routes to home
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  // Using hash mode for better compatibility with Tauri
  history: createWebHashHistory(),
  routes
});

export default router; 
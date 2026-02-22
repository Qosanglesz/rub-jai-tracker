import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import LoginView from '../views/auth/LoginView.vue';
import RegisterView from '../views/auth/RegisterView.vue';
import ForgotPasswordView from '../views/auth/ForgotPasswordView.vue';
import ProfileView from '../views/profile/ProfileView.vue';

const DashboardView = () => import('../views/DashboardView.vue');
const TransactionsView = () => import('../views/TransactionsView.vue');
const GoalsView = () => import('../views/GoalsView.vue');
const CategoriesView = () => import('../views/CategoriesView.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { guest: true },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordView,
      meta: { guest: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: TransactionsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/goals',
      name: 'goals',
      component: GoalsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/categories',
      name: 'categories',
      component: CategoriesView,
      meta: { requiresAuth: true },
    },
  ],
});

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // Wait to see if we have checked auth on mount yet
  if (!authStore.isAuthenticated && authStore.loading === false) {
    // If we're not authenticated natively, try checking the server once
    // because cookies might be valid
    await authStore.checkAuth();
  }

  const isAuth = authStore.isAuthenticated;

  // If route requires auth and user is NOT authenticated
  if (to.meta.requiresAuth && !isAuth) {
    next('/login');
  } 
  // If route is for guests (login/register) and user IS authenticated
  else if (to.meta.guest && isAuth) {
    next('/dashboard');
  } 
  else {
    next();
  }
});

export default router;

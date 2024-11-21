import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/components/HomePage.vue';
import JournalEntries from '@/components/JournalEntries.vue';
import JournalEntry from '@/components/JournalEntry.vue';
import EditorPage from '@/components/EditorPage.vue';
import LoginPage from '@/components/LoginPage.vue';
import LogoutPage from '@/components/LogoutPage.vue';
import CreateUser from '@/components/CreateUser.vue';
import LandingPage from '@/components/LandingPage.vue';

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: LandingPage,
    meta: { requiresAuth: false, guest: true }
  },
  {
    path: '/entries',
    name: 'JournalEntries',
    component: JournalEntries,
    meta: { requiresAuth: true }
  },
  {
    path: '/home',
    name: 'HomePage',
    component: HomePage,
    meta: { requiresAuth: false }
  },
  {
    path: '/entries/:id',
    name: 'JournalEntry',
    component: JournalEntry,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/editor',
    name: 'EditorPage',
    component: EditorPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage,
    meta: { guest: true }
  },
  {
    path: '/logout',
    name: 'LogoutPage',
    component: LogoutPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/create-user',
    name: 'CreateUser',
    component: CreateUser,
    meta: { requiresAuth: false }  },
  {
    path: '/:catchAll(.*)',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// ナビゲーションガードの設定
// ☆
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');
  
  if (to.name === 'Landing' || to.name === 'HomePage') {
    return next(); // Proceed without checking for auth
  }

  if (to.name === 'LoginPage' && isAuthenticated) { // Updated here
    next('/logout');
  } else if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login');
  } else if (to.matched.some(record => record.meta.guest) && isAuthenticated) {
    next('/');
  } else if (to.matched.some(record => record.meta.guest) && to.name === 'Landing') {
    next('/');
  } else {
    next();
  }
});

export default router;

/**
 * Vue Router configuration with deep-link guard
 */

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/features/secret/secret_feature.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/features/settings/settings_feature.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**
 * Global navigation guard
 * Can be extended for authentication checks, app lock validation, etc.
 */
router.beforeEach((to, _from, next) => {
  // Deep-link validation
  // In a desktop app, we can receive deep links (ots://...)
  // Validate and sanitize them here

  // Future: Check if app is locked
  // Future: Check authentication if route requires it

  if (to.meta.requiresAuth) {
    // TODO: Implement auth check
    console.warn('Route requires auth, but auth is not yet implemented');
  }

  next();
});

export default router;

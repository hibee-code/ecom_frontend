import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/EcomLayout.vue'),
    children: [
      { path: '', component: () => import('pages/ProductsPage.vue') },
    ],
  },
  {
    path: '/details',
    component: () => import('layouts/EcomLayout.vue'),
    children: [
      { path: '', component: () => import('pages/ProductDetails.vue') },
    ],
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: 'signin', component: () => import('pages/SigninPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

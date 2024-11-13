import { createRouter, createWebHistory } from 'vue-router'
import config from '@/config/master.js'

// const router = createRouter({
//   history:  (import.meta.env.BASE_URL),
//   routes: [
//     {
//       path: '/',
//       name: 'home',
//       component: HomePage,
//     },
//     {
//       path: '/about',
//       name: 'about',
//       // route level code-splitting
//       // this generates a separate chunk (About.[hash].js) for this route
//       // which is lazy-loaded when the route is visited.
//       component: () => import('../views/AboutView.vue'),
//     },
//   ],
// })


const routes = [
  {
    path: '/',
    name: 'index',
    redirect: '/login',
    meta: { title: 'Index', roles: ['root'] }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/login-page.vue'),
    meta: { title: 'Login', roles: ['root'], loginPage: true }
  },
  {
    path: '/api/docs',
    name: 'api-docs-public',
    component: () => import(/* webpackChunkName: "api-docs-public" */ '../views/dashboard/api-docs.vue'),
    meta: { title: 'Documentation', roles: [] }
  },
  {
    path: '/dashboard',
    // redirect: '/login',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/layouts/dashboard/DashboardLayout.vue'),
    meta: { roles: ['root'] },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/dashboard/home-page.vue'),
        meta: { title: 'Home', roles: ['root'] }
      },
      {
        path: 'api-docs',
        name: 'api-docs',
        component: () => import(/* webpackChunkName: "api-docs" */ '@/views/dashboard/api-docs.vue'),
        meta: { title: 'Documentation', roles: ['root'] }
      },
      // {
      //   path: 'endpoints',
      //   name: 'endpoints',
      //   component: () => import(/* webpackChunkName: "endpoints" */ '@/views/dashboard/endpoints.vue'),
      //   meta: { title: 'Endpoints', roles: ['admin'] }
      // },
      // {
      //   path: 'endpoint/:id',
      //   name: 'view-endpoint',
      //   component: () => import(/* webpackChunkName: "view-endpoint" */ '@/views/dashboard/view-endpoint.vue'),
      //   meta: { title: 'Endpoint', roles: ['root'] }
      // }
    ]
  },
  {
    path: '/404',
    name: 'not-found',
    meta: { title: 'Resource not found' },
    component: () => import(/* webpackChunkName: "404" */ '@/views/not-found.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history:  createWebHistory(config.BASE_URL),
  routes: routes
})

// const handleLoginPageAccess = (to, from, next) => {
//   return next(true);

//   // Handle login page access
//   const isLoggedIn = store.getters['user/isLoggedIn'];
//   // If user is logged in and trying the access the login page
//   if (isLoggedIn) {
//     const isAllowedToAccess = store.getters['user/isAdmin'];
//     if (isAllowedToAccess) {
//       return next({ name: 'home' });
//     } else {
//       // TODO: Send logged in users with incorrect permissions to a 404 page (so they don't know that this route exists)?
//       return next({ name: 'login' });
//     }
//   } else {
//     return next(true);
//   }
// };

router.beforeEach((to, from, next) => {
  // Handle page title
  document.title = to.meta.title ? `Dashboard | ${to.meta.title}` : 'Unnamed';

  return next();

  // // Handle login page access
  // if (to.meta.loginPage) {
  //   return handleLoginPageAccess(to, from, next);
  // }

  // const isLoggedIn = store.getters['user/isLoggedIn'];
  // // User is logged in
  // if (isLoggedIn) {
  //   const decodedToken = store.getters['user/getDecodedToken'];
  //   const loggedInUserRoles = decodedToken.roles;

  //   // Check that the user has a correct role/permissions for this route
  //   const hasAllowedRole = to.matched.some((record) => {
  //     if (record.meta.roles && record.meta.roles.length > 0) {
  //       return record.meta.roles.some((role) => loggedInUserRoles.includes(role));
  //       // return userConstants.admin.roles.some((role) => loggedInUserRoles.includes(role));
  //     } else {
  //       return true;
  //     }
  //   });

  //   // Authorization success
  //   if (hasAllowedRole) {
  //     return next();

  //   // Authorization failure
  //   } else {
  //     // TODO: Redirect to a 404 page instead of login page so user can't know that this route even exist?
  //     return next({ name: 'not-found' });
  //   }

  // // User is not logged in
  // } else {
  //   return next({ name: 'login' });
  // }
});

export default router

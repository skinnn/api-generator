import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'index',
		redirect: '/login',
		meta: { title: 'Index' }
	},
	{
		path: '/login',
		name: 'login',
		component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
		meta: { title: 'Login' }
	},
	{
		path: '/dashboard',
		// redirect: '/login',
		// this generates a separate chunk (dashboard.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "dashboard" */ '@/components/dashboard/DashboardLayout.vue'),
		meta: { },
		children: [
			// Home page
			{
				path: '',
				name: 'home',
				component: () => import(/* webpackChunkName: "home" */ '@/views/dashboard/home.vue'),
				meta: { title: 'Home' }
			},
			{
				path: 'api-docs',
				name: 'api-docs',
				component: () => import(/* webpackChunkName: "api-docs" */ '@/views/dashboard/api-docs.vue'),
				meta: { title: 'API Documentation' }
			},
			{
				path: 'endpoints',
				name: 'endpoints',
				component: () => import(/* webpackChunkName: "endpoints" */ '@/views/dashboard/endpoints.vue'),
				meta: { title: 'Endpoints' }
			},
			{
				path: 'endpoint/:id',
				name: 'view-endpoint',
				component: () => import(/* webpackChunkName: "view-endpoint" */ '@/views/dashboard/view-endpoint.vue'),
				meta: { title: 'Endpoint' }
			}
		]
	}
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

// If user is navigating to login page and is already logged in, stop navigation
router.beforeEach((to, from, next) => {
	if (to.name === 'login' || to.path === '/login') {
		const isLoggedIn = store.getters['user/isLoggedIn'];
		if (isLoggedIn) {
			return next(false);
		} else {
			return next(true);
		}
	} else {
		return next(true);
	}
});

export default router;

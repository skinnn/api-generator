import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
	{
		path: '/login',
		name: 'login',
		component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
		meta: { title: 'Login' }
	},
	{
		path: '/dashboard',
		// redirect: '/login',
		// this generates a separate chunk (admin-dashboard.[hash].js) for this route
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
			}
		]
	}
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

export default router;

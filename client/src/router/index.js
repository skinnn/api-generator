import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
// import userConstants from '@/constants/user.js';

Vue.use(VueRouter);

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
		component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
		meta: { title: 'Login', roles: ['root'], loginPage: true }
	},
	{
		path: '/dashboard',
		// redirect: '/login',
		// this generates a separate chunk (dashboard.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "dashboard" */ '@/components/dashboard/DashboardLayout.vue'),
		meta: { roles: ['root'] },
		children: [
			// Home page
			{
				path: '',
				name: 'home',
				component: () => import(/* webpackChunkName: "home" */ '@/views/dashboard/home.vue'),
				meta: { title: 'Home', roles: ['root'] }
			},
			{
				path: 'api-docs',
				name: 'api-docs',
				component: () => import(/* webpackChunkName: "api-docs" */ '@/views/dashboard/api-docs.vue'),
				meta: { title: 'API Documentation', roles: ['root'] }
			},
			{
				path: 'endpoints',
				name: 'endpoints',
				component: () => import(/* webpackChunkName: "endpoints" */ '@/views/dashboard/endpoints.vue'),
				meta: { title: 'Endpoints', roles: ['admin'] }
			},
			{
				path: 'endpoint/:id',
				name: 'view-endpoint',
				component: () => import(/* webpackChunkName: "view-endpoint" */ '@/views/dashboard/view-endpoint.vue'),
				meta: { title: 'Endpoint', roles: ['root'] }
			}
		]
	},
	/* 404 */
	{
		path: '/404',
		name: 'not-found',
		meta: { title: 'Resource not found' },
		component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue')
	},
	{
		path: '*',
		redirect: '/404'
	}
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

const handleLoginPageAccess = (to, from, next) => {
	// Handle login page access
	const isLoggedIn = store.getters['user/isLoggedIn'];
	// If user is logged in and trying the access the login page
	if (isLoggedIn) {
		const isAllowedToAccess = store.getters['user/isAdmin'];
		if (isAllowedToAccess) {
			return next({ name: 'home' });
		} else {
			console.log('ELSE');
			// TODO: Send logged in users with incorrect permissions to a 404 page (so they don't know that this route exists)?
			return next(false); // { name: 'login' }
		}
	} else {
		return next(true);
	}
};

router.beforeEach((to, from, next) => {
	// Handle page title
	document.title = to.meta.title ? `Dashboard | ${to.meta.title}` : 'Unnamed';

	// Handle login page access
	if (to.meta.loginPage) {
		return handleLoginPageAccess(to, from, next);
	}

	const isLoggedIn = store.getters['user/isLoggedIn'];
	// User is logged in
	if (isLoggedIn) {
		const decodedToken = store.getters['user/getDecodedToken'];
		const loggedInUserRoles = decodedToken.roles;

		console.log('loggedInUserRoles:', loggedInUserRoles);
		// Check that the user has a correct role/permissions for this route
		const hasAllowedRole = to.matched.some((record) => {
			if (record.meta.roles && record.meta.roles.length > 0) {
				return record.meta.roles.some((role) => loggedInUserRoles.includes(role));
			} else {
				return true;
			}
			// return userConstants.admin.roles.some((role) => loggedInUserRoles.includes(role));
		});

		// Authorization success
		if (hasAllowedRole) {
			return next();

		// Authorization failure
		} else {
			// TODO: Redirect to a 404 page instead of login page so user can't know that this route even exist?
			return next({ name: 'not-found' });
		}

	// User is not logged in
	} else {
		return next({ name: 'login' });
	}
});

export default router;

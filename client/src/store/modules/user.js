import { decodeJWT } from '@/lib/helpers.js';
import userConstants from '@/constants/user.js';

const state = {
	// user: localStorage.getItem('user') ? localStorage.getItem('user') : null,
	token: localStorage.getItem('token') ? localStorage.getItem('token') : null
};

const mutations = {
	// SET_USER(state, user) {
	// 	localStorage.setItem('user', user);
	// 	state.user = user;
	// },
	SET_TOKEN(state, token) {
		localStorage.setItem('token', token);
		state.token = token;
	}
};

const actions = {
	login({ commit }, { token }) {
		// commit('SET_USER', userId);
		commit('SET_TOKEN', token);
	},
	logout({ commit }) {
		// commit('SET_USER', '');
		commit('SET_TOKEN', null);
		localStorage.removeItem('token');
	},
	setToken({ commit }, token) {
		localStorage.setItem('token', JSON.stringify(token));
		commit('SET_TOKEN', token);
	}
};

const getters = {
	isLoggedIn(state) {
		return typeof state.token === 'string' && state.token.length > 10;
	},
	getDecodedToken(state) {
		if (state.token) {
			return decodeJWT(state.token);
		} else {
			return state.token;
		}
	},
	isAdmin(state) {
		const loggedInUser = decodeJWT(state.token);
		if (state.token && loggedInUser) {
			const roles = loggedInUser.roles || null;
			return roles.some((role) => userConstants.admin.roles.includes(role));
		} else {
			return false;
		}
	}
};

export default {
	namespaced: true,

	state,
	mutations,
	actions,
	getters
};

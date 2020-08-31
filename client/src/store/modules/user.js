const state = {
	user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
	token: localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null
};

const mutations = {
	SET_USER(state, user) {
		state.user = user;
	},
	SET_TOKEN(state, token) {
		state.token = token;
	}
};

const actions = {
	loginUser({ commit }, { userId, token }) {
		localStorage.setItem('user', JSON.stringify(userId));
		commit('SET_USER', userId);
		// dispatch('setToken', token);
	},
	setToken({ commit }, token) {
		console.log('SET TOKEN');
		localStorage.setItem('token', JSON.stringify(token));
		commit('SET_TOKEN', token);
	}
};

const getters = {
};

export default {
	namespaced: true,

	state,
	mutations,
	actions,
	getters
};
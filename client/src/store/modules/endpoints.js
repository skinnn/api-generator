const state = {
	endpoints: []
};

const mutations = {
	SET_ENDPOINTS(state, endpoints) {
		state.endpoints = endpoints;
	}
};

const actions = {
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
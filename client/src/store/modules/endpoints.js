const state = {
	endpoints: []
};

const mutations = {
	SET_ENDPOINTS(state, endpoints) {
		state.endpoints = endpoints;
	},
	ADD_ENDPOINT(state, endpoint) {
		state.endpoints.push(endpoint);
	},
	REMOVE_ENDPOINT(state, id) {
		state.endpoints.forEach((endp, index) => {
			if (id === endp._id) state.endpoints.splice(index, 1);
		});
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
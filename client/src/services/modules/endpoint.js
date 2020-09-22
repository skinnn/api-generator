import Api from '../Api';

export default {
	createEndpoint(endpoint) {
		const config = { headers: { 'Content-Type': 'application/json' } };
		return Api().post('/endpoint', endpoint, config);
	},
	getEndpoints() {
		return Api().get('/endpoint');
	}
};
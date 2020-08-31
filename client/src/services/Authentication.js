import Api from './Api';

export default {

	login(data) {
		const config = { headers: { 'Content-Type': 'application/json' } };
		return Api().post('/login', data, config);
	}
};
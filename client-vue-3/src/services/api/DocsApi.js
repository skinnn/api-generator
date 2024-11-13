import Api from './Api';

export default {
	getVisbilityStatus() {
		return Api().get('/docs/status');
	}
};

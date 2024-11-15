import axios from 'axios';
import config from '@/config/master.js';

/**
 * Axios instance used for sending all requests to the API
 */

export default () => {
	const options = {
		baseURL: config.API_BASE_URL,
		crossDomain: true
	};

	const token = localStorage.getItem('token');
	if (token) {
		options.headers = {
			Authorization: `Bearer ${token}`
		};
	}

	const instance = axios.create(options);

	return instance;
};

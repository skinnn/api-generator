const env = process.env;

export default {
	appName: 'API Generator',
	node_env: env.NODE_ENV,
	api: {
		base_url: env.VUE_APP_API_BASE_URL
	}
};

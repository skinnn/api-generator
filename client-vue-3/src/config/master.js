const env = import.meta.env

export default {
	appName: 'API Generator',
	node_env: env.MODE,
  BASE_URL: env.BASE_URL,
  API_BASE_URL: env.VITE_API_BASE_URL
};

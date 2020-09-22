const files = require.context('./modules', false, /\.js$/);
const services = {};

files.keys().forEach((key) => {
	if (key === './index.js' || key === './Api.js') return;
	services[key.replace(/(\.\/|\.js)/g, '')] = files(key).default;
});

export default services;
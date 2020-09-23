import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import services from './services';
import config from '@/config/master';
// Plugins
import 'bootstrap/dist/css/bootstrap.min.css';

Vue.config.productionTip = false;
// Register services globally, all services are available in $http
Vue.prototype.$http = services;
Vue.prototype.$config = config;

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');

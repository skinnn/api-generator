import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import services from './services';
// Plugins
import 'bootstrap/dist/css/bootstrap.min.css';

Vue.config.productionTip = false;
// Register services globally, all services are available in $http
Vue.prototype.$http = services;

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');

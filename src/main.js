import Vue from 'vue';
import App from './App.vue';
import i18n from './translations';
import utils from './services/utilities';
import resources from './resources/resources';
import VueScreenSize from 'vue-screen-size';
// import Rollbar from 'vue-rollbar';
import {extend} from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';

import router from './router';
import store from './store';

// Buefy
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';

// CSS custom styles
import './styles/main.scss';

// Install Buefy components and set font awesome as default icon pack
Vue.use(Buefy, {
	defaultIconPack: 'fas'
});

// VueScreenSize
Vue.use(VueScreenSize);

// cookie handler
Vue.use(require('vue-cookies'));

Vue.use(utils);
Vue.use(resources);


// global components
Vue.component('layout-main', require('./components/layouts/Main').default);
Vue.component('layout-edit', require('./components/layouts/Edit').default);
Vue.component('pagination', require('./components/Pagination').default);

// Vue.use(Rollbar, {
// 	accessToken: '787cecf68d9541fb985db974fe7439fa',
// 	captureUncaught: true,
// 	captureUnhandledRejections: true,
// 	payload: {
// 		environment: process.env.NODE_ENV === 'production' ? 'production' : 'dev'
// 	}
// });

// Install all vee-validate rules
Object.keys(rules).forEach(rule => {
	extend(rule, rules[rule]);
});

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	i18n,
	render: h => h(App)
}).$mount('#app');
